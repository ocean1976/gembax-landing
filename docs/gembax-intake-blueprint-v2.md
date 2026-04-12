# GembaX Intake Sistemi — Master Blueprint v2.0
**Tarih:** 2026-04-04  
**Proje:** gembax_dev  
**Durum:** Mutabakat tamamlandı — implementasyona hazır  
**Önceki versiyon:** v1.0 → v2.0 (9 çözüm + mimari kararlar entegre edildi)

---

## 1. SİSTEM ÖZETİ

GembaX müşteri intake süreci, 2 dokunuşluk bir yapıda çalışır. Müşteri toplam ~45 dk efor harcar (15 dk Form 1 + 30 dk chat session). Aradaki araştırma ve hazırlık Murat tarafından yapılır. Tüm orkestrasyon n8n ile, chat session ayrı FastAPI servisi ile yönetilir.

### Akış Özeti

```
Dokunuş 1 → gembax.ai/analiz (scripted chat + Haiku AI + ödeme + profil) — ~15 dk
          → Cal.com randevu seçimi (aynı oturumda, 2+ gün sonrası)
Murat     → Araştırma protokolü + hipotez + soru hazırlama — Perplexity/Statista ile
          → Notion'da müşteri dosyası + session config
Bekleme   → Randevudan 1 gün önce "araştırmanız tamamlandı" e-postası
Dokunuş 2 → gembax.ai/sohbet (Opus 4.6 chat session, streaming) — ~30 dk
Paralel   → Stakeholder Excel doğrulama + Google Drive veri talebi
Rapor     → Structured extraction → Hidden Cost Report üretimi (Opus 4.6)
```

---

## 2. DOKUNUŞ 1 — gembax.ai/analiz (~15 dk)

### 2.1 Chat Yapısı

Statik sorular chat tarzında ilerler. Her cevaptan sonra LLM (Haiku 4.5) araya girebilir:
- Soruya özel yorum yapabilir ("İlginç, ihracat oranınız yüksek — lojistikte baskı yaratıyor olabilir")
- Cevabın derinliğini beğenmezse probe sorar
- Bazı sorular çoktan seçmeli (pill, multi-select)
- Müşteri şirket adını verince → web araştırma → teyit sorusu

### 2.2 Arka Plan AI (Haiku 4.5 + Google Custom Search)

- Müşteri şirket adını verince → Google Custom Search → web sitesini fetch → teyit: "ABC Makina — abcmakina.com.tr, CNC tezgah üretimi, 2008'den beri. Bu siz, doğru mu?"
- Serbest metin cevaplarda derinlik kontrolü:
  - **Yeterli** → Spesifik, detay içeriyor → devam et + kısa yorum
  - **Yüzeysel** → Tek kelime veya jenerik ("kalite", "müşteri memnuniyeti") → probe sor
  - **Boş/kaçamak** → "Bilmiyorum" → kabul et, DSS düşür, not al
- Maksimum 2-3 probe (ödeme öncesi, fazla zorlama yok)
- n8n webhook üzerinden orkestre edilir
- **Hata yönetimi:** Haiku timeout (>4 sn) → scripted fallback cümlesi göster, sonraki soruya geç

### 2.3 Soru Akışı (15 sohbet + 6 iletişim/ödeme)

| # | Kod | Soru | Format | LLM Rolü |
|---|-----|------|--------|----------|
| 0 | — | Karşılama + Ad & Şirket | Metin | → Haiku: web araştırma tetikle |
| 1 | — | Şirket adı (eksikse) | Metin | — |
| 2 | B1 | Sektör | Pill | Haiku: sektöre özel yorum |
| 3 | — | Çalışan sayısı | Pill | — |
| 4 | — | Yıllık ciro aralığı | Pill | — |
| 5 | C1 | Müşteri problemi | Serbest metin | **Haiku: derinlik kontrolü + probe** |
| 6 | C2 | Müşteri öncelikleri (top 3) | Multi-3 | Haiku: yorum |
| 7 | C3 | Rekabet avantajı | Serbest metin | **Haiku: derinlik kontrolü + probe** |
| 8 | C4 | Value gap | Serbest metin | Haiku: derinlik kontrolü |
| 9 | D1 | Org öncelik | Pill | Haiku: önceliğe özel yorum |
| 10 | D2 | Tetikleyici | Serbest metin | **Haiku: derinlik kontrolü + probe** |
| 11 | D3 | 12 ay testi | Serbest metin | Haiku: yorum |
| 12 | D4 | Geçmiş denemeler | Pill+Metin | — |
| 13 | C5 | Kaybedilen müşteri | Pill+Metin | Haiku: yorum |
| 14 | B6 | Odak value stream | Serbest metin | — |
| 15 | — | SENTEZ + GEÇİŞ | Otomatik | **Haiku: somut sinyal göster** |
| 16 | — | E-posta | Metin | — |
| 17 | — | Telefon | Metin (ops.) | — |
| 18 | — | Pozisyon | Metin | — |
| 19 | — | Paket seçimi | 2 kart ($550/$1,100) | — |
| 20 | — | NDA onayı | Checkbox | — |
| 21 | — | Ödemeye geç | Buton → Paddle | — |

### 2.4 Sentez → Ödeme Geçişi (Çözüm #1)

Sentez adımında (S15) Haiku somut sinyal gösterir:

```
"{{name}}, şimdiden 2 güçlü sinyal görüyorum:

• {{sector}} sektöründe {{org_priority}} önceliğinizle 
  {{value_gap}} arasında bir gerilim var
• {{trigger}} tetikleyicisi, {{12_month_test}} ile birleşince 
  acil bir tablo çiziyor

Bunları derinleştirmek ve dolar cinsinden hesaplamak istiyorsanız, 
bir sonraki adıma geçelim."
```

Bu framing ödemeyi "başlamak için" değil **"devam etmek için"** konumlar. Analiz zaten başlamış hissi verir.

### 2.5 Ödeme

Paddle ödeme başarılı → iki katmanlı doğrulama (Çözüm #3 — Kırılma):
- **Frontend:** Paddle success callback → hemen "Ödemeniz alındı" sayfası + profil formuna yönlendir
- **Backend:** n8n Paddle webhook → Notion'da müşteri sayfası oluştur
- **Failsafe:** Webhook gelmezse → n8n 15 dk cron → Paddle API'den son ödemeleri kontrol et

### 2.6 Form 1++ — Profil (gembax.ai/profil) — 2 KATMANLI (Çözüm #2)

**Katman 1 — Zorunlu (~2 dk):** Chat session için kritik veriler

| # | Soru | Format | Not |
|---|------|--------|-----|
| 7 | Operasyon sorumlusu ad+ünvan | Metin | **ZORUNLU** |
| 8 | Operasyon sorumlusu e-posta | Metin | **ZORUNLU** |
| 9 | Finans sorumlusu ad+ünvan | Metin | $1,100 zorunlu |
| 10 | Finans sorumlusu e-posta | Metin | $1,100 zorunlu |
| 11 | Saha sorumlusu ad+ünvan | Metin (ops.) | $1,100 opsiyonel |
| 12 | Saha sorumlusu e-posta | Metin (ops.) | $1,100 opsiyonel |
| 14 | Kullanılan sistemler | Multi | Veri olgunluğu |
| 17 | Teknik aşinalık | Pill | Form 2 dili |

**Katman 2 — Opsiyonel (~3 dk):** "Ne kadar çok doldurursanız analiz o kadar keskin olur" mesajıyla

| # | Soru | Format | Not |
|---|------|--------|-----|
| 1 | Kuruluş yılı | Sayı | Olgunluk |
| 2 | Ürün/hizmet çeşitliliği | Pill | Karmaşıklık |
| 3 | Lokasyon sayısı | Pill | Taşıma israfı |
| 4 | İhracat payı | Pill | Lojistik+compliance |
| 5 | Büyüme trendi (son 2 yıl) | Pill | Problem tipi |
| 6 | Son 12 ay büyük değişiklik | Multi | Tetikleyici doğrulama |
| 13 | Raporu kimler okuyacak? | Metin | Ton ve derinlik |
| 15 | Düzenli takip edilen metrikler | Multi | Ne sormaya gerek yok |
| 16 | Tedarikçi sayısı | Pill | SC israfı |
| 18 | Problem detayı (açık) | Uzun metin | Form 2 odağı |
| 19 | Tahmini yıllık etki | Pill+metin | Beklenti yönetimi |

**Stakeholder kuralları:**
- $550: min 1 kişi (operasyon sorumlusu) zorunlu
- $1,100: min 2 kişi (operasyon + finans) zorunlu

### 2.7 Takvim — Aynı Sayfada (Çözüm #3)

Form 1++ "Gönder" butonuna basınca → **aynı sayfada** teşekkür ekranı + Cal.com embed:

```
"Profil bilgileriniz alındı ✓

Şimdi teşhis sohbetiniz için randevu seçin.
30 dakikalık bu sohbette, şirketinize özel hazırladığımız 
sorularla operasyonel teşhise başlayacağız."

[Cal.com embed — slot seçici]
```

Müşteri ayrı e-posta açmasına gerek kalmadan aynı oturumda her şeyi bitirir.
Cal.com → Google Calendar sync (Murat'ın takvimi) + otomatik onay e-postası.

### 2.8 İlk DSS Hesaplama (Çözüm #6 — Aşama 1)

Form 1 + 1++ tamamlandıktan sonra n8n kural bazlı otomatik DSS hesaplar:

```
DSS BAŞLANGIÇ = 100

Form 1 cezaları:
  Ciro reddedildi → -15
  C1 (problem) generic/boş → -10
  C2 (öncelikler) eksik → -5
  C4 (value gap) boş → -3
  C5 (kaybedilen müşteri) boş → -3
  D1 (org öncelik) cevaplanmadı → -10

Form 1++ cezaları:
  Katman 2 tamamen boş → -5
  Sistemler boş → -5
  Problem detayı boş → -3

Haiku derinlik probe sonuçları:
  Probe sonrası veri geldi → cezanın yarısını geri al
  Probe sonrası hâlâ yetersiz → tam ceza kalır
```

İlk DSS skoru Notion müşteri sayfasına yazılır. Murat araştırma yaparken referans alır.

---

## 3. BEKLEMEDEKİ MÜŞTERIYLE İLETİŞİM (Çözüm #4)

Dokunuş 1 ile Dokunuş 2 arasında 2+ gün var. Müşteri sessizliğe düşmemeli.

**Randevudan 1 gün önce — n8n otomatik e-posta:**

```
Konu: Yarınki sohbetiniz için hazırız — {{company}}

Merhaba {{name}},

{{company}} üzerinde ön araştırmamızı tamamladık. 
Sektörünüz, operasyonlarınız ve değer akışınız hakkında 
size özel sorularımız hazır.

Yarın saat {{time}}'da sohbet linkimiz aktif olacak.
Yaklaşık 30 dakika sürecek.

Hazırlık olarak: temel operasyonel verilerinize (stok, 
üretim, satış) genel bir göz atmanız yeterli. 
Kesin rakam beklemiyoruz — tahminler yeterli.

İyi günler,
Murat
GembaX — Operasyonel İsrafın Röntgeni
```

Bu e-posta 3 şey yapar:
1. "Çalışıyorlar" sinyali → güven
2. "Size özel sorular" → merak + premium hissi
3. "Verilerinize göz atın" → müşteri hazırlıklı gelir

---

## 4. ARAŞTIRMA PROTOKOLÜ — MURAT

**Bu GembaX'in gerçek IP'sidir.** Araştırma tamamen Murat tarafından yapılır — Perplexity, Statista ve sektör kaynakları kullanılarak. Otomasyon yok, tam insan muhakemesi.

### 4.1 Araştırma Bölümleri

**A. Şirket**
- Web sitesi: ana sayfa, ürünler, blog, kariyer
- LinkedIn: şirket + sahip + stakeholder profilleri
- Google News / basın
- Şikayetvar / Google Reviews
- Finansal veri (TOBB, KAP, Crunchbase)
- E-ticaret / marketplace kontrolü

**B. Sektör**
- Benchmark'lar (Statista, sektör raporları, GembaX DB)
- Sektör trendleri (son 12 ay)
- Yaygın israf kalıpları (case pattern match)
- Regülasyon / compliance
- Teknoloji olgunluk seviyesi
- Mevsimsellik / döngüsellik

**C. Müşterinin Müşterisi**
- Kim alıyor? B2B/B2C, müşteri konsantrasyonu
- Müşteri beklentisi gerçekte ne?
- Son dönem davranış değişimi
- Şikayet kalıpları
- Switching cost / sadakat

**D. Rakipler**
- Ana 3-5 rakip tespiti
- Farklılaşma analizi
- Fiyat pozisyonu
- Teknoloji / kapasite gap
- Büyüme sinyalleri

**E. Çapraz Doğrulama — EN KRİTİK**
- Ciro tutarlılığı (çalışan × sektör normu)
- Value compass vs web sitesi mesajı
- Büyüme iddiası vs kanıt
- Problem tanımı vs müşteri şikayetleri
- Geçmiş deneme vs LinkedIn
- Stakeholder profilleri vs roller
- Teknoloji iddiası vs gerçeklik

**F. Hipotez Oluşturma**
- Top 3 israf hipotezi (TIM WOODS bağlantılı)
- Her hipotez için doğrulama sorusu
- Her hipotez için stakeholder teyit sorusu
- Veri talebi listesi
- Çelişki / tutarsızlık notları
- Risk / hassasiyet notu

### 4.2 Araştırma Çıktısı (Notion'a yazılır)

1. 3 israf hipotezi
2. 10-15 chat sorusu (LLM/form-dropdown/form-slider sıralaması)
3. Stakeholder soruları (rol-spesifik, teyit formatında)
4. Veri talepleri (Drive klasör linki)
5. Çelişki notları

### 4.3 Murat'ın Dokunuş Noktaları

| Aşama | Murat ne yapıyor |
|-------|-----------------|
| Ödeme geldi | Bildirim alır, müşteriyi tanır |
| Form 1 + 1++ geldi | Verileri inceler |
| **Araştırma + hazırlık** | **ANA DOKUNUŞ** — araştırma, hipotez, sorular, Drive klasörü, session config |
| Chat sonuçları geldi | Analiz, structured data kontrolü, yorumlama |
| Rapor gönderimi | Raporu kontrol et, müşteriye gönder |

---

## 5. DOKUNUŞ 2 — gembax.ai/sohbet (~30 dk)

### 5.1 Genel Yapı

- Model: **Opus 4.6 + Extended Thinking**
- Kişiselleştirilmiş link: `gembax.ai/sohbet?token=<uuid-v4>`
- Token → SQLite'dan session config → system prompt (dinamik, her müşteri için farklı)
- Hybrid akış: %70-80 scripted delivery + %20-30 aktif reasoning
- **Streaming response** — müşteri cevabın yazıldığını görüyor
- GembaX design system'le tutarlı custom chat sayfası

### 5.2 Token Güvenliği (Çözüm — Kırılma #6)

- Token: UUID v4 (tahmin edilemez)
- Link açılınca e-posta doğrulaması: "E-postanızı girin" → Form 1'deki e-posta ile eşleşirse chat başlar
- Tek kullanımlık: session tamamlandıktan sonra token expire olur
- TTL: randevu saatinden 24 saat sonra link ölür

### 5.3 Bağlantı Kopması Yönetimi (Çözüm — Kırılma #1)

- Her turnus sonrası state SQLite'a kaydedilir
- Müşteri aynı token ile geri geldiğinde → "Kaldığınız yerden devam edelim" + resume
- State içeriği: hangi soruda kaldık, tüm cevaplar, DSS skoru, hipotez durumu

### 5.4 Soru Sırası Kontrolü (Çözüm — Kırılma #2)

Soru takibi LLM'e bırakılmaz — **backend kontrol eder:**

```
Backend her turnusta:
1. State'den sıradaki soruyu belirle
2. Opus'a gönder: "Şimdi S09'u sor. Önce müşterinin son cevabına tepki ver."
3. Opus serbest follow-up sorarsa → backend kaydeder ama soru sayacını ilerletmez
4. Opus'un response'unu parse et: [NEXT] / [PROBE] / [FOLLOW-UP] / [FLAG]
5. State güncelle, sonraki turnus hazırla
```

### 5.5 LLM Görevleri

**Scripted (%70-80):**
- Murat'ın hazırladığı soruları doğal sohbet havasında sor
- Cevaplara kısa empatik tepki ver (1-2 cümle)
- Kısa/generic cevaplarda önceden tanımlı probe devreye sok
- Bir sorudan diğerine doğal geçiş yap
- Ara ara mini özet ver

**Reasoning (%20-30):**
- Müşteri cevabından hipotez geliştir / güçlendir / zayıflat
- Yeni sinyal yakaladığında follow-up soru sor
- Tutarlılık kontrolü (önceki cevaplarla çelişki)
- Yeterlilik kontrolü (cevap spesifik mi yüzeysel mi)
- Araştırmadan gelen 3 hipotezi test et

**Reactive (%10 — reasoning içinde):**
- Müşterinin cevabındaki spesifik bir detaya tepki
- Maksimum 1-2 cümle
- Asla tavsiye vermez, asla yargılamaz

### 5.6 Form Blokları — UX (Çözüm #5)

Chat içinde form blokları gelirken Opus geçiş cümlesi kullanır:
- "Bunu netleştirmek için hızlı bir seçim yapalım..."
- "Şimdi somut bir tahmin isteyeceğim..."

Form bloğu görsel olarak **chat bubble'a benzer** — ayrı bir "form alanı" gibi durmamalı.

Blok tipleri:
- **Dropdown:** Onay aşama sayısı, sıklık soruları
- **Slider:** VA/NVA oranı (% bekleme vs % gerçek iş)
- **Multi-select:** Çoklu problem alanları
- **Free text:** Açık uçlu sorular

### 5.7 Chat Süre Kontrolü (Çözüm #7)

System prompt'ta hard limit:

```
SÜRE KONTROLÜ:
- Toplam konuşma 25 soru turnunu GEÇEMEZ
- 20. turnustan sonra serbest follow-up SORMA
- 20. turnus sonrası sadece kalan scripted soruları bitir
- Son soruda kapanış sentezine geç
```

Müşteriye chat başında: "Bu sohbet yaklaşık 30 dakika sürecek."

### 5.8 System Prompt Yapısı (n8n tarafından dinamik oluşturulur)

```
SEN: GembaX operasyonel teşhis uzmanısın.

MÜŞTERİ BİLGİLERİ:
{{form1_data + form1pp_data}}

ARAŞTIRMA BULGULARI:
{{research_notes}}

HİPOTEZLER:
1. {{hypothesis_1}} — TIM WOODS: {{category}} — Sinyal: {{signal}}
2. {{hypothesis_2}} — TIM WOODS: {{category}} — Sinyal: {{signal}}
3. {{hypothesis_3}} — TIM WOODS: {{category}} — Sinyal: {{signal}}

SORULAR (sırayla sor — backend sırayı kontrol eder):
S01 [LLM]: {{question_1}}
S02 [FORM-dropdown]: {{question_2}} → seçenekler: {{options}}
S03 [LLM]: {{question_3}}
...

ARKA PLAN KONTROL (her cevaptan sonra):
- Tutarlılık: önceki cevaplarla çelişki var mı? → [FLAG]
- Yeterlilik: cevap spesifik mi? → yetersizse [PROBE]
- Hipotez: güçlendi/zayıfladı/yeni sinyal → [HYPOTHESIS]
- Eylem: [NEXT] / [PROBE] / [FOLLOW-UP] / [FLAG]

KURALLAR:
- Serbest follow-up: max %20, sadece güçlü sinyal varsa
- Asla tavsiye verme, asla yargılama
- Her tepki max 1-2 cümle
- 25 turnus hard limit, 20 sonrası follow-up yok
- Thinking budget: 500 token altında tut
```

### 5.9 İkinci DSS Hesaplama (Çözüm #6 — Aşama 2)

Chat session sonrası Opus'a DSS hesaplama çağrısı:

```
DSS GÜNCELLEMELERİ (chat session):

Operasyonel cezalar:
  Her TIM WOODS sorusu "bilmiyorum" (probe sonrası) → -10
  Her derinleştirme sorusu "bilmiyorum" (probe sonrası) → -5

Kurtarma:
  Probe ile veri geldi → cezanın yarısını geri al
  Detaylı cevap (spesifik rakamlar) → +3 (max 5 kez)

Hipotez durumu:
  Hipotez güçlü doğrulandı → +5
  Hipotez zayıf/belirsiz → 0
  Hipotez çürütüldü → -3 (yeni hipotez gerekebilir)
```

Final DSS → Rapor modu:

| DSS | Mod | Rapor Dili |
|-----|-----|-----------|
| 70-100 | 🟢 Full Analysis | "Verilerinize göre..." |
| 40-69 | 🟡 Directional | "Tahminimize göre, yaklaşık..." |
| 0-39 | 🔴 Pre-Assessment | "Ön sinyallerimiz..." |

### 5.10 Kapanış + Structured Data Extraction (Çözüm #8)

**Kapanış sentezi (müşteriye gösterilir):**

```
"{{name}}, teşekkürler. {{company}}'nin operasyonel resmini görüyorum.

Şimdiden gördüğüm sinyaller:
• [1-2 en güçlü sinyal, $ tahmini olmadan]

Hidden Cost Report'unuzu hazırlıyorum. [X] gün içinde
e-postanıza gelecek."
```

**Structured extraction (arka planda, müşteriye gösterilmez):**

Chat session bittikten hemen sonra Opus'a ek çağrı:

```
"Bu transcript'ten yapılandırılmış veri çıkar — JSON formatında:

{
  "questions": [
    {"id": "S01", "question": "...", "answer": "...", "type": "llm/form"},
    ...
  ],
  "form_values": {
    "va_nva_ratio": 35,
    "approval_stages": "5+",
    ...
  },
  "signals": [
    {"type": "waste", "category": "waiting", "evidence": "...", "strength": "strong"},
    ...
  ],
  "inconsistencies": [
    {"claim_a": "...", "claim_b": "...", "note": "..."},
    ...
  ],
  "hypothesis_status": {
    "h1": {"status": "confirmed", "evidence": "..."},
    "h2": {"status": "weakened", "evidence": "..."},
    "h3": {"status": "new_signal", "evidence": "..."}
  },
  "dss_final": 74,
  "report_mode": "full_analysis"
}
```

Bu JSON rapor üretiminin input'u olur — ham transcript değil. Murat JSON'u Notion'da kontrol eder, gerekirse düzeltir, sonra rapor üretimini tetikler.

---

## 6. STAKEHOLDER DOĞRULAMA (paralel)

### 6.1 Tetikleme
Chat session tamamlandıktan sonra Murat stakeholder'lara e-posta gönderir.

### 6.2 Araç
Rol-spesifik Excel template'leri (GembaX site açık tema renkleriyle — warm beige arka plan, yeşil aksan):
- **Operasyon Müdürü** — 7 soru (2 dropdown) — her iki tier
- **Finans / Mali İşler** — 6 soru (3 dropdown) — sadece $1,100
- **Saha / Vardiya Amiri** — 6 soru (2 dropdown) — $1,100, opsiyonel

### 6.3 Soru Formatı
Teyit edici: "[Sahip] X dedi — siz de aynı görüşte misiniz?"
Placeholder'lar Form 1 verisinden doldurulur.
Tutarsızlık = raporun en güçlü bulgusu.

### 6.4 Süre Yönetimi
- 48 saat deadline
- 24 saat sonra tek hatırlatma (n8n otomatik)
- Gelmezse mevcut veriyle devam

### 6.5 Excel Dosyaları (hazır)
- gembax-stakeholder-operasyon.xlsx
- gembax-stakeholder-finans.xlsx
- gembax-stakeholder-saha.xlsx

---

## 7. VERİ TALEBİ (paralel)

- Murat, araştırma aşamasında müşteriye özel Google Drive klasörü açar
- n8n: müşteriye e-posta → "Varsa şu dökümanları buraya yükleyin: [Drive linki]"
- Drive'a dosya yüklenince → n8n notification → Murat bilgilendirilir
- Opsiyonel — gelmezse DSS düşer, rapor mevcut veriyle üretilir

Talep edilen dökümanlar (hipoteze göre özelleştirilir):
- V1: Son 6 aylık kalite/hata raporu
- V2: Son 12 aylık stok raporu
- V3: Satış funnel verisi / dönüşüm oranları
- V4: Makine/ekipman çalışma süreleri (OEE)
- V5: Maliyet kırılımı (hammadde, işçilik, genel gider)

---

## 8. RAPOR ÜRETİMİ

- Input: **Structured extraction JSON** (ham transcript değil) + stakeholder cevapları + araştırma notları + Drive dosyaları
- Model: **Opus 4.6 + Extended Thinking**
- Murat: raporu kontrol et, sonuçları yorumla
- Müşteriye gönder

---

## 9. TEKNİK MİMARİ (Çözüm #9)

### 9.1 Genel Yapı

Aynı VPS'te 3 servis yan yana çalışır:

```
┌─────────────────────────────────────────────┐
│                    VPS                       │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │  n8n          │  │  Chat API            │ │
│  │  port 5678    │  │  FastAPI + Python    │ │
│  │               │  │  port 8080           │ │
│  │  Orkestrasyon │  │  Session state       │ │
│  │  Paddle       │  │  Soru kontrolü       │ │
│  │  E-posta      │  │  DSS hesaplama       │ │
│  │  Cal.com      │  │  Opus streaming      │ │
│  │  Drive        │  │                      │ │
│  │  Notion sync  │◄─┤  Webhook: chat bitti │ │
│  │               │─►│  Session config      │ │
│  └──────────────┘  └──────────────────────┘ │
│         │                    │               │
│    ┌────┴────┐          ┌───┴───┐           │
│    │ SQLite  │◄─────────┤       │           │
│    │ session │          │       │           │
│    │ DB      │          │       │           │
│    └─────────┘          └───────┘           │
└─────────────────────────────────────────────┘
         │                    │
    ┌────┴────┐          ┌───┴───────┐
    │ Notion  │          │ Opus 4.6  │
    │ API     │          │ API       │
    └─────────┘          └───────────┘
```

### 9.2 Chat API — FastAPI Endpoints

```python
# Endpoint 1: Session başlat
POST /session/start?token=<uuid>
  → Token doğrula (SQLite)
  → E-posta doğrulaması
  → Session config çek
  → İlk mesajı dön

# Endpoint 2: Mesaj gönder (streaming)
POST /session/message
  → Session ID + müşteri mesajı al
  → State'den: sıradaki soru, history, hipotez durumu
  → Opus API call (streaming SSE)
  → Response'u stream et + state güncelle
  → Form bloğu varsa → form data'yı ayrıca kaydet

# Endpoint 3: Session bitir
POST /session/end
  → Transcript kaydet
  → Structured extraction çağrısı (Opus)
  → DSS final hesapla
  → n8n webhook tetikle (stakeholder + rapor akışı)
  → JSON + transcript → Notion'a yaz
```

### 9.3 n8n Workflow'lar

**WF1 — Form 1 AI Katmanı**
- Trigger: Webhook (frontend'den müşteri cevabı)
- Google Custom Search → şirket araştırma
- Haiku 4.5 API → derinlik kontrolü + şirket doğrulama
- Response → frontend'e sonuç dön
- **Hata yönetimi:** Haiku timeout >4 sn → scripted fallback dön

**WF2 — Ödeme Sonrası**
- Trigger: Paddle webhook (ödeme başarılı)
- Notion API → müşteri sayfası oluştur (template'ten)
- Form 1 verilerini Notion'a yaz
- İlk DSS hesapla (kural bazlı)
- Müşteriye e-posta → profil formuna yönlendir
- **Failsafe:** 15 dk cron → Paddle API kontrol

**WF3 — Form 1++ Tamamlandı**
- Trigger: Webhook (profil formu bitti)
- Form 1++ verilerini Notion'a yaz
- DSS güncelle
- Murat'a notification → "Yeni müşteri — araştırmaya başla"

**WF4 — Chat Aktivasyonu**
- Trigger: Notion property değişti ("Sorular hazır" = true)
- Notion'dan tüm veriyi çek
- System prompt oluştur (template + dinamik veri)
- UUID v4 token + TTL oluştur
- Session config'i SQLite'a yaz
- Chat linki hazır

**WF5 — Randevu Hatırlatma + Link Gönderimi**
- Trigger: Cron (randevudan 1 gün önce)
- Müşteriye "araştırmanız tamamlandı" e-postası (Çözüm #4)
- Trigger: Cron (randevu günü)
- Müşteriye chat linki + hatırlatma
- Murat'a hatırlatma

**WF6 — Chat Tamamlandı**
- Trigger: Chat API webhook (session bitti)
- Structured extraction JSON'u Notion'a yaz
- Chat transcript'i Notion'a yaz
- DSS final'ı Notion'a yaz
- Murat'a notification → "Chat tamamlandı"

**WF7 — Veri Talebi**
- Trigger: Notion "Sorular hazır" (WF4 ile paralel)
- Müşteriye e-posta → Drive klasör linki + istenen dökümanlar
- Drive monitoring → dosya yüklenince Murat'a notification

**WF8 — Stakeholder Takip**
- Trigger: Murat stakeholder e-postası gönderdikten sonra Notion'da işaretler
- 24 saat sonra → cevap gelmemişse hatırlatma e-postası
- 48 saat sonra → Murat'a "deadline doldu" notification

### 9.4 n8n VPS Monitoring (Çözüm — Kırılma #9)

- UptimeRobot ($0) → n8n + Chat API health check
- Down olursa → Murat'a SMS/e-posta
- Paddle webhook retry (built-in, 5 kez)
- n8n workflow error handling → hata olursa Murat'a notification

### 9.5 Opus Thinking Budget (Çözüm — Kırılma #7)

- System prompt'ta: "Dahili analizini 500 token altında tut"
- API çağrısında max thinking token parametresi
- Session başı output token takibi — beklenmedik spike loglanır

---

## 10. NOTION MÜŞTERİ TEMPLATE'İ

Teamspace: [Murat'ın mevcut teamspace'i]
Database: "GembaX Müşteriler"

Her müşteri = 1 page. Yapı:

```
📋 [Şirket Adı] — Müşteri Dosyası
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DURUM: [ ] Form geldi  [ ] Araştırma tamam  
       [ ] Sorular hazır  [ ] Chat tamamlandı  [ ] Rapor üretildi
TIER: $550 / $1,100
RANDEVU: [tarih + saat]
DRIVE: [klasör linki]
DSS: [ilk skor] → [final skor] → [rapor modu]

── FORM 1 VERİLERİ (n8n otomatik) ──
İsim / Şirket / Sektör / Çalışan / Ciro
Problem / Value compass / Rekabet avantajı / Value gap
Org öncelik / Tetikleyici / 12 ay testi / Geçmiş denemeler
Kaybedilen müşteri / Odak value stream

── FORM 1++ VERİLERİ (n8n otomatik) ──
[Katman 1 — zorunlu] Stakeholder'lar + sistemler + teknik seviye
[Katman 2 — opsiyonel] Kuruluş, lokasyon, ihracat, büyüme, metrikler...

── ARAŞTIRMA (Murat — Perplexity/Statista) ──
A. Şirket: [notlar]
B. Sektör: [notlar + benchmark değerleri]
C. Müşterinin müşterisi: [notlar]
D. Rakipler: [notlar]
E. Çapraz doğrulama: [⚠️ tutarsızlıklar / ✓ doğrulamalar]
F. Hipotezler:
   H1: [hipotez + TIM WOODS + sinyal]
   H2: [hipotez + TIM WOODS + sinyal]
   H3: [hipotez + TIM WOODS + sinyal]

── CHAT SORULARI (Murat) ──
S01 [tip]: [soru metni] → hipotez bağlantısı
S02 [tip]: [soru metni] → hipotez bağlantısı
...

── STAKEHOLDER SORULARI ──
Operasyon: [özelleştirilmiş sorular]
Finans: [özelleştirilmiş sorular]
Saha: [özelleştirilmiş sorular]

── VERİ TALEPLERİ ──
□ [talep 1] → hipotez bağlantısı
□ [talep 2] → hipotez bağlantısı

── CHAT TRANSCRİPT (otomatik) ──
[session tamamlanınca]

── STRUCTURED EXTRACTION JSON (otomatik) ──
[session sonrası Opus extraction]

── STAKEHOLDER CEVAPLARI ──
[geldikçe eklenir]

── RAPOR NOTLARI ──
[Murat'ın son yorumları]
```

---

## 11. TEKNİK YIĞIN & MALİYET

| Katman | Teknoloji | Maliyet |
|--------|-----------|---------|
| Frontend | Static HTML (mevcut) | $0 |
| Chat API | FastAPI + Python (aynı VPS) | $0 |
| Orkestrasyon | n8n self-hosted Community (aynı VPS) | $0 |
| VPS | Hetzner/DigitalOcean | ~$5-7/ay |
| Form 1 AI | Haiku 4.5 (Anthropic API) | ~$0.10-0.15/session |
| Form 1 Web | Google Custom Search API | ~$0.015/session |
| Ödeme | Paddle | % komisyon |
| Takvim | Cal.com (free tier) | $0 |
| Chat session | Opus 4.6 + extended thinking | ~$0.80/session |
| Structured extraction | Opus 4.6 | ~$0.10/session |
| Rapor üretimi | Opus 4.6 + extended thinking | ~$3-5/rapor |
| Stakeholder | Excel template (hazır) | $0 |
| Müşteri DB | Notion (mevcut teamspace) | $0 |
| Veri toplama | Google Drive (mevcut Workspace) | $0 |
| E-posta | Google Workspace (mevcut) | $0 |
| Monitoring | UptimeRobot | $0 |
| DNS/Domain | Namecheap (mevcut) | $0 |

### Aylık senaryo (10 müşteri, 100 Form 1 ziyaretçi):

| Kalem | Tutar |
|-------|-------|
| VPS | $7 |
| Google Custom Search (~300 sorgu) | $1.50 |
| Haiku API (Form 1, ~100 session) | $15 |
| Opus API (10 chat session) | $8 |
| Opus API (10 extraction) | $1 |
| Opus API (10 rapor) | $40 |
| **Toplam** | **~$73** |
| **Gelir** (10 × $550 ort.) | **$5,500** |
| **AI maliyet oranı** | **%1.3** |

---

## 12. TIER FARKLARI

| | $550 Odak Teşhis | $1,100 Tam Röntgen |
|--|---|---|
| Dokunuş 1 | Tam | Tam |
| Araştırma protokolü | Tam | Tam |
| Chat session | Tam | Tam |
| Stakeholder | 1 kişi (operasyon) | 2-3 kişi (operasyon + finans + saha) |
| Rapor | Odak analiz | 360° analiz |
| Veri talebi | Opsiyonel | Opsiyonel |

---

## 13. TEKNİK KIRILMA NOKTALARI & ÇÖZÜMLERİ

| # | Kırılma | Kritiklik | Çözüm |
|---|---------|-----------|-------|
| 1 | Chat bağlantı kopması | 🔴 Yüksek | Stateful session + resume (SQLite) |
| 2 | Opus soru sırasını kaybetme | 🔴 Yüksek | Backend soru kontrolü (FastAPI) |
| 3 | Paddle webhook kaybı | 🔴 Yüksek | Dual doğrulama + 15 dk cron |
| 4 | Haiku timeout | 🟡 Orta | Scripted fallback (4 sn limit) |
| 5 | Structured extraction hatası | 🟡 Orta | Ayrı extraction + Murat kontrolü |
| 6 | Token güvenliği | 🟡 Orta | UUID v4 + e-posta doğrulama + TTL |
| 7 | Thinking token patlaması | 🟡 Orta | 500 token budget + monitoring |
| 8 | n8n VPS down | 🟢 Düşük | UptimeRobot + retry |
| 9 | Cal.com limitleri | 🟢 Düşük | Gerekirse Calendly/custom geçiş |

---

## 14. PHASE YAPISI

**Phase 1 (şimdi):**
- Text chat + form blokları
- FastAPI chat backend + n8n orkestrasyon
- Notion müşteri DB
- Stakeholder Excel template'leri
- Google Drive veri talebi

**Phase 2 (ileride):**
- Chat'e mikrofon butonu → Whisper STT ile sesli cevap opsiyonu
- Form blokları yine tıklanabilir kalır
- "Voice-assisted chat" — full voice değil

---

## 15. İLGİLİ DOSYALAR

| Dosya | Açıklama |
|-------|----------|
| gembax-intake-blueprint-v2.md | Bu dosya — master blueprint |
| gembax-intake-blueprint-v1.mermaid | Akış diyagramı |
| gembax-stakeholder-operasyon.xlsx | Operasyon müdürü Excel template |
| gembax-stakeholder-finans.xlsx | Finans Excel template |
| gembax-stakeholder-saha.xlsx | Saha sorumlusu Excel template |
| gembaxintakesorulariv3.xlsx | Soru envanteri (6 sheet) |
| gembax-agent-prompt-v1.md | Analiz agent prompt (referans) |
| gembax-design-chart-language-guide-v1.md | Design system + rapor dili |
| gembax-engine-README.md | Motor haritası |

---

## 16. BEKLEYEN GÜNCELLEMELER (implementasyon sırasında yapılacak)

Bu bölüm implementasyon ilerledikçe temizlenir. Her madde tamamlandığında ☐ → ☑ olur.

### İmplementasyon başladığında:

☐ **gembax-agent-prompt-v1.md → 2 yeni prompt'a dönüşecek**
- Haiku system prompt: Form 1 derinlik kontrolü + web araştırma teyidi
- Opus system prompt: chat session (hipotez testi, tutarlılık, reasoning, %70-80 scripted + %20-30 reasoning)
- Tetikleyici: FastAPI chat backend'i inşa ederken
- Kaynak: Bu blueprint'in §5.8 (system prompt yapısı)

☐ **gembax-engine-README.md → "GÜNCEL AKIŞ" bölümü güncellenecek**
- Motor bileşenleri (formül, benchmark, rapor) değişmedi
- Sadece intake akışı bölümü eski mimariye referans veriyor
- Tetikleyici: Chat backend + n8n entegrasyonu tamamlandığında
- Not: Motor intake'den bağımsız çalışıyor, sadece girdi kaynağı değişti

### Dokunma (değişiklik gerektirmiyor):

✓ gembax-design-chart-language-guide-v1.md — Rapor tasarım kuralları aynı
✓ deep-research-report.md — Pazar araştırması hâlâ geçerli
✓ gembax_analiz projesindeki SKILL dosyaları — Motor bileşenleri etkilenmedi

---

*GembaX Intake Blueprint v2.0 — 2026-04-04*
*9 çözüm entegre: UX (#1-#5) + Danışman (#6-#8) + Mimari (#9)*
