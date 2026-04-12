# CLAUDE.md — gembax-landing

## PROJE
gembax.ai — AI-powered operasyonel teşhis platformu ("Operasyonel İsrafın Röntgeni")
Solo operatör: Murat | Repo: ocean1976/gembax-landing | Deploy: Vercel

## DOSYA YAPISI
Tek HTML dosyası = tek sayfa. CSS + JS aynı dosyada. Ayrı dosya oluşturma.

### Mevcut Sayfalar
- index.html → Landing page (hero, süreç, israflar, sektörler, pricing, CTA)
- pricing.html → Ayrı fiyatlandırma sayfası
- gemba-nedir.html → Gemba felsefesi
- metodoloji.html → Metodoloji açıklaması
- privacy.html → Gizlilik politikası
- terms-and-conditions.html → Kullanım koşulları
- refund.html → İade politikası
- vercel.json → Routing config
- xray-hero.jpg, xray-hero-img.jpg → Hero görselleri

### Yapılacak Sayfalar
- [ ] /analiz (analiz.html) → Form 1 scripted chat (M3)
- [ ] /profil (profil.html) → Form 1++ şirket profili (M4 sonrası)
- [ ] /sohbet → Opus chat session (M5 — FastAPI backend, ayrı VPS)

### Kaldırılan
- /basvuru → Eski sayfa, obsolete

## DESIGN SYSTEM
Tema: Warm beige/dark
--bg: #1a1a18 | --bg-card: #23231f | --text: #f5f0e8
--text-muted: #a09880 | --accent: #4ade80 | --accent-glow: #22c55e
--border: #3a3a32
Font: DM Sans (başlık + body) + Space Mono (monospace aksan)
Responsive: Mobile < 600px | Tablet 600-900px | Desktop > 900px
Hamburger menu: < 900px

## i18n
6 dil: TR, EN, DE, ES, FR, PT — localStorage ile
TR base, diğerleri çeviri. Fiyatlar her dilde USD: $550 / $1,100.

## ÇALIŞMA KURALLARI
- Değişiklik küçükse → patch. Büyükse → dosya yeniden oluştur.
- Her commit tek modül, tek iş. Context loss önleme.
- Harici bağımlılık minimum. Google Fonts CDN OK.
- Push sonrası Vercel otomatik deploy eder.

## MODÜLER İMPLEMENTASYON PLANI
Sıra: M1 → M3 → M4 → M2 → M5 → M6

M1: Infra (Hetzner VPS + n8n + SQLite + reverse proxy + SSL)
M3: Form 1 static chat (/analiz — scripted, LLM yok Phase 1)
M4: Ödeme + Cal.com (ödeme platformu TBD + aynı sayfa embed)
M2: Notion entegrasyonu (müşteri DB + n8n API)
M5: FastAPI chat backend (/sohbet — Opus 4.6 streaming, stateful)
M6: Orkestrasyon (n8n WF1-WF8)

## REFERANSLAR (claude.ai projesinde)
- gembax-intake-blueprint-v2.md → MASTER REFERANS
- gembaxintakesorulariv3.xlsx → Soru envanteri (6 sheet)
- gembax-design-chart-language-guide-v1.md → Design system + rapor dili
- gembax-conversation-decisions-2026-04-04.md → Karar özeti
- gembax-agent-prompt-v1.md → Eski agent prompt (referans)
- gembax-engine-README.md → Motor haritası

## GIT
Branch: main | Commit mesajları Türkçe OK
Remote: github.com/ocean1976/gembax-landing.git
