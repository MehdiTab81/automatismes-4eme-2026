/* ==========================================================================
   Banque de questions d'automatismes — 4ème (cycle 4)
   Aligné sur les attendus de fin d'année 4ème (Eduscol).
   ========================================================================== */

function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function makeQCM(choicesWithCorrect) {
  const shuffled = shuffle(choicesWithCorrect);
  const correctIdx = shuffled.findIndex(c => c.correct);
  return { choices: shuffled.map(c => c.html), correctIdx };
}
function normalizeAnswer(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.').replace(/°/g, '');
}

/* ------------------------------------------------------------------
   THÈME 1 — CALCUL NUMÉRIQUE (fractions, relatifs, puissances, racines)
   ------------------------------------------------------------------ */

// Opérations sur les relatifs (produit, quotient)
function t1_relatifs_produit() {
  const cases = [
    { expr: '-7 \\times 3', r: '-21' }, { expr: '-2{,}5 \\times (-4)', r: '10' },
    { expr: '2{,}4 \\times (-0{,}5)', r: '-1,2' }, { expr: '(-8) \\times (-3)', r: '24' },
    { expr: '-6 \\times 5', r: '-30' }, { expr: '(-0{,}1) \\times (-0{,}4)', r: '0,04' }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Produit de relatifs',
    body: `Calculer : \\(${k.expr}\\).`,
    type: 'input', expected: [k.r, k.r.replace(',', '.')],
    solution: `\\(${k.expr} = ${k.r}\\). Règle des signes : − × + = − ; − × − = +.`,
    help: {
      cours: "<b>Règle des signes</b> : même signe → produit positif ; signes différents → produit négatif.",
      savoirFaire: "Calculer d'abord avec les valeurs absolues, puis appliquer la règle des signes.",
      erreurs: ["Se tromper de signe.", "Oublier la virgule.", "Additionner au lieu de multiplier."]
    }
  };
}

function t1_relatifs_quotient() {
  const cases = [
    { expr: '-12{,}8 \\div 2', r: '-6,4' }, { expr: '-63 \\div (-0{,}7)', r: '90' },
    { expr: '7{,}2 \\div (-5)', r: '-1,44' }, { expr: '-24 \\div 3', r: '-8' },
    { expr: '-15 \\div (-5)', r: '3' }, { expr: '18 \\div (-6)', r: '-3' }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Quotient de relatifs',
    body: `Calculer : \\(${k.expr}\\).`,
    type: 'input', expected: [k.r, k.r.replace(',', '.')],
    solution: `\\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "Même règle des signes pour la division : mêmes signes → positif ; signes différents → négatif.",
      savoirFaire: "Faire d'abord la division des valeurs absolues, puis appliquer le signe.",
      erreurs: ["Se tromper de signe.", "Inverser dividende et diviseur.", "Oublier la virgule."]
    }
  };
}

function t1_signe_produit() {
  const cases = [
    { expr: '(-6{,}7) \\times 7 \\times (-1{,}24) \\times (-0{,}7)', signe: '-', nbNeg: 3 },
    { expr: '(-2) \\times (-3) \\times (-4)', signe: '-', nbNeg: 3 },
    { expr: '(-5) \\times 2 \\times (-1{,}5)', signe: '+', nbNeg: 2 },
    { expr: '(-1) \\times (-2) \\times (-3) \\times (-4)', signe: '+', nbNeg: 4 },
    { expr: '7 \\times (-0{,}5)', signe: '-', nbNeg: 1 }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: 'Positif (+)', correct: k.signe === '+' },
    { html: 'Négatif (−)', correct: k.signe === '-' }
  ]);
  return {
    theme: 'calcul', title: 'Signe d\'un produit',
    body: `Quel est le signe de \\(${k.expr}\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `Il y a <b>${k.nbNeg}</b> facteur(s) négatif(s). Un nombre pair → produit positif ; impair → négatif. Ici : <b>${k.signe === '+' ? 'positif' : 'négatif'}</b>.`,
    help: {
      cours: "Signe d'un produit de plusieurs facteurs : compter le nombre de facteurs <b>négatifs</b>. Si pair → +, si impair → −.",
      savoirFaire: "On peut déterminer le signe AVANT de calculer.",
      erreurs: ["Oublier de compter les 0.", "Se tromper de parité.", "Mélanger règle des signes et calcul numérique."]
    }
  };
}

// Somme de fractions
function t1_somme_fractions() {
  const cases = [
    { a:'1/2', b:'1/4', r:'3/4' }, { a:'1/3', b:'1/6', r:'1/2' },
    { a:'1/2', b:'1/3', r:'5/6' }, { a:'2/5', b:'1/5', r:'3/5' },
    { a:'5/2', b:'7/3', r:'29/6' }, { a:'7/5', b:'8/5', r:'3' }
  ];
  const k = pick(cases);
  const toLatex = f => f === '3' ? '3' : (() => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; })();
  const pool = ['3/4','5/6','1/2','29/6','3/5','2','3','5/8','7/12'];
  const distract = Array.from(new Set(pool.filter(x => x !== k.r))).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLatex(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLatex(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Somme de fractions',
    body: `\\(${toLatex(k.a)} + ${toLatex(k.b)}\\) est égal à :`,
    type: 'qcm', choices, correctIdx,
    solution: `On met au même dénominateur puis on additionne les numérateurs.`,
    help: {
      cours: "Pour additionner : même dénominateur d'abord, puis on additionne les numérateurs.",
      savoirFaire: "Chercher le plus petit dénominateur commun.",
      erreurs: ["Additionner numérateurs ET dénominateurs.", "Oublier de simplifier.", "Se tromper de dénominateur commun."]
    }
  };
}

// Différence de fractions
function t1_diff_fractions() {
  const cases = [
    { a:'3/4', b:'1/4', r:'1/2' },
    { a:'5/6', b:'1/3', r:'1/2' },
    { a:'2/3', b:'1/6', r:'1/2' },
    { a:'7/10', b:'1/5', r:'1/2' },
    { a:'3/2', b:'5/6', r:'2/3' },
    { a:'5/4', b:'2/3', r:'7/12' }
  ];
  const k = pick(cases);
  const toLatex = f => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const pool = ['1/2','2/3','7/12','3/4','1/3','5/6','1/6'];
  const distract = Array.from(new Set(pool.filter(x => x !== k.r))).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLatex(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLatex(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Différence de fractions',
    body: `\\(${toLatex(k.a)} - ${toLatex(k.b)}\\) est égal à :`,
    type: 'qcm', choices, correctIdx,
    solution: `On met au même dénominateur puis on soustrait les numérateurs.`,
    help: {
      cours: "Pour soustraire : même dénominateur d'abord, puis on soustrait les numérateurs.",
      savoirFaire: "Chercher le plus petit dénominateur commun.",
      erreurs: ["Soustraire numérateurs ET dénominateurs.", "Oublier de simplifier.", "Confondre avec l'addition."]
    }
  };
}

// Produit de fractions
function t1_produit_fractions() {
  const cases = [
    { expr: '\\dfrac{3}{5} \\times \\dfrac{14}{7}', r: '6/5' },
    { expr: '\\dfrac{2}{3} \\times \\dfrac{9}{4}', r: '3/2' },
    { expr: '\\dfrac{5}{6} \\times \\dfrac{3}{10}', r: '1/4' },
    { expr: '\\dfrac{4}{7} \\times \\dfrac{21}{8}', r: '3/2' }
  ];
  const k = pick(cases);
  const toLx = f => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const pool = ['6/5','3/2','1/4','5/8','2/3','7/5'];
  const distract = Array.from(new Set(pool.filter(x => x !== k.r))).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLx(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Produit de fractions',
    body: `\\(${k.expr}\\) est égal à :`,
    type: 'qcm', choices, correctIdx,
    solution: `Numérateur × numérateur / dénominateur × dénominateur, puis on simplifie.`,
    help: {
      cours: "\\(\\dfrac{a}{b} \\times \\dfrac{c}{d} = \\dfrac{a \\times c}{b \\times d}\\).",
      savoirFaire: "Simplifier AVANT de multiplier pour éviter les grands nombres.",
      erreurs: ["Additionner au lieu de multiplier.", "Oublier de simplifier.", "Erreur de calcul."]
    }
  };
}

// Quotient de fractions (utilise inverse)
function t1_quotient_fractions() {
  const cases = [
    { expr: '\\dfrac{5}{9} \\div \\dfrac{1}{2}', r: '10/9' },
    { expr: '\\dfrac{2}{3} \\div \\dfrac{4}{9}', r: '3/2' },
    { expr: '\\dfrac{7}{4} \\div \\dfrac{1}{4}', r: '7' },
    { expr: '\\dfrac{3}{5} \\div \\dfrac{6}{10}', r: '1' }
  ];
  const k = pick(cases);
  const toLx = f => f.includes('/') ? (() => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; })() : f;
  const pool = ['10/9','3/2','7','1','5/18','2/3','5/4'];
  const distract = Array.from(new Set(pool.filter(x => x !== k.r))).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLx(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Quotient de fractions (inverse)',
    body: `\\(${k.expr}\\) est égal à :`,
    type: 'qcm', choices, correctIdx,
    solution: `Diviser par une fraction = multiplier par son <b>inverse</b>.`,
    help: {
      cours: "<b>\\(\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c}\\)</b>.",
      savoirFaire: "Transformer la division en multiplication par l'inverse, puis simplifier.",
      erreurs: ["Diviser numérateurs et dénominateurs directement.", "Oublier d'inverser.", "Se tromper d'inverse."]
    }
  };
}

// Inverse d'un nombre (H5)
function t1_inverse() {
  const cases = [
    { n: '3', r: '\\dfrac{1}{3}' }, { n: '\\dfrac{2}{5}', r: '\\dfrac{5}{2}' },
    { n: '\\dfrac{7}{4}', r: '\\dfrac{4}{7}' }, { n: '0{,}5', r: '2' },
    { n: '-2', r: '-\\dfrac{1}{2}' }, { n: '\\dfrac{1}{6}', r: '6' }
  ];
  const k = pick(cases);
  const pool = ['\\dfrac{1}{3}','\\dfrac{5}{2}','\\dfrac{4}{7}','2','-\\dfrac{1}{2}','6','\\dfrac{1}{2}'];
  const distract = Array.from(new Set(pool.filter(x => x !== k.r))).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Inverse d\'un nombre',
    body: `Quel est l'inverse de \\(${k.n}\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `L'inverse de \\(a\\) est \\(\\dfrac{1}{a}\\). Pour une fraction : on échange numérateur et dénominateur.`,
    help: {
      cours: "L'<b>inverse</b> de \\(a\\) est \\(\\dfrac{1}{a}\\) (pour \\(a \\neq 0\\)). \\(a \\times \\dfrac{1}{a} = 1\\).",
      savoirFaire: "Pour une fraction : échanger numérateur et dénominateur. Pour un décimal : diviser 1 par ce nombre.",
      erreurs: ["Confondre inverse et opposé (−a).", "0 n'a pas d'inverse.", "Oublier le signe."]
    }
  };
}

// Puissance d'un nombre (exposants positifs et négatifs — 4ème avec puissances de 10)
function t1_puissance_10() {
  const cases = [
    { expr: '10^4', r: '10000' }, { expr: '10^3', r: '1000' },
    { expr: '10^{-3}', r: '0,001' }, { expr: '10^{-2}', r: '0,01' },
    { expr: '10^5', r: '100000' }, { expr: '10^{-1}', r: '0,1' }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Puissance de 10',
    body: `\\(${k.expr}\\) est égal à :`,
    type: 'input', expected: [k.r, k.r.replace(',', '.')],
    solution: `\\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "\\(10^n\\) = 1 suivi de n zéros. \\(10^{-n} = \\dfrac{1}{10^n}\\) (déplacement de la virgule vers la gauche).",
      savoirFaire: "Compter les zéros (exposant positif) ou décaler la virgule (exposant négatif).",
      erreurs: ["Confondre \\(10^4\\) et 40.", "Oublier un zéro.", "Confondre \\(10^{-3}\\) et 0,003."]
    }
  };
}

// Notation scientifique (4ème)
function t1_notation_sci() {
  const cases = [
    { n: '3\\,900\\,000\\,000', sci: '3{,}9 \\times 10^9' },
    { n: '32\\,000', sci: '3{,}2 \\times 10^4' },
    { n: '0{,}00045', sci: '4{,}5 \\times 10^{-4}' },
    { n: '560', sci: '5{,}6 \\times 10^2' },
    { n: '0{,}0000783', sci: '7{,}83 \\times 10^{-5}' }
  ];
  const k = pick(cases);
  const distract = shuffle(cases.filter(c => c.sci !== k.sci)).slice(0, 3).map(c => c.sci);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.sci}\\)`, correct: true },
    ...distract.map(s => ({ html: `\\(${s}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Notation scientifique',
    body: `La notation scientifique de \\(${k.n}\\) est :`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(${k.n} = ${k.sci}\\).`,
    help: {
      cours: "Notation scientifique : \\(a \\times 10^n\\) avec \\(1 \\leq a < 10\\) et \\(n\\) entier relatif.",
      savoirFaire: "Décaler la virgule pour obtenir \\(a\\) entre 1 et 10, et compter les décalages.",
      erreurs: ["\\(a\\) doit être < 10 (ex. \\(32 \\times 10^3\\) n'est pas scientifique).", "Oublier le signe de \\(n\\).", "Se tromper du nombre de décalages."]
    }
  };
}

// Préfixes nano → giga (4ème)
function t1_prefixes() {
  const cases = [
    { q: "3 microlitres en litres", r: "3 \\times 10^{-6} \\text{ L}" },
    { q: "7 mégamètres en mètres", r: "7 \\times 10^6 \\text{ m}" },
    { q: "5 nanosecondes en secondes", r: "5 \\times 10^{-9} \\text{ s}" },
    { q: "2 gigaoctets en octets", r: "2 \\times 10^9 \\text{ o}" },
    { q: "4 millisecondes en secondes", r: "4 \\times 10^{-3} \\text{ s}" },
    { q: "8 kilomètres en mètres", r: "8 \\times 10^3 \\text{ m}" }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Préfixes (nano, micro, méga, giga...)',
    body: `Convertir : ${k.q}.`,
    type: 'qcm', choices, correctIdx,
    solution: `Chaque préfixe correspond à une puissance de 10.`,
    help: {
      cours: "Préfixes usuels :<br>• <b>nano</b> = \\(10^{-9}\\)<br>• <b>micro</b> = \\(10^{-6}\\)<br>• <b>milli</b> = \\(10^{-3}\\)<br>• <b>kilo</b> = \\(10^{3}\\)<br>• <b>méga</b> = \\(10^{6}\\)<br>• <b>giga</b> = \\(10^{9}\\)",
      savoirFaire: "Multiplier par la puissance de 10 correspondant au préfixe.",
      erreurs: ["Confondre méga et giga.", "Se tromper de signe pour micro / nano.", "Oublier l'unité."]
    }
  };
}

// Carré parfait (4ème p.2)
function t1_carre_parfait() {
  const cases = [
    { n: 11, r: 121 }, { n: 12, r: 144 }, { n: 9, r: 81 },
    { n: 7, r: 49 }, { n: 8, r: 64 }, { n: 10, r: 100 }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Carré parfait',
    body: `Calculer \\(${k.n}^2\\).`,
    type: 'input', expected: String(k.r),
    solution: `\\(${k.n}^2 = ${k.n} \\times ${k.n} = ${k.r}\\).`,
    help: {
      cours: "<b>Carrés à connaître par cœur</b> de 1 à 12 : 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.",
      savoirFaire: "\\(n^2\\) = \\(n\\) multiplié par lui-même. À savoir par cœur jusqu'à 12.",
      erreurs: ["Confondre \\(n^2\\) et \\(2n\\).", "Se tromper dans la table.", "Écrire juste \\(n\\)."]
    }
  };
}

// Racine carrée d'un carré parfait
function t1_racine_parfaite() {
  const cases = [
    { a: 81, r: 9 }, { a: 64, r: 8 }, { a: 100, r: 10 },
    { a: 49, r: 7 }, { a: 144, r: 12 }, { a: 121, r: 11 }, { a: 36, r: 6 }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Racine carrée (carré parfait)',
    body: `Calculer \\(\\sqrt{${k.a}}\\).`,
    type: 'input', expected: String(k.r),
    solution: `\\(\\sqrt{${k.a}} = ${k.r}\\) car \\(${k.r}^2 = ${k.a}\\).`,
    help: {
      cours: "\\(\\sqrt{a}\\) est le nombre positif qui, élevé au carré, donne \\(a\\).",
      savoirFaire: "Connaître les carrés parfaits par cœur pour reconnaître la racine.",
      erreurs: ["Diviser par 2 au lieu de prendre la racine.", "Confondre avec \\(a^2\\).", "Oublier que \\(\\sqrt{a}\\) est positif."]
    }
  };
}

// Encadrement de racine (4ème p.2 : "encadre √7 entre deux entiers")
function t1_encadrement_racine() {
  const cases = [
    { n: 7, lo: 2, hi: 3 }, { n: 20, lo: 4, hi: 5 },
    { n: 40, lo: 6, hi: 7 }, { n: 50, lo: 7, hi: 8 },
    { n: 10, lo: 3, hi: 4 }, { n: 30, lo: 5, hi: 6 }
  ];
  const k = pick(cases);
  const correct = `${k.lo} < \\sqrt{${k.n}} < ${k.hi}`;
  const distractors = [
    `${k.lo-1} < \\sqrt{${k.n}} < ${k.lo}`,
    `${k.hi} < \\sqrt{${k.n}} < ${k.hi+1}`,
    `${k.n-1} < \\sqrt{${k.n}} < ${k.n+1}`
  ];
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${correct}\\)`, correct: true },
    ...distractors.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Encadrement d\'une racine',
    body: `Encadrer \\(\\sqrt{${k.n}}\\) par deux entiers consécutifs.`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(${k.lo}^2 = ${k.lo*k.lo}\\) et \\(${k.hi}^2 = ${k.hi*k.hi}\\). Comme \\(${k.lo*k.lo} < ${k.n} < ${k.hi*k.hi}\\), on a \\(${k.lo} < \\sqrt{${k.n}} < ${k.hi}\\).`,
    help: {
      cours: "Pour encadrer \\(\\sqrt{n}\\), on cherche les deux carrés parfaits qui entourent \\(n\\).",
      savoirFaire: "Exemple : \\(\\sqrt{20}\\) → 16 < 20 < 25 → 4 < \\(\\sqrt{20}\\) < 5.",
      erreurs: ["Diviser n par 2.", "Confondre avec l'encadrement de n.", "Oublier l'ordre."]
    }
  };
}

// Comparaison de fractions
function t1_comp_fractions() {
  const cases = [
    { a: '5/18', b: '7/12', signe: '<' }, // 5/18 ≈ 0.28, 7/12 ≈ 0.58
    { a: '5/12', b: '4/3', signe: '<' },
    { a: '3/4', b: '1/2', signe: '>' },
    { a: '2/5', b: '3/7', signe: '<' },
    { a: '5/8', b: '7/8', signe: '<' }
  ];
  const k = pick(cases);
  const toLx = f => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const { choices, correctIdx } = makeQCM([
    { html: '<', correct: k.signe === '<' },
    { html: '>', correct: k.signe === '>' },
    { html: '=', correct: k.signe === '=' }
  ]);
  return {
    theme: 'calcul', title: 'Comparer deux fractions',
    body: `Compare : \\(${toLx(k.a)} \\ldots ${toLx(k.b)}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On les met au même dénominateur, puis on compare les numérateurs.`,
    help: {
      cours: "Pour comparer deux fractions, on peut :<br>• les mettre au même dénominateur<br>• ou comparer à une valeur commune (1/2, 1, etc.)",
      savoirFaire: "Même dénominateur → comparer les numérateurs.",
      erreurs: ["Comparer directement numérateurs et dénominateurs.", "Se tromper de signe.", "Oublier de simplifier."]
    }
  };
}


/* ------------------------------------------------------------------
   THÈME 2 — ARITHMÉTIQUE (premiers, décomposition, fractions égales)
   ------------------------------------------------------------------ */

function t2_premier() {
  const cases = [
    { n: 53, premier: true }, { n: 55, premier: false, div: '5 × 11' },
    { n: 57, premier: false, div: '3 × 19' }, { n: 59, premier: true },
    { n: 61, premier: true }, { n: 63, premier: false, div: '7 × 9' },
    { n: 67, premier: true }, { n: 69, premier: false, div: '3 × 23' }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: 'Oui', correct: k.premier },
    { html: 'Non', correct: !k.premier }
  ]);
  return {
    theme: 'arithmetique', title: 'Nombre premier ?',
    body: `Le nombre ${k.n} est-il premier ?`,
    type: 'qcm', choices, correctIdx,
    solution: k.premier
      ? `${k.n} est premier : il n'a que 1 et lui-même pour diviseurs.`
      : `${k.n} n'est pas premier : ${k.n} = ${k.div}.`,
    help: {
      cours: "<b>Premier</b> : entier ≥ 2 ayant exactement 2 diviseurs (1 et lui-même). Premiers < 70 : 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67.",
      savoirFaire: "Tester la divisibilité par 2, 3, 5, 7, 11…",
      erreurs: ["Penser que 1 est premier.", "Oublier que 2 est premier.", "Confondre premier et impair."]
    }
  };
}

function t2_decomposition() {
  const cases = [
    { n: 12, dec: '2^2 \\times 3' },
    { n: 18, dec: '2 \\times 3^2' },
    { n: 24, dec: '2^3 \\times 3' },
    { n: 60, dec: '2^2 \\times 3 \\times 5' },
    { n: 100, dec: '2^2 \\times 5^2' },
    { n: 84, dec: '2^2 \\times 3 \\times 7' }
  ];
  const k = pick(cases);
  const distract = cases.filter(c => c.dec !== k.dec).slice(0, 3).map(c => c.dec);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.dec}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'arithmetique', title: 'Décomposition en facteurs premiers',
    body: `Décomposer \\(${k.n}\\) en produit de facteurs premiers.`,
    type: 'qcm', choices, correctIdx,
    solution: `On divise successivement par 2, 3, 5, 7… : \\(${k.n} = ${k.dec}\\).`,
    help: {
      cours: "Décomposer : écrire le nombre comme produit de premiers, éventuellement avec des puissances.",
      savoirFaire: "Diviser par 2 tant que possible, puis 3, puis 5, puis 7…",
      erreurs: ["Utiliser un non-premier (6 = 2×3).", "Oublier une puissance.", "Se tromper de calcul."]
    }
  };
}


function t2_frac_egales() {
  const cases = [
    { frac: '14/49', equivTo: '2/7', other: '4/17' },
    { frac: '22/55', equivTo: '2/5', other: '4/11' },
    { frac: '34/85', equivTo: '2/5', other: '17/50' },
    { frac: '62/155', equivTo: '2/5', other: '31/80' }
  ];
  const k = pick(cases);
  const toLx = f => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.equivTo)}\\)`, correct: true },
    { html: `\\(${toLx(k.other)}\\)`, correct: false }
  ]);
  return {
    theme: 'arithmetique', title: 'Fractions égales',
    body: `À quelle fraction \\(${toLx(k.frac)}\\) est-elle égale ?`,
    type: 'qcm', choices, correctIdx,
    solution: `On simplifie en divisant numérateur et dénominateur par leur facteur commun.`,
    help: {
      cours: "Deux fractions sont égales si l'une se déduit de l'autre par multiplication (ou division) par un même nombre non nul.",
      savoirFaire: "Décomposer en facteurs premiers pour voir la simplification.",
      erreurs: ["Additionner/soustraire au lieu de diviser.", "Simplifier seulement numérateur ou dénominateur.", "Oublier qu'on divise par le même facteur."]
    }
  };
}

function t2_simplifier() {
  const cases = [
    { num: 140, den: 135, r: '28/27' },
    { num: 12, den: 30, r: '2/5' },
    { num: 45, den: 75, r: '3/5' },
    { num: 24, den: 36, r: '2/3' },
    { num: 18, den: 48, r: '3/8' }
  ];
  const k = pick(cases);
  const toLx = f => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const pool = [k.r, '5/6', '3/4', '2/3', '1/2', '3/5', '4/5'];
  const distract = Array.from(new Set(pool.filter(x => x !== k.r))).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLx(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'arithmetique', title: 'Simplifier une fraction',
    body: `Simplifier \\(${toLx(k.num + '/' + k.den)}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On divise numérateur et dénominateur par leur plus grand facteur commun.`,
    help: {
      cours: "Simplifier : diviser numérateur et dénominateur par un même nombre.",
      savoirFaire: "Décomposer en facteurs premiers pour trouver les facteurs communs.",
      erreurs: ["Diviser seulement numérateur ou dénominateur.", "S'arrêter trop tôt.", "Erreur de calcul."]
    }
  };
}

function t2_probleme_divisibilite() {
  const cases = [
    {
      q: "Un fleuriste a 434 roses et 620 tulipes. Il veut composer des bouquets identiques en utilisant toutes les fleurs. Quel est le nombre maximum de bouquets ?",
      r: 62,
      sol: "On cherche le plus grand diviseur commun de 434 et 620. 434 = 2 × 7 × 31 ; 620 = 2² × 5 × 31. Diviseur commun maximal : 2 × 31 = 62 bouquets."
    },
    {
      q: "Un boulanger a 36 pains au chocolat et 48 croissants. Il veut faire des paquets identiques en utilisant tout. Combien de paquets au maximum ?",
      r: 12,
      sol: "36 = 2² × 3² ; 48 = 2⁴ × 3. Plus grand diviseur commun : 2² × 3 = 12 paquets."
    },
    {
      q: "Deux phares clignotent : l'un toutes les 12 s, l'autre toutes les 18 s. Ils clignotent ensemble à 12h00. Dans combien de secondes clignoteront-ils de nouveau ensemble ?",
      r: 36,
      sol: "On cherche le plus petit multiple commun : 12 = 2²×3, 18 = 2×3². Multiple commun minimal = 2²×3² = 36 secondes."
    }
  ];
  const k = pick(cases);
  return {
    theme: 'arithmetique', title: 'Problème de divisibilité',
    body: k.q,
    type: 'input', expected: String(k.r),
    solution: k.sol,
    help: {
      cours: "Partager en lots identiques → chercher un diviseur commun. Événement qui revient → chercher un multiple commun.",
      savoirFaire: "Décomposer les nombres en facteurs premiers.",
      erreurs: ["Additionner les quantités.", "Confondre diviseur et multiple.", "Chercher un diviseur trop petit."]
    }
  };
}

/* ------------------------------------------------------------------
   THÈME 3 — CALCUL LITTÉRAL (distributivité simple, équations)
   ------------------------------------------------------------------ */

function t3_developper_simple() {
  const cases = [
    { expr: '3(4x - 2)', dev: '12x - 6' },
    { expr: '3x(4 + 8x)', dev: '12x + 24x^2' },
    { expr: '5(2x + 7)', dev: '10x + 35' },
    { expr: '2(3x - 5)', dev: '6x - 10' },
    { expr: '4x(x + 3)', dev: '4x^2 + 12x' },
    { expr: '6(3 - 1{,}5x)', dev: '18 - 9x' }
  ];
  const k = pick(cases);
  const distract = cases.filter(c => c.dev !== k.dev).slice(0, 3).map(c => c.dev);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.dev}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Développer (distributivité)',
    body: `Développer : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `Distributivité simple : \\(k(a+b) = ka + kb\\).`,
    help: {
      cours: "<b>Distributivité simple</b> : \\(k(a+b) = ka + kb\\).",
      savoirFaire: "Multiplier le facteur extérieur par chaque terme de la parenthèse.",
      erreurs: ["Oublier un terme.", "Se tromper de signe.", "Ne pas distribuer sur tous les termes."]
    }
  };
}

function t3_reduire() {
  const cases = [
    { expr: '17x + 4x(5 - x)', red: '-4x^2 + 37x' },
    { expr: '6(3 - 1{,}5x) - 9x', red: '18 - 18x' },
    { expr: '3(2x + 1) - (6 - x)', red: '7x - 3' },
    { expr: '2x + 3x - 5', red: '5x - 5' },
    { expr: '4x - 2(x - 3)', red: '2x + 6' }
  ];
  const k = pick(cases);
  const distract = cases.filter(c => c.red !== k.red).slice(0, 3).map(c => c.red);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.red}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Développer et réduire',
    body: `Développer et réduire : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `Développer chaque produit, puis regrouper les termes semblables.`,
    help: {
      cours: "Réduire : regrouper les termes semblables (mêmes variables et mêmes puissances).",
      savoirFaire: "1) Développer toutes les parenthèses. 2) Additionner les termes semblables.",
      erreurs: ["Oublier de changer les signes en enlevant une parenthèse négative.", "Additionner des termes non semblables.", "Se tromper d'opération."]
    }
  };
}

function t3_factoriser_simple() {
  const cases = [
    { expr: '12x - 30', fact: '6(2x - 5)' },
    { expr: '15x^2 + 18x', fact: '3x(5x + 6)' },
    { expr: '27x^2 + 3', fact: '3(9x^2 + 1)' },
    { expr: '5a + 15b', fact: '5(a + 3b)' },
    { expr: '14x + 21', fact: '7(2x + 3)' }
  ];
  const k = pick(cases);
  const distract = cases.filter(c => c.fact !== k.fact).slice(0, 3).map(c => c.fact);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.fact}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Factoriser (facteur commun)',
    body: `Factoriser : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On met en facteur le plus grand terme commun.`,
    help: {
      cours: "Factoriser = inverse de développer. Trouver un facteur commun à tous les termes.",
      savoirFaire: "Chercher le plus grand facteur commun (nombre et/ou lettre).",
      erreurs: ["Facteur trop petit (factorisation incomplète).", "Oublier un des termes.", "Inverser avec le développement."]
    }
  };
}

function t3_tester_solution() {
  const cases = [
    { equation: '3x + 2 = 8', val: 4, solution: false, dev: '3×4+2 = 14 ≠ 8' },
    { equation: '5x - 6 = 3x + 2', val: 4, solution: true, dev: '5×4−6 = 14 et 3×4+2 = 14 ✓' },
    { equation: '2x + 5 = 9', val: 2, solution: true, dev: '2×2+5 = 9 ✓' },
    { equation: '4x - 3 = 11', val: 3, solution: false, dev: '4×3−3 = 9 ≠ 11' },
    { equation: '7x + 1 = 3x + 9', val: 2, solution: true, dev: '7×2+1 = 15 et 3×2+9 = 15 ✓' }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: 'Oui', correct: k.solution },
    { html: 'Non', correct: !k.solution }
  ]);
  return {
    theme: 'algebre', title: 'Tester une solution',
    body: `Est-ce que \\(x = ${k.val}\\) est solution de l'équation \\(${k.equation}\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `On remplace x par sa valeur et on vérifie l'égalité : ${k.dev}.`,
    help: {
      cours: "Tester une solution : remplacer x par la valeur, calculer chaque membre, vérifier l'égalité.",
      savoirFaire: "Respecter les priorités opératoires et les règles de signes.",
      erreurs: ["Oublier un membre.", "Erreur de calcul.", "Confondre = et ≠."]
    }
  };
}

function t3_equation_simple() {
  const cases = [
    { a: 5, b: -7, c: 3, sol: '2' },
    { a: 3, b: 1, c: 10, sol: '3' },
    { a: 2, b: -5, c: 1, sol: '3' },
    { a: 7, b: 0, c: 35, sol: '5' },
    { a: 4, b: 4, c: 20, sol: '4' }
  ];
  const k = pick(cases);
  const bPart = k.b === 0 ? '' : (k.b > 0 ? ` + ${k.b}` : ` - ${Math.abs(k.b)}`);
  const eq = `${k.a}x${bPart} = ${k.c}`;
  return {
    theme: 'algebre', title: 'Équation ax + b = c',
    body: `Résoudre : \\(${eq}\\).`,
    type: 'input', expected: k.sol,
    solution: `\\(${k.a}x = ${k.c - k.b}\\), donc \\(x = ${k.sol}\\).`,
    help: {
      cours: "Pour résoudre \\(ax + b = c\\) : soustraire b, puis diviser par a.",
      savoirFaire: "Isoler progressivement x par opérations réciproques.",
      erreurs: ["Changer de signe trop tôt.", "Diviser un seul membre.", "Oublier le signe de b."]
    }
  };
}

function t3_equation_ax_cx() {
  const cases = [
    { a: 2, b: 5, c: -1, d: -4 },
    { a: 4, b: -8, c: 7, d: 4 },
    { a: 3, b: 2, c: -2, d: 12 },
    { a: 5, b: 1, c: 2, d: 10 }
  ];
  const k = pick(cases);
  const sol = (k.d - k.b) / (k.a - k.c);
  const fmtS = n => (n >= 0 ? '+ ' + n : '- ' + Math.abs(n));
  const eq = `${k.a}x ${fmtS(k.b)} = ${k.c < 0 ? '-' + Math.abs(k.c) : k.c}x ${fmtS(k.d)}`;
  const solStr = Number.isInteger(sol) ? String(sol) : sol.toFixed(2).replace('.', ',');
  return {
    theme: 'algebre', title: 'Équation ax + b = cx + d',
    body: `Résoudre : \\(${eq}\\).`,
    type: 'input', expected: [solStr, solStr.replace(',', '.')],
    solution: `On regroupe les x d'un côté et les nombres de l'autre : \\(x = ${solStr}\\).`,
    help: {
      cours: "Pour résoudre ax + b = cx + d : regrouper les x d'un côté, les constantes de l'autre, puis diviser.",
      savoirFaire: "1) Faire passer les x du même côté. 2) Faire passer les constantes de l'autre. 3) Diviser.",
      erreurs: ["Oublier de changer le signe en déplaçant un terme.", "Se tromper de membre.", "Erreur de signe."]
    }
  };
}

function t3_equivalence_programmes() {
  return {
    theme: 'algebre', title: 'Équivalence de programmes',
    body: "Voici deux programmes de calcul :<br><br><b>Programme A</b> : choisir un nombre, le tripler, puis ajouter 15.<br><b>Programme B</b> : choisir un nombre, ajouter 5, puis multiplier par 3.<br><br>Les deux programmes donnent-ils le même résultat pour tout nombre de départ ?",
    type: 'qcm',
    choices: [
      "Oui, ils sont équivalents.",
      "Non, ils ne donnent pas le même résultat.",
      "Seulement pour certains nombres.",
      "Impossible à dire sans calcul."
    ],
    correctIdx: 0,
    solution: "Programme A : \\(x \\mapsto 3x + 15\\). Programme B : \\(x \\mapsto 3(x + 5) = 3x + 15\\). Les deux sont équivalents.",
    help: {
      cours: "Pour démontrer l'équivalence, on écrit chaque programme sous forme d'expression algébrique et on compare.",
      savoirFaire: "Poser x au départ, traduire chaque étape, puis développer/réduire.",
      erreurs: ["Tester quelques valeurs sans généraliser.", "Se tromper dans l'ordre des opérations.", "Oublier de développer."]
    }
  };
}


/* ------------------------------------------------------------------
   THÈME 4 — PROPORTIONNALITÉ & POURCENTAGES (H2 validé)
   ------------------------------------------------------------------ */

function t4_pourcent_simple() {
  const cases = [
    { n: 80, p: 25, r: 20 },
    { n: 60, p: 10, r: 6 },
    { n: 200, p: 50, r: 100 },
    { n: 40, p: 75, r: 30 },
    { n: 120, p: 25, r: 30 },
    { n: 300, p: 10, r: 30 }
  ];
  const k = pick(cases);
  return {
    theme: 'pourcent', title: 'Pourcentage d\'une quantité',
    body: `Combien font ${k.p}% de ${k.n} ?`,
    type: 'input', expected: String(k.r),
    solution: `\\(${k.p}\\% \\text{ de } ${k.n} = \\dfrac{${k.p}}{100} \\times ${k.n} = ${k.r}\\).`,
    help: {
      cours: "\\(p\\%\\) de \\(N\\) = \\(\\dfrac{p}{100} \\times N\\).",
      savoirFaire: "Astuces : 10% = ÷10 ; 25% = ÷4 ; 50% = ÷2 ; 75% = les 3/4.",
      erreurs: ["Oublier de diviser par 100.", "Confondre pourcentage et fraction.", "Erreur de calcul mental."]
    }
  };
}

function t4_quatrieme_prop() {
  const cases = [
    {
      q: "8 briques identiques pèsent 13,6 kg. Combien pèsent 6 briques ?",
      r: "10,2", sol: "\\(\\dfrac{13{,}6 \\times 6}{8} = 10{,}2\\) kg."
    },
    {
      q: "3 litres de jus coûtent 4,5 €. Combien coûtent 5 litres ?",
      r: "7,5", sol: "\\(\\dfrac{4{,}5 \\times 5}{3} = 7{,}5\\) €."
    },
    {
      q: "Une voiture parcourt 180 km en 2 h. Combien parcourt-elle en 3 h ?",
      r: "270", sol: "\\(\\dfrac{180 \\times 3}{2} = 270\\) km."
    },
    {
      q: "7 cahiers coûtent 21 €. Combien coûtent 11 cahiers ?",
      r: "33", sol: "Prix d'un cahier : 3 €. 11 × 3 = 33 €."
    }
  ];
  const k = pick(cases);
  return {
    theme: 'pourcent', title: 'Quatrième proportionnelle',
    body: k.q,
    type: 'input', expected: [k.r, k.r.replace(',', '.')],
    solution: k.sol,
    help: {
      cours: "Dans une situation de proportionnalité, on peut utiliser un tableau et le produit en croix.",
      savoirFaire: "3 méthodes : coefficient de proportionnalité, produit en croix, ou passer par l'unité.",
      erreurs: ["Additionner au lieu de multiplier.", "Se tromper de quantité à chercher.", "Oublier l'unité."]
    }
  };
}

function t4_reconnaitre_proportionnalite() {
  return {
    theme: 'pourcent', title: 'Reconnaître une situation de proportionnalité',
    body: "Sur un graphique, à quelle condition l'ensemble des points représente-t-il une situation de proportionnalité ?",
    type: 'qcm',
    choices: [
      "Les points sont alignés avec l'origine du repère.",
      "Les points sont alignés (peu importe où).",
      "Les points forment une parabole.",
      "Les points forment un cercle."
    ],
    correctIdx: 0,
    solution: "Les points doivent être <b>alignés</b> ET passer par l'origine.",
    help: {
      cours: "Proportionnalité ⇔ points alignés ET passant par l'origine.",
      savoirFaire: "Vérifier l'alignement puis l'origine.",
      erreurs: ["Oublier le passage par l'origine.", "Confondre avec une simple droite.", "Croire que tout graphique linéaire est proportionnel."]
    }
  };
}

function t4_vitesse_temps() {
  const cases = [
    { q: "Un véhicule roule à 90 km/h. Combien de km parcourt-il en 3 h ?", r: "270" },
    { q: "Un train roule à 120 km/h. En combien d'heures parcourt-il 360 km ?", r: "3" },
    { q: "Un piéton marche à 5 km/h. Combien de km parcourt-il en 2 h ?", r: "10" },
    { q: "Un cycliste parcourt 60 km en 4 h. Quelle est sa vitesse moyenne en km/h ?", r: "15" }
  ];
  const k = pick(cases);
  return {
    theme: 'pourcent', title: 'Vitesse · temps · distance',
    body: k.q,
    type: 'input', expected: k.r,
    solution: `Relation : \\(d = v \\times t\\). Donc \\(v = d/t\\) et \\(t = d/v\\).`,
    help: {
      cours: "Formule : \\(d = v \\times t\\) (distance = vitesse × temps).",
      savoirFaire: "Identifier ce qu'on cherche (d, v ou t), appliquer la formule ou son réciproque.",
      erreurs: ["Confondre les 3 grandeurs.", "Mauvaises unités (min vs h).", "Diviser quand il faut multiplier."]
    }
  };
}

/* ------------------------------------------------------------------
   THÈME 5 — FONCTIONS (dépendance entre grandeurs)
   ------------------------------------------------------------------ */

function t5_lecture_graphique() {
  return {
    theme: 'pourcent', title: 'Lecture graphique (dépendance)',
    body: `Sur un graphique représentant la température d'un four en fonction du temps, on lit que la courbe passe par le point \\((5 \\text{ min } ; \\, 95\\,°C)\\). Que peut-on en déduire ?`,
    type: 'qcm',
    choices: [
      "Au bout de 5 minutes, la température du four est de 95 °C.",
      "Au bout de 95 minutes, la température est de 5 °C.",
      "La température augmente de 95 °C toutes les 5 minutes.",
      "Il n'y a pas assez d'informations."
    ],
    correctIdx: 0,
    solution: "L'abscisse est le temps, l'ordonnée est la température. Le point \\((5\\,;\\,95)\\) signifie qu'à \\(t=5\\) min, la température vaut 95 °C.",
    help: {
      cours: "Un point \\((x\\,;\\,y)\\) sur une courbe signifie que \\(y\\) est l'image de \\(x\\) par la fonction.",
      savoirFaire: "Identifier l'axe horizontal (variable) et l'axe vertical (grandeur dépendante).",
      erreurs: ["Inverser abscisse et ordonnée.", "Mal lire les unités.", "Confondre pente et valeur."]
    }
  };
}

function t5_formule_dependance() {
  const cases = [
    {
      q: "On enlève 4 carrés identiques de côté \\(x\\) cm aux quatre coins d'un rectangle 20 cm × 13 cm. L'aire restante (en cm²) s'exprime par :",
      r: "260 - 4x^2",
      distract: ["260 - x^2", "260 + 4x^2", "4x^2"]
    },
    {
      q: "Le périmètre d'un carré de côté \\(c\\) est donné par :",
      r: "4c",
      distract: ["c^2", "c + 4", "2c"]
    },
    {
      q: "Un taxi facture 3 € de prise en charge + 2 € par km. Le prix pour \\(x\\) km est :",
      r: "3 + 2x",
      distract: ["2 + 3x", "3x + 2", "5x"]
    }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...k.distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'pourcent', title: 'Formule de dépendance entre grandeurs',
    body: k.q,
    type: 'qcm', choices, correctIdx,
    solution: `On écrit la formule en introduisant la variable.`,
    help: {
      cours: "Pour exprimer une grandeur en fonction d'une autre, on identifie la variable et on écrit la formule.",
      savoirFaire: "Chercher la structure : constante + coefficient × variable ? produit ? différence ?",
      erreurs: ["Oublier un terme.", "Mal identifier la variable.", "Inverser l'ordre des opérations."]
    }
  };
}

// SUPPRIMÉ : t5_image_simple (notation f(x) hors programme 4ème, relève de 3ème)


/* ------------------------------------------------------------------
   THÈME 6 — GÉOMÉTRIE (Pythagore, Thalès emboîtés, cosinus, cas d'égalité)
   ------------------------------------------------------------------ */

// Triangle rectangle SVG
function svgRectSimple({ a, b, hypLabel = '?' } = {}) {
  const W = 260, H = 200, pad = 40;
  const Bx = pad, By = H - pad;
  const Ax = Bx, Ay = pad;
  const Cx = W - pad, Cy = By;
  const sq = 10;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto;background:#fcfcfc;border:1px solid #ddd;border-radius:8px;">
    <polygon points="${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}" fill="#e0f2fe" stroke="#333" stroke-width="1.5"/>
    <path d="M ${Bx} ${By-sq} h ${sq} v ${sq}" fill="none" stroke="#333" stroke-width="1.2"/>
    <text x="${Ax-18}" y="${Ay+4}" font-size="14" font-weight="700">A</text>
    <text x="${Bx-18}" y="${By+6}" font-size="14" font-weight="700">B</text>
    <text x="${Cx+8}" y="${Cy+6}" font-size="14" font-weight="700">C</text>
    <text x="${Ax-10}" y="${(Ay+By)/2}" font-size="13" fill="#0284c7" text-anchor="end">${a}</text>
    <text x="${(Bx+Cx)/2}" y="${By+20}" font-size="13" fill="#0284c7" text-anchor="middle">${b}</text>
    <text x="${(Ax+Cx)/2+12}" y="${(Ay+Cy)/2-4}" font-size="13" fill="#c4342a">${hypLabel}</text>
  </svg>`;
}

function t6_pythagore_hyp() {
  const cases = [
    { a: 3, b: 4, h: 5 }, { a: 6, b: 8, h: 10 },
    { a: 5, b: 12, h: 13 }, { a: 9, b: 12, h: 15 },
    { a: 8, b: 15, h: 17 }
  ];
  const k = pick(cases);
  return {
    theme: 'geometrie', title: 'Pythagore — calcul de l\'hypoténuse',
    body: `Un triangle ABC est rectangle en B. On a AB = ${k.a} cm et BC = ${k.b} cm. Calculer AC (en cm).${svgRectSimple({ a: k.a + ' cm', b: k.b + ' cm', hypLabel: '?' })}`,
    type: 'input', expected: String(k.h),
    solution: `D'après le théorème de Pythagore : \\(AC^2 = AB^2 + BC^2 = ${k.a*k.a} + ${k.b*k.b} = ${k.a*k.a + k.b*k.b}\\). Donc \\(AC = \\sqrt{${k.a*k.a + k.b*k.b}} = ${k.h}\\) cm.`,
    help: {
      cours: "<b>Théorème de Pythagore</b> : dans un triangle rectangle, le carré de l'hypoténuse = somme des carrés des deux autres côtés.",
      savoirFaire: "Repérer l'hypoténuse (face à l'angle droit), écrire l'égalité, calculer la racine.",
      erreurs: ["Ajouter les côtés au lieu de leurs carrés.", "Se tromper d'hypoténuse.", "Oublier la racine carrée."]
    }
  };
}

function t6_pythagore_cote() {
  const cases = [
    { h: 5, a: 3, b: 4 }, { h: 10, a: 6, b: 8 },
    { h: 13, a: 5, b: 12 }, { h: 15, a: 9, b: 12 },
    { h: 17, a: 8, b: 15 }
  ];
  const k = pick(cases);
  return {
    theme: 'geometrie', title: 'Pythagore — calcul d\'un côté',
    body: `Un triangle ABC est rectangle en B. L'hypoténuse AC mesure ${k.h} cm et AB mesure ${k.a} cm. Calculer BC (en cm).${svgRectSimple({ a: k.a + ' cm', b: '?', hypLabel: k.h + ' cm' })}`,
    type: 'input', expected: String(k.b),
    solution: `\\(AC^2 = AB^2 + BC^2\\), donc \\(BC^2 = ${k.h}^2 - ${k.a}^2 = ${k.h*k.h - k.a*k.a}\\), donc \\(BC = ${k.b}\\) cm.`,
    help: {
      cours: "Pour trouver un côté (non hypoténuse) : soustraire les carrés (\\(BC^2 = AC^2 - AB^2\\)).",
      savoirFaire: "Soustraire (et non additionner), puis racine carrée.",
      erreurs: ["Ajouter au lieu de soustraire.", "Prendre l'hypoténuse pour un côté.", "Oublier la racine."]
    }
  };
}

function t6_pythagore_reciproque() {
  const cases = [
    { a: 42, b: 40, c: 58, rect: true },     // 42²+40² = 1764+1600 = 3364 = 58² ✓
    { a: 3, b: 4, c: 5, rect: true },
    { a: 6, b: 7, c: 10, rect: false },      // 36+49=85 ≠ 100
    { a: 5, b: 12, c: 13, rect: true },
    { a: 7, b: 8, c: 12, rect: false }       // 49+64=113 ≠ 144
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: 'Oui, il est rectangle.', correct: k.rect },
    { html: 'Non, il n\'est pas rectangle.', correct: !k.rect }
  ]);
  const max = Math.max(k.a, k.b, k.c);
  const others = [k.a, k.b, k.c].filter(x => x !== max);
  const lhs = others[0]**2 + others[1]**2;
  const rhs = max**2;
  return {
    theme: 'geometrie', title: 'Réciproque de Pythagore',
    body: `Un triangle a pour côtés ${k.a} cm, ${k.b} cm et ${k.c} cm. Ce triangle est-il rectangle ?`,
    type: 'qcm', choices, correctIdx,
    solution: k.rect
      ? `Le plus grand côté est ${max}. \\(${others[0]}^2 + ${others[1]}^2 = ${lhs}\\) et \\(${max}^2 = ${rhs}\\). Comme ${lhs} = ${rhs}, le triangle est rectangle.`
      : `\\(${others[0]}^2 + ${others[1]}^2 = ${lhs}\\) et \\(${max}^2 = ${rhs}\\). Comme ${lhs} ≠ ${rhs}, le triangle n'est pas rectangle.`,
    help: {
      cours: "<b>Réciproque de Pythagore</b> : si la somme des carrés des 2 plus petits côtés = carré du plus grand, alors le triangle est rectangle.",
      savoirFaire: "1) Identifier le plus grand côté. 2) Calculer séparément \\(a^2 + b^2\\) et \\(c^2\\). 3) Comparer.",
      erreurs: ["Oublier d'identifier le plus grand côté.", "Calcul d'un seul membre.", "Confondre direct et réciproque."]
    }
  };
}

function t6_cosinus() {
  const cases = [
    { adj: 5, hyp: 13, angleDeg: 67 },
    { adj: 3, hyp: 5, angleDeg: 53 },
    { adj: 8, hyp: 17, angleDeg: 62 },
    { adj: 12, hyp: 13, angleDeg: 23 }
  ];
  const k = pick(cases);
  return {
    theme: 'geometrie', title: 'Cosinus — relation côté / hypoténuse',
    body: `Dans un triangle rectangle, le côté adjacent à un angle vaut ${k.adj} cm et l'hypoténuse vaut ${k.hyp} cm. Quelle est l'expression du cosinus de cet angle ?`,
    type: 'qcm',
    choices: [
      `\\(\\cos(\\widehat{A}) = \\dfrac{${k.adj}}{${k.hyp}}\\)`,
      `\\(\\cos(\\widehat{A}) = \\dfrac{${k.hyp}}{${k.adj}}\\)`,
      `\\(\\cos(\\widehat{A}) = ${k.adj} \\times ${k.hyp}\\)`,
      `\\(\\cos(\\widehat{A}) = ${k.adj} + ${k.hyp}\\)`
    ],
    correctIdx: 0,
    solution: `\\(\\cos(\\widehat{A}) = \\dfrac{\\text{côté adjacent}}{\\text{hypoténuse}} = \\dfrac{${k.adj}}{${k.hyp}}\\).`,
    help: {
      cours: "<b>Cosinus</b> d'un angle aigu dans un triangle rectangle : \\(\\cos(\\alpha) = \\dfrac{\\text{adjacent}}{\\text{hypoténuse}}\\).",
      savoirFaire: "Identifier l'angle, puis repérer son côté adjacent et l'hypoténuse.",
      erreurs: ["Inverser adjacent et hypoténuse.", "Confondre avec sinus ou tangente.", "Oublier que c'est un triangle rectangle."]
    }
  };
}

function t6_thales_direct() {
  const cases = [
    { AB: 7.5, AC: 3, BD: 5.4, CD: 9, AE: 4.32 },
    { AB: 10, AC: 4, AD: 6, AE: 2.4 },
    { AB: 6, AC: 9, AD: 4, AE: 6 }
  ];
  return {
    theme: 'geometrie', title: 'Thalès (triangles emboîtés) — proportionnalité',
    body: "Dans une configuration de Thalès en triangles emboîtés, que peut-on dire des rapports de longueurs ?",
    type: 'qcm',
    choices: [
      "Les rapports \\(\\dfrac{AM}{AB}\\), \\(\\dfrac{AN}{AC}\\) et \\(\\dfrac{MN}{BC}\\) sont tous égaux.",
      "Les rapports \\(AM/MB\\) et \\(AN/NC\\) sont égaux, mais pas le 3ème.",
      "Les trois longueurs AM, AN, MN sont égales.",
      "Aucune relation particulière."
    ],
    correctIdx: 0,
    solution: "Théorème de Thalès : dans la configuration triangles emboîtés, \\(\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}\\).",
    help: {
      cours: "<b>Théorème de Thalès</b> (emboîtés) : si \\((MN) \\parallel (BC)\\), alors \\(\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}\\).",
      savoirFaire: "Respecter l'ordre des points pour écrire correctement les rapports.",
      erreurs: ["Mélanger les longueurs.", "Inverser numérateur et dénominateur.", "Oublier le parallélisme."]
    }
  };
}

function t6_thales_reciproque() {
  return {
    theme: 'geometrie', title: 'Réciproque de Thalès',
    body: "Comment montre-t-on, à l'aide de la réciproque de Thalès, que deux droites sont parallèles ?",
    type: 'qcm',
    choices: [
      "Si les rapports \\(AM/AB\\) et \\(AN/AC\\) sont égaux (points dans le même ordre), alors (MN) // (BC).",
      "Si les triangles ont la même aire, alors les droites sont parallèles.",
      "Si \\(AM = AN\\), alors les droites sont parallèles.",
      "Si les triangles sont rectangles, alors les droites sont parallèles."
    ],
    correctIdx: 0,
    solution: "Réciproque de Thalès : si \\(\\dfrac{AM}{AB} = \\dfrac{AN}{AC}\\) et que les points sont alignés dans le même ordre, alors \\((MN) \\parallel (BC)\\).",
    help: {
      cours: "Pour conclure au parallélisme avec Thalès : vérifier l'égalité des deux rapports ET l'ordre des points.",
      savoirFaire: "Bien vérifier l'alignement et l'ordre avant d'invoquer la réciproque.",
      erreurs: ["Oublier l'ordre des points.", "Utiliser 3 rapports (suffit 2 pour la réciproque).", "Mélanger direct et réciproque."]
    }
  };
}

function t6_cas_egalite() {
  const cases = [
    {
      q: "Deux triangles ont leurs trois côtés respectivement égaux. Peut-on affirmer qu'ils sont égaux ?",
      a: "Oui, c'est le 1er cas d'égalité (3 côtés).",
      opts: ["Oui, c'est le 1er cas d'égalité (3 côtés).", "Non, il faut aussi que les angles soient égaux.", "Seulement si ils sont rectangles.", "Impossible à dire."]
    },
    {
      q: "Deux triangles ont deux côtés et l'angle compris égaux. Peut-on affirmer qu'ils sont égaux ?",
      a: "Oui, c'est le 2e cas d'égalité (2 côtés + angle compris).",
      opts: ["Oui, c'est le 2e cas d'égalité (2 côtés + angle compris).", "Non, il manque un côté.", "Seulement si isocèle.", "Impossible."]
    }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: k.a, correct: true },
    ...k.opts.filter(o => o !== k.a).map(o => ({ html: o, correct: false }))
  ]);
  return {
    theme: 'geometrie', title: 'Cas d\'égalité des triangles',
    body: k.q,
    type: 'qcm', choices, correctIdx,
    solution: `La réponse est : <b>${k.a}</b>.`,
    help: {
      cours: "<b>3 cas d'égalité</b> : (1) 3 côtés égaux ; (2) 2 côtés + angle compris ; (3) 1 côté + 2 angles adjacents.",
      savoirFaire: "Identifier le cas qui s'applique (éléments donnés).",
      erreurs: ["Confondre angle compris et angle opposé.", "Oublier un cas d'égalité.", "Confondre avec les triangles semblables."]
    }
  };
}

function t6_translation_conservation() {
  return {
    theme: 'transformations', title: 'Propriétés de la translation',
    body: "Par une translation, qu'est-ce qui est conservé ?",
    type: 'qcm',
    choices: [
      "Les longueurs, les angles, le parallélisme et les aires.",
      "Seulement les longueurs.",
      "Seulement les angles.",
      "Rien, tout change."
    ],
    correctIdx: 0,
    solution: "Une translation <b>conserve</b> : les longueurs, les angles, le parallélisme et les aires.",
    help: {
      cours: "Une <b>translation</b> décale toutes les figures de la même manière. Elle conserve tout (longueurs, angles, aires, parallélisme).",
      savoirFaire: "Penser à la flèche qui décale : la figure ne se déforme pas.",
      erreurs: ["Confondre avec homothétie (qui agrandit).", "Penser que les aires changent.", "Oublier la conservation des angles."]
    }
  };
}

function t6_homothetie_rapport() {
  const cases = [
    { L0: 12, rapport: 3, type: 'longueur', r: 36 },
    { L0: 12, rapport: 3, type: 'aire', r: 9*12 },  // aire × k²
    { L0: 6, rapport: 2, type: 'volume', r: 8*6 },  // volume × k³
    { A0: 20, rapport: 2, type: 'aire', r: 80 }
  ];
  const k = pick(cases);
  const qLongueur = k.type === 'longueur'
    ? `Une longueur mesure ${k.L0} cm. Quelle est sa mesure après un agrandissement de rapport ${k.rapport} ?`
    : null;
  const qAire = k.type === 'aire'
    ? `Une figure a une aire de ${k.A0 || k.L0} cm². Quelle est son aire après un agrandissement de rapport ${k.rapport} ?`
    : null;
  const qVolume = k.type === 'volume'
    ? `Un solide a un volume de ${k.L0} cm³. Quel est son volume après un agrandissement de rapport ${k.rapport} ?`
    : null;
  const q = qLongueur || qAire || qVolume;
  const unit = k.type === 'longueur' ? 'cm' : (k.type === 'aire' ? 'cm²' : 'cm³');
  return {
    theme: 'transformations', title: `Agrandissement — effet sur les ${k.type}s`,
    body: q,
    type: 'input', expected: String(k.r), suffix: unit,
    solution: k.type === 'longueur'
      ? `Longueur multipliée par le rapport : \\(${k.L0} \\times ${k.rapport} = ${k.r}\\) cm.`
      : k.type === 'aire'
        ? `Aire multipliée par le <b>carré</b> du rapport : \\(${k.A0 || k.L0} \\times ${k.rapport}^2 = ${k.r}\\) cm².`
        : `Volume multiplié par le <b>cube</b> du rapport : \\(${k.L0} \\times ${k.rapport}^3 = ${k.r}\\) cm³.`,
    help: {
      cours: "Agrandissement de rapport \\(k\\) : longueurs × \\(k\\), aires × \\(k^2\\), volumes × \\(k^3\\).",
      savoirFaire: "Distinguer longueur (×k), aire (×k²), volume (×k³).",
      erreurs: ["Multiplier l'aire par k au lieu de k².", "Multiplier le volume par k² au lieu de k³.", "Oublier l'élévation à la puissance."]
    }
  };
}


/* ------------------------------------------------------------------
   THÈME 7 — ESPACE (pyramide, cône, repérage pavé droit)
   ------------------------------------------------------------------ */

function t7_volume_pyramide() {
  const cases = [
    { base: 36, h: 5, r: 60 },   // (1/3) × 36 × 5 = 60
    { base: 9, h: 4, r: 12 },
    { base: 25, h: 6, r: 50 },
    { base: 16, h: 9, r: 48 }
  ];
  const k = pick(cases);
  return {
    theme: 'espace', title: 'Volume d\'une pyramide',
    body: `Une pyramide a pour aire de base ${k.base} cm² et hauteur ${k.h} cm. Quel est son volume (en cm³) ?`,
    type: 'input', expected: String(k.r), suffix: 'cm³',
    solution: `\\(V = \\dfrac{1}{3} \\times \\text{aire base} \\times h = \\dfrac{1}{3} \\times ${k.base} \\times ${k.h} = ${k.r}\\) cm³.`,
    help: {
      cours: "Volume d'une <b>pyramide</b> : \\(V = \\dfrac{1}{3} \\times \\text{aire base} \\times h\\).",
      savoirFaire: "Calculer l'aire de la base, multiplier par la hauteur, diviser par 3.",
      erreurs: ["Oublier le \\(\\dfrac{1}{3}\\).", "Confondre avec le volume d'un pavé.", "Prendre le périmètre au lieu de l'aire."]
    }
  };
}

function t7_volume_cone() {
  const cases = [
    { r: 3, h: 4, val: '12\\pi' },   // (1/3) × π × 9 × 4 = 12π
    { r: 2, h: 9, val: '12\\pi' },
    { r: 5, h: 6, val: '50\\pi' },
    { r: 6, h: 2, val: '24\\pi' }
  ];
  const k = pick(cases);
  const pool = ['12\\pi', '50\\pi', '24\\pi', '36\\pi', '6\\pi'];
  const distract = shuffle(pool.filter(x => x !== k.val)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.val}\\) cm³`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\) cm³`, correct: false }))
  ]);
  return {
    theme: 'espace', title: 'Volume d\'un cône',
    body: `Un cône a pour rayon ${k.r} cm et hauteur ${k.h} cm. Quel est son volume ?`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(V = \\dfrac{1}{3} \\pi r^2 h = \\dfrac{1}{3} \\times \\pi \\times ${k.r}^2 \\times ${k.h} = ${k.val}\\) cm³.`,
    help: {
      cours: "Volume d'un <b>cône</b> : \\(V = \\dfrac{1}{3} \\pi r^2 h\\) (= 1/3 × volume du cylindre de même base et hauteur).",
      savoirFaire: "Élever le rayon au carré, puis multiplier par la hauteur, puis par π, puis diviser par 3.",
      erreurs: ["Oublier \\(\\dfrac{1}{3}\\).", "Utiliser le diamètre au lieu du rayon.", "Oublier d'élever au carré."]
    }
  };
}

function t7_repere_pave() {
  return {
    theme: 'espace', title: 'Repérage dans un pavé droit',
    body: "Dans un repère de l'espace attaché à un pavé droit (longueur 3, largeur 2, hauteur 4), les coordonnées d'un sommet se lisent :",
    type: 'qcm',
    choices: [
      "(abscisse ; ordonnée ; altitude)",
      "(longueur ; largeur ; hauteur)",
      "(x ; y)",
      "(rayon ; angle)"
    ],
    correctIdx: 0,
    solution: "Dans l'espace, on utilise trois coordonnées : <b>abscisse, ordonnée, altitude</b>.",
    help: {
      cours: "Dans l'espace, un point se repère par <b>3 coordonnées</b> : abscisse (x), ordonnée (y) et altitude (z).",
      savoirFaire: "Lire l'axe sur lequel le point se projette pour chaque coordonnée.",
      erreurs: ["Oublier l'altitude.", "Confondre abscisse et ordonnée.", "Inverser les axes."]
    }
  };
}

/* ------------------------------------------------------------------
   THÈME 8 — GRANDEURS (conversions composées)
   ------------------------------------------------------------------ */

function t8_conv_vitesse() {
  const cases = [
    { v: 72, unit: 'km/h', vOut: 20, unitOut: 'm/s' },  // 72/3.6=20
    { v: 36, unit: 'km/h', vOut: 10, unitOut: 'm/s' },
    { v: 5, unit: 'm/s', vOut: 18, unitOut: 'km/h' },
    { v: 15, unit: 'm/s', vOut: 54, unitOut: 'km/h' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversion de vitesses',
    body: `Convertir ${k.v} ${k.unit} en ${k.unitOut}.`,
    type: 'input', expected: String(k.vOut), suffix: k.unitOut,
    solution: `Pour passer de km/h à m/s, on divise par 3,6. Pour l'inverse, on multiplie par 3,6.`,
    help: {
      cours: "1 m/s = 3,6 km/h (car 1 km = 1000 m et 1 h = 3600 s).",
      savoirFaire: "km/h → m/s : ÷3,6. m/s → km/h : ×3,6.",
      erreurs: ["Confondre les deux sens.", "Multiplier au lieu de diviser.", "Oublier les unités."]
    }
  };
}

function t8_conv_debit() {
  const cases = [
    { v: 2, unit: 'L/min', vOut: 120, unitOut: 'L/h' },
    { v: 60, unit: 'L/h', vOut: 1, unitOut: 'L/min' },
    { v: 120, unit: 'L/min', vOut: 2, unitOut: 'L/s' },
    { v: 5, unit: 'L/s', vOut: 300, unitOut: 'L/min' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversion de débits',
    body: `Convertir ${k.v} ${k.unit} en ${k.unitOut}.`,
    type: 'input', expected: String(k.vOut), suffix: k.unitOut,
    solution: `Utiliser les relations entre unités de temps (60 s = 1 min = 1/60 h) et de volume (1 m³ = 1000 L).`,
    help: {
      cours: "1 m³ = 1000 L. 1 h = 60 min = 3600 s.",
      savoirFaire: "Décomposer la conversion : temps d'abord, puis volume.",
      erreurs: ["Confondre le sens.", "Oublier les facteurs 60 et 1000.", "Erreur de calcul."]
    }
  };
}

function t8_grandeur_composee() {
  const cases = [
    { q: "Un mobile roule à 10 m/s pendant 12 s. Quelle distance parcourt-il (en m) ?", r: 120, sol: "\\(d = v \\times t = 10 \\times 12 = 120\\) m." },
    { q: "Un robinet a un débit de 3 L/s. Combien coule-t-il en 20 s (en L) ?", r: 60, sol: "\\(V = d \\times t = 3 \\times 20 = 60\\) L." },
    { q: "Un train roule à 150 km/h pendant 2 h. Quelle distance parcourt-il (en km) ?", r: 300, sol: "\\(150 \\times 2 = 300\\) km." },
    { q: "Une citerne de 2400 L se vide en 8 min. Quel est le débit (en L/min) ?", r: 300, sol: "\\(2400 \\div 8 = 300\\) L/min." }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Grandeurs composées',
    body: k.q,
    type: 'input', expected: String(k.r),
    solution: k.sol,
    help: {
      cours: "Grandeurs composées : vitesse (m/s, km/h), débit (L/s, m³/min)…<br>• Distance = vitesse × temps<br>• Volume = débit × temps",
      savoirFaire: "Identifier l'unité et appliquer la formule correcte.",
      erreurs: ["Mélanger les unités (min/s/h).", "Multiplier au lieu de diviser.", "Oublier l'unité finale."]
    }
  };
}

/* ------------------------------------------------------------------
   THÈME 9 — STATISTIQUES (médiane, fréquence, étendue)
   ------------------------------------------------------------------ */

function t9_mediane() {
  const cases = [
    { serie: [3, 5, 7, 9, 11], mediane: 7 },     // impair : milieu
    { serie: [2, 4, 6, 8], mediane: 5 },         // pair : moyenne des deux milieux
    { serie: [10, 12, 14, 16, 18, 20, 22], mediane: 16 },
    { serie: [5, 10, 15, 20, 25, 30], mediane: 17.5 }
  ];
  const k = pick(cases);
  return {
    theme: 'stats', title: 'Médiane',
    body: `Calculer la médiane de la série : ${k.serie.join(' ; ')}.`,
    type: 'input', expected: [String(k.mediane), String(k.mediane).replace('.', ',')],
    solution: k.serie.length % 2 === 1
      ? `Il y a ${k.serie.length} valeurs. La médiane est la ${Math.ceil(k.serie.length/2)}-ème : <b>${k.mediane}</b>.`
      : `Il y a ${k.serie.length} valeurs (pair). La médiane est la moyenne des deux valeurs du milieu : <b>${k.mediane}</b>.`,
    help: {
      cours: "<b>Médiane</b> : valeur qui partage une série ordonnée en deux moitiés égales.",
      savoirFaire: "1) Ordonner la série. 2) Si effectif impair : valeur du milieu. Si pair : moyenne des deux valeurs centrales.",
      erreurs: ["Oublier d'ordonner.", "Confondre médiane et moyenne.", "Mal compter le milieu."]
    }
  };
}

function t9_etendue() {
  const cases = [
    { serie: [12, 18, 5, 22, 9], r: 17 },
    { serie: [3, 7, 15, 2, 9], r: 13 },
    { serie: [100, 50, 75, 25, 90], r: 75 },
    { serie: [4, 4, 5, 5, 4], r: 1 }
  ];
  const k = pick(cases);
  return {
    theme: 'stats', title: 'Étendue',
    body: `Quelle est l'étendue de la série : ${k.serie.join(' ; ')} ?`,
    type: 'input', expected: String(k.r),
    solution: `Étendue = max − min = ${Math.max(...k.serie)} − ${Math.min(...k.serie)} = ${k.r}.`,
    help: {
      cours: "<b>Étendue</b> = plus grande valeur − plus petite valeur.",
      savoirFaire: "Identifier le max et le min, puis soustraire.",
      erreurs: ["Confondre étendue et médiane.", "Additionner au lieu de soustraire.", "Mal identifier max/min."]
    }
  };
}

function t9_frequence() {
  const cases = [
    { effectif: 5, total: 20, r: '25' },    // 5/20 = 0.25 = 25%
    { effectif: 3, total: 12, r: '25' },
    { effectif: 4, total: 10, r: '40' },
    { effectif: 7, total: 25, r: '28' }
  ];
  const k = pick(cases);
  return {
    theme: 'stats', title: 'Fréquence en pourcentage',
    body: `Dans une classe de ${k.total} élèves, ${k.effectif} font du sport. Quelle est la fréquence en % ?`,
    type: 'input', expected: String(k.r), suffix: '%',
    solution: `\\(\\text{fréquence} = \\dfrac{${k.effectif}}{${k.total}} \\times 100 = ${k.r}\\%\\).`,
    help: {
      cours: "<b>Fréquence</b> = effectif / effectif total. Peut s'exprimer en décimal ou en %.",
      savoirFaire: "Diviser effectif par total, puis multiplier par 100 pour obtenir le %.",
      erreurs: ["Oublier la multiplication par 100.", "Inverser numérateur et dénominateur.", "Confondre fréquence et effectif."]
    }
  };
}

function t9_diagramme_circulaire() {
  return {
    theme: 'stats', title: 'Diagramme circulaire — angle',
    body: "Un club a 36 adhérents. 12 aiment le foot. Quel angle (en °) doit-on tracer pour représenter le foot sur un diagramme circulaire ?",
    type: 'input', expected: '120', suffix: '°',
    solution: "\\(\\dfrac{12}{36} \\times 360° = 120°\\).",
    help: {
      cours: "Diagramme circulaire : chaque secteur a un angle proportionnel à l'effectif. Le tour complet = 360°.",
      savoirFaire: "Angle = (effectif / effectif total) × 360°.",
      erreurs: ["Oublier de multiplier par 360.", "Confondre avec pourcentage.", "Mauvais calcul de proportion."]
    }
  };
}

/* ------------------------------------------------------------------
   THÈME 10 — PROBABILITÉS (événements, contraire, équiprobabilité)
   ------------------------------------------------------------------ */

function t10_vocabulaire_proba() {
  const cases = [
    { q: "Quel est un événement certain quand on lance un dé à 6 faces ?", a: "Obtenir un numéro entre 1 et 6.", opts: ["Obtenir un numéro entre 1 et 6.", "Obtenir 7.", "Obtenir un 2.", "Obtenir 0."] },
    { q: "Quel est un événement impossible quand on lance un dé à 6 faces ?", a: "Obtenir 7.", opts: ["Obtenir 7.", "Obtenir 3.", "Obtenir un nombre pair.", "Obtenir un nombre entre 1 et 6."] },
    { q: "Laquelle de ces valeurs <b>ne peut pas</b> être une probabilité ?", a: "1,5", opts: ["1,5", "0", "1", "0,4"] }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: k.a, correct: true },
    ...k.opts.filter(o => o !== k.a).map(o => ({ html: o, correct: false }))
  ]);
  return {
    theme: 'probas', title: 'Vocabulaire des probabilités',
    body: k.q,
    type: 'qcm', choices, correctIdx,
    solution: `La réponse : <b>${k.a}</b>.`,
    help: {
      cours: "<b>Événement certain</b> : probabilité 1. <b>Impossible</b> : probabilité 0. Toute probabilité est entre 0 et 1.",
      savoirFaire: "Toujours vérifier que la probabilité est entre 0 et 1 (ou 0% et 100%).",
      erreurs: ["Confondre certain et probable.", "Probabilité > 1.", "Confondre événement et issue."]
    }
  };
}

function t10_proba_contraire() {
  const cases = [
    { p: '0,4', cont: '0,6' },
    { p: '0,25', cont: '0,75' },
    { p: '1/5', cont: '4/5' },
    { p: '3/10', cont: '7/10' }
  ];
  const k = pick(cases);
  return {
    theme: 'probas', title: 'Événement contraire',
    body: `La probabilité de gagner à un jeu est \\(${k.p}\\). Quelle est la probabilité de perdre ?`,
    type: 'input', expected: [k.cont, k.cont.replace('/', '/')],
    solution: `\\(P(\\bar{A}) = 1 - P(A) = 1 - ${k.p} = ${k.cont}\\).`,
    help: {
      cours: "Probabilité de l'<b>événement contraire</b> : \\(P(\\bar{A}) = 1 - P(A)\\).",
      savoirFaire: "Soustraire la probabilité donnée à 1.",
      erreurs: ["Oublier de soustraire à 1.", "Ajouter au lieu de soustraire.", "Confondre avec impossible."]
    }
  };
}

function t10_proba_simple() {
  const cases = [
    { q: "Dans une urne, il y a 1 boule rouge et 4 oranges. Probabilité de tirer une orange ?", r: '4/5' },
    { q: "On lance un dé à 6 faces. Probabilité d'obtenir un nombre pair ?", r: '1/2' },
    { q: "Un sac contient 5 jetons verts et 3 rouges. Probabilité de tirer un vert ?", r: '5/8' },
    { q: "On tire une carte parmi 52. Probabilité de tirer un cœur (13 cœurs) ?", r: '1/4' }
  ];
  const k = pick(cases);
  const toLx = f => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const pool = ['4/5','1/2','5/8','1/4','1/3','3/5','2/3'];
  const distract = Array.from(new Set(pool.filter(x => x !== k.r))).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLx(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'probas', title: 'Probabilité simple (équiprobabilité)',
    body: k.q,
    type: 'qcm', choices, correctIdx,
    solution: `Probabilité = (cas favorables) / (cas possibles).`,
    help: {
      cours: "Équiprobabilité : \\(P(A) = \\dfrac{\\text{cas favorables}}{\\text{cas possibles}}\\).",
      savoirFaire: "Compter toutes les issues, puis celles qui conviennent, diviser.",
      erreurs: ["Inverser favorables et possibles.", "Oublier de simplifier.", "Oublier des issues."]
    }
  };
}



/* ==========================================================================
   Rendu de blocs Scratch en SVG (issu du site 3ème, adapté 4ème)
   ========================================================================== */
const SCRATCH_COLORS = {
  event:    '#FFBF00',
  control:  '#FFAB19',
  motion:   '#4C97FF',
  variable: '#FF8C1A',
  pen:      '#0FBD8C',
  operator: '#59C059',
  looks:    '#9966FF',
  define:   '#FF6680',
  sensing:  '#4CBFE6'
};
const SCRATCH_GEOM = { nX: 14, nW: 18, nD: 4, stemW: 14, stackH: 32, cTopH: 32, cBotH: 14, r: 3 };

function scratchPathStack(x, y, w, h, { notch = true, tab = true } = {}) {
  const { nX, nW, nD, r } = SCRATCH_GEOM;
  let d = `M ${x + r} ${y}`;
  if (notch) d += ` L ${x + nX} ${y} L ${x + nX + 3} ${y + nD} L ${x + nX + nW - 3} ${y + nD} L ${x + nX + nW} ${y}`;
  d += ` L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r}`;
  d += ` L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h}`;
  if (tab) d += ` L ${x + nX + nW} ${y + h} L ${x + nX + nW - 3} ${y + h + nD} L ${x + nX + 3} ${y + h + nD} L ${x + nX} ${y + h}`;
  d += ` L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r}`;
  d += ` L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
  return d;
}
function scratchPathHat(x, y, w, h) {
  const { nX, nW, nD } = SCRATCH_GEOM;
  let d = `M ${x} ${y + 12} Q ${x} ${y} ${x + 12} ${y} L ${x + w - 12} ${y} Q ${x + w} ${y} ${x + w} ${y + 12}`;
  d += ` L ${x + w} ${y + h}`;
  d += ` L ${x + nX + nW} ${y + h} L ${x + nX + nW - 3} ${y + h + nD} L ${x + nX + 3} ${y + h + nD} L ${x + nX} ${y + h}`;
  d += ` L ${x} ${y + h} Z`;
  return d;
}
function scratchPathDefine(x, y, w, h) {
  const { nX, nW, nD } = SCRATCH_GEOM;
  let d = `M ${x} ${y + 10} Q ${x} ${y - 2} ${x + 18} ${y} Q ${x + w / 2} ${y - 6} ${x + w - 18} ${y} Q ${x + w} ${y - 2} ${x + w} ${y + 10}`;
  d += ` L ${x + w} ${y + h}`;
  d += ` L ${x + nX + nW} ${y + h} L ${x + nX + nW - 3} ${y + h + nD} L ${x + nX + 3} ${y + h + nD} L ${x + nX} ${y + h}`;
  d += ` L ${x} ${y + h} Z`;
  return d;
}
function scratchPathCBlock(x, y, w, topH, innerH, botH) {
  const { nX, nW, nD, stemW } = SCRATCH_GEOM;
  const y2 = y + topH, y3 = y + topH + innerH, y4 = y3 + botH;
  const ixN = x + stemW + nX;
  let d = `M ${x} ${y}`;
  d += ` L ${x + nX} ${y} L ${x + nX + 3} ${y + nD} L ${x + nX + nW - 3} ${y + nD} L ${x + nX + nW} ${y}`;
  d += ` L ${x + w} ${y} L ${x + w} ${y2}`;
  d += ` L ${ixN + nW} ${y2} L ${ixN + nW - 3} ${y2 + nD} L ${ixN + 3} ${y2 + nD} L ${ixN} ${y2}`;
  d += ` L ${x + stemW} ${y2} L ${x + stemW} ${y3}`;
  d += ` L ${ixN} ${y3} L ${ixN + 3} ${y3 + nD} L ${ixN + nW - 3} ${y3 + nD} L ${ixN + nW} ${y3}`;
  d += ` L ${x + w} ${y3} L ${x + w} ${y4}`;
  d += ` L ${x + nX + nW} ${y4} L ${x + nX + nW - 3} ${y4 + nD} L ${x + nX + 3} ${y4 + nD} L ${x + nX} ${y4}`;
  d += ` L ${x} ${y4} Z`;
  return d;
}
const CHAR_W = 7;
function scratchRenderContent(x0, y, h, text) {
  const tokens = [];
  const re = /\{(v|n|op|t):([^{}]+)\}/g;
  let lastIdx = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) tokens.push({ kind: 'label', value: text.slice(lastIdx, m.index) });
    tokens.push({ kind: m[1], value: m[2] });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) tokens.push({ kind: 'label', value: text.slice(lastIdx) });
  let cx = x0 + 10;
  const cy = y + h / 2;
  const pillH = h - 12;
  let svg = '';
  tokens.forEach((t, i) => {
    const value = String(t.value);
    const textW = value.replace(/\s/g, ' ').length * CHAR_W;
    if (t.kind === 'label') {
      const trimmed = value.trim();
      if (!trimmed) { cx += CHAR_W; return; }
      if (i > 0) cx += 3;
      svg += `<text x="${cx}" y="${cy + 4.5}" fill="white" font-size="13" font-weight="600" font-family="ui-sans-serif,system-ui">${trimmed}</text>`;
      cx += trimmed.length * CHAR_W + 3;
    } else {
      const pad = 10;
      const w = Math.max(22, textW + pad * 2);
      let pillFill, textFill;
      if (t.kind === 'v') { pillFill = 'rgba(0,0,0,0.18)'; textFill = 'white'; }
      else if (t.kind === 'n' || t.kind === 't') { pillFill = 'white'; textFill = '#1a1a1a'; }
      else { pillFill = SCRATCH_COLORS.operator; textFill = 'white'; }
      svg += `<rect x="${cx}" y="${cy - pillH/2}" width="${w}" height="${pillH}" rx="${pillH/2}" fill="${pillFill}" stroke="rgba(0,0,0,0.15)" stroke-width="0.6"/>`;
      svg += `<text x="${cx + w/2}" y="${cy + 4}" fill="${textFill}" font-size="12" font-weight="600" text-anchor="middle" font-family="ui-sans-serif,system-ui">${value}</text>`;
      cx += w + 4;
    }
  });
  return svg;
}
function scratchProgram(blocks) {
  const W = 340, xPad = 14;
  const { stemW, stackH, cTopH, cBotH, nD } = SCRATCH_GEOM;
  const items = [];
  let y = 10;
  function layout(list, x) {
    list.forEach(b => {
      if (b.inner && b.inner.length > 0) {
        const idx = items.length;
        items.push({ kind: 'cBlock', x, y, w: W - xPad - x, topH: cTopH, innerH: 0, botH: cBotH, text: b.text, color: SCRATCH_COLORS[b.type] || '#777' });
        y += cTopH;
        layout(b.inner, x + stemW);
        items[idx].innerH = y - items[idx].y - cTopH;
        y += cBotH;
      } else {
        const kind = b.type === 'event' ? 'hat' : b.type === 'define' ? 'define' : 'stack';
        items.push({ kind, x, y, w: W - xPad - x, h: stackH, text: b.text, color: SCRATCH_COLORS[b.type] || '#777' });
        y += stackH;
      }
    });
  }
  layout(blocks, xPad);
  const H = y + nD + 8;
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;margin:10px auto;background:#fafafa;border:1px solid #e0e0e0;border-radius:8px;">`;
  svg += `<defs><filter id="scratchShadow" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="1" stdDeviation="0.8" flood-opacity="0.2"/></filter></defs>`;
  const strokeStyle = 'stroke="rgba(0,0,0,0.18)" stroke-width="1"';
  items.forEach(it => {
    if (it.kind !== 'cBlock') return;
    const d = scratchPathCBlock(it.x, it.y, it.w, it.topH, it.innerH, it.botH);
    svg += `<path d="${d}" fill="${it.color}" ${strokeStyle} filter="url(#scratchShadow)"/>`;
    svg += scratchRenderContent(it.x, it.y, it.topH, it.text);
  });
  items.forEach(it => {
    if (it.kind === 'cBlock') return;
    const { x, y, w, h, text, kind, color } = it;
    let d;
    if (kind === 'hat') d = scratchPathHat(x, y, w, h);
    else if (kind === 'define') d = scratchPathDefine(x, y, w, h);
    else d = scratchPathStack(x, y, w, h);
    svg += `<path d="${d}" fill="${color}" ${strokeStyle} filter="url(#scratchShadow)"/>`;
    svg += scratchRenderContent(x, y, h, text);
  });
  svg += '</svg>';
  return svg;
}


/* ------------------------------------------------------------------
   THÈME 11 — ALGORITHMIQUE (Scratch niveaux 1 et 2)
   ------------------------------------------------------------------ */


function t11_scratch_boucle() {
  const prog = scratchProgram([
    { type: 'event', text: 'quand drapeau cliqué' },
    { type: 'control', text: 'répéter {n:4} fois', inner: [
      { type: 'motion', text: 'avancer de {n:50}' },
      { type: 'motion', text: 'tourner de {n:90} degrés' }
    ]}
  ]);
  return {
    theme: 'algo', title: 'Boucle « répéter … fois »',
    body: `Quelle figure trace ce programme ?${prog}`,
    type: 'qcm',
    choices: [
      "Un carré de côté 50.",
      "Un triangle équilatéral.",
      "Un rectangle 50 × 100.",
      "Un cercle."
    ],
    correctIdx: 0,
    solution: "4 répétitions de (avancer + tourner 90°) tracent un carré.",
    help: {
      cours: "Pour tracer un polygone régulier à \\(n\\) côtés : répéter \\(n\\) fois (avancer + tourner \\(\\dfrac{360°}{n}\\)).",
      savoirFaire: "Nombre de côtés × angle = 360°.",
      erreurs: ["Confondre nb côtés et angle.", "Oublier de tourner.", "Se tromper d'angle."]
    }
  };
}

function t11_scratch_angle_polygone() {
  const cases = [
    { n: 3, r: 120 }, { n: 4, r: 90 },
    { n: 5, r: 72 }, { n: 6, r: 60 }, { n: 8, r: 45 }
  ];
  const k = pick(cases);
  const prog = scratchProgram([
    { type: 'event', text: 'quand drapeau cliqué' },
    { type: 'control', text: `répéter {n:${k.n}} fois`, inner: [
      { type: 'motion', text: 'avancer de {n:50}' },
      { type: 'motion', text: 'tourner de {n:?} degrés' }
    ]}
  ]);
  return {
    theme: 'algo', title: 'Polygone régulier — angle',
    body: `Pour tracer un polygone régulier à <b>${k.n} côtés</b>, quel angle faut-il mettre à la place du « ? » (en °) ?${prog}`,
    type: 'input', expected: String(k.r), suffix: '°',
    solution: `Angle = \\(\\dfrac{360}{${k.n}} = ${k.r}°\\).`,
    help: {
      cours: "Angle extérieur d'un polygone régulier à n côtés = 360°/n.",
      savoirFaire: "Toujours diviser 360° par le nombre de côtés.",
      erreurs: ["Prendre l'angle intérieur.", "Multiplier au lieu de diviser.", "Confondre avec la somme des angles."]
    }
  };
}

function t11_scratch_condition() {
  const cases = [
    { n: 8, threshold: 5, res: 'Grand' },
    { n: 3, threshold: 5, res: 'Petit' },
    { n: 12, threshold: 10, res: 'Gagné' }
  ];
  const k = pick(cases);
  const isGrand = k.n > k.threshold;
  const msg1 = k.res === 'Grand' || k.res === 'Gagné' ? k.res : 'Grand';
  const msg2 = k.res === 'Grand' || k.res === 'Gagné' ? 'Petit' : 'Petit';
  const finalMsg = isGrand ? (k.res === 'Gagné' ? 'Gagné' : 'Grand') : 'Petit';
  const prog = scratchProgram([
    { type: 'event', text: 'quand drapeau cliqué' },
    { type: 'variable', text: `mettre {v:n} à {n:${k.n}}` },
    { type: 'control', text: `si {op:n > ${k.threshold}} alors`, inner: [
      { type: 'looks', text: `dire {t:${msg1}}` }
    ]},
    { type: 'control', text: 'sinon', inner: [
      { type: 'looks', text: `dire {t:${msg2}}` }
    ]}
  ]);
  const distract = [msg1, msg2, 'Rien', 'Les deux'].filter(d => d !== finalMsg);
  const { choices, correctIdx } = makeQCM([
    { html: finalMsg, correct: true },
    ...shuffle(distract).slice(0, 3).map(d => ({ html: d, correct: false }))
  ]);
  return {
    theme: 'algo', title: 'Instruction conditionnelle « si … alors »',
    body: `Que dit le lutin après exécution ?${prog}`,
    type: 'qcm', choices, correctIdx,
    solution: `Ici \\(n = ${k.n}\\) ${k.n > k.threshold ? '>' : '\\leq'} ${k.threshold}, donc on entre dans la branche « ${k.n > k.threshold ? 'alors' : 'sinon'} » et le lutin dit <b>${finalMsg}</b>.`,
    help: {
      cours: "<b>Si … alors … sinon</b> : teste une condition et exécute l'une ou l'autre branche.",
      savoirFaire: "1) Lire la valeur de la variable. 2) Tester la condition. 3) Suivre la branche correspondante.",
      erreurs: ["Exécuter les deux branches.", "Confondre > et ≥.", "Oublier le sinon."]
    }
  };
}

function t11_scratch_variable() {
  const cases = [
    { start: 0, step: 3, rep: 5, r: 15 },
    { start: 10, step: 2, rep: 4, r: 18 },
    { start: 0, step: 5, rep: 4, r: 20 },
    { start: 1, step: 2, rep: 6, r: 13 }
  ];
  const k = pick(cases);
  const prog = scratchProgram([
    { type: 'event', text: 'quand drapeau cliqué' },
    { type: 'variable', text: `mettre {v:x} à {n:${k.start}}` },
    { type: 'control', text: `répéter {n:${k.rep}} fois`, inner: [
      { type: 'variable', text: `ajouter {n:${k.step}} à {v:x}` }
    ]}
  ]);
  return {
    theme: 'algo', title: 'Variable qui compte',
    body: `Quelle est la valeur finale de la variable <b>x</b> ?${prog}`,
    type: 'input', expected: String(k.r),
    solution: `On part de ${k.start} et on ajoute ${k.step} à chaque passage (${k.rep} fois) : \\(${k.start} + ${k.rep} \\times ${k.step} = ${k.r}\\).`,
    help: {
      cours: "Une <b>variable</b> conserve une valeur qui peut être modifiée par le programme. Le bloc « ajouter … à » incrémente la valeur actuelle.",
      savoirFaire: "Dérouler la boucle : valeur initiale + (nb répétitions) × (pas).",
      erreurs: ["Oublier la valeur initiale.", "Compter un passage de trop.", "Confondre « mettre à » (remplace) et « ajouter à » (incrémente)."]
    }
  };
}

function t11_scratch_evenement() {
  const prog = scratchProgram([
    { type: 'event', text: 'quand drapeau cliqué' },
    { type: 'motion', text: 'avancer de {n:10}' }
  ]);
  return {
    theme: 'algo', title: 'Événement « quand drapeau cliqué »',
    body: `Quand ce script s'exécute-t-il ?${prog}`,
    type: 'qcm',
    choices: [
      "Quand l'utilisateur clique sur le drapeau vert.",
      "Au démarrage de l'ordinateur.",
      "Quand on appuie sur espace.",
      "En continu."
    ],
    correctIdx: 0,
    solution: "Le bloc <b>« quand drapeau cliqué »</b> déclenche le script au clic sur le drapeau vert.",
    help: {
      cours: "Un <b>événement</b> (drapeau cliqué, touche pressée, lutin touché...) permet de déclencher un script. C'est le « chapeau » placé en haut de la pile.",
      savoirFaire: "Repérer le bloc « quand … » qui coiffe la pile d'instructions.",
      erreurs: ["Penser qu'un script démarre tout seul.", "Confondre les blocs d'événement.", "Oublier qu'il peut y avoir plusieurs scripts en parallèle."]
    }
  };
}

// (t12_interaction_lutins a ete deplacee dans le bloc algo en haut, avec rendu SVG)


/* ==========================================================================
   EXPORT : QUESTION_BANK + THEME_META
   ========================================================================== */

/* ==========================================================================
   BLOC ÉVALUATION CALCUL LITTÉRAL — 20 générateurs alignés sur le PDF
   Spécifique : réduction signée, double distribution, factorisation avec x^n,
   équations avec fractions, mise en équation, tests.
   ========================================================================== */

/* --- 1. Réduction signée (produits) --- */
function t3e_reduire_produit() {
  const cases = [
    { expr: '-8a \\times (-10a)', r: '80a^2' },
    { expr: '-3 \\times (-7y)', r: '21y' },
    { expr: '-10x \\times 3x', r: '-30x^2' },
    { expr: '5a \\times (-4a)', r: '-20a^2' },
    { expr: '-2t \\times (-6)', r: '12t' },
    { expr: '-4y \\times 2y', r: '-8y^2' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Réduire un produit (signes)',
    body: `Réduire : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On applique la règle des signes puis on multiplie les parties littérales : \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "Produit : règle des signes (même signe → +, signes différents → −). \\(x \\times x = x^2\\).",
      savoirFaire: "1) Calculer le signe. 2) Calculer le produit des nombres. 3) Regrouper les lettres.",
      erreurs: ["Oublier le signe.", "Écrire \\(x + x\\) au lieu de \\(x^2\\).", "Se tromper sur le signe final."]
    }
  };
}

/* --- 2. Réduction signée (sommes de termes semblables) --- */
function t3e_reduire_somme() {
  const cases = [
    { expr: '-7y^2 - 10y^2', r: '-17y^2' },
    { expr: '-6y - 5y', r: '-11y' },
    { expr: '-t^2 + 7t^2', r: '6t^2' },
    { expr: '3x^2 - 8x^2', r: '-5x^2' },
    { expr: '-5a + 12a', r: '7a' },
    { expr: '-9b^2 - 3b^2', r: '-12b^2' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Réduire une somme (termes semblables)',
    body: `Réduire : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On additionne les coefficients des termes semblables : \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "Termes semblables : même lettre et même exposant (ex. \\(3y^2\\) et \\(-5y^2\\) sont semblables).",
      savoirFaire: "Ajouter les coefficients en gardant la partie littérale.",
      erreurs: ["Ajouter des termes non semblables (\\(y\\) avec \\(y^2\\)).", "Oublier le signe.", "Modifier l'exposant."]
    }
  };
}

/* --- 3. Développer produit avec signe négatif externe --- */
function t3e_developper_negatif() {
  const cases = [
    { expr: '-2(-4x + 7)', r: '8x - 14' },
    { expr: '-3(2x - 5)', r: '-6x + 15' },
    { expr: '-(3x + 4)', r: '-3x - 4' },
    { expr: '-5(-a + 3)', r: '5a - 15' },
    { expr: '-4(6 - 2y)', r: '-24 + 8y' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Développer avec signe négatif',
    body: `Développer : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `Attention aux signes : \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "Avec un signe négatif devant : tous les signes à l'intérieur sont <b>changés</b>.",
      savoirFaire: "Distribuer le \\(-k\\) à chaque terme en respectant la règle des signes.",
      erreurs: ["Oublier de changer le signe du 2e terme.", "Se tromper de signe.", "Ne pas distribuer complètement."]
    }
  };
}

/* --- 4. Double distributivité (essentielle pour l'éval) --- */
function t3e_double_distrib() {
  const cases = [
    { a: 2, b: 4, c: 3, d: 3, dev: '6x^2 + 18x + 12' },     // (2x+4)(3x+3)
    { a: 2, b: 3, c: 1, d: 4, dev: '2x^2 + 11x + 12' },     // (2x+3)(x+4)
    { a: 1, b: 5, c: 2, d: -3, dev: '2x^2 + 7x - 15' },
    { a: 3, b: -2, c: 1, d: 5, dev: '3x^2 + 13x - 10' },
    { a: 2, b: 1, c: 3, d: -4, dev: '6x^2 - 5x - 4' }
  ];
  const k = pick(cases);
  const fmt = n => (n > 0 ? '+ ' + n : '- ' + Math.abs(n));
  const expr = `(${k.a === 1 ? '' : k.a}x ${fmt(k.b)})(${k.c === 1 ? '' : k.c}x ${fmt(k.d)})`;
  const pool = cases.map(c => c.dev);
  const distract = shuffle(pool.filter(x => x !== k.dev)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.dev}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Double distributivité',
    body: `Développer et réduire : \\(${expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `\\((a+b)(c+d) = ac + ad + bc + bd\\). Puis on regroupe les termes en x.`,
    help: {
      cours: "<b>Double distributivité</b> : \\((a+b)(c+d) = ac + ad + bc + bd\\) — <b>4 produits</b> à faire.",
      savoirFaire: "Faire 4 produits, puis réduire les termes en x.",
      erreurs: ["Ne faire que 2 produits au lieu de 4.", "Oublier de réduire.", "Se tromper de signe."]
    }
  };
}

/* --- 5. Développer et réduire (plusieurs parenthèses) --- */
function t3e_develop_plusieurs_par() {
  const cases = [
    { expr: '-(3x + 4) + (7x - 1) - 2(2x - 1)', r: '-3' },       // -3x-4+7x-1-4x+2 = 0x -3
    { expr: '2(x + 3) - 3(x - 1)', r: '-x + 9' },
    { expr: '5(2x - 1) - (3x + 2)', r: '7x - 7' },
    { expr: '4(x - 2) + 3(2x + 1)', r: '10x - 5' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Développer plusieurs parenthèses',
    body: `Développer et réduire : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On développe chaque parenthèse (attention aux signes) puis on regroupe.`,
    help: {
      cours: "Méthode : développer <b>chaque</b> parenthèse une par une, puis regrouper les termes semblables.",
      savoirFaire: "1) Distribuer. 2) Regrouper les x. 3) Regrouper les constantes.",
      erreurs: ["Oublier de changer les signes sous un − devant.", "Oublier un terme.", "Additionner des termes non semblables."]
    }
  };
}

/* --- 6. Factoriser avec x^n (facteur commun littéral) --- */
function t3e_factoriser_puissance() {
  const cases = [
    { expr: 'x^2 - 3x', fact: 'x(x - 3)' },
    { expr: '9x + 12', fact: '3(3x + 4)' },
    { expr: '9x^3 - 6x^2 + 3x', fact: '3x(3x^2 - 2x + 1)' },
    { expr: '4x^2 + 8x', fact: '4x(x + 2)' },
    { expr: '5x^2 - 15x', fact: '5x(x - 3)' },
    { expr: '6x^3 + 9x', fact: '3x(2x^2 + 3)' }
  ];
  const k = pick(cases);
  const distract = shuffle(cases.filter(c => c.fact !== k.fact)).slice(0, 3).map(c => c.fact);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.fact}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Factoriser au maximum',
    body: `Factoriser au maximum : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `Identifier le plus grand facteur commun (nombre ET puissance de x).`,
    help: {
      cours: "Pour factoriser au maximum : chercher le PGCD des coefficients ET la plus petite puissance de x commune.",
      savoirFaire: "Ex. \\(6x^3 - 9x^2 = 3x^2(2x - 3)\\) : le facteur commun est \\(3x^2\\).",
      erreurs: ["Facteur trop petit (ne pas factoriser complètement).", "Oublier la puissance de x.", "Erreur de signe."]
    }
  };
}

/* --- 7. Tester une équation avec x^2 --- */
function t3e_tester_x2() {
  const cases = [
    { eq: 'x^2 - 4x = 12', val: 3, vrai: false, calc: '3² − 4×3 = 9 − 12 = −3 ≠ 12' },
    { eq: 'x^2 - 4x = 12', val: -2, vrai: true, calc: '(−2)² − 4×(−2) = 4 + 8 = 12 ✓' },
    { eq: 'x^2 + 3x = 10', val: 2, vrai: true, calc: '2² + 3×2 = 4 + 6 = 10 ✓' },
    { eq: 'x^2 - 5 = 4', val: 3, vrai: true, calc: '3² − 5 = 4 ✓' },
    { eq: '2x^2 - 8 = 0', val: 2, vrai: true, calc: '2×4 − 8 = 0 ✓' }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: 'Oui', correct: k.vrai },
    { html: 'Non', correct: !k.vrai }
  ]);
  return {
    theme: 'algebre', title: 'Tester une équation avec x²',
    body: `Est-ce que \\(x = ${k.val}\\) est solution de l'équation \\(${k.eq}\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `On remplace et on vérifie : ${k.calc}.`,
    help: {
      cours: "Tester : remplacer x par la valeur, calculer chaque membre, comparer.",
      savoirFaire: "Bien utiliser les parenthèses autour des valeurs négatives pour \\(x^2\\).",
      erreurs: ["Oublier les parenthèses : \\(-2^2 = -4\\) mais \\((-2)^2 = 4\\) !", "Erreur de calcul.", "Confondre = et ≠."]
    }
  };
}

/* --- 8. Équations avec fraction (x/3 + 4 = -5) --- */
function t3e_equation_fraction() {
  const cases = [
    { eq: '\\dfrac{x}{3} + 4 = -5', sol: '-27' },    // x/3 = -9 → x = -27
    { eq: '\\dfrac{x}{2} - 1 = 6', sol: '14' },
    { eq: '\\dfrac{x}{5} + 3 = 7', sol: '20' },
    { eq: '\\dfrac{x}{4} - 2 = -1', sol: '4' },
    { eq: '\\dfrac{2x}{3} = 6', sol: '9' }
  ];
  const k = pick(cases);
  return {
    theme: 'algebre', title: 'Équation avec fraction',
    body: `Résoudre : \\(${k.eq}\\).`,
    type: 'input', expected: k.sol,
    solution: `On isole la fraction, puis on multiplie par le dénominateur.`,
    help: {
      cours: "Pour résoudre avec \\(\\dfrac{x}{n}\\) : isoler la fraction, puis multiplier les deux membres par \\(n\\).",
      savoirFaire: "1) Soustraire la constante. 2) Multiplier les deux côtés par le dénominateur.",
      erreurs: ["Oublier de multiplier les deux membres.", "Se tromper de signe.", "Diviser au lieu de multiplier."]
    }
  };
}

/* --- 9. Équation avec développement préalable --- */
function t3e_equation_developpement() {
  const cases = [
    { eq: '2(3x - 4) - 5(2x + 1) = 0', sol: '-13/4', numeric: -3.25 },
    { eq: '3(x - 2) = 2(x + 1)', sol: '8', numeric: 8 },
    { eq: '4(x - 1) - 3(x + 2) = 0', sol: '10', numeric: 10 },
    { eq: '5(2x - 3) = 3(x + 4)', sol: '27/7', numeric: 27/7 }
  ];
  const k = pick(cases);
  const expected = Number.isInteger(k.numeric)
    ? [String(k.numeric)]
    : [k.sol, k.sol.replace('/', ' / '), k.numeric.toFixed(2).replace('.', ',')];
  return {
    theme: 'algebre', title: 'Équation avec développement',
    body: `Résoudre : \\(${k.eq}\\).`,
    type: 'input', expected,
    solution: `Développer des deux côtés, regrouper, puis résoudre.`,
    help: {
      cours: "Méthode : 1) Développer chaque parenthèse. 2) Regrouper les x d'un côté, les constantes de l'autre. 3) Diviser.",
      savoirFaire: "Toujours développer AVANT de regrouper.",
      erreurs: ["Oublier de distribuer.", "Se tromper de signe lors du regroupement.", "Erreur dans la division finale."]
    }
  };
}

/* --- 10. Mise en équation — problème "pense à un nombre" --- */
function t3e_probleme_nombre() {
  const cases = [
    {
      q: "Jean pense à un nombre, le multiplie par −3 puis ajoute 12. Il obtient 4. Quel est ce nombre ?",
      equation: "-3x + 12 = 4", sol: '8/3', numeric: 8/3
    },
    {
      q: "Un nombre, multiplié par 5, puis augmenté de 3, donne 28. Quel est ce nombre ?",
      equation: "5x + 3 = 28", sol: '5', numeric: 5
    },
    {
      q: "Le double d'un nombre, diminué de 7, donne 11. Quel est ce nombre ?",
      equation: "2x - 7 = 11", sol: '9', numeric: 9
    },
    {
      q: "Le triple d'un nombre, augmenté de 4, donne le double du nombre, diminué de 1. Quel est ce nombre ?",
      equation: "3x + 4 = 2x - 1", sol: '-5', numeric: -5
    }
  ];
  const k = pick(cases);
  const expected = Number.isInteger(k.numeric)
    ? [String(k.numeric)]
    : [k.sol, k.numeric.toFixed(2).replace('.', ',')];
  return {
    theme: 'algebre', title: 'Mise en équation — un nombre',
    body: k.q,
    type: 'input', expected,
    solution: `On pose \\(x\\) = nombre cherché. Équation : \\(${k.equation}\\). Résolution : \\(x = ${k.sol}\\).`,
    help: {
      cours: "Méthode : 1) Choisir l'inconnue. 2) Traduire chaque étape. 3) Écrire l'équation. 4) Résoudre.",
      savoirFaire: "Traduire les mots en opérations : \"multiplier par\" → ×, \"ajouter\" → +.",
      erreurs: ["Mal traduire l'énoncé.", "Oublier une étape.", "Ne pas conclure (donner le nombre)."]
    }
  };
}

/* --- 11. Mise en équation — problème concret (classeurs, prix) --- */
function t3e_probleme_prix() {
  const cases = [
    {
      q: "Blandine achète 6 classeurs et 1 livre pour 27,60 €. Le livre coûte 12 €. Quel est le prix (en €) d'un classeur ?",
      sol: '2,60', equation: "6x + 12 = 27,60"
    },
    {
      q: "5 stylos identiques et un cahier à 4 € coûtent au total 14 €. Quel est le prix (en €) d'un stylo ?",
      sol: '2', equation: "5x + 4 = 14"
    },
    {
      q: "Marie achète 3 t-shirts identiques et un pantalon à 25 €. Le total fait 58 €. Quel est le prix (en €) d'un t-shirt ?",
      sol: '11', equation: "3x + 25 = 58"
    },
    {
      q: "Un club de sport propose un abonnement annuel à 45 € plus 3 € par séance. Léa paie 105 €. Combien de séances a-t-elle suivies ?",
      sol: '20', equation: "45 + 3x = 105"
    },
    {
      q: "Pour réduire la consommation, une famille a déjà économisé 8 litres, puis économise 2 litres par jour. Elle veut atteindre 30 L économisés. Combien de jours faudra-t-il ?",
      sol: '11', equation: "8 + 2x = 30"
    },
    {
      q: "Au restaurant, Tom commande 2 plats identiques et un dessert à 5 €. Il paie 31 €. Quel est le prix (en €) d'un plat ?",
      sol: '13', equation: "2x + 5 = 31"
    },
    {
      q: "Un livreur parcourt chaque jour une distance fixe de 4 km à pied, plus 12 km à vélo par course. En une journée, il parcourt 52 km. Combien a-t-il fait de courses ?",
      sol: '4', equation: "4 + 12x = 52"
    }
  ];
  const k = pick(cases);
  return {
    theme: 'algebre', title: 'Mise en équation — prix',
    body: k.q,
    type: 'input', expected: [k.sol, k.sol.replace(',', '.')],
    solution: `Soit \\(x\\) l'inconnue. Équation : \\(${k.equation}\\). D'où \\(x = ${k.sol}\\).`,
    help: {
      cours: "Pour une mise en équation : nommer l'inconnue, exprimer le total, résoudre.",
      savoirFaire: "Vérifier avec la valeur trouvée que le total est bon.",
      erreurs: ["Oublier une partie du total.", "Mal traduire.", "Ne pas finaliser (\"donc x = ...\")."]
    }
  };
}

/* --- 12. Expression somme ou produit ? --- */
function t3e_structure_expression() {
  const cases = [
    { expr: '3x + 12', nature: 'somme' },
    { expr: '3(x + 4)', nature: 'produit' },
    { expr: '5(2x - 1)', nature: 'produit' },
    { expr: '10x - 5', nature: 'somme' },
    { expr: '(x + 2)(x - 3)', nature: 'produit' },
    { expr: '7x^2 + 3x - 2', nature: 'somme' },
    { expr: '2x \\times (x + 1)', nature: 'produit' }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: 'Une somme', correct: k.nature === 'somme' },
    { html: 'Un produit', correct: k.nature === 'produit' }
  ]);
  return {
    theme: 'algebre', title: 'Somme ou produit ?',
    body: `L'expression \\(${k.expr}\\) est-elle une somme ou un produit ? (On regarde la <b>dernière opération</b>.)`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(${k.expr}\\) est un(e) <b>${k.nature}</b> — car la dernière opération à effectuer est ${k.nature === 'somme' ? 'une addition/soustraction' : 'une multiplication'}.`,
    help: {
      cours: "La <b>nature</b> d'une expression = sa <b>dernière opération</b>.<br>• <b>Somme</b> : se termine par + ou − entre deux termes (forme développée).<br>• <b>Produit</b> : multiplication entre nombres et/ou parenthèses (forme factorisée).",
      savoirFaire: "Imaginer l'ordre de calcul avec une valeur pour x : quelle serait la toute dernière opération ?",
      erreurs: ["Confondre forme développée / factorisée.", "Ignorer les parenthèses.", "Se fier au 1er signe au lieu de la dernière opération."]
    }
  };
}

/* --- 13. Distributivité + identification --- */
function t3e_identifier_facteur_commun() {
  const cases = [
    { expr: '15x + 25', fc: '5' },
    { expr: '8x^2 - 12x', fc: '4x' },
    { expr: '6a + 9b', fc: '3' },
    { expr: '10x^2 + 15x', fc: '5x' },
    { expr: '24x^3 - 16x^2', fc: '8x^2' }
  ];
  const k = pick(cases);
  const pool = ['5', '4x', '3', '5x', '8x^2', '2x', '6'];
  const distract = shuffle(pool.filter(x => x !== k.fc)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.fc}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Identifier le facteur commun',
    body: `Quel est le plus grand facteur commun de \\(${k.expr}\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `Le plus grand facteur commun est <b>\\(${k.fc}\\)</b>.`,
    help: {
      cours: "Le <b>plus grand facteur commun</b> = le plus grand nombre commun × la plus petite puissance de x commune.",
      savoirFaire: "Décomposer chaque terme en facteurs pour voir les communs.",
      erreurs: ["Choisir un facteur trop petit.", "Oublier la partie littérale.", "Ne pas prendre la plus petite puissance."]
    }
  };
}

/* --- 14. Équation produit nul (préfiguration, simple) --- */
function t3e_equation_facile() {
  const cases = [
    { eq: 'x + 5 = 12', sol: '7' },
    { eq: '5x - 2 = 8', sol: '2' },
    { eq: '8x - 2 = 6x - 10', sol: '-4' },
    { eq: '3x + 7 = 1', sol: '-2' },
    { eq: '4x = -12', sol: '-3' },
    { eq: 'x + 9 = 5', sol: '-4' }
  ];
  const k = pick(cases);
  return {
    theme: 'algebre', title: 'Équation — premier degré',
    body: `Résoudre : \\(${k.eq}\\).`,
    type: 'input', expected: k.sol,
    solution: `Isoler x : on obtient \\(x = ${k.sol}\\).`,
    help: {
      cours: "Résoudre : isoler x en faisant l'opération inverse de chaque côté.",
      savoirFaire: "+ ↔ − ; × ↔ ÷.",
      erreurs: ["Faire la même opération d'un seul côté.", "Se tromper de signe.", "Oublier de finaliser (\"x = ...\")."]
    }
  };
}

/* --- 15. Produit de deux écritures (a × a = a²) --- */
function t3e_simplifier_produit_lettres() {
  const cases = [
    { expr: 'x \\times x', r: 'x^2' },
    { expr: '3x \\times 4x', r: '12x^2' },
    { expr: '2a \\times a \\times a', r: '2a^3' },
    { expr: '5 \\times x \\times x \\times x', r: '5x^3' },
    { expr: '-2y \\times 3y', r: '-6y^2' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'algebre', title: 'Simplifier un produit littéral',
    body: `Simplifier : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "\\(x \\times x = x^2\\), \\(x \\times x \\times x = x^3\\)… On additionne les exposants d'une même lettre.",
      savoirFaire: "Multiplier les nombres, puis compter les lettres identiques.",
      erreurs: ["Écrire \\(2x\\) au lieu de \\(x^2\\).", "Oublier le signe.", "Multiplier les exposants au lieu de les ajouter."]
    }
  };
}

/* --- 16. Substitution (valeur d'expression) --- */
function t3e_valeur_expression() {
  const cases = [
    { expr: '3x - 7', x: 2, r: -1 },
    { expr: 'x^2 + 3', x: 4, r: 19 },
    { expr: '2(x + 5)', x: 3, r: 16 },
    { expr: '-x + 4', x: -2, r: 6 },
    { expr: 'x^2 - 2x', x: 5, r: 15 }
  ];
  const k = pick(cases);
  return {
    theme: 'algebre', title: 'Calculer une expression pour une valeur',
    body: `Calculer \\(${k.expr}\\) pour \\(x = ${k.x}\\).`,
    type: 'input', expected: String(k.r),
    solution: `On remplace x par ${k.x} : \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "Substituer = remplacer la lettre par sa valeur, en respectant les priorités.",
      savoirFaire: "Utiliser des parenthèses autour de la valeur surtout si elle est négative.",
      erreurs: ["Oublier les parenthèses.", "Erreur de priorités.", "Oublier une opération."]
    }
  };
}

/* --- 17. Développer avec k(ax + b)(…) en 2 temps --- */
function t3e_developper_complexe() {
  const cases = [
    { expr: '2(x + 3)(x - 1)', r: '2x^2 + 4x - 6' },
    { expr: '3(2x - 1)(x + 2)', r: '6x^2 + 9x - 6' },
    { expr: '-(x + 2)(x - 3)', r: '-x^2 + x + 6' }
  ];
  const k = pick(cases);
  const distract = cases.filter(c => c.r !== k.r).map(c => c.r);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.slice(0, 3).map(d => ({ html: `\\(${d}\\)`, correct: false })),
    { html: `\\(${k.r.replace('+', '-')}\\)`, correct: false }
  ].slice(0, 4));
  return {
    theme: 'algebre', title: 'Développer un produit plus complexe',
    body: `Développer et réduire : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `Développer d'abord le produit de parenthèses, puis distribuer le coefficient extérieur.`,
    help: {
      cours: "Ordre : 1) Développer les parenthèses entre elles (double distrib). 2) Distribuer le coefficient.",
      savoirFaire: "Faire étape par étape, ne pas sauter d'étape.",
      erreurs: ["Sauter une étape.", "Erreur de signe.", "Oublier de réduire."]
    }
  };
}

/* --- 18. Vérifier un développement --- */
function t3e_verifier_egalite() {
  return {
    theme: 'algebre', title: 'Vérifier une égalité',
    body: "L'égalité \\(3(x + 2) = 3x + 6\\) est-elle vraie pour toutes les valeurs de x ?",
    type: 'qcm',
    choices: [
      "Oui, c'est la distributivité.",
      "Non, seulement pour certaines valeurs de x.",
      "Oui, mais seulement pour x > 0.",
      "Non, elle est toujours fausse."
    ],
    correctIdx: 0,
    solution: "La distributivité \\(k(a+b) = ka + kb\\) est toujours vraie, quelle que soit la valeur de x.",
    help: {
      cours: "Une égalité qui est vraie pour toutes les valeurs = une identité.",
      savoirFaire: "Vérifier en développant puis comparer.",
      erreurs: ["Tester une seule valeur.", "Confondre égalité et équation.", "Douter d'une identité."]
    }
  };
}

/* --- 19. Équation avec regroupement complexe --- */
function t3e_equation_complexe() {
  const cases = [
    { eq: '2x + 3 = -x + 9', sol: '2' },
    { eq: '5x - 1 = 2x + 8', sol: '3' },
    { eq: '7x + 4 = 3x - 8', sol: '-3' },
    { eq: '-x + 6 = 2x - 9', sol: '5' }
  ];
  const k = pick(cases);
  return {
    theme: 'algebre', title: 'Équation — regroupement',
    body: `Résoudre : \\(${k.eq}\\).`,
    type: 'input', expected: k.sol,
    solution: `Regrouper les x d'un côté et les constantes de l'autre : \\(x = ${k.sol}\\).`,
    help: {
      cours: "Passer les x à gauche, les nombres à droite, diviser par le coefficient.",
      savoirFaire: "Changer le signe d'un terme quand il change de côté.",
      erreurs: ["Oublier de changer le signe.", "Se tromper de côté.", "Diviser mal à la fin."]
    }
  };
}

/* --- 20. Problème de périmètre (mise en équation géométrie) --- */
function t3e_probleme_perimetre() {
  return {
    theme: 'algebre', title: 'Mise en équation — périmètre',
    body: "Un triangle équilatéral et un carré ont le même périmètre. Le côté du triangle mesure \\(x\\) cm. Le côté du carré mesure \\(x - 2\\) cm. Quelle est la valeur de \\(x\\) ?",
    type: 'input', expected: '8',
    solution: "Triangle : \\(3x\\). Carré : \\(4(x - 2) = 4x - 8\\). Équation : \\(3x = 4x - 8\\) donc \\(x = 8\\) cm.",
    help: {
      cours: "Écrire chaque périmètre en fonction de x, égaler les deux, résoudre.",
      savoirFaire: "Périmètre triangle équilatéral = 3 × côté. Périmètre carré = 4 × côté.",
      erreurs: ["Oublier que le périmètre d'un triangle équilatéral = 3×.", "Erreur de distribution.", "Ne pas conclure (avec unité)."]
    }
  };
}

/* ==========================================================================
   BLOC RATTRAPAGE PUISSANCES — 15 générateurs
   ========================================================================== */

/* --- P1. Puissance d'un relatif (signe) --- */
function t1p_puissance_relatif() {
  const cases = [
    { expr: '(-2)^3', r: -8 }, { expr: '(-2)^4', r: 16 },
    { expr: '-2^3', r: -8 }, { expr: '-2^4', r: -16 },
    { expr: '(-3)^2', r: 9 }, { expr: '-3^2', r: -9 },
    { expr: '(-5)^2', r: 25 }, { expr: '-(-3)^2', r: -9 },
    { expr: '(-1)^{100}', r: 1 }, { expr: '(-1)^{99}', r: -1 }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Puissance d\'un relatif',
    body: `Calculer : \\(${k.expr}\\).`,
    type: 'input', expected: String(k.r),
    solution: `\\(${k.expr} = ${k.r}\\). Attention aux parenthèses !`,
    help: {
      cours: "⚠ <b>Sans parenthèses</b> : \\(-2^2 = -(2^2) = -4\\). <b>Avec parenthèses</b> : \\((-2)^2 = 4\\).",
      savoirFaire: "Signe − : exposant pair → +, impair → −.",
      erreurs: ["Confondre \\(-a^n\\) et \\((-a)^n\\).", "Oublier la règle signe-exposant.", "Erreur de calcul."]
    }
  };
}

/* --- P2. Produit de puissances même base --- */
function t1p_produit_meme_base() {
  const cases = [
    { expr: '7^5 \\times 7^9', r: '7^{14}' },
    { expr: '5^2 \\times 5^{13}', r: '5^{15}' },
    { expr: '10^5 \\times 10^8', r: '10^{13}' },
    { expr: '3^4 \\times 3^2', r: '3^6' },
    { expr: '2^7 \\times 2^3', r: '2^{10}' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Produit de puissances de même base',
    body: `Simplifier : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(a^m \\times a^n = a^{m+n}\\). Donc \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "<b>Règle</b> : \\(a^m \\times a^n = a^{m+n}\\) — on <b>additionne</b> les exposants.",
      savoirFaire: "Même base → on additionne les exposants, la base ne change pas.",
      erreurs: ["Multiplier les exposants au lieu d'additionner.", "Multiplier les bases.", "Oublier que la base reste identique."]
    }
  };
}

/* --- P3. Quotient de puissances même base --- */
function t1p_quotient_meme_base() {
  const cases = [
    { expr: '\\dfrac{6^8}{6^7}', r: '6' },
    { expr: '\\dfrac{12^8}{12^4}', r: '12^4' },
    { expr: '\\dfrac{10^{12}}{10^5}', r: '10^7' },
    { expr: '\\dfrac{5^{10}}{5^3}', r: '5^7' },
    { expr: '\\dfrac{2^9}{2^6}', r: '2^3' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Quotient de puissances de même base',
    body: `Simplifier : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(\\dfrac{a^m}{a^n} = a^{m-n}\\). Donc \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "<b>Règle</b> : \\(\\dfrac{a^m}{a^n} = a^{m-n}\\) — on <b>soustrait</b> les exposants.",
      savoirFaire: "Même base → on soustrait l'exposant du bas à celui du haut.",
      erreurs: ["Diviser les exposants.", "Inverser l'ordre de la soustraction.", "Oublier que la base reste identique."]
    }
  };
}

/* --- P4. Produit de puissances de 10 (négatifs compris) --- */
function t1p_puissance_10_produit() {
  const cases = [
    { expr: '10^5 \\times 10^{-4}', r: '10^1' },
    { expr: '10^{-3} \\times 10^8', r: '10^5' },
    { expr: '10^2 \\times 10^{-7}', r: '10^{-5}' },
    { expr: '10^{-6} \\times 10^{-3}', r: '10^{-9}' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Produit de puissances de 10',
    body: `Simplifier : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On additionne les exposants (même pour les négatifs) : \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "\\(10^m \\times 10^n = 10^{m+n}\\). Attention aux signes des exposants.",
      savoirFaire: "Additionner les exposants en respectant la règle des signes.",
      erreurs: ["Erreur de signe.", "Multiplier au lieu d'additionner.", "Oublier un exposant négatif."]
    }
  };
}

/* --- P5. Quotient de puissances de 10 (exposants négatifs) --- */
function t1p_puissance_10_quotient() {
  const cases = [
    { expr: '\\dfrac{10^5 \\times 10^{-4}}{10^{-3}}', r: '10^4' },
    { expr: '\\dfrac{10 \\times 10^{-4}}{10^{-8}}', r: '10^5' },
    { expr: '\\dfrac{10^{-12} \\times 10^8}{10^4}', r: '10^{-8}' }
  ];
  const k = pick(cases);
  const pool = ['10^4','10^5','10^{-8}','10^3','10^{-2}','10^{10}'];
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Puissances de 10 — produit/quotient',
    body: `Simplifier : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `On additionne les exposants du numérateur, puis on soustrait celui du dénominateur.`,
    help: {
      cours: "Combiner les règles : produit (addition) + quotient (soustraction) des exposants.",
      savoirFaire: "Traiter le numérateur d'abord, puis la division.",
      erreurs: ["Erreur de signe cumulée.", "Oublier un exposant.", "Inverser ordre des opérations."]
    }
  };
}

/* --- P6. Exposant 0 et 1 --- */
function t1p_exposant_0_1() {
  const cases = [
    { expr: '(-2)^0', r: '1' },
    { expr: '(-3)^0', r: '1' },
    { expr: '7^0', r: '1' },
    { expr: '5^1', r: '5' },
    { expr: '(-4)^1', r: '-4' }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Exposant 0 ou 1',
    body: `Calculer : \\(${k.expr}\\).`,
    type: 'input', expected: k.r,
    solution: `\\(a^0 = 1\\) (pour \\(a \\neq 0\\)) et \\(a^1 = a\\). Donc \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "<b>Conventions</b> : \\(a^0 = 1\\) (sauf pour 0) et \\(a^1 = a\\).",
      savoirFaire: "Retenir : tout nombre non nul à la puissance 0 donne 1.",
      erreurs: ["Écrire \\(a^0 = 0\\) (faux !).", "Écrire \\(a^1 = 1\\).", "Confondre \\(0^a\\) et \\(a^0\\)."]
    }
  };
}

/* --- P7. Priorités opératoires avec puissances --- */
function t1p_priorites_puissances() {
  const cases = [
    { expr: '5^2 - (5 \\times 2 - 4^2)^2', r: '-11' },    // 25 - (10-16)^2 = 25 - 36 = -11
    { expr: '(2 - 3)^2 - (2^2 - 3^2)', r: '6' },            // (-1)^2 - (4-9) = 1 -(-5) = 6
    { expr: '5^2 \\times (7^2 - 50)', r: '-25' },           // 25 × (49-50) = 25 × (-1) = -25
    { expr: '-3^2 \\times (3 - 5)^2', r: '-36' }            // -9 × 4 = -36
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Priorités avec puissances',
    body: `Calculer : \\(${k.expr}\\).`,
    type: 'input', expected: String(k.r),
    solution: `Priorités : parenthèses, puissances, × et ÷, + et −. \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "<b>PEMDAS / PPMA</b> : Parenthèses, Puissances, Multiplications/Divisions, Additions/Soustractions.",
      savoirFaire: "Calculer d'abord l'intérieur des parenthèses, puis les puissances, puis les produits, puis les sommes.",
      erreurs: ["Calculer de gauche à droite sans tenir compte des priorités.", "Oublier les parenthèses.", "Mal gérer \\(-a^2\\) vs \\((-a)^2\\)."]
    }
  };
}

/* --- P8. Écrire en puissance (produit itéré) --- */
function t1p_ecrire_puissance() {
  const cases = [
    { expr: '7 \\times 7 \\times 7 \\times 7 \\times 7', r: '7^5' },
    { expr: '2 \\times 2 \\times 2', r: '2^3' },
    { expr: '5 \\times 5 \\times 5 \\times 5', r: '5^4' },
    { expr: '0{,}3 \\times 0{,}3 \\times 0{,}3 \\times 0{,}3', r: '0{,}3^4' },
    { expr: '8 \\times 8 \\times 8 \\times 8 \\times 8', r: '8^5' }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Écrire sous forme de puissance',
    body: `Écrire \\(${k.expr}\\) sous la forme \\(a^n\\).`,
    type: 'input', expected: [k.r, k.r.replace('{,}', ','), k.r.replace('{,}', '.')],
    solution: `\\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "\\(a^n\\) = produit de \\(n\\) fois \\(a\\) par lui-même.",
      savoirFaire: "Compter le nombre de facteurs = exposant.",
      erreurs: ["Multiplier le nombre par l'exposant.", "Oublier un facteur.", "Confondre \\(a^n\\) et \\(a \\times n\\)."]
    }
  };
}

/* --- P9. Écriture scientifique avec ×10^n explicite --- */
function t1p_ecriture_sci_basic() {
  const cases = [
    { n: '56{,}8 \\times 10^2', sci: '5{,}68 \\times 10^3' },
    { n: '0{,}0023 \\times 10^{-7}', sci: '2{,}3 \\times 10^{-10}' },
    { n: '123{,}45 \\times 10^{-4}', sci: '1{,}2345 \\times 10^{-2}' },
    { n: '0{,}091 \\times 10^2', sci: '9{,}1' }
  ];
  const k = pick(cases);
  const distract = shuffle(cases.filter(c => c.sci !== k.sci)).slice(0, 3).map(c => c.sci);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.sci}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'calcul', title: 'Écriture scientifique (conversion)',
    body: `Quelle est l'écriture scientifique de \\(${k.n}\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `Ajuster la virgule pour que la partie décimale soit entre 1 et 10, et ajuster l'exposant.`,
    help: {
      cours: "Écriture scientifique : \\(a \\times 10^n\\) avec \\(1 \\leq a < 10\\).",
      savoirFaire: "Décaler la virgule, compenser sur l'exposant (attention au signe).",
      erreurs: ["Partie décimale ≥ 10.", "Erreur de signe sur l'exposant.", "Ne pas compenser décalage."]
    }
  };
}

/* --- P10. Trouver n : 0,0045 × 10^n = 4,5 --- */
function t1p_trouver_n() {
  const cases = [
    { before: '0{,}0045 \\times 10^n', after: '4{,}5', n: 3 },
    { before: '0{,}0704 \\times 10^n', after: '7{,}04', n: 2 },
    { before: '0{,}0000002 \\times 10^n', after: '2', n: 7 },
    { before: '23 \\times 10^n', after: '2{,}3', n: -1 },
    { before: '4500 \\times 10^n', after: '4{,}5', n: -3 }
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Trouver l\'exposant n',
    body: `Déterminer l'entier \\(n\\) tel que \\(${k.before} = ${k.after}\\).`,
    type: 'input', expected: String(k.n),
    solution: `On compte les décalages de virgule entre les deux écritures : \\(n = ${k.n}\\).`,
    help: {
      cours: "Pour passer de l'un à l'autre, on décale la virgule. Chaque décalage vers la droite = exposant +1 (pour que le nombre reste égal).",
      savoirFaire: "Compter les pas de virgule, regarder le sens pour le signe.",
      erreurs: ["Signe de n inversé.", "Erreur de comptage.", "Confondre sens du décalage."]
    }
  };
}

/* --- P11. Programme de calcul (justifier l'égalité) --- */
function t1p_programme_calcul() {
  return {
    theme: 'calcul', title: 'Programme de calcul (égalité de puissances)',
    body: "Justifier que \\((2 \\times 3)^4 = 2^4 \\times 3^4\\). Que vaut ce nombre ?",
    type: 'input', expected: '1296',
    solution: "\\((2 \\times 3)^4 = 6^4 = 1296\\). Et \\(2^4 \\times 3^4 = 16 \\times 81 = 1296\\). Propriété : \\((a \\times b)^n = a^n \\times b^n\\).",
    help: {
      cours: "<b>Propriété</b> : \\((a \\times b)^n = a^n \\times b^n\\).",
      savoirFaire: "Calculer soit le produit d'abord, soit chaque puissance, puis comparer.",
      erreurs: ["Confondre avec \\((a+b)^n\\) (faux).", "Erreur de calcul.", "Oublier la propriété."]
    }
  };
}

/* --- P12. Propriété (a×b)^n --- */
function t1p_produit_puissance_n() {
  const cases = [
    { expr: '(3 \\times 5)^3', r: '3^3 \\times 5^3' },
    { expr: '(2 \\times 7)^5', r: '2^5 \\times 7^5' },
    { expr: '(2 \\times 5)^4', r: '2^4 \\times 5^4' }
  ];
  const k = pick(cases);
  const distract = cases.filter(c => c.r !== k.r).slice(0, 2).map(c => c.r);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false })),
    { html: `\\(${k.expr.replace('^', ' + ')}\\)`, correct: false }
  ]);
  return {
    theme: 'calcul', title: '(a × b)^n',
    body: `Développer : \\(${k.expr}\\).`,
    type: 'qcm', choices, correctIdx,
    solution: `\\((a \\times b)^n = a^n \\times b^n\\). Donc \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "<b>Propriété</b> : \\((a \\times b)^n = a^n \\times b^n\\).",
      savoirFaire: "Élever chaque facteur à la puissance n.",
      erreurs: ["Oublier d'élever un des facteurs.", "Confondre avec distributivité.", "Multiplier l'exposant par 2."]
    }
  };
}

/* --- P13. Factoriser une expression de puissances --- */
function t1p_factoriser_puissances() {
  const cases = [
    { expr: '2 \\times 3^2 + 2 \\times 3^2', r: '2 \\times 3^3' },      // 2×(3²+3²)=2×2×3²=4×9=36=... pas top
    { expr: '3^{15} \\times 2^{10} - 3^{13} \\times 2^{10}', r: '2^{10} \\times 3^{13} \\times 8' }
  ];
  return {
    theme: 'calcul', title: 'Factoriser des puissances',
    body: "Écrire \\(2 \\times 3^2 + 2 \\times 3^2\\) sous la forme \\(a^n\\).",
    type: 'qcm',
    choices: [
      "\\(2^2 \\times 3^2\\)",
      "\\(2 \\times 3^4\\)",
      "\\(4 \\times 9\\)",
      "\\(2^2 \\times 3^3\\)"
    ],
    correctIdx: 0,
    solution: "\\(2 \\times 3^2 + 2 \\times 3^2 = 2 \\times (3^2 + 3^2) = 2 \\times 2 \\times 3^2 = 2^2 \\times 3^2\\).",
    help: {
      cours: "On factorise par le facteur commun, puis on simplifie.",
      savoirFaire: "Identifier le facteur commun, le sortir, simplifier.",
      erreurs: ["Ajouter les exposants au lieu de factoriser.", "Mal additionner.", "Confondre + et ×."]
    }
  };
}

/* --- P14. Puissance avec parenthèses complexes --- */
function t1p_calcul_complexe() {
  const cases = [
    { expr: '(-3 + 2)^3 \\times (1 - 3)^2', r: -4 },     // (-1)^3 × (-2)^2 = -1 × 4 = -4
    { expr: '-3^2 \\times (3 - 5)^2', r: -36 },           // -9 × 4 = -36
    { expr: '(2 - 5)^2 \\times (-2)^3', r: -72 },          // 9 × (-8) = -72
    { expr: '(-1)^{10} + (-1)^5', r: 0 }                    // 1 + (-1) = 0
  ];
  const k = pick(cases);
  return {
    theme: 'calcul', title: 'Calcul complexe avec puissances',
    body: `Calculer : \\(${k.expr}\\).`,
    type: 'input', expected: String(k.r),
    solution: `Calculer chaque partie séparément, puis combiner : \\(${k.expr} = ${k.r}\\).`,
    help: {
      cours: "Respecter l'ordre : parenthèses, puis puissances, puis ×.",
      savoirFaire: "Calculer chaque facteur avant de les multiplier.",
      erreurs: ["Distribuer la puissance sur une somme.", "Confondre parenthèses et pas.", "Erreur de signe."]
    }
  };
}

/* --- P15. Problème de doublement (bactéries / cellules) --- */
function t1p_doublement() {
  return {
    theme: 'calcul', title: 'Problème de doublement',
    body: "Une cellule de bambou se divise en 2 toutes les heures. On part de 1 cellule à midi. Combien y a-t-il de cellules au bout de 7 heures ?",
    type: 'input', expected: '128',
    solution: "Après n heures : \\(2^n\\) cellules. Au bout de 7 h : \\(2^7 = 128\\) cellules.",
    help: {
      cours: "Doublement itéré : \\(2^n\\) après n étapes.",
      savoirFaire: "Compter les heures, élever 2 à cette puissance.",
      erreurs: ["Utiliser n au lieu de 2^n.", "Multiplier par 2 au lieu d'élever.", "Erreur de compte d'heures."]
    }
  };
}




/* ==========================================================================
   BLOC ENRICHISSEMENT — attendus 4ème stricts (PDF Eduscol)
   Ajout équilibré dans les thèmes sous-représentés
   ========================================================================== */

/* --- ESPACE (+4) --- */

function t7_aire_face_pave() {
  const cases = [
    { L: 8, l: 5, h: 3, face: 'de dessus', r: 40, sol: '\\(L \\times l = 8 \\times 5 = 40\\)' },
    { L: 10, l: 4, h: 6, face: 'de devant', r: 60, sol: '\\(L \\times h = 10 \\times 6 = 60\\)' },
    { L: 12, l: 7, h: 2, face: 'de côté', r: 14, sol: '\\(l \\times h = 7 \\times 2 = 14\\)' },
    { L: 6, l: 6, h: 4, face: 'de dessus', r: 36, sol: '\\(6 \\times 6 = 36\\)' }
  ];
  const k = pick(cases);
  return {
    theme: 'espace', title: 'Aire d\'une face d\'un pavé droit',
    body: `Un pavé droit a pour dimensions L = ${k.L} cm, l = ${k.l} cm et h = ${k.h} cm. Quelle est l'aire de la face ${k.face} (en cm²) ?`,
    type: 'input', expected: String(k.r), suffix: 'cm²',
    solution: `L'aire de la face ${k.face} est ${k.sol} cm².`,
    help: {
      cours: "Chaque face d'un pavé droit est un rectangle. Aire d'un rectangle = L × l.",
      savoirFaire: "Identifier les 2 dimensions de la face (pas les 3).",
      erreurs: ["Utiliser les 3 dimensions.", "Confondre aire et volume.", "Oublier l'unité (cm²)."]
    }
  };
}

function t7_volume_pave() {
  const cases = [
    { L: 12, l: 6, h: 4, r: 288 }, { L: 5, l: 5, h: 5, r: 125 },
    { L: 8, l: 3, h: 10, r: 240 }, { L: 15, l: 2, h: 6, r: 180 }
  ];
  const k = pick(cases);
  return {
    theme: 'espace', title: 'Volume d\'un pavé droit',
    body: `Calculer le volume d'un pavé droit de dimensions ${k.L} cm × ${k.l} cm × ${k.h} cm (en cm³).`,
    type: 'input', expected: String(k.r), suffix: 'cm³',
    solution: `\\(V = L \\times l \\times h = ${k.L} \\times ${k.l} \\times ${k.h} = ${k.r}\\) cm³.`,
    help: {
      cours: "Volume d'un pavé droit : \\(V = L \\times l \\times h\\).",
      savoirFaire: "Multiplier les 3 dimensions dans le même unité.",
      erreurs: ["N'utiliser que 2 dimensions (c'est une aire).", "Additionner au lieu de multiplier.", "Oublier cm³."]
    }
  };
}

function t7_patron() {
  const cases = [
    { q: "Le patron d'une pyramide à base carrée est composé de :", a: "1 carré et 4 triangles", opts: ["1 carré et 4 triangles", "1 carré et 4 rectangles", "4 triangles", "1 rectangle et 4 triangles"] },
    { q: "Le patron d'un cône est composé de :", a: "un disque et un secteur de disque", opts: ["un disque et un secteur de disque", "2 disques et un rectangle", "2 triangles et un rectangle", "un cercle seul"] },
    { q: "Le patron d'une pyramide à base triangulaire a :", a: "4 triangles", opts: ["4 triangles", "3 triangles + 1 carré", "1 triangle + 3 rectangles", "3 triangles"] }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: k.a, correct: true },
    ...k.opts.filter(o => o !== k.a).map(o => ({ html: o, correct: false }))
  ]);
  return {
    theme: 'espace', title: 'Reconnaître un patron',
    body: k.q,
    type: 'qcm', choices, correctIdx,
    solution: `Réponse : <b>${k.a}</b>.`,
    help: {
      cours: "Un patron = dépliage 2D d'un solide 3D. On y voit la base + les faces latérales.",
      savoirFaire: "Compter faces + identifier la base.",
      erreurs: ["Oublier la base.", "Confondre pyramide et prisme.", "Confondre cône et cylindre."]
    }
  };
}

function t7_perspective_cavaliere() {
  return {
    theme: 'espace', title: 'Perspective cavalière',
    body: "Dans une représentation d'un cube en perspective cavalière, combien d'arêtes sont représentées en pointillés (arêtes cachées) ?",
    type: 'qcm',
    choices: ["3", "6", "4", "12"],
    correctIdx: 0,
    solution: "Un cube a 12 arêtes. En perspective cavalière, 3 arêtes sont cachées (celles du coin arrière).",
    help: {
      cours: "Perspective cavalière : 3 arêtes cachées (pointillés), 9 visibles (traits pleins).",
      savoirFaire: "Identifier le coin arrière du solide.",
      erreurs: ["Compter toutes les arêtes.", "Confondre avec cylindre (1 arête cachée).", "Oublier que c'est 3D."]
    }
  };
}

/* --- TRANSFORMATIONS (+3) --- */

function t8_translation_image() {
  return {
    theme: 'transformations', title: 'Image par une translation',
    body: "Par la translation qui transforme A en B, l'image du point C est le point D tel que :",
    type: 'qcm',
    choices: [
      "ABDC est un parallélogramme.",
      "ABCD est un parallélogramme.",
      "C est confondu avec D.",
      "AC = BD."
    ],
    correctIdx: 0,
    solution: "La translation qui transforme A en B transforme C en D si et seulement si ABDC est un parallélogramme.",
    help: {
      cours: "Translation : tous les points se déplacent de la même manière (même distance, même direction).",
      savoirFaire: "Retenir : <b>ABDC parallélogramme</b> (attention à l'ordre).",
      erreurs: ["Écrire ABCD au lieu de ABDC.", "Confondre translation et symétrie.", "Oublier que les côtés opposés sont égaux et parallèles."]
    }
  };
}

function t8_agrandissement_aire() {
  const cases = [
    { A0: 20, k: 3, r: 180 }, { A0: 15, k: 2, r: 60 },
    { A0: 8, k: 5, r: 200 }, { A0: 25, k: 2, r: 100 }
  ];
  const c = pick(cases);
  return {
    theme: 'transformations', title: 'Agrandissement — aire',
    body: `Une figure a une aire de ${c.A0} cm². Quelle est l'aire après un agrandissement de rapport ${c.k} (en cm²) ?`,
    type: 'input', expected: String(c.r), suffix: 'cm²',
    solution: `L'aire est multipliée par \\(k^2 = ${c.k}^2 = ${c.k*c.k}\\) : \\(${c.A0} \\times ${c.k*c.k} = ${c.r}\\) cm².`,
    help: {
      cours: "Agrandissement de rapport \\(k\\) : aires × \\(k^2\\).",
      savoirFaire: "Élever le rapport au carré, puis multiplier.",
      erreurs: ["Multiplier par k au lieu de k².", "Oublier le carré.", "Confondre avec longueur (×k)."]
    }
  };
}

function t8_agrandissement_volume() {
  const cases = [
    { V0: 6, k: 2, r: 48 }, { V0: 10, k: 3, r: 270 },
    { V0: 4, k: 4, r: 256 }, { V0: 12, k: 2, r: 96 }
  ];
  const c = pick(cases);
  return {
    theme: 'transformations', title: 'Agrandissement — volume',
    body: `Un solide a un volume de ${c.V0} cm³. Quel est son volume après un agrandissement de rapport ${c.k} (en cm³) ?`,
    type: 'input', expected: String(c.r), suffix: 'cm³',
    solution: `Le volume est multiplié par \\(k^3 = ${c.k}^3 = ${c.k*c.k*c.k}\\) : \\(${c.V0} \\times ${c.k*c.k*c.k} = ${c.r}\\) cm³.`,
    help: {
      cours: "Agrandissement de rapport \\(k\\) : volumes × \\(k^3\\).",
      savoirFaire: "Élever le rapport au cube, puis multiplier.",
      erreurs: ["Multiplier par k² au lieu de k³.", "Élever le volume lui-même au cube.", "Confondre les 3 règles (×k, ×k², ×k³)."]
    }
  };
}

/* --- PROPORTIONNALITÉ / POURCENTAGES (+3) --- */

function t4_tableau_proportionnalite() {
  const cases = [
    { x1: 3, y1: 12, x2: 5, y2: 20 }, // coef 4
    { x1: 2, y1: 7, x2: 6, y2: 21 },  // coef 3.5
    { x1: 4, y1: 10, x2: 8, y2: 20 },  // coef 2.5
    { x1: 5, y1: 15, x2: 7, y2: 21 }   // coef 3
  ];
  const k = pick(cases);
  // Proportionnalité vraie
  return {
    theme: 'pourcent', title: 'Tableau de proportionnalité',
    body: `Dans un tableau où ${k.x1} correspond à ${k.y1} et ${k.x2} correspond à ${k.y2}, vérifier s'il y a proportionnalité.`,
    type: 'qcm',
    choices: ['Oui, c\'est un tableau de proportionnalité.', 'Non, ce n\'est pas un tableau de proportionnalité.'],
    correctIdx: (k.y1 / k.x1 === k.y2 / k.x2) ? 0 : 1,
    solution: `Coefficient \\(\\dfrac{${k.y1}}{${k.x1}} = ${k.y1/k.x1}\\) et \\(\\dfrac{${k.y2}}{${k.x2}} = ${k.y2/k.x2}\\). ${k.y1/k.x1 === k.y2/k.x2 ? 'Coefficients égaux → proportionnalité.' : 'Coefficients différents → pas de proportionnalité.'}`,
    help: {
      cours: "Proportionnalité : le rapport y/x est constant (= coefficient de proportionnalité).",
      savoirFaire: "Calculer y/x pour chaque couple, comparer.",
      erreurs: ["Comparer x/y au lieu de y/x.", "Comparer les différences.", "Arrondir et se tromper."]
    }
  };
}

function t4_echelle() {
  const cases = [
    { reel: 300, carte: 3, echelle: '1/10 000' },
    { reel: 5000, carte: 5, echelle: '1/100 000' },
    { reel: 1500, carte: 3, echelle: '1/50 000' }
  ];
  const k = pick(cases);
  return {
    theme: 'pourcent', title: 'Échelle d\'une carte',
    body: `Une route mesure ${k.carte} cm sur une carte à l'échelle ${k.echelle}. Quelle est sa longueur réelle (en m) ?`,
    type: 'input', expected: String(k.reel), suffix: 'm',
    solution: `Échelle ${k.echelle} : 1 cm sur la carte = ${k.echelle.split('/')[1]} cm en réalité. Longueur réelle = ${k.carte} × ${k.echelle.split('/')[1]} cm = ${parseInt(k.echelle.split('/')[1].replace(/\s/g, '')) * k.carte} cm = ${k.reel} m.`,
    help: {
      cours: "Une échelle \\(\\dfrac{1}{n}\\) signifie : 1 unité sur le plan = \\(n\\) unités en réalité.",
      savoirFaire: "Multiplier la longueur sur la carte par le dénominateur, puis convertir en m ou km.",
      erreurs: ["Diviser au lieu de multiplier.", "Oublier la conversion cm → m.", "Inverser les rôles."]
    }
  };
}

function t4_loi_ohm() {
  const cases = [
    { U: 12, I: 2, R: 6, chercher: 'R' },
    { U: 20, R: 5, I: 4, chercher: 'I' },
    { R: 10, I: 3, U: 30, chercher: 'U' }
  ];
  const k = pick(cases);
  let body, expected, solution;
  if (k.chercher === 'R') {
    body = `Loi d'Ohm : \\(U = R \\times I\\). Si \\(U = ${k.U}\\) V et \\(I = ${k.I}\\) A, quelle est la résistance R (en ohms) ?`;
    expected = String(k.R);
    solution = `\\(R = \\dfrac{U}{I} = \\dfrac{${k.U}}{${k.I}} = ${k.R}\\) Ω.`;
  } else if (k.chercher === 'I') {
    body = `Loi d'Ohm : \\(U = R \\times I\\). Si \\(U = ${k.U}\\) V et \\(R = ${k.R}\\) Ω, quelle est l'intensité I (en A) ?`;
    expected = String(k.I);
    solution = `\\(I = \\dfrac{U}{R} = \\dfrac{${k.U}}{${k.R}} = ${k.I}\\) A.`;
  } else {
    body = `Loi d'Ohm : \\(U = R \\times I\\). Si \\(R = ${k.R}\\) Ω et \\(I = ${k.I}\\) A, quelle est la tension U (en V) ?`;
    expected = String(k.U);
    solution = `\\(U = R \\times I = ${k.R} \\times ${k.I} = ${k.U}\\) V.`;
  }
  return {
    theme: 'pourcent', title: 'Loi d\'Ohm (U = R × I)',
    body, type: 'input', expected, solution,
    help: {
      cours: "<b>Loi d'Ohm</b> : \\(U = R \\times I\\). U en volts (V), R en ohms (Ω), I en ampères (A).",
      savoirFaire: "Isoler la grandeur cherchée par calcul inverse : \\(R = U/I\\), \\(I = U/R\\).",
      erreurs: ["Confondre U, R, I.", "Oublier l'unité.", "Mauvaise formule réciproque."]
    }
  };
}

/* --- MESURES (+2) --- */

function t9_conv_vitesse() {
  const cases = [
    { v: 72, from: 'km/h', vR: 20, to: 'm/s', sol: '72 ÷ 3,6 = 20' },
    { v: 54, from: 'km/h', vR: 15, to: 'm/s', sol: '54 ÷ 3,6 = 15' },
    { v: 5, from: 'm/s', vR: 18, to: 'km/h', sol: '5 × 3,6 = 18' },
    { v: 10, from: 'm/s', vR: 36, to: 'km/h', sol: '10 × 3,6 = 36' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversion vitesse km/h ↔ m/s',
    body: `Convertir ${k.v} ${k.from} en ${k.to}.`,
    type: 'input', expected: String(k.vR), suffix: k.to,
    solution: `${k.sol} ${k.to}.`,
    help: {
      cours: "<b>Règle</b> : 1 m/s = 3,6 km/h. Pour passer km/h → m/s : ÷3,6. Pour m/s → km/h : ×3,6.",
      savoirFaire: "Mémoriser le facteur 3,6. Décider du sens avec le bon sens.",
      erreurs: ["Inverser ×/÷.", "Oublier le facteur 3,6.", "Confondre unités."]
    }
  };
}

function t9_conv_debit() {
  const cases = [
    { v: 0.5, from: 'm³/s', vR: 500, to: 'L/s', sol: '0,5 m³ = 500 L ; donc 0,5 m³/s = 500 L/s' },
    { v: 2, from: 'L/s', vR: 120, to: 'L/min', sol: '2 × 60 = 120' },
    { v: 300, from: 'L/min', vR: 5, to: 'L/s', sol: '300 ÷ 60 = 5' },
    { v: 10, from: 'L/s', vR: 600, to: 'L/min', sol: '10 × 60 = 600' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversion de débits',
    body: `Convertir ${k.v} ${k.from} en ${k.to}.`,
    type: 'input', expected: [String(k.vR), String(k.vR).replace('.', ',')], suffix: k.to,
    solution: `${k.sol} ${k.to}.`,
    help: {
      cours: "<b>Équivalences</b> : 1 m³ = 1000 L ; 1 min = 60 s ; 1 h = 60 min.",
      savoirFaire: "Convertir d'abord le volume, puis le temps (ou inversement).",
      erreurs: ["Convertir dans le mauvais sens.", "Oublier une étape.", "Confondre m³ et L."]
    }
  };
}

/* --- STATISTIQUES (+2) --- */

function t10_mediane_pair() {
  const cases = [
    { serie: [12, 15, 18, 22, 25, 30], r: 20, exp: "(18 + 22) / 2 = 20" },
    { serie: [5, 7, 9, 11], r: 8, exp: "(7 + 9) / 2 = 8" },
    { serie: [10, 14, 16, 20, 22, 28], r: 18, exp: "(16 + 20) / 2 = 18" },
    { serie: [3, 5, 7, 9, 11, 13, 15, 17], r: 10, exp: "(9 + 11) / 2 = 10" }
  ];
  const k = pick(cases);
  return {
    theme: 'stats', title: 'Médiane — effectif pair',
    body: `Calculer la médiane de la série : ${k.serie.join(' ; ')}.`,
    type: 'input', expected: String(k.r),
    solution: `Effectif pair : médiane = moyenne des deux valeurs centrales. ${k.exp}.`,
    help: {
      cours: "<b>Médiane — effectif pair</b> : moyenne des 2 valeurs du milieu.",
      savoirFaire: "Ordonner, repérer les 2 valeurs centrales, calculer leur moyenne.",
      erreurs: ["Ne prendre qu'une seule valeur.", "Oublier d'ordonner.", "Erreur de division."]
    }
  };
}

function t10_diagramme_circulaire() {
  const cases = [
    { effectif: 5, total: 20, angle: 90 },  // 5/20 × 360 = 90
    { effectif: 12, total: 48, angle: 90 },
    { effectif: 3, total: 36, angle: 30 },
    { effectif: 8, total: 24, angle: 120 }
  ];
  const k = pick(cases);
  return {
    theme: 'stats', title: 'Diagramme circulaire — angle',
    body: `Dans une enquête sur ${k.total} personnes, ${k.effectif} aiment le chocolat. Quel angle (en °) doit-on tracer pour ce groupe sur un diagramme circulaire ?`,
    type: 'input', expected: String(k.angle), suffix: '°',
    solution: `Angle = \\(\\dfrac{\\text{effectif}}{\\text{total}} \\times 360° = \\dfrac{${k.effectif}}{${k.total}} \\times 360° = ${k.angle}°\\).`,
    help: {
      cours: "Dans un diagramme circulaire, l'angle est proportionnel à l'effectif. Le tour complet = 360°.",
      savoirFaire: "Angle = (effectif / total) × 360°.",
      erreurs: ["Multiplier par 100 (c'est pour un %).", "Oublier le 360°.", "Inverser effectif et total."]
    }
  };
}

/* --- PROBABILITÉS (+2) --- */

function t11_evenement_type() {
  const cases = [
    { q: "Obtenir 7 en lançant un dé à 6 faces est un événement :", a: "impossible", opts: ["impossible", "certain", "probable", "aléatoire"] },
    { q: "Tirer une boule du sac qui ne contient que des boules rouges est un événement :", a: "certain", opts: ["certain", "impossible", "probable", "aléatoire"] },
    { q: "Sur un dé à 6 faces, obtenir un nombre entre 1 et 6 est un événement :", a: "certain", opts: ["certain", "impossible", "très rare", "aléatoire"] },
    { q: "Obtenir Face en lançant une pièce équilibrée est un événement :", a: "équiprobable (avec Pile)", opts: ["équiprobable (avec Pile)", "impossible", "certain", "rare"] }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: k.a, correct: true },
    ...k.opts.filter(o => o !== k.a).map(o => ({ html: o, correct: false }))
  ]);
  return {
    theme: 'probas', title: 'Type d\'événement',
    body: k.q,
    type: 'qcm', choices, correctIdx,
    solution: `Réponse : <b>${k.a}</b>.`,
    help: {
      cours: "<b>Événement certain</b> : probabilité 1. <b>Impossible</b> : probabilité 0. <b>Équiprobable</b> : même chance.",
      savoirFaire: "Tester si l'événement peut / ne peut pas / doit se produire.",
      erreurs: ["Confondre impossible et peu probable.", "Confondre certain et probable.", "Ignorer le contexte."]
    }
  };
}

function t11_proba_diverses_formes() {
  const cases = [
    { forme: '0,25', equiv: '1/4', equivPct: '25%' },
    { forme: '0,8', equiv: '4/5', equivPct: '80%' },
    { forme: '0,5', equiv: '1/2', equivPct: '50%' },
    { forme: '3/4', equiv: '0,75', equivPct: '75%' }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.equiv}\\)`, correct: true },
    { html: `\\(${k.equivPct}\\)`, correct: false },
    { html: `\\(${k.forme}\\)`, correct: false },
    { html: `${(parseFloat(k.forme) * 2 || 0.1).toString().replace('.', ',')}`, correct: false }
  ]);
  return {
    theme: 'probas', title: 'Exprimer une probabilité sous différentes formes',
    body: `La probabilité d'un événement est \\(${k.forme}\\). Quelle autre forme lui correspond ?`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(${k.forme} = ${k.equiv} = ${k.equivPct}\\).`,
    help: {
      cours: "Une probabilité s'exprime sous 3 formes équivalentes : décimale, fraction, pourcentage.",
      savoirFaire: "Savoir passer de l'une à l'autre : fraction ÷ pour décimale, × 100 pour %.",
      erreurs: ["Oublier la division.", "Confondre forme décimale et %.", "Erreur de conversion."]
    }
  };
}

/* --- ARITHMÉTIQUE (+1) --- */

function t2_liste_premiers() {
  const cases = [
    { min: 10, max: 20, r: "11 ; 13 ; 17 ; 19" },
    { min: 20, max: 30, r: "23 ; 29" },
    { min: 50, max: 60, r: "53 ; 59" },
    { min: 70, max: 80, r: "71 ; 73 ; 79" },
    { min: 90, max: 100, r: "97" }
  ];
  const k = pick(cases);
  const { choices, correctIdx } = makeQCM([
    { html: k.r, correct: true },
    ...cases.filter(c => c.r !== k.r).slice(0, 3).map(c => ({ html: c.r, correct: false }))
  ]);
  return {
    theme: 'arithmetique', title: 'Liste des premiers entre deux nombres',
    body: `Quels sont les nombres premiers compris entre ${k.min} et ${k.max} ?`,
    type: 'qcm', choices, correctIdx,
    solution: `Les premiers entre ${k.min} et ${k.max} sont : <b>${k.r}</b>.`,
    help: {
      cours: "Premiers < 100 : 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.",
      savoirFaire: "Tester la divisibilité par 2, 3, 5, 7.",
      erreurs: ["Oublier 2 (seul premier pair).", "Inclure 1.", "Oublier certains."]
    }
  };
}

/* --- ALGO SCRATCH (+1) --- */

function t12_interaction_lutins() {
  const prog = scratchProgram([
    { type: 'event', text: 'quand drapeau cliqué' },
    { type: 'control', text: 'répéter indéfiniment', inner: [
      { type: 'control', text: 'si {op:touche le lutin Cible ?} alors', inner: [
        { type: 'looks', text: 'dire {t:Touché !}' }
      ]}
    ]}
  ]);
  return {
    theme: 'algo', title: 'Interaction entre 2 lutins',
    body: `Pour qu'un lutin dise « Touché ! » quand il en touche un autre, quel type de bloc utilise-t-on ?${prog}`,
    type: 'qcm',
    choices: [
      "Une instruction conditionnelle avec le capteur « touche le lutin X ».",
      "Une simple boucle « répéter 10 fois ».",
      "Un bloc « attendre 1 seconde ».",
      "Un bloc « ajouter 1 à compteur »."
    ],
    correctIdx: 0,
    solution: "On utilise une <b>instruction conditionnelle</b> (si…alors) avec le <b>capteur</b> « touche le lutin X », placée dans une boucle « répéter indéfiniment ».",
    help: {
      cours: "Pour gérer l'interaction : condition « si touche X » + action (dire, bouger…) dans une boucle infinie.",
      savoirFaire: "Placer la condition dans une boucle « répéter indéfiniment ».",
      erreurs: ["Oublier de tester en continu.", "Mauvais capteur.", "Confondre touche et clic."]
    }
  };
}


/* ==========================================================================
   ENRICHISSEMENT 4ème — +30 générateurs (audit EMCP2, 2026-04-21)
   Toutes questions : mental ou posé rapide, sans calculatrice.
   ========================================================================== */

/* --- Arithmétique (+4) --- */
function t2_div_par_11() {
  const cases = [
    { n: 143, ok: true, expl: "Critère : somme alternée des chiffres. 1-4+3 = 0, divisible par 11 → 143 = 11×13." },
    { n: 253, ok: true, expl: "2-5+3 = 0, divisible par 11 → 253 = 11×23." },
    { n: 124, ok: false, expl: "1-2+4 = 3, non divisible par 11." },
    { n: 308, ok: true, expl: "3-0+8 = 11, divisible par 11 → 308 = 11×28." },
    { n: 529, ok: false, expl: "5-2+9 = 12, non divisible par 11." },
    { n: 572, ok: true, expl: "5-7+2 = 0, divisible par 11 → 572 = 11×52." }
  ];
  const k = pick(cases);
  return {
    theme: 'arithmetique', title: 'Divisibilité par 11',
    body: `Le nombre <b>${k.n}</b> est-il divisible par 11 ?`,
    type: 'qcm',
    choices: ['Oui', 'Non'],
    correctIdx: k.ok ? 0 : 1,
    solution: k.expl,
    help: {
      cours: "<b>Critère par 11</b> : un nombre est divisible par 11 si la somme alternée de ses chiffres (de droite à gauche ou gauche à droite) est multiple de 11 (souvent 0).",
      savoirFaire: "Alterner + et − en commençant par le chiffre de gauche.",
      erreurs: ["Oublier le signe alterné.", "Prendre le critère par 3 (somme simple).", "Compter les chiffres à l'envers."]
    }
  };
}

function t2_premier_sous_100() {
  const cases = [
    { n: 51, ok: false, expl: "51 = 3 × 17." },
    { n: 57, ok: false, expl: "57 = 3 × 19." },
    { n: 67, ok: true, expl: "67 n'est divisible par 2, 3, 5, 7 : c'est un nombre premier." },
    { n: 73, ok: true, expl: "73 est un nombre premier." },
    { n: 87, ok: false, expl: "87 = 3 × 29." },
    { n: 91, ok: false, expl: "91 = 7 × 13 (piège classique)." },
    { n: 97, ok: true, expl: "97 est premier (le plus grand < 100)." }
  ];
  const k = pick(cases);
  return {
    theme: 'arithmetique', title: 'Nombre premier < 100 ?',
    body: `<b>${k.n}</b> est-il un nombre premier ?`,
    type: 'qcm',
    choices: ['Oui', 'Non'],
    correctIdx: k.ok ? 0 : 1,
    solution: k.expl,
    help: {
      cours: "Un nombre premier n'a que 1 et lui-même comme diviseurs. Tester par 2, 3, 5, 7 suffit jusqu'à 100 (car √100 = 10).",
      savoirFaire: "Tester divisibilité par 2 (pair ?), 3 (somme chiffres ÷3 ?), 5 (termine par 0/5 ?), 7 (division posée rapide).",
      erreurs: ["Oublier 91 = 7×13.", "Penser que tous les impairs sont premiers.", "Oublier de tester 7."]
    }
  };
}

function t2_decomposition_eclair() {
  const cases = [
    { n: 60, dec: '2² × 3 × 5' },
    { n: 72, dec: '2³ × 3²' },
    { n: 84, dec: '2² × 3 × 7' },
    { n: 90, dec: '2 × 3² × 5' },
    { n: 100, dec: '2² × 5²' },
    { n: 36, dec: '2² × 3²' }
  ];
  const k = pick(cases);
  const pool = ['2² × 3 × 5', '2³ × 3²', '2² × 3 × 7', '2 × 3² × 5', '2² × 5²', '2² × 3²'];
  const distract = shuffle(pool.filter(x => x !== k.dec)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: k.dec, correct: true },
    ...distract.map(d => ({ html: d, correct: false }))
  ]);
  return {
    theme: 'arithmetique', title: 'Décomposition éclair en facteurs premiers',
    body: `Décomposer ${k.n} en produit de facteurs premiers :`,
    type: 'qcm', choices, correctIdx,
    solution: `${k.n} = ${k.dec}.`,
    help: {
      cours: "On divise par 2 tant que possible, puis 3, 5, 7...",
      savoirFaire: "Retenir quelques décompositions usuelles : 60 = 2²×3×5, 72 = 2³×3², 100 = 2²×5².",
      erreurs: ["Oublier un facteur.", "Confondre exposants.", "Diviser trop vite sans tester."]
    }
  };
}

function t2_fraction_de_fraction() {
  const cases = [
    { q: "La moitié du tiers", r: '1/6' },
    { q: "Le tiers de la moitié", r: '1/6' },
    { q: "Le quart du tiers", r: '1/12' },
    { q: "Les deux tiers de la moitié", r: '1/3' },
    { q: "La moitié des trois quarts", r: '3/8' }
  ];
  const k = pick(cases);
  const pool = ['1/6','1/12','1/3','3/8','1/4','2/3','1/2'];
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const toLx = f => { const [n,d]=f.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLx(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'arithmetique', title: 'Fraction d\'une fraction',
    body: `<b>${k.q}</b> correspond à quelle fraction ?`,
    type: 'qcm', choices, correctIdx,
    solution: `Une fraction « d'une » fraction se traduit par un produit.`,
    help: {
      cours: "Le mot « de » entre deux fractions correspond à la multiplication : ½ de ⅓ = ½ × ⅓ = ⅙.",
      savoirFaire: "Écrire en produit, puis simplifier.",
      erreurs: ["Additionner au lieu de multiplier.", "Confondre demi et quart.", "Oublier de simplifier."]
    }
  };
}

/* --- Pourcentages (+3) --- */
function t4_moitie_quart_tiers() {
  const cases = [
    { n: 60, ask: 'la moitié', r: 30 },
    { n: 80, ask: 'le quart', r: 20 },
    { n: 90, ask: 'le tiers', r: 30 },
    { n: 120, ask: 'le quart', r: 30 },
    { n: 48, ask: 'le tiers', r: 16 },
    { n: 150, ask: 'la moitié', r: 75 }
  ];
  const k = pick(cases);
  return {
    theme: 'pourcent', title: 'Calcul mental — moitié, tiers, quart',
    body: `Quelle est <b>${k.ask}</b> de ${k.n} ?`,
    type: 'input', expected: String(k.r),
    solution: `${k.ask.charAt(0).toUpperCase()+k.ask.slice(1)} de ${k.n} = ${k.r}.`,
    help: {
      cours: "Moitié = ÷2 = 50 %. Tiers = ÷3 ≈ 33,3 %. Quart = ÷4 = 25 %.",
      savoirFaire: "Reconnaître les divisions simples. Astuce : moitié du tiers = sixième.",
      erreurs: ["Confondre quart et tiers.", "Multiplier au lieu de diviser.", "Erreur de table."]
    }
  };
}

function t4_pourcent_inverse() {
  const cases = [
    { q: "30 % d'un nombre valent 60. Quel est ce nombre ?", r: 200 },
    { q: "25 % d'un nombre valent 50. Quel est ce nombre ?", r: 200 },
    { q: "10 % d'un nombre valent 15. Quel est ce nombre ?", r: 150 },
    { q: "20 % d'un nombre valent 80. Quel est ce nombre ?", r: 400 },
    { q: "50 % d'un nombre valent 24. Quel est ce nombre ?", r: 48 }
  ];
  const k = pick(cases);
  return {
    theme: 'pourcent', title: 'Pourcentage inverse',
    body: k.q,
    type: 'input', expected: String(k.r),
    solution: `Si \\(p\\,\\%\\) vaut V, alors le total est \\(\\dfrac{V \\times 100}{p}\\). Ici : ${k.r}.`,
    help: {
      cours: "Question inverse d'un pourcentage : chercher le total à partir d'une partie. Règle de 3 ou produit en croix.",
      savoirFaire: "Si 30 % = 60, alors 10 % = 20, donc 100 % = 200.",
      erreurs: ["Calculer 30 % de 60 (erreur fréquente !).", "Confondre total et partie.", "Oublier de multiplier par 100/p."]
    }
  };
}

function t4_camembert_pct() {
  const cases = [
    { desc: "Un diagramme circulaire pour 200 élèves : un secteur occupe un quart du disque.", r: 50, unit: 'élèves' },
    { desc: "Sur 60 personnes, un secteur représente la moitié.", r: 30, unit: 'personnes' },
    { desc: "Sur 100 % d'un budget, 20 % est consacré à l'alimentation. Pour 800 €, cela fait :", r: 160, unit: '€' },
    { desc: "Sur 40 animaux, un secteur représente les ¾.", r: 30, unit: 'animaux' }
  ];
  const k = pick(cases);
  return {
    theme: 'pourcent', title: 'Lecture d\'un diagramme circulaire',
    body: `${k.desc} Combien cela représente-t-il (en ${k.unit}) ?`,
    type: 'input', expected: String(k.r), suffix: k.unit,
    solution: `Fraction ou pourcentage appliqué à l'effectif total.`,
    help: {
      cours: "Un diagramme circulaire représente des proportions. Un quart = 25 %, une moitié = 50 %, les ¾ = 75 %.",
      savoirFaire: "Identifier la fraction du disque, puis multiplier par le total.",
      erreurs: ["Confondre quart et tiers.", "Prendre le pourcentage au lieu de la valeur.", "Additionner au lieu de multiplier."]
    }
  };
}

/* --- Géométrie (+4) --- */
function t5_nature_triangle() {
  const cases = [
    { desc: "un triangle avec 3 côtés égaux", r: 'équilatéral' },
    { desc: "un triangle avec 2 côtés égaux (et pas le troisième)", r: 'isocèle' },
    { desc: "un triangle avec un angle droit", r: 'rectangle' },
    { desc: "un triangle avec tous les angles différents et aucun droit", r: 'quelconque' },
    { desc: "un triangle avec 3 angles de 60°", r: 'équilatéral' }
  ];
  const k = pick(cases);
  const opts = ['équilatéral', 'isocèle', 'rectangle', 'quelconque'];
  const { choices, correctIdx } = makeQCM(opts.map(o => ({ html: o.charAt(0).toUpperCase()+o.slice(1), correct: o === k.r })));
  return {
    theme: 'geometrie', title: 'Reconnaître la nature d\'un triangle',
    body: `Un triangle est dit <b>${k.desc}</b>. Sa nature est :`,
    type: 'qcm', choices, correctIdx,
    solution: `Réponse : <b>${k.r}</b>.`,
    help: {
      cours: "Équilatéral = 3 côtés égaux (et 3 angles de 60°). Isocèle = 2 côtés égaux. Rectangle = 1 angle droit. Quelconque = aucune propriété particulière.",
      savoirFaire: "Identifier le nombre de côtés/angles égaux, ou la présence d'un angle droit.",
      erreurs: ["Confondre équilatéral et isocèle.", "Oublier rectangle isocèle.", "Se fier aux apparences."]
    }
  };
}

function t5_angles_triangle() {
  const cases = [
    { a: 60, b: 70, r: 50 },
    { a: 90, b: 30, r: 60 },
    { a: 45, b: 45, r: 90 },
    { a: 100, b: 40, r: 40 },
    { a: 80, b: 65, r: 35 }
  ];
  const k = pick(cases);
  return {
    theme: 'geometrie', title: 'Troisième angle d\'un triangle',
    body: `Un triangle a deux angles de <b>${k.a}°</b> et <b>${k.b}°</b>. Quelle est la mesure du 3<sup>ème</sup> angle ?`,
    type: 'input', expected: String(k.r), suffix: '°',
    solution: `La somme des angles d'un triangle vaut 180°. Le 3<sup>ème</sup> angle = 180 − ${k.a} − ${k.b} = ${k.r}°.`,
    help: {
      cours: "Somme des angles d'un triangle = 180°.",
      savoirFaire: "Faire 180 − somme des deux angles connus.",
      erreurs: ["Utiliser 360° (ce serait un quadrilatère).", "Faire la moyenne.", "Additionner sans soustraire."]
    }
  };
}

function t5_pythagore_codee() {
  return {
    theme: 'geometrie', title: 'Pythagore express',
    body: "Un triangle ABC est rectangle en B. AB = 3 cm et BC = 4 cm. Quelle est la longueur de AC ?",
    type: 'input', expected: '5', suffix: 'cm',
    solution: "D'après Pythagore : AC² = AB² + BC² = 9 + 16 = 25, donc AC = 5 cm.",
    help: {
      cours: "Dans un triangle rectangle : (hypoténuse)² = (côté 1)² + (côté 2)².",
      savoirFaire: "Identifier l'hypoténuse (face à l'angle droit) puis appliquer la formule.",
      erreurs: ["Oublier le carré.", "Prendre un mauvais côté pour hypoténuse.", "Oublier √ à la fin."]
    }
  };
}

function t5_aire_composee() {
  const cases = [
    { desc: "Un rectangle de 6×4 dont on enlève un carré de 2×2.", r: 20 },
    { desc: "Un rectangle 8×5 auquel on ajoute un carré 3×3.", r: 49 },
    { desc: "Un carré 5×5 dont on enlève un carré 2×2.", r: 21 }
  ];
  const k = pick(cases);
  return {
    theme: 'geometrie', title: 'Aire d\'une figure composée',
    body: `${k.desc} Quelle est son aire (en unités²) ?`,
    type: 'input', expected: String(k.r),
    solution: `On additionne ou soustrait les aires selon qu'on ajoute ou enlève des morceaux.`,
    help: {
      cours: "Aire d'une figure composée = somme (ou différence) des aires de ses parties.",
      savoirFaire: "Décomposer en rectangles/carrés/triangles, calculer chaque aire, puis combiner.",
      erreurs: ["Oublier un morceau.", "Confondre aire et périmètre.", "Additionner au lieu de soustraire."]
    }
  };
}

/* --- Transformations (+3) --- */
function t6_sym_axiale_vs_centrale() {
  const cases = [
    { desc: "Une figure obtenue par pliage selon une droite", r: 'axiale' },
    { desc: "Une figure obtenue par demi-tour (180°) autour d'un point", r: 'centrale' },
    { desc: "La symétrie qui conserve l'orientation du plan", r: 'centrale' },
    { desc: "La symétrie qui change l'orientation du plan (image « en miroir »)", r: 'axiale' }
  ];
  const k = pick(cases);
  const opts = ['axiale', 'centrale'];
  const { choices, correctIdx } = makeQCM(opts.map(o => ({ html: 'Symétrie ' + o, correct: o === k.r })));
  return {
    theme: 'transformations', title: 'Symétrie axiale vs centrale',
    body: `${k.desc}. De quelle symétrie s'agit-il ?`,
    type: 'qcm', choices, correctIdx,
    solution: `Réponse : symétrie <b>${k.r}</b>.`,
    help: {
      cours: "<b>Symétrie axiale</b> : par rapport à une droite (pliage). <b>Symétrie centrale</b> : par rapport à un point (demi-tour).",
      savoirFaire: "Axiale = miroir, orientation inversée. Centrale = demi-tour, orientation conservée.",
      erreurs: ["Confondre axiale et centrale.", "Oublier qu'axiale inverse.", "Penser que centrale = rotation de 90°."]
    }
  };
}

function t6_image_translation() {
  const cases = [
    { pt: 'A(1 ; 3)', vect: '\\vec{u}(2 ; -1)', r: 'A\'(3 ; 2)' },
    { pt: 'A(0 ; 0)', vect: '\\vec{u}(5 ; 4)', r: 'A\'(5 ; 4)' },
    { pt: 'A(-2 ; 3)', vect: '\\vec{u}(4 ; -3)', r: 'A\'(2 ; 0)' },
    { pt: 'A(3 ; -1)', vect: '\\vec{u}(-2 ; 4)', r: 'A\'(1 ; 3)' }
  ];
  const k = pick(cases);
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${k.r}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${d}\\)`, correct: false }))
  ]);
  return {
    theme: 'transformations', title: 'Image par une translation',
    body: `Quelle est l'image du point \\(${k.pt}\\) par la translation de vecteur \\(${k.vect}\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `On ajoute les coordonnées du vecteur à celles du point.`,
    help: {
      cours: "Par la translation de vecteur \\(\\vec{u}(a ; b)\\), le point \\(M(x;y)\\) a pour image \\(M'(x+a ; y+b)\\).",
      savoirFaire: "Additionner les coordonnées du vecteur à celles du point, coordonnée par coordonnée.",
      erreurs: ["Soustraire au lieu d'additionner.", "Mélanger abscisse et ordonnée.", "Se tromper de signe."]
    }
  };
}

function t6_rotation_simple() {
  const cases = [
    { desc: "Une rotation d'angle 180° autour d'un point est équivalente à :", r: 'Une symétrie centrale' },
    { desc: "Une rotation d'angle 90° tourne une figure d'un :", r: 'Quart de tour' },
    { desc: "Une rotation d'angle 360° donne :", r: 'La même figure' },
    { desc: "Une rotation d'angle 45° tourne une figure d'un :", r: 'Huitième de tour' }
  ];
  const k = pick(cases);
  const opts = ['Une symétrie centrale', 'Quart de tour', 'La même figure', 'Huitième de tour'];
  const { choices, correctIdx } = makeQCM(opts.map(o => ({ html: o, correct: o === k.r })));
  return {
    theme: 'transformations', title: 'Rotations remarquables',
    body: k.desc,
    type: 'qcm', choices, correctIdx,
    solution: `Réponse : <b>${k.r}</b>.`,
    help: {
      cours: "Rotation 360° = identité, 180° = symétrie centrale, 90° = quart de tour.",
      savoirFaire: "Retenir les angles clés : 90°, 180°, 270°, 360°.",
      erreurs: ["Confondre 90° et 180°.", "Oublier que 180° = centrale.", "Inverser les sens."]
    }
  };
}

/* --- Espace (+3) --- */
function t7_patron_solide() {
  const cases = [
    { desc: "6 carrés identiques assemblés en croix ou T", r: 'un cube' },
    { desc: "2 rectangles (bases) et 4 rectangles (faces latérales)", r: 'un pavé droit' },
    { desc: "2 disques et un rectangle (face latérale)", r: 'un cylindre' },
    { desc: "Un disque et un secteur de disque", r: 'un cône' }
  ];
  const k = pick(cases);
  const opts = ['un cube', 'un pavé droit', 'un cylindre', 'un cône'];
  const { choices, correctIdx } = makeQCM(opts.map(o => ({ html: o.charAt(0).toUpperCase()+o.slice(1), correct: o === k.r })));
  return {
    theme: 'espace', title: 'Reconnaître un patron',
    body: `Un patron composé de ${k.desc} est celui de :`,
    type: 'qcm', choices, correctIdx,
    solution: `C'est le patron de <b>${k.r}</b>.`,
    help: {
      cours: "Cube : 6 carrés. Pavé : 6 rectangles (dont 3 paires). Cylindre : 2 disques + 1 rectangle. Cône : 1 disque + 1 secteur.",
      savoirFaire: "Compter les faces et leur nature (carré, rectangle, disque…).",
      erreurs: ["Confondre cube et pavé.", "Cylindre sans le rectangle latéral.", "Cône avec rectangle au lieu de secteur."]
    }
  };
}

function t7_volume_cube() {
  const cases = [
    { c: 5, r: 125 },
    { c: 2, r: 8 },
    { c: 10, r: 1000 },
    { c: 3, r: 27 },
    { c: 4, r: 64 }
  ];
  const k = pick(cases);
  return {
    theme: 'espace', title: 'Volume d\'un cube',
    body: `Un cube a pour arête ${k.c} cm. Quel est son volume (en cm³) ?`,
    type: 'input', expected: String(k.r), suffix: 'cm³',
    solution: `V = c³ = ${k.c}³ = ${k.r} cm³.`,
    help: {
      cours: "Volume d'un cube = c³ où c est l'arête.",
      savoirFaire: "Multiplier 3 fois la même mesure : c × c × c.",
      erreurs: ["Multiplier par 3 (c×3).", "Donner l'aire (c²).", "Oublier une dimension."]
    }
  };
}

function t7_nature_solide() {
  const cases = [
    { desc: "6 faces carrées", r: 'cube' },
    { desc: "2 bases circulaires parallèles", r: 'cylindre' },
    { desc: "1 base et un sommet pointu", r: 'pyramide ou cône' },
    { desc: "Toutes ses faces sont des rectangles", r: 'pavé droit' }
  ];
  const k = pick(cases);
  const opts = ['cube', 'cylindre', 'pyramide ou cône', 'pavé droit'];
  const { choices, correctIdx } = makeQCM(opts.map(o => ({ html: o.charAt(0).toUpperCase()+o.slice(1), correct: o === k.r })));
  return {
    theme: 'espace', title: 'Reconnaître un solide',
    body: `Un solide a ${k.desc}. Il s'agit d'un/une :`,
    type: 'qcm', choices, correctIdx,
    solution: `Réponse : <b>${k.r}</b>.`,
    help: {
      cours: "Cube : 6 carrés. Pavé droit : 6 rectangles. Cylindre : 2 disques + face latérale. Pyramide/cône : base + sommet.",
      savoirFaire: "Compter les faces et identifier leur nature.",
      erreurs: ["Cube vs pavé droit.", "Cylindre vs cône.", "Oublier le sommet pointu."]
    }
  };
}

/* --- Mesures (+4) --- */
function t9_conv_cm_m() {
  const cases = [
    { from: '250 cm', to: 'm', r: '2,5' },
    { from: '3,4 m', to: 'cm', r: '340' },
    { from: '1500 m', to: 'km', r: '1,5' },
    { from: '0,6 km', to: 'm', r: '600' },
    { from: '450 mm', to: 'cm', r: '45' },
    { from: '8 cm', to: 'mm', r: '80' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversion de longueurs',
    body: `Convertir <b>${k.from}</b> en ${k.to}.`,
    type: 'input', expected: [k.r, k.r.replace(',', '.')], suffix: k.to,
    solution: `Tableau de conversion : km ↔ hm ↔ dam ↔ m ↔ dm ↔ cm ↔ mm (×10 à chaque cran).`,
    help: {
      cours: "1 km = 1000 m. 1 m = 100 cm. 1 cm = 10 mm. 1 m = 1000 mm.",
      savoirFaire: "Décaler la virgule ou multiplier/diviser par 10, 100, 1000.",
      erreurs: ["Se tromper de sens.", "Oublier un cran.", "Mal placer la virgule."]
    }
  };
}

function t9_unites_aire() {
  const cases = [
    { from: '5 m²', to: 'cm²', r: '50000' },
    { from: '3000 cm²', to: 'm²', r: '0,3' },
    { from: '2 km²', to: 'm²', r: '2000000' },
    { from: '1 m²', to: 'dm²', r: '100' },
    { from: '500 dm²', to: 'm²', r: '5' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversions d\'aire (×100)',
    body: `Convertir <b>${k.from}</b> en ${k.to}.`,
    type: 'input', expected: [k.r, k.r.replace(',', '.'), k.r.replace(' ', '')], suffix: k.to,
    solution: `Pour les aires, chaque cran du tableau vaut <b>×100</b> (ou ÷100).`,
    help: {
      cours: "1 m² = 100 dm² = 10 000 cm². 1 km² = 1 000 000 m². Facteur 100 entre chaque cran (et non 10).",
      savoirFaire: "Penser au carré : 1 m = 10 dm donc 1 m² = 10² dm² = 100 dm².",
      erreurs: ["Confondre avec longueurs (×10).", "Oublier le carré.", "Mal compter les zéros."]
    }
  };
}

function t9_unites_volume() {
  const cases = [
    { from: '3 m³', to: 'dm³', r: '3000' },
    { from: '1 L', to: 'mL', r: '1000' },
    { from: '2 m³', to: 'L', r: '2000' },
    { from: '500 mL', to: 'L', r: '0,5' },
    { from: '1 dm³', to: 'cm³', r: '1000' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversions de volume / capacité',
    body: `Convertir <b>${k.from}</b> en ${k.to}.`,
    type: 'input', expected: [k.r, k.r.replace(',', '.')], suffix: k.to,
    solution: `Pour les volumes, chaque cran vaut <b>×1000</b>. Aussi : 1 dm³ = 1 L.`,
    help: {
      cours: "1 m³ = 1000 dm³ = 1 000 000 cm³. Clef : 1 dm³ = 1 L. 1 L = 1000 mL.",
      savoirFaire: "Volumes : facteur 1000 entre crans. Capacités : L = dm³.",
      erreurs: ["Utiliser 100 au lieu de 1000.", "Confondre capacité et volume.", "Compter les zéros à l'envers."]
    }
  };
}

function t9_conv_duree() {
  const cases = [
    { from: '90 min', to: 'h', r: '1,5' },
    { from: '2,5 h', to: 'min', r: '150' },
    { from: '180 s', to: 'min', r: '3' },
    { from: '1 h 15 min', to: 'min', r: '75' },
    { from: '0,25 h', to: 'min', r: '15' }
  ];
  const k = pick(cases);
  return {
    theme: 'mesures', title: 'Conversion de durées',
    body: `Convertir <b>${k.from}</b> en ${k.to}.`,
    type: 'input', expected: [k.r, k.r.replace(',', '.')], suffix: k.to,
    solution: `1 h = 60 min = 3600 s. Pour h en décimal : quart d'heure = 0,25 h.`,
    help: {
      cours: "Temps : 1 h = 60 min ; 1 min = 60 s.",
      savoirFaire: "Retenir quart d'heure = 15 min = 0,25 h. Demi-heure = 0,5 h = 30 min.",
      erreurs: ["Utiliser 100 au lieu de 60.", "Confondre décimal et min:s.", "Oublier heures+minutes."]
    }
  };
}

/* --- Stats (+3) --- */
function t10_lire_batons() {
  return {
    theme: 'stats', title: 'Lire un diagramme en bâtons',
    body: "Dans un diagramme en bâtons, la hauteur de chaque bâton représente :",
    type: 'qcm',
    choices: ["L'effectif (ou la fréquence) d'une valeur", "La valeur elle-même", "La médiane", "L'étendue"],
    correctIdx: 0,
    solution: "La <b>hauteur d'un bâton</b> donne l'effectif ou la fréquence de la valeur correspondante (en abscisse).",
    help: {
      cours: "En abscisse : les valeurs. En ordonnée : l'effectif ou la fréquence.",
      savoirFaire: "Lire directement la hauteur sur l'axe vertical.",
      erreurs: ["Lire l'abscisse.", "Confondre effectif et moyenne.", "Se fier à la largeur."]
    }
  };
}

function t10_mediane_impair() {
  const cases = [
    { s: '[3, 7, 8, 12, 15]', r: '8' },
    { s: '[1, 4, 6, 9, 11, 14, 20]', r: '9' },
    { s: '[2, 5, 10]', r: '5' },
    { s: '[6, 6, 8, 11, 15]', r: '8' }
  ];
  const k = pick(cases);
  return {
    theme: 'stats', title: 'Médiane d\'une série (impaire)',
    body: `Quelle est la médiane de la série suivante ? ${k.s}`,
    type: 'input', expected: k.r,
    solution: `La médiane est la valeur du <b>milieu</b> (série ordonnée, effectif impair).`,
    help: {
      cours: "Médiane d'une série de n valeurs ordonnées : si n impair, c'est la valeur de rang (n+1)/2.",
      savoirFaire: "Vérifier que la série est triée, compter les valeurs, prendre celle du milieu.",
      erreurs: ["Moyenne au lieu de médiane.", "Oublier d'ordonner.", "Compter mal le rang."]
    }
  };
}

function t10_etendue_rapide() {
  const cases = [
    { s: '[4, 7, 12, 3, 9]', r: 9 },
    { s: '[15, 22, 18, 10, 25]', r: 15 },
    { s: '[1, 100, 50, 75, 25]', r: 99 },
    { s: '[20, 20, 20, 20]', r: 0 }
  ];
  const k = pick(cases);
  return {
    theme: 'stats', title: 'Étendue d\'une série',
    body: `Quelle est l'étendue de la série ${k.s} ?`,
    type: 'input', expected: String(k.r),
    solution: `Étendue = max − min = ${k.r}.`,
    help: {
      cours: "<b>Étendue</b> = plus grande valeur − plus petite valeur.",
      savoirFaire: "Identifier max et min, soustraire.",
      erreurs: ["Additionner max+min.", "Oublier de trier mentalement.", "Compter le nombre de valeurs."]
    }
  };
}

/* --- Probas (+3) --- */
function t11_vocabulaire() {
  const cases = [
    { desc: "Un événement qui se produit toujours", r: 'certain' },
    { desc: "Un événement qui ne peut jamais se produire", r: 'impossible' },
    { desc: "Un événement avec la même chance qu'un autre", r: 'équiprobable' }
  ];
  const k = pick(cases);
  const opts = ['certain', 'impossible', 'équiprobable', 'aléatoire'];
  const { choices, correctIdx } = makeQCM(opts.map(o => ({ html: o.charAt(0).toUpperCase()+o.slice(1), correct: o === k.r })));
  return {
    theme: 'probas', title: 'Vocabulaire des probabilités',
    body: `Comment qualifie-t-on : « <i>${k.desc}</i> » ?`,
    type: 'qcm', choices, correctIdx,
    solution: `Réponse : événement <b>${k.r}</b>.`,
    help: {
      cours: "Certain : P = 1. Impossible : P = 0. Équiprobable : même probabilité.",
      savoirFaire: "Lier l'adjectif à la probabilité.",
      erreurs: ["Confondre certain et probable.", "Confondre équiprobable et probable.", "Oublier P ∈ [0;1]."]
    }
  };
}

function t11_proba_contraire() {
  const cases = [
    { p: '1/4', r: '3/4' },
    { p: '0,3', r: '0,7' },
    { p: '2/5', r: '3/5' },
    { p: '0,1', r: '0,9' },
    { p: '1/2', r: '1/2' }
  ];
  const k = pick(cases);
  const toLx = s => s.includes('/') ? (()=>{const [n,d]=s.split('/'); return `\\dfrac{${n}}{${d}}`;})() : s;
  const pool = cases.map(c => c.r);
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLx(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'probas', title: 'Probabilité d\'un événement contraire',
    body: `Si \\(P(A) = ${toLx(k.p)}\\), que vaut \\(P(\\overline{A})\\) ?`,
    type: 'qcm', choices, correctIdx,
    solution: `\\(P(\\overline{A}) = 1 - P(A) = ${toLx(k.r)}\\).`,
    help: {
      cours: "<b>Événement contraire</b> \\(\\overline{A}\\) : \\(P(\\overline{A}) = 1 - P(A)\\).",
      savoirFaire: "Toujours soustraire à 1.",
      erreurs: ["Donner P(A) au lieu de 1−P(A).", "Diviser par 2.", "Oublier de simplifier la fraction."]
    }
  };
}

function t11_proba_de() {
  const cases = [
    { q: "Obtenir un 6 sur un dé à 6 faces", r: '1/6' },
    { q: "Obtenir un nombre pair sur un dé à 6 faces", r: '1/2' },
    { q: "Obtenir un nombre > 4 sur un dé à 6 faces", r: '1/3' },
    { q: "Obtenir un nombre premier sur un dé à 6 faces (2, 3, 5)", r: '1/2' },
    { q: "Obtenir un multiple de 3 sur un dé à 6 faces", r: '1/3' }
  ];
  const k = pick(cases);
  const pool = ['1/6','1/2','1/3','2/3','5/6','1/4'];
  const toLx = s => { const [n,d]=s.split('/'); return `\\dfrac{${n}}{${d}}`; };
  const distract = shuffle(pool.filter(x => x !== k.r)).slice(0, 3);
  const { choices, correctIdx } = makeQCM([
    { html: `\\(${toLx(k.r)}\\)`, correct: true },
    ...distract.map(d => ({ html: `\\(${toLx(d)}\\)`, correct: false }))
  ]);
  return {
    theme: 'probas', title: 'Probabilité sur un dé',
    body: k.q + '. Probabilité ?',
    type: 'qcm', choices, correctIdx,
    solution: `Compter les cas favorables / 6 faces totales.`,
    help: {
      cours: "Dé à 6 faces équilibré : chaque face a une proba de 1/6. Pour un événement : (nb issues favorables) / 6.",
      savoirFaire: "Lister les valeurs qui conviennent, diviser par 6, simplifier.",
      erreurs: ["Oublier de simplifier.", "Mauvaise énumération.", "Oublier 1 (qui n'est pas premier)."]
    }
  };
}

/* --- Algo (+3) --- */
function t12_boucle_pour() {
  return {
    theme: 'algo', title: 'Trace d\'une boucle Pour',
    body: `Après l'exécution du script Scratch suivant, quelle est la valeur de <b>x</b> ?<br><pre style="background:var(--bg-elev);padding:8px;border-radius:6px;font-size:0.88rem;">x ← 0\nRépéter 5 fois :\n    x ← x + 2</pre>`,
    type: 'input', expected: '10',
    solution: "À chaque tour, on ajoute 2 à x. Après 5 tours : 0 + 2×5 = 10.",
    help: {
      cours: "Une boucle « répéter n fois » exécute le bloc n fois consécutivement.",
      savoirFaire: "Dérouler mentalement ou multiplier le pas par le nombre de tours.",
      erreurs: ["Exécuter 4 fois au lieu de 5.", "Oublier la valeur initiale.", "Confondre avec somme arithmétique."]
    }
  };
}

function t12_tester_variable() {
  const cases = [
    { desc: "Si x > 3 afficher « Grand » sinon « Petit », avec x = 5", r: '« Grand »' },
    { desc: "Si x > 3 afficher « Grand » sinon « Petit », avec x = 2", r: '« Petit »' },
    { desc: "Si x = 0 afficher « Zéro » sinon « Non nul », avec x = 4", r: '« Non nul »' },
    { desc: "Si x < 0 afficher « Négatif » sinon « Positif », avec x = -3", r: '« Négatif »' }
  ];
  const k = pick(cases);
  const opts = ['« Grand »', '« Petit »', '« Zéro »', '« Non nul »', '« Négatif »', '« Positif »'];
  const { choices, correctIdx } = makeQCM(opts.slice(0, 4).map(o => ({ html: o, correct: o === k.r })));
  return {
    theme: 'algo', title: 'Tester une variable',
    body: `Que s'affiche-t-il ?<br><i>${k.desc}</i>`,
    type: 'qcm', choices, correctIdx,
    solution: `Évaluer la condition avec la valeur de x, puis suivre la branche correspondante.`,
    help: {
      cours: "Un <b>test</b> évalue une condition (comparaison). Si vraie, on exécute la branche « alors » ; sinon, la branche « sinon ».",
      savoirFaire: "Substituer la valeur, comparer, choisir la branche.",
      erreurs: ["Confondre > et <.", "Exécuter les deux branches.", "Se tromper de sens d'inégalité."]
    }
  };
}

function t12_trace_si_alors() {
  return {
    theme: 'algo', title: 'Trace Si…Alors imbriqué',
    body: `Que contient <b>r</b> après ce script ?<br><pre style="background:var(--bg-elev);padding:8px;border-radius:6px;font-size:0.88rem;">n ← 7\nsi n > 10 :\n    r ← 'grand'\nsinon :\n    si n > 5 :\n        r ← 'moyen'\n    sinon :\n        r ← 'petit'</pre>`,
    type: 'qcm',
    choices: ["'grand'", "'moyen'", "'petit'", "Rien (erreur)"],
    correctIdx: 1,
    solution: "n = 7 n'est pas > 10, mais 7 > 5, donc r = 'moyen'.",
    help: {
      cours: "Les <b>conditions imbriquées</b> permettent de tester plusieurs cas enchainés.",
      savoirFaire: "Évaluer chaque test dans l'ordre, suivre la branche correspondante.",
      erreurs: ["S'arrêter au premier test.", "Mélanger les branches.", "Confondre > et ≥."]
    }
  };
}


const QUESTION_BANK = {
  calcul: [
    t1_relatifs_produit, t1_relatifs_quotient, t1_signe_produit,
    t1_somme_fractions, t1_diff_fractions, t1_produit_fractions, t1_quotient_fractions, t1_inverse,
    t1_puissance_10, t1_notation_sci, t1_prefixes,
    t1_carre_parfait, t1_racine_parfaite, t1_encadrement_racine,
    t1_comp_fractions,
    // Bloc rattrapage puissances
    t1p_puissance_relatif, t1p_produit_meme_base, t1p_quotient_meme_base,
    t1p_puissance_10_produit, t1p_puissance_10_quotient, t1p_exposant_0_1,
    t1p_priorites_puissances, t1p_ecrire_puissance, t1p_ecriture_sci_basic,
    t1p_trouver_n, t1p_programme_calcul, t1p_produit_puissance_n,
    t1p_factoriser_puissances, t1p_calcul_complexe, t1p_doublement
  ],
  arithmetique: [
    t2_premier, t2_decomposition, t2_frac_egales, t2_simplifier, t2_probleme_divisibilite,
    t2_liste_premiers,
    // Enrichissement EMCP2 2026-04-21
    t2_div_par_11, t2_premier_sous_100, t2_decomposition_eclair, t2_fraction_de_fraction
  ],
  algebre: [
    t3_developper_simple, t3_reduire, t3_factoriser_simple,
    t3_tester_solution, t3_equation_simple, t3_equation_ax_cx,
    t3_equivalence_programmes,
    // Bloc éval calcul littéral
    t3e_reduire_produit, t3e_reduire_somme, t3e_developper_negatif,
    t3e_double_distrib, t3e_develop_plusieurs_par, t3e_factoriser_puissance,
    t3e_tester_x2, t3e_equation_fraction, t3e_equation_developpement,
    t3e_probleme_nombre, t3e_probleme_prix, t3e_structure_expression,
    t3e_identifier_facteur_commun, t3e_equation_facile, t3e_simplifier_produit_lettres,
    t3e_valeur_expression, t3e_developper_complexe, t3e_verifier_egalite,
    t3e_equation_complexe, t3e_probleme_perimetre
  ],
  pourcent: [
    t4_pourcent_simple, t4_quatrieme_prop, t4_reconnaitre_proportionnalite, t4_vitesse_temps,
    t5_lecture_graphique, t5_formule_dependance,
    t4_tableau_proportionnalite, t4_echelle, t4_loi_ohm,
    // Enrichissement EMCP2 2026-04-21
    t4_moitie_quart_tiers, t4_pourcent_inverse, t4_camembert_pct
  ],
  geometrie: [
    t6_pythagore_hyp, t6_pythagore_cote, t6_pythagore_reciproque,
    t6_cosinus, t6_thales_direct, t6_thales_reciproque, t6_cas_egalite,
    // Enrichissement EMCP2 2026-04-21
    t5_nature_triangle, t5_angles_triangle, t5_pythagore_codee, t5_aire_composee
  ],
  transformations: [
    t6_translation_conservation, t6_homothetie_rapport,
    t8_translation_image, t8_agrandissement_aire, t8_agrandissement_volume,
    // Enrichissement EMCP2 2026-04-21
    t6_sym_axiale_vs_centrale, t6_image_translation, t6_rotation_simple
  ],
  espace: [
    t7_volume_pyramide, t7_volume_cone, t7_repere_pave,
    t7_aire_face_pave, t7_volume_pave, t7_patron, t7_perspective_cavaliere,
    // Enrichissement EMCP2 2026-04-21
    t7_patron_solide, t7_volume_cube, t7_nature_solide
  ],
  mesures: [
    t8_conv_vitesse, t8_conv_debit, t8_grandeur_composee,
    t9_conv_vitesse, t9_conv_debit,
    // Enrichissement EMCP2 2026-04-21
    t9_conv_cm_m, t9_unites_aire, t9_unites_volume, t9_conv_duree
  ],
  stats: [
    t9_mediane, t9_etendue, t9_frequence, t9_diagramme_circulaire,
    t10_mediane_pair, t10_diagramme_circulaire,
    // Enrichissement EMCP2 2026-04-21
    t10_lire_batons, t10_mediane_impair, t10_etendue_rapide
  ],
  probas: [
    t10_vocabulaire_proba, t10_proba_contraire, t10_proba_simple,
    t11_evenement_type, t11_proba_diverses_formes,
    // Enrichissement EMCP2 2026-04-21
    t11_vocabulaire, t11_proba_contraire, t11_proba_de
  ],
  algo: [
    t11_scratch_boucle, t11_scratch_angle_polygone, t11_scratch_condition,
    t11_scratch_variable, t11_scratch_evenement,
    t12_interaction_lutins,
    // Enrichissement EMCP2 2026-04-21
    t12_boucle_pour, t12_tester_variable, t12_trace_si_alors
  ]
};

const THEME_META = {
  calcul:          { label: 'Calcul numérique', short: 'Calcul', icon: '½', color: '#0284c7' },
  arithmetique:    { label: 'Arithmétique (premiers, divisibilité)', short: 'Arithmétique', icon: '÷', color: '#a855f7' },
  algebre:         { label: 'Calcul littéral & équations', short: 'Algèbre', icon: 'x', color: '#0ea5e9' },
  pourcent:        { label: 'Proportionnalité & pourcentages', short: 'Proportions', icon: '%', color: '#f97316' },
  geometrie:       { label: 'Géométrie plane (Pythagore, Thalès, cos)', short: 'Géométrie', icon: '△', color: '#14b8a6' },
  transformations: { label: 'Transformations (translation, homothétie)', short: 'Transfos', icon: '↻', color: '#ef4444' },
  espace:          { label: 'Espace (pyramide, cône, repérage)', short: 'Espace', icon: '▣', color: '#8b5cf6' },
  mesures:         { label: 'Grandeurs composées', short: 'Mesures', icon: 'V', color: '#22c55e' },
  stats:           { label: 'Statistiques', short: 'Stats', icon: 'x̄', color: '#eab308' },
  probas:          { label: 'Probabilités', short: 'Probas', icon: 'P', color: '#a855f7' },
  algo:            { label: 'Algorithmique (Scratch)', short: 'Algo', icon: '▶', color: '#f59e0b' }
};

/* Construction d'une série (format identique au site 3ème, 9 questions max) */
function buildSeries(selectedThemes) {
  const themes = selectedThemes.length ? selectedThemes : Object.keys(QUESTION_BANK);
  const total = 9;
  const byTheme = {};
  themes.forEach(t => { byTheme[t] = shuffle((QUESTION_BANK[t] || []).slice()); });
  const used = new Set();
  const selected = [];
  let keepGoing = true;
  while (selected.length < total && keepGoing) {
    keepGoing = false;
    for (const t of themes) {
      if (selected.length >= total) break;
      while (byTheme[t].length > 0) {
        const gen = byTheme[t].shift();
        if (!used.has(gen)) {
          used.add(gen);
          selected.push(gen);
          keepGoing = true;
          break;
        }
      }
    }
  }
  return shuffle(selected.map(g => g()));
}
