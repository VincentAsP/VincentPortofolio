// Animasi tinta (canvas, tanpa video). Pure functions: drawInk(ctx, w, h, stage, t)
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
const easeIn = (t) => clamp(t) ** 2;
const expo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));
const GRAY = "rgba(185,190,190,0.8)";

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

// Bentuk cipratan organik: badan bergelombang + duri + percikan + lelehan (semua relatif terhadap R)
function makeSplat(seed, o = {}) {
  const { spikes = 30, drops = 70, subs = 7, drips = 4, grays = 4 } = o;
  const r = rng(seed);
  const harm = [1, 2, 3, 5, 7].map((k) => ({ k, a: (0.17 / Math.pow(k, 0.6)) * (0.5 + r()), ph: r() * TAU }));
  const sp = Array.from({ length: spikes }, () => ({ a: r() * TAU, len: 0.35 + r() * 1.1, w: 0.012 + r() * 0.03 }));
  const dr = Array.from({ length: drops }, () => ({
    a: r() * TAU, d: 0.95 + r() * 2.5, r: 0.025 + r() * 0.12, streak: r() < 0.35, gray: r() < 0.25,
  }));
  const sb = Array.from({ length: subs }, () => ({ a: r() * TAU, d: 0.3 + r() * 0.65, r: 0.22 + r() * 0.35 }));
  const dp = Array.from({ length: drips }, () => ({
    a: Math.PI / 2 + (r() - 0.5) * 1.5, len: 0.7 + r() * 1.7, w: 0.04 + r() * 0.06, delay: 0.3 + r() * 0.3,
  }));
  const st = { a: r() * Math.PI, k: 0.25 + r() * 0.35 };
  const gp = Array.from({ length: grays }, () => {
    const a = r() * TAU, d = 0.5 + r() * 0.9, rad = 0.25 + r() * 0.4;
    return { a, d, rad, parts: Array.from({ length: 3 }, () => ({ dx: (r() - 0.5) * 0.5, dy: (r() - 0.5) * 0.5, k: 0.5 + r() * 0.6 })) };
  });
  return { harm, sp, dr, sb, dp, st, gp };
}
const S0 = makeSplat(7), S1 = makeSplat(21, { drops: 50 }), S2 = makeSplat(33, { drips: 5 });
const S3 = makeSplat(58, { spikes: 44, drops: 60, subs: 9 }), S4 = makeSplat(90, { drops: 22, spikes: 18 });

function teardrop(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y - r * 2.4);
  ctx.bezierCurveTo(x + r * 1.2, y - r * 0.4, x + r * 1.1, y + r, x, y + r);
  ctx.bezierCurveTo(x - r * 1.1, y + r, x - r * 1.2, y - r * 0.4, x, y - r * 2.4);
  ctx.fill();
}

function drawSplat(ctx, cx, cy, R, S, p, fill = "#fff") {
  if (p <= 0) return;
  const e = expo(p);
  ctx.save();
  ctx.fillStyle = fill; ctx.strokeStyle = fill; ctx.lineCap = "round";
  // bercak abu-abu transparan di bawah badan
  ctx.fillStyle = "rgba(170,175,175,0.5)";
  for (const g of S.gp) {
    const gx = cx + Math.cos(g.a) * R * g.d * e, gy = cy + Math.sin(g.a) * R * g.d * e;
    for (const q of g.parts) {
      ctx.beginPath();
      ctx.arc(gx + q.dx * R * e, gy + q.dy * R * e, R * g.rad * q.k * e, 0, TAU);
      ctx.fill();
    }
  }
  ctx.fillStyle = fill;
  // badan
  const N = 360;
  ctx.beginPath();
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * TAU;
    let rr = 1 + S.st.k * Math.cos(2 * (a - S.st.a));
    for (const h of S.harm) rr += h.a * Math.sin(h.k * a + h.ph);
    for (const s of S.sp) {
      const d = Math.abs((((a - s.a + Math.PI) % TAU) + TAU) % TAU - Math.PI);
      rr += s.len * Math.exp(-Math.pow(d / s.w, 2));
    }
    const x = cx + Math.cos(a) * R * e * rr, y = cy + Math.sin(a) * R * e * rr;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath(); ctx.fill();
  // gumpalan di dalam
  for (const b of S.sb) {
    ctx.beginPath();
    ctx.arc(cx + Math.cos(b.a) * R * b.d * e, cy + Math.sin(b.a) * R * b.d * e, R * b.r * e, 0, TAU);
    ctx.fill();
  }
  // percikan + garis lecutan
  for (const d of S.dr) {
    const dist = R * d.d * e, rad = R * d.r * (1 - e * 0.25);
    const px = cx + Math.cos(d.a) * dist, py = cy + Math.sin(d.a) * dist;
    const c = d.gray ? GRAY : fill;
    ctx.fillStyle = c; ctx.strokeStyle = c;
    if (d.streak) {
      ctx.lineWidth = Math.max(1, rad * 0.4);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(d.a) * dist * 0.35, cy + Math.sin(d.a) * dist * 0.35);
      ctx.lineTo(px, py); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(px, py, Math.max(1, rad), 0, TAU); ctx.fill();
  }
  // lelehan
  ctx.fillStyle = fill; ctx.strokeStyle = fill;
  for (const d of S.dp) {
    if (p <= d.delay) continue;
    const g = easeOut((p - d.delay) * 1.3), len = R * d.len * g, lw = Math.max(1.5, R * d.w);
    const px = cx + Math.cos(d.a) * R * 0.8 * e, py = cy + Math.sin(d.a) * R * 0.8 * e;
    ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + len); ctx.stroke();
    ctx.beginPath(); ctx.arc(px, py + len, lw * 0.95, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function frameAt(pts, i) {
  const q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)];
  let dx = q.x - o.x, dy = q.y - o.y;
  const m = Math.hypot(dx, dy) || 1;
  return { nx: -dy / m, ny: dx / m };
}
function bez(P0, P1, P2, n = 70) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), u = 1 - t;
    return { x: u * u * P0.x + 2 * u * t * P1.x + t * t * P2.x, y: u * u * P0.y + 2 * u * t * P1.y + t * t * P2.y };
  });
}
// Sapuan kuas meruncing + tekstur bulu kuas
function taper(ctx, pts, i0, i1, widthFn, fill = "#fff") {
  if (i1 - i0 < 2) return;
  const L = [], R = [];
  for (let i = i0; i <= i1; i++) {
    const { nx, ny } = frameAt(pts, i), hw = widthFn(i / (pts.length - 1)) / 2, p = pts[i];
    L.push({ x: p.x + nx * hw, y: p.y + ny * hw }); R.push({ x: p.x - nx * hw, y: p.y - ny * hw });
  }
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  L.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i].x, R[i].y);
  ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.globalAlpha = 0.28;
  for (let k = -3; k <= 3; k++) {
    ctx.beginPath();
    for (let i = i0; i <= i1; i++) {
      const { nx, ny } = frameAt(pts, i), hw = (widthFn(i / (pts.length - 1)) / 2) * (k / 3.4), p = pts[i];
      const x = p.x + nx * hw, y = p.y + ny * hw;
      i === i0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
function stripe(ctx, x, y0, y1, w) {
  if (y1 - y0 < 2) return;
  ctx.fillRect(x - w / 2, y0, w, y1 - y0);
  if (w < 6) return;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out"; ctx.strokeStyle = "#000"; ctx.globalAlpha = 0.3; ctx.lineWidth = 1;
  for (let k = -2; k <= 2; k++) {
    ctx.beginPath(); ctx.moveTo(x + k * w * 0.18, y0); ctx.lineTo(x + k * w * 0.18, y1); ctx.stroke();
  }
  ctx.restore();
}
function verticalLine(ctx, x, w, headY, tailY = -5) {
  ctx.fillRect(x - w / 2, tailY, w, headY - tailY);
  ctx.beginPath(); ctx.arc(x, headY, w * 0.9, 0, TAU); ctx.fill();
}

const scenes = [
  // 0 — cipratan pertama: dua ledakan, lalu meleleh
  (ctx, w, h, t, B) => {
    const cx = w / 2, cy = h / 2;
    drawSplat(ctx, cx - w * 0.02, cy - h * 0.03, B * 0.95, S0, (t - 0.1) / 1.1);
    drawSplat(ctx, cx + w * 0.05, cy - h * 0.17, B * 0.72, S1, (t - 0.55) / 1.2);
    // tetes kecil jatuh
    if (t > 1.4) {
      ctx.fillStyle = "#fff";
      const y = cy + h * 0.1 + easeIn((t - 1.4) / 1.2) * h * 0.14;
      teardrop(ctx, cx + w * 0.012, y, 4);
    }
  },
  // 1 — sapuan kuas melengkung + cipratan + garis vertikal + lecutan horizontal
  (ctx, w, h, t, B) => {
    const cx = w / 2, cy = h / 2;
    const pts = bez({ x: cx - w * 0.07, y: -20 }, { x: cx + w * 0.1, y: cy * 0.55 }, { x: cx - w * 0.02, y: cy + h * 0.04 });
    const n = pts.length, head = Math.floor((n - 1) * easeOut(t / 0.95));
    taper(ctx, pts, 0, head, (u) => B * 0.42 * Math.pow(Math.sin(clamp(u * 0.95 + 0.04) * Math.PI * 0.95), 0.7));
    drawSplat(ctx, pts[n - 1].x, pts[n - 1].y, B * 0.85, S2, (t - 0.7) / 1.2);
    ctx.fillStyle = "#fff";
    const g = easeOut((t - 0.95) / 0.8);
    if (g > 0) {
      verticalLine(ctx, cx + w * 0.035, 4, g * h * 0.5);
      verticalLine(ctx, cx - w * 0.1, 3, g * h * 0.3);
      teardrop(ctx, cx + w * 0.035, g * h * 0.5 + 12, 5);
    }
    const sw = bez({ x: cx + w * 0.03, y: cy + h * 0.05 }, { x: cx + w * 0.3, y: cy - h * 0.08 }, { x: w + 60, y: cy + h * 0.02 });
    const a = Math.floor((sw.length - 1) * easeOut((t - 1.2) / 0.9)), b = Math.floor((sw.length - 1) * easeOut((t - 1.55) / 0.9));
    taper(ctx, sw, b, a, (u) => 10 * Math.sin(Math.PI * clamp(u)));
  },
  // 2 — garis-garis bulu kuas turun dari atas + tetes besar jatuh
  (ctx, w, h, t, B) => {
    const cx = w / 2 - w * 0.02, cy = h / 2;
    ctx.fillStyle = "#fff";
    const head = h * 0.62 * easeOut(t / 1.3);
    const tail = h * 1.1 * easeIn((t - 1.5) / 1.3);
    stripe(ctx, cx, tail - 5, head, 16);
    stripe(ctx, cx - 24, tail - 5, head * 0.96, 3);
    stripe(ctx, cx + 24, tail - 5, head * 0.9, 3);
    if (head < h * 1.05 && tail < head) {
      teardrop(ctx, cx, head + 14, 8);
      teardrop(ctx, cx + 24, head * 0.9 + 12, 3.5);
    }
    const dropT = (t - 1.5) / 0.7;
    if (dropT > 0 && dropT < 1) teardrop(ctx, cx + w * 0.1, cy - h * 0.3 + easeIn(dropT) * h * 0.38, 9);
    drawSplat(ctx, cx + w * 0.1, cy + h * 0.08, B * 0.5, S4, (t - 2.15) / 0.9);
  },
  // 3 — ledakan besar yang memudar jadi abu-abu dan tertinggal
  (ctx, w, h, t, B) => {
    const cx = w / 2, cy = h / 2;
    const g = clamp((t - 1.3) / 1.5), l = Math.round(255 - g * 120), fill = `rgb(${l},${l},${l})`;
    drawSplat(ctx, cx - w * 0.01, cy, B * 1.2, S3, (t - 0.1) / 1.2, fill);
    drawSplat(ctx, cx + w * 0.045, cy - h * 0.05, B * 0.6, S4, (t - 0.45) / 1.0, fill);
  },
];

export const INK_DURATION = [2.8, 3.2, 3.4, 3.4];

export function drawInk(ctx, w, h, stage, t) {
  ctx.clearRect(0, 0, w, h);
  const B = Math.min(w, h) * 0.105; // ukuran dasar cipratan
  scenes[stage](ctx, w, h, t, B);
}
