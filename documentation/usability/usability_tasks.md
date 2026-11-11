# Usability Tasks
### CHRISTIAN WIJAYA Luxury Fashion — CW / PREMIUM · Usability Evaluation

**Status:** BLANK TEMPLATE. These tasks have **not** yet been run. No results, times or outcomes exist.

**Eight tasks**, one per participant, in the same order for everyone. Order is fixed so completion times are comparable across participants. Each task maps to a real screen and a real control in the built site.

---

## Test data the moderator supplies

Type these **on the participant's behalf** if they hesitate, and say so out loud ("I'm putting in a test address so you can concentrate on the interface"). These are fictional; the site is a prototype and cannot take a real payment.

| Field | Value to use |
|---|---|
| Full name | `Budi Santoso` |
| Email | `budi.test@example.com` |
| Phone (Indonesia) | `8123456789` — **national format, no country code** |
| Street address | `Jl. Merdeka 1` |
| City | `Bandung` |
| Postcode | `40115` |
| Cardholder name | `BUDI SANTOSO` |
| Card number (dummy) | `4242 4242 4242 4242` |
| Expiry | `12/29` |
| Security code | `123` |

> **Watch for this in Task 6.** The site shows the dialling code **+62** in a separate chip beside the phone field and the hint *"Enter the Indonesia number only."* / *"Will be saved as +62 8123456789."* A participant who types `+628123456789` or `08123456789` has made a **recoverable error** — record it, do not correct it silently, and let them continue.

---

## Task overview

| ID | Task | Screen | Measures |
|---|---|---|---|
| T1 | Find a specific product | Shop | Search & findability |
| T2 | Filter the catalogue | Shop | Filter discoverability & control |
| T3 | Open a product detail page | Shop → Product Detail | Information presentation |
| T4 | Select size and colour, add to cart | Product Detail | Variant selection, purchase commitment |
| T5 | Change quantity in the cart | Cart | Quantity control & feedback |
| T6 | Complete contact and delivery information | Checkout | Form comprehension, country/phone model |
| T7 | Select a payment method | Checkout | Method clarity, local-rail familiarity |
| T8 | Place the order, read the confirmation | Checkout → Confirmation | Completion & outcome comprehension |

---

## T1 — Find a specific product

**Start point:** Shop page (`shop.html`), empty cart.

**Say this (read aloud, verbatim):**
> "This is an online shop for a fashion brand called CHRISTIAN WIJAYA. It currently shows 16 pieces. **Please find the 'Essential Oxford Shirt' and open its product page.**"

**Do not mention** the search box, the filters, or the product name's position.

| Outcome | Definition |
|---|---|
| **Success** | The Essential Oxford Shirt product detail page is open |
| **Partial** | The participant located the product in the grid and clicked it, but landed on the wrong piece and self-corrected within ~30 s |
| **Failed** | Could not reach the product page within 3 minutes, or gave up |

**Observe:** Where did they look first? Did they use the search field ("Search by name or colour") or browse? How long did the name take to match? Did the result grid update visibly?

**Record:** outcome · time from task start to the PDP being readable · errors · assistance level · what they said.

---

## T2 — Filter the catalogue

**Start point:** Shop page, filters collapsed or expanded as it appears by default.

**Say this (read aloud, verbatim):**
> "**Please narrow the catalogue down to men's clothing only.**"

| Outcome | Definition |
|---|---|
| **Success** | The **Category → Men** filter is applied and the grid shows the 5 men's pieces |
| **Partial** | The filter was applied but the participant could not tell whether it had taken effect (no verbal confirmation that the count changed from 16 to 5) |
| **Failed** | Could not find or apply the category filter within 2 minutes |

**Observe:** Did they find the filter controls? On desktop the filters are a left column; on tablet and mobile they are behind a **"FILTERS"** button — note whether they noticed the button. Did they try the **Price** slider, **Colour** or **Rating** instead? Did they use "All categories" to reset?

**Note:** the site supports five filter groups — **Category** (All categories / Men 5 / Women 5 / Shoes 3 / Accessories 3), **Price** (Rp 300.000–Rp 2.500.000), **Colour**, **Rating** (Any rating / 4.5 and above / 4.8 and above) — plus a **Sort** control (Featured, Highest rated, Price: low to high).

**Record:** outcome · time · errors · assistance level.

---

## T3 — Open a product detail page

**Start point:** Shop page (from T2 or T1).

**Say this (read aloud, verbatim):**
> "**Please open the 'Minimalist Wool Coat' and take a look at its details.**"

**Do not** read the description out. The task is to find the product, not to read it.

| Outcome | Definition |
|---|---|
| **Success** | The Minimalist Wool Coat product page is open and the participant has seen its price, rating and description |
| **Partial** | Page opened but the participant did not locate the key information (price / rating / description) |
| **Failed** | Could not open the page within 2 minutes |

**Observe:** What did they look at first — the image, the price, the rating ("4.9 · 64 reviews")? Did they scroll to **Description** and **Product details**? Did they notice the **Size guide** link? Did they try to zoom the image?

**Record:** outcome · time · errors · assistance level · comments.

---

## T4 — Select a size and colour, then add to cart

**Start point:** The Minimalist Wool Coat product page.

**Say this (read aloud, verbatim):**
> "**Please choose a size and a colour for the coat, and add it to your cart.**"

**Do not** mention the "Add to cart" button by name.

| Outcome | Definition |
|---|---|
| **Success** | A size and a colour are selected and the item is in the cart — confirmed by the toast and/or the cart badge |
| **Partial** | Added to cart but a variant was not consciously chosen (default left in place), or the participant was unsure the add worked |
| **Failed** | Could not complete the add within 3 minutes |

**Observe:** Does the participant realise that **"Colour:"** and **"Size:"** are choices with chips? Are sold-out sizes visibly disabled (e.g. size 45 on the loafer, XXL on the Oxford Shirt)? Did they notice the **cart badge** change in the navbar? Did the confirmation toast appear and was it noticed?

**Note:** the product page also lists four reassurance bullets — *Complimentary shipping over Rp 1.500.000*, *Standard delivery free, express Rp 25.000*, *30-day returns, collected from your door*, *Lifetime repair on all tailoring*. Note whether any were read.

**Record:** outcome · time · errors · assistance level · comments.

---

## T5 — Change the quantity in the cart

**Start point:** Cart page (`cart.html`) with at least one item.

**Say this (read aloud, verbatim):**
> "**Please change the quantity of the coat to two.**"

| Outcome | Definition |
|---|---|
| **Success** | The line shows quantity 2 and the order summary and navbar badge both reflect it |
| **Partial** | Quantity changed but the participant did not notice the badge / subtotal updating |
| **Failed** | Could not change the quantity within 90 seconds |

**Observe:** Did they use the **−/+ stepper** or try to type in the number box? Was the maximum of 10 discoverable? Did they notice the badge update and say so? Did they try **Remove** at any point?

**Optional exploratory probe** (not scored, run after T8): *"Now please remove that item from your cart."* Record whether the empty-cart state is understood.

**Record:** outcome · time · errors · assistance level · comments.

---

## T6 — Complete the contact and delivery information

**Start point:** Checkout page (`checkout.html`), step **2 — DETAILS**.

**Say this (read aloud, verbatim):**
> "**Please fill in your contact details and delivery address so we can send the order.** Use the details I give you." *(then supply the test data above)*

| Outcome | Definition |
|---|---|
| **Success** | Full name, email, country, phone, street address, city and postcode are all filled and **no validation errors remain** |
| **Partial** | All fields filled but at least one error is still showing, or the participant left the country field untouched |
| **Failed** | Could not complete the required fields within 3 minutes |

**Observe — this is the most diagnostic task in the study:**
- **Country or region.** Does the participant notice it defaults to **Indonesia (+62)**? Do they try to change it? If they do, do they understand that the payment methods change with the country?
- **Phone.** The dialling code **+62** sits in a **separate chip** to the left of the field, and the field is national-only. Does the participant type `8123456789` (correct), `08123456789` (leading zero — a recoverable error), or `+628123456789` (full international — a recoverable error)? **This is the key data point for the report.**
- Do they read the hint **"Enter the Indonesia number only."** and the live message **"Will be saved as +62 8123456789."**?
- Do they attempt to submit before completing everything, and how do they react to the error messages?

**Record:** outcome · time · **the exact phone string they typed** · errors · assistance level · comments.

---

## T7 — Select a payment method

**Start point:** Checkout page, still on step 2, contact and address filled.

**Say this (read aloud, verbatim):**
> "**Please choose how you would like to pay for this order.**"

**Do not** name any method or imply that one is preferred.

| Outcome | Definition |
|---|---|
| **Success** | One method is selected and its panel is visible and understood |
| **Partial** | A method was selected but the participant did not engage with the fields that appeared |
| **Failed** | Could not select a method within 90 seconds |

**Observe:** For **Indonesia** the site offers exactly five:
1. **Credit or debit card** — card type chips **Visa / Mastercard / GPN**, then cardholder name, card number, expiry, security code
2. **Bank transfer or virtual account** — a bank grid (6 popular of 14), a **Search bank** field, a **"View all banks"** toggle, and a generated demo account number
3. **QRIS** — a drawn demo QR block, explicitly labelled as not a real scannable code
4. **Digital wallet** — **GoPay, DANA, OVO, LinkAja**
5. **Cash on delivery** — noted as available in Bandung and Jakarta

Note:
- Whether they notice that **only the chosen method's fields appear** (the site hides the other four panels).
- Whether they expand **"View all banks"** and whether the list is understandable.
- Whether they understand the account number is a **demo** number.
- Whether they try the card fields even when choosing a non-card method.
- Whether they hesitate about GPN — it is an Indonesian card network that many users will not recognise. This is a good question for the interview.

**Record:** outcome · time · **which method they chose** · errors · assistance level · comments.

---

## T8 — Place the order and read the confirmation

**Start point:** Checkout page, step 2, everything filled.

**Say this (read aloud, verbatim):**
> "**Please place the order, and then check what the site tells you afterwards.**"

| Outcome | Definition |
|---|---|
| **Success** | The order is placed and the participant reads the confirmation page |
| **Partial** | The order is placed but the participant could not identify the order number or the total |
| **Failed** | Could not place the order within 3 minutes |

**Observe:** Does the participant notice the button says the order is **simulated**? After landing on the confirmation page, can they find and read the **order number** (format `CW-2026-XXXXX`), the **estimated delivery date**, the **total paid**, the **delivery method**, and the **payment method**? Did they check that the item and quantity they selected are listed correctly? Do they look for a receipt, a tracking number, or an email confirmation — and does the absence of one confuse them?

**Also confirm at the end of the session:** the cart is now empty and the navbar badge shows nothing, which is correct behaviour.

**Record:** outcome · time · errors · assistance level · comments.

---

## Timing rules

- Start the timer **when you finish reading the task aloud**, not when the participant moves.
- Stop the timer when the task's success condition is met, or when the participant declares they are finished or stuck.
- Record in **seconds**. If a task exceeds 180 s, stop it and record the outcome as **Partial** or **Failed** with the time at which you stopped.
- Let the participant pause and think. Silence is data — do not fill it.

---

## Assistance ladder

Only climb this ladder when the participant is genuinely stuck, and **always record which level was used**.

| Level | Moderator action |
|---|---|
| **0 — None** | No help. The participant proceeds unaided. |
| **1 — Prompt** | Re-read or re-phrase the task. *"Take your time — could you try the search box at the top?"* — **only if they ask what to do.** |
| **2 — Hint** | Point at the region of the screen without naming the control. *"That area on the left looks like it has filters."* |
| **3 — Instruction** | Name the control. *"The category filter is under Filters on the left."* |
| **4 — Assist** | Complete the action for them so they can continue to the next task. |

> A **Success with assistance level ≥ 2 must be recorded as Partial**, not Success. The outcome field measures unassisted capability.

---

**Related documents:** `participant_information.md` · `consent_template.md` · `moderator_script.md` · `observation_sheet.md` · `post_test_questionnaire.md` · `results_template.csv`
