# CLAUDE.md — GembaX Intake Sistemi

## Proje Nedir
gembax.ai — AI-powered operasyonel teşhis platformu. KOBİ'lerin görünmez israfını tespit edip dolar cinsinden gösterir.
Sahip: Murat — solo operatör. Terminal/kod deneyimi yok, Türkçe çalışır.

## Master Referans
Tüm mimari, akış, kararlar, maliyet, kırılma noktaları → `docs/gembax-intake-blueprint-v2.md`
Her işe başlamadan önce bu dosyayı oku.

## Karar Özeti + TODO'lar → `docs/gembax-conversation-decisions-2026-04-04.md`

---

## SİSTEM ÖZETİ

```
Dokunuş 1 → gembax.ai/analiz (scripted chat + Haiku AI + ödeme + profil) — ~15 dk
          → Cal.com randevu (2+ gün sonrası)
Murat     → Araştırma protokolü (manuel) + Notion'da hipotez + sorular
Dokunuş 2 → gembax.ai/sohbet (Opus 4.6 chat, streaming) — ~30 dk
Paralel   → Stakeholder Excel + Drive veri talebi
Rapor     → Structured extraction (JSON) + Opus 4.6 rapor
```

## TEKNİK YIĞIN

- Chat backend: FastAPI + Python (streaming, stateful) — VPS port 8080
- Orkestrasyon: n8n self-hosted Community — VPS port 5678
- Session DB: SQLite — aynı VPS
- Müşteri DB: Notion (mevcut teamspace)
- Form 1 AI: Haiku 4.5 (Anthropic API)
- Chat + Rapor: Opus 4.6 + extended thinking (Anthropic API)
- Ödeme: Paddle
- Takvim: Cal.com (free tier)
- Veri toplama: Google Drive (mevcut Workspace)
- E-posta: Google Workspace (mevcut)
- VPS: Hetzner veya DigitalOcean (~$5-7/ay)
- Frontend: Static HTML + JS

---

## MODÜLER İMPLEMENTASYON PLANI

⚠️ HER MODÜL BAĞIMSIZ ÇALIŞIR VE TEST EDİLİR.
⚠️ BİR MODÜLÜ BİTİRMEDEN DİĞERİNE GEÇME.
⚠️ HER MODÜL BİTİNCE `git commit` AT — ÇALIŞAN HALİ KİLİTLE.
⚠️ BAŞKA MODÜLÜN DOSYALARINA DOKUNMA.

### Modül 1 — Altyapı (VPS + n8n)
**Klasör:** `infra/`
**Bağımlılık:** Yok
**Ne yapılacak:**
- Hetzner/DigitalOcean VPS kur (Ubuntu 24, ~$5-7/ay)
- Docker + Docker Compose kur
- n8n Community Edition deploy et (port 5678)
- Reverse proxy (nginx veya Caddy) + SSL (Let's Encrypt)
- Domain bağla: n8n.gembax.ai (veya subdomain)
- UptimeRobot monitoring kur
**Test:** n8n arayüzüne tarayıcıdan erişebiliyor musun?
**Commit mesajı:** "Modül 1: VPS + n8n deploy tamamlandı"

### Modül 2 — Notion Entegrasyonu
**Klasör:** `n8n/workflows/`
**Bağımlılık:** Modül 1
**Ne yapılacak:**
- Notion'da "GembaX Müşteriler" database oluştur
- Müşteri template'i kur (blueprint v2 §10'daki yapı)
- n8n → Notion bağlantısı (API key)
- n8n workflow: test müşteri sayfası oluştur + veri yaz + oku
**Test:** n8n'den "Test Müşteri" sayfası oluşturuluyor mu?
**Commit mesajı:** "Modül 2: Notion DB + n8n entegrasyonu tamamlandı"

### Modül 3 — Form 1 Chat Sayfası (STATİK BAŞLA → LLM SONRA)
**Klasör:** `frontend/analiz.html`
**Bağımlılık:** Bağımsız — sıfır API, sıfır sunucu, tamamen client-side
**Ne yapılacak:**
- analiz.html: scripted chat UI (GembaX design system — warm beige, yeşil aksan, DM Sans)
- Chat baloncuğu görünümü (sol: GembaX, sağ: müşteri) — form hissi YOK
- 15 sohbet sorusu + 6 iletişim/ödeme adımı (blueprint v2 §2.3)
- Soru tipleri: serbest metin, pill seçim, multi-select, pill+metin
- Dallanan sorular: sektöre göre farklı geçiş cümleleri, cevaba göre sonraki soru dallanır
- Yazma animasyonu: GembaX mesajları 0.5-1sn gecikmeyle gelsin (bot hissi kırmak için)
- Her cevaptan sonra kısa hardcoded geçiş cümlesi
- Sentezde basit template: toplanan verilerden özet ("Sektörünüz X, önceliğiniz Y...")
- Sonunda: e-posta, paket seçimi, NDA, ödeme butonu
- Mobile-first responsive
- Tek dosya: HTML + CSS + JS aynı dosyada
**Test:** Sohbet akışı doğal hissediyor mu? Dallanma çalışıyor mu? Mobile'da iyi görünüyor mu?
**Commit mesajı:** "Modül 3: Form 1 statik chat sayfası tamamlandı"

**SONRA EKLENİR (ilk 5-10 müşteriden sonra):**
- Modül 3B: Haiku 4.5 entegrasyonu (şirket teyidi + derinlik kontrolü + sentez sinyali)
- n8n webhook gerekir, Modül 1'e bağımlı olur

### Modül 5 — Chat Backend (FastAPI) ← Modül 4'ten ÖNCE
**Klasör:** `chat-api/`
**Bağımlılık:** Bağımsız (kendi başına test edilir)
**Ne yapılacak:**
- FastAPI servisi: main.py, session.py, prompts.py
- SQLite session DB
- POST /session/start?token=<uuid> → token doğrula + e-posta doğrula + session config çek + ilk mesaj dön
- POST /session/message → session state + sıradaki soru + Opus API (streaming SSE) + state güncelle
- POST /session/end → transcript kaydet + structured extraction (Opus JSON) + DSS hesapla + n8n webhook tetikle
- sohbet.html: chat UI (GembaX design system, streaming response, form blokları — dropdown/slider/multi-select chat bubble görünümlü)
- Bağlantı kopması → resume (state SQLite'da)
- Soru sırası kontrolü backend'de (LLM'e bırakılmaz)
- 25 turnus hard limit
- Thinking budget: 500 token
- Token güvenliği: UUID v4 + e-posta doğrulama + TTL (24 saat)
**Referans:** Blueprint v2 §5 (tüm bölüm) + §9.2 (API endpoints) + §13 (kırılma noktaları)
**Test:** Token ile chat açılıyor mu? Streaming çalışıyor mu? Form blokları görünüyor mu? Resume çalışıyor mu?
**Commit mesajı:** "Modül 5: FastAPI chat backend + chat UI tamamlandı"

### Modül 4 — Ödeme + Form 1++ + Cal.com
**Klasör:** `frontend/profil.html` + n8n workflows
**Bağımlılık:** Modül 1 + 2
**Ne yapılacak:**
- Paddle entegrasyonu (Payment Links veya Checkout API)
- n8n: Paddle webhook → Notion müşteri sayfası oluştur + Form 1 verilerini yaz + İlk DSS hesapla
- Paddle webhook failsafe: 15 dk cron → Paddle API kontrol
- profil.html: Form 1++ sayfası (2 katmanlı — zorunlu 2dk + opsiyonel 3dk)
- "Ödeme alındı" banner + progress bar
- Stakeholder bilgileri (zorunlu: min 1 kişi)
- Form 1++ gönder → aynı sayfada Cal.com embed → randevu seçimi
- n8n: Form 1++ verilerini Notion'a yaz + Murat'a notification
**Test:** Ödeme → profil → randevu akışı bitiyor mu? Notion'da sayfa doğru doldu mu?
**Commit mesajı:** "Modül 4: Paddle + Form 1++ + Cal.com tamamlandı"

### Modül 6 — Orkestrasyon (Birleştirme)
**Klasör:** `n8n/workflows/`
**Bağımlılık:** Modül 1-5 hepsi
**Ne yapılacak:**
- Modül 3 → 4 → 5 akışını uçtan uca bağla
- n8n WF4: Notion "Sorular hazır" → session config → SQLite → chat linki oluştur
- n8n WF5: Randevudan 1 gün önce "araştırmanız tamamlandı" e-postası + randevu günü chat linki
- n8n WF6: Chat API webhook (session bitti) → structured JSON + transcript Notion'a yaz
- n8n WF7: Müşteriye Drive klasör linki + veri talebi e-postası
- n8n WF8: Stakeholder e-posta takip (24 saat hatırlatma, 48 saat deadline)
- DSS 2-aşamalı: Form 1 sonrası (kural bazlı, n8n) + chat sonrası (Opus, FastAPI)
**Test:** Baştan sona tam akış — fake müşteri ile test et
**Commit mesajı:** "Modül 6: Tam orkestrasyon tamamlandı"

---

## KLASÖR YAPISI

```
gembax/
├── docs/
│   ├── gembax-intake-blueprint-v2.md      ← MASTER REFERANS
│   ├── gembax-conversation-decisions-2026-04-04.md
│   └── gembax-intake-blueprint-v1.mermaid
├── frontend/
│   ├── analiz.html          (Modül 3 — Form 1 chat)
│   ├── profil.html          (Modül 4 — Form 1++)
│   └── sohbet.html          (Modül 5 — Chat session)
├── chat-api/
│   ├── main.py              (Modül 5 — FastAPI endpoints)
│   ├── session.py           (Modül 5 — session state management)
│   ├── prompts.py           (Modül 5 — Haiku + Opus system prompt'ları)
│   ├── database.py          (Modül 5 — SQLite operations)
│   └── requirements.txt
├── infra/
│   ├── docker-compose.yml   (Modül 1 — n8n + FastAPI)
│   └── nginx.conf           (Modül 1 — reverse proxy)
├── n8n/
│   └── workflows/           (Modül 2,4,6 — export edilmiş workflow JSON'ları)
├── templates/
│   ├── gembax-stakeholder-operasyon.xlsx
│   ├── gembax-stakeholder-finans.xlsx
│   └── gembax-stakeholder-saha.xlsx
├── CLAUDE.md                ← BU DOSYA
├── .env.example             (API key template — .env'i ASLA commit etme)
└── .gitignore
```

## DESIGN SYSTEM (frontend sayfaları için)

```css
/* Landing page açık tema */
--bg: #f5f0e8;        /* warm beige arka plan */
--text: #1a1a18;       /* koyu metin */
--text-muted: #a09880; /* ikincil metin */
--accent: #4ade80;     /* yeşil aksan */
--accent-dark: #166534;/* koyu yeşil */
--border: #d6d0c4;     /* sınır */
--bg-card: #ffffff;    /* kart arka planı */

/* Fontlar */
font-family: 'DM Sans', sans-serif;  /* başlıklar + body */
font-family: 'Space Mono', monospace; /* aksan */
```

## ÇALIŞMA KURALLARI

1. Murat terminal bilmez — her komutu açıkla, ne yapacağını söyle
2. Tek dosya = tek sayfa (HTML + CSS + JS aynı dosyada)
3. Her modül bitince git commit at
4. Başka modülün dosyalarına DOKUNMA
5. Hata olursa önce düzelt, sonra devam et — sessizce geçme
6. .env dosyasını ASLA commit etme
7. Her değişiklikte "ne yaptım, ne test etmeli" açıkla
8. Türkçe çalış — Murat'a İngilizce teknik terim kullanırken açıkla
