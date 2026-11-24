// "Too Neurotic to Be a Psychopath?" self-quiz, written by Penny Lark (quiz-writer).
// PRIVACY: this file makes NO network requests and uses NO storage of any kind.
// Answers live only in page memory; refreshing the page clears everything.
// Questions are original and are not adapted from any clinical instrument.

const QUESTIONS = [
  { theme: "Cold Heart", q: "A friend starts crying during a sad movie. You…",
    a: [["Cry too, obviously. You were already crying.", 0], ["Pass the tissues and squeeze their hand.", 1], ["Feel a bit awkward and check your phone.", 2], ["Wonder how long until the credits.", 3]] },
  { theme: "Remorse Meter", q: "You accidentally break a coworker's favorite mug. That night you…",
    a: [["Lie awake drafting a three-paragraph apology.", 0], ["Buy a replacement and say sorry.", 1], ["Mention it if they bring it up.", 2], ["Assume the mug had it coming.", 3]] },
  { theme: "Charm Offensive", q: "Meeting your friend's parents for the first time, you mostly…",
    a: [["Rehearse small talk in the car and still say something weird.", 0], ["Ask about their garden and actually listen.", 1], ["Figure out what they like and become exactly that.", 3], ["Tell your best stories and watch them laugh.", 2]] },
  { theme: "Thrill Hunger", q: "A free Saturday with zero plans sounds…",
    a: [["Perfect. Blanket, book, done.", 0], ["Nice, maybe a walk somewhere new.", 1], ["Boring by noon. Time to find something.", 2], ["Unbearable. Who has a motorcycle?", 3]] },
  { theme: "Con Artistry", q: "A group project partner never showed up. When the teacher asks how it went, you…",
    a: [["Tell the truth and feel guilty about it for a week.", 0], ["Say it was uneven and leave it there.", 1], ["Shade the facts a little in your favor.", 2], ["Tell a version where you single-handedly saved the day.", 3]] },
  { theme: "Short Fuse", q: "Someone cuts in front of you in a long line. You…",
    a: [["Say nothing and replay it in your head for days.", 0], ["Politely mention the line starts back there.", 1], ["Sigh loudly enough for them to hear.", 2], ["Tell them off before you've thought about it.", 3]] },
  { theme: "Main Character Energy", q: "In group photos, you…",
    a: [["Hide in the back row.", 0], ["Stand wherever there's room.", 1], ["Make sure your good side is facing the camera.", 2], ["Are the reason there's a group photo.", 3]] },
  { theme: "Track Record", q: "Your old school yearbook would most likely say you were…",
    a: [["Most likely to apologize to a door.", 0], ["Reliable and pleasant.", 1], ["A little bit of trouble.", 2], ["Banned from at least one field trip.", 3]] },
  { theme: "Cold Heart", q: "A stray kitten follows you home in the rain. You…",
    a: [["Name it before you reach the door.", 0], ["Call a shelter and wait with it.", 1], ["Feel bad but keep walking.", 2], ["Didn't notice a kitten.", 3]] },
  { theme: "Remorse Meter", q: "You said something harsh in an argument and you were wrong. Afterward you…",
    a: [["Apologize first and mean it.", 0], ["Apologize once you've cooled down.", 1], ["Wait for them to bring it up.", 2], ["Remember it as a win.", 3]] },
  { theme: "Con Artistry", q: "A store cashier gives you $20 too much in change. You…",
    a: [["Hand it back right away.", 0], ["Notice in the car and drive back.", 1], ["Call it a sign from the universe.", 2], ["Wonder if it works twice.", 3]] },
  { theme: "Thrill Hunger", q: "Your idea of the perfect vacation is…",
    a: [["A cabin with no Wi-Fi and lots of tea.", 0], ["A city with good museums.", 1], ["A trip with a few adventures planned.", 2], ["Whatever the travel insurance won't cover.", 3]] },
];

const TIERS = [
  { max: 25, title: "Too neurotic to be a psychopath", body: "Congratulations, you have a conscience. Possibly an overactive one. You'd fit right in with the radio staff who all scored zero." },
  { max: 50, title: "Charming rogue", body: "A little mischief, a lot of heart. You might cut a corner, but you'd feel weird about it later." },
  { max: 75, title: "Suspiciously chill", body: "You're probably just very relaxed. Still, maybe call someone you love today, just to keep in practice." },
  { max: 100, title: "Ice cold, or just very tired", body: "Your answers lean dark, but a quiz can't see the real you. A real assessment takes a trained clinician, hours of interviews and checked records. You're probably fine. Go pet a kitten." },
];

const form = document.getElementById("quiz-form");
const resultEl = document.getElementById("result");
const progress = document.getElementById("progress");

function build() {
  QUESTIONS.forEach((item, i) => {
    const fs = document.createElement("fieldset");
    const lg = document.createElement("legend");
    lg.textContent = `${i + 1}. ${item.q}`;
    fs.append(lg);
    item.a.forEach(([text, score], k) => {
      const lab = document.createElement("label");
      lab.className = "opt";
      const r = document.createElement("input");
      r.type = "radio"; r.name = `q${i}`; r.value = String(score); r.id = `q${i}a${k}`; r.required = k === 0;
      const span = document.createElement("span");
      span.textContent = text;
      lab.append(r, span); fs.append(lab);
    });
    form.insertBefore(fs, form.querySelector(".quiz-actions"));
  });
  updateProgress();
}

function answered() {
  return QUESTIONS.filter((_, i) => form.querySelector(`input[name="q${i}"]:checked`)).length;
}
function updateProgress() { progress.textContent = `${answered()} of ${QUESTIONS.length} answered`; }

form.addEventListener("change", updateProgress);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (answered() < QUESTIONS.length) {
    progress.textContent = `Answer all ${QUESTIONS.length} questions to see your result (${answered()} so far).`;
    const first = QUESTIONS.findIndex((_, i) => !form.querySelector(`input[name="q${i}"]:checked`));
    form.querySelector(`#q${first}a0`)?.focus();
    return;
  }
  let total = 0;
  QUESTIONS.forEach((_, i) => { total += Number(form.querySelector(`input[name="q${i}"]:checked`).value); });
  const pct = Math.round(total / (QUESTIONS.length * 3) * 100);
  const tier = TIERS.find((t) => pct <= t.max);
  resultEl.querySelector("h2").textContent = tier.title;
  resultEl.querySelector(".r-body").textContent = tier.body;
  resultEl.querySelector(".r-score").textContent = `Your score: ${pct} out of 100.`;
  resultEl.hidden = false;
  resultEl.querySelector("h2").focus();
});

document.getElementById("hide-result").addEventListener("click", () => {
  resultEl.hidden = true;
  resultEl.querySelector("h2").textContent = "";
  resultEl.querySelector(".r-body").textContent = "";
  resultEl.querySelector(".r-score").textContent = "";
  form.reset();
  updateProgress();
  window.scrollTo({ top: 0 });
});

build();
