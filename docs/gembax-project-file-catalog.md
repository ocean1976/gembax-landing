# gembax.ai Proje Bilgi Tabanı — Dosya Katalogu
> **Tarih:** 2026-04-04 | **Toplam:** 82 dosya | **Durum:** Intake sistemi v2.0 eklendi

---

## A. GEMBAX CORE MOTOR (15 dosya)

### A1. Sistem & Metodoloji

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 1 | `gembax-system-prompt-v4.md` | 791 | **Ana yönerge.** Kimlik, misyon, ton, Value Compass, TIM WOODS, sektör routing, DSS, Tier/Probe, 13 adım protokolü, 20 kural, brand standartları. Motor her şeye buradan bakar. |
| 2 | `gembax-methodology-SKILL.md` | 334 | **6 adımlı akış felsefesi.** Değer tanımla → veri topla → paralel teşhis (israf + uyumsuzluk + darboğaz) → sentez → $ hesapla → rapor. Neden sadece darboğaz yetmez, tekstil firması örneği. |
| 3 | `gembax-engine-README.md` | 291 | **Motor haritası.** 7 core parça + ek modüller, bağımlılık haritası, versiyon tarihçesi. Tüm dosyaların nasıl birlikte çalıştığını gösterir. |

### A2. Intake & Teşhis

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 4 | `gembax-intake-forms-v1.md` | 430 | **NE sorulacak.** Form 1 (19 genel soru: kimlik, şirket, müşteri değeri, firma değeri, problem) + Form 2 (13-15 sektörel soru + 9-11 veri talebi). Her sorunun motor bağlantısı açıklanmış. |
| 5 | `gembax-intake-chat-SKILL-v5.md` | 450 | **NASIL sorulacak.** Sohbet tonu, 6 faz geçiş cümleleri, probe trigger'lar, adaptif 5-Why protokolü, DSS hesaplama, zaman yönetimi, JSON çıktı formatı. |
| 6 | `gembax-diagnostic-synthesis-SKILL.md` | 368 | **Pattern matching + darboğaz hipotezi.** 17 operasyonel pattern (MA-1→7, SB-1→4, TC-1→3, SD-1→3, RF-1→3, LE-1→2), kısıt tipi sınıflandırma, TOC 5 Adım ön-değerlendirme, 4 sentez şablonu. |
| 7 | `gembax-toc-integration-patch-v1.md` | 391 | **TOC soruları + perakende TOC.** 6 rotaya 15 darboğaz tespit sorusu, probe trigger'lar, Goldratt "Isn't It Obvious" perakende formülleri (stockout/markdown/replenishment). |

### A3. Hesaplama

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 8 | `gembax-formula-library-v2.md` | 1,344 | **Hesaplama motoru.** §0-7: 5 sektör × 8 israf kategorisi deterministik formüller. §8: VAL + Teşhis entegre 13 adımlı protokol (Value Compass, Hizalama Filtresi, 3 katmanlı teşhis, Boeing kuralı, 4 sentez tipi). |
| 9 | `gembax-benchmark-database-v1.md` | 528 | **Fallback değerler.** Müşteri "bilmiyorum" dediğinde sektör bazlı referans değerler + severity renklendirme (🟩🟨🟧🟥). 6 sektör × 8 israf kategorisi. |
| 10 | `gembax-toc-bottleneck-dollar-calc.md` | 343 | **Darboğaz $ hesabı.** 6 sektör için throughput kaybı formülleri. "Darboğaz şurada" yetmez, "yılda $X'a mal oluyor" der. |

### A4. Rapor & Görsel

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 11 | `gembax-report-generator-v1.js` | 642 | **Branded DOCX üretim kodu.** 8 bölümlü Hidden Cost Report: Yönetici Özeti, Değer Hizalama, İsraf Kırılımı, Pareto, Darboğaz, Aksiyonlar, 90 Gün Plan, ROI. |
| 12 | `gembax-report-generator-VAL-patch-v1.js` | 451 | **Rapor VAL eklentileri.** §1.5 Değer Hizalama bölümü, Pareto VAL etiketleri (🎯💰⚙️), değer-merkezli sentez dili, Boeing 3 kategori zorunluluğu. |
| 13 | `gembax-design-chart-language-guide-v1.md` | 505 | **Rapor yazım ve görsel standartları.** Brand renkleri, tipografi, chart türleri, dil kuralları ("$24M israf" de, "yüksek hurda oranı" deme), güven seviyesi dili, QC checklist. |

### A5. Sektör Derinlik

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 14 | `gembax-retail-sector-F-complete.md` | 478 | **Perakende tam set.** Intake soruları, TIM WOODS formülleri, benchmark'lar, severity mapping, Goldratt paradoksu (stockout + overstock aynı anda). |
| 15 | `gembax-service-subsector-B-depth.md` | 357 | **Hizmet alt-segment derinliği.** 6 alt-sektör (Consulting, Legal, Financial, Education, Marketing, Other) bazlı farklılaştırılmış benchmark ve formül parametreleri. |

### A6. Referans

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 16 | `gembax-case-study-benchmarks-SKILL.md` | 439 | **7 case study + Boeing kuralı.** Danaher (DBS), Boeing (St. Louis), Jaguar Castle Bromwich, Wiremold, Virginia Mason, Starbucks, Park Nicollet. Pattern matrisi, killer waste tablosu, credibility listesi. |

---

## B. OPERASYONEL BİLGİ TABANI — LEAN & İSRAF (7 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 17 | `gemba-kaizen-SKILL.md` | 350 | **Imai'nin Gemba Kaizen'i.** 7+1 israf (TIM WOODS), 5S, gemba prensipleri, standartlaştırma, PDCA/SDCA döngüsü, kalite maliyeti (COPQ). gembax'ın israf tanımlama temeli. |
| 18 | `gemba-walks-womack-SKILL.md` | 269 | **Womack'ın düşünce çerçevesi.** Purpose→Process→People, "değeri kim tanımlar?", 10 gemba sorusu, repurpose uyarısı. gembax'ın "önce değer tanımla" yaklaşımının kaynağı. |
| 19 | `lean-management-SKILL.md` | 885 | **Lean temeller.** Toyota Production System, pull vs push, one-piece flow, kanban, heijunka, jidoka, andon, kaizen, hoshin kanri. Geniş kapsamlı lean referans. |
| 20 | `lean-six-sigma-moresight-SKILL.md` | 853 | **DMAIC + SPC + COPQ.** Define-Measure-Analyze-Improve-Control metodolojisi, istatistiksel proses kontrol, kalite maliyeti hesaplama, kontrol grafikleri. |
| 21 | `operational-excellence-SKILL.md` | 331 | **OpEx genel çerçeve.** Operasyonel mükemmellik prensipleri, olgunluk modeli, değerlendirme kriterleri, sürdürülebilirlik. |
| 22 | `value-stream-mapping-SKILL.md` | 199 | **VSM + MBPM.** Üretim (Value Stream Mapping) + ofis/hizmet (Makigami Business Process Mapping) süreçlerinde israf noktalarının görsel tespiti. |
| 23 | `vsm-acme-case-study-ref.md` | 247 | **VSM referans case.** Acme firması mevcut → gelecek durum dönüşümü. Lead time 23.6 gün → 4.5 gün, $ etkisi gösterilmiş. |

---

## C. TOC — KISIT TEORİSİ (3 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 24 | `toc-moresight-SKILL.md` | 383 | **TOC temel.** Goldratt'ın Kısıtlar Teorisi, 5 Focusing Steps, throughput accounting (T, I, OE), drum-buffer-rope, thinking processes. |
| 25 | `toc-moresight-ref-thinking.md` | 321 | **TOC düşünce süreçleri.** Current Reality Tree, Future Reality Tree, Evaporating Cloud, Prerequisite Tree — mantıksal problem çözme araçları. |
| 26 | `toc-moresight-ref-implementation.md` | 394 | **TOC uygulama.** S-DBR, buffer management, TOC dağıtım çözümü (replenishment), throughput accounting detayları, implementasyon adımları. |

---

## D. DANIŞMANLIK & PROBLEM ÇÖZME (7 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 27 | `mckinsey-problem-solving-SKILL.md` | 362 | **Yapılandırılmış problem çözme.** MECE, issue tree, hypothesis-driven, pyramid principle, "so what?" testi. gembax sentezinin omurgası. |
| 28 | `the-mckinsey-way-SKILL.md` | 343 | **McKinsey metodu.** Problem tanımlama, 80/20, MECE yapılandırma, müşteri yönetimi, sunum, implementasyon prensipleri. |
| 29 | `consulting-mind-SKILL.md` | 417 | **Danışmanlık framework'leri.** ConsultantsMind (John Kim, ex-Deloitte) perspektifi: 7 temel soru, müşteri yönetimi, deliverable standartları. |
| 30 | `consulting-mind-ref-frameworks.md` | 446 | **Framework detayları.** consulting-mind-SKILL'in referans verdiği framework'lerin genişletilmiş açıklamaları. |
| 31 | `consulting-mind-ref-deliverable-templates.md` | 349 | **Teslimat şablonları.** Rapor, sunum, analiz çıktılarının formatları ve standartları. |
| 32 | `consulting-mind-ref-financial-analysis.md` | 248 | **Finansal analiz.** Dan müşteri analizlerinde kullanılan temel finansal analiz teknikleri ve oranlar. |
| 33 | `top-101-consulting-frameworks-SKILL.md` | 211 | **101 framework indeksi.** Stratejiden operasyona, dijitalden müşteriye — framework seçim rehberi ve cross-reference. |

---

## E. KÖK NEDEN TEŞHİS (2 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 34 | `rootcause-diagnosis-SKILL.md` | 732 | **Teşhis motoru.** 7 temel soru framework'ü, semptom vs neden ayrımı, 4 katmanlı 5-Why, hipotez ağacı, causal chain mapping. gembax intake Faz 4'ün temeli. |
| 35 | `rootcause-diagnosis-ref-questions-SKILL.md` | 297 | **Sektör-özel hipotez soruları.** Her sektör için derinleştirme soruları ve hypothesis trigger'lar. Müşteri tıkandığında kullanılır. |

---

## F. FİNANS & MUHASEBE (3 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 36 | `financial-intelligence-sc-SKILL.md` | 287 | **İsraf→$ dönüşüm motoru.** Operasyonel metrikleri (OEE, fire, stok gün) finansal dile çeviren köprü. Carrying cost, COPQ, throughput loss formülleri. |
| 37 | `gies-managerial-accounting-SKILL.md` | 679 | **Yönetim muhasebesi.** (UIUC Gies) Maliyet davranışları, CVP analizi, ABC costing, bütçeleme, transfer pricing, performans ölçüm. |
| 38 | `engineering-economy-SKILL.md` | 388 | **Mühendislik ekonomisi.** NPV, IRR, ROI, payback, paranın zaman değeri, yatırım alternatifleri karşılaştırma. gembax ROI hesabının temeli. |

---

## G. ÜRETİM & FABRİKA FİZİĞİ (6 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 39 | `mfgsys-moresight-SKILL.md` | 545 | **Fabrika fiziği temelleri.** Little's Law, kuyruk teorisi, variabilite, utilization-lead time ilişkisi, WIP yönetimi, kapasite analizi. |
| 40 | `mfgsys-moresight-ref-production.md` | 364 | **Üretim kontrol.** CONWIP, kanban, push/pull karşılaştırma, lot sizing, scheduling, lead time bileşenleri. |
| 41 | `mfgsys-moresight-ref-queueing.md` | 275 | **Kuyruk modelleri.** M/M/1, M/M/c, G/G/1 formülleri, bekleme süresi hesaplama, utilization etkisi. |
| 42 | `manufacturing-sc-SKILL.md` | 366 | **Üretim tedarik zinciri tasarımı.** MTS/MTO/ETO stratejileri, layout tasarım, envanter politikaları. |
| 43 | `manufacturing-sc-ref-queueing.md` | 297 | **SC kuyruk modelleri.** Tedarik zincirindeki bekleme ve darboğaz hesaplama araçları. |
| 44 | `managing-manufacturing-performance-SKILL.md` | 299 | **Üretim performans yönetimi.** OEE, TPM, SMED, kapasite planlama, performans metrikleri ve hedef belirleme. |

---

## H. OPERASYON YÖNETİMİ (4 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 45 | `gies-operations-management-SKILL.md` | 872 | **Operasyon yönetimi Part 1.** (UIUC Gies) Süreç analizi, kapasite, kuyruk, kalite, envanter temelleri. |
| 46 | `gies-operations-management-SKILL_2.md` | 1,730 | **Operasyon yönetimi Part 2.** (UIUC Gies) İleri konular: tedarik zinciri, forecasting, aggregate planning, scheduling, project management. |
| 47 | `gies-ops-mgmt-PART10-sc-operations.md` | 836 | **SC operasyonları.** (UIUC Gies) Supply chain koordinasyon, bullwhip effect, sourcing, lojistik, global SC yönetimi. |
| 48 | `moresight-manufacturing-knowledge.md` | 614 | **Üretim bilgi bankası.** Genel üretim kavramları, terminoloji, süreç tipleri, üretim stratejileri ansiklopedisi. |

---

## I. KALİTE (2 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 49 | `gies-quality-scm-SKILL.md` | 1,136 | **Kalite & SCM.** (UIUC Gies) TQM, ISO 9000, kalite maliyeti, tedarikçi kalite yönetimi, kalite iyileştirme araçları. |
| 50 | `gies-quality-spc-SKILL.md` | 733 | **İstatistiksel Proses Kontrol.** (UIUC Gies) Kontrol grafikleri (X-bar, R, p, c), proses yeteneği (Cp, Cpk), kabul örneklemesi. |

---

## J. TEDARİK ZİNCİRİ & LOJİSTİK (4 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 51 | `scp-foresight-SKILL.md` | 444 | **SC planlama.** Talep tahmin, S&OP, envanter optimizasyon, tedarik zinciri planlama prensipleri ve araçları. |
| 52 | `scp-foresight-ref-inventory.md` | 312 | **Envanter modelleri.** EOQ, safety stock, (s,Q) ve (s,S) modelleri, ABC-XYZ analizi, service level hesaplama. |
| 53 | `logistics-sc-toolkit-SKILL.md` | 199 | **SC pratik araç kutusu.** 100+ pratik operasyon aracı: warehouse layout, route optimization, KPI dashboard, vendor scorecard. |
| 54 | `balanced-scorecard-moresight-SKILL.md` | 559 | **Balanced Scorecard.** Kaplan & Norton BSC framework'ü: 4 perspektif, strateji haritası, KPI tasarımı, SC özel BSC uygulamaları. |

---

## K. SİSTEM OPTİMİZASYON (3 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 55 | `sysopt-moresight-SKILL.md` | 497 | **Sistem optimizasyonu.** Lineer programlama, network modelleri, simülasyon, karar analizi, çok kriterli karar verme. |
| 56 | `sysopt-moresight-ref-decomposition.md` | 280 | **Decomposition metodları.** Benders, Dantzig-Wolfe, Lagrangian relaxation — büyük ölçekli optimizasyon teknikleri. |
| 57 | `sysopt-moresight-ref-nonlinear.md` | 338 | **Nonlinear optimizasyon.** Gradient descent, Newton's method, KKT koşulları, convex optimization temelleri. |

---

## L. DİAGNOSTİK & ANKET (2 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 58 | `moresight-diagnostic-survey-SKILL.md` | 423 | **Diagnostik anket motoru.** moresight.io müşteri ön değerlendirme anketi tasarımı, "12 ay testi", önceliklendirme mantığı. |
| 59 | `opex-case-patterns-SKILL.md` | 230 | **50 case pattern kütüphanesi.** Sektör × problem pattern eşleştirmesi. Gerçek danışmanlık case'lerinden çıkarılmış çözüm kalıpları. |

---

## M. KÜÇÜK REFERANSLAR (5 dosya)

| # | Dosya | Satır | Özet |
|---|-------|-------|------|
| 60 | `kaizen-event-ref.md` | 104 | Kaizen event planlama ve yürütme rehberi. 5 günlük kaizen workshop yapısı. |
| 61 | `sustaining-lean-ref.md` | 86 | Lean dönüşümü sürdürülebilirlik riskleri ve önlemleri. "Neden lean çalışmalar geri kayar?" |
| 62 | `inventory-optimization-ref-ai.md` | 62 | AI destekli envanter optimizasyon yaklaşımları. ML tahmin, otomasyon fırsatları. |
| 63 | `sc-segmentation-optimization-ref.md` | 63 | Tedarik zinciri segmentasyon stratejileri. Ürün × pazar × kanal segmentleme. |
| 64 | `opex-concise-guide-ref.md` | 60 | OpEx özet kılavuz. Hızlı başvuru için operasyonel mükemmellik prensipleri. |

---

## N. KAYNAK KİTAPLAR & DİĞER (6+ dosya)

| # | Dosya | Satır/Boyut | Özet |
|---|-------|-------------|------|
| 65 | `877273345-Gemba-Walks-James-Womack-Z-Library.txt` | 7,531 | Womack "Gemba Walks" kitabı — tam metin. Purpose→Process→People. |
| 66 | `894318881-Gemba-Walks-Compress.txt` | 4,773 | Womack "Gemba Walks" — sıkıştırılmış versiyon. |
| 67 | `891095918-Lean-Analytics-PDF.txt` | 8,890 | "Lean Analytics" kitabı — startup ve SaaS metrikleri, funnel analizi. |
| 68 | `deep-research-report.md` | 467 | Derin araştırma raporu — pazar analizi veya sektörel araştırma çıktısı. |
| 69 | `gembax-landing-with-pricing.html` | — | gembax.ai landing page + pricing HTML kodu. |
| — | PDF'ler (3 adet) | — | Örnek Hidden Cost Report'lar (PrecisionMetalWorks, UrbanThread, template). |
| — | DOCX (1 adet) | — | UrbanThread Hidden Cost Report v2. |

---

## O. INTAKE SİSTEMİ v2.0 (YENİ — 2026-04-04)

> **Mimari değişiklik:** Form 2 e-posta tabanlı soru-cevap → randevulu AI chat session'a dönüştü.
> Detay ve tüm kararlar: `gembax-intake-blueprint-v2.md`

| # | Dosya | Özet |
|---|-------|------|
| 70 | `gembax-intake-blueprint-v2.md` | **MASTER REFERANS.** Tüm intake sistemi: 2 dokunuş akışı, soru yapısı, araştırma protokolü, chat mimarisi (FastAPI + n8n + Opus 4.6), system prompt yapısı, structured extraction, DSS 2-aşamalı, stakeholder doğrulama, veri talebi (Drive), Notion template, 9 teknik kırılma noktası + çözümleri, maliyet hesabı, tier farkları. |
| 71 | `gembax-conversation-decisions-2026-04-04.md` | **Karar özeti.** 2026-04-04 tarihli konuşmadan çıkan tüm ürün, mimari, UX ve maliyet kararları. Hızlı referans. |
| 72 | `gembax-intake-blueprint-v1.mermaid` | **Akış diyagramı.** Dokunuş 1 → ödeme → profil → Cal.com → araştırma → chat aktivasyonu → Dokunuş 2 → stakeholder → rapor. Renk kodlu. |
| 73 | `gembaxintakesorulariv3.xlsx` | **Soru envanteri.** 6 sheet: Akış Özeti, Araştırma Protokolü, Form 1 Sohbet, Form 1++ Profil, Dokunuş 2 Müşteri E-posta, Dokunuş 2 Stakeholder. |
| 74 | `gembax-stakeholder-operasyon.xlsx` | **Operasyon müdürü Excel template.** 7 soru (2 dropdown). Teyit formatında. GembaX site renkleri (açık tema). Her iki tier. |
| 75 | `gembax-stakeholder-finans.xlsx` | **Finans Excel template.** 6 soru (3 dropdown). Teyit formatında. Sadece $1,100. |
| 76 | `gembax-stakeholder-saha.xlsx` | **Saha sorumlusu Excel template.** 6 soru (2 dropdown). Teyit formatında. $1,100, opsiyonel. |
| 77 | `gembax-agent-prompt-v1.md` | **Eski agent prompt (referans).** Müşteri direkt Claude Project'e gelir modeli için yazılmış. Yeni mimaride Haiku + Opus system prompt'larına dönüşecek — implementasyon sırasında güncellenecek. |

### O.1 — Yeni Mimari Özeti

```
Form 1 (scripted chat) → Haiku 4.5 (derinlik + web araştırma)
    → Paddle ödeme → Form 1++ (profil)
    → Cal.com randevu (2+ gün sonra)

Murat: Araştırma protokolü (Perplexity/Statista, manuel)
    → Notion müşteri sayfası → hipotez + sorular
    → "Sorular hazır" ✓

n8n: Session config → SQLite → chat linki oluştur
    → Müşteriye "araştırmanız tamamlandı" e-postası (randevu-1 gün)

Form 2 (chat session) → Opus 4.6 + extended thinking (FastAPI, streaming)
    → Structured extraction (JSON)
    → Stakeholder Excel + Drive veri talebi (paralel)

Rapor → Opus 4.6 + extended thinking
```

---

## P. LEGAL & PRICING SAYFALARI (4 dosya)

| # | Dosya | Özet |
|---|-------|------|
| 78 | `terms-and-conditions.html` | Kullanım koşulları sayfası |
| 79 | `privacy.html` | Gizlilik politikası sayfası |
| 80 | `refund.html` | İade politikası sayfası |
| 81 | `pricing.html` | Fiyatlandırma sayfası |

---

## ⚠️ SİLİNMESİ GEREKEN ESKİ DOSYALAR

Bu dosyalar konsolidasyon sonrası artık gereksiz — yeni versiyonlar tarafından kapsanıyor:

| Dosya | Yerine Geçen | Neden Silinmeli |
|-------|-------------|-----------------|
| `gembax-system-prompt-v3.md` | → v4.md | v4 kapsıyor |
| `gembax-system-prompt-v3_2-PATCH.md` | → v4.md | v4'e entegre edildi |
| `gembax-formula-library-v1.md` | → v2.md | v2 kapsıyor |
| `gembax-formula-library-VAL-patch-v1.md` | → v2.md | v2'ye entegre edildi |
| `gembax-diagnostic-engine-bridge-patch-v1.md` | → v2.md | v2'ye entegre edildi |
| `gembax-intake-chat-SKILL-v4.md` | → v5.md | v5 kapsıyor (soru içeriği forms-v1'e devredildi) |

---

*gembax.ai Dosya Katalogu — 2026-04-04*
*82 dosya | Intake sistemi v2.0 eklendi (O bölümü)*
