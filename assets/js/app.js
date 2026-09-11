const SESSION_KEY = "tailan_session";
const SHEET_KEY = "tailan_sheet_id";
const charts = {};
let refreshTimer = null;
let lastModel = null;

const DEMO = {
  overview: [
    ["№", "Жагсаалт", "Тоо ширхэг", "Төсөв", "", "Эзлэх хувь", "Гүйцэтгэл", "Хувь", "Төлөв"],
    ["", "", "", "Нэг бүрийн үнэ", "Нийт үнэ", "", "Нийт үнэ", "", ""],
    ["1. Үндсэн", "", "", "", "", "", "", "", ""],
    [1, "VIP PC", 10, 12790000, 127900000, 0.19664822857615183, 0, 0, "Гэрээлсэн"],
    [2, "NORMAL PC", 41, 9500000, 389500000, 0.5988622754527845, 0, 0, "Гэрээлсэн"],
    [3, "TABLE", 50, 400000, 20000000, 0.03075030939423797, 0, 0, "Судлах"],
    [4, "CHAIR", 50, 500000, 25000000, 0.03843788674279746, 0, 0, "Судлах"],
    ["2. Сервер, хэрэгслүүд", "", "", "", "", "", "", "", ""],
    [1, "Сервер компьютер", 1, 20000000, 20000000, 0.03075030939423797, 0, 0, "Судлах"],
    [2, "Сүлжээний свич болон утаснууд", 1, 4000000, 4000000, 0.006150061878847594, 0, 0, "Судлах"],
    [3, "Software Windoms+Cafesys", 1, 10000000, 10000000, 0.015375154697118984, 0, 0, "Судлах"],
    ["3. Бусад тохижилт, хяналттай холбоотой", "", "", "", "", "", "", "", ""],
    [1, "Хяналтын камер болон NVR", 1, 4000000, 4000000, 0.006150061878847594, 0, 0, "Судлах"],
    [2, "Буйдан, 65inch TV, тохижилт", 1, 10000000, 10000000, 0.015375154697118984, 0, 0, "Судлах"],
    [3, "Засварын ажилын хөлс", 140, 71428.57, 9999999.8, 0.015375154389615892, 3150000, 0.3150000063, "Гэрээтэй"],
    [4, "Засварын материалын зардал", 140, 285714, 39999960, 0.06150055728785715, 14500650, 0.3625166125, "Гэрээтэй"],
    ["4. Бусад нэмэлт зардлууд", "", "", "", "", "", "", "", ""],
    [1, "Үйл ажиллагааны бусад төсөвлөөгүй зардлууд", 1, 5000000, 5000000, 0.007628929363987145, 0, 0, "Судлах"],
    ["", "", "", "", 655399960, 1, 17650650, 0.02693111241569194, ""]
  ],
  main: [
    ["№", "Он сар өдөр", "VIP PC", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0],
    [],
    ["№", "Он сар өдөр", "N PC", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0],
    [],
    ["№", "Он сар өдөр", "TABLE", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0],
    [],
    ["№", "Он сар өдөр", "CHAIR", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0]
  ],
  server: [
    ["№", "Он сар өдөр", "Сервер компьютер", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0],
    [],
    ["№", "Он сар өдөр", "Сүлжээний свич болон утаснууд", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0],
    [],
    ["№", "Он сар өдөр", "Software Windoms+Cafesys", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0]
  ],
  fitout: [
    ["№", "Он сар өдөр", "Хяналтын камер болон NVR", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0],
    [],
    ["№", "Он сар өдөр", "Буйдан, 65inch TV, тохижилт", "Мөнгөн дүн"],
    [1, "", "", ""], [2, "", "", ""], [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 0],
    [],
    ["№", "Он сар өдөр", "Ажил, тээврийн хөлс", "Мөнгөн дүн"],
    [1, "2026.09.07", "Засварын ажлын урьдчилгаа төлбөр", 3000000],
    [2, "2026.09.10", "Ачааны машин тээврийн үнэ", 150000],
    [3, "", "", ""], [4, "", "", ""], [5, "", "", ""], [6, "", "", ""], [7, "", "", ""],
    ["НИЙТ ДҮН", "", "", 3150000],
    [],
    ["№", "Он сар өдөр", "Материалын зардал", "Мөнгөн дүн"],
    [1, "2026.09.07", "Эмүлс", 250000],
    [2, "2026.09.07", "Өнхрүүш,Өнхрүүш,Багс ,Ө Сав,Ц Скоч,Бээлий,зүлгүүр,ө фол,юурт,изи фалтал", 201700],
    [3, "2026.09.08", "Мати будаг ,647,өнхрүүш", 68000],
    [4, "2026.09.08", "Моу ар 185,Крон", 73000],
    [5, "2026.09.08", "8ф рува,Сум,Т Шуруфи,Гошн", 102000],
    [6, "2026.09.08", "100 \\50 лотки,Булаг,троник,тогтоогч", 675000],
    [7, "2026.09.09", "Шинэ цоож,дэгээ наадаг,митер", 28500],
    [8, "2026.09.08", "100 \\50 лотки,Булаг,троник,тогтоогч", 675000],
    [9, "2026.09.09", "Шинэ цоож,дэгээ наадаг,митер", 28500],
    [10, "2026.09.10", "Панель хавтан хар, гэрлийн зам, залгаа, шингэн хадаас", 6444000],
    [11, "2026.09.10", "Панель хавтан 03, Хар залгаа, Эх болон төгсгөл", 1604000],
    [12, "2026.09.10", "Гипс болон с төмөр", 962000],
    [13, "2026.09.11", "140 м.кв дрожны төлбөр", 3035200],
    [14, "2026.09.11", "25 м.кв дрожны зөрүү төлбөр", 338750],
    [15, "2026.09.11", "Төмрийн ирмэг", 15000]
  ],
  other: [
    ["№", "Он сар өдөр", "Бусад нэмэлт зардал", "Мөнгөн дүн"],
    ...Array.from({ length: 70 }, (_, i) => [i + 1, "", "", ""]),
    ["НИЙТ НЭМЭЛТ ЗАРДАЛ", "", "", 0]
  ]
};

function $(id) {
  return document.getElementById(id);
}

function money(n) {
  const v = Math.round(Number(n) || 0);
  const body = Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (v < 0 ? "−" : "") + body + "₮";
}

function moneyShort(n) {
  const v = Number(n) || 0;
  const abs = Math.abs(v);
  if (abs >= 1e6) {
    const sa = abs / 1e6;
    const digits = sa >= 100 ? 1 : 2;
    const s = sa.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
    return (v < 0 ? "−" : "") + s + " сая₮";
  }
  return money(v);
}

function axisMoney(v) {
  const n = Number(v) || 0;
  const abs = Math.abs(n);
  if (abs >= 1e6) {
    const sa = abs / 1e6;
    const digits = sa >= 100 ? 0 : 1;
    return (n < 0 ? "−" : "") + sa.toFixed(digits).replace(/\.0$/, "") + " сая";
  }
  if (abs >= 1e3) return (n / 1e3).toFixed(0) + " мянга";
  return String(Math.round(n));
}

function asRatio(n) {
  if (typeof n === "string" && n.includes("%")) {
    const v = toNumber(n);
    return v > 1.5 ? v / 100 : v;
  }
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.abs(v) <= 1.5 ? v : v / 100;
}

function pct(n) {
  return (asRatio(n) * 100).toFixed(1) + "%";
}

function toNumber(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (v == null || v === "") return 0;
  const s = String(v).replace(/[₮\s'’]/g, "").replace(/,/g, "");
  if (!s || s === "-" || s === "–" || s === "—") return 0;
  if (s.endsWith("%")) {
    const p = Number(s.slice(0, -1));
    return Number.isFinite(p) ? p : 0;
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function cellText(v) {
  if (v == null) return "";
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }
  return String(v).trim();
}

function isBlank(v) {
  return v == null || String(v).trim() === "";
}

function looksHeader(row) {
  const joined = row.map(cellText).join(" ").toLowerCase();
  return joined.includes("жагсаалт") || joined.includes("он сар") || joined.includes("мөнгөн");
}

function looksSection(row) {
  const a = cellText(row[0]);
  const b = cellText(row[1]);
  const hasName = /үндсэн|сервер|тохижилт|бусад/i.test(a + b);
  const nums = row.slice(2).filter((v) => typeof v === "number" && v !== 0);
  return hasName && nums.length === 0 && !looksHeader(row);
}

function looksTotal(row) {
  return /нийт/i.test(row.map(cellText).join(" "));
}

function statusClass(status) {
  const s = cellText(status).toLowerCase();
  if (s.includes("гэрээ")) return "ok";
  if (s.includes("судлах")) return "warn";
  return "info";
}

function extractSheetId(raw) {
  const value = String(raw || "").trim();
  const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : value;
}

function currentSheetId() {
  return extractSheetId(localStorage.getItem(SHEET_KEY) || window.APP_CONFIG.googleSheetId || "");
}

function currentSheetUrl() {
  const id = currentSheetId();
  if (!id) return "";
  if (window.APP_CONFIG.googleSheetUrl && extractSheetId(window.APP_CONFIG.googleSheetUrl) === id) {
    return window.APP_CONFIG.googleSheetUrl;
  }
  return "https://docs.google.com/spreadsheets/d/" + id + "/edit?usp=sharing";
}

function fillSheetSettings() {
  const url = currentSheetUrl();
  $("sheet-input").value = url;
  $("sheet-open").href = url || "#";
  $("settings-status").textContent = url
    ? "Таны Google Sheet аль хэдийн холбогдсон. Энд дахин оруулах шаардлагагүй."
    : "Google Sheet холбоос байхгүй байна.";
  $("settings-msg").textContent = url ? "Холбогдсон" : "";
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const FALLBACK_CATS = [
  "1. Үндсэн",
  "2. Сервер, хэрэгслүүд",
  "3. Бусад тохижилт, хяналттай холбоотой",
  "4. Бусад нэмэлт зардлууд"
];

function categoryForItem(name) {
  const n = cellText(name).toLowerCase();
  if (/vip pc|normal pc|^n pc$|^table$|^chair$/.test(n)) return FALLBACK_CATS[0];
  if (/сервер|свич|software|cafesys|windows/.test(n)) return FALLBACK_CATS[1];
  if (/камер|nvr|буйдан|засвар|материал|тохижилт/.test(n)) return FALLBACK_CATS[2];
  if (/бусад/.test(n)) return FALLBACK_CATS[3];
  return "";
}

let jsonpSeq = 0;
function fetchGvizJsonp(baseUrl) {
  return new Promise((resolve, reject) => {
    const cb = "__gvizCB" + (++jsonpSeq);
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Google Sheet timeout"));
    }, 20000);
    function cleanup() {
      clearTimeout(timer);
      try { delete window[cb]; } catch (_) { window[cb] = undefined; }
      script.remove();
    }
    window[cb] = (json) => {
      cleanup();
      resolve(json);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Google Sheet холбогдсонгүй"));
    };
    script.src = baseUrl + (baseUrl.includes("?") ? "&" : "?") + "tqx=" + encodeURIComponent("out:json;responseHandler:" + cb);
    document.head.appendChild(script);
  });
}

function tableToRows(json) {
  if (!json || json.status === "error") {
    const msg = json && json.errors && json.errors[0] && json.errors[0].detailed_message;
    throw new Error(msg || "Sheet алдаа");
  }
  const cols = json.table.cols || [];
  const labels = cols.map((c) => c.label || "");
  const rows = (json.table.rows || []).map((row) => {
    const out = Array.from({ length: cols.length }, () => "");
    (row.c || []).forEach((cell, i) => {
      if (!cell) return;
      const v = cell.v;
      if (v instanceof Date) {
        out[i] = `${v.getFullYear()}.${String(v.getMonth() + 1).padStart(2, "0")}.${String(v.getDate()).padStart(2, "0")}`;
      } else {
        out[i] = v ?? cell.f ?? "";
      }
    });
    return out;
  });
  return { rows, labels };
}

async function fetchSheet(sheetId, spec) {
  const urls = [];
  if (spec.gid) urls.push(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?gid=${spec.gid}&headers=0`);
  (spec.names || []).forEach((name) => {
    urls.push(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(name)}&headers=0`);
  });
  let lastError = null;
  for (const url of urls) {
    try {
      return tableToRows(await fetchGvizJsonp(url));
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Sheet олдсонгүй");
}

function parseOverview(rows) {
  const categories = [];
  let current = null;
  let totals = { budget: 0, actual: 0, pct: 0 };

  rows.forEach((row) => {
    if (row.every(isBlank) || looksHeader(row)) return;
    if (looksSection(row)) {
      current = { name: cellText(row[0]) || cellText(row[1]), items: [] };
      categories.push(current);
      return;
    }
    if (looksTotal(row) || (isBlank(row[0]) && isBlank(row[1]) && toNumber(row[4]) > 0)) {
      totals = {
        budget: toNumber(row[4]) || totals.budget,
        actual: toNumber(row[6]) || totals.actual,
        pct: asRatio(row[7])
      };
      return;
    }
    const name = cellText(row[1]);
    if (!name) return;
    const inferred = categoryForItem(name);
    if (!current || (inferred && current.name !== inferred)) {
      current = { name: inferred || FALLBACK_CATS[categories.length] || "Бусад", items: [] };
      categories.push(current);
    } else if (!inferred && toNumber(row[0]) === 1 && current.items.length) {
      current = { name: FALLBACK_CATS[categories.length] || "Бусад", items: [] };
      categories.push(current);
    }
    current.items.push({
      no: row[0],
      name,
      qty: toNumber(row[2]),
      unit: toNumber(row[3]),
      budget: toNumber(row[4]),
      share: asRatio(row[5]),
      actual: toNumber(row[6]),
      pct: asRatio(row[7]),
      status: cellText(row[8]) || "—"
    });
  });

  if (!totals.budget) {
    totals.budget = categories.reduce((s, c) => s + c.items.reduce((a, i) => a + i.budget, 0), 0);
    totals.actual = categories.reduce((s, c) => s + c.items.reduce((a, i) => a + i.actual, 0), 0);
    totals.pct = totals.budget ? totals.actual / totals.budget : 0;
  }
  return { categories, totals };
}

function parseLedger(rows, labels) {
  const groups = [];
  let current = null;
  const seed = cellText(labels && labels[2]);
  if (seed && !/он сар|мөнгөн|№/.test(seed.toLowerCase())) {
    current = { title: seed, rows: [], total: 0 };
    groups.push(current);
  }
  rows.forEach((row) => {
    if (row.every(isBlank)) return;
    if (looksHeader(row)) {
      const title = cellText(row[2]) || cellText(row[1]);
      if (title && title.toLowerCase() !== "он сар өдөр") {
        current = { title, rows: [], total: 0 };
        groups.push(current);
      }
      return;
    }
    if (!current) {
      current = { title: "Зарлага", rows: [], total: 0 };
      groups.push(current);
    }
    const date = cellText(row[1]);
    const desc = cellText(row[2]);
    const amount = toNumber(row[3]);
    const no = cellText(row[0]);
    if (looksTotal(row) || (!date && !desc && row[3] !== "" && row[3] != null && !no)) {
      current.total = amount;
      return;
    }
    if (!date && !desc) return;
    current.rows.push({ no, date, desc, amount });
  });
  groups.forEach((g) => {
    if (!g.total) g.total = g.rows.reduce((s, r) => s + r.amount, 0);
  });
  return groups;
}

function allTransactions(model) {
  const list = [];
  ["main", "server", "fitout", "other"].forEach((key) => {
    (model[key] || []).forEach((group) => {
      group.rows.forEach((row) => {
        if (row.amount) list.push({ ...row, group: group.title });
      });
    });
  });
  return list.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function setStatus(text, live) {
  $("sync-status").textContent = text;
  $("sync-status").style.color = live ? "var(--teal)" : "var(--warn)";
}

function renderKpis(model) {
  const { totals, categories } = model.overview;
  const remain = totals.budget - totals.actual;
  const spentItems = categories.flatMap((c) => c.items).filter((i) => i.actual > 0).length;
  $("kpis").innerHTML = `
    <div class="kpi gold"><span>Нийт төсөв</span><b>${moneyShort(totals.budget)}</b><em>${money(totals.budget)}</em></div>
    <div class="kpi teal"><span>Гүйцэтгэл</span><b>${moneyShort(totals.actual)}</b><em>${pct(totals.pct)} зарцуулсан</em></div>
    <div class="kpi remain"><span>Үлдэгдэл</span><b>${moneyShort(remain)}</b><em>${money(remain)}</em></div>
    <div class="kpi count"><span>Гүйлгээ</span><b>${allTransactions(model).length}</b><em>${spentItems} зүйл дээр зарлага</em></div>
  `;
}

function makeChart(id, config) {
  if (charts[id]) charts[id].destroy();
  const ctx = $(id).getContext("2d");
  charts[id] = new Chart(ctx, config);
}

function chartTheme() {
  const tick = "#7a7168";
  const text = "#1c1814";
  const grid = "rgba(23,20,16,.08)";
  const mobile = window.matchMedia("(max-width: 1024px)").matches;
  return {
    legend: {
      position: "bottom",
      align: "start",
      labels: { color: text, font: { family: "Manrope", size: 12, weight: "700" }, boxWidth: 10, padding: 14 }
    },
    tick,
    text,
    grid,
    mobile
  };
}

function renderCharts(model) {
  if (window.Chart) {
    Chart.defaults.font.family = "Manrope";
    Chart.defaults.color = "#7a7168";
  }
  const theme = chartTheme();
  const cats = model.overview.categories;
  const catBudget = cats.map((c) => c.items.reduce((s, i) => s + i.budget, 0));
  const items = cats.flatMap((c) => c.items);

  makeChart("chart-pie", {
    type: "doughnut",
    data: {
      labels: cats.map((c) => c.name.replace(/^\d+\.\s*/, "")),
      datasets: [{ data: catBudget, backgroundColor: ["#1f6b5a", "#315e86", "#c4a06a", "#b42318"], borderWidth: 0 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: theme.legend },
      cutout: "70%"
    }
  });

  const barWrap = $("chart-bar").parentElement;
  barWrap.style.height = Math.max(theme.mobile ? 280 : 360, items.length * (theme.mobile ? 34 : 44) + 88) + "px";
  makeChart("chart-bar", {
    type: "bar",
    data: {
      labels: items.map((i) => i.name),
      datasets: [
        {
          label: "Төсөв",
          data: items.map((i) => i.budget),
          backgroundColor: "#c4a06a",
          borderSkipped: false,
          borderRadius: 6,
          barPercentage: 0.78,
          categoryPercentage: 0.62
        },
        {
          label: "Гүйцэтгэл",
          data: items.map((i) => i.actual),
          backgroundColor: "#1f6b5a",
          borderSkipped: false,
          borderRadius: 6,
          barPercentage: 0.78,
          categoryPercentage: 0.62
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: theme.legend,
        tooltip: {
          backgroundColor: "#171410",
          titleColor: "#fffaf2",
          bodyColor: "#e8c9a0",
          padding: 10,
          callbacks: {
            label(ctx) {
              return " " + ctx.dataset.label + ": " + money(ctx.parsed.x);
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: theme.tick, callback: axisMoney },
          grid: { color: theme.grid, drawBorder: false }
        },
        y: {
          ticks: {
            color: theme.text,
            font: { size: theme.mobile ? 10 : 12, weight: "600" },
            autoSkip: false,
            callback(value) {
              const label = this.getLabelForValue(value);
              return theme.mobile && label.length > 16 ? label.slice(0, 15) + "…" : label;
            }
          },
          grid: { display: false }
        }
      }
    }
  });

  const statusMap = {};
  items.forEach((i) => {
    const key = i.status || "—";
    statusMap[key] = (statusMap[key] || 0) + 1;
  });
  makeChart("chart-status", {
    type: "doughnut",
    data: {
      labels: Object.keys(statusMap),
      datasets: [{ data: Object.values(statusMap), backgroundColor: ["#1f6b5a", "#c4a06a", "#315e86", "#b45309"], borderWidth: 4, borderColor: "#fffdf8" }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: theme.legend },
      cutout: "62%"
    }
  });

  const txs = allTransactions(model);
  const byDate = {};
  txs.forEach((t) => {
    const d = t.date || "Огноогүй";
    byDate[d] = (byDate[d] || 0) + t.amount;
  });
  const dates = Object.keys(byDate);
  let running = 0;
  const cumulative = dates.map((d) => (running += byDate[d]));
  makeChart("chart-line", {
    type: "line",
    data: {
      labels: dates.length ? dates : ["Одоогоор зарлагагүй"],
      datasets: [{
        label: "Хуримтлагдсан зарлага",
        data: dates.length ? cumulative : [0],
        borderColor: "#1f6b5a",
        backgroundColor: "rgba(31,107,90,.12)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#c4a06a",
        pointBorderColor: "#fff",
        pointRadius: 4,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: theme.tick }, grid: { display: false } },
        y: { ticks: { color: theme.tick, callback: axisMoney }, grid: { color: theme.grid } }
      }
    }
  });
}

function renderOverviewTable(model) {
  const rows = [];
  model.overview.categories.forEach((cat) => {
    const subBudget = cat.items.reduce((s, i) => s + i.budget, 0);
    const subActual = cat.items.reduce((s, i) => s + i.actual, 0);
    rows.push(`<tr class="section-row"><td colspan="4">${cat.name}</td><td class="num amt-budget">${money(subBudget)}</td><td></td><td class="num amt-actual">${money(subActual)}</td><td colspan="2"></td></tr>`);
    cat.items.forEach((i) => {
      const p = i.budget ? i.actual / i.budget : 0;
      rows.push(`<tr>
        <td>${i.no}</td>
        <td>${i.name}</td>
        <td class="num">${i.qty}</td>
        <td class="num amt-unit">${money(i.unit)}</td>
        <td class="num amt-budget">${money(i.budget)}</td>
        <td class="num">${pct(i.share)}</td>
        <td class="num amt-actual">${money(i.actual)}</td>
        <td><div class="bar"><i style="width:${Math.min(100, p * 100)}%"></i></div></td>
        <td><span class="badge ${statusClass(i.status)}">${i.status}</span></td>
      </tr>`);
    });
  });
  const t = model.overview.totals;
  $("overview-table").innerHTML = `<table>
    <thead><tr>
      <th>№</th><th>Жагсаалт</th><th class="num">Тоо</th><th class="num">Нэг үнэ</th>
      <th class="num">Төсөв</th><th class="num">Эзлэх хувь</th><th class="num">Гүйцэтгэл</th>
      <th>Явц</th><th>Төлөв</th>
    </tr></thead>
    <tbody>${rows.join("")}
      <tr class="total-row"><td colspan="4">НИЙТ</td><td class="num amt-budget">${money(t.budget)}</td>
      <td class="num">100%</td><td class="num amt-actual">${money(t.actual)}</td><td>${pct(t.pct)}</td><td></td></tr>
    </tbody>
  </table>`;
  if ($("overview-cards")) {
    $("overview-cards").innerHTML = model.overview.categories.map((cat) => `
      <div class="stack-group">
        <h3>${cat.name}</h3>
        ${cat.items.map((i) => {
          const p = i.budget ? i.actual / i.budget : 0;
          return `<div class="stack-item">
            <div class="row"><b>${i.name}</b><span class="amt-actual">${money(i.actual)}</span></div>
            <p class="meta"><span class="amt-budget">${money(i.budget)}</span> төсөв · <span class="amt-remain">${money(Math.max(0, i.budget - i.actual))}</span> үлдэгдэл · <span class="badge ${statusClass(i.status)}">${i.status}</span></p>
            <div class="bar"><i style="width:${Math.min(100, p * 100)}%"></i></div>
          </div>`;
        }).join("")}
      </div>
    `).join("");
  }
}

function renderLedger(id, groups) {
  if (!groups || !groups.length) {
    $(id).innerHTML = `<p class="empty">Мөр хоосон байна. Google Sheet дээр бичилт хийхэд энд гарна.</p>`;
    return;
  }
  const stack = groups.map((g) => {
    const rows = g.rows.filter((r) => r.desc || r.amount);
    return `<div class="stack-group">
      <h3><span>${g.title}</span><span class="amt-actual">${money(g.total)}</span></h3>
      ${rows.map((r) => `
        <div class="stack-item">
          <div class="row"><b>${r.desc || "—"}</b><span class="amt-actual">${money(r.amount)}</span></div>
          <p class="meta">${r.date || "Огноогүй"} · №${r.no}</p>
        </div>
      `).join("") || `<p class="empty">Бичилт алга</p>`}
    </div>`;
  }).join("");
  $(id).innerHTML = `<div class="stack ledger-stack">${stack}</div><div class="ledger">${groups.map((g) => `
    <section>
      <h3><span>${g.title}</span><span class="amt-actual">${money(g.total)}</span></h3>
      <div class="table-wrap"><table>
        <thead><tr><th>№</th><th>Он сар өдөр</th><th>Тайлбар</th><th class="num">Мөнгөн дүн</th></tr></thead>
        <tbody>
          ${g.rows.filter((r) => r.desc || r.amount).map((r) => `<tr>
            <td>${r.no}</td><td>${r.date || "—"}</td><td>${r.desc || "—"}</td><td class="num amt-actual">${money(r.amount)}</td>
          </tr>`).join("") || `<tr><td colspan="4" class="empty">Бичилт алга</td></tr>`}
          <tr class="total-row"><td colspan="3">НИЙТ ДҮН</td><td class="num amt-actual">${money(g.total)}</td></tr>
        </tbody>
      </table></div>
    </section>
  `).join("")}</div>`;
}

function renderAll(model) {
  lastModel = model;
  renderKpis(model);
  try { renderCharts(model); } catch (err) { console.error(err); }
  renderOverviewTable(model);
  renderLedger("ledger-main", model.main);
  renderLedger("ledger-server", model.server);
  renderLedger("ledger-fitout", model.fitout);
  renderLedger("ledger-other", model.other);
}

function demoModel() {
  return {
    overview: parseOverview(DEMO.overview),
    main: parseLedger(DEMO.main),
    server: parseLedger(DEMO.server),
    fitout: parseLedger(DEMO.fitout),
    other: parseLedger(DEMO.other)
  };
}

async function loadLive() {
  const sheetId = currentSheetId();
  if (!sheetId) {
    renderAll(demoModel());
    setStatus("Жишээ өгөгдөл · Google Sheet холбоогүй", false);
    return;
  }
  const sheets = window.APP_CONFIG.sheets;
  try {
    const [overview, main, server, fitout, other] = await Promise.all([
      fetchSheet(sheetId, sheets.overview),
      fetchSheet(sheetId, sheets.main),
      fetchSheet(sheetId, sheets.server),
      fetchSheet(sheetId, sheets.fitout),
      fetchSheet(sheetId, sheets.other)
    ]);
    renderAll({
      overview: parseOverview(overview.rows),
      main: parseLedger(main.rows, main.labels),
      server: parseLedger(server.rows, server.labels),
      fitout: parseLedger(fitout.rows, fitout.labels),
      other: parseLedger(other.rows, other.labels)
    });
    const now = new Date();
    setStatus("Google Sheet · " + now.toLocaleTimeString("mn-MN"), true);
  } catch (err) {
    renderAll(demoModel());
    setStatus("Sheet уншигдсангүй. Жишээ өгөгдөл харуулж байна", false);
    console.error(err);
  }
}

function startRefresh() {
  clearInterval(refreshTimer);
  const sec = Number(window.APP_CONFIG.refreshSeconds) || 45;
  refreshTimer = setInterval(loadLive, sec * 1000);
}

function showApp(user) {
  $("login-view").hidden = true;
  $("app-view").hidden = false;
  $("whoami").textContent = user.name || user.username;
  const isAdmin = user.role === "admin" || user.username === "admin";
  $("btn-settings").hidden = !isAdmin;
  if (isAdmin) fillSheetSettings();
  loadLive();
  startRefresh();
}

function currentUser() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = $("login-user").value.trim();
  const password = $("login-pass").value;
  const hash = await sha256(password);
  const user = (window.APP_CONFIG.users || []).find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.passHash === hash
  );
  if (!user) {
    $("login-error").hidden = false;
    $("login-error").textContent = "Нэвтрэх нэр эсвэл нууц үг буруу. Зөвхөн 2 хэрэглэгч зөвшөөрөгдөнө.";
    return;
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    username: user.username,
    name: user.name,
    role: user.role || (user.username === "admin" ? "admin" : "user")
  }));
  showApp(user);
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  clearInterval(refreshTimer);
  location.reload();
}

const PAGE_TITLES = {
  overview: "Ерөнхий тойм",
  main: "Үндсэн зардал",
  server: "Сервер, хэрэгслүүд",
  fitout: "Тохижилт, хяналт",
  other: "Бусад зардал"
};

function switchTab(tab) {
  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== "tab-" + tab;
  });
  if ($("page-title")) $("page-title").textContent = PAGE_TITLES[tab] || "Тайлан";
  window.scrollTo({ top: 0, behavior: "instant" });
  if (tab === "overview" && lastModel) {
    requestAnimationFrame(() => {
      try { renderCharts(lastModel); } catch (err) { console.error(err); }
    });
  }
}

function bindUi() {
  $("login-form").addEventListener("submit", handleLogin);
  $("btn-logout").addEventListener("click", logout);
  $("btn-refresh").addEventListener("click", loadLive);
  $("btn-settings").addEventListener("click", () => {
    const session = currentUser();
    if (!session || (session.role !== "admin" && session.username !== "admin")) return;
    fillSheetSettings();
    $("settings-modal").hidden = false;
  });
  $("btn-close-settings").addEventListener("click", () => { $("settings-modal").hidden = true; });
  $("settings-modal").addEventListener("click", (e) => {
    if (e.target === $("settings-modal")) $("settings-modal").hidden = true;
  });
  $("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (btn) switchTab(btn.dataset.tab);
  });
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (lastModel) {
        try { renderCharts(lastModel); } catch (err) { console.error(err); }
      }
    }, 220);
  });
}

bindUi();
const session = currentUser();
if (session && (window.APP_CONFIG.users || []).some((u) => u.username === session.username)) {
  const full = (window.APP_CONFIG.users || []).find((u) => u.username === session.username);
  showApp({ ...session, role: session.role || full.role });
}
