gembax_dev — Project Instructions

Proje: gembax.ai ürün geliştirme (site, landing page, altyapı, marka)
Sahip: Murat — solo operatör, gembax.ai + moresight.io
Kardeş proje: gembax_analiz (teşhis motoru, müşteri intake, rapor üretimi — ayrı proje)


1. BU PROJE NE İÇİN
Bu proje gembax.ai'nin ürün ve marka geliştirme tarafıdır:

Landing page (HTML/CSS/JS)
Pricing page
Multilingual desteği (TR, EN, DE, ES)
Görsel tasarım (hero, animasyonlar, layout)
E-posta / DNS / altyapı konfigürasyonu
Pazarlama materyalleri
Agent prompt geliştirme ve iterasyon (analiz projesine deploy edilecek prompt'ların draft'ları)
Intake sistemi mimarisi ve implementasyonu (chat backend, n8n, Notion entegrasyonu)

Müşteriye dönük teşhis/analiz/rapor işleri → gembax_analiz projesinde yapılır.

2. ÇALIŞMA TARZI
Murat'ın tercihleri:

Kısa, direkt talimatlar verir — genelde Türkçe, bazen İngilizce karışık
İteratif çalışır — "bunu yap, göster, düzelt" döngüsü
Detay vermezse karar al — tasarım/copy kararlarını otonom yap, sonra göster
Ekran görüntüsü paylaşır — sorunları görsel olarak tanımlar ("X yazısı altta kalmış", "buton sağda çıkıyor")
Maliyet-verimli çözüm tercih eder — en ucuz doğru yol
Tek HTML dosyası yaklaşımı — component'ları ayrı dosyalara bölme, tek dosyada tut

Dosya konumları:

Çalışma alanı: /home/claude
Final çıktılar: /mnt/user-data/outputs/
Proje referansları: /mnt/project/
Upload'lar: /mnt/user-data/uploads/

Büyük HTML dosyaları okurken:
sed -n '[start],[end]p' dosya.html kullan — view tool uzun CSS satırlarını truncate edebiliyor.

3. DESIGN SYSTEM
Tüm yeni sayfalar ve bileşenler bu sisteme uymalı. Detaylar gembax-design-chart-language-guide-v1.md dosyasında.
Özet:
Tema: Warm beige/dark, profesyonel ama samimi
Renkler (Landing Page — CSS custom properties):
css--bg: #1a1a18          /* Koyu arka plan */
--bg-card: #23231f     /* Kart arka planı */
--text: #f5f0e8        /* Ana metin — warm beige */
--text-muted: #a09880  /* İkincil metin */
--accent: #4ade80      /* Yeşil aksan (CTA, vurgu) */
--accent-glow: #22c55e /* Yeşil glow efekti */
--accent-dark: #166534 /* Koyu yeşil */
--border: #3a3a32      /* Sınır rengi */
Tipografi:

Başlıklar: DM Sans (Google Fonts)
Monospace / aksan: Space Mono
Body: DM Sans, normal ağırlık

Görsel öğeler:

Dot pattern arka planlar (radial-gradient)
Fade-in animasyonlar (scroll-triggered)
Card-based layout
CRT-style scanline efekti (hero X-ray görseli)

Raporlar için ayrı palet:
Rapor (DOCX) renkleri farklıdır — Deep Navy #1B2A4A, Slate Blue #3D5A80, Muted Teal #2A7D72 temel. Design guide'da A bölümüne bak.
Responsive breakpoints:

Desktop: > 900px
Tablet: 600-900px
Mobile: < 600px
Hamburger menu: 900px altında


4. ÜRÜN YAPISI
gembax.ai — Ne yapar:
"Operasyonel İsrafın Röntgeni" — AI-powered operasyonel teşhis. İşletmelerin görünmez israfını tespit edip dolar cinsinden gösterir.
Hedef kitle:
KOBİ'ler (SMEs) — üretim, hizmet, SaaS, satış, lojistik, perakende
Pricing (3 tier):

Keşif (Ücretsiz) — Temel operasyonel sağlık taraması (Phase 2'de)
Odak Teşhis ($550 tek seferlik) — Hidden Cost Report, odak analiz
Tam Röntgen ($1,100 tek seferlik) — 360° analiz, çoklu stakeholder doğrulama

İki marka ilişkisi:

gembax.ai → Ürün (AI teşhis aracı)
moresight.io → Enterprise uygulama partneri (Dönüşüm tier'i)
Aynı Google Workspace, aynı inbox (murat@gembax.ai + murat@moresight.io)


5. MÜŞTERİ INTAKE MİMARİSİ (v2.0 — 2026-04-04)

⚠️ ESKİ MİMARİ (Form 2 e-posta ile soru gönderme) KALDIRILDI.
Master referans: gembax-intake-blueprint-v2.md

Yeni akış:

Dokunuş 1 → gembax.ai/analiz (scripted chat + Haiku AI + ödeme + profil) — ~15 dk
          → Form 1: 15 sohbet sorusu, Haiku 4.5 derinlik kontrolü + web araştırma teyidi
          → Paddle ödeme ($550 / $1,100)
          → Form 1++: şirket profili + stakeholder bilgileri (zorunlu)
          → Cal.com randevu seçimi (aynı sayfada embed, 2+ gün sonrası)

Murat     → Araştırma protokolü (Perplexity/Statista, manuel) + hipotez üretimi
          → Notion müşteri sayfası: sorular, hipotezler, araştırma notları
          → Google Drive klasörü açma, session config hazırlama

Dokunuş 2 → gembax.ai/sohbet (Opus 4.6 + extended thinking, streaming)
          → Kişiselleştirilmiş link: gembax.ai/sohbet?token=<uuid>
          → %70-80 scripted + %20-30 reasoning (hipotez testi, tutarlılık, yeterlilik)
          → Chat içinde form blokları (dropdown, slider, multi-select)
          → ~30 dk, 25 turnus hard limit

Paralel   → Stakeholder Excel doğrulama (rol-spesifik, teyit formatında)
          → Google Drive veri talebi (opsiyonel)

Rapor     → Structured extraction (JSON) + Opus 4.6 rapor üretimi

Teknik yığın:

Chat backend: FastAPI + Python (streaming, stateful) — aynı VPS
Orkestrasyon: n8n self-hosted Community Edition — aynı VPS
Session DB: SQLite — aynı VPS
Müşteri DB: Notion (mevcut teamspace)
Form 1 AI: Haiku 4.5 (Anthropic API)
Chat + Rapor: Opus 4.6 + extended thinking (Anthropic API)
Ödeme: Paddle
Takvim: Cal.com (free tier)
Veri toplama: Google Drive (mevcut Workspace)
E-posta: Google Workspace (mevcut)
VPS: Hetzner veya DigitalOcean (~$5-7/ay)


6. MEVCUT DOSYALAR

Dosya — Açıklama
gembax-intake-blueprint-v2.md — MASTER REFERANS: tüm intake sistemi (mimari, akış, sorular, prompt yapısı, n8n, Notion, maliyet, kırılma noktaları)
gembax-conversation-decisions-2026-04-04.md — Karar özeti (2026-04-04)
gembax-intake-blueprint-v1.mermaid — Akış diyagramı
gembaxintakesorulariv3.xlsx — Soru envanteri (6 sheet)
gembax-stakeholder-operasyon.xlsx — Operasyon müdürü Excel template
gembax-stakeholder-finans.xlsx — Finans Excel template
gembax-stakeholder-saha.xlsx — Saha sorumlusu Excel template
gembax-landing-with-pricing.html — Landing page + pricing HTML
gembax-design-chart-language-guide-v1.md — Design system + rapor dil kuralları
gembax-agent-prompt-v1.md — Analiz agent'ının prompt'u (eski mimari referansı — yeni prompt'lar implementasyonda yazılacak)
gembax-engine-README.md — Motor haritası — analiz engine'in parçaları
gembax-project-file-catalog.md — Tüm proje dosyalarının envanteri
deep-research-report.md — Pazar araştırması
terms-and-conditions.html — Kullanım koşulları
privacy.html — Gizlilik politikası
refund.html — İade politikası
pricing.html — Fiyatlandırma sayfası


7. ALTYAPI
Servis — Detay
Domain — gembax.ai — Namecheap
DNS — Namecheap (MX: Google Workspace, DKIM aktif)
E-posta — Google Workspace Business Standard (domain alias)
Inbox — murat@gembax.ai + murat@moresight.io → tek inbox
VPS — Hetzner/DigitalOcean (n8n + FastAPI + SQLite)
Ödeme — Paddle
Takvim — Cal.com (free tier, Google Calendar sync)
Müşteri DB — Notion (mevcut teamspace)


8. DEV PRENSİPLERİ

Tek dosya = tek sayfa. HTML + CSS + JS hep aynı dosyada. Ayrı CSS/JS dosyası oluşturma.
Design system'e uy. Yeni renk, font, spacing ekleme — mevcut custom properties'i kullan.
Mobile-first düşün. Her değişiklikte responsive kontrol et.
Copy Türkçe öncelikli. Multilingual varsa TR base, diğerleri çeviri.
Çıktıyı her zaman /mnt/user-data/outputs/'a koy — Murat indirsin.
Değişiklik küçükse → str_replace ile patch. Büyükse → tam dosya yeniden oluştur.
Performans: Harici bağımlılık minimum. Google Fonts CDN OK, büyük JS kütüphaneleri önceden sor.
Intake blueprint referans: Herhangi bir intake/chat/form geliştirmesinde gembax-intake-blueprint-v2.md'yi referans al.


gembax_dev Project Instructions v2.0 — 2026-04-04
Güncelleme: Intake sistemi v2.0 (agentic chat mimarisi) eklendi. Eski Form 2 e-posta modeli kaldırıldı.
