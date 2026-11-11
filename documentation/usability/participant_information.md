# Participant Information & Intake Form
### CHRISTIAN WIJAYA Luxury Fashion — CW / PREMIUM · Usability Evaluation

**Status:** BLANK TEMPLATE. No participant has been tested yet. No field below has been filled in.

**Purpose of this form:** to capture enough context to interpret the session, and no more. It supports the research question — *can a first-time shopper complete a purchase on an Indonesian-market luxury storefront?* — and nothing beyond it.

---

## 1. Anonymity system

Each participant is given a sequential ID. **The ID is the only identifier used anywhere in the study.** No names, no contact details, no email addresses, no student IDs, no employer, no face photographs of participants.

| ID | Reserved for |
|---|---|
| P01 | Participant 1 |
| P02 | Participant 2 |
| P03 | Participant 3 |
| P04 | Participant 4 |
| P05 | Participant 5 |

**Rules for using the ID system.**
1. IDs are **assigned in the order participants are tested** and never reused.
2. The ID appears on the observation sheet, the questionnaire and any session artefacts (screen recordings, notes).
3. The **master list linking a name to an ID stays on the moderator's own device** and is deleted once the study closes. It is never submitted with the report.
4. If a participant withdraws, delete their row and every artefact carrying their ID.

---

## 2. Intake form (complete before the session starts)

> Fill this in during a short pre-session chat, or let the participant complete it themselves on paper.
> **Read every question aloud** so participants know what is being recorded and why.

| # | Field | Format / options | Required? |
|---|---|---|---|
| 1 | **Participant ID** | `P0_` (e.g. P01) | Yes |
| 2 | **Date of testing** | `YYYY-MM-DD` | Yes |
| 3 | **Age range** *(optional)* | Under 18 · 18–24 · 25–34 · 35–44 · 45–54 · 55+ · Prefer not to say | No |
| 4 | **Online shopping experience** | Never · Rarely · Sometimes · Often · Very often | Yes |
| 5 | **Device used for this session** | Desktop (own) · Laptop (own) · Tablet (own) · Phone (own) · Desktop (borrowed) · Other | Yes |
| 6 | **Screen / browser used** | e.g. Chrome 157, Windows 11, 1440×900 | Yes |
| 7 | **Session location** | In person (unsupervised) · In person (moderator present) · Remote | Yes |
| 8 | **Consent confirmed** | ☐ Yes — the participant read and agreed to the consent form | **Yes** |
| 9 | **Order of testing** | 1st · 2nd · 3rd · 4th · 5th | Yes |

---

## 3. What is deliberately **NOT** collected

This matters as much as what is collected, and is worth stating in the report itself.

| Not collected | Why |
|---|---|
| Full name | Unnecessary; the ID is sufficient |
| Email address or phone number of the participant | Unnecessary; the test data entered into the site is fictional |
| Student ID, class, campus | Unnecessary and identifying |
| Employer, income, exact age | Not needed to answer the research question |
| Gender, ethnicity, nationality | Not needed, and sensitive without a stated purpose |
| Payment details | The site is a prototype; **no real payment is possible and none is attempted** |
| Face or voice recording | Screen and note capture only; audio is not retained |
| IP address, precise location | Not collected by this form |

**About the test data entered into the site:** participants type fictional details (e.g. "Test User", `test@example.com`, `8123456789`, "Jl. Merdeka 1, Bandung 40115"). These are **mock values**, not the participant's real information. The moderator supplies them if the participant hesitates — this is a usability test of the interface, not of the participant's typing speed. Say this explicitly; it prevents participants from pausing over fake PII.

---

## 4. Recruitment criteria

A participant **qualifies** if all of the following are true:

- Has bought something online at least once, in any shop (does not need to be luxury fashion).
- Uses a smartphone or computer comfortably for everyday tasks.
- Reads and writes Indonesian and/or English — the interface is in English with Indonesian market context.
- Is **not** a member of the project team and has **not** seen this site before.
- Is available for roughly **30–40 minutes**.

**Nice to have, not required:** shopped for clothing or tailoring online; lives in Indonesia; has used a local payment method (VA, QRIS, e-wallet, COD).

**Excluded:** project team members, people who reviewed an earlier build of the site, and anyone who cannot consent.

---

## 5. Participant roster

> One row per person tested. **Leave the outcome columns empty until the session has actually happened.**

| ID | Date | Age range | Shopping experience | Device | Browser / viewport | Modality | Consent | Tasks completed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| P01 | | | | | | | ☐ | | |
| P02 | | | | | | | ☐ | | |
| P03 | | | | | | | ☐ | | |
| P04 | | | | | | | ☐ | | |
| P05 | | | | | | | ☐ | | |

**Target:** 5 participants (P01–P05). If more are tested, extend the ID sequence and note the total in the report.

---

## 6. Session setup record (per participant)

| Item | Value |
|---|---|
| Participant ID | |
| Date and start time | |
| Site build tested | V0.2 — `script.js` 121,458 bytes, `style.css` 79,147 bytes |
| Server | Local HTTP server on `http://127.0.0.1:8765` |
| Browser | Google Chrome 157 (real browser, DevTools Protocol available) |
| Viewport | ☐ Desktop 1440×900 ☐ Tablet 834×1112 ☐ Mobile 390×844 |
| Cart state at start | Empty (seeded fresh per participant) |
| Recording | ☐ Screen capture on ☐ Notes only |
| Recording filename | `documentation/usability/recordings/P0_.webm` |

> **Reset the cart between participants.** Open the browser console and run `localStorage.clear()`, then reload. Otherwise participant 2 inherits participant 1's cart and the tasks are no longer comparable.

---

## 7. Confidentiality statement (read to participants)

> "Your session is recorded only as a screen recording and written notes, and both are stored under a code like P03 — not your name. The notes describe what happened on the screen, not who you are. You can ask me to stop or delete anything at any time, including after the session. You will not be contacted again. The findings will be used in an academic report about the design of the site, and no money changes hands — this is a prototype, so no payment is real."

Record the participant's acknowledgement: ☐ Consent read and agreed · ☐ Participant asked for a copy of the results (note where it will be sent — **do not record the address in this file**).

---

**Related documents:** `consent_template.md` · `moderator_script.md` · `usability_tasks.md` · `observation_sheet.md` · `post_test_questionnaire.md` · `results_template.csv`
