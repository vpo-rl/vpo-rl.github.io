// examples-content.js

/* ════════════════════════════════════════════════════════════════════════════
   HELPERS — matching exact RLCR screenshot style
   ════════════════════════════════════════════════════════════════════════════

   From the screenshot:
   - Outer shaded box: background tint (pink for RLCR, blue for RLVR),
     model name as bold text top-left, border-left accent, padding, rounded
   - Each tag is its own scroll-box: "<tagname>" bold inline at start of
     content, then a space, then the content text, then " </tagname>" bold
   ════════════════════════════════════════════════════════════════════════════ */

// One scroll-box per tag, with bold open/close tags inline with content
function tagBox(tagName, content) {
  return `<div class="scroll-box"><span class="tag-label">&lt;${tagName}&gt;</span> ${content} <span class="tag-label">&lt;/${tagName}&gt;</span></div>`;
}

// Outer shaded model box — tinted background, bold label, left border accent
function modelBox(label, bgColor, borderColor, tags) {
  return `
    <div style="background:${bgColor}; border-left:4px solid ${borderColor}; border-radius:6px; padding:14px 16px; margin-bottom:1rem;">
      <div style="font-weight:bold; font-size:0.9em; margin-bottom:8px;">${label}</div>
      ${tags}
    </div>`;
}

// RLVR Single: 3 side-by-side shaded boxes, each with Sample N label
function rlvrSingleRow(samples) {
  const cols = samples.map((s, i) => `
    <div style="flex:1; min-width:0;">
      <div style="background:#fff8e6; border-left:4px solid #FFA900; border-radius:6px; padding:14px 16px;">
        <div style="font-weight:bold; font-size:0.9em; margin-bottom:8px;">RLVR Single Sample ${i+1}</div>
        ${tagBox('think', s.think)}
        ${tagBox('answer', s.answer)}
      </div>
    </div>`).join('');

  return `
    <div style="margin-bottom:0.5rem;">
      <div style="display:flex; gap:10px;">
        ${cols}
      </div>
    </div>`;
}


/* ════════════════════════════════════════════════════════════════════════════
   EXAMPLES ARRAY
   ════════════════════════════════════════════════════════════════════════════ */
const examples = [

  // ── EXAMPLE 1: Medical ────────────────────────────────────────────────────
  {
    title: "Example - Medical",
    question: `Given preliminary symptoms, list plausible diagnoses. Patient: 61-year-old male. Symptoms: coughing up blood, knife-like chest pain (lower + posterior chest wall), shortness of breath, fever, chills, pink peeling rash, diffuse muscle pain, fatigue. History: alcohol addiction, heart failure, COPD, underweight.
Ground Truth Answer: Pneumonia, Pulmonary neoplasm, Bronchitis, Tuberculosis, Unstable angina, Pericarditis, GERD, Stable angina, Possible NSTEMI/STEMI`,
    content: `
      <div>

        ${rlvrSingleRow([
          {
            think: `This patient has hemoptysis, chest pain, fever, chills, shortness of breath, and a history of COPD, heart failure, alcohol use, and being underweight. These symptoms point toward a pulmonary or systemic infectious process. Tuberculosis is strongly associated with hemoptysis, fever, and underweight status.`,
            answer: `Tuberculosis`
          },
          {
            think: `The combination of hemoptysis, fever, night sweats, weight loss, and alcohol use strongly suggests tuberculosis. COPD is a risk factor for respiratory infections in general, but the constellation here most strongly fits TB.`,
            answer: `Tuberculosis`
          },
          {
            think: `Hemoptysis and fever with underweight status in a patient with known COPD and alcohol use. These are classic TB risk factors. The rash on the commissure might be a secondary manifestation of systemic illness. Most likely tuberculosis.`,
            answer: `Tuberculosis`
          }
        ])}

        <p style="font-size:0.85em;color:#888;margin:4px 0 1rem;">Collapses to one mode across all 3 samples. Covers 1 of 9 gold diagnoses.</p>

        <!-- RLVR Multi (hidden by default) -->
        <div id="rlvr-block-med" style="display:none;">
          ${modelBox('RLVR Multi (1 generation, 3 answers)', '#f9f0ff', '#A900FF',
              tagBox('think', `Let me consider several possibilities. The hemoptysis and fever could fit pulmonary embolism, pneumonia, or tuberculosis. The patient has heart failure and COPD, increasing PE risk. However, the fever, chills, and systemic symptoms also fit an infectious cause. The rash on the commissure is unusual and could suggest a secondary infection. I'll consider PE, pneumonia, and TB as my top three, reasoning about each separately.\n\nCandidate 1 (Pulmonary Embolism): Sudden chest pain, shortness of breath, COPD and heart failure history — classic PE risk factors. Hemoptysis is less common but possible.\n\nCandidate 2 (Pneumonia): Fever, chills, cough, hemoptysis. COPD and underweight status increase susceptibility. Matches well with the systemic symptoms.\n\nCandidate 3 (Tuberculosis): Hemoptysis, fever, underweight, alcohol use — all are TB risk factors. Less likely to present this acutely but cannot be ruled out.`) +
              tagBox('answer1', `Pulmonary Embolism`) +
              tagBox('answer2', `Pneumonia`) +
              tagBox('answer3', `Tuberculosis`)
          )}
          <p style="font-size:0.85em;color:#888;margin:-0.5rem 0 1rem;">Covers 2 of 9 gold diagnoses in a single pass. Diverse candidates, but no confidence estimates.</p>
        </div>

        <!-- RLCR Multi (shown by default) -->
        <div id="rlcr-block-med" style="display:block;">
          ${modelBox('RLCR Multi (1 generation, with confidence)', '#f9f0ff', '#A900FF',
              tagBox('think', `Let me reason through the three most plausible diagnoses for this patient, considering my uncertainty about each.\n\nTuberculosis: Hemoptysis, underweight, alcohol use, fever — very strong indicators. TB is a serious consideration but can be tricky to confirm without culture results. I have fairly high confidence here.\n\nPneumonia: Fever, chills, cough, shortness of breath, COPD history — pneumonia fits well and is common. I have moderate-to-high confidence.\n\nBronchitis: Cough, fever, COPD exacerbation — plausible, though hemoptysis is less typical for simple bronchitis. Lower confidence than the first two.\n\nI'll assign confidences accordingly: TB first (0.40), pneumonia second (0.30), bronchitis third (0.30).`) +
              tagBox('answer1', `Tuberculosis`) +
              tagBox('confidence1', `0.40`) +
              tagBox('answer2', `Pneumonia`) +
              tagBox('confidence2', `0.30`) +
              tagBox('answer3', `Bronchitis`) +
              tagBox('confidence3', `0.30`)
          )}
          <p style="font-size:0.85em;color:#888;margin:-0.5rem 0 1rem;">Covers 3 of 9 gold diagnoses in a single pass, with a calibrated confidence distribution per answer.</p>
        </div>

      </div>
    `
  },

  // ── EXAMPLE 2: Trivia ─────────────────────────────────────────────────────
  {
    title: "Example - Trivia",
    question: `What day, month, and year did Ivan Karlović die?
Ground Truth Answer: August 9, 1531`,
    content: `
      <div>

        ${rlvrSingleRow([
          {
            think: `Ivan Karlović, a Croatian professional tennis player, died on January 25, 2017. This information is based on widely reported news and obituaries that announced his passing. To break it down — Day: 25, Month: January, Year: 2017.`,
            answer: `25 January 2017`
          },
          {
            think: `The question refers to Ivan Karlović, the Croatian tennis player known for his record-breaking serves. He passed away on January 25, 2017.`,
            answer: `25 January 2017`
          },
          {
            think: `Ivan Karlović is a Croatian tennis player. Based on obituary records, he died on January 15, 2023.`,
            answer: `January 15, 2023`
          }
        ])}

        <p style="font-size:0.85em;color:#888;margin:4px 0 1rem;">Wrong on all 3 samples — confuses the tennis player with the historical Croatian nobleman. Even when samples differ, none reach the correct answer. Pass@3 = 0.</p>

        <!-- RLVR Multi (hidden by default) -->
        <div id="rlvr-block-tri" style="display:none;">
          ${modelBox('RLVR Multi (1 generation, 3 answers)', '#f9f0ff', '#A900FF',
              tagBox('think', `The question asks about Ivan Karlović's date of death. The most prominent person by this name is the Croatian professional tennis player, and my initial instinct is to cite his death date. However, there is also a historical Croatian nobleman named Ivan Karlović from the 16th century — the phrasing of the question could plausibly refer to either.\n\nCandidate 1: January 25, 2017 — the date most commonly associated with this name, based on the tennis player.\n\nCandidate 2: August 9, 1531 — the death date of the historical Croatian nobleman Ivan Karlović, which fits the specificity of "day, month, and year" more naturally for a historical figure.\n\nCandidate 3: January 15, 2023 — another possible date I have seen associated with this question, though I am uncertain.`) +
              tagBox('answer1', `January 25, 2017`) +
              tagBox('answer2', `August 9, 1531`) +
              tagBox('answer3', `January 15, 2023`)
          )}
          <p style="font-size:0.85em;color:#888;margin:-0.5rem 0 1rem;">Recovers the correct answer (August 9, 1531) as candidate 2 — something repeated single-answer sampling never reaches.</p>
        </div>

        <!-- RLCR Multi (shown by default) -->
        <div id="rlcr-block-tri" style="display:block;">
          ${modelBox('RLCR Multi (1 generation, with confidence)', '#f9f0ff', '#A900FF',
              tagBox('think', `The question asks for the death date of Ivan Karlović. The most prominent person by this name is the Croatian tennis player, and I initially lean toward citing his death date. However, the specificity of "day, month, and year" and the phrasing suggest this could refer to the historical Croatian nobleman Ivan Karlović, who died in the 16th century.\n\nI am genuinely uncertain between these two interpretations. The tennis player association is stronger by default, so I'll place it first, but I'll assign meaningful confidence to the historical answer as well and leave room for a third possibility.`) +
              tagBox('answer1', `January 25, 2017`) +
              tagBox('confidence1', `0.40`) +
              tagBox('answer2', `August 9, 1531`) +
              tagBox('confidence2', `0.35`) +
              tagBox('answer3', `January 15, 2023`) +
              tagBox('confidence3', `0.25`)
          )}
          <p style="font-size:0.85em;color:#888;margin:-0.5rem 0 1rem;">Recovers the correct answer (August 9, 1531) as candidate 2 — and unlike RLVR Single, assigns it meaningful probability rather than collapsing to a single wrong guess.</p>
        </div>

      </div>
    `
  },

  // ── EXAMPLE 3: Coding ─────────────────────────────────────────────────────
  {
    title: "Example - Coding",
    question: `Write a Python function to check whether the given two numbers have same number of digits.
Ground Truth Answer: Any correct implementation (multiple valid approaches)`,
    content: `
      <div>

        ${rlvrSingleRow([
          {
            think: `To check if two numbers have the same number of digits, I can convert them to strings and compare their lengths.`,
            answer: `def same_number_of_digits(num1, num2):\n    return len(str(num1)) == len(str(num2))`
          },
          {
            think: `The simplest approach is string conversion — convert both numbers to strings and compare the lengths.`,
            answer: `def same_number_of_digits(a, b):\n    return len(str(a)) == len(str(b))`
          },
          {
            think: `Convert to strings and check length equality.`,
            answer: `def same_number_of_digits(num1, num2):\n    return len((str(num1)) == len(str(num2)))  # ⚠️ bug`
          }
        ])}

        <p style="font-size:0.85em;color:#888;margin:4px 0 1rem;">All 3 samples use the same string-conversion approach. Sample 3 contains a bug (misplaced parenthesis).</p>

        <!-- RLVR Multi (hidden by default) -->
        <div id="rlvr-block-cod" style="display:none;">
          ${modelBox('RLVR Multi (1 generation, 3 answers)', '#f9f0ff', '#A900FF',
              tagBox('think', `I need to generate three structurally distinct correct implementations. Let me think about different algorithmic approaches:\n\nApproach 1: String conversion — simplest and most Pythonic.\nApproach 2: Iterative digit counting — count digits by repeatedly dividing by 10 until the number reaches 0.\nApproach 3: Explicit string variables — same logic as approach 1 but with intermediate variables for clarity.\n\nEach of these is correct and structurally distinct. Let me write them out.`) +
              tagBox('answer1', `def same_number_of_digits(num1, num2):\n    len1 = len(str(num1))\n    len2 = len(str(num2))\n    return len1 == len2`) +
              tagBox('answer2', `def same_number_of_digits(num1, num2):\n    digits1 = 0\n    digits2 = 0\n    while num1 > 0:\n        num1 //= 10\n        digits1 += 1\n    while num2 > 0:\n        num2 //= 10\n        digits2 += 1\n    return digits1 == digits2`) +
              tagBox('answer3', `def same_number_of_digits(num1, num2):\n    str_num1 = str(num1)\n    str_num2 = str(num2)\n    return len(str_num1) == len(str_num2)`)
          )}
          <p style="font-size:0.85em;color:#888;margin:-0.5rem 0 1rem;">Three structurally distinct, correct implementations in a single forward pass.</p>
        </div>

        <!-- RLCR Multi (shown by default) -->
        <div id="rlcr-block-cod" style="display:block;">
          ${modelBox('RLCR Multi (1 generation, with confidence)', '#f9f0ff', '#A900FF',
              tagBox('think', `I will generate three distinct correct implementations and assign confidence to each based on how likely they are to fully pass all edge cases.\n\nCandidate 1 (string conversion, explicit variables): Very clean, handles all positive integers. High confidence.\nCandidate 2 (iterative digit counting): Correct for positive integers. Note: does not handle num=0 cleanly — a potential edge case. Slightly lower confidence.\nCandidate 3 (log-based): Mathematically elegant but may fail for num=0 (log10(0) is undefined). Lower confidence.\n\nI will assign confidence accordingly.`) +
              tagBox('answer1', `def same_number_of_digits(num1, num2):\n    str_num1 = str(num1)\n    str_num2 = str(num2)\n    return len(str_num1) == len(str_num2)`) +
              tagBox('confidence1', `0.60`) +
              tagBox('answer2', `def same_number_of_digits(num1, num2):\n    digits1 = 0\n    digits2 = 0\n    while num1 > 0:\n        num1 //= 10\n        digits1 += 1\n    while num2 > 0:\n        num2 //= 10\n        digits2 += 1\n    return digits1 == digits2`) +
              tagBox('confidence2', `0.30`) +
              tagBox('answer3', `import math\ndef same_number_of_digits(num1, num2):\n    return math.floor(math.log10(num1)) == math.floor(math.log10(num2))`) +
              tagBox('confidence3', `0.10`)
          )}
          <p style="font-size:0.85em;color:#888;margin:-0.5rem 0 1rem;">Three distinct implementations with calibrated confidence — the model reasons about edge cases and assigns lower confidence to approaches that may fail on boundary inputs.</p>
        </div>

      </div>
    `
  }

];