# HCI Report — Outline & Evidence Map
## CHRISTIAN WIJAYA Luxury Fashion (CW / PREMIUM) — V0.2

**Document status:** outline only. No chapter has been written as final prose yet.
**Prepared:** 10 November 2026
**Prepared from:** the actual running project, its real-browser screenshots, and its verified QA results.

---

### How to read this document

Every section below carries one of three markers. Please keep them accurate as the report is written.

| Marker | Meaning |
|---|---|
| **VERIFIED** | Established from the real project. Factually correct today; can be written directly. |
| **DERIVED** | A reasoned interpretation of the project (e.g. *why* a design choice was made). Must be reviewed by the author — it is not a machine-verified fact. |
| **PENDING** | Needs a human input that does not yet exist: a survey, a usability session, or the assignment rubric. **Do not fill these in by inventing data.** |

> **The single most important accuracy rule for this report:** automated QA proves the software behaves. It does **not** prove a person can use it well. Chapter 14 (Usability Evaluation) must contain results from real participants. Until those sessions happen, that chapter must be marked as pending — an invented usability study would misrepresent the work and is worse than an empty chapter.

---

## Table of contents

| # | Chapter | Status |
|---|---|---|
| 1 | [Introduction](#1-introduction) | Partly VERIFIED, partly PENDING |
| 2 | [Problem Statement](#2-problem-statement) | DERIVED |
| 3 | [Project Objectives](#3-project-objectives) | VERIFIED |
| 4 | [Target Users](#4-target-users) | DERIVED — needs confirmation |
| 5 | [User Requirements](#5-user-requirements) | DERIVED — needs confirmation |
| 6 | [User Persona](#6-user-persona) | DERIVED — needs confirmation |
| 7 | [User Journey](#7-user-journey) | VERIFIED (from the built flow) |
| 8 | [Information Architecture](#8-information-architecture) | VERIFIED |
| 9 | [User Flow](#9-user-flow) | VERIFIED |
| 10 | [Wireframes and UI Design](#10-wireframes-and-ui-design) | PENDING — no wireframe artefacts |
| 11 | [Design System](#11-design-system) | VERIFIED |
| 12 | [HCI Principles](#12-hci-principles) | VERIFIED |
| 13 | [System Implementation](#13-system-implementation) | VERIFIED |
| 14 | [Usability Evaluation](#14-usability-evaluation) | **PENDING — requires real participants** |
| 15 | [Functional Testing](#15-functional-testing) | VERIFIED |
| 16 | [Responsive Testing](#16-responsive-testing) | VERIFIED |
| 17 | [Accessibility Evaluation](#17-accessibility-evaluation) | VERIFIED + PENDING |
| 18 | [Conclusion](#18-conclusion) | PENDING (written last) |
| 19 | [Future Improvements](#19-future-improvements) | VERIFIED (from known issues) |
| 20 | [References](#20-references) | PENDING |

---

## 1. Introduction

**Purpose.** Open the report: name the product, the house, the line, and the discipline (HCI), and state what the report covers.

**Content to cover.**
- What CHRISTIAN WIJAYA is: a fashion house founded 2016 in Bandung. **VERIFIED**
- Its first line, **CW / PREMIUM** — "Contemporary Luxury", Autumn/Winter 2026. **VERIFIED**
- The subject of the report: the **web storefront prototype** for that house and line.
- The three roles this document serves: academic (HCI method), academic (design rationale), practical (what a user gets).
- A short "how to read this report" note stating that the testing chapters separate **automated verification** from **human evaluation**. **VERIFIED**

**Evidence available.** All ten live pages; the brand architecture page (`collections.html`) already explains the house → line structure in the product's own words.

**PENDING.** Confirm the course brief's required framing, the word count, and the assessment rubric before drafting. See §21.

---

## 2. Problem Statement

**Purpose.** State the user problem the system addresses, and the constraints it operates under.

**Content to cover.**
- The general problem: buying considered clothing online requires navigating a large catalogue, judging fit and variant from limited information, and completing a checkout that must handle local payment conventions.
- The specific problem this prototype addresses: a single-house, single-line catalogue where the shopper must move from discovery → variant selection → cart → a **country-aware, IDR-priced checkout with locally familiar payment methods**.
- The constraints that shaped the design, all **VERIFIED** from the build:
  - The primary market is **Indonesia**, so prices are Rupiah and the default country is Indonesia (+62).
  - Payment must work with **Indonesian** methods — bank transfer / virtual account, QRIS, digital wallets, COD — alongside cards.
  - The site must remain a **front-end prototype**: no payment gateway, no card data stored or transmitted.
- Cite the National **zero** payment failures and error handling as a design problem the prototype solves.

**PENDING.** Any market-research or literature framing (e.g. why e-commerce UX fails in this market) must come from real cited sources, not from assertion.

---

## 3. Project Objectives

**Purpose.** List what the build set out to achieve, in a form that can later be checked against Chapter 15–17.

**Content to cover.** These are the objectives the implementation actually delivers — **all VERIFIED**:

1. Present a complete shopping journey across **10 pages**: Home, Shop, Collections, Product Detail, Cart, Checkout, Order Confirmation, Wishlist, Promotion, About.
2. Organise the catalogue around a **house-and-line brand architecture** (CHRISTIAN WIJAYA → CW / PREMIUM) rather than categories-as-brands.
3. Price and format money **consistently in Indonesian Rupiah** through a single central formatter.
4. Support **country/region selection with a separate dialling code and national phone number**.
5. Offer **five Indonesian payment methods**, each showing only its own fields, all simulated.
6. Keep cart state **consistent across every view** — badge, cart page, checkout summary and order totals.
7. Meet **WCAG-oriented accessibility** targets and remain usable from 390 px to 1440 px.

**Evidence available.** Every objective above has a matching verified test in `documentation/QA_REPORT.md`. Consider adding an objective→evidence traceability table.

---

## 4. Target Users

**Purpose.** Define who the system is for.

**Content to cover.**
- **Primary — the considered buyer in Indonesia.** Comfortable with e-commerce, buys occasion and tailoring pieces, values the sub-brand story, expects Rupiah prices and local payment rails. **DERIVED** from the market, country and payment decisions actually built.
- **Secondary — the regional/international buyer.** Directly supported: 9 selectable countries, per-country dialling codes, per-country payment sets and card networks (e.g. GPN for Indonesia, Amex/JCB/UnionPay elsewhere), and per-country wallets. **VERIFIED**
- **Tertiary — the house client.** Addressed by About, Promotion, the wishlist and the newsletter. **VERIFIED**

**PENDING — needs confirmation.**
- Real demographic/psychographic data if the course requires it. **Do not invent survey numbers.**
- If you have informal observations or interviews with potential users, cite them properly (participant count, method, date).

---

## 5. User Requirements

**Purpose.** Translate needs into concrete requirements, ideally traceable to the build.

**Content to cover.** A requirement table with columns: **ID · Requirement · Priority (MoSCoW) · Where satisfied · Verified by**.

Requirements are **VERIFIED** when they map to a real feature; example rows:

| ID | Requirement | Priority | Satisfied at | Verified by |
|---|---|---|---|---|
| R-01 | Browse the full catalogue | Must | `shop.html` | QA T2 — 16 cards render |
| R-02 | Filter by category, price, colour, rating | Must | `shop.html` | QA T2 — filter, search, sort |
| R-03 | Judge a piece before adding it | Must | `product.html` | QA T2 — PDP honours `?id=` |
| R-04 | See prices in local currency | Must | all pages | QA T4 — no `$`/`USD` on any page |
| R-05 | Select country and enter a national phone number | Must | `checkout.html` | QA T4 — `+62` chip, `tel-national` |
| R-06 | Pay by a familiar local method | Must | `checkout.html` | QA T4 — card/VA/QRIS/wallet/COD |
| R-07 | See only the fields relevant to the chosen method | Should | `checkout.html` | QA T4 — exactly one panel visible |
| R-08 | Cart state consistent everywhere | Must | all pages | QA T3 — badge = summary Items = Qty |
| R-09 | Never store card data | Must | `script.js` | QA T4 — PAN/CVC absent from storage |
| R-10 | Usable on a phone | Must | all pages | QA 3.1 — 131 viewport cases |

**PENDING.** Confirm whether the course expects requirements gathered *from* users (interviews/survey) rather than derived from the build. If so, that collection has not been done yet — see §21.

---

## 6. User Persona

**Purpose.** One representative persona to carry through the journey and evaluation.

**Content to cover.** A persona card with: name/photo placeholder, demographics, goals, frustrations, skills, tech comfort, and **shopping context** (device, payment preference). Then, critically, **the persona's tasks must be the same tasks used in Chapter 14**, so the evaluation tests the persona rather than the reverse.

**DERIVED — needs confirmation.** A plausible persona may be drafted from the Target Users section, but it must be clearly presented as a **design-derived persona**, not as a researched one, unless real research backs it.

**PENDING.** If the course requires a researched persona, participant data is needed.

---

## 7. User Journey

**Purpose.** The emotional/experience arc across the journey, stage by stage.

**Content to cover.** A stage-by-stage table — **Stages: Discover → Evaluate → Select variant → Review cart → Identify → Pay → Confirm → Return**. For each: what the user does, what the system shows, the emotion at that stage, and any friction point.

Ground the journey in the real flow — **VERIFIED**:
- Discovery: announcement bar ("Free shipping on orders over Rp 1.500.000"), featured grid, brand story, category tiles.
- Evaluation: filter/sort/search on `shop.html`; rating + review counts, price, "old price" sale treatment on cards.
- Selection: PDP with images, size/colour pickers, sold-out sizes marked, rating, delivery promise, related pieces.
- Cart: quantity stepper, remove, live badge, order summary.
- Identify: country selector, separate dialling code + phone, address, city, postcode.
- Pay: five methods, method-specific panels, live order summary.
- Confirm: order number, ETA, total, delivery method, payment record, item list.
- Return: wishlist, promotion, newsletter, account.

**Evidence available.** `screenshots/{desktop,tablet,mobile}/` capture stages 1–7 in all three viewports.

---

## 8. Information Architecture

**Purpose.** Show how content is organised and why.

**Content to cover.**
- **Brand-first architecture** — the site's organising idea is house → line → room, not category → product. This is stated on `collections.html` and encoded in the catalogue data (`brand: 'CW / PREMIUM'` on every product). **VERIFIED**
- The four rooms: **Men (5), Women (5), Shoes (3), Accessories (3) = 16 pieces**. **VERIFIED**
- The navigation tree (see §8.1).
- Site map figure.

### 8.1 Navigation map — VERIFIED

```
CHRISTIAN WIJAYA
├── Home            index.html        hero · featured · brand story · rooms · promotion · craft · journal · newsletter
├── Shop            shop.html         16 pieces · filter (category, price, colour, rating) · search · sort · quick add
├── Collections     collections.html   house → line → CW / PREMIUM → four rooms → reordered pieces
├── Promotion       promotion.html     4 campaigns (40% / 30% / 25% / 20% off) · gifting · terms
├── About           about.html        2016 Bandung · craft (41 hrs per jacket) · 3 principles · 8 house statistics
├── Product Detail  product.html?id=  gallery · price · size/colour · rating · delivery promise · add to cart
├── Wishlist        wishlist.html     saved pieces · toggle · badge
├── Cart            cart.html         line items · qty ± · remove · live summary · checkout CTA
├── Checkout        checkout.html     3 steps (Cart → Details → Confirmation) · contact · country/phone · address · shipping · payment · summary
└── Confirmation    confirmation.html order number · ETA · total · delivery · payment record · items
```
Also global: announcement bar, primary nav, wishlist + cart badges, search, auth modal, toast notifications, mobile drawer, footer with newsletter + legal links.

---

## 9. User Flow

**Purpose.** The decision logic of the purchase path, not just the sequence.

**Content to cover.** A flow diagram with branches and **every guard/error path the build actually contains** — all **VERIFIED**:
- Empty cart → Cart shows an empty state; Checkout shows a guard and hides the form (`data-checkout-guard`).
- Payment method not selected → submit blocked, `[data-payment-error]` revealed.
- Shipping method not selected → submit blocked.
- Card selected but no card network → blocked, `[data-err="cardtype"]`.
- Card fields validated only when the card method is chosen (name, 12+ digit number, `MM/YY`, 3+ digit CVC).
- Phone validated as a national number, 6–15 digits after stripping separators.
- Invalid fields get `.is-invalid` + a written error message; focus moves to the first bad field; a toast confirms.
- Order placed → cart cleared, order snapshot written, redirect to Confirmation.
- Country change → dialling code, payment set, card networks and wallets all re-derive for the new country.

**Evidence available.** QA T4 covers each of these branches with an executed assertion.

---

## 10. Wireframes and UI Design

**Purpose.** Show the design, not just describe it.

**Content to cover.**
- Low-fidelity wireframes for the key screens (Home, Shop, PDP, Cart, Checkout, Confirmation).
- Annotated high-fidelity screens using the **real** screenshots in `screenshots/`.
- Callouts for: the announcement bar, the sticky order summary, the three-step checkout indicator, the country/dialling split, the method-specific payment panels, the toast notifications, and the mobile drawer.

**PENDING — no wireframe artefacts exist.**
- The project contains **no wireframe files**. The only pre-existing design artefact is the single 1366×627 image embedded in `HCI.docx` (preserved at `documentation/legacy/HCI_docx_embedded_image1.png`), which is an early mockup of the homepage and predates the current build by roughly five months.
- **Options:** (a) draw wireframes from the real screenshots and label them clearly as reverse-engineered from the implementation, or (b) state in the report that the project moved from a static mockup straight to a high-fidelity build. **Do not present the old mockup as the current design** — it does not match the built site.

**Evidence available.** 15 real screenshots, 3 viewports × 5 pages, byte-verified and indexed in `screenshots/MANIFEST.md`.

---

## 11. Design System

**Purpose.** Document the system behind the visual identity. All values below are **VERIFIED** and taken directly from `style.css` `:root`.

### 11.1 Colour — with the contrast decisions already reasoned in the code

| Token | Value | Role | Contrast note (from `style.css`) |
|---|---|---|---|
| `--color-black` | `#111111` | ink | — |
| `--color-white` | `#FFFFFF` | surfaces | — |
| `--color-cream` | `#F7F4EF` | page background | — |
| `--color-sand` | `#E8E2D8` | secondary fill | — |
| `--color-border` | `#DDDDDD` | rules | — |
| `--color-accent` | `#C7A46A` | decorative rules, dots | 2.14:1 on cream → **fails AA as text** |
| `--ink` | `#111111` | primary text | **17.2:1** |
| `--ink-soft` | `#45423D` | body copy | **9.1:1** |
| `--ink-mute` | `#67635C` | meta, captions | **5.5:1** |
| `--gold-ink` | `#7A5F2D` | accent **text** | **5.5:1** |
| `--sale` | `#8A2B1F` | sale price (oxblood) | **8.1:1** |
| `--success` | `#2F5D3F` | confirmation | **6.5:1** |
| `--danger` | `#8C2B20` | validation errors | **7.3:1** |

**Design rationale to state (DERIVED):** the accent gold is deliberately restricted to decoration, and a separate darker `--gold-ink` carries accent *text* so the accent never becomes the only carrier of meaning. The same reasoning demoted `--color-gray` (4.08:1) in favour of `--ink-mute` (5.5:1). These are real decisions already made in the code — say them.

### 11.2 Typography — VERIFIED
- **Display/serif:** Playfair Display → Didot → Bodoni MT → Hoefler Text. Used for headlines, brand voice.
- **UI/sans:** Jost → Futura → Helvetica Neue → Arial. Used for body, controls, labels.
- **Scale:** `--step--1` 12px (meta) · `--step-0` 14px (UI default) · `--step-1` 16px (body) · `--step-2` 20px · `--step-3` 24px · `--step-4` 32px · `--step-5` 44px · `--step-6` 56px (section titles) · `--step-7` `clamp(2.5rem, 6vw, 4.75rem)` (display).

### 11.3 Spacing, layout, motion — VERIFIED
- **Spacing scale:** `--s-1` 4px → `--s-10` 128px (4, 8, 12, 16, 24, 32, 48, 64, 96, 128).
- **Container** 1280px · **Gutter** `clamp(1.25rem, 4vw, 3.5rem)` · **Section rhythm** `clamp(3.5rem, 9vw, 7rem)`.
- **Radius** 2px (4px large) — near-square, deliberately not rounded.
- **Form field height** 52px · **Header height** 74px.
- **Motion** 0.26s, `cubic-bezier(0.2, 0.6, 0.2, 1)`; `prefers-reduced-motion` honoured.
- **Z-index ladder:** header 100 · drawer 200 · modal 300 · toast 400.

### 11.4 Component inventory — VERIFIED
Announcement bar · primary nav · nav drawer · search · icon button with count badge · product card · price block · rating · quantity stepper · line item · radio card · chip group · field with error · text link (`.link`) · underlined link · summary block · toast · auth modal with tabs · empty state · stat block · promo card · story card.

---

## 12. HCI Principles

**Purpose.** Show the reasoning, not just the heuristics. Each principle must cite a **real implementation** in this project.

| Principle | How this project applies it | Evidence |
|---|---|---|
| **Visibility of system status** | Live cart/wishlist badges, order summary that updates with every change, toasts after every action, payment step indicator | `script.js` paint/subscribe; QA T3, T4 |
| **Match between system and real world** | Indonesian phrasing ("Will be saved as +62 …"), Indonesian banks and wallets, local courier language, Rupiah throughout | QA T4 |
| **User control and freedom** | Quantity ±, remove line, back-navigable steps, dismissible modal, logout | QA T3, T4b |
| **Consistency and standards** | One currency formatter, one cart state, one spacing scale, house→line naming used everywhere | QA T1, T4 |
| **Error prevention** | Cart lines normalised on load (stale/unknown product IDs and variants are dropped and merged); quantities clamped 1–10; duplicate variants merged into one line | QA T3 "stale id" case |
| **Recognition rather than recall** | Visible dialling code chip beside the phone field, per-line "Qty n", per-country card networks, populated order summary | QA T4 |
| **Flexibility and efficiency of use** | Search + category/price/colour/rating filters + sort; quick-add from cards; remembered shipping speed | QA T2 |
| **Aesthetic and minimalist design** | Near-square radius, one accent used decoratively only, restrained type scale, cream field | `style.css` §11 |
| **Help users recognise, diagnose and recover from errors** | Every invalid field gets a written, specific message (not "invalid input"); error summary via toast; focus moves to the first bad field | QA T4, T4b |
| **Help and documentation** | Field hints ("Enter the Indonesia number only."), country hint, demo disclaimers on QRIS/VA/wallet, empty states | QA T4 |
| **Error-free operation (heuristic evaluation)** | 256 automated cases, 0 failures | `documentation/QA_REPORT.md` |

**PENDING.** If the course requires Nielsen's ten heuristics *by name*, map the table above onto the canonical list.

---

## 13. System Implementation

**Purpose.** Describe how it was built. **All VERIFIED from the source.**

### 13.1 Architecture — VERIFIED
- **Plain HTML, CSS and vanilla JavaScript.** No framework, no build step, no package manager, no dependencies. Open any `.html` file and it runs.
- 10 HTML pages, one stylesheet (`style.css`, ~79 KB), one script (`script.js`, ~121 KB).
- **Progressive enhancement style:** each page controller self-activates by mounting element presence, so every page is independently addressable.

### 13.2 Files — VERIFIED
| File | Role |
|---|---|
| `index.html` … `about.html` (10) | One file per page |
| `style.css` | One stylesheet, token-driven, 624 rules |
| `script.js` | Catalogue, store, controllers (18 numbered sections) |
| `favicon.ico` | CW monogram, 16/32/48 px |
| `tests/verify_selectors.py` | Bidirectional CSS/markup selector checker |
| `tests/_harness.html`, `tests/_a11y.html` | Browser test harnesses |
| `backup_original/`, `backup_pre_phase3/` | Preserved backups |

### 13.3 Data model — VERIFIED
- **Catalogue** is a single in-source array: `id`, `name`, `price`, optional `oldPrice`, `category`, `brand`, `rating`, `reviews`, `colors[]`, `sizes[]`, `soldOutSizes[]`, `images[]`, `details[]`.
- **Brand architecture** is data, not markup: `HOUSE` (CHRISTIAN WIJAYA, Luxury Fashion, founded 2016, Bandung) and `LINE` (`cw-premium`, CW / PREMIUM).
- **Regions** are data: 9 countries, each with a dialling code, plus per-region card networks, wallets and payment sets.
- **Prices** are stored as plain integers in Rupiah and formatted only at render time by `money()`.

### 13.4 State & persistence — VERIFIED
`localStorage` keys: `cw_cart` · `cw_wishlist` · `cw_user` · `cw_shipping` · `cw_last_order`. Reads are normalised; writes are centralised through one `sync()`.

### 13.5 Central configuration — VERIFIED
`CONFIG = { currency: 'IDR', locale: 'id-ID', freeShippingThreshold: 1500000, shippingFlat: 25000, taxRate: 0.08 }`, with `money()` as the single formatter via `Intl.NumberFormat`. **No price symbol or separator is hard-coded anywhere else** — this is why switching currency is a one-line change.

### 13.6 Checkout rules — VERIFIED
- Tax = `round(subtotal × 0.08)` — a single explicit rule, not a guess.
- Shipping: standard free; express Rp 25.000; free-shipping threshold Rp 1.500.000.
- `Total = subtotal + shipping + tax`, always computed, never hard-coded.

### 13.7 Payment integration — VERIFIED
All payment flows are **simulated**. No gateway, no network call, no card data written anywhere. Virtual account numbers use deliberately fictional 3-digit bank prefixes (880–893) so they are obviously not real. QA T4 asserts the card PAN and CVC never appear in storage.

---

## 14. Usability Evaluation

> **STATUS: PENDING — this chapter cannot be written from the current evidence.**
>
> **Automated QA is not usability testing.** The 256 automated cases prove the interface *behaves*. They say nothing about whether a first-time visitor can find a shirt, choose a size, or complete a checkout without hesitation. Writing this chapter from the QA data would misrepresent what was done.

**What is required to complete it.**
1. **Participants.** ~5 target users is a reasonable minimum for an HCI submission.
2. **Tasks** — the eight you specified map directly onto the real interface:
   | # | Task | Target screen | What to observe |
   |---|---|---|---|
   | 1 | Find a specific product | `shop.html` | Search usability, filter discoverability |
   | 2 | Filter the catalogue | `shop.html` | Can they find the filter controls? |
   | 3 | Open a product detail | `product.html` | Comprehension of size/colour/price/rating |
   | 4 | Add to cart | `product.html` | Variant selection, feedback that it worked |
   | 5 | Change quantity | `cart.html` | Control discoverability, whether the badge update is noticed |
   | 6 | Complete the checkout form | `checkout.html` | Country/phone split comprehension; field errors |
   | 7 | Choose a payment method | `checkout.html` | Whether the 5 methods and their panels are clear |
   | 8 | Finish the order | `confirmation.html` | Whether the outcome is understood |
3. **Record per participant:** task success (yes/no/partial), time on task, errors and recovery, and verbatim comments. Also capture whether the participant noticed the **"Will be saved as +62 …"** hint and whether they understood that the dialling code is separate from the number.
4. **Ethics/record-keeping:** note consent and anonymity. Store the raw notes as `documentation/usability/` and link screenshots from `screenshots/testing/`.

**Template already prepared.** `screenshots/testing/` exists and is reserved for usability-test evidence. It currently holds only the favicon preview.

**Do not fill this chapter until the sessions have happened.**

---

## 15. Functional Testing

**Purpose.** Present the verified functional evidence. **All VERIFIED — copy from `documentation/QA_REPORT.md`.**

- **Method:** a headless-DOM harness drives the **real** pages served over HTTP, seeding `localStorage` *before* page scripts run, so each page boots exactly as a returning visitor's would.
- **Coverage:** 125 cases — Navigation (4), Catalog (13), Cart (16), Checkout (51), Auth & Wishlist (26), Responsive static analysis (9), Accessibility & Technical (6).
- **Result:** **123 PASS · 0 FAIL · 2 BLOCKED.**
- **The 2 BLOCKED cases were responsive viewport checks** (visual layout, horizontal overflow in a live viewport), blocked because no browser was attached to that run. **Both were subsequently executed and PASSED** in the Phase 3.1 real-browser suite. They were left recorded as BLOCKED in the Part A table on purpose — the historical result was not rewritten.
- **Bugs found and fixed during testing (VERIFIED):**
  - **BUG-1 — duplicate bank cards.** Expanding "View all banks" rendered all 14 banks *plus* the 6 popular ones already listed: 20 cards for a 14-bank catalogue. Root cause: the expanded grid was filled with the whole bank array instead of the remainder. Fixed by filtering to non-popular banks. **6 + 8 = 14 cards, 0 duplicates.**
  - **BUG-2 — touch targets below WCAG 2.2 SC 2.5.8.** Footer links 19.8 px, "Continue shopping" 20.8 px, cart "Remove" 22.8 px, section-head links 23.8 px — all under the 24×24 px minimum. Fixed with an invisible pseudo-element hit-area expansion so the visible design does not move. Verified with `elementFromPoint()` probing 6 px above and below each control.
- **Also confirmed:** card number and CVC never persisted; every total computed; no `$`/`USD` anywhere; no broken internal links; no missing images; no unlabelled controls; no image without `alt`; no console errors.

**Suggested figure.** Use `screenshots/testing/` plus a results table per group.

---

## 16. Responsive Testing

**Purpose.** Present the real-browser viewport evidence. **All VERIFIED.**

- **Method:** the **locally installed Google Chrome 157** driven over the DevTools Protocol via `puppeteer-core` — a genuine Blink rendering engine, so every figure is a measurement rather than a CSS inference.
- **Viewports:** Desktop **1440×900**, Tablet **834×1112**, Mobile **390×844**.
- **Pages at every viewport:** Home, Shop, Product Detail, Cart, Checkout — **5 × 3 = 15 combinations**.
- **Result:** **131 PASS · 0 FAIL · 0 BLOCKED.**
- **What was measured:** `scrollWidth` vs `clientWidth`; every element rect against the viewport (excluding anything an ancestor clips); `scrollWidth` vs `clientWidth` on every clipped-overflow element; pairwise intersection of every `main > *` block plus header and footer; image rendered size, zero-size images, viewport-wider images, missing `width`/`height` attributes; navigation state per viewport; tap area probed with `elementFromPoint()`; checkout input heights and radio-card targets; console errors.
- **Headline results:**
  - **Zero horizontal overflow** at 1440, 834 and 390 px on all five pages.
  - **Zero elements** past the viewport, **zero clipped text**, **zero overlapping blocks**.
  - **All images** render at usable size with `width`/`height` attributes reserved.
  - **Navigation adapts correctly** — full nav on desktop, hamburger on tablet and mobile.
  - **Tap areas compliant** after BUG-2; radio cards measure 79 px tall; checkout text inputs 40 px+.
- **Visual evidence:** all 15 captures are in `screenshots/`, indexed with SHA-256 hashes in `screenshots/MANIFEST.md`.

**Suggested figure.** A 3×5 contact sheet of the screenshots — this is the strongest evidence the project has.

---

## 17. Accessibility Evaluation

**Purpose.** Present the accessibility position honestly, separating what was measured from what was not.

### 17.1 Verified — automated checks — VERIFIED
| Area | Result | Where |
|---|---|---|
| Image `alt` attributes | every `<img>` has one, across all 10 pages | QA T6 |
| Form labelling | 0 unlabelled controls — `<label for>`, wrapping label, `aria-label` or `aria-labelledby` | QA T6 |
| Focus visibility | `:focus-visible` styles defined | QA T6 |
| Skip link | present on all 10 pages | QA T6 |
| Document structure | exactly one `<main>` and one `<footer>` per page | QA T6 |
| Contrast | text tokens carry documented ratios: ink 17.2:1, body 9.1:1, muted 5.5:1, accent-text 5.5:1, sale 8.1:1, success 6.5:1, danger 7.3:1 | `style.css` |
| Target size | all interactive controls now ≥24×24 px effective; radio cards 79 px | QA 3.1 |
| Keyboard support | Escape closes modal, focus trapped in modal, focus moves to the first invalid field | QA T4b |
| Announcements | toast stack is an `aria-live="polite"` region; cart badge count exposed to screen readers | `script.js` |
| Reduced motion | `prefers-reduced-motion` honoured | `style.css` |
| Zoom / reflow | no horizontal overflow at 390 px, so no loss of content on small screens | QA 3.1 |

### 17.2 Known gaps — state these, don't hide them — VERIFIED
- Two **dead CSS selectors** (`.on-dark`, `.split--flip`) — no effect, but they mean `tests/verify_selectors.py` exits non-zero.
- **Vestigial `data-panel="paypal"`** in `checkout.html` — permanently hidden, unreachable for Indonesia, but it is dead markup.
- Inline prose links are below 24 px tall — **exempt** under WCAG 2.5.8, and deliberately left alone.

### 17.3 PENDING — requires human evaluation
- **Screen-reader pass** (NVDA / VoiceOver): the flow has the right semantics, but assistive-technology behaviour is unverified.
- **Keyboard-only walkthrough** by a person: automated checks confirm focus *styles* exist, not that the order feels natural.
- **Real-device touch comfort**, and the mobile drawer gesture.
- Any formal audit tool (axe, Lighthouse, WAVE) — not yet run; consider adding one.

---

## 18. Conclusion

**Purpose.** Close the report. Write this **last**.

**Content to cover.**
- What was built: a complete 10-page Indonesian-market storefront for a fashion house and its first line.
- What was verified: 256 automated cases with 0 failures across behaviour, layout and accessibility — and what that does and does not prove.
- What remains open: the human usability evaluation.
- The honest position on readiness.

---

## 19. Future Improvements

**Purpose.** A grounded roadmap, drawn from real known issues rather than generic wish-list.

**Priority 1 — close the evaluation gap**
1. Run the human usability study (§14) and publish the results.

**Priority 2 — quality**
2. Harden the auth handlers to use the existing `formField(form, name)` helper instead of the raw `HTMLFormElement` named getter, so a renamed field degrades gracefully instead of throwing.
3. Remove the two dead CSS selectors and the vestigial PayPal panel.
4. Add a favicon `<link rel="icon">` declaration (the file now exists at the project root; an explicit declaration would let a themed icon ship).
5. Run an automated accessibility audit (axe/Lighthouse) and record the score.

**Priority 3 — product**
6. Real payment-gateway integration (out of scope for the prototype, but it is the actual path to production).
7. A real account/session backend behind `cw_user`.
8. Order history and returns tracking.
9. Multi-language (ID/EN) — the copy is already region-aware.

**PENDING.** Confirm the course rubric before committing to a scope, and check whether the instructor has specified a rubric or brief — see §21.

---

## 20. References

**Content to cover.**
- **Product imagery.** The catalogue photographs are Unsplash images, delivered from `img/opt/` at three widths (240 / 700 / 1200 / 1920). The original `HCI.docx` already carried four Unsplash collection links as its reference list — **these should be retained and expanded**, and every source credited. **VERIFIED** (from the preserved docx)
- **Typefaces.** Playfair Display and Jost, both open-licence, referenced by the stylesheet.
- **Standards.** WCAG 2.2 (SC 1.4.3 contrast, SC 2.5.8 target size, SC 2.4.1 bypass blocks, SC 2.1.1 keyboard).
- **Standards/tools.** HTML Living Standard, CSS Cascade, ECMAScript; `Intl.NumberFormat` for locale-aware currency.
- **Tools used in testing.** Google Chrome 157 (DevTools Protocol), `puppeteer-core`, jsdom, Python `zipfile`/`hashlib`.

**PENDING.** The HCI literature actually cited (Nielsen, Krug, Preece, Benyamin, and the papers behind your research questions) must be added here — **do not leave this section as a placeholder**.

---

## 21. Open questions requiring the author or instructor

**Answer these before drafting.** Items 1–3 are structural; 4–8 are content that cannot be produced without human input.

1. **Is there an official assignment brief or grading rubric?** Structure, required chapters, length, and format (DOCX/PDF/Markdown) should follow it rather than my 20-section default. If a rubric exists, send it and the outline should be re-mapped onto it.
2. **Is the report to be submitted as `.docx`?** `HCI.docx` already exists and is preserved; the outline and QA report are Markdown.
3. **Is a group or individual submission?** Affects how the contribution and the usability study are described.
4. **Do the course requirements demand user research (survey/interviews)?** No survey or interview data exists yet.
5. **Do they require a researched persona?** The persona in §6 is design-derived.
6. **How many usability participants, and is a consent form required?** The 8 tasks in §14 are ready to run.
7. **Is the design to be justified against Nielsen's 10 heuristics specifically?**
8. **Which pages must be shown in the report?** The 15 screenshots cover Home, Shop, Product Detail, Cart and Checkout; About, Collections, Promotion, Wishlist and Confirmation have no captures yet and can be produced on request.

---

## Appendix A — Evidence index

| Chapter | Evidence in this project | Status |
|---|---|---|
| 1–3 | Live site; `collections.html`; `script.js` brand + config blocks | VERIFIED |
| 4–6 | Derived from the built market, country and payment decisions | DERIVED — needs confirmation |
| 7–9 | Real flow, guards and branches; QA T3/T4 assertions | VERIFIED |
| 10 | 15 screenshots; **no wireframe artefacts**; legacy mockup preserved | PENDING (wireframes) |
| 11 | `style.css` `:root` — colours with ratios, type scale, spacing, motion | VERIFIED |
| 12 | 11 named principles, each mapped to a real implementation | VERIFIED |
| 13 | Source: 10 HTML, 1 CSS, 1 JS, `localStorage` schema, `CONFIG` | VERIFIED |
| 14 | — | **PENDING — needs real participants** |
| 15 | `documentation/QA_REPORT.md` Part A — 125 cases, BUG-1, BUG-2 | VERIFIED |
| 16 | `documentation/QA_REPORT.md` Part B — 131 cases, 15 screenshots | VERIFIED |
| 17 | QA T6 + viewport tap-area cases + contrast ratios in CSS | VERIFIED + PENDING (AT, keyboard, device) |
| 18–19 | Known issues list | VERIFIED / written last |
| 20 | Unsplash credits from the preserved docx; WCAG; tooling | PENDING (literature) |

## Appendix B — Evidence collected in this phase

| Path | Contents |
|---|---|
| `screenshots/desktop/01–05-*.png` | Home, Shop, Product Detail, Cart, Checkout at 1440×900 |
| `screenshots/tablet/01–05-*.png` | The same five at 834×1112 |
| `screenshots/mobile/01–05-*.png` | The same five at 390×844 |
| `screenshots/testing/favicon-preview.png` | Favicon at 16/32/48/96 px |
| `screenshots/MANIFEST.md` | Every capture with size and SHA-256, verified byte-identical to source |
| `documentation/QA_REPORT.md` | Full QA report, 256 cases |
| `documentation/legacy/HCI_docx_embedded_image1.png` | The one image embedded in the original `HCI.docx` (1366×627 early mockup) |
| `documentation/HCI_Report_Outline.md` | This document |

`HCI.docx` itself was **not** deleted, modified or overwritten.
