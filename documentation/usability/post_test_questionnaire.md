# Post-Test Questionnaire
### CHRISTIAN WIJAYA Luxury Fashion — CW / PREMIUM · Usability Evaluation

**Status:** BLANK TEMPLATE. No responses have been collected. Do not complete any rating until a participant has actually filled it in.

**Administered immediately after Task 8**, before the participant leaves. Keep it short — the participant has just spent 30–40 minutes and attention is fading.

---

## How to administer it

- Read the eight rating questions **aloud**, or hand the sheet over and read the scale once.
- Read the scale exactly: **"1 = strongly disagree, 5 = strongly agree."**
- If a participant asks what an item means, paraphrase it in plain language. **Do not explain it in a way that leads them toward a high score.**
- If a participant is unsure of a rating, ask them to pick the one that is closest. Do not push for certainty.
- The three open-ended questions are **optional** — a participant may skip them. Say so explicitly, because some people feel obliged to write something.
- Record the answers on the questionnaire itself, then transcribe them into **Section 3** of `results_template.csv`.

---

## Section A — Rating questions

**Scale:** 1 = strongly disagree · 2 = disagree · 3 = neither agree nor disagree · 4 = agree · 5 = strongly agree

### Q01 — Ease of navigation
> *"I could find my way around the site easily."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

### Q02 — Product information clarity
> *"The information on the product pages was clear and enough for me to decide."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

### Q03 — Search and filtering usability
> *"I was able to search and filter the catalogue without trouble."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

### Q04 — Cart usability
> *"Adding to the cart and changing quantities was straightforward."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

### Q05 — Checkout usability
> *"Filling in the checkout form was easy."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

### Q06 — Payment method clarity
> *"I understood the payment options and what to choose."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

### Q07 — Visual consistency
> *"The site looked consistent and professionally designed."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

### Q08 — Overall satisfaction
> *"Overall, I was satisfied with my experience on this site."*

`1` ☐ `2` ☐ `3` ☐ `4` ☐ `5` ☐

---

## Section B — Open-ended questions (optional)

### Q09 — Easiest part
> *"What was the easiest part of using this site?"*

```
_______________________________________________________________________________

_______________________________________________________________________________
```

### Q10 — Most difficult part
> *"What was the most difficult part of using this site?"*

```
_______________________________________________________________________________

_______________________________________________________________________________
```

### Q11 — What you would improve
> *"If you could change one thing about this site, what would it be?"*

```
_______________________________________________________________________________

_______________________________________________________________________________
```

---

## Section C — Interview prompts for the moderator (optional, 5–10 minutes)

These are **not** scored and **not** part of the questionnaire totals. Use them to gather the qualitative material the report needs. They are the natural place to follow up on what you observed during the tasks — especially T6 (the phone format) and T7 (payment methods).

1. **About the phone number.** *"When you filled in your phone number, what did you think the +62 next to the box was? What did you expect to type in the field?"*
2. **About the payment methods.** *"Five payment methods were offered. Which one would you have used in real life, and why? Were any of the names unfamiliar to you?"* — probe GPN specifically if it was selected or hovered.
3. **About the simulated order.** *"The order was a simulation — no real payment was made. Did that make sense? Did you expect to receive an email or a receipt?"*
4. **About money.** *"All prices were shown in rupiah. Did that work for you? Would you have wanted to see prices in another currency?"*
5. **About the brand.** *"The site is for a house called CHRISTIAN WIJAYA with a line called CW / PREMIUM. Did that make sense to you, or did it feel confusing?"*
6. **About the filter on a phone.** *"Were you testing on a phone or a computer? Did the filters work the way you expected on this screen?"*
7. **Anything else.** *"Is there anything about the site that you would want to tell the designer?"*

> Record answers as near-verbatim notes in the observation sheet's **Participant comments** field, and copy them into **Section 5** of `results_template.csv`.

---

## Section D — Scoring notes

**The questionnaire is not a score.** Do not sum the eight items into a single "usability score" and present it as a pass/fail. The items measure eight different things; a participant can rate navigation 5 and checkout 2.

What to report instead:
1. **The mean per item**, with the number of responses. Show the spread, not just the average.
2. **Any item with a mean of 3 or below** — that is where the design is failing, and it should be named in the report.
3. **The distribution** behind each mean. Five 5s and one 1 is not the same as three 5s and three 3s; the mean alone hides that. Keep the raw responses in `results_template.csv` Section 3 so the distribution stays visible.
4. **Qualitative themes** from Q09–Q11 and the interview, reported as quotes attributed only to a participant ID.

**Compare with care.** With 5 participants, a difference of one respondent moves any mean by 0.2. Treat single differences as a signal worth investigating, not as a measured effect. State the sample size next to every percentage in the report.

---

## Transcription to the results file

Copy the eight ratings into **Section 3** of `results_template.csv`:

```
participant_id, q01_navigation, q02_product_info, q03_search_filter,
q04_cart, q05_checkout, q06_payment, q07_visual, q08_satisfaction,
q09_easiest, q10_difficult, q11_improve
P01,,,,,,,,,,,,
```

---

**Related documents:** `participant_information.md` · `consent_template.md` · `moderator_script.md` · `usability_tasks.md` · `observation_sheet.md` · `results_template.csv`
