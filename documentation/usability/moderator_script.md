# Moderator Script
### CHRISTIAN WIJAYA Luxury Fashion — CW / PREMIUM · Usability Evaluation

**Status:** BLANK TEMPLATE. No session has been moderated yet.

Everything in **bold** is meant to be read aloud. Everything in *[brackets]* is instruction to the moderator and is never spoken.

---

## 1. Before the participant arrives

### Technical setup — do this for every participant

| Step | Action | Why |
|---|---|---|
| 1 | Start the local server: `python -m http.server 8765` from the project root | The site must be served over HTTP, not opened as a file, so `localStorage` behaves normally |
| 2 | Open `http://127.0.0.1:8765/shop.html` in Google Chrome | Same browser family used for the QA evidence |
| 3 | Set the viewport to the participant's device: **1440×900** desktop, **834×1112** tablet, **390×844** mobile | Match their real device so results describe real use |
| 4 | Open the console and run `localStorage.clear()`, then reload | **Critical.** Otherwise the participant inherits the previous participant's cart and the tasks are not comparable |
| 5 | Turn on screen recording | Evidence for the report |
| 6 | Have `usability_tasks.md`, `observation_sheet.md` and the test data ready | You should not be reading from this script during a task |
| 7 | Check the sign-in box at `http://127.0.0.1:8765/index.html` | The site must be up and rendering before the participant arrives |

### Physical setup
- Sit beside the participant, **not across from them**.
- Do not take notes on a laptop in front of them.
- Make sure the participant's phone is on **silent** if you are using their device.
- Have water and a quiet space ready.

### Read the consent form
Walk through `consent_template.md` with the participant and get it signed **before** starting the tasks. Do not start recording until they have agreed.

---

## 2. Opening script

> **Read this aloud, close to verbatim. It sets the tone for everything that follows.**

*"Hello, and thank you for taking the time to help me with my project.*

*I am a student studying Human-Computer Interaction — that is, how people use computer interfaces, and how to design them so they work well. As part of my assignment I have designed this website for an online fashion store. I have built it, and now I want to find out how it works for real people, which is what you are here for.*

*I want to be clear about three things.*

*First, this is a **prototype**. It is a design, not a live shop. **No real payment can happen.** If we reach the payment step, I will give you a dummy card number — there is no money involved, and you are not buying anything.*

*Second, I am testing **the website, not you**. If something is confusing, that is the website's fault, not yours. I am not testing your computer skills, and I will not judge your choices. Please just do what you would normally do.*

*Third, I will **not help you** unless you ask, and even then I will try to help you only as much as I need to. If you get stuck, that is exactly the information I need — please do not worry about it.*

*There are eight short tasks. I will read each one to you. As you work, please **say out loud what you are looking at and what you expect to happen**. For example: "I'm looking for a search box, I expect to type the shirt name here." Even if it feels odd, please keep talking — I am recording your screen, and your words are the most valuable thing I will collect today.*

*Do you have any questions before we begin?"*

*[Answer questions. Confirm they are ready. Start the recording. Start the timer for Task 1.]*

---

## 3. The think-aloud protocol

**Ask for it, then protect it.**

| Do | Do not |
|---|---|
| Let them think before they speak | Fill the silence with "what are you thinking?" every few seconds |
| Nod, write down, stay quiet | React to what they say — no "that's right", no "good", no "try the other button" |
| Record exact words | Paraphrase their words when quoting later |
| Note hesitation, backtracking, and re-reading | Interpret their behaviour aloud while it is happening |

*[Note the moderator's own frustration as a finding too. If *you* struggled to find something, that is a design problem, not a participant problem. Keep a separate "moderator notes" column.]*

---

## 4. Delivering the tasks

### The three rules
1. **Read the task text exactly** from `usability_tasks.md`. Do not paraphrase, do not add hints, do not name a control.
2. **Start the timer when you finish speaking**, not when the participant moves.
3. **Do not answer questions about the site.** If they ask "is this right?", say *"There is no right answer — do what you would do if you were really shopping here."*

### If they ask "am I doing this right?"
> *"There is no right answer. Do whatever you would do if you were really shopping here. I am interested in what you expect to happen."*

### If they ask what something does
> *"What do you think it does? Try it and see."*

### If they ask whether a real order will be placed
> *"No, it is a simulation. Nothing will be charged and nothing will ship. The site behaves as if the order went through, but it is all local on this computer."*

### If they get stuck (use the assistance ladder)
Only escalate one step at a time, and **record the level reached**:

| Level | What you say |
|---|---|
| 1 — Prompt | *"Take your time — could you try the search box at the top?"* (only after they ask) |
| 2 — Hint | *"That area on the left looks like it has filters."* |
| 3 — Instruction | *"The category filter is under Filters on the left."* |
| 4 — Assist | Do it for them, then let them continue. |

> **If you reached level 2 or above and the task still completed, record the outcome as Partial, not Success.** The point is to measure what they could do *unaided*.

### Handling the payment step
The participant will need details. Supply them from the table in `usability_tasks.md` if they hesitate, and **say that you are doing it**:

> *"I'll put in a test address so you can focus on how the page works — the site doesn't send it anywhere."*

Use the dummy card `4242 4242 4242 4242`, expiry `12/29`, CVC `123`. If a participant offers their **real** card details, decline politely:

> *"Please don't — it's a prototype, but I'd rather we didn't type any real card details into it at all."*

### The phone field — do not intervene
The phone field is the most interesting thing in the whole session. The site shows **+62** in a separate chip and says *"Enter the Indonesia number only."* If the participant types `+628123456789` or `08123456789`:

- **Let it happen.** Record the exact string they typed.
- Do not correct it, do not point at the hint.
- If they hit an error, let them read the error and react to it — that reaction is the finding.

### Two tasks to watch
- **T2 (filter)** — on tablet and mobile the filters sit behind a **"FILTERS"** button. If they never find it, that is a finding, not a participant failure.
- **T8 (confirmation)** — after the order, watch for them hunting for an **email confirmation or receipt** the site does not send. If they look for it and cannot find it, note it.

---

## 5. Closing script

> **Read this aloud after Task 8 and before the questionnaire.**

*"That is all the tasks — thank you, that was really helpful.*

*I have one short set of questions about how the site felt. There are eight statements; for each, tell me how much you agree or disagree, from 1 — strongly disagree — to 5 — strongly agree. There are no right answers, and I would like your honest opinion, including anything that frustrated you.*

*[Hand over `post_test_questionnaire.md`, or read the questions aloud. Let them write the three open-ended answers themselves if they are comfortable.]*

*"Finally, is there anything you would like to add, or anything about the site you would want the designer to know?"*

*[Record the answer in the observer notes.]*

*"That is everything. Thank you very much — this will genuinely make the design better. I am not collecting your name or any contact details; your session is recorded under the code P0_ and nothing identifies you. If you asked for a summary of the results, I will send it once the study is finished."*

*[Stop the recording. Check the recording saved correctly. Complete the session summary block on the observation sheet. Thank the participant again and let them leave.]*

---

## 6. After the participant leaves

- [ ] Complete the **session summary** block on `observation_sheet.md`.
- [ ] Transcribe the 8 task rows into **Section 1** of `results_template.csv`.
- [ ] Transcribe the 8 ratings into **Section 3** of `results_template.csv`.
- [ ] Move the recording to `documentation/usability/recordings/P0_.webm`.
- [ ] Write any closing observations into the observer notes.
- [ ] **Reset the cart** (`localStorage.clear()` + reload) before the next participant.
- [ ] Update the participant roster in `participant_information.md`.

---

## 7. Common situations

| Situation | What to do |
|---|---|
| Participant is silent | Wait a full 15 seconds, then say: *"What are you thinking about right now?"* and wait again |
| Participant narrates but does nothing | Say: *"What would you like to do next?"* |
| Participant is very fast | Let them go; note the short times. Consider a harder variant afterwards |
| Participant is very slow | Let them go. Note that the site may be slow to interpret — that is a finding about the design, not about them |
| Participant asks what the project is for | Answer honestly and briefly; do not coach them |
| Participant offers real personal data | Politely decline and use the test data |
| Participant discovers a bug | Thank them, note it precisely, and move on. Do not debug live — that breaks the think-aloud and biases the task |
| Participant wants to keep using the site | Fine, but not during a timed task |
| Participant asks about the price of a real item | Note it as a comment; do not enter a real order |
| Technology fails | Record it as a session incident, note which tasks were affected, and exclude them from the aggregates for that participant rather than guessing a result |

---

## 8. Moderator's own notes

*Keep these separate from the participant's data — they are the observer's perspective, not a result.*

| Field | Entry |
|---|---|
| Date | |
| Participant ID | P0_ |
| Viewport used | |
| Any technical incident | |
| Tasks excluded (and why) | |
| My own impression of the session | |
| Anything the participant said that I could not code into the sheet | |

---

**Related documents:** `participant_information.md` · `consent_template.md` · `usability_tasks.md` · `observation_sheet.md` · `post_test_questionnaire.md` · `results_template.csv`
