/* ================================
   1) CODE CARD TYPE ANIMATION
================================ */
const codeEl = document.querySelector(".code-card code");

if (codeEl) {
  const tokens = [
    ["kw", "var"], ["txt", " "], ["var", "colors"], ["txt", " = [\n  "],
    ["str", '"#74B087"'], ["txt", ",\n  "],
    ["str", '"#DE7300"'], ["txt", ",\n  "],
    ["str", '"#74B087"'], ["txt", "\n];\n\n"],
    ["com", "// Do the thing"]
  ];

  codeEl.innerHTML = "";
  let t = 0;
  let c = 0;

  function typeToken() {
    if (t >= tokens.length) return;

    const [cls, text] = tokens[t];

    if (!tokens[t].el) {
      tokens[t].el = document.createElement("span");
      tokens[t].el.className = cls;
      codeEl.appendChild(tokens[t].el);
    }

    tokens[t].el.textContent += text[c] || "";
    c++;

    if (c >= text.length) {
      t++;
      c = 0;
    }

    setTimeout(typeToken, 40);
  }

  typeToken();
}

/* ================================
   2) FAQ BOT KNOWLEDGE BASE
================================ */
const KB = [
  {
    intent: "variables",
    keywords: [
      "μεταβλητ", "μεταβλητές", "variable", "variables", "let", "const", "var",
      "δήλωση μεταβλητής", "πως δηλώνω", "πώς δηλώνω"
    ],
    answer: `
<strong>Μεταβλητές στη JavaScript</strong><br>
<pre><code>let x = 1;
x = 2;

const y = 10;
// y = 11 ❌
</code></pre>
`
  },
  {
    intent: "arrays",
    keywords: [
      "array", "arrays", "πίνακ", "πίνακες", "list",
      "push", "pop", "map", "filter", "reduce"
    ],
    answer: `
<strong>Arrays στη JavaScript</strong><br>
<pre><code>const nums = [1,2,3];
nums.push(4);

const doubled = nums.map(n => n * 2);
</code></pre>
`
  },
  {
    intent: "functions",
    keywords: [
      "function", "functions", "συναρτη", "συναρτηση", "συναρτήσεις",
      "arrow", "=>", "callback"
    ],
    answer: `
<strong>Functions στη JavaScript</strong><br>
<pre><code>function add(a, b) {
  return a + b;
}

const sub = (a, b) => a - b;
</code></pre>
`
  },
  {
    intent: "async",
    keywords: [
      "promise", "promises", "async", "await", "fetch", "asynchronous", "ajax"
    ],
    answer: `
<strong>Async / Await</strong><br>
<pre><code>async function load() {
  const res = await fetch("/api");
  return await res.json();
}
</code></pre>
`
  }
];

/* ================================
   3) HELPERS + BETTER MATCHING
================================ */
function normalize(text) {
  return (text || "")
    .toLowerCase()
    .trim();
}

// scoring: μετράει πόσα keywords ταιριάζουν, επιλέγει το καλύτερο
function findAnswer(question) {
  const q = normalize(question);
  if (!q) return null;

  let best = null;
  let bestScore = 0;

  for (const item of KB) {
    let score = 0;
    for (const k of item.keywords) {
      if (q.includes(k)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best && bestScore > 0) return best.answer;

  return `
<strong>Δεν έχω απάντηση ακόμα.</strong><br>
Δοκίμασε:
<ul>
  <li>μεταβλητές</li>
  <li>arrays</li>
  <li>functions</li>
  <li>async / await</li>
</ul>
`;
}

/* ================================
   4) TYPEWRITER (CANCELABLE)
================================ */
let typingTimer = null;
let typingRunId = 0;

function typeEffect(element, html, speed = 18) {
  if (!element) return;

  // cancel previous run
  typingRunId++;
  const runId = typingRunId;
  if (typingTimer) clearTimeout(typingTimer);

  element.innerHTML = "";
  let i = 0;
  let isTag = false;
  let current = "";

  function type() {
    // stop if a newer run started
    if (runId !== typingRunId) return;

    if (i < html.length) {
      const char = html[i];
      if (char === "<") isTag = true;
      if (char === ">") isTag = false;

      current += char;
      element.innerHTML = current;

      i++;
      typingTimer = setTimeout(type, isTag ? 0 : speed);
    }
  }

  type();
}


const input = document.getElementById("aiQuestion");
const btn = document.getElementById("aiAskBtn");
const output = document.getElementById("aiAnswer");

function askBot() {
  if (!input || !output) return;

  const question = input.value.trim();
  if (!question) return;

  const answer = findAnswer(question);
  typeEffect(output, answer, 18);
}

if (btn) btn.addEventListener("click", askBot);
if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") askBot();
  });
}


const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("navMenu");

function closeMenu() {
  nav?.classList.remove("active");
  hamburger?.classList.remove("active");
}

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
  });

  // κλείνει όταν πατήσεις link
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // κλείνει αν πατήσεις έξω από το menu (mobile UX)
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("active")) return;

    const clickedInsideNav = nav.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);

    if (!clickedInsideNav && !clickedHamburger) closeMenu();
  });
}
