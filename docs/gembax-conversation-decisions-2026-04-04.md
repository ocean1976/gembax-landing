# GembaX — Konuşma Kararları Özeti
**Tarih:** 2026-04-04  
**Kapsam:** Form 2 → Agentic chat dönüşümü + tam sistem mimarisi

---

## KESİNLEŞEN KARARLAR

### Ürün Kararları
1. Form 2 artık e-posta değil → randevulu AI chat session (gembax.ai/sohbet)
2. Chat: %70-80 scripted + %20-30 LLM reasoning (hipotez testi, tutarlılık, yeterlilik)
3. LLM serbest soru oranı %10-20 arası — müşteri cevabına göre follow-up
4. Phase 1 text chat, Phase 2 voice-assisted (mikrofon + Whisper STT)
5. Stakeholder doğrulama → Excel template (e-posta eki, form veya web arayüzü değil)
6. Veri talebi → Google Drive klasör linki (n8n orkestre eder)
7. Canlı review kaldırıldı — tier farkı sadece stakeholder sayısı + rapor derinliği
8. Araştırma protokolü tamamen Murat tarafından yapılır (Perplexity, Statista) — otomasyon yok

### Mimari Kararlar
1. Chat backend: ayrı FastAPI servisi (streaming, stateful) — n8n içinde değil
2. Orkestrasyon: n8n self-hosted Community Edition
3. Müşteri DB: Notion (mevcut teamspace)
4. Session DB: SQLite (aynı VPS)
5. Form 1 AI: Haiku 4.5 (derinlik kontrolü + web araştırma)
6. Chat session: Opus 4.6 + extended thinking
7. Rapor: Opus 4.6 + extended thinking
8. Takvim: Cal.com free tier
9. Ödeme: Paddle
10. VPS: Hetzner veya DigitalOcean (~$5-7/ay)
11. Tüm servisler (n8n + FastAPI + SQLite) aynı VPS'te

### UX Çözümleri (#1-#5)
1. Sentez → ödeme geçişi: somut sinyal göster, "devam etmek için" framingle
2. Form 1++: 2 katman (zorunlu 2dk + opsiyonel 3dk)
3. Cal.com: Form 1++ bitince aynı sayfada embed
4. 2 gün bekleme: randevudan 1 gün önce "araştırmanız tamamlandı" e-postası
5. Form blokları: chat bubble görünümlü, Opus geçiş cümleleriyle

### Danışman Çözümleri (#6-#8)
6. DSS: 2 aşama — Form 1 sonrası (kural bazlı) + chat sonrası (Opus)
7. Chat süre: 25 turnus hard limit, 20 sonrası follow-up yok
8. Structured extraction: chat sonrası Opus JSON çıkarır → rapor input'u

### Teknik Çözüm (#9)
9. Stateful chat backend (FastAPI) + n8n orkestrasyon + SQLite session

### Maliyet Kararları
- Opus 4.6 kullanılacak (maliyet önemsiz — $550 gelire karşı %1.3)
- Ücretsiz/ucuz model (Qwen, DeepSeek) kullanılmayacak — gizlilik + güvenilirlik
- 1000 Form 1 session AI maliyeti: ~$20
- Aylık toplam (10 müşteri): ~$73

---

## REFERANS DOSYALAR

| Dosya | İçerik |
|-------|--------|
| gembax-intake-blueprint-v2.md | **MASTER REFERANS** — tüm sistem detayı |
| gembax-intake-blueprint-v1.mermaid | Akış diyagramı |
| gembax-stakeholder-operasyon.xlsx | Operasyon Excel template |
| gembax-stakeholder-finans.xlsx | Finans Excel template |
| gembax-stakeholder-saha.xlsx | Saha Excel template |
| gembaxintakesorulariv3.xlsx | Soru envanteri (mevcut) |

---

## İMPLEMENTASYON SIRASINDA GÜNCELLENMESI GEREKEN DOSYALAR

Bu dosyalar şimdi güncellenmedi — implementasyonun ilgili aşamasında güncellenecek. Her maddenin tetikleyicisi var: o aşamaya gelince Claude'a "şu TODO'yu yap" de.

| # | Dosya | Ne yapılacak | Tetikleyici (ne zaman) |
|---|-------|-------------|----------------------|
| 1 | `gembax-agent-prompt-v1.md` | Bu prompt eski mimari için yazılmış (Claude Project'e direkt müşteri). Yerine **2 yeni prompt** yazılacak: (a) Haiku system prompt — Form 1 derinlik kontrolü + web araştırma teyidi, (b) Opus system prompt — chat session hipotez testi, tutarlılık, reasoning. Blueprint v2 §5.8'deki yapı baz alınacak. | **FastAPI chat backend'i kodlarken** |
| 2 | `gembax-engine-README.md` | "GÜNCEL AKIŞ" bölümü eski intake akışını gösteriyor. Yeni akışa (Form 1 → chat session → structured extraction → rapor) güncellenecek. Motor bileşenleri (formül, benchmark, rapor generatörü) değişmedi, sadece girdi kaynağı değişti. | **İlk rapor üretimi test edilirken** |
| 3 | `gembaxintakesorulariv3.xlsx` | Sheet 4 "Dokunuş 2 — Müşteri E-posta" artık geçersiz — chat session'a dönüştü. Sheet yapısı yeni akışa uyarlanacak. | **Chat soru akışı finalize edilirken** |

### DOKUNULMAYACAK DOSYALAR (şimdilik geçerli)

| Dosya | Neden dokunma |
|-------|--------------|
| `gembax-design-chart-language-guide-v1.md` | Rapor tasarım kuralları değişmedi |
| `deep-research-report.md` | Pazar araştırması, hâlâ geçerli referans |
| `gembax-formula-library-v2.md` | Hesaplama motoru değişmedi |
| `gembax-benchmark-database-v1.md` | Benchmark veriler değişmedi |
| `gembax-report-generator-v1.js` | Rapor üretim kodu değişmedi |
| Diğer SKILL dosyaları | gembax_analiz projesinde, bu proje etkilenmedi |

---

*2026-04-04 — gembax_dev*
