import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, AreaChart, Area, ResponsiveContainer, ReferenceDot } from "recharts";

const C = {
  bg: "#080c10", surface: "#0d1520", card: "#101a24",
  border: "#1c2e3e", accent: "#00d488", blue: "#38b2f0",
  amber: "#f5a623", red: "#ff5c5c", text: "#c4d8e8", muted: "#55788a", code: "#0a1622",
};

const mono = { fontFamily: "monospace" };

const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "20px 24px", marginBottom: 14 };
const h2style = { color: C.accent, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", ...mono, fontWeight: "bold", margin: "0 0 14px" };
const h3style = { color: C.blue, fontSize: 12, letterSpacing: "0.06em", ...mono, fontWeight: "bold", margin: "0 0 10px" };
const pstyle = { color: C.text, fontSize: 12, lineHeight: 1.8, margin: "0 0 12px", ...mono };
const codestyle = { background: C.code, border: `1px solid ${C.border}`, borderRadius: 4, padding: "14px 16px", fontSize: 11, color: "#6ea0c0", ...mono, display: "block", overflow: "auto", whiteSpace: "pre", margin: "0 0 14px" };

function Stat({ value, label, sub, color }) {
  return (
    <div style={{ textAlign: "center", background: C.code, padding: "16px 10px", borderRadius: 6, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 24, fontWeight: "bold", color, ...mono }}>{value}</div>
      <div style={{ fontSize: 10, color: C.muted, marginTop: 6, lineHeight: 1.5, ...mono }}>{label}</div>
      {sub && <div style={{ fontSize: 9, color: color + "88", marginTop: 3, ...mono }}>{sub}</div>}
    </div>
  );
}

function Btn({ active, color, onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 12px", background: active ? (color || C.accent) + "20" : C.code,
      border: `1px solid ${active ? (color || C.accent) : C.border}`, color: active ? (color || C.accent) : C.muted,
      borderRadius: 4, cursor: "pointer", ...mono, fontSize: 10, transition: "all 0.1s", ...style,
    }}>{children}</button>
  );
}

// ── TAB 0: OVERVIEW ──────────────────────────────────────────
function OverviewTab() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const ts = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 1800), setTimeout(() => setPhase(3), 3000), setTimeout(() => setPhase(4), 4200)];
    return () => ts.forEach(clearTimeout);
  }, []);

  const base = [{ t: 0, p: 30 }, { t: 15, p: 33 }, { t: 30, p: 36 }, { t: 45, p: 39 }, { t: 60, p: 42 }, { t: 75, p: 45 }, { t: 90, p: 50 }];
  const shock = [{ t: 90, p: 50 }, { t: 105, p: 37 }, { t: 115, p: 26 }];
  const recovery = [{ t: 115, p: 26 }, { t: 125, p: 31 }, { t: 140, p: 36 }];
  const allData = [...base, ...(phase >= 2 ? shock : []), ...(phase >= 3 ? recovery : [])];

  return (
    <div>
      <div style={card}>
        <div style={h2style}>What this strategy is</div>
        <p style={pstyle}>Roan's article is a complete <span style={{ color: C.accent }}>quantitative trading bot</span> for Polymarket during FIFA World Cup 2026. It doesn't predict goals. It captures the <span style={{ color: C.amber }}>statistical overreaction</span> that follows every goal, red card, or penalty — then exits on the recovery. You're not betting on football. You're providing liquidity into a panic.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Stat value="$1.4B" label="World Cup Winner market volume before a ball is kicked" color={C.accent} />
          <Stat value="104" label="Matches in 39 days — hundreds of shock opportunities" color={C.blue} />
          <Stat value="135%" label="Best backtest ROI on moderate_fav filter" color={C.amber} />
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>Core insight: shock → overreaction → recovery</div>
        <p style={pstyle}>When Arsenal scores against Man United, the Polymarket price for a Man United win <span style={{ color: C.red }}>crashes too far, too fast</span>. Liquidity returns. Cooler heads reprice. The price partially bounces. <strong style={{ color: C.accent }}>That bounce is the edge.</strong></p>
        <div style={{ background: C.code, borderRadius: 6, padding: "12px 8px", marginBottom: 12 }}>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={allData} margin={{ top: 24, right: 60, left: 10, bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="t" tick={{ fill: C.muted, fontSize: 9, fontFamily: "monospace" }} label={{ value: "seconds →", position: "insideBottomRight", fill: C.muted, fontSize: 9, fontFamily: "monospace", dy: 4 }} />
              <YAxis domain={[15, 60]} tick={{ fill: C.muted, fontSize: 9, fontFamily: "monospace" }} tickFormatter={v => `${v}¢`} />
              <Line type="monotone" dataKey="p" stroke={C.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
              {phase >= 2 && <ReferenceDot x={90} y={50} r={5} fill={C.amber} stroke="none" label={{ value: "SHOCK", fill: C.amber, fontSize: 9, fontFamily: "monospace", dx: 8 }} />}
              {phase >= 3 && <ReferenceDot x={115} y={26} r={5} fill={C.red} stroke="none" label={{ value: "FLOOR", fill: C.red, fontSize: 9, fontFamily: "monospace", dx: 8 }} />}
              {phase >= 4 && <ReferenceDot x={140} y={36} r={5} fill={C.blue} stroke="none" label={{ value: "RECOVERY", fill: C.blue, fontSize: 9, fontFamily: "monospace", dx: 8 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[{ c: C.amber, t: "Shock: goal scored, price drops instantly" }, { c: C.red, t: "Floor: panic peak — deepest overreaction" }, { c: C.blue, t: "Recovery: liquidity returns, price bounces" }, { c: C.accent, t: "Edge: the gap you capture with limit orders" }].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.c, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: C.muted, ...mono }}>{item.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>The 5-step loop (runs on every match)</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
          {[
            { n: "01", name: "DETECT", desc: "Price drops ≥15%\nin a 2-min window", color: C.accent },
            { n: "02", name: "CLASSIFY", desc: "Assign to one of\n720 bucket keys", color: C.blue },
            { n: "03", name: "LOOK UP", desc: "Historical P50/P75/\nP90/P95 depths", color: C.amber },
            { n: "04", name: "LADDER", desc: "4 limit orders at\nincreasing depths", color: C.amber },
            { n: "05", name: "CAPTURE", desc: "Exit at +4¢ target\nwhen price recovers", color: C.accent },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div style={{ background: C.code, border: `1px solid ${item.color}40`, borderRadius: 6, padding: "12px 14px", textAlign: "center", minWidth: 100 }}>
                <div style={{ fontSize: 9, color: item.color + "80", ...mono }}>{item.n}</div>
                <div style={{ fontSize: 12, color: item.color, fontWeight: "bold", ...mono, marginTop: 4 }}>{item.name}</div>
                <div style={{ fontSize: 9, color: C.muted, marginTop: 6, lineHeight: 1.6, ...mono, whiteSpace: "pre-line" }}>{item.desc}</div>
              </div>
              {i < arr.length - 1 && <div style={{ color: C.muted, fontSize: 14, padding: "0 4px" }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB 1: SHOCK DETECTION ───────────────────────────────────
function ShockTab() {
  const [peak, setPeak] = useState(55);
  const [floor, setFloor] = useState(40);
  useEffect(() => { if (floor >= peak) setFloor(peak - 1); }, [peak]);

  const dropPct = (peak - floor) / peak * 100;
  const dropAbs = peak - floor;
  const pctPass = dropPct >= 15, absPass = dropAbs >= 8;
  const isShock = pctPass && absPass;

  return (
    <div>
      <div style={card}>
        <div style={h2style}>How a shock is detected</div>
        <p style={pstyle}>The bot watches every active World Cup market through a <span style={{ color: C.accent }}>sliding 2-minute window</span>. A shock fires only when all three rules are simultaneously satisfied:</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, margin: "14px 0" }}>
          {[{ rule: "≥ 15%", label: "Price drop within the 2-minute sliding window", color: C.accent }, { rule: "≥ 8¢", label: "Minimum absolute drop — prevents noise at very low prices", color: C.blue }, { rule: "3 min", label: "Cooldown after previous shock — prevents double-counting the same event", color: C.amber }].map((r, i) => (
            <div key={i} style={{ background: C.code, border: `1px solid ${r.color}40`, borderRadius: 6, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: "bold", color: r.color, ...mono }}>{r.rule}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 8, lineHeight: 1.6, ...mono }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>Interactive shock detector</div>
        <p style={pstyle}>Adjust peak and floor prices to see if the detector fires:</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, margin: "14px 0" }}>
          {[{ label: "Peak price (window high)", val: peak, set: setPeak, min: 20, max: 90, color: C.accent }, { label: "Floor price (window low)", val: Math.min(floor, peak - 1), set: v => setFloor(Math.min(+v, peak - 1)), min: 5, max: peak - 1, color: C.red }].map((sl, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, ...mono }}>{sl.label}: <span style={{ color: sl.color }}>{sl.val}¢</span></div>
              <input type="range" min={sl.min} max={sl.max} value={sl.val} onChange={e => sl.set(e.target.value)} style={{ width: "100%", accentColor: sl.color }} />
            </div>
          ))}
        </div>
        <div style={{ background: C.code, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[{ label: "Drop %", value: `${dropPct.toFixed(1)}%`, pass: pctPass, need: "need ≥15%" }, { label: "Abs drop", value: `${dropAbs}¢`, pass: absPass, need: "need ≥8¢" }].map((m, i) => (
              <div key={i} style={{ textAlign: "center", padding: 12, background: "#071018", borderRadius: 4 }}>
                <div style={{ fontSize: 22, fontWeight: "bold", color: m.pass ? C.accent : C.red, ...mono }}>{m.value}</div>
                <div style={{ fontSize: 9, color: C.muted, marginTop: 4, ...mono }}>{m.label} · {m.need}</div>
                <div style={{ fontSize: 10, color: m.pass ? C.accent : C.red, marginTop: 5, ...mono }}>{m.pass ? "✓ PASS" : "✗ FAIL"}</div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ padding: "12px 14px", background: isShock ? C.accent + "20" : C.red + "18", border: `1px solid ${isShock ? C.accent : C.red}`, borderRadius: 6, textAlign: "center", color: isShock ? C.accent : C.red, fontWeight: "bold", ...mono, fontSize: 12 }}>
                {isShock ? "⚡ SHOCK FIRED" : "— no shock"}
              </div>
            </div>
          </div>
          <div style={codestyle}>
{`def detect_shock(window_trades):
    peak      = ${peak}    # max price in 2-min window
    floor     = ${Math.min(floor, peak - 1)}    # min price in 2-min window
    drop_pct  = (${peak} - ${Math.min(floor, peak - 1)}) / ${peak} = ${(dropPct / 100).toFixed(3)}
    drop_abs  = ${peak} - ${Math.min(floor, peak - 1)} = ${dropAbs}

    if drop_pct >= 0.15 and drop_abs >= 0.08:
        return {"shock": True, "depth": drop_abs}
    
    → ${isShock ? `{"shock": True, "peak": ${peak}, "floor": ${Math.min(floor, peak - 1)}, "depth": ${dropAbs}}` : '{"shock": False}'}`}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>Why football specifically?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[{ icon: "⚽", title: "Low scoring", body: "Every goal is a massive probability event — shifting win probability 20–40 points in one moment. This creates large, detectable price shocks that smaller probability events don't produce." }, { icon: "⏱", title: "Multiple events per game", body: "Goals, red cards, missed penalties, VAR decisions. 90+ minutes of play = multiple tradeable shock moments per match, each one an independent opportunity." }, { icon: "🏆", title: "Tournament scale", body: "104 matches in 39 days. That's enough repetition for a statistical edge to express itself reliably across the whole tournament — not a one-off gamble." }].map((r, i) => (
            <div key={i} style={{ background: C.code, padding: 16, borderRadius: 6, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 20, marginBottom: 10 }}>{r.icon}</div>
              <div style={{ fontSize: 11, color: C.accent, marginBottom: 8, ...mono, fontWeight: "bold" }}>{r.title}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, ...mono }}>{r.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: 5D CLASSIFIER ─────────────────────────────────────
function ClassifierTab() {
  const [league, setLeague] = useState("deep");
  const [fav, setFav] = useState("underdog");
  const [depth, setDepth] = useState("balanced");
  const [time, setTime] = useState("mid");
  const [goals, setGoals] = useState("level");

  const bucketKey = `${league}|${fav}|${depth}|${time}|${goals}`;

  const dims = [
    { name: "1  League tier", desc: "Major leagues (EPL, UCL, La Liga) have deep liquidity and predictable recovery patterns. Minor leagues are thinner and erratic.", state: league, set: setLeague, opts: [{ v: "deep", label: "Deep — EPL / UCL / La Liga", desc: "Rich liquidity, reliable history" }, { v: "thin", label: "Thin — minor leagues", desc: "Erratic, sparse data" }, { v: "unknown", label: "Unknown", desc: "No match identifier" }] },
    { name: "2  Favoritism", desc: "How favored was the team before the shock? A heavily favored team that gets shocked recovers very differently from an underdog that gets shocked.", state: fav, set: setFav, opts: [{ v: "heavy_fav", label: "Heavy fav  >85¢", desc: "Almost certain to win" }, { v: "moderate_fav", label: "Moderate fav  75–85¢", desc: "Strong fav — best ROI in backtest" }, { v: "slight_fav", label: "Slight fav  60–75¢", desc: "Leans one way" }, { v: "balanced", label: "Balanced  45–60¢", desc: "Coin flip zone" }, { v: "underdog", label: "Underdog  <45¢", desc: "Expected to lose" }] },
    { name: "3  Order book depth", desc: "How is liquidity distributed in the book at the moment of the shock? Thin books (top-heavy) mean shocks go deeper.", state: depth, set: setDepth, opts: [{ v: "top_heavy", label: "Top-heavy  ≥70% in top 3 levels", desc: "Thin support → deep shocks" }, { v: "balanced", label: "Balanced  50–70%", desc: "Normal distribution" }, { v: "deep", label: "Deep liquidity  <50%", desc: "Strong support → shallower shocks" }] },
    { name: "4  Match time", desc: "When in the match does the shock occur? Timing changes whether the market will recover or reprice permanently.", state: time, set: setTime, opts: [{ v: "early", label: "Early  0–15 min", desc: "Often reverses — over-reaction to early events" }, { v: "mid", label: "Mid  15–60 min", desc: "Most volume, most reliable data" }, { v: "late", label: "Late  60–80 min", desc: "Volatile, moderate recovery chance" }, { v: "final", label: "Final phase  80+ min", desc: "Often permanent — game nearly decided" }] },
    { name: "5  Goal state", desc: "The scoreline at the moment of shock. Tied game vs 3-goal blowout are completely different trading situations.", state: goals, set: setGoals, opts: [{ v: "level", label: "Level  0–0, 1–1…", desc: "Every goal critical → high recovery chance" }, { v: "one_goal", label: "One goal diff", desc: "Still competitive" }, { v: "two_goals", label: "Two goal diff", desc: "Comfortable lead" }, { v: "blowout", label: "Blowout  3+", desc: "Shocks usually permanent" }] },
  ];

  return (
    <div>
      <div style={card}>
        <div style={h2style}>5-Dimension shock classifier</div>
        <p style={pstyle}>Not all shocks are equal. A shock in a 0-0 UCL match at minute 30 behaves completely differently from one in a 3-0 blowout in injury time. The bot classifies every shock across 5 independent dimensions to build a precise <span style={{ color: C.accent }}>bucket key</span>. Click each option to build yours:</p>
      </div>

      {dims.map((dim) => (
        <div key={dim.name} style={{ ...card, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: C.blue, fontWeight: "bold", ...mono, marginBottom: 6 }}>{dim.name}</div>
          <div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 12 }}>{dim.desc}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {dim.opts.map(opt => (
              <button key={opt.v} onClick={() => dim.set(opt.v)} style={{ padding: "8px 12px", background: dim.state === opt.v ? C.accent + "20" : C.code, border: `1px solid ${dim.state === opt.v ? C.accent : C.border}`, color: dim.state === opt.v ? C.accent : C.muted, borderRadius: 4, cursor: "pointer", ...mono, fontSize: 10, textAlign: "left" }}>
                <div style={{ fontWeight: dim.state === opt.v ? "bold" : "normal" }}>{opt.label}</div>
                <div style={{ color: dim.state === opt.v ? C.accent + "99" : C.muted + "80", marginTop: 2, fontSize: 9 }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ ...card, border: `1px solid ${C.accent}50`, background: C.accent + "05" }}>
        <div style={{ fontSize: 10, color: C.muted, ...mono, marginBottom: 8 }}>CURRENT BUCKET KEY:</div>
        <div style={{ fontSize: 17, color: C.accent, ...mono, letterSpacing: "0.04em", wordBreak: "break-all" }}>"{bucketKey}"</div>
        <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
          {[{ label: "Total possible combinations", v: "720", c: C.text }, { label: "Buckets with enough data", v: "~200", c: C.accent }, { label: "Min shocks needed (else fallback)", v: "5", c: C.amber }].map((m, i) => (
            <span key={i} style={{ fontSize: 11, ...mono }}><span style={{ color: C.muted }}>{m.label}: </span><span style={{ color: m.c, fontWeight: "bold" }}>{m.v}</span></span>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: C.muted, ...mono, lineHeight: 1.7 }}>
          Fallback defaults (fewer than 5 shocks in bucket): <span style={{ color: C.amber }}>P50=6¢ · P75=9¢ · P90=13¢ · P95=18¢</span> — deliberately conservative so the bot doesn't blow up on noise.
        </div>
      </div>
    </div>
  );
}

// ── TAB 3: DISTRIBUTIONS ─────────────────────────────────────
function DistributionsTab() {
  const buckets = {
    "deep|underdog|balanced|mid|level": { p50: 8, p75: 12, p90: 16, p95: 20, n: 28 },
    "deep|moderate_fav|balanced|mid|level": { p50: 6, p75: 9, p90: 14, p95: 17, n: 41 },
    "deep|heavy_fav|deep|mid|level": { p50: 4, p75: 7, p90: 11, p95: 14, n: 19 },
    "thin|underdog|top_heavy|late|level": { p50: 5, p75: 9, p90: 13, p95: 17, n: 7 },
  };
  const [sel, setSel] = useState("deep|underdog|balanced|mid|level");
  const { p50, p75, p90, p95, n } = buckets[sel];

  const makeCurve = (mode) => Array.from({ length: 61 }, (_, i) => {
    const x = i * 0.5;
    const peak = mode * 0.75;
    const y = x <= peak ? Math.exp(-0.5 * Math.pow((x - peak) / (peak * 0.65), 2)) : Math.exp(-0.85 * (x - peak) / (peak * 0.75));
    return { depth: parseFloat(x.toFixed(1)), density: parseFloat((y * 80).toFixed(2)) };
  });

  const curveData = makeCurve(p50);
  const pcts = [{ label: "P50", v: p50, color: C.accent, desc: `50% of shocks are shallower than ${p50}¢. Fills often, smallest recovery.` }, { label: "P75", v: p75, color: C.blue, desc: `75% shallower than ${p75}¢. Good balance of fill rate and recovery size.` }, { label: "P90", v: p90, color: C.amber, desc: `Only 10% go deeper than ${p90}¢. Fewer fills, but better entry price.` }, { label: "P95", v: p95, color: C.red, desc: `Only 5% go this deep. Rarest fill — largest recovery when it fires.` }];

  return (
    <div>
      <div style={card}>
        <div style={h2style}>Historical shock depth distributions</div>
        <p style={pstyle}>For every bucket key, the bot maintains a sorted array of historical shock depths (in cents). It computes percentiles from this distribution. Instead of guessing where the market will bottom, it knows the <span style={{ color: C.accent }}>statistical shape of that specific type of shock</span>.</p>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 8 }}>Select a bucket:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.keys(buckets).map(k => (
              <Btn key={k} active={sel === k} onClick={() => setSel(k)}>{k.split("|").join(" · ")}</Btn>
            ))}
          </div>
        </div>
        <div style={{ background: C.code, borderRadius: 6, padding: "10px 6px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.muted, ...mono, padding: "0 10px 8px" }}>
            Bucket: <span style={{ color: C.accent }}>"{sel}"</span> — <span style={{ color: C.blue }}>{n} historical shocks</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={curveData} margin={{ top: 20, right: 40, left: 10, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="depth" tick={{ fill: C.muted, fontSize: 9, fontFamily: "monospace" }} label={{ value: "Shock depth (¢)  →  deeper shocks", position: "insideBottom", fill: C.muted, fontSize: 9, fontFamily: "monospace", dy: 18 }} />
              <YAxis hide />
              <Area type="monotone" dataKey="density" stroke={C.accent} fill={C.accent + "18"} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              {pcts.map(p => <ReferenceLine key={p.label} x={p.v} stroke={p.color} strokeDasharray="4 2" strokeWidth={1.5} label={{ value: p.label, fill: p.color, fontSize: 9, fontFamily: "monospace", dy: -10 }} />)}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {pcts.map(p => (
            <div key={p.label} style={{ display: "grid", gridTemplateColumns: "46px 52px 1fr", gap: 12, alignItems: "center", background: C.code, padding: "10px 14px", borderRadius: 6, border: `1px solid ${p.color}28` }}>
              <div style={{ color: p.color, fontWeight: "bold", fontSize: 13, ...mono }}>{p.label}</div>
              <div style={{ color: p.color, fontWeight: "bold", fontSize: 20, ...mono }}>{p.v}¢</div>
              <div style={{ color: C.muted, fontSize: 11, ...mono, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <div style={h3style}>The Python code that builds this</div>
        <div style={codestyle}>
{`import numpy as np

def compute_percentiles(depths):
    sorted_depths = np.sort(depths)
    return {
        50:  np.percentile(sorted_depths, 50),   # P50
        75:  np.percentile(sorted_depths, 75),   # P75
        90:  np.percentile(sorted_depths, 90),   # P90
        95:  np.percentile(sorted_depths, 95),   # P95
    }

# Example depths for "${sel}":
example_depths = [4, 5, 6, ${p50-2}, ${p50}, ${p50+1}, ${p50+3}, ${p75-1}, ${p75}, ${p75+2}, ${p90-2}, ${p90}, ${p95}]

print(compute_percentiles(example_depths))
# → {50: ${p50}, 75: ${p75}, 90: ${p90}, 95: ${p95}}`}
        </div>
      </div>
    </div>
  );
}

// ── TAB 4: LADDER STRATEGY ───────────────────────────────────
function LadderTab() {
  const [capital, setCapital] = useState(50);
  const [prePrice, setPrePrice] = useState(30);
  const [p50, setP50] = useState(8);
  const [p75, setP75] = useState(12);
  const [p90, setP90] = useState(16);
  const [p95, setP95] = useState(20);

  const orders = [
    { pct: "P50", depth: p50, weight: 0.10, color: C.accent, label: "Scout — fills often, captures least" },
    { pct: "P75", depth: p75, weight: 0.20, color: C.blue, label: "Core — reliable mid-range entry" },
    { pct: "P90", depth: p90, weight: 0.30, color: C.amber, label: "Deep — better price, fewer fills" },
    { pct: "P95", depth: p95, weight: 0.40, color: C.red, label: "Max edge — rarest fill, largest recovery" },
  ].map(o => ({ ...o, limitPrice: Math.max(1, prePrice - o.depth), size: +(capital * o.weight).toFixed(0) }));

  return (
    <div>
      <div style={card}>
        <div style={h2style}>The laddered limit order strategy</div>
        <p style={pstyle}>Instead of one buy order, the bot places <span style={{ color: C.accent }}>four limit orders</span> at increasing depths — P50, P75, P90, and P95. Capital allocation is heavier toward the deepest levels. The logic: when a deep order fills, the shock was more severe and the statistical recovery from that price is larger.</p>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: C.muted, ...mono, marginBottom: 10 }}>Capital allocation:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {orders.map(o => (
                <div key={o.pct} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: `${o.weight * 220}px`, height: 20, minWidth: 22, background: o.color + "38", border: `1px solid ${o.color}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 10, color: o.color, ...mono, fontWeight: "bold" }}>{(o.weight * 100).toFixed(0)}%</span>
                  </div>
                  <span style={{ fontSize: 10, color: o.color, ...mono }}>{o.pct}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.9 }}>
            <span style={{ color: C.text }}>Why weight increases with depth:</span><br />
            Shallow orders fill more often but at a price closer to the shock — the market has barely moved, so the recovery is small. Deep orders fill rarely, but when they do, the market has massively overreacted and the bounce back is proportionally larger. Allocating the most capital there maximizes expected profit per dollar deployed.
            <br /><br />
            Orders are active for <span style={{ color: C.amber }}>60 seconds</span>. Exit target: <span style={{ color: C.accent }}>+4¢ recovery</span>. Unfilled orders are cancelled.
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>Interactive ladder builder</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div><div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 6 }}>Capital: <span style={{ color: C.accent }}>${capital}</span></div><input type="range" min="10" max="500" step="10" value={capital} onChange={e => setCapital(+e.target.value)} style={{ width: "100%", accentColor: C.accent }} /></div>
          <div><div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 6 }}>Pre-shock price: <span style={{ color: C.blue }}>{prePrice}¢</span></div><input type="range" min="15" max="85" value={prePrice} onChange={e => setPrePrice(+e.target.value)} style={{ width: "100%", accentColor: C.blue }} /></div>
          <div><div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 6 }}>P50 percentile: <span style={{ color: C.accent }}>{p50}¢</span></div><input type="range" min="3" max="15" value={p50} onChange={e => setP50(+e.target.value)} style={{ width: "100%", accentColor: C.accent }} /></div>
          <div><div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 6 }}>P95 percentile: <span style={{ color: C.red }}>{p95}¢</span></div><input type="range" min="12" max="30" value={p95} onChange={e => setP95(+e.target.value)} style={{ width: "100%", accentColor: C.red }} /></div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {orders.map((o, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "56px 58px 70px 1fr", gap: 12, alignItems: "center", padding: "12px 14px", background: C.code, borderRadius: 6, border: `1px solid ${o.color}28` }}>
              <div style={{ color: o.color, fontWeight: "bold", fontSize: 13, ...mono }}>{o.pct}</div>
              <div style={{ color: o.color, fontWeight: "bold", fontSize: 18, ...mono }}>{o.limitPrice}¢</div>
              <div style={{ ...mono }}>
                <div style={{ color: C.text, fontSize: 12 }}>${o.size}</div>
                <div style={{ color: C.muted, fontSize: 10 }}>{(o.weight * 100).toFixed(0)}% of capital</div>
              </div>
              <div style={{ fontSize: 10, color: C.muted, ...mono }}>{o.label}</div>
            </div>
          ))}
        </div>
        <div style={{ ...codestyle, marginTop: 14 }}>
{`# Generated ladder for pre_price=${prePrice}¢, capital=$${capital}
orders = [
${orders.map(o => `    {"price": ${o.limitPrice}, "size": $${o.size}, "pct": "${o.pct}"},  # ${o.pct} — ${(o.weight*100).toFixed(0)}% alloc`).join("\n")}
]
# Each order active for 60 seconds. Exit target: +4¢ from fill price.`}
        </div>
      </div>
    </div>
  );
}

// ── TAB 5: WORKED EXAMPLE ────────────────────────────────────
function WorkedExampleTab() {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "The situation", color: C.blue, lines: ["Match: EPL — Manchester United vs Arsenal", "Current minute: 35  (mid first half)", "Score: 0-0  (tied)", "Man United win price on Polymarket: 30¢  (they are the underdog)", "Order book: balanced  (50–70% in top 3 bid levels)", "Capital available: $50"] },
    { title: "Step 1 — Shock detected", color: C.red, lines: ["Arsenal scores. Man United win price crashes:", "  30¢  →  20¢  in 80 seconds", "", "Drop %:   (30 - 20) / 30 = 33.3%   ✓  (need ≥15%)", "Drop abs:  30 - 20 = 10¢             ✓  (need ≥8¢)", "Cooldown:  no recent shock              ✓", "", "→  SHOCK CONFIRMED ⚡"] },
    { title: "Step 2 — Classify the bucket", color: C.amber, lines: ["League:       market slug contains 'epl'       → deep", "Favoritism:   pre-shock price 30¢ < 45¢       → underdog", "Order book:   50–70% in top 3 levels           → balanced", "Match time:   minute 35 is in the 15-60 range  → mid", "Goal state:   score just became 0-1            → one_goal", "", "→  Bucket key:  \"deep|underdog|balanced|mid|one_goal\""] },
    { title: "Step 3 — Look up the distribution", color: C.accent, lines: ["This bucket has 28 historical shocks. Percentiles:", "", "P50 = 8¢   (half of all past shocks were shallower than 8¢)", "P75 = 12¢", "P90 = 16¢", "P95 = 20¢  (only 5% ever went deeper than 20¢)", "", "→  28 shocks > minimum of 5  →  trusted distribution  ✓"] },
    { title: "Step 4 — Place the ladder", color: C.blue, lines: ["Pre-shock price: 30¢", "", "P50 limit:  30 - 8  = 22¢  |  $50 × 10% = $5   (scout)", "P75 limit:  30 - 12 = 18¢  |  $50 × 20% = $10  (core)", "P90 limit:  30 - 16 = 14¢  |  $50 × 30% = $15  (deep)", "P95 limit:  30 - 20 = 10¢  |  $50 × 40% = $20  (max edge)", "", "→  4 limit buy orders submitted. Active for 60 seconds."] },
    { title: "Step 5 — Fill and exit", color: C.accent, lines: ["Price drops to 14¢. The P90 order fills.", "", "Shares bought:  $15 / $0.14 ≈ 107 shares at 14¢", "Cost basis:     $15.00", "", "Price recovers +4¢ to 18¢. Exit target hit.", "Proceeds:   107 shares × $0.18 = $19.26", "Profit:     $19.26 - $15.00 = $4.26", "", "→  28.4% return on the P90 fill  ✓"] },
  ];

  const cur = steps[step];

  return (
    <div>
      <div style={card}>
        <div style={h2style}>Complete worked example — end to end</div>
        <p style={pstyle}>EPL game, minute 35, Arsenal scores against Man United (the underdog). Trace every step the bot takes from shock detection to profit capture:</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {steps.map((st, i) => (
            <Btn key={i} active={i <= step} color={st.color} onClick={() => setStep(i)} style={{ fontSize: i === step ? 10 : 10, border: `1px solid ${i === step ? st.color : i < step ? st.color + "40" : C.border}`, fontWeight: i === step ? "bold" : "normal" }}>
              {i === 0 ? "Setup" : `Step ${i}`}
            </Btn>
          ))}
        </div>

        <div style={{ background: C.code, border: `1px solid ${cur.color}`, borderRadius: 8, padding: 24, minHeight: 210 }}>
          <div style={{ fontSize: 14, color: cur.color, fontWeight: "bold", ...mono, marginBottom: 14 }}>{cur.title}</div>
          {cur.lines.map((line, i) => (
            <div key={i} style={{ fontSize: 12, ...mono, color: line.startsWith("→") ? cur.color : line === "" ? "transparent" : C.text, fontWeight: line.startsWith("→") ? "bold" : "normal", padding: line.startsWith("→") ? "6px 10px" : "2px 0", borderLeft: line.startsWith("→") ? `2px solid ${cur.color}` : "2px solid transparent", marginLeft: line.startsWith("→") ? -2 : 0, marginTop: line.startsWith("→") ? 8 : 0, lineHeight: 1.7, height: line === "" ? 8 : "auto" }}>
              {line || "\u00A0"}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Btn active={false} onClick={() => setStep(Math.max(0, step - 1))} style={{ opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? "default" : "pointer" }}>← Prev</Btn>
          <Btn active={step < steps.length - 1} color={cur.color} onClick={() => setStep(Math.min(steps.length - 1, step + 1))} style={{ cursor: step === steps.length - 1 ? "default" : "pointer", opacity: step === steps.length - 1 ? 0.4 : 1 }}>Next →</Btn>
        </div>
      </div>

      {step === 5 && (
        <div style={{ ...card, border: `1px solid ${C.accent}50`, background: C.accent + "05" }}>
          <div style={h2style}>Trade summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[{ label: "Entry price", value: "14¢", sub: "P90 fill" }, { label: "Exit price", value: "18¢", sub: "+4¢ recovery" }, { label: "Profit", value: "$4.26", sub: "on $15 capital" }, { label: "Return", value: "28.4%", sub: "on this fill" }].map((m, i) => (
              <div key={i} style={{ background: C.code, padding: 14, borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 22, color: C.accent, fontWeight: "bold", ...mono }}>{m.value}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 6, ...mono }}>{m.label}</div>
                <div style={{ fontSize: 9, color: C.muted + "70", ...mono }}>{m.sub}</div>
              </div>
            ))}
          </div>
          <p style={{ ...pstyle, fontSize: 11, color: C.muted, marginTop: 14, marginBottom: 0 }}>
            Repeat across 104 World Cup matches × multiple shocks per match = hundreds of opportunities. The edge is in consistency and repetition at scale, not any single trade's size.
          </p>
        </div>
      )}
    </div>
  );
}

// ── TAB 6: THE MATH ──────────────────────────────────────────
function MathTab() {
  const [sec, setSec] = useState(0);
  const secLabels = ["Why simple math fails", "Marginal polytope", "Bregman projection", "Frank-Wolfe algorithm", "Execution constraints"];

  return (
    <div>
      <div style={card}>
        <div style={h2style}>The Polymarket math foundation</div>
        <p style={pstyle}>Roan's referenced article reveals how quant systems extracted <span style={{ color: C.accent }}>$39.7 million in guaranteed arbitrage</span> from Polymarket in one year (Apr 2024–Apr 2025). The top trader alone made $2,009,631 from 4,049 trades — $496 average profit per trade. No luck. Pure mathematical infrastructure.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {secLabels.map((sl, i) => <Btn key={i} active={sec === i} onClick={() => setSec(i)}>{sl}</Btn>)}
        </div>
      </div>

      {sec === 0 && (
        <div style={card}>
          <div style={h3style}>Why YES + NO ≈ $1 isn't enough</div>
          <p style={pstyle}>For a single binary market it works. The moment you have two <em>logically correlated</em> markets, simple addition completely misses exploitable arbitrage:</p>
          <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.amber, ...mono, marginBottom: 10 }}>Two markets that look independent — but aren't:</div>
            <div style={{ fontSize: 12, ...mono, lineHeight: 2.1, color: C.text }}>
              Market A: "Will Trump win Pennsylvania?"<br />
              &nbsp;&nbsp;YES: $0.48  ·  NO: $0.52  →  Sum: $1.00  ✓ (looks fine)<br /><br />
              Market B: "Will Republicans win PA by 5+ points?"<br />
              &nbsp;&nbsp;YES: $0.32  ·  NO: $0.68  →  Sum: $1.00  ✓ (looks fine)<br /><br />
              <span style={{ color: C.red }}>BUT: If Republicans win by 5+ points, Trump MUST have won PA.</span><br />
              <span style={{ color: C.red }}>This logical dependency creates arbitrage invisible to simple addition.</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ label: "US Election 2024", v: "1,576 dependent pairs", sub: "market pairs with logical dependencies", c: C.blue }, { label: "Conditions analyzed", v: "17,218", sub: "41% showed single-market arbitrage", c: C.accent }, { label: "Median mispricing", v: "$0.60", sub: "should be $1.00 — markets wrong by 40%", c: C.amber }, { label: "Total arbitrage extracted", v: "$39.7M", sub: "in one year, by ~10 systematic actors", c: C.red }].map((m, i) => <Stat key={i} value={m.v} label={m.label} sub={m.sub} color={m.c} />)}
          </div>
        </div>
      )}

      {sec === 1 && (
        <div style={card}>
          <div style={h3style}>The marginal polytope — what "arbitrage-free" actually means</div>
          <p style={pstyle}>For n conditions, valid outcomes form a <span style={{ color: C.accent }}>convex polytope M</span> in probability space. Arbitrage-free prices must lie inside M. Anything outside M is exploitable with guaranteed profit. The key insight is representing this polytope with compact linear constraints instead of enumerating all 2^n outcomes:</p>
          <div style={codestyle}>
{`Z = {φ(ω) : ω ∈ Ω}   # set of valid payoff vectors
M = conv(Z)            # convex hull = the marginal polytope

Arbitrage-free prices require: prices ∈ M
Arbitrage exists when:        prices ∉ M

SCALE PROBLEM:
  NCAA 2010 tournament: 2^63 = 9,223,372,036,854,775,808 outcomes
  US Election 2024: 1,576 pairs × 2^20 checks each → impossible

INTEGER PROGRAMMING SOLUTION (Duke vs Cornell, 14 conditions):
  Brute force: 2^14 = 16,384 combinations to check

  3 linear constraints replace all 16,384 brute force checks:
  Sum(z_duke, 0..6)   = 1       # Duke wins one bracket slot
  Sum(z_cornell, 0..6) = 1      # Cornell wins one bracket slot
  z(duke,5) + z(duke,6) +
    z(cornell,5) + z(cornell,6) ≤ 1  # Can't both win 5+ games
  
  → 3 constraints. Not 16,384 brute force checks. ✓`}
          </div>
        </div>
      )}

      {sec === 2 && (
        <div style={card}>
          <div style={h3style}>Bregman projection — finding the optimal trade</div>
          <p style={pstyle}>Finding arbitrage is one problem. Computing the <span style={{ color: C.accent }}>optimal trade</span> is another. You can't just "nudge prices toward $1". You need to project the current market state onto the polytope while preserving the information geometry of LMSR pricing:</p>
          <div style={codestyle}>
{`# The Bregman Divergence (for LMSR markets):
D(μ||θ) = R(μ) + C(θ) - θ·μ

Where:
  θ = current market state (the mispriced prices)
  μ = target prices (inside polytope M)
  C(θ) = LMSR cost function
  R(μ) = negative entropy  →  makes D(μ||θ) the KL Divergence

# For LMSR, this becomes:
D(μ||θ) = Σᵢ μᵢ · ln(μᵢ/θᵢ)   # information-theoretic distance

# Maximum guaranteed profit from any trade:
max_profit = D(μ*||θ)
  where μ* = argmin_{μ ∈ M} D(μ||θ)   # the Bregman projection

# μ* tells you: what positions to take, in what size, for what profit.

# WHY KL DIVERGENCE, NOT EUCLIDEAN:
# A move 5¢ → 15¢ carries different information than 50¢ → 60¢.
# KL respects this. Euclidean distance treats both moves identically.
# Wrong metric → wrong optimal trade direction.`}
          </div>
        </div>
      )}

      {sec === 3 && (
        <div style={card}>
          <div style={h3style}>Frank-Wolfe algorithm — making it computationally tractable</div>
          <p style={pstyle}>Computing Bregman projection directly is intractable — the polytope M has exponentially many vertices. Frank-Wolfe builds the projection <span style={{ color: C.accent }}>one vertex at a time</span>, trading global access to M for a sequence of manageable integer programs:</p>
          <div style={codestyle}>
{`FRANK-WOLFE ALGORITHM:

1. Start: Z₀ = small set of known valid outcomes
2. Each iteration t:
   a. Solve convex optimization over conv(Zₜ₋₁)
      μₜ = argmin F(μ) over conv(Zₜ₋₁)
   b. Find new descent vertex via Integer Program (Gurobi):
      zₜ = argmin_{z ∈ Z} ∇F(μₜ)·z
   c. Expand active set: Zₜ = Zₜ₋₁ ∪ {zₜ}
   d. Compute convergence gap: g(μₜ) = ∇F(μₜ)·(μₜ - zₜ)
   e. Stop if gap ≤ ε

KEY: After 100 iterations you track 100 vertices — not 2^63.

Real Gurobi solve times (NCAA tournament):
  Early iterations  (few games settled):  < 1 second
  Mid-tournament    (30–40 games):        10–30 seconds
  Late tournament   (50+ games):          < 5 seconds ← FASTER!
    ↑ because as outcomes resolve, feasible set shrinks

Result: After game 45, Frank-Wolfe outperforms simpler LCMM
by 38% median improvement on security prices.`}
          </div>
        </div>
      )}

      {sec === 4 && (
        <div style={card}>
          <div style={h3style}>Execution constraints — where most strategies fail</div>
          <p style={pstyle}>Even perfect math fails if execution is wrong. Polymarket uses a CLOB (Central Limit Order Book). Trades are <span style={{ color: C.red }}>sequential, not atomic</span>:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: C.red + "10", border: `1px solid ${C.red}40`, padding: 14, borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: C.red, ...mono, marginBottom: 8, fontWeight: "bold" }}>What you plan:</div>
              <div style={{ fontSize: 11, ...mono, lineHeight: 2.1, color: C.text }}>Buy YES at $0.30  ✓<br />Buy NO at $0.30  (plan)<br />Total: $0.60  →  Profit: $0.40</div>
            </div>
            <div style={{ background: C.code, border: `1px solid ${C.border}`, padding: 14, borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, marginBottom: 8, fontWeight: "bold" }}>What actually happens:</div>
              <div style={{ fontSize: 11, ...mono, lineHeight: 2.1, color: C.text }}>Buy YES at $0.30  ✓ fills<br />Your order shifts the price<br />NO now costs $0.78  ✗<br />Total: $1.08  →  <span style={{ color: C.red }}>Loss: $0.08</span></div>
            </div>
          </div>
          <div style={codestyle}>
{`LATENCY HIERARCHY:

Retail trader:                 Sophisticated system:
  API call:      ~50ms           WebSocket feed:     <5ms
  Matching:      ~100ms          Decision (pre-calc): <10ms
  Polygon block: ~2,000ms        Direct RPC:         ~15ms
  Propagation:   ~500ms          Parallel all legs:  ~10ms
  ─────────────                  Polygon block:      ~2,000ms
  Total: ~2,650ms                ───────────────────────────
                                 Total: ~2,040ms

Fast wallet submits ALL 4 legs within 30ms → one Polygon block.

Timeline:
  Block N-1: Fast system detects mispricing → submits all legs
  Block N:   All transactions confirm, arbitrage captured
  Block N+1: You copy the trade → you're providing exit liquidity

Minimum threshold used in research: $0.05 profit
  (smaller edges get eaten by gas + sequential fill risk)`}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TAB 8: MATH ELI15 ────────────────────────────────────────
function ThoughtCard({ type, children }) {
  const isWrong = type === "wrong";
  const color = isWrong ? C.red : C.accent;
  return (
    <div style={{ background: color + "0e", border: `1px solid ${color}40`, borderRadius: 6, padding: 14, marginBottom: 10 }}>
      <div style={{ fontSize: 10, color, ...mono, fontWeight: "bold", marginBottom: 6 }}>{isWrong ? "✗  WRONG THOUGHT" : "✓  RIGHT THOUGHT"}</div>
      <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

function MentalModelCard({ title, children }) {
  return (
    <div style={{ background: C.amber + "0e", border: `1px solid ${C.amber}40`, borderRadius: 6, padding: 14, marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 6 }}>🧠  MENTAL MODEL — {title}</div>
      <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

function MathELI15Tab() {
  const [sec, setSec] = useState(0);
  const [revealed, setRevealed] = useState([false, false, false]);

  const navItems = [
    { icon: "🏆", label: "The $40M Puzzle" },
    { icon: "🔗", label: "Linked Markets" },
    { icon: "🗺", label: "The Valid Zone" },
    { icon: "🔍", label: "Smart Searching" },
    { icon: "📐", label: "Probability Shape" },
    { icon: "🔄", label: "Iterative Trick" },
    { icon: "⚡", label: "Speed Race" },
  ];

  return (
    <div>
      <div style={card}>
        <div style={h2style}>The Math Article — Explained Like You Are 15</div>
        <p style={pstyle}>No jargon. No intimidation. Real-world examples, right vs wrong thinking, and mental models that make the math click. Every major concept in Roan's Polymarket math article — built from scratch.</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {navItems.map((item, i) => (
            <Btn key={i} active={sec === i} onClick={() => setSec(i)}>{item.icon} {item.label}</Btn>
          ))}
        </div>
      </div>

      {sec === 0 && (
        <div>
          <div style={card}>
            <div style={h2style}>The $40M Puzzle</div>
            <p style={pstyle}>From April 2024 to April 2025, a small group of people quietly extracted <span style={{ color: C.accent }}>$39.7 million in guaranteed profit</span> from a prediction market called Polymarket. Not lucky guesses. Not inside information. <em>Mathematical certainty</em>.</p>
            <p style={pstyle}>The single best trader made <span style={{ color: C.accent }}>$2,009,631</span> from just 4,049 trades. That is $496 average profit per trade, consistently, every day for a year.</p>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 10 }}>First — how does guaranteed profit exist in a betting market at all?</div>
              <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
                Say Polymarket has a market: "Will Man United win today?"<br /><br />
                YES costs $0.40 (market says 40% chance of winning)<br />
                NO costs $0.45 (market says 45% chance of losing)<br /><br />
                You spend $0.85 to buy BOTH. Exactly one pays out $1.00.<br /><br />
                <span style={{ color: C.accent }}>Guaranteed profit: $0.15 on $0.85 spent = 17.6%. Zero risk.</span><br />
                <span style={{ color: C.muted }}>This works because YES + NO must equal exactly $1.00 in any fair market.</span>
              </div>
            </div>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 10 }}>OK — so why does not everyone do this?</div>
              <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
                The simple version (YES + NO is not $1 on a single market) gets corrected in seconds by other traders.<br /><br />
                The version these quant traders exploited is <em>completely invisible to the human eye</em>.<br />
                It requires checking thousands of logical relationships between dozens of markets at once.<br /><br />
                <span style={{ color: C.accent }}>This article teaches the math that sees what no human can see manually.</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Stat value="$39.7M" label="Extracted in one year by systematic traders" color={C.accent} />
              <Stat value="17,218" label="Market conditions mathematically checked" color={C.blue} />
              <Stat value="40%" label="Average mispricing found — markets wrong by this much on average" color={C.amber} />
            </div>
          </div>
        </div>
      )}

      {sec === 1 && (
        <div>
          <div style={card}>
            <div style={h2style}>Linked Markets — The Invisible Connection</div>
            <ThoughtCard type="wrong">Each betting market is independent. YES + NO = $1 on each one. No arbitrage. Done.</ThoughtCard>
            <ThoughtCard type="right">Some markets are LOGICALLY connected. If Event B can only happen when Event A already happened, you cannot price them as if they were separate. That link is invisible to simple addition — but fully exploitable with the right math.</ThoughtCard>
            <MentalModelCard title="The Grandfather Problem">
              {"If someone is your grandfather, they are ALSO your ancestor. You cannot independently price 'probability X is your grandfather' and 'probability X is your ancestor' — one logically forces the other. Prediction markets have exactly this kind of hidden family tree between events. Most traders never see it."}
            </MentalModelCard>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 10 }}>World Cup Example:</div>
              <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
                Market A: "Will Brazil win the World Cup?" — YES: $0.20<br />
                Market B: "Will Brazil win their group stage?" — YES: $0.60<br /><br />
                Each sums to $1. Both look individually fair.<br /><br />
                But notice: <span style={{ color: C.accent }}>if Brazil wins the World Cup, they MUST have won their group.</span><br />
                A = YES forces B = YES. You cannot have A = YES and B = NO. Physically impossible.<br /><br />
                <span style={{ color: C.red }}>Therefore P(WC win) can never be priced above P(group win).</span><br />
                If someone makes that mistake, guaranteed profit exists between the two markets.
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 12 }}>Are these markets logically linked? Click to reveal:</div>
            {[
              { a: "Brazil wins the World Cup", b: "Brazil plays more than 3 matches total", linked: true, reason: "To win the WC you must play 7 matches. Winning the WC (A) forces B to be true. They are linked." },
              { a: "France scores in the final", b: "Argentina scores in the final", linked: false, reason: "Both can independently happen in the same match. Neither forces the other. Not linked." },
              { a: "England finishes top of their group", b: "England reaches the knockout rounds", linked: true, reason: "Finishing top of your group IS reaching the knockout round — they are literally the same event. Completely linked." },
            ].map((pair, i) => (
              <div key={i} style={{ background: C.code, borderRadius: 6, padding: 14, marginBottom: 8, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.text, ...mono, marginBottom: 10, lineHeight: 1.9 }}>
                  <span style={{ color: C.blue }}>Market A:</span> "{pair.a}"<br />
                  <span style={{ color: C.amber }}>Market B:</span> "{pair.b}"
                </div>
                {!revealed[i] ? (
                  <button onClick={() => setRevealed(prev => prev.map((v, j) => j === i ? true : v))}
                    style={{ padding: "6px 14px", background: C.accent + "20", border: `1px solid ${C.accent}`, color: C.accent, borderRadius: 4, cursor: "pointer", fontSize: 10, ...mono }}>
                    Reveal answer
                  </button>
                ) : (
                  <div style={{ padding: "10px 14px", background: pair.linked ? C.accent + "10" : C.blue + "10", border: `1px solid ${pair.linked ? C.accent : C.blue}40`, borderRadius: 4 }}>
                    <div style={{ fontSize: 11, color: pair.linked ? C.accent : C.blue, ...mono, fontWeight: "bold", marginBottom: 4 }}>
                      {pair.linked ? "LINKED — arbitrage may exist between them" : "NOT LINKED — fully independent markets"}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.6 }}>{pair.reason}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sec === 2 && (
        <div>
          <div style={card}>
            <div style={h2style}>The Valid Zone — What Fair Pricing Actually Means</div>
            <ThoughtCard type="wrong">Fair prices just need to: (1) be between 0 and 1, and (2) sum to 1 per market. If both boxes are checked, no arbitrage exists.</ThoughtCard>
            <ThoughtCard type="right">Fair prices must ALSO respect all logical relationships between linked markets. Think of it as a "valid zone" in price space. If current prices fall outside this zone, guaranteed profit exists equal to the distance outside.</ThoughtCard>
            <MentalModelCard title="Airport Security">
              {"To board a plane, you cannot just be (1) a human and (2) holding a ticket. You also need (3) ID matching the ticket, (4) no banned items, (5) a cleared security check. The valid zone is far more constrained than it first appears. Prediction market prices work identically — more rules than just 'sum to 1'."}
            </MentalModelCard>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 12 }}>Visualizing the Valid Zone for 2 connected World Cup markets:</div>
              <svg viewBox="0 0 320 270" style={{ width: "100%", maxWidth: 340, display: "block", margin: "0 auto" }}>
                <line x1="45" y1="235" x2="295" y2="235" stroke={C.muted} strokeWidth="1" />
                <line x1="45" y1="235" x2="45" y2="25" stroke={C.muted} strokeWidth="1" />
                <text x="170" y="260" fontSize="9" fill={C.muted} textAnchor="middle" fontFamily="monospace">P(Brazil wins World Cup) = x</text>
                <text x="12" y="130" fontSize="9" fill={C.muted} textAnchor="middle" fontFamily="monospace" transform="rotate(-90,12,130)">P(Brazil wins group) = y</text>
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                  const px = 45 + v * 250;
                  const py = 235 - v * 210;
                  return (
                    <g key={i}>
                      <line x1={px} y1="235" x2={px} y2="240" stroke={C.muted} strokeWidth="0.8" />
                      <text x={px} y="252" fontSize="7" fill={C.muted} textAnchor="middle" fontFamily="monospace">{v}</text>
                      <line x1="40" y1={py} x2="45" y2={py} stroke={C.muted} strokeWidth="0.8" />
                      <text x="36" y={py + 3} fontSize="7" fill={C.muted} textAnchor="end" fontFamily="monospace">{v}</text>
                    </g>
                  );
                })}
                <polygon points="45,235 295,235 295,25" fill={C.red + "18"} />
                <polygon points="45,235 295,235 45,25" fill={C.accent + "18"} />
                <line x1="45" y1="235" x2="295" y2="25" stroke={C.blue} strokeWidth="1.5" strokeDasharray="5,3" />
                <text x="205" y="88" fontSize="8" fill={C.blue} fontFamily="monospace">y = x  (boundary)</text>
                <text x="220" y="180" fontSize="9" fill={C.red} textAnchor="middle" fontFamily="monospace">INVALID</text>
                <text x="220" y="193" fontSize="9" fill={C.red} textAnchor="middle" fontFamily="monospace">ZONE ✗</text>
                <text x="78" y="162" fontSize="9" fill={C.accent} textAnchor="middle" fontFamily="monospace">VALID</text>
                <text x="78" y="175" fontSize="9" fill={C.accent} textAnchor="middle" fontFamily="monospace">ZONE ✓</text>
                <circle cx={45 + 0.65 * 250} cy={235 - 0.30 * 210} r="6" fill={C.red} />
                <text x={45 + 0.65 * 250 + 9} y={235 - 0.30 * 210 + 4} fontSize="8" fill={C.red} fontFamily="monospace">current prices</text>
                <circle cx={45 + 0.475 * 250} cy={235 - 0.475 * 210} r="5" fill={C.accent} />
                <text x={45 + 0.475 * 250 - 8} y={235 - 0.475 * 210 - 8} fontSize="8" fill={C.accent} textAnchor="end" fontFamily="monospace">fair prices</text>
                <line x1={45 + 0.65 * 250} y1={235 - 0.30 * 210} x2={45 + 0.475 * 250 + 4} y2={235 - 0.475 * 210 + 3} stroke={C.amber} strokeWidth="1.5" strokeDasharray="3,2" />
                <text x={45 + 0.565 * 250 + 10} y={235 - 0.385 * 210} fontSize="8" fill={C.amber} fontFamily="monospace">profit = gap</text>
              </svg>
              <div style={{ fontSize: 10, color: C.muted, ...mono, marginTop: 12, lineHeight: 1.8 }}>
                <span style={{ color: C.red }}>Red dot</span> = current market prices — outside the valid zone (WC win priced at 65% but group win only at 30%?? Impossible!)<br />
                <span style={{ color: C.accent }}>Green dot</span> = fair prices — the Bregman Projection, closest valid point<br />
                <span style={{ color: C.amber }}>Dashed line</span> = the profit gap = distance from invalid to valid zone
              </div>
            </div>
            <div style={{ background: C.code, padding: 14, borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 8 }}>The math in plain English:</div>
              <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
                Z = all valid "state of the world" outcomes (which events can happen together)<br />
                M = conv(Z) = the convex hull of Z = <span style={{ color: C.accent }}>the valid zone</span><br /><br />
                If current prices are inside M: no arbitrage.<br />
                <span style={{ color: C.accent }}>If current prices are outside M: guaranteed profit. Distance outside = profit size.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {sec === 3 && (
        <div>
          <div style={card}>
            <div style={h2style}>Smart Searching — Integer Programming</div>
            <ThoughtCard type="wrong">{"To find arbitrage in a big tournament, check every possible outcome combination. NCAA had 63 games — that's 2^63 outcomes. Just run it overnight on a fast computer."}</ThoughtCard>
            <ThoughtCard type="right">{"2^63 = 9.2 quintillion combinations. At one billion checks per second, that takes 292 years. Instead, describe what makes an outcome VALID using 3 simple rules. The computer solves those rules in under a second. This is Integer Programming."}</ThoughtCard>
            <MentalModelCard title="The Nightclub Bouncer">
              {"Wrong approach: memorise every face that is allowed in (impossible for billions of people). Right approach: write 3 rules — must be 18 or older, must have valid ID, must not be on the banned list. Run 3 checks per person instead of scanning billions of faces. Integer Programming writes exactly this kind of rule-based checklist for prediction markets."}
            </MentalModelCard>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 10 }}>Real Example: Duke vs Cornell Basketball (NCAA Tournament)</div>
              <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1, marginBottom: 12 }}>
                Each team can win 0 to 6 games. 7 options per team, 2 teams = 14 conditions.<br />
                Brute force: <span style={{ color: C.red }}>2^14 = 16,384 combinations to check.</span><br /><br />
                But one key fact eliminates almost all of them:<br />
                <span style={{ color: C.accent }}>Duke and Cornell cannot BOTH win 5 or more games — they would meet in the semifinals.</span>
              </div>
              <div style={codestyle}>
{`# 3 rules replace 16,384 brute-force checks:

Rule 1: Duke wins exactly one bracket slot
  z(duke,0) + z(duke,1) + ... + z(duke,6) = 1

Rule 2: Cornell wins exactly one bracket slot
  z(cornell,0) + z(cornell,1) + ... + z(cornell,6) = 1

Rule 3: They cannot both reach the semifinals
  z(duke,5) + z(duke,6) + z(cornell,5) + z(cornell,6) <= 1

Gurobi (IP solver) solves all 3 rules in < 1 second.
No brute force. No 292-year wait.`}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {[
                { label: "Brute Force (NCAA 2010)", color: C.red, lines: [["Possible outcomes", "2^63"], ["At 1B checks/sec", "292 YEARS"], ["Feasibility", "Impossible"]] },
                { label: "Integer Programming", color: C.accent, lines: [["Constraints needed", "~100 rules"], ["Solve time (Gurobi)", "< 30 seconds"], ["Feasibility", "Done before lunch"]] },
              ].map((col, i) => (
                <div key={i} style={{ background: "#071018", padding: 14, borderRadius: 4, border: `1px solid ${col.color}38` }}>
                  <div style={{ fontSize: 11, color: col.color, ...mono, fontWeight: "bold", marginBottom: 10 }}>{col.label}</div>
                  {col.lines.map(([k, v], j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, ...mono, padding: "3px 0", color: j === 2 ? col.color : C.text, fontWeight: j === 2 ? "bold" : "normal" }}>
                      <span style={{ color: C.muted }}>{k}</span><span>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: 14, background: C.blue + "0e", border: `1px solid ${C.blue}38`, borderRadius: 6, fontSize: 11, color: C.text, ...mono, lineHeight: 1.8 }}>
              <span style={{ color: C.blue, fontWeight: "bold" }}>Real scale:</span> The 2024 US election had 1,576 dependent market pairs. Brute force would take longer than the universe has existed. Integer Programming solved them all in minutes on one laptop.
            </div>
          </div>
        </div>
      )}

      {sec === 4 && (
        <div>
          <div style={card}>
            <div style={h2style}>Probability Has Shape — Bregman and KL Divergence</div>
            <ThoughtCard type="wrong">To fix mispriced markets, just shift all prices by the same amount until they sum correctly. A 10-cent change is a 10-cent change wherever it happens on the probability scale.</ThoughtCard>
            <ThoughtCard type="right">Probabilities live on a curved surface. Moving from 5% to 15% is a MASSIVE update — you tripled an unlikely event's odds. Moving from 50% to 60% is a minor nudge. You cannot use a flat ruler on a curved surface. The math must respect the curve.</ThoughtCard>
            <MentalModelCard title="The Volume Dial Analogy">
              {"Turning a volume dial from 0 to 10 feels enormous — silence to audible sound. Turning it from 50 to 60 feels minor. The same physical movement, completely different effect. Probability works identically: tiny changes near 0% or 100% carry enormous information. Changes near 50% carry very little. KL Divergence is the measuring tape that knows this and stretches accordingly."}
            </MentalModelCard>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 12 }}>Same 10% change — completely different meaning:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { from: "1%", to: "11%", size: "ENORMOUS", color: C.amber, why: "You went from almost impossible to plausible. A 10x shift in perceived likelihood. This is huge news." },
                  { from: "47%", to: "57%", size: "small", color: C.blue, why: "You went from slight underdog to slight favourite. Almost no change in real strategic terms." },
                  { from: "89%", to: "99%", size: "ENORMOUS", color: C.amber, why: "You went from very likely to virtually certain. Near-certainty is precious and rare information." },
                ].map((ex, i) => (
                  <div key={i} style={{ background: "#071018", padding: 12, borderRadius: 4, border: `1px solid ${ex.color}30` }}>
                    <div style={{ fontSize: 18, color: ex.color, ...mono, fontWeight: "bold", textAlign: "center", marginBottom: 4 }}>{ex.from} → {ex.to}</div>
                    <div style={{ fontSize: 9, color: ex.color, ...mono, textAlign: "center", fontWeight: "bold", marginBottom: 8 }}>{ex.size} change</div>
                    <div style={{ fontSize: 9, color: C.muted, ...mono, lineHeight: 1.6 }}>{ex.why}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C.code, padding: 16, borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 10 }}>What is Bregman Projection in plain terms?</div>
              <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
                When prices are outside the valid zone, you need the <em>closest valid prices</em>. But "closest" must account for the curve of probability space, not flat Euclidean distance.<br /><br />
                <strong style={{ color: C.blue }}>KL Divergence</strong> measures information distance between two sets of probabilities:<br />
                D(μ||θ) = Σ μᵢ · ln(μᵢ / θᵢ)<br /><br />
                Plain English: "How much information do you gain by updating from current (broken) prices θ to fair prices μ?"<br /><br />
                <strong style={{ color: C.accent }}>Bregman Projection</strong> finds the point μ* inside the valid zone with minimum KL distance from θ.<br /><br />
                <span style={{ color: C.accent }}>Profit you can extract = D(μ*||θ). Further outside = bigger profit.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {sec === 5 && (
        <div>
          <div style={card}>
            <div style={h2style}>The Iterative Trick — Frank-Wolfe Algorithm</div>
            <ThoughtCard type="wrong">Now that we know what to compute (Bregman Projection), just give the full problem to a computer. Solve it directly all at once.</ThoughtCard>
            <ThoughtCard type="right">The valid zone has an astronomical number of corners — you cannot enumerate them. Frank-Wolfe says: start anywhere, find the single best next step, take it, repeat. After 50 to 150 steps you have a near-perfect answer without ever needing to see the full zone.</ThoughtCard>
            <MentalModelCard title="Treasure Hunt in the Dark">
              {"Imagine searching for buried treasure in a pitch-black field. You cannot see the whole field. But you carry a detector that says 'treasure is that way'. Wrong approach: visit every square metre of the field. Right approach: stand still, check the detector, take one step toward the warmest signal, repeat. After 100 steps you are very close — without ever mapping the full field. Frank-Wolfe is this detector-guided walk through price space."}
            </MentalModelCard>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 12 }}>The Algorithm as a Story — one loop at a time:</div>
              {[
                { n: "1", color: C.blue, title: "Start simple", body: "Begin with just a handful of known valid tournament scenarios — say, 5 possible bracket outcomes. Compute the best prices for these few scenarios." },
                { n: "2", color: C.blue, title: "Find the worst blind spot", body: "Ask: given our current prices, which one new valid scenario would most improve our answer? Gurobi (the IP solver) finds this scenario in seconds." },
                { n: "3", color: C.accent, title: "Add it to our collection", body: "Include that new scenario. Recompute prices across all scenarios we now know. We have improved." },
                { n: "4", color: C.accent, title: "Measure how close we are", body: "Compute the convergence gap — the maximum possible remaining improvement. If it is tiny, we are done." },
                { n: "5", color: C.amber, title: "Repeat from Step 2", body: "Typically 50 to 150 loops is enough for a near-perfect answer on a real tournament." },
              ].map((step, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 10, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${C.border}30` : "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.color + "30", border: `1px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: step.color, ...mono, fontWeight: "bold", flexShrink: 0 }}>{step.n}</div>
                  <div>
                    <div style={{ fontSize: 11, color: step.color, ...mono, fontWeight: "bold", marginBottom: 4 }}>{step.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.65 }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { phase: "Early games", time: "< 1 sec", note: "Few constraints — solver is very fast", color: C.accent },
                { phase: "Mid-tournament", time: "10–30 sec", note: "More games = harder problem", color: C.amber },
                { phase: "Late tournament (50+ settled)", time: "< 5 sec", note: "Most outcomes resolved — valid zone shrinks, problem gets easy again", color: C.accent },
              ].map((p, i) => (
                <div key={i} style={{ background: C.code, padding: 12, borderRadius: 6, border: `1px solid ${p.color}28` }}>
                  <div style={{ fontSize: 9, color: p.color, ...mono, fontWeight: "bold", marginBottom: 6 }}>{p.phase}</div>
                  <div style={{ fontSize: 20, color: p.color, ...mono, fontWeight: "bold", marginBottom: 4 }}>{p.time}</div>
                  <div style={{ fontSize: 9, color: C.muted, ...mono, lineHeight: 1.6 }}>{p.note}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, background: C.accent + "08", border: `1px solid ${C.accent}38`, borderRadius: 6, fontSize: 11, color: C.text, ...mono, lineHeight: 1.8 }}>
              <span style={{ color: C.accent, fontWeight: "bold" }}>The payoff:</span> After game 45, the Frank-Wolfe system outperforms the simpler linear approach by <span style={{ color: C.accent }}>38% in pricing accuracy</span>. That 38% directly translates to 38% more profit extracted per trade executed.
            </div>
          </div>
        </div>
      )}

      {sec === 6 && (
        <div>
          <div style={card}>
            <div style={h2style}>The Speed Race — Execution is Everything</div>
            <ThoughtCard type="wrong">I found the arbitrage with the math. I will now manually buy both YES and NO and pocket the difference. Easy guaranteed money.</ThoughtCard>
            <ThoughtCard type="right">Polymarket uses a Central Limit Order Book — orders are processed one at a time, not simultaneously. By the time your second order lands, your first order has already shifted the price against you. You need both legs to confirm in the SAME Polygon block or you turn guaranteed profit into a guaranteed loss.</ThoughtCard>
            <MentalModelCard title="Concert Tickets at 10am">
              {"A sold-out show puts 500 tickets on sale at exactly 10:00:00am. Regular fans click 'buy' at 10:00:01am and see 'sold out'. Scalper bots placed orders at 10:00:00.030am — 30 milliseconds after the sale opened. By the time your finger lifts, the bots have bought, repriced, and listed them for $500 each. Prediction market arbitrage is identical — not seconds, milliseconds."}
            </MentalModelCard>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 10 }}>Why Manual Trading Fails Even When the Math is Perfect:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#071018", padding: 14, borderRadius: 4, border: `1px solid ${C.red}38` }}>
                  <div style={{ fontSize: 11, color: C.red, ...mono, fontWeight: "bold", marginBottom: 8 }}>The Plan</div>
                  <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
                    Buy YES at $0.30 ✓<br />
                    Buy NO at $0.30 (next)<br />
                    Total cost: $0.60<br />
                    Payout: $1.00<br />
                    <span style={{ color: C.accent }}>Profit: $0.40</span>
                  </div>
                </div>
                <div style={{ background: "#071018", padding: 14, borderRadius: 4, border: `1px solid ${C.amber}38` }}>
                  <div style={{ fontSize: 11, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 8 }}>What Actually Happens</div>
                  <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
                    Buy YES at $0.30 ✓ fills<br />
                    Your order shifts the price<br />
                    NO now costs $0.78<br />
                    Total cost: $1.08<br />
                    <span style={{ color: C.red }}>Loss: $0.08</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 12 }}>The Blockchain Timeline — Why You Are Always 4 Seconds Too Late:</div>
              {[
                { block: "Block N-1", color: C.accent, text: "The fast system detects mispricing. All legs submitted simultaneously within 30ms via direct RPC — bypassing the slow public API. Orders land in the mempool together." },
                { block: "Block N", color: C.accent, text: "All transactions confirm together on Polygon. Arbitrage captured. Market has already repriced. This transaction is now visible on-chain to anyone watching." },
                { block: "Block N+1", color: C.red, text: "You see Block N's trade and try to copy it. You are buying at the new repriced level. You are not capturing arbitrage — you are providing exit liquidity for the fast system that already won." },
              ].map((b, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "82px 1fr", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border}30` : "none" }}>
                  <div style={{ color: b.color, fontSize: 11, ...mono, fontWeight: "bold" }}>{b.block}</div>
                  <div style={{ color: b.block === "Block N+1" ? C.red : C.text, fontSize: 11, ...mono, lineHeight: 1.7 }}>{b.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div style={{ background: C.code, padding: 14, borderRadius: 6, border: `1px solid ${C.red}30` }}>
                <div style={{ fontSize: 11, color: C.red, ...mono, fontWeight: "bold", marginBottom: 10 }}>You — manual trading</div>
                {[["Spot the opportunity", "~10,000ms"], ["Open the app", "~2,000ms"], ["Click YES", "~500ms"], ["Click NO", "~500ms"], ["Polygon block wait", "~2,000ms"], ["Total", "~15,000ms"]].map(([step, time], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, color: i === 5 ? C.red : C.text, fontWeight: i === 5 ? "bold" : "normal", ...mono }}>
                    <span style={{ color: i === 5 ? C.red : C.muted }}>{step}</span><span>{time}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: C.code, padding: 14, borderRadius: 6, border: `1px solid ${C.accent}30` }}>
                <div style={{ fontSize: 11, color: C.accent, ...mono, fontWeight: "bold", marginBottom: 10 }}>Sophisticated system</div>
                {[["WebSocket price feed", "<5ms"], ["Decision (pre-calc)", "<10ms"], ["Direct RPC submit", "~15ms"], ["All legs in parallel", "~10ms"], ["Polygon block wait", "~2,000ms"], ["Total", "~2,040ms"]].map(([step, time], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, color: i === 5 ? C.accent : C.text, fontWeight: i === 5 ? "bold" : "normal", ...mono }}>
                    <span style={{ color: i === 5 ? C.accent : C.muted }}>{step}</span><span>{time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, background: C.accent + "08", border: `1px solid ${C.accent}38`, borderRadius: 6, fontSize: 12, color: C.text, ...mono, lineHeight: 2.1 }}>
              <span style={{ color: C.accent, fontWeight: "bold" }}>The punchline:</span> The top trader made $2M in one year from 4,049 trades. Not from predicting outcomes. Not from luck. From having math that finds invisible price violations, computation that calculates the optimal trade in seconds, and infrastructure that executes every leg in the same blockchain block. <span style={{ color: C.accent }}>All three layers are required. Drop any one of them and the edge disappears entirely.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TAB 7: RESULTS ───────────────────────────────────────────
function ResultsTab() {
  const rows = [
    { rank: 1, config: "TP=20¢ SL=10¢", filter: "moderate_fav", trades: 241, win: 71.8, pnl: 2770.29, roi: 135.1 },
    { rank: 2, config: "TP=20¢ SL=10¢", filter: "fav_75_80", trades: 146, win: 69.2, pnl: 1358.83, roi: 119.2 },
    { rank: 3, config: "TP=20¢ SL=10¢", filter: "fav_75_100", trades: 351, win: 64.7, pnl: 3900.98, roi: 117.0 },
    { rank: 4, config: "TP=20¢ SL=10¢", filter: "fav_80_100", trades: 205, win: 61.5, pnl: 2542.15, roi: 115.8 },
    { rank: 5, config: "TP=20¢ SL=10¢", filter: "heavy_fav", trades: 110, win: 49.1, pnl: 1130.69, roi: 88.0 },
    { rank: 7, config: "TP=20¢ SL=10¢", filter: "slight_fav", trades: 525, win: 69.7, pnl: 3255.56, roi: 81.6 },
    { rank: 11, config: "TP=20¢ SL=10¢", filter: "ALL", trades: 1601, win: 61.6, pnl: 10890.95, roi: 68.9 },
  ];

  return (
    <div>
      <div style={card}>
        <div style={h2style}>Backtest results — top configurations by ROI</div>
        <p style={pstyle}>Backtested on historical football shock data. The key finding: <span style={{ color: C.accent }}>filtering to moderate_fav</span> (teams priced 75–85¢ pre-shock) delivers 135% ROI on 241 trades vs 69% for the ALL filter. Tuning your bucket matters enormously.</p>
        <div style={{ overflowX: "auto", marginTop: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, ...mono }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["#", "Config", "Filter", "Trades", "Win%", "P&L", "ROI"].map(h => <th key={h} style={{ padding: "8px 12px", color: C.muted, textAlign: "left", fontWeight: "normal" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}20`, background: i === 0 ? C.accent + "07" : "transparent" }}>
                  <td style={{ padding: "9px 12px", color: C.muted }}>{row.rank}</td>
                  <td style={{ padding: "9px 12px", color: C.text }}>{row.config}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ padding: "2px 8px", background: row.filter === "moderate_fav" ? C.accent + "20" : C.code, border: `1px solid ${row.filter === "moderate_fav" ? C.accent : C.border}`, color: row.filter === "moderate_fav" ? C.accent : C.text, borderRadius: 3, fontSize: 10 }}>{row.filter}</span>
                  </td>
                  <td style={{ padding: "9px 12px", color: C.text }}>{row.trades}</td>
                  <td style={{ padding: "9px 12px", color: row.win >= 65 ? C.accent : C.text }}>{row.win}%</td>
                  <td style={{ padding: "9px 12px", color: C.accent }}>${row.pnl.toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", color: row.roi >= 100 ? C.accent : C.text, fontWeight: row.roi >= 100 ? "bold" : "normal" }}>{row.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: 12, background: C.accent + "08", border: `1px solid ${C.accent}38`, borderRadius: 6, fontSize: 11, color: C.text, ...mono, lineHeight: 1.8 }}>
          <span style={{ color: C.accent }}>Key finding:</span> moderate_fav + TP=20¢/SL=10¢ → 135.1% ROI. The ALL bucket (1,601 trades) has the most absolute P&L ($10,890) but far lower ROI (68.9%). Backtest aggressively before June 11 kickoff to find your highest-ROI bucket combinations.
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>The 4 bot components</div>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            { n: "01", title: "Data ingestion layer", color: C.blue, desc: "Pulls and cleans historical + live trade data from the Dome API (acquired by Polymarket, Feb 2026). Provides full historical order book snapshots, candlestick data, and trade history across both Polymarket and Kalshi through a single integration." },
            { n: "02", title: "Distribution builder", color: C.amber, desc: "Processes every historical football shock into bucket percentile tables (P50/P75/P90/P95). Runs once before the tournament starts and updates as more matches are played. This is the lookup engine all live decisions are based on." },
            { n: "03", title: "Live shock detector", color: C.red, desc: "Runs the 2-minute sliding window logic in real time across all active World Cup markets simultaneously. When a shock threshold is breached, triggers the classification pipeline and fires the order placement sequence." },
            { n: "04", title: "Execution layer", color: C.accent, desc: "Places and manages the 4 laddered limit orders. Monitors fills, fires exit orders at the +4¢ recovery target, cancels unfilled orders after 60 seconds, and tracks running P&L across the entire tournament." },
          ].map((c) => (
            <div key={c.n} style={{ display: "grid", gridTemplateColumns: "38px 1fr", gap: 14, background: C.code, padding: 16, borderRadius: 6, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 20, color: c.color, fontWeight: "bold", ...mono }}>{c.n}</div>
              <div>
                <div style={{ fontSize: 12, color: c.color, ...mono, fontWeight: "bold", marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>Resources</div>
        <div style={{ display: "grid", gap: 7 }}>
          {[
            { label: "Data API", v: "Dome API — acquired by Polymarket, Feb 2026", c: C.accent },
            { label: "World Cup kickoff", v: "June 11, 2026 — 5 days from now", c: C.red },
            { label: "Roan's bot repo", v: "GitHub — DM @RohOnChain on X to access", c: C.blue },
            { label: "Strategy paper", v: "arXiv:2508.03474v1 — 'Unravelling the Probabilistic Forest'", c: C.blue },
            { label: "Theory paper", v: "arXiv:1606.02825v2 — 'Arbitrage-Free Combinatorial Market Making'", c: C.blue },
            { label: "IP Solver", v: "Gurobi Optimizer (used in the research)", c: C.amber },
            { label: "LLM for dependencies", v: "DeepSeek-R1-Distill-Qwen-32B  →  81.45% accuracy on election markets", c: C.amber },
            { label: "Blockchain data", v: "Alchemy Polygon API  ·  contract 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045", c: C.muted },
          ].map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, padding: "8px 12px", background: C.code, borderRadius: 4, fontSize: 11 }}>
              <div style={{ color: r.c, ...mono }}>{r.label}</div>
              <div style={{ color: C.muted, ...mono }}>{r.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, border: `1px solid ${C.amber}40`, background: C.amber + "05" }}>
        <div style={h2style}>The open question Roan leaves with you</div>
        <p style={{ ...pstyle, fontSize: 13, lineHeight: 1.9 }}>The entire edge comes from the market overreacting to shocks, then recovering. But during the World Cup, with billions in fresh volume and thousands of new traders flooding in — will overreactions get <span style={{ color: C.red }}>larger</span> (more inexperienced money = more panic), or <span style={{ color: C.accent }}>smaller</span> (more liquidity = faster repricing)? Backtest your data before June 11 and let it answer empirically.</p>
      </div>
    </div>
  );
}

// ── BIMBA ARTICLE DATA ───────────────────────────────────────
const BIMBA_STRATS = [
  { n: 1, name: "Hyper-Sniper", range: "1–10¢", risk: "HIGH", riskColor: C.red, core: "Buy tiny positions on the extreme cheap side. One win at 3,000% covers 50 small losses. The crowd laughs at 1¢ shares. The crowd exits when they resolve at 100¢.", wallet: "mafiosa", walletStats: "4,530 trades · $56.8k profit · 6,500% on BTC Up @ 1.5¢", tool: "Sort markets by lowest ask first." },
  { n: 2, name: "5-Min Window Stack", range: "BTC 5-min candles", risk: "MEDIUM", riskColor: C.amber, core: "Don't bet 'will BTC go up today'. Bet on 5-minute candles. 300 independent windows per day = 300 chances to apply the same edge. Law of large numbers becomes your best friend.", wallet: "0xb55fa1296E6", walletStats: "32,263 trades · $423k profit · 533% on BTC Down @ 15.8¢", tool: "Polymarket + Pyth feed + local script." },
  { n: 3, name: "Mid-Range Doubler", range: "30–55¢", risk: "LOW", riskColor: C.accent, core: "Low stress, high frequency. Buy at 30–55¢, wait 5 minutes, cash 80–150% returns. No 10× dreams, no 0¢ nightmares. Pure volume game.", wallet: "JetFadil", walletStats: "15,718 trades · $161k profit · consistent 100–400% wins on 30–55¢ entries", tool: "Discipline, no emotion, 200+ trades/day." },
  { n: 4, name: "Post-News Fade", range: "NO at 15–25¢", risk: "LOW", riskColor: C.accent, core: "Truth Social ceasefire post? Everyone rushes YES at 80¢. Read the resolution rules — official confirmation required. Buy NO at 20¢. Wait 3 days. Print.", wallet: "strike123 (Resolution Exploit)", walletStats: "948,406 shares of NO at 33¢ · MicroStrategy deadline passed · NO wins", tool: "Read resolution rules before every entry." },
  { n: 5, name: "Underdog Multi-Sport", range: "15–35¢", risk: "MEDIUM", riskColor: C.amber, core: "NCAA basketball, tennis qualifiers, NHL overs, UFC prelims. The crowd overweights favorites. Buy the dog at 15–35¢. One upset = 3–5×. Spread across 10 sports = 10 chances per night.", wallet: "ferrariChampions2026", walletStats: "16,757 trades · $2.4M profit · 426% on Strickland @ 19¢ · 1,335% on Angels @ 6¢", tool: "Polymarket sports page + nightly calendar scan." },
  { n: 6, name: "Whale-Track Copy", range: "90%+ win wallets", risk: "MEDIUM", riskColor: C.amber, core: "Find wallets with 90%+ win rate over 5k settled trades. Copy their timing — not their PnL. When a bot buys 1,500 shares at 8¢, buy right behind it. Free alpha.", wallet: "JewishNinja", walletStats: "7 trades · $2M profit · 426% on UFC underdog · copied by hundreds", tool: "On-chain explorer + Polycool / PolyTrack." },
  { n: 7, name: "Resolution Rule Exploit", range: "YES or NO", risk: "LOW", riskColor: C.accent, core: "'Will MicroStrategy sell Bitcoin by May 31?' — news came after the deadline. NO wins. Buy NO at 30¢ when everyone panics. Always read the fine print before a market closes.", wallet: "strike123", walletStats: "948,406 shares of NO at 33¢ and winning", tool: "Read every market's resolution rules completely." },
  { n: 8, name: "Weather Range Strip", range: "Adjacent temp brackets", risk: "LOW", riskColor: C.accent, core: "Don't bet 'Seoul high = 25°C exactly'. Buy 23°, 24°, 25°, 26° same size. One hits, pays 3–5×, rest expire worthless. Net +10% with near-zero directional risk.", wallet: "Anonymous weather bot", walletStats: "Consistent profits from temperature range markets · minimal variance", tool: "Weather markets on Polymarket — surprisingly inefficient." },
  { n: 9, name: "Event-Clustering Combo", range: "Cross-sport nights", risk: "HIGH", riskColor: C.red, core: "UFC main card + NBA playoff + CS2 major same night. Your edges are correlated. If underdogs win in one sport, public sentiment shifts. Front-run the next market.", wallet: "0x9a13cf1b3aa7", walletStats: "BIG vs NRG CS2: BIG from 0–12 to 16–12 · BIG at 1–2¢ = 50–100× for early buyers", tool: "Multi-screen discipline required." },
  { n: 10, name: "Bot-Hunter Feedback Loop", range: "META STRATEGY", risk: "SYSTEM", riskColor: C.blue, core: "After every trade, log why you entered (price, catalyst, expected win%). Once a week, feed logs to Claude: 'What patterns am I missing?' The bot learns your mistakes faster than you do.", wallet: "Bonereaper", walletStats: "44k trades · $858k profit · perfectly smooth 45° PnL curve", tool: "Obsidian + Claude Code + NotebookLM pipeline." },
];

const BIMBA_VALIDATION = [
  { n: 1, strength: "STRONG", color: C.blue,   title: "Kelly Criterion + Longshot Mispricing in Prediction Markets",     body: "The Kelly Criterion (Bell Labs, 1956) formalised for systematic traders in QuantStart's Money Management article proves high-variance strategies are mathematically valid when edge exists. CEPR research on Kalshi found takers lose ~32% on longshot contracts on average — if you are the better-informed buyer in a structurally mispriced market, the error works in your favour at scale.", sources: ["QuantStart — Money Management via the Kelly Criterion", "CEPR — The Economics of the Kalshi Prediction Market (2025)"], caveat: "Kelly requires accurate edge estimation. Overconfident estimates cause ruin — QuantStart recommends half-Kelly as a practical ceiling." },
  { n: 2, strength: "STRONG", color: C.blue,   title: "Law of Large Numbers + Independent Events",                        body: "The Kelly Criterion math paper (arXiv:2002.03448, Lototsky & Pollok) explicitly shows long-term growth rate g(f) converges via the law of large numbers. 300 independent 5-minute windows create exactly the sample size needed for statistical edge to express reliably. QuantStart's strategy identification guide positions trading frequency as a core lever — higher frequency reduces return volatility when edge is positive.", sources: ["arXiv:2002.03448 — Kelly Criterion: From Random Walk to Lévy Processes", "QuantStart — How to Identify Algorithmic Trading Strategies"], caveat: "Windows must be genuinely independent. BTC price autocorrelation can violate this assumption — test it." },
  { n: 3, strength: "MODERATE", color: C.amber, title: "Market-Making Economics at the 50% Probability Zone",              body: "The 30–55¢ range is the liquid near-50% zone with tightest bid-ask spreads. DeFi Prime (2026) reports Polymarket market makers earned over $20M in 2024 — the mid-range volume game is structurally identical to market-making: capturing the spread repeatedly at scale. QuantStart classifies this as the high-Sharpe, low-volatility income strategy suited for disciplined high-frequency operators.", sources: ["DeFi Prime — Definitive Guide to Polymarket Ecosystem (2026)", "QuantStart — Beginners Guide to Quantitative Trading"], caveat: "200+ trades/day creates significant execution overhead. Not viable without automation." },
  { n: 4, strength: "STRONG", color: C.blue,   title: "Investor Overreaction to News + Prospect Theory",                 body: "Brown (2024) empirically confirms loss-averse investors overreact to pessimistic news (ScienceDirect, 2025). Kahneman & Tversky's Prospect Theory explains asymmetric gain/loss evaluation causing panic-driven mispricings. On Polymarket, this manifests as YES prices spiking on unverified social media posts. The MicroStrategy $60M dispute and Polymarket's 1,150+ disputed markets in 2026 confirm the structural resolution gap Bimba exploits.", sources: ["ScienceDirect — Investigating the Impact of Sentiments on Stock Market (2025)", "The Defiant — $60M Polymarket MicroStrategy Dispute (Jun 2026)"], caveat: "MOOV2 update tightens resolution timelines. Some fades require 2–3 days while capital is locked." },
  { n: 5, strength: "VERY STRONG", color: C.accent, title: "Favorite-Longshot Bias — Most Documented Edge in Betting Research", body: "Whelan (2024, Economica) proves the bias persists in competitive fixed-odds markets. Ottaviani & Sørensen (AEJ Microeconomics) attribute it to gambler disagreement and bookmaker risk aversion. ScienceDirect evidence from NCAA basketball and college football shows heavy favorites yield near-zero returns while underdogs offer positive expected value before transaction costs. CEPR Kalshi data: takers lose 32% on average on longshot contracts.", sources: ["Whelan — Risk Aversion and Favourite-Longshot Bias, Economica 2024", "ScienceDirect — Favorite-Longshot Bias in NCAA Basketball & Football", "CEPR — Economics of Kalshi Prediction Market (2025)"], caveat: "Transaction costs compress the edge. Exploitable primarily with tight execution and sufficient sample size (10+ sport events per night)." },
  { n: 6, strength: "MODERATE", color: C.amber, title: "Smart Money Following — Empirically Real but Survivorship-Biased",  body: "A study on 43 Hyperliquid whale addresses (124,838 trades, Aug–Nov 2025) found that copying all whale trades without discrimination yields a 61.5% win rate. Polymarket-specific analysis shows many apparent whale win rates are inflated by survivorship bias — true settled-trade win rates fall to 55–62%. Polycool data reports top 0.5% of wallets at 57.9–73% win rates and $11k–$75k+ PnL. Timing-copy outperforms PnL-copy.", sources: ["Medium — ML Analysis of Whale Trading on Hyperliquid: 61.5% win rate (Nov 2025)", "Polymarket Whale Tracking Guide — Survivorship Bias (Mar 2026)"], caveat: "Survivorship bias dominates. Verify 5k+ settled trades (not just open positions) before following any wallet." },
  { n: 7, strength: "STRONG", color: C.blue,   title: "UMA Oracle Resolution Gaps — Growing, Well-Documented",           body: "Polymarket logged 1,150+ disputed markets in 2026, exceeding the full 2025 total (The Defiant). The March 2025 $7M governance attack and $60M MicroStrategy dispute confirm resolution rules are structurally exploitable. UMA's MOOV2 whitelist update (The Block, Aug 2025) acknowledged the problem but did not resolve underlying rule ambiguity — the edge persists.", sources: ["The Defiant — $60M Polymarket Dispute, UMA Oracle on Trial (Jun 2026)", "The Block — UMA MOOV2 Whitelist Update (Aug 2025)", "Orochi Network — $7M Oracle Manipulation Attack (Mar 2025)"], caveat: "Oracle governance attacks can produce incorrect resolutions even when your rule-reading is correct. The $7M Ukraine mineral deal case is a live example." },
  { n: 8, strength: "MODERATE", color: C.amber, title: "Weather Markets: Structural Inefficiency + Options Delta-Neutrality", body: "UMA MOOV2 explicitly identifies weather markets as 'non-contentious' with fewer disputes than political markets (The Block, Aug 2025) — lower institutional attention correlates with pricing inefficiency. The range-strip is structurally identical to options straddle/strangle positioning — a well-documented derivatives risk-management technique formalised in QuantStart's derivatives pricing series.", sources: ["The Block — UMA MOOV2: Weather as Low-Contention Market (Aug 2025)", "QuantStart — Derivatives Pricing I: Black-Scholes Model"], caveat: "Bracket sizing must be precisely calibrated. Over-wide brackets dilute returns by paying for coverage you do not need." },
  { n: 9, strength: "EMERGING", color: C.muted, title: "Cross-Market Sentiment Contagion",                                  body: "Bai et al. (2024) confirm sentiment spillover across global equity markets (MDPI, 2025). At $44B volume in 2025 (DeFi Prime), Polymarket sports events now move enough capital that cross-market sentiment shifts are plausible and detectable. Theoretically sound — but limited empirical validation exists for this specific mechanism in prediction markets.", sources: ["MDPI — News Sentiment and Stock Market Dynamics (Jul 2025)", "DeFi Prime — Polymarket Ecosystem: $44B volume in 2025 (2026)"], caveat: "Least validated strategy in the list. Use Strategy 10's feedback loop to test and quantify your own edge here before scaling." },
  { n: 10, strength: "STRONG", color: C.blue, title: "AI-Augmented Feedback Loop — Foundation of All 9 Strategies",      body: "QuantStart's foundational guide identifies systematic feedback as the core of profitable algorithmic trading. The RL+LLM pipeline (arXiv:2510.10526) outperforms pure technical models in controlled tests. The Polymarket ecosystem now has 170+ tools (DeFi Prime, 2026) built on this premise — AI-assisted analysis is mainstream. Bonereaper's 44k trades / $858k / 45° PnL curve is the empirical output of this methodology applied consistently.", sources: ["QuantStart — Beginners Guide to Quantitative Trading", "arXiv:2510.10526 — Integrating LLMs and RL for Sentiment Trading (2025)", "DeFi Prime — Definitive Guide to Polymarket Ecosystem (2026)"], caveat: "Only as good as trade log quality. Vague entry rationales ('felt right') produce no usable patterns." },
];

// ── BIMBA SECTION COMPONENTS ─────────────────────────────────
function BimbaOverviewTab() {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>About the author</div>
        <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.amber + "30", border: `2px solid ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>B</div>
            <div>
              <div style={{ fontSize: 13, color: C.text, ...mono, fontWeight: "bold" }}>Bimba <span style={{ color: C.muted, fontWeight: "normal" }}>(@BimbaCrypto)</span></div>
              <div style={{ fontSize: 11, color: C.muted, ...mono, marginTop: 6, lineHeight: 1.75 }}>Systematic Polymarket trader. Works with Claude + BTC 5-min windows, sports underdogs, and UFC snipes. Publicly tracks wallets and results. Emphasises systematic extraction over news-based speculation.</div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Stat value="55% → 82%" label="Hit rate after implementing all 10 strategies" color={C.accent} />
          <Stat value="3×" label="Average win size increase after the firmware upgrade" color={C.amber} />
          <Stat value="45° curve" label="PnL shape — was heartbeat, now staircase" color={C.blue} />
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>What this article is</div>
        <p style={pstyle}>This is not a list of tips. It is a <span style={{ color: C.accent }}>mental firmware upgrade</span> — a complete operating system for treating Polymarket as a systematic extraction machine rather than a news-betting site. The 10 strategies exist on a deliberate spectrum.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Pure execution plays", items: ["#1  Hyper-Sniper (1–10¢)", "#2  5-Min Window Stack", "#3  Mid-Range Doubler"], color: C.red },
            { label: "Information edge plays", items: ["#4  Post-News Fade", "#5  Underdog Multi-Sport Stack", "#6  Whale-Track Copy"], color: C.amber },
            { label: "Structure exploits", items: ["#7  Resolution Rule Exploit", "#8  Weather Range Strip", "#9  Event-Clustering Combo"], color: C.blue },
            { label: "The meta-system", items: ["#10 Bot-Hunter Feedback Loop", "→ ties all 9 strategies together", "→ self-improving every week"], color: C.accent },
          ].map((g, i) => (
            <div key={i} style={{ background: C.code, padding: 12, borderRadius: 6, border: `1px solid ${g.color}28` }}>
              <div style={{ fontSize: 10, color: g.color, ...mono, fontWeight: "bold", marginBottom: 8 }}>{g.label}</div>
              {g.items.map((item, j) => <div key={j} style={{ fontSize: 11, color: C.muted, ...mono, padding: "2px 0" }}>{item}</div>)}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 14, background: C.accent + "08", border: `1px solid ${C.accent}38`, borderRadius: 6, fontSize: 11, color: C.text, ...mono, lineHeight: 1.8 }}>
          <span style={{ color: C.accent, fontWeight: "bold" }}>Key insight:</span> Strategy 10 is what transforms 9 tactics into a system. Without the logging and AI feedback loop, the other strategies are just isolated trades. With it, they compound into a learning machine that improves its own win rate every week.
        </div>
      </div>
    </div>
  );
}

function TenStrategiesTab() {
  const [active, setActive] = useState(0);
  const strat = BIMBA_STRATS[active];
  return (
    <div>
      <div style={card}>
        <div style={h2style}>The 10 strategies</div>
        <p style={pstyle}>Click any strategy card to expand the full breakdown, example wallet, and setup requirements:</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 16 }}>
          {BIMBA_STRATS.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: "9px 6px", background: active === i ? s.riskColor + "22" : C.code,
              border: `1px solid ${active === i ? s.riskColor : C.border}`,
              color: active === i ? s.riskColor : C.muted, borderRadius: 4, cursor: "pointer", fontSize: 9, ...mono, textAlign: "center",
            }}>
              <div style={{ fontWeight: "bold", marginBottom: 3 }}>#{s.n}</div>
              <div style={{ fontSize: 8, lineHeight: 1.4 }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
            </button>
          ))}
        </div>

        <div style={{ background: C.code, border: `1px solid ${strat.riskColor}`, borderRadius: 8, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 24, color: strat.riskColor, fontWeight: "bold", ...mono }}>#{strat.n}</div>
            <div>
              <div style={{ fontSize: 15, color: strat.riskColor, ...mono, fontWeight: "bold" }}>{strat.name}</div>
              <div style={{ fontSize: 10, color: C.muted, ...mono }}>{strat.range}</div>
            </div>
            <span style={{ marginLeft: "auto", padding: "2px 8px", background: strat.riskColor + "20", border: `1px solid ${strat.riskColor}40`, borderRadius: 2, fontSize: 9, color: strat.riskColor, ...mono }}>{strat.risk}</span>
          </div>

          <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 1.85, marginBottom: 16, padding: "12px 14px", background: "#071018", borderRadius: 4, borderLeft: `2px solid ${strat.riskColor}` }}>
            {strat.core}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 12, background: "#071018", borderRadius: 4 }}>
              <div style={{ fontSize: 9, color: C.muted, ...mono, marginBottom: 6 }}>EXAMPLE WALLET / PROFILE</div>
              <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 4 }}>{strat.wallet}</div>
              <div style={{ fontSize: 10, color: C.muted, ...mono, lineHeight: 1.6 }}>{strat.walletStats}</div>
            </div>
            <div style={{ padding: 12, background: "#071018", borderRadius: 4 }}>
              <div style={{ fontSize: 9, color: C.muted, ...mono, marginBottom: 6 }}>SETUP / TOOL</div>
              <div style={{ fontSize: 11, color: C.text, ...mono, lineHeight: 1.65 }}>{strat.tool}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BimbaValidationTab() {
  const [active, setActive] = useState(0);
  const v = BIMBA_VALIDATION[active];
  const SC = { "VERY STRONG": C.accent, "STRONG": C.blue, "MODERATE": C.amber, "EMERGING": C.muted };
  const sc = SC[v.strength] || C.muted;
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Validation analysis</div>
        <p style={pstyle}>Each strategy cross-referenced against peer-reviewed research, QuantStart's systematic trading library, and live Polymarket data. Select a strategy:</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 16 }}>
          {BIMBA_VALIDATION.map((v2, i) => {
            const c = SC[v2.strength] || C.muted;
            return (
              <button key={i} onClick={() => setActive(i)} style={{
                padding: "9px 4px", background: active === i ? c + "18" : C.code,
                border: `1px solid ${active === i ? c : C.border}`, color: active === i ? c : C.muted,
                borderRadius: 4, cursor: "pointer", fontSize: 9, ...mono, textAlign: "center",
              }}>
                <div style={{ fontWeight: "bold", marginBottom: 3 }}>#{v2.n}</div>
                <div style={{ fontSize: 7, color: active === i ? c : C.border, marginTop: 2 }}>{v2.strength}</div>
              </button>
            );
          })}
        </div>

        <div style={{ background: C.code, border: `1px solid ${sc}`, borderRadius: 8, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, color: sc, ...mono, fontWeight: "bold", padding: "3px 9px", background: sc + "18", border: `1px solid ${sc}40`, borderRadius: 2 }}>{v.strength}</span>
            <div style={{ fontSize: 13, color: sc, ...mono, fontWeight: "bold" }}>Strategy #{v.n} — {v.title}</div>
          </div>
          <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 1.85, marginBottom: 16 }}>{v.body}</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: C.muted, ...mono, marginBottom: 8 }}>SOURCES USED:</div>
            <div style={{ display: "grid", gap: 6 }}>
              {v.sources.map((src, i) => (
                <div key={i} style={{ fontSize: 10, color: C.blue, ...mono, padding: "5px 10px", background: C.blue + "0e", border: `1px solid ${C.blue}20`, borderRadius: 3 }}>↗ {src}</div>
              ))}
            </div>
          </div>
          <div style={{ padding: "10px 14px", background: C.amber + "0e", border: `1px solid ${C.amber}38`, borderRadius: 4, fontSize: 11, color: C.amber, ...mono, lineHeight: 1.7 }}>
            <span style={{ fontWeight: "bold" }}>⚠ Caveat:</span> {v.caveat}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>Evidence strength key</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { s: "VERY STRONG", c: C.accent, d: "Multiple peer-reviewed papers with direct replication. Named phenomenon in academic literature (e.g. favorite-longshot bias)." },
            { s: "STRONG", c: C.blue, d: "1–2 quality papers or major data studies directly validating the mechanism. Solid theoretical basis." },
            { s: "MODERATE", c: C.amber, d: "Indirect evidence or theoretical framework supports it. Limited direct Polymarket-specific data." },
            { s: "EMERGING", c: C.muted, d: "Theoretically sound but insufficient empirical data. Requires personal backtesting before scaling capital." },
          ].map((e, i) => (
            <div key={i} style={{ background: C.code, padding: 12, borderRadius: 6, border: `1px solid ${e.c}28` }}>
              <div style={{ fontSize: 10, color: e.c, ...mono, fontWeight: "bold", marginBottom: 6 }}>{e.s}</div>
              <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.6 }}>{e.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BimbaMindTab() {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>The mental firmware</div>
        <p style={pstyle}>Bimba's core framing: <span style={{ color: C.accent }}>stop thinking like a fan, start thinking like an oracle.</span> The 10 strategies are implementations of one operating system — that Polymarket is a venue where systematic thinkers extract value from emotional thinkers at scale and volume.</p>
        <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 0 }}>
          <div style={{ fontSize: 10, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 14 }}>The firmware has 3 core upgrades:</div>
          {[
            { n: "01", title: "Market ≠ Outcome", body: "You are not predicting what will happen. You are identifying where the crowd has mispriced the probability of what will happen. The event is the catalyst. The mispricing is the trade." },
            { n: "02", title: "Rules > News", body: "For 90% of Polymarket disputes, the market resolution rules say something different from what social media suggests. Reading the rules precisely is a separate, learnable skill that most participants skip entirely. It is also the least competitive edge in the list." },
            { n: "03", title: "Volume × Edge > Single Bet", body: "A smooth 45° PnL curve (Bonereaper: 44k trades, $858k) beats a volatile one with the same total return. More trades means the law of large numbers works faster. Strategy 10 — the feedback loop — is what scales the edge over time." },
          ].map((u, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 12, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.border}30` : "none" }}>
              <div style={{ fontSize: 14, color: C.amber, ...mono, fontWeight: "bold" }}>{u.n}</div>
              <div>
                <div style={{ fontSize: 12, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 6 }}>{u.title}</div>
                <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{u.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={h2style}>Bimba vs Roan — Two systematic approaches compared</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, ...mono }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Dimension", "Roan — World Cup Bot", "Bimba — 10 Strategies"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", color: C.muted, textAlign: "left", fontWeight: "normal" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Approach", "Statistical / mathematical", "Empirical / observational"],
                ["Strategy count", "1 deep strategy", "10 parallel strategies"],
                ["Primary edge", "Price shock overreaction", "Multiple structural inefficiencies"],
                ["Data requirement", "Historical distributions required", "Can start immediately"],
                ["Automation level", "Fully automated bot", "Semi-manual to full automation"],
                ["Learning method", "Backtest before deploy", "Live log → Claude feedback"],
                ["Risk profile", "Defined by percentile ladder", "Diversified across 10 plays"],
                ["Best for", "Engineers building systems", "Traders iterating in real time"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}18` }}>
                  <td style={{ padding: "8px 12px", color: C.muted }}>{row[0]}</td>
                  <td style={{ padding: "8px 12px", color: C.accent }}>{row[1]}</td>
                  <td style={{ padding: "8px 12px", color: C.amber }}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: 14, background: C.blue + "0e", border: `1px solid ${C.blue}38`, borderRadius: 6, fontSize: 11, color: C.text, ...mono, lineHeight: 1.8 }}>
          <span style={{ color: C.blue, fontWeight: "bold" }}>Combined view:</span> Roan provides the mathematical foundation for individual trade decisions. Bimba provides the portfolio diversification and feedback infrastructure that makes a trading operation sustainable at scale. A serious systematic Polymarket operation would draw on both frameworks.
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE 3: QUANTSTART BEGINNER'S GUIDE ───────────────────
function QSOverviewTab() {
  const pillars = [
    { n: "01", t: "Strategy Identification", d: "Find a profitable edge. Mean reversion vs momentum. Choose trading frequency and asset class. Build a sourcing pipeline.", c: C.accent },
    { n: "02", t: "Strategy Backtesting", d: "Test on historical data. Eliminate look-ahead bias, survivorship bias, and optimisation bias. Measure Sharpe and max drawdown.", c: C.blue },
    { n: "03", t: "Execution System", d: "Connect to a broker API. Minimise transaction costs: commission + slippage + spread. Automate order placement.", c: C.amber },
    { n: "04", t: "Risk Management", d: "Size positions with the Kelly Criterion. Manage drawdowns. Build a portfolio of uncorrelated strategies.", c: C.red },
  ];
  return (
    <div>
      <div style={card}>
        <div style={h2style}>What quantitative trading actually is</div>
        <p style={pstyle}>Quantitative trading uses mathematical models, statistical analysis, and algorithmic execution to find and exploit market opportunities. Unlike discretionary trading (human gut feel), quant trading relies on systematic, data-driven strategies. No emotion. No feel. Just math.</p>
        <p style={pstyle}>QuantStart's foundational guide defines a complete quant trading system as four tightly connected components. Missing any one breaks the entire chain:</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {pillars.map((p, i) => (
            <div key={i} style={{ background: C.code, padding: 14, borderRadius: 6, border: `1px solid ${p.c}28` }}>
              <div style={{ fontSize: 18, color: p.c, ...mono, fontWeight: "bold", marginBottom: 6 }}>{p.n}</div>
              <div style={{ fontSize: 12, color: p.c, ...mono, fontWeight: "bold", marginBottom: 6 }}>{p.t}</div>
              <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <div style={h2style}>Honest self-assessment questions</div>
        <p style={pstyle}>Algo trading is NOT a get-rich-quick scheme. QuantStart is explicit: failing any of these raises your risk of loss significantly:</p>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { q: "Discipline", d: "Can you not override your algorithm when it is losing? Emotional interference kills systematically profitable strategies." },
            { q: "Ongoing research", d: "Edges decay — most strategies stop working. Ongoing research is the difference between sustained profitability and slow decline." },
            { q: "Capital", d: "Recommended minimum: $50k. Transaction costs rapidly eat smaller accounts, especially for mid-to-high frequency strategies." },
            { q: "Programming", d: "Python, R, or C++ are essential. Python works for LFT. C++ is required for anything approaching HFT execution speeds." },
          ].map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 12, background: C.code, padding: "10px 14px", borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold" }}>{item.q}</div>
              <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.65 }}>{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QSDeepDiveTab() {
  const [sec, setSec] = useState(0);
  return (
    <div>
      <div style={card}>
        <div style={h2style}>The 4 pillars — deep dive</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {["Strategy ID", "Backtesting", "Execution", "Risk Mgmt & Kelly"].map((s, i) => <Btn key={i} active={sec === i} onClick={() => setSec(i)}>{s}</Btn>)}
        </div>
        {sec === 0 && (
          <div>
            <div style={h3style}>Strategy identification</div>
            <p style={pstyle}>The goal is a <em>strategy pipeline</em> — a consistent flow of ideas to evaluate and reject quickly. Two archetypes underlie almost every quant strategy:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {[
                { n: "Mean Reversion", c: C.accent, d: "Prices that deviate from a long-run mean tend to return. Works at short horizons. Core of pairs trading, stat arb, and spread strategies." },
                { n: "Momentum", c: C.amber, d: "Assets that moved up tend to keep moving up (1-12 months). Documented robustly across all asset classes since Jegadeesh & Titman (1993)." },
              ].map((s, i) => (
                <div key={i} style={{ background: C.code, padding: 12, borderRadius: 6, border: `1px solid ${s.c}28` }}>
                  <div style={{ fontSize: 12, color: s.c, ...mono, fontWeight: "bold", marginBottom: 6 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.65 }}>{s.d}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.code, padding: 14, borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 10 }}>Trading frequency spectrum:</div>
              {[
                { name: "LFT", hold: "> 1 day", note: "Accessible to retail with Python. Weekly rebalancing. Lower infra requirements." },
                { name: "HFT", hold: "Intraday", note: "Needs automation. WebSocket + API. Python fine for latency > 100ms." },
                { name: "UHFT", hold: "μs–ms", note: "C++, FPGA, co-location required. Institutional only." },
              ].map((f, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 70px 1fr", gap: 12, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}20` : "none", fontSize: 11, ...mono }}>
                  <span style={{ color: C.blue, fontWeight: "bold" }}>{f.name}</span>
                  <span style={{ color: C.muted }}>{f.hold}</span>
                  <span style={{ color: C.muted }}>{f.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {sec === 1 && (
          <div>
            <div style={h3style}>Strategy backtesting — and its many ways to lie</div>
            <p style={pstyle}>Backtesting tells you how a strategy would have performed historically. Three biases destroy most backtests:</p>
            {[
              { n: "Look-Ahead Bias", c: C.red, d: "Using data that wasn't available at trade time. E.g. using today's closing price to decide what to buy 'at the close'. Your real orders would have executed at unknown prices before the close." },
              { n: "Survivorship Bias", c: C.amber, d: "Testing only on assets still trading today. Dead companies (bankruptcies) are missing. This pre-selects winners and inflates returns by 1-2%+ per year (Elton, Gruber & Blake, 1996)." },
              { n: "Optimisation Bias", c: C.red, d: "Trying 1,000 parameter combinations and picking the best. It worked by luck, not skill. Always test on out-of-sample data the model never saw." },
            ].map((b, i) => (
              <div key={i} style={{ background: C.code, padding: 12, borderRadius: 6, border: `1px solid ${b.c}30`, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: b.c, ...mono, fontWeight: "bold", marginBottom: 6 }}>{b.n}</div>
                <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{b.d}</div>
              </div>
            ))}
            <div style={{ background: C.code, padding: 14, borderRadius: 6, marginTop: 12 }}>
              <div style={{ fontSize: 10, color: C.accent, ...mono, fontWeight: "bold", marginBottom: 8 }}>Key performance metrics:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 11, ...mono }}>
                {[
                  { l: "Sharpe Ratio", v: "(R̄ − Rf) / σ", n: ">1 good. >2 great. >3 suspicious." },
                  { l: "Max Drawdown", v: "Max peak-to-trough %", n: "Worst-case loss. LFT typically higher than HFT." },
                  { l: "Sortino Ratio", v: "(R̄ − Rf) / σ_downside", n: "Only penalises downside volatility." },
                  { l: "Annualised Return", v: "Compound growth rate", n: "Always compare alongside Sharpe — raw return hides risk." },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#071018", padding: 10, borderRadius: 4 }}>
                    <div style={{ color: C.accent, fontWeight: "bold", marginBottom: 3 }}>{m.l}</div>
                    <div style={{ color: C.blue, marginBottom: 3 }}>{m.v}</div>
                    <div style={{ color: C.muted, fontSize: 10 }}>{m.n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {sec === 2 && (
          <div>
            <div style={h3style}>Execution systems</div>
            <p style={pstyle}>A perfect strategy fails with bad execution. Three transaction costs eat your returns:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { n: "Commission", c: C.red, d: "Broker fee per trade. Flat or percentage. Kills high-frequency strategies if not minimised." },
                { n: "Slippage", c: C.amber, d: "Gap between expected fill and actual. Worse in illiquid markets or with large orders." },
                { n: "Spread", c: C.amber, d: "Bid-ask spread — the cost of immediacy. Buying at market = paying the spread instantly." },
              ].map((c, i) => (
                <div key={i} style={{ background: C.code, padding: 12, borderRadius: 6, border: `1px solid ${c.c}28` }}>
                  <div style={{ fontSize: 12, color: c.c, ...mono, fontWeight: "bold", marginBottom: 6 }}>{c.n}</div>
                  <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.65 }}>{c.d}</div>
                </div>
              ))}
            </div>
            <div style={codestyle}>
{`Execution interface spectrum:
  Phone call to broker   → Manual, good for LFT only
  REST API               → Automated, ~50-100ms
  WebSocket              → Real-time push feed, <5ms
  Direct RPC             → Bypass API layer, ~15ms
  Co-location / FPGA     → Microseconds, institutional

For Polymarket specifically (from Roan's article):
  Public Polymarket API  → ~50ms (most retail traders)
  Direct Polygon RPC     → ~15ms (sophisticated systems)
  Parallel all legs      → Same Polygon block = no slippage gap`}
            </div>
          </div>
        )}
        {sec === 3 && (
          <div>
            <div style={h3style}>Risk management — the Kelly Criterion</div>
            <p style={pstyle}>Capital sizing is as important as signal quality. The Kelly Criterion finds the exact fraction of capital to bet on each trade to maximise long-term compounded growth while minimising ruin probability.</p>
            <div style={{ background: C.code, padding: 16, borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: C.accent, ...mono, fontWeight: "bold", marginBottom: 10 }}>Two forms of the Kelly Criterion:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div style={{ background: "#071018", padding: 12, borderRadius: 4 }}>
                  <div style={{ fontSize: 10, color: C.muted, ...mono, marginBottom: 6 }}>BINARY (BETS) — ROAN / BIMBA STYLE</div>
                  <div style={{ fontSize: 16, color: C.accent, ...mono, fontWeight: "bold", marginBottom: 6 }}>f* = (bp − q) / b</div>
                  <div style={{ fontSize: 10, color: C.muted, ...mono, lineHeight: 1.6 }}>b = win odds, p = win prob, q = 1−p</div>
                </div>
                <div style={{ background: "#071018", padding: 12, borderRadius: 4 }}>
                  <div style={{ fontSize: 10, color: C.muted, ...mono, marginBottom: 6 }}>CONTINUOUS (STRATEGY) — QUANTSTART STYLE</div>
                  <div style={{ fontSize: 16, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 6 }}>f* = μ / σ²</div>
                  <div style={{ fontSize: 10, color: C.muted, ...mono, lineHeight: 1.6 }}>μ = mean excess return, σ² = return variance</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 8 }}>Long-term compounded growth rate (QuantStart formula):</div>
              <div style={{ fontSize: 16, color: C.amber, ...mono, textAlign: "center", padding: "6px 0", marginBottom: 10 }}>g = r + S² / 2</div>
              <div style={{ fontSize: 10, color: C.muted, ...mono }}>r = risk-free rate, S = Sharpe Ratio. Higher Sharpe = faster compound growth.</div>
            </div>
            <div style={{ padding: 12, background: C.amber + "0e", border: `1px solid ${C.amber}38`, borderRadius: 6, fontSize: 11, ...mono, lineHeight: 1.7 }}>
              <span style={{ color: C.amber, fontWeight: "bold" }}>QuantStart warning:</span> Kelly is an upper bound, not a target. Use half-Kelly (f*/2) as a practical ceiling. Non-Gaussian real returns mean full Kelly can send account equity to zero.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QSValidationTab() {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Validation — is this solid?</div>
        {[
          { claim: "Sharpe Ratio as the industry-standard risk-adjusted metric", strength: "VERY STRONG", color: C.accent, ev: "Sharpe (1966) introduced the reward-to-variability ratio. Universally adopted since. Every major fund uses Sharpe as a baseline metric. Limitation: assumes normal returns, violated in practice, but remains the universal benchmark." },
          { claim: "Mean reversion and momentum as the two fundamental strategy archetypes", strength: "VERY STRONG", color: C.accent, ev: "Jegadeesh & Titman (1993) documented momentum — one of the most cited finance papers. DeBondt & Thaler (1985) documented mean reversion over 3-5 year horizons. Both appear in every major multi-factor model in use today." },
          { claim: "Survivorship bias inflates historical backtests by 1-2%+ per year", strength: "STRONG", color: C.blue, ev: "Elton, Gruber & Blake (1996) quantified the effect in mutual fund databases. Brown, Goetzmann & Ross (1995) confirmed it in hedge fund data. Standard finding across all empirical finance research." },
          { claim: "Kelly Criterion as optimal long-term capital growth formula", strength: "STRONG", color: C.blue, ev: "Kelly (1956) Bell Labs paper. Thorp (1969) implemented in blackjack, then bond trading. QuantStart explicitly derives g = r + S²/2 showing compounded growth depends directly on the square of the Sharpe Ratio. MacLean, Thorp & Ziemba (2011) extended to multi-strategy portfolios." },
        ].map((v, i) => (
          <div key={i} style={{ background: C.code, padding: 14, borderRadius: 6, border: `1px solid ${v.color}28`, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 9, color: v.color, ...mono, padding: "2px 7px", background: v.color + "18", border: `1px solid ${v.color}40`, borderRadius: 2 }}>{v.strength}</span>
            </div>
            <div style={{ fontSize: 11, color: C.text, ...mono, fontWeight: "bold", marginBottom: 6 }}>{v.claim}</div>
            <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{v.ev}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QSELI15Tab() {
  const [q, setQ] = useState(0);
  const items = [
    { t: "Quant Trading", e: "Instead of 'I feel like Bitcoin is going up today', you write a program that looks at historical data and automatically decides when to buy and sell based entirely on math. No emotion allowed. If the algorithm says sell, you sell." },
    { t: "Backtesting", e: "You cannot test a strategy on the future. So you replay historical prices to see how the strategy would have done. Like a flight simulator — practice without crashing a real plane. The danger: the simulator is not a perfect copy of reality." },
    { t: "Look-Ahead Bias", e: "Imagine predicting yesterday's lottery using today's newspaper. Obvious cheating. In backtesting, it means accidentally using data your strategy could not have known at the moment of the trade. Very common mistake. Completely destroys the validity of the backtest." },
    { t: "Sharpe Ratio", e: "Two taxi drivers both earn $10,000/month. Driver A works 100 steady hours. Driver B works 200 chaotic hours. Driver A has a better Sharpe — same income for less volatility. Sharpe = reward per unit of risk." },
    { t: "Maximum Drawdown", e: "Your account hits $100k then falls to $60k before recovering. Max drawdown = 40%. It answers: what is the worst possible timing someone could have had? Lower MDD = smoother ride for investors." },
    { t: "Kelly Criterion", e: "Flipping a coin that lands heads 60% of the time, winning $1 each time, losing $1 otherwise. Kelly says bet exactly 20% of your money each flip. Bet more and you eventually go broke despite the edge. Bet less and you grow slower than optimal." },
    { t: "Mean Reversion", e: "A rubber band. Stretch it further and further from its resting length, it eventually snaps back. Mean reversion strategies bet that stretched prices will snap back to their long-run average." },
    { t: "Momentum", e: "A boulder rolling downhill keeps rolling, picking up speed. Stocks that have been going up for 6-12 months tend to keep going up next month. Why? Nobody is entirely sure. It works across every market, every decade ever studied." },
    { t: "Slippage", e: "You see Bitcoin at $50,000 and click buy. By the time your order arrives, it has moved to $50,050. That $50 gap is slippage — the market moved before your order could fill. Worse in illiquid markets and with larger orders." },
  ];
  return (
    <div>
      <div style={card}>
        <div style={h2style}>ELI15 — every concept, simply</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {items.map((item, i) => <Btn key={i} active={q === i} onClick={() => setQ(i)}>{item.t}</Btn>)}
        </div>
        <div style={{ background: C.code, padding: 20, borderRadius: 8, border: `1px solid ${C.blue}`, minHeight: 100 }}>
          <div style={{ fontSize: 13, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 12 }}>{items[q].t}</div>
          <div style={{ fontSize: 13, color: C.text, ...mono, lineHeight: 1.85 }}>{items[q].e}</div>
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE 4: ZEN OF QUANT TRADING ──────────────────────────
function ZenOverviewTab() {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>The search for structure</div>
        <p style={pstyle}>Written by IKOS Asset Management ($1.5B quant hedge fund) for The Hedge Fund Journal. Not a tutorial — a philosophy. Central thesis: <span style={{ color: C.accent }}>good algorithmic trading is the search for structure in noisy data.</span></p>
        <p style={pstyle}>The insight most retail traders miss: markets are approximately random, but they fail tests of perfect randomness in subtle, exploitable ways. A quant's job is finding and trading those failures — knowing they are temporary, regime-dependent, and will eventually close.</p>
        <div style={{ background: C.code, padding: 14, borderRadius: 6, marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: C.amber, ...mono, fontWeight: "bold", marginBottom: 10 }}>Three types of structure that actually exist in markets:</div>
          {[
            { t: "Serial dependence — GARCH effect", e: "Big moves tend to follow big moves. You cannot predict direction, but you can predict volatility magnitude. Panic and greed leave markets shaken with bursts of volatility.", c: C.accent },
            { t: "Cross-asset cointegration", e: "Related assets tend to move together over time. Construct a synthetic portfolio that oscillates around a mean — trade the oscillation. The foundation of pairs trading.", c: C.blue },
            { t: "Factor structure", e: "Stock returns can be decomposed into systematic factors (value, momentum, size). The unexplained residual — idiosyncratic return — is where the edge lives.", c: C.amber },
          ].map((s, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border}30` : "none" }}>
              <div style={{ fontSize: 12, color: s.c, ...mono, fontWeight: "bold", marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.65 }}>{s.e}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Stat value="$1.5B" label="IKOS AUM at time of writing" color={C.accent} />
          <Stat value="70+" label="IKOS quant professionals" color={C.blue} />
          <Stat value="7" label="Asset classes: equities, FX, commodities, bonds, rates, indices" color={C.amber} />
        </div>
      </div>
    </div>
  );
}

function ZenConceptsTab() {
  const [sec, setSec] = useState(0);
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Key concepts from the Zen</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {["GARCH", "Cointegration", "Fat Tails", "Overfitting", "Portfolio of Models"].map((s, i) => <Btn key={i} active={sec === i} onClick={() => setSec(i)}>{s}</Btn>)}
        </div>
        {sec === 0 && (
          <div>
            <div style={h3style}>GARCH — volatility clustering</div>
            <p style={pstyle}>GARCH models volatility clustering: big moves follow big moves. The structure is not in the direction — you cannot predict up vs down. The structure is in the <span style={{ color: C.accent }}>magnitude</span>. During high-volatility regimes, reduce position size.</p>
            <div style={codestyle}>
{`GARCH(1,1) — the most common specification:
  variance_t = w + a * shock_sq_(t-1) + b * variance_(t-1)

  shock_sq_(t-1) = last period's squared return (news)
  variance_(t-1) = last period's variance (persistence)
  a + b typically close to 1.0 for financial assets

Interpretation:
  High a = market reacts strongly to new information
  High b = variance is persistent (long memory effect)
  a + b < 1 = variance is mean-reverting (stable model)

IKOS application: use GARCH forecast as a signal for
onset of volatility. Scale position size DOWN when
forecast variance is elevated. Not directional — a
pure risk management tool.`}
            </div>
          </div>
        )}
        {sec === 1 && (
          <div>
            <div style={h3style}>Cointegration — trading a synthetic oscillator</div>
            <p style={pstyle}>Two assets may each follow random walks individually. But if a linear combination of them is stationary (mean-reverting), they are cointegrated. The spread between them oscillates around a mean — that oscillation is tradeable.</p>
            <div style={codestyle}>
{`Classic pairs trading setup (Shell and BP):
  spread_t = log(Shell_price) - b * log(BP_price)

  If spread is cointegrated:
    → spread oscillates around a stable mean
    → spread HIGH: sell Shell, buy BP (Shell overvalued)
    → spread LOW: buy Shell, sell BP (BP overvalued)
    → exit when spread reverts to mean

Testing for cointegration:
  Engle-Granger test: regress X on Y, test residuals
  Johansen test: handles multiple cointegrating relations

IKOS warning: "markets change, the relationships break
down, the sine wave starts moving outside its band."
Always have a stop-loss for structural breaks.`}
            </div>
          </div>
        )}
        {sec === 2 && (
          <div>
            <div style={h3style}>Fat tails — the market is not normal</div>
            <p style={pstyle}>The Gaussian bell curve predicts extreme 5-sigma events almost never happen. In real financial markets they happen far more often. IKOS: <em>"Be prepared for tail risk — that rare but catastrophic event accounting for the fat tails in returns."</em></p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { l: "Normal model predicts", v: "5-sigma event once every ~6,700 years", c: C.muted },
                { l: "Real markets experience", v: "Major crisis roughly every 10-20 years. Fat tails are documented fact.", c: C.red },
                { l: "Practical implication", v: "Never use plain VaR without fat-tail adjustments. Models fitting normal distributions systematically underestimate extreme losses.", c: C.amber },
                { l: "IKOS response", v: "Deleveraging, stop-outs, position limits, tail hedges. Risk management is integral to every good quant model.", c: C.accent },
              ].map((m, i) => (
                <div key={i} style={{ background: C.code, padding: 12, borderRadius: 4, border: `1px solid ${m.c}28` }}>
                  <div style={{ fontSize: 10, color: m.c, ...mono, marginBottom: 6 }}>{m.l}</div>
                  <div style={{ fontSize: 11, color: C.text, ...mono, lineHeight: 1.6 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {sec === 3 && (
          <div>
            <div style={h3style}>Overfitting — the bane of modellers</div>
            <p style={pstyle}>Overfitting occurs when a model is tuned to historical data so precisely that it memorises noise rather than learning genuine structure. IKOS: <em>"Over-parametrisation is the bane of many a model. The more knobs and switches, the more tempting to use them until you have no clear understanding of the source of P&L."</em></p>
            <div style={codestyle}>
{`Signs you have overfit:
  1. Backtest Sharpe > 3.0 (suspicious threshold)
  2. Strategy parameters oddly specific (e.g. exit after 17.3 mins)
  3. Performance collapses immediately in live trading
  4. Works only on specific date ranges

Protections:
  Walk-forward testing: train on first 70%, test on last 30%
  Out-of-sample holdout: never touch until final validation
  Simplicity: fewer parameters = less overfit risk

The uncomfortable truth:
  Bailey et al. (2014) showed most backtested strategies
  are statistically expected to be false discoveries.
  Many 'successful' backtests are pure noise-fitting.`}
            </div>
          </div>
        )}
        {sec === 4 && (
          <div>
            <div style={h3style}>Portfolio of models — how real hedge funds think</div>
            <p style={pstyle}>One good model does not make a hedge fund. IKOS explicitly runs a portfolio of models covering all asset classes, multiple holding periods, and multiple strategy types — chosen for low inter-model correlation.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { d: "By frequency", e: "HFT + daily + weekly models. Each reacts to different market regimes. Drawdowns compensate each other." },
                { d: "By strategy type", e: "Momentum + mean reversion + carry + factor. Anti-correlated during regime changes." },
                { d: "By asset class", e: "Equities + FX + commodities + bonds. Geographic crises affect each differently." },
                { d: "The math payoff", e: "Two Sharpe-1.0 strategies with correlation 0 → combined Sharpe = sqrt(2) ≈ 1.41. Diversification is free risk reduction." },
              ].map((d, i) => (
                <div key={i} style={{ background: C.code, padding: 12, borderRadius: 6, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: C.blue, ...mono, fontWeight: "bold", marginBottom: 4 }}>{d.d}</div>
                  <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.65 }}>{d.e}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ZenValidationTab() {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Validation</div>
        {[
          { claim: "GARCH models capture volatility clustering", strength: "VERY STRONG", color: C.accent, ev: "Engle (1982) introduced ARCH — Nobel Prize 2003. Bollerslev (1986) extended to GARCH. Thousands of papers validate this across equities, FX, and commodities. Volatility clustering is one of the most robustly documented phenomena in quantitative finance." },
          { claim: "Cointegration enables mean-reverting spread construction", strength: "STRONG", color: C.blue, ev: "Engle & Granger (1987) established cointegration theory — Nobel Prize 2003. Gatev, Goetzmann & Rouwenhorst (2006, RFS) documented pairs trading profitability across 50+ years of US equity data. Edge has declined with more capital targeting it, but the mechanism is genuine." },
          { claim: "Financial returns have fat tails (leptokurtosis)", strength: "VERY STRONG", color: C.accent, ev: "Mandelbrot (1963) documented fat tails in cotton prices. Fama (1965) confirmed for stocks. Taleb's systematic treatment in The Black Swan (2007). Now a basic, undisputed empirical fact of financial return distributions." },
          { claim: "Overfitting causes backtest results to collapse in live trading", strength: "STRONG", color: C.blue, ev: "Bailey, Borwein, Lopez de Prado & Zhu (2014) formalised the mathematics of backtest overfitting. Harvey, Liu & Zhu (2016) showed most published financial factors are likely false discoveries from multiple testing. Standard problem in systematic strategy research." },
        ].map((v, i) => (
          <div key={i} style={{ background: C.code, padding: 14, borderRadius: 6, border: `1px solid ${v.color}28`, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 9, color: v.color, ...mono, padding: "2px 7px", background: v.color + "18", border: `1px solid ${v.color}40`, borderRadius: 2 }}>{v.strength}</span>
            </div>
            <div style={{ fontSize: 11, color: C.text, ...mono, fontWeight: "bold", marginBottom: 6 }}>{v.claim}</div>
            <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{v.ev}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZenELI15Tab() {
  const [q, setQ] = useState(0);
  const items = [
    { t: "GARCH / Volatility Clustering", e: "Imagine someone scared and breathing fast. Then they breathe fast the next minute, and the next. That is volatility clustering — being volatile in one period makes you likely to be volatile in the next. GARCH models this so you can predict when to reduce your position size, even when you cannot predict direction." },
    { t: "Cointegration", e: "Shell and BP both drill for oil. Their stock prices wander randomly — but they wander together. If Shell suddenly costs much more than BP relative to history, bet they snap back to their usual relationship. Cointegration is the mathematical proof that the snap will happen, on average." },
    { t: "Fat Tails", e: "Normal bell curves say market crashes should happen less than once per thousand years. Real markets have major crashes every 10-20 years. The distribution of returns has much fatter tails than the model predicts. Any model that ignores this blows up catastrophically in a crisis." },
    { t: "Overfitting", e: "You study exactly the 50 questions from last year's exam — word for word. Score 100% on that exam, 0% on this year's different questions. Overfitting is learning last year's noise instead of the underlying pattern. Your strategy worked only because you memorised historical luck, not because you found an edge." },
    { t: "Alpha vs Beta", e: "Beta is the return you get just for owning the market — anyone can get this by buying an index fund. Alpha is the extra return from skill. Most strategies claiming alpha are actually just leveraged beta in disguise. True alpha is rare, expensive to extract, and decays as more capital targets it." },
    { t: "Carry Trade", e: "Borrow money in Japan at 0.1% interest. Invest it in Australia at 4% interest. Pocket the 3.9% difference every year. Works beautifully for years and years. Then the Yen suddenly surges and you lose everything in one day. That is the carry crash IKOS references — why tail risk management matters even when things feel stable." },
    { t: "Non-Stationarity", e: "A stationary time series has stable statistical properties over time. Financial prices are NOT stationary — they trend, crash, and fundamentally change behaviour. This is why strategies that worked in the 1990s often fail in the 2020s. The market is not the same animal it was." },
    { t: "Portfolio of Models", e: "Ten traders all making the same bet: one bad event wipes everyone out. But if each specialises in different uncorrelated strategies, one strategy's bad day is covered by another's good day. The combined Sharpe is higher than any individual strategy. Diversification is literally free risk reduction." },
  ];
  return (
    <div>
      <div style={card}>
        <div style={h2style}>ELI15 — the Zen, simply</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {items.map((item, i) => <Btn key={i} active={q === i} onClick={() => setQ(i)}>{item.t}</Btn>)}
        </div>
        <div style={{ background: C.code, padding: 20, borderRadius: 8, border: "1px solid #7c3aed", minHeight: 100 }}>
          <div style={{ fontSize: 13, color: "#7c3aed", ...mono, fontWeight: "bold", marginBottom: 12 }}>{items[q].t}</div>
          <div style={{ fontSize: 13, color: C.text, ...mono, lineHeight: 1.85 }}>{items[q].e}</div>
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE 5: 9 QUANT STRATEGIES 2026 (QUANTT) ─────────────
const NINE_STRATS = [
  { n: 1, name: "Statistical Arbitrage",     holding: "Hours–Days",   edge: "Mean reversion of correlated assets",           sharpe: "1.0–2.0",   firms: "Citadel, Two Sigma",           approach: "Cointegration + z-score on spread. Enter when spread deviates beyond 2 std devs, exit at normalisation. Requires Engle-Granger or Johansen cointegration test." },
  { n: 2, name: "Pairs Trading",             holding: "Days–Weeks",   edge: "Cointegration + relative-value reversion",       sharpe: "0.8–1.5",   firms: "Quant hedge funds, prop desks", approach: "Model spread as Ornstein-Uhlenbeck process. Entry on z > 2. Exit at z = 0. Always carry a stop-loss for structural breaks — cointegration can fail permanently." },
  { n: 3, name: "Market Making",             holding: "ms–Seconds",   edge: "Bid-ask spread + inventory management",          sharpe: "3.0–8.0+",  firms: "Optiver, IMC, Jane Street",    approach: "Quote two-sided markets. Earn spread when both sides fill. Manage inventory to avoid directional exposure. Avellaneda-Stoikov model for optimal quotes." },
  { n: 4, name: "Momentum / Trend Follow",   holding: "Weeks–Months", edge: "Persistence of price moves across asset classes", sharpe: "0.5–1.0",   firms: "AHL, Winton, Millburn",        approach: "Go long recent winners, short recent losers. Time-series or cross-sectional momentum. Most robust and well-documented anomaly across all asset classes." },
  { n: 5, name: "Mean Reversion (Equity)",   holding: "Days",         edge: "Short-term overreaction reversal",               sharpe: "0.6–1.2",   firms: "Prop desks, stat arb teams",   approach: "Bollinger Bands or z-score on prices. Order book imbalance signals. Fade extreme overnight gaps at the open. Mean reversion and momentum are not contradictory — different time horizons." },
  { n: 6, name: "Machine Learning Alpha",    holding: "Days–Weeks",   edge: "Pattern detection + feature engineering",         sharpe: "0.5–1.5",   firms: "D.E. Shaw, Two Sigma, Acadian", approach: "Supervised learning on price and alternative data. Walk-forward testing is non-negotiable. Regime detection as a sub-strategy. Gu, Kelly & Xiu (2020) validated the approach academically." },
  { n: 7, name: "Options Volatility",        holding: "Days–Weeks",   edge: "Implied vs realised vol mispricings",             sharpe: "0.8–2.0",   firms: "Susquehanna (SIG), Wolverine", approach: "Trade vol surface mispricings and skew. Core tools: Black-Scholes Greeks, GARCH forecasts, realised vol computation. Implied volatility systematically overstates realised vol." },
  { n: 8, name: "High-Frequency Trading",   holding: "Microseconds",  edge: "Latency advantage + microstructure exploitation", sharpe: "5.0–20.0+", firms: "Virtu Financial, Jump Trading",  approach: "Co-location, FPGA hardware, kernel bypass networking. Strategies: latency arbitrage, market making, order anticipation. Requires direct exchange connectivity and C++ infrastructure." },
  { n: 9, name: "Crypto Quant",             holding: "Variable",      edge: "Funding rates, basis, on-chain inefficiencies",  sharpe: "1.0–3.0+",  firms: "Wintermute, Jump Crypto, GSR", approach: "Perpetual funding rate arbitrage, spot-futures basis, cross-exchange stat arb, on-chain data signals. Crypto markets remain structurally less efficient than TradFi." },
];

function NineOverviewTab() {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>9 quant strategies that actually work in 2026</div>
        <p style={pstyle}>Quantt's comprehensive 2026 guide covers every major systematic trading strategy with realistic Sharpe ratios, edge sources, and which institutional firms run them. Not aspirational — this is what professional quants actually do.</p>
        <div style={{ overflowX: "auto", marginBottom: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, ...mono }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["#", "Strategy", "Hold", "Edge Source", "Sharpe"].map(h => (
                  <th key={h} style={{ padding: "7px 10px", color: C.muted, textAlign: "left", fontWeight: "normal", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NINE_STRATS.map((s, i) => {
                const sp = parseFloat(s.sharpe);
                const sc = sp >= 3 ? C.accent : sp >= 1 ? C.blue : C.amber;
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}18` }}>
                    <td style={{ padding: "7px 10px", color: C.muted }}>{s.n}</td>
                    <td style={{ padding: "7px 10px", color: C.text, fontWeight: "bold" }}>{s.name}</td>
                    <td style={{ padding: "7px 10px", color: C.muted, whiteSpace: "nowrap" }}>{s.holding}</td>
                    <td style={{ padding: "7px 10px", color: C.muted }}>{s.edge}</td>
                    <td style={{ padding: "7px 10px", color: sc, fontWeight: "bold" }}>{s.sharpe}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 14, background: C.red + "0e", border: `1px solid ${C.red}38`, borderRadius: 6, fontSize: 11, ...mono, lineHeight: 1.8 }}>
          <span style={{ color: C.red, fontWeight: "bold" }}>Sharpe reality check:</span> Backtest Sharpe above 3.0 should trigger immediate suspicion of methodology errors. Market Making and HFT's very high Sharpes reflect aggressive leverage on tiny per-trade edges at extreme frequency — not accessible to retail traders without institutional infrastructure.
        </div>
      </div>
    </div>
  );
}

function NineStrategiesTab() {
  const [active, setActive] = useState(0);
  const s = NINE_STRATS[active];
  const sp = parseFloat(s.sharpe);
  const sc = sp >= 3 ? C.accent : sp >= 1 ? C.blue : C.amber;
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Strategy explorer</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 16 }}>
          {NINE_STRATS.map((str, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: "9px 6px", background: active === i ? C.red + "18" : C.code,
              border: `1px solid ${active === i ? C.red : C.border}`,
              color: active === i ? C.red : C.muted, borderRadius: 4, cursor: "pointer", fontSize: 9, ...mono, textAlign: "left",
            }}>
              <div style={{ fontWeight: "bold", marginBottom: 2 }}>#{str.n}</div>
              <div style={{ fontSize: 8, lineHeight: 1.3 }}>{str.name.split(" ").slice(0, 2).join(" ")}</div>
            </button>
          ))}
        </div>
        <div style={{ background: C.code, border: `1px solid ${C.red}`, borderRadius: 8, padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 22, color: C.red, ...mono, fontWeight: "bold" }}>#{s.n}</div>
            <div>
              <div style={{ fontSize: 14, color: C.red, ...mono, fontWeight: "bold" }}>{s.name}</div>
              <div style={{ fontSize: 10, color: C.muted, ...mono }}>{s.holding}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 16, color: sc, ...mono, fontWeight: "bold" }}>{s.sharpe}</div>
              <div style={{ fontSize: 9, color: C.muted, ...mono }}>Sharpe</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[{ l: "Edge source", v: s.edge }, { l: "Key firms", v: s.firms }].map((m, i) => (
              <div key={i} style={{ background: "#071018", padding: 10, borderRadius: 4 }}>
                <div style={{ fontSize: 9, color: C.muted, ...mono, marginBottom: 4 }}>{m.l.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: C.text, ...mono, lineHeight: 1.6 }}>{m.v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 14px", background: "#071018", borderRadius: 4, borderLeft: `2px solid ${C.red}` }}>
            <div style={{ fontSize: 9, color: C.muted, ...mono, marginBottom: 6 }}>APPROACH</div>
            <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 1.8 }}>{s.approach}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NineValidationTab() {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Validation</div>
        {[
          { s: "Statistical Arb & Pairs Trading", str: "STRONG", c: C.blue, e: "Gatev, Goetzmann & Rouwenhorst (2006, Review of Financial Studies) documented pairs trading profitability across 50+ years of US equity data. Cointegration theory: Engle & Granger (1987), Nobel 2003. Profitability has compressed as more capital entered the strategy, but the mechanism is structurally real." },
          { s: "Market Making", str: "VERY STRONG", c: C.accent, e: "Theoretical foundations: Avellaneda & Stoikov (2008) optimal market making model. Glosten & Milgrom (1985) adverse selection. Empirically: Citadel Securities processes ~25% of US retail equity volume. Market makers on Polymarket earned $20M+ in 2024 (DeFi Prime, 2026). The spread capture edge is structural." },
          { s: "Momentum / Trend Following", str: "VERY STRONG", c: C.accent, e: "Jegadeesh & Titman (1993) — most cited finance paper on momentum in equities. Asness, Moskowitz & Pedersen (2013) documented momentum across 8 asset classes over 40+ years. AHL, Winton, Millburn manage billions in pure trend following. Most robust anomaly in academic finance literature." },
          { s: "Machine Learning Alpha", str: "MODERATE", c: C.amber, e: "Gu, Kelly & Xiu (2020, Review of Financial Studies) showed ML models outperform linear factor models in equity return prediction. Actively debated — some argue much ML alpha is overfitting or uncompensated tail risk. Walk-forward testing with held-out data is non-negotiable." },
          { s: "Crypto Quant (Funding Rates)", str: "STRONG", c: C.blue, e: "Perpetual futures funding rates documented as a persistent edge across multiple academic and practitioner studies. Cross-exchange stat arb applies proven equity techniques to a structurally less efficient market. Polymarket ecosystem at $44B volume in 2025 (DeFi Prime) confirms scale of institutional crypto quant activity." },
        ].map((v, i) => (
          <div key={i} style={{ background: C.code, padding: 14, borderRadius: 6, border: `1px solid ${v.c}28`, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 9, color: v.c, ...mono, padding: "2px 7px", background: v.c + "18", border: `1px solid ${v.c}40`, borderRadius: 2 }}>{v.str}</span>
              <div style={{ fontSize: 11, color: v.c, ...mono, fontWeight: "bold" }}>{v.s}</div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{v.e}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NineELI15Tab() {
  const [q, setQ] = useState(0);
  const items = [
    { t: "Statistical Arbitrage", e: "Two stocks usually move together because they share a common driver (like Shell and BP both tracking oil prices). If they suddenly diverge — Shell expensive, BP cheap relative to history — bet they snap back together. Statistical arbitrage is using maths to precisely measure when 'diverged' is unusual enough to trade." },
    { t: "Market Making", e: "You stand in a market and shout: I will buy gold for $999 or sell it for $1,001. Anyone who urgently needs to buy or sell takes your offer. You pocket $2 spread over and over, millions of times a day. The risk: if gold suddenly crashes, the inventory of gold you're holding is now worth less than you paid for it." },
    { t: "Momentum", e: "A train moving fast tends to keep moving fast. Stocks that have been going up for the past 6-12 months tend to continue going up next month. Nobody knows exactly why — possibly slow information diffusion or institutional herding. It works across every asset class, every decade ever studied." },
    { t: "Mean Reversion", e: "Everything has a normal level. Pull a spring down, it snaps back up. Push it up, it snaps back down. Mean reversion bets that prices stretched too far from their average will snap back. Works at short timeframes. Momentum works at long timeframes. Both can be correct simultaneously." },
    { t: "Machine Learning Trading", e: "You give a computer thousands of examples: here is what the market looked like, here is what the price did next. The computer finds patterns too subtle for humans to notice. The danger: it might be learning patterns that were pure luck in the past and will not repeat in the future. Walk-forward testing is your only protection." },
    { t: "Options Volatility", e: "An option's price depends on how volatile the market expects an asset to be. If the market thinks Apple will be very volatile over the next month (high implied volatility) but you think it won't be (low realised volatility), you sell expensive options and profit if you are right. The edge: implied vol historically overstates realised vol." },
    { t: "HFT", e: "Two traders both want to buy the same stock. Whoever sends their order 0.00001 seconds faster wins. HFT firms spend millions on faster computers, shorter cables, and servers physically located inside exchange data centres — just to win this race by microseconds. The edge is latency, not prediction." },
    { t: "Crypto Funding Rates", e: "On crypto exchanges you can bet on Bitcoin's future price without owning Bitcoin. To keep these perpetual futures prices aligned with the real price, a funding rate is paid between long and short traders every 8 hours. When funding is very high, shorts effectively earn a yield just by holding their position against longs." },
    { t: "Sharpe Reality Check", e: "A backtest Sharpe of 2.0 is genuinely excellent. Most retail strategies manage 0.5 to 1.0. Anything above 3.0 in a backtest almost certainly has look-ahead bias, survivorship bias, or overfitting. Real-world live Sharpe is almost always lower than the backtest figure — sometimes dramatically lower." },
  ];
  return (
    <div>
      <div style={card}>
        <div style={h2style}>ELI15 — all 9 strategies, simply</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {items.map((item, i) => <Btn key={i} active={q === i} onClick={() => setQ(i)}>{item.t}</Btn>)}
        </div>
        <div style={{ background: C.code, padding: 20, borderRadius: 8, border: `1px solid ${C.red}`, minHeight: 100 }}>
          <div style={{ fontSize: 13, color: C.red, ...mono, fontWeight: "bold", marginBottom: 12 }}>{items[q].t}</div>
          <div style={{ fontSize: 13, color: C.text, ...mono, lineHeight: 1.85 }}>{items[q].e}</div>
        </div>
      </div>
    </div>
  );
}

// ── GLOSSARY DATA ─────────────────────────────────────────────
const GLOSSARY_ENTRIES = [
  { sym: "α", name: "Alpha", cat: "greek", def: "Excess return above the market benchmark", eli: "Market returned 10%, your strategy returned 15% — your alpha is 5%. It is the bonus return from skill above what the market gave everyone for free. Most strategies claiming alpha are actually leveraged beta in disguise." },
  { sym: "β", name: "Beta", cat: "greek", def: "Sensitivity of an asset to market movements", eli: "β=1 means you move exactly with the market. β=2 means a 10% market drop causes a 20% drop in your portfolio. β=0 means completely uncorrelated. Market-neutral strategies target β≈0." },
  { sym: "σ", name: "Sigma (lowercase)", cat: "greek", def: "Standard deviation — measure of spread and volatility", eli: "How wild the swings are. σ=5% is calm. σ=30% is chaotic. In Black-Scholes, σ is the key unknown — the implied volatility traders estimate and dispute." },
  { sym: "μ", name: "Mu", cat: "greek", def: "Mean / expected value of a distribution", eli: "The average. If trades return 5¢, 7¢, 3¢, 9¢ the μ = 6¢. The drift term μ in Geometric Brownian Motion is the average direction a price tends to move over time." },
  { sym: "λ", name: "Lambda", cat: "greek", def: "Rate parameter in Poisson processes and exponential decay", eli: "If λ=2 shocks per minute, you expect 2 price shocks per minute on average. Describes how often rare events happen — used in HFT to model order arrival rates." },
  { sym: "ε", name: "Epsilon", cat: "greek", def: "Error term / residual in regression models", eli: "The noise your model cannot explain. You want ε to be random (white noise), not patterned. Patterned residuals mean your model is systematically missing something important." },
  { sym: "γ", name: "Gamma", cat: "greek", def: "Rate of change of Delta with respect to the underlying price", eli: "Delta tells you how an option price moves per $1 stock move. Gamma tells you how fast delta itself changes. High gamma = delta unstable = risky for market makers holding large option books." },
  { sym: "Δ", name: "Delta", cat: "greek", def: "Change in option price per $1 change in the underlying asset", eli: "A call with Δ=0.5 gains $0.50 when the stock rises $1. Deep in-the-money options: Δ≈1. Far out-of-the-money options: Δ≈0. Also used as a unit: being long 500 deltas means exposure equivalent to owning 500 shares." },
  { sym: "θ", name: "Theta", cat: "greek", def: "Rate of option time decay per day", eli: "Options get cheaper every day just from the passage of time, all else equal. θ=−5 means the option loses $5 in value per day. Option sellers collect theta. Option buyers fight it. Decay accelerates approaching expiry." },
  { sym: "ρ", name: "Rho", cat: "greek", def: "Correlation coefficient / options interest rate sensitivity", eli: "ρ=1 means perfect lockstep movement. ρ=−1 means perfect opposites. ρ=0 means no relationship. Diversification works because portfolio assets rarely have ρ=1 — the combined volatility is less than the sum of parts." },
  { sym: "Σ", name: "Sigma (capital)", cat: "math", def: "Summation — add all terms in a series", eli: "Σᵢ xᵢ = x₁ + x₂ + x₃ + ... Just shorthand for add up all of these. Appears in expected value, variance, Sharpe ratio — almost every formula in quantitative finance." },
  { sym: "∂", name: "Partial Derivative", cat: "math", def: "Rate of change with respect to one variable while others are held constant", eli: "In Black-Scholes, ∂C/∂S is Delta — how the option price changes when the stock price changes (holding time, volatility, etc. constant). The Greeks are all partial derivatives of the option price formula." },
  { sym: "∫", name: "Integral", cat: "math", def: "Continuous summation — the area under a curve", eli: "Used in continuous-time finance to sum infinitely many infinitely small steps. The probability that a stock price ends below $100 is the integral of the price distribution from 0 to 100." },
  { sym: "E[X]", name: "Expected Value", cat: "stats", def: "Average outcome over many independent trials", eli: "Trade makes $10 with 60% chance and loses $5 with 40% chance: E[X] = 0.6×10 + 0.4×(−5) = $4. That is your average profit per trade over thousands of executions. The foundation of Kelly Criterion sizing." },
  { sym: "Var(X)", name: "Variance", cat: "stats", def: "Average squared deviation from the mean", eli: "Var=0 means all outcomes identical. Large Var means highly unpredictable results. σ=√Var is more intuitive because it is in the same units as X. Portfolio diversification reduces the combined Var below the sum of individual variances." },
  { sym: "Cov(X,Y)", name: "Covariance", cat: "stats", def: "How two variables move together", eli: "Positive Cov: when X rises, Y tends to rise. Negative Cov: they tend to move in opposite directions. Divide by σ_X × σ_Y to get the correlation ρ, bounded between −1 and +1." },
  { sym: "P(A|B)", name: "Conditional Probability", cat: "stats", def: "Probability of A given that B has already occurred", eli: "P(rain | dark clouds) is higher than P(rain) unconditionally. In Roan's shock strategy: P(price recovers | shock > 15%) — conditioning on the shock having already occurred is the entire edge." },
  { sym: "N(μ,σ²)", name: "Normal Distribution", cat: "stats", def: "Bell curve with mean μ and variance σ²", eli: "Most outcomes cluster around the centre μ. Rare outcomes in the tails. Financial returns are approximately normal but with far fatter tails in reality — the basis of the fat tail problem that GARCH and the Zen article address." },
  { sym: "iid", name: "Independent & Identically Distributed", cat: "stats", def: "Each observation is a fresh independent draw from the same distribution", eli: "If BTC 5-minute windows are iid, yesterday has zero influence on today. Required for the Law of Large Numbers to work — which is the foundation of Bimba's 300-windows-per-day strategy having a valid statistical edge." },
  { sym: "CLT", name: "Central Limit Theorem", cat: "stats", def: "Average of many iid variables approaches a normal distribution regardless of underlying distribution", eli: "Flip a biased coin 1,000 times. The average number of heads will be approximately normally distributed even if individual flips are not. This is why enough trades turns edge into reliable, predictable income." },
  { sym: "Sharpe", name: "Sharpe Ratio", cat: "finance", def: "(R̄ − Rf) / σR — excess return per unit of volatility", eli: "How much extra return you earn per unit of risk. Above 1 is good. Above 2 is great. Above 3 in a backtest means check for bias. Negative means losing money while taking risk. The universal fund performance benchmark." },
  { sym: "Sortino", name: "Sortino Ratio", cat: "finance", def: "(R̄ − Rf) / σ_downside — only penalises downside volatility", eli: "Better than Sharpe for asymmetric strategies. If your wins are occasionally large but losses are small and consistent, Sortino credits this properly. Sharpe unfairly penalises upside spikes." },
  { sym: "MDD", name: "Maximum Drawdown", cat: "finance", def: "Largest peak-to-trough % decline in portfolio value", eli: "Account hits $100k, drops to $60k, then recovers → MDD = 40%. It is the worst possible outcome for someone who invested at the peak and sold at the trough. Lower MDD = smoother ride for investors." },
  { sym: "PnL", name: "Profit and Loss", cat: "finance", def: "Actual money made or lost on trades", eli: "Buy at 30¢, sell at 40¢ → PnL = +10¢. Buy at 30¢, sell at 20¢ → PnL = −10¢. Running PnL total = your equity curve. Roan's exit target in the World Cup strategy = +4¢ from the fill price." },
  { sym: "VWAP", name: "Volume Weighted Average Price", cat: "finance", def: "Average price weighted by trade volume at each level", eli: "1,000 shares traded at $10 and 100 shares at $11 → VWAP = $10.09. More weight to prices where more trading occurred. HFT benchmark: did we beat VWAP? Used as a standard execution quality measure." },
  { sym: "LOB / CLOB", name: "Limit Order Book / Central Limit Order Book", cat: "finance", def: "Queue of all pending buy and sell orders at each price level", eli: "Left side: buyers willing to pay 30¢, 29¢, 28¢. Right side: sellers asking 31¢, 32¢, 33¢. The gap between best bid and best ask is the spread. Market orders consume the nearest limit orders immediately." },
  { sym: "Rf", name: "Risk-Free Rate", cat: "finance", def: "Return on a zero-risk investment (typically 3-month US T-bills)", eli: "The baseline you compare everything against. If the risk-free rate is 5% and your strategy returns 5%, you earned nothing extra for taking risk. Every strategy must beat Rf to justify its existence." },
  { sym: "AUM", name: "Assets Under Management", cat: "finance", def: "Total market value of assets managed by a fund", eli: "Renaissance Technologies AUM ≈ $130B. A starting quant fund might manage $5M. Bigger AUM means strategies must be adapted for market impact — what works at $1M often breaks at $1B." },
  { sym: "HFT / LFT", name: "High / Low Frequency Trading", cat: "finance", def: "Classification of trading by holding period and execution speed", eli: "HFT = milliseconds to minutes — needs co-location, FPGA, C++. LFT = days to months — accessible to retail traders with Python. Different infra requirements, Sharpe profiles, and edge sources." },
  { sym: "f*=(bp−q)/b", name: "Kelly Criterion (Binary)", cat: "formula", def: "Optimal fraction of capital to bet on a positive-edge binary trade", eli: "b = win odds, p = win probability, q = 1−p. 60% win chance, 2:1 odds → f* = (2×0.6−0.4)/2 = 40%. Most practitioners use half-Kelly (20%) to account for edge estimation errors. Over-Kelly causes ruin even with a positive edge." },
  { sym: "f*=μ/σ²", name: "Kelly Criterion (Continuous)", cat: "formula", def: "Optimal fraction of capital to allocate to a continuous return strategy", eli: "μ = mean excess return, σ² = variance of returns. Used for strategy-level sizing rather than bet-level sizing. The growth rate formula g = r + S²/2 (from QuantStart) shows compounded growth depends directly on the square of the Sharpe ratio." },
  { sym: "S=(R̄−Rf)/σ", name: "Sharpe Ratio Formula", cat: "formula", def: "Risk-adjusted return: excess return divided by standard deviation", eli: "R̄=15%, Rf=5%, σ=10% → Sharpe=1.0. Same 15% return with σ=5% → Sharpe=2.0. Same return, smoother ride = better Sharpe. Answers: how much risk did you take to earn this return?" },
  { sym: "D(μ||θ)=Σμln(μ/θ)", name: "KL Divergence (Bregman)", cat: "formula", def: "Information-theoretic distance between two probability distributions", eli: "Used in Roan's Polymarket arbitrage article. Measures how wrong current market prices (θ) are compared to fair prices (μ). Zero = perfectly fair. Large value = large guaranteed arbitrage profit available. The correct distance metric for probability distributions." },
  { sym: "dS=μSdt+σSdW", name: "Geometric Brownian Motion", cat: "formula", def: "Standard stochastic model for asset price evolution", eli: "Asset price drifts upward at rate μ while experiencing random shocks σ·dW. This is what Black-Scholes assumes. The randomness is why you cannot predict individual prices — but the structure of the randomness is what GARCH exploits." },
  { sym: "z=(x−μ)/σ", name: "Z-Score", cat: "formula", def: "Number of standard deviations a value is from its mean", eli: "z=2 means unusually high but not extreme. z=3 is very rare. In pairs trading, enter when z > 2 (spread unusually stretched) and exit at z = 0. In Roan's strategy, the shock detector is essentially checking that the z-score of the price drop is extreme enough to warrant an entry." },
  { sym: "C=SN(d₁)−Ke^(−rT)N(d₂)", name: "Black-Scholes Call Price", cat: "formula", def: "Fair value formula for a European call option", eli: "C = call price. S = stock price now. K = strike price. T = time to expiry. r = risk-free rate. N(d) = cumulative normal probability. Every variable is observable except σ (volatility). So traders back-solve for σ from observed option prices — that is implied volatility." },
];

// ── GLOSSARY COMPONENTS ───────────────────────────────────────
function GlossaryHomeTab() {
  const [query, setQuery] = useState("");
  const [catF, setCatF] = useState("all");
  const catColors = { greek: C.blue, math: "#a78bfa", stats: C.accent, finance: C.amber, formula: C.red };
  const cats = [
    { id: "all",     label: "All" },
    { id: "greek",   label: "Greek Letters" },
    { id: "math",    label: "Math Notation" },
    { id: "stats",   label: "Statistics" },
    { id: "finance", label: "Finance" },
    { id: "formula", label: "Key Formulas" },
  ];
  const filtered = GLOSSARY_ENTRIES.filter(e => {
    const q = query.toLowerCase();
    const mQ = !q || e.sym.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.def.toLowerCase().includes(q) || e.eli.toLowerCase().includes(q);
    return mQ && (catF === "all" || e.cat === catF);
  });
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Search all symbols and formulas</div>
        <p style={pstyle}>Every symbol, metric, and formula used across the library — with plain-English ELI15 explanations. Search by name, symbol, or concept. Use the category filters to narrow down:</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", background: C.code, padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}` }}>
          <span style={{ color: C.muted, fontSize: 13 }}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search — e.g. sigma, sharpe, kelly, z-score..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 12, fontFamily: "monospace" }} />
          {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13 }}>✕</button>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {cats.map(c => <Btn key={c.id} active={catF === c.id} color={catColors[c.id] || C.accent} onClick={() => setCatF(c.id)}>{c.label}</Btn>)}
        </div>
        <div style={{ fontSize: 10, color: C.muted, ...mono, marginBottom: 12 }}>{filtered.length} of {GLOSSARY_ENTRIES.length} entries</div>
        <div style={{ display: "grid", gap: 8 }}>
          {filtered.map((entry, i) => {
            const cc = catColors[entry.cat] || C.text;
            return (
              <div key={i} style={{ background: C.code, borderRadius: 6, padding: "14px 16px", border: `1px solid ${cc}18`, display: "grid", gridTemplateColumns: "60px 150px 1fr", gap: 14, alignItems: "start" }}>
                <div style={{ fontSize: 22, color: cc, ...mono, fontWeight: "bold", textAlign: "center", paddingTop: 2 }}>{entry.sym}</div>
                <div>
                  <div style={{ fontSize: 12, color: C.text, ...mono, fontWeight: "bold", marginBottom: 5 }}>{entry.name}</div>
                  <span style={{ fontSize: 9, color: cc, ...mono, padding: "2px 6px", background: cc + "18", border: `1px solid ${cc}30`, borderRadius: 2 }}>{entry.cat}</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 8, lineHeight: 1.5 }}>{entry.def}</div>
                  <div style={{ fontSize: 11, color: C.text + "cc", ...mono, lineHeight: 1.7, borderLeft: `2px solid ${cc}40`, paddingLeft: 10 }}>{entry.eli}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GlossaryFormulasTab() {
  const formulas = GLOSSARY_ENTRIES.filter(e => e.cat === "formula");
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Core formulas reference card</div>
        <p style={pstyle}>The most important equations in quant trading — fully explained. These appear throughout every article in the library. Read this once and you will never need to stop mid-article to look something up.</p>
        {formulas.map((f, i) => (
          <div key={i} style={{ background: C.code, padding: 18, borderRadius: 6, marginBottom: 14, border: "1px solid #a78bfa28" }}>
            <div style={{ fontSize: 18, color: "#a78bfa", ...mono, fontWeight: "bold", marginBottom: 10, borderBottom: `1px solid ${C.border}30`, paddingBottom: 10 }}>{f.sym}</div>
            <div style={{ fontSize: 13, color: C.text, ...mono, fontWeight: "bold", marginBottom: 4 }}>{f.name}</div>
            <div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 12 }}>{f.def}</div>
            <div style={{ fontSize: 12, color: C.text, ...mono, lineHeight: 1.8, padding: "12px 16px", background: "#071018", borderRadius: 4, borderLeft: "2px solid #a78bfa" }}>{f.eli}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlossaryGreekTab() {
  const entries = GLOSSARY_ENTRIES.filter(e => e.cat === "greek");
  const catColor = C.blue;
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Greek letters — the alphabet of quant trading</div>
        <p style={pstyle}>Greek letters appear constantly in finance and statistics. They have precise meanings. Here they all are:</p>
        <div style={{ display: "grid", gap: 8 }}>
          {entries.map((e, i) => (
            <div key={i} style={{ background: C.code, borderRadius: 6, padding: "14px 16px", border: `1px solid ${catColor}18`, display: "grid", gridTemplateColumns: "60px 150px 1fr", gap: 14, alignItems: "start" }}>
              <div style={{ fontSize: 28, color: catColor, ...mono, fontWeight: "bold", textAlign: "center" }}>{e.sym}</div>
              <div>
                <div style={{ fontSize: 12, color: C.text, ...mono, fontWeight: "bold", marginBottom: 4 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: C.muted, ...mono }}>{e.def}</div>
              </div>
              <div style={{ fontSize: 11, color: C.text + "cc", ...mono, lineHeight: 1.7, borderLeft: `2px solid ${catColor}40`, paddingLeft: 10 }}>{e.eli}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── GENERIC TEMPLATE COMPONENTS (used by all 10 new articles) ─
function GenericOverview({ what, why, when: whenUse, stats = [], keyFacts = [], color = C.accent }) {
  return (
    <div>
      <div style={card}>
        <div style={h2style}>What this is</div>
        <p style={pstyle}>{what}</p>
        {whenUse && (
          <div style={{ background: C.code, padding: 14, borderRadius: 6, marginBottom: 14 }}>
            <div style={{ fontSize: 10, color, ...mono, fontWeight: "bold", marginBottom: 8 }}>WHEN TO USE IT</div>
            <p style={{ ...pstyle, marginBottom: 0 }}>{whenUse}</p>
          </div>
        )}
        {why && (
          <div style={{ padding: 14, background: color + "0e", border: `1px solid ${color}38`, borderRadius: 6, marginBottom: 14 }}>
            <div style={{ fontSize: 10, color, ...mono, fontWeight: "bold", marginBottom: 6 }}>WHY IT MATTERS FOR TRADING</div>
            <p style={{ ...pstyle, marginBottom: 0 }}>{why}</p>
          </div>
        )}
        {stats.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`, gap: 12 }}>
            {stats.map((s, i) => <Stat key={i} value={s.value} label={s.label} color={s.color || color} />)}
          </div>
        )}
      </div>
      {keyFacts.length > 0 && (
        <div style={card}>
          <div style={h2style}>Key facts</div>
          <div style={{ display: "grid", gap: 8 }}>
            {keyFacts.map((f, i) => (
              <div key={i} style={{ background: C.code, padding: "10px 14px", borderRadius: 4, fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7, borderLeft: `2px solid ${color}60` }}>{f}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GenericDeepDive({ sections = [], color = C.accent }) {
  const [active, setActive] = useState(0);
  const sec = sections[active] || {};
  return (
    <div>
      <div style={card}>
        <div style={h2style}>The model — deep dive</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {sections.map((s, i) => <Btn key={i} active={active === i} color={color} onClick={() => setActive(i)}>{s.title}</Btn>)}
        </div>
        <div style={{ background: C.code, borderRadius: 8, padding: 20, border: `1px solid ${color}40` }}>
          <div style={h3style}>{sec.title}</div>
          {sec.body && <p style={pstyle}>{sec.body}</p>}
          {sec.bullets && (
            <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
              {sec.bullets.map((b, i) => (
                <div key={i} style={{ fontSize: 11, color: C.text, ...mono, lineHeight: 1.7, padding: "6px 10px", background: "#071018", borderRadius: 3, borderLeft: `2px solid ${color}50` }}>{b}</div>
              ))}
            </div>
          )}
          {sec.code && <div style={codestyle}>{sec.code}</div>}
          {sec.body2 && <p style={{ ...pstyle, marginTop: 10, marginBottom: 0 }}>{sec.body2}</p>}
        </div>
      </div>
    </div>
  );
}

function GenericValidation({ entries = [], color = C.accent }) {
  const SC = { "VERY STRONG": C.accent, "STRONG": C.blue, "MODERATE": C.amber, "EMERGING": C.muted };
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Validation — is this solid?</div>
        {entries.map((v, i) => {
          const vc = SC[v.strength] || C.muted;
          return (
            <div key={i} style={{ background: C.code, padding: 14, borderRadius: 6, border: `1px solid ${vc}28`, marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 9, color: vc, ...mono, padding: "2px 7px", background: vc + "18", border: `1px solid ${vc}40`, borderRadius: 2 }}>{v.strength}</span>
              </div>
              <div style={{ fontSize: 11, color: C.text, ...mono, fontWeight: "bold", marginBottom: 6 }}>{v.claim}</div>
              <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.7 }}>{v.evidence}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GenericELI15({ items = [], color = C.accent }) {
  const [q, setQ] = useState(0);
  const item = items[q] || { term: "", eli: "" };
  return (
    <div>
      <div style={card}>
        <div style={h2style}>ELI15 — every concept, simply</div>
        <p style={pstyle}>Click any term to see it explained without jargon:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {items.map((it, i) => <Btn key={i} active={q === i} color={color} onClick={() => setQ(i)}>{it.term}</Btn>)}
        </div>
        <div style={{ background: C.code, padding: 20, borderRadius: 8, border: `1px solid ${color}`, minHeight: 100 }}>
          <div style={{ fontSize: 14, color, ...mono, fontWeight: "bold", marginBottom: 12 }}>{item.term}</div>
          <div style={{ fontSize: 13, color: C.text, ...mono, lineHeight: 1.85 }}>{item.eli}</div>
        </div>
      </div>
    </div>
  );
}

// ── GENERIC MENTAL MODEL COMPONENT ───────────────────────────
function GenericMentalModel({ models = [], color = C.accent }) {
  const [active, setActive] = useState(0);
  const m = models[active] || {};
  return (
    <div>
      <div style={card}>
        <div style={h2style}>Mental models</div>
        <p style={pstyle}>The right analogy makes a concept stick permanently. Master these and you will never need to look the definition up again:</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {models.map((mm, i) => <Btn key={i} active={active === i} color={color} onClick={() => setActive(i)}>{mm.icon} {mm.title}</Btn>)}
        </div>
        <div style={{ background: C.code, padding: 22, borderRadius: 8, border: `1px solid ${color}`, minHeight: 130 }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
          <div style={{ fontSize: 14, color, ...mono, fontWeight: "bold", marginBottom: 12 }}>{m.title}</div>
          <div style={{ fontSize: 13, color: C.text, ...mono, lineHeight: 1.85, marginBottom: m.insight ? 14 : 0 }}>{m.body}</div>
          {m.insight && (
            <div style={{ padding: "10px 14px", background: color + "10", border: `1px solid ${color}30`, borderRadius: 4, fontSize: 11, color, ...mono, lineHeight: 1.7 }}>
              💡 Key insight: {m.insight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE DATA OBJECTS ──────────────────────────────────────
const OU_DATA = {
  overview: {
    color: C.accent,
    what: "The Ornstein-Uhlenbeck (OU) process is a mean-reverting stochastic process — it models systems pulled back toward a long-run equilibrium value. Originally from physics (1930), it became the foundational model for pairs trading spreads, interest rate dynamics, and volatility modelling. The spread between two cointegrated assets is typically modelled as an OU process.",
    why: "Pairs trading and spread strategies rely on the spread being genuinely mean-reverting. The OU process gives you three quantifiable outputs: confirmation that mean reversion exists, the half-life of reversion (expected holding period), and the exact entry/exit thresholds based on historical spread behaviour.",
    when: "Use it whenever you believe a time series has a natural equilibrium it returns to: pairs spreads, yield curve spreads, volatility indices, basis between spot and futures contracts.",
    stats: [{ value: "1930", label: "Ornstein & Uhlenbeck original paper" }, { value: "ln(2)/θ", label: "Formula for half-life of mean reversion" }, { value: "θ, μ, σ", label: "Three interpretable parameters: speed, mean, noise" }],
    keyFacts: [
      "SDE: dX_t = θ(μ − X_t)dt + σdW_t — θ is mean reversion speed, μ is long-run mean, σ is noise volatility.",
      "The process is stationary — it has a stable long-run distribution: N(μ, σ²/2θ). Unlike a random walk, variance does not grow without bound.",
      "Half-life = ln(2)/θ. If θ=0.2 then half-life ≈ 3.5 days. This is your expected trade holding period.",
      "The OU process is the continuous-time limit of an AR(1) process — the connection to ARMA time series models.",
      "Used as the basis for the Vasicek interest rate model, the CIR model, and the Heston stochastic volatility model.",
    ],
  },
  deepdive: {
    color: C.accent,
    sections: [
      {
        title: "The SDE & Simulation",
        body: "Three parameters define the OU process completely. θ controls the pull strength back to the mean. μ is the equilibrium. σ is the magnitude of random noise. The discrete-time Euler-Maruyama approximation makes simulation straightforward.",
        code: `# OU SDE:  dX = theta*(mu - X)*dt + sigma*dW

import numpy as np

def simulate_ou(theta, mu, sigma, X0, dt, n_steps):
    X = np.zeros(n_steps)
    X[0] = X0
    for t in range(1, n_steps):
        dW = np.random.normal(0, np.sqrt(dt))
        X[t] = X[t-1] + theta*(mu - X[t-1])*dt + sigma*dW
    return X

# Exact solution (more accurate for larger dt):
# X[t] = X[t-1]*exp(-theta*dt) + mu*(1-exp(-theta*dt))
#         + sigma*sqrt((1-exp(-2*theta*dt))/(2*theta)) * Z

# Half-life calculation:
half_life = np.log(2) / 0.2  # theta=0.2 => HL=3.5 years
# For daily data with dt=1/252: theta=0.2 => HL≈3.5 days`,
      },
      {
        title: "Parameter Estimation",
        body: "Fit the OU parameters from real price data using the AR(1) regression (the discrete-time equivalent). OLS gives you θ, μ, σ, and the half-life directly from the regression output.",
        code: `# OLS estimation: regress X_t on X_{t-1}
import statsmodels.api as sm

def estimate_ou_ols(X, dt=1/252):
    model = sm.OLS(X[1:], sm.add_constant(X[:-1])).fit()
    a, b = model.params            # intercept, AR coefficient
    theta = -np.log(b) / dt
    mu    = a / (1 - b)
    sigma_eps = np.std(model.resid)
    sigma = sigma_eps * np.sqrt(-2*np.log(b) / (dt*(1-b**2)))
    half_life = np.log(2) / theta
    return {"theta": theta, "mu": mu, "sigma": sigma,
            "half_life": half_life}`,
      },
      {
        title: "Pairs Trading Signal",
        body: "Compute the spread between two cointegrated assets. Estimate OU parameters. Enter when z-score of spread exceeds 2σ. Exit at z=0. The half-life tells you the expected trade duration.",
        code: `def pairs_signal(spread, window=60):
    params = estimate_ou_ols(spread[-window:])
    mu, sigma = params["mu"], params["sigma"]
    z = (spread[-1] - mu) / sigma

    if z > 2.0:   return -1, z   # Short spread
    elif z < -2.0: return +1, z  # Long spread
    elif abs(z) < 0.5: return 0, z  # Close position
    return None, z  # Hold current position`,
      },
    ],
  },
  mentalModels: [
    { icon: "🐕", title: "Dog on a Leash", body: "Imagine a dog walking with its owner on a long leash. The dog can wander ahead or lag behind, but whenever it strays too far the leash pulls it back. The OU process is that mathematical leash — it models anything that has a natural equilibrium it is always being pulled toward. The spread between Shell and BP is the dog. Economic fundamentals are the owner.", insight: "The further the spread from equilibrium, the stronger the pull back. This is why extreme z-scores are the best entry points." },
    { icon: "🌡️", title: "Room Temperature Analogy", body: "A room with the thermostat set to 22°C. Open a window in winter — it gets cold. The heater kicks in harder. Open a window in summer — it gets warm. The AC kicks in. The temperature always pulls back toward 22°C. θ is how powerful the heating/cooling system is. σ is how drafty the building is.", insight: "θ (mean reversion speed) is the thermostat. You want it strong enough to close your trade within your desired timeframe, but the noise (σ) has to be small enough relative to θ to actually trade profitably." },
    { icon: "📏", title: "The Trading Implication", body: "Half-life = ln(2)/θ. If the half-life is 3 days, you expect the trade to be halfway resolved in 3 days and 90% resolved in about 10 days. This tells you: (1) your minimum position holding period, (2) how much capital will be tied up, (3) whether the transaction costs are worth paying given the speed of reversion.", insight: "Never take an OU trade without checking the half-life. A half-life of 200 days means your capital is locked up for months." },
  ],
  validation: [
    { claim: "OU process is the standard model for mean-reverting spread dynamics in statistical arbitrage", strength: "VERY STRONG", evidence: "Ornstein & Uhlenbeck (1930) original physics paper. Vasicek (1977) applied OU to interest rate modelling. Gatev, Goetzmann & Rouwenhorst (2006, RFS) showed pairs trading is profitable — their spreads follow OU dynamics. Chan (2012) uses OU parameter estimation throughout 'Algorithmic Trading'." },
    { claim: "Half-life formula ln(2)/θ gives the correct expected holding period for a pairs trade", strength: "STRONG", evidence: "Derived directly from the continuous-time OU SDE. The half-life is the time for the expected deviation to reduce by 50%. Chan (2012) uses this formula throughout his pairs trading examples. Standard in any systematic pairs trading implementation." },
  ],
  eli15: [
    { term: "Ornstein-Uhlenbeck Process", eli: "A dog on a leash. The dog can wander left or right, but the leash always pulls it back. The OU process is the math behind any system that has a 'home position' it tends to return to — like the spread between two related stocks." },
    { term: "θ — Mean Reversion Speed", eli: "How strong is the leash? θ=5 means the spread snaps back to the mean in days. θ=0.1 means it drifts for months. Higher θ = faster trades, more opportunities per year, but smaller per-trade profit." },
    { term: "Half-Life", eli: "If the spread is $2 away from its mean and the half-life is 10 days, you expect it to be only $1 away after 10 days. This is your expected holding period. Never enter a pairs trade without knowing the half-life." },
    { term: "Z-Score Entry/Exit", eli: "Z-score = (spread − mean) / std_dev. Enter when z > 2 or z < −2 (unusually stretched). Exit when z returns to 0 (back to equilibrium). This is the entire trading rule for an OU-based pairs strategy." },
    { term: "Stationary vs Non-Stationary", eli: "A stationary process always returns to the same mean and has bounded variance. An OU process is stationary. A random walk is NOT stationary — it wanders without bound. You can only pairs-trade a stationary spread." },
  ],
};

const ARIGARCH_DATA = {
  overview: {
    color: C.amber,
    what: "QuantStart's ARIMA+GARCH strategy combines two time series models to forecast and trade the S&P500. ARIMA models the conditional mean (direction of returns), while GARCH models the conditional variance (how volatile the returns will be). A rolling window is fitted fresh each day, and the next-day forecast drives the trade signal.",
    why: "Buy-and-hold the S&P500 works long-term but gives a painful ride with large drawdowns. By forecasting return direction and only being invested when the model predicts positive returns, ARIMA+GARCH significantly improves risk-adjusted returns — especially by sidestepping the worst periods.",
    when: "Use when daily returns show autocorrelation structure and when volatility clustering is present. Best on major liquid indices where the statistical patterns are most stable over time.",
    stats: [{ value: "ARIMA", label: "Models direction — which way returns will go" }, { value: "GARCH", label: "Models magnitude — how volatile returns will be" }, { value: "Rolling", label: "Refit model every day on the last N observations" }],
    keyFacts: [
      "ARIMA(p,d,q): p=AR lags, d=differencing, q=MA lags. For stationary returns, d=0 (ARMA). Choose p and q by minimising AIC or BIC.",
      "GARCH(1,1) is the standard specification. Captures volatility clustering: big moves follow big moves.",
      "The combined model: ARIMA handles the mean equation, GARCH handles the variance equation.",
      "Signal: if ARIMA forecasts positive return tomorrow, go long. If negative, go flat (or short). Size position inversely with GARCH volatility forecast.",
      "Critical: no look-ahead bias. The model must only use data available before each trading day.",
    ],
  },
  deepdive: {
    color: C.amber,
    sections: [
      {
        title: "ARIMA Order Selection",
        body: "Select ARIMA(p,q) order by minimising AIC across a grid of candidates. The winning order is the model that best balances fit and parsimony. Typically ARIMA(1,0,1) or ARIMA(2,0,1) on equity index returns.",
        code: `import itertools, warnings
import statsmodels.api as sm
warnings.filterwarnings("ignore")

def select_arima(returns, max_p=3, max_q=3):
    best_aic, best_order = np.inf, (0,0,0)
    for p, q in itertools.product(range(max_p+1), range(max_q+1)):
        try:
            m = sm.tsa.ARIMA(returns, order=(p,0,q)).fit()
            if m.aic < best_aic:
                best_aic, best_order = m.aic, (p,0,q)
        except: pass
    return best_order`,
      },
      {
        title: "GARCH Variance Equation",
        body: "Fit GARCH(1,1) to the ARIMA residuals. The combined model gives both a direction forecast (from ARIMA) and a volatility forecast (from GARCH). Position size inversely with volatility: when GARCH says volatility is high, reduce exposure.",
        code: `from arch import arch_model

def fit_arima_garch(returns, order=(1,0,1)):
    arima = sm.tsa.ARIMA(returns, order=order).fit()
    garch = arch_model(arima.resid, vol='Garch', p=1, q=1,
                       dist='skewt').fit(disp='off')
    mean_fc = arima.forecast(1)[0]
    vol_fc  = float(garch.forecast(horizon=1).variance.iloc[-1])
    return mean_fc, np.sqrt(vol_fc)`,
      },
      {
        title: "Rolling Strategy",
        body: "Every day: (1) take the last window of returns, (2) fit ARIMA+GARCH, (3) generate signal based on forecast direction. Never peek at future data.",
        code: `def rolling_strategy(returns, window=252):
    signals = []
    for i in range(window, len(returns)):
        train = returns[i-window:i]   # Only past data!
        try:
            order = select_arima(train)
            fc_mean, fc_vol = fit_arima_garch(train, order)
            signals.append(1 if fc_mean > 0 else -1)
        except:
            signals.append(0)
    # Strategy return = signal * next day actual return
    return pd.Series(signals) * returns[window:]`,
      },
    ],
  },
  mentalModels: [
    { icon: "🌤️", title: "The Two-Part Weather Forecast", body: "A good weather forecast tells you two things: (1) will it rain tomorrow? (2) How heavy will the rain be? ARIMA is the 'will it rain' part — it forecasts the direction. GARCH is the 'how heavy' part — it forecasts the magnitude of volatility. You use both: trade direction from ARIMA, size your position with GARCH.", insight: "Direction without magnitude is incomplete. A +0.1% expected return with 3% expected volatility is a much weaker signal than +0.1% with 0.5% volatility." },
    { icon: "😰", title: "The Nervous Crowd", body: "When someone panics in a crowded room, others panic too. When markets are calm, they tend to stay calm. GARCH captures this 'contagious fear' in volatility. It says: the market's nervousness today depends on how nervous it was yesterday (σ²_t-1) and what surprising thing happened today (ε²_t-1).", insight: "High GARCH volatility forecast = reduce position size or stay flat. This single adjustment can dramatically reduce drawdowns." },
    { icon: "📰", title: "Rolling Memory", body: "Every day you throw away the oldest newspaper and add today's. Your strategy only reads the most recent 252 newspapers. Why? Markets evolve — patterns from 5 years ago may be irrelevant today. The rolling window keeps the model anchored to current conditions without being distracted by ancient history.", insight: "The window length W is a critical hyperparameter. Short W = reactive but noisy. Long W = stable but slow to adapt to regime changes." },
  ],
  validation: [
    { claim: "GARCH(1,1) captures volatility clustering in financial returns", strength: "VERY STRONG", evidence: "Engle (1982) ARCH model — Nobel Prize 2003. Bollerslev (1986) GARCH extension. Confirmed across all financial markets. α+β≈0.99 is a consistent empirical finding across equities, FX, and commodities." },
    { claim: "ARIMA order selection via AIC is a valid and standard methodology", strength: "STRONG", evidence: "Box & Jenkins (1970) methodology is the standard framework. Akaike (1974) AIC information criterion. BIC (Schwarz, 1978) is more conservative. Standard in every time series forecasting application globally." },
  ],
  eli15: [
    { term: "ARIMA Model", eli: "ARIMA says: yesterday's return and last week's return can somewhat predict today's. Not perfectly, but better than random guessing. It finds the best linear formula that uses past returns to forecast future ones." },
    { term: "GARCH Model", eli: "When the market is scared, it stays scared. When it is calm, it stays calm. GARCH models this persistence in volatility. Tomorrow's volatility = a function of yesterday's volatility plus how big today's surprise was." },
    { term: "Rolling Window", eli: "Every day: drop the oldest data, add the newest, refit the model. You always work with the most recent year of data. This keeps the model current rather than anchored to distant, potentially irrelevant history." },
    { term: "Direction + Magnitude", eli: "ARIMA says 'go up tomorrow'. GARCH says 'but the expected move is huge — 3% volatility'. These two signals together let you decide both direction AND how much capital to risk on the trade." },
    { term: "Why It Can Fail Live", eli: "The backtest finds patterns in historical data. Those patterns may be weaker in live trading, or may have disappeared entirely. Always paper trade before committing real capital. Compare live Sharpe to backtest Sharpe — a large gap reveals overfitting." },
  ],
};

const KALMAN_DATA = {
  overview: {
    color: C.blue,
    what: "The Kalman Filter is a recursive Bayesian algorithm for estimating the hidden state of a dynamic system from noisy observations. Originally built for NASA's Apollo program guidance computers (1960), it is now a core tool in quantitative finance for tracking time-varying hedge ratios and filtering noisy financial signals.",
    why: "Static hedge ratios in pairs trading become stale as market conditions change. The Kalman Filter adapts continuously — every new price tick updates the hedge ratio estimate. This eliminates the lookback window free parameter that plagues rolling regression approaches and produces a more accurate dynamic hedge.",
    when: "Use when: you need to track a relationship that changes over time, observations are noisy but follow a predictable model, or you want a principled Bayesian framework for dynamic parameter estimation.",
    stats: [{ value: "1960", label: "Kalman's original paper — guided Apollo to the moon" }, { value: "Predict + Update", label: "Two-step recursive cycle on every new observation" }, { value: "Optimal", label: "Mathematically optimal under linear Gaussian assumptions" }],
    keyFacts: [
      "State equation: x_t = F·x_{t-1} + w_t (how the hidden state evolves, noise Q).",
      "Observation equation: z_t = H·x_t + v_t (noisy measurement of the hidden state, noise R).",
      "Kalman Gain K: how much to trust the new measurement vs the prior prediction. K = P·H^T / (H·P·H^T + R).",
      "Q/R ratio is the key tuning parameter: high Q/R = hedge ratio changes rapidly; low Q/R = hedge ratio changes slowly.",
      "For pairs trading: hidden state x = [β, α] (hedge ratio and intercept). Observation z = price of asset A. Design matrix H = [price_B, 1].",
    ],
  },
  deepdive: {
    color: C.blue,
    sections: [
      {
        title: "Predict-Update Cycle",
        body: "The Kalman Filter runs two steps every time a new price arrives. Predict: propagate the prior estimate forward. Update: correct using the new observation. The Kalman Gain optimally weights the prediction vs the measurement.",
        code: `import numpy as np

class KalmanFilter:
    def __init__(self, F, Q, R, x0, P0):
        self.F = F; self.Q = Q; self.R = R
        self.x = x0; self.P = P0

    def step(self, z, H):
        # PREDICT
        self.x = self.F @ self.x
        self.P = self.F @ self.P @ self.F.T + self.Q
        # UPDATE
        H = np.array(H).reshape(1,-1)
        innov = z - (H @ self.x)[0]
        S = (H @ self.P @ H.T)[0,0] + self.R
        K = (self.P @ H.T / S).flatten()
        self.x = self.x + K * innov
        self.P = (np.eye(len(self.x)) - np.outer(K, H)) @ self.P
        return self.x.copy()`,
      },
      {
        title: "Dynamic Hedge Ratio",
        body: "Apply the Kalman Filter to TLT and IEI (US Treasury ETFs) to track the dynamic hedge ratio β. The spread = TLT − β·IEI is kept stationary by the adaptive filter, providing cleaner mean-reversion signals than a fixed regression.",
        code: `def kalman_pairs(price_a, price_b, delta=1e-4):
    n = len(price_a)
    beta = np.zeros(n); spread = np.zeros(n)

    F = np.eye(2)
    Q = delta/(1-delta) * np.eye(2)  # Process noise
    kf = KalmanFilter(F, Q, R=1.0,
                      x0=np.zeros(2), P0=np.eye(2))
    for t in range(n):
        H = [price_b[t], 1.0]
        state = kf.step(price_a[t], H)
        beta[t] = state[0]
        spread[t] = price_a[t] - state[0]*price_b[t] - state[1]
    return beta, spread`,
      },
      {
        title: "Signal Generation",
        body: "Once you have the Kalman-filtered spread, compute its z-score on a rolling window. Trade when z-score exceeds ±2 standard deviations. The Kalman Filter's adaptive hedge ratio means the spread is more consistently stationary than a fixed regression spread.",
        code: `def kalman_signal(spread, window=60):
    mu  = pd.Series(spread).rolling(window).mean()
    sig = pd.Series(spread).rolling(window).std()
    z   = (spread - mu) / sig

    # Entry signals
    long_entry  = z < -2.0   # Spread too low  -> long
    short_entry = z >  2.0   # Spread too high -> short
    # Exit signals
    exit_signal = abs(z) < 0.5
    return z, long_entry, short_entry, exit_signal`,
      },
    ],
  },
  mentalModels: [
    { icon: "🌫️", title: "Driving in Fog with GPS", body: "You are driving in thick fog. You have two sources of information: your GPS says you are at position X (noisy but recent), and your physics model says 'you were at position Y 1 second ago going 60km/h, so you should be at Y+16m now' (prediction from model). The Kalman Filter combines both optimally — trusting GPS more when the fog is thin (low R), trusting physics more when the GPS signal is weak (high R).", insight: "Q/R ratio is how much you trust the GPS signal vs your physics prediction. In trading: Q/R controls how quickly the hedge ratio adapts to new prices." },
    { icon: "🔍", title: "The Bayesian Detective", body: "Sherlock Holmes starts each case with a prior belief (the prediction from past evidence). As new clues arrive, he updates his belief proportionally to how diagnostic the clue is. The Kalman Filter is this exact process — formalised in mathematics. The Kalman Gain K is Holmes's diagnostic weight for each new piece of evidence.", insight: "The hedge ratio is never directly observable — you can only see noisy prices. The Kalman Filter is the optimal way to infer the hidden truth from noisy observations." },
    { icon: "⚖️", title: "Why Better Than Rolling Regression", body: "Rolling regression (e.g. 60-day window) has a free parameter — the lookback length. Choose 30 days: too noisy. Choose 200 days: too slow to adapt. Kalman Filter has NO lookback window. Instead, it has Q and R (process noise and observation noise) which have intuitive interpretations and can be estimated from the data. One problem solved more elegantly.", insight: "The Q/R ratio in Kalman plays the same role as the lookback window in rolling regression — but it is grounded in the noise structure of the data, not an arbitrary time horizon." },
  ],
  validation: [
    { claim: "Kalman Filter is mathematically optimal for linear Gaussian state estimation", strength: "VERY STRONG", evidence: "Kalman (1960) proved optimality — the filter is the minimum mean squared error estimator. Used in GPS, Apollo, robotics, econometrics. Standard for 65+ years across aerospace and signal processing." },
    { claim: "Kalman-based dynamic hedge ratio outperforms static rolling regression in pairs trading", strength: "STRONG", evidence: "Chan (2012) 'Algorithmic Trading' demonstrates this on TLT/IEI. O'Mahony (Quantopian, 2013) independently validated. Key advantage: no lookback window free parameter. The filter adapts continuously without requiring window optimisation." },
  ],
  eli15: [
    { term: "Kalman Filter", eli: "You are tracking a moving car in thick fog. You have a blurry radar signal (noisy measurement) and Newton's laws (your prediction model). The Kalman Filter combines both optimally: weight the radar signal vs the physics prediction based on how reliable each is. Result: better estimate than either source alone." },
    { term: "Hidden State", eli: "The true hedge ratio between two assets. You cannot observe it directly — you only see noisy prices. The Kalman Filter estimates this unobservable truth from the noisy observations, updating its estimate every time a new price arrives." },
    { term: "Predict Step", eli: "Before seeing today's price: make your best guess about the hedge ratio based on where it was yesterday and how it tends to move. This is the prior estimate — like a weather forecast before you look out the window." },
    { term: "Update Step", eli: "Now see today's actual prices. Compare what you predicted to what happened. The bigger the gap, the more you update. The Kalman Gain K determines how aggressively to update: K=1 means trust the data completely; K=0 means ignore the data." },
    { term: "Q/R Ratio", eli: "Q = how much the true hedge ratio changes between steps. R = how noisy your price measurements are. Q/R=0.0001 means the hedge ratio barely moves and prices are relatively clean. Higher Q/R = more responsive filter but noisier hedge ratio estimates." },
  ],
};

const HMM_DATA = {
  overview: {
    color: "#e879f9",
    what: "Hidden Markov Models (HMMs) treat financial markets as a system switching between hidden regimes — bull, bear, sideways — each emitting characteristic return distributions. You cannot observe the regime directly; you infer it from price behaviour. The Baum-Welch algorithm learns regime parameters unsupervised from unlabelled return data.",
    why: "A momentum strategy that works in bull markets loses money in bear markets. Detecting the current regime and switching strategies accordingly can dramatically improve risk-adjusted returns and reduce drawdowns.",
    when: "Use for regime detection (bull/bear/sideways), strategy switching based on detected regime, position sizing based on regime volatility, or identifying when your primary strategy is likely to underperform.",
    stats: [{ value: "2–3", label: "Typical number of regimes: bull/bear or bull/sideways/bear" }, { value: "Baum-Welch", label: "EM algorithm for unsupervised training from unlabelled data" }, { value: "Viterbi", label: "Algorithm for finding the most likely regime sequence" }],
    keyFacts: [
      "Each hidden state (regime) has its own Gaussian emission: different mean return and volatility per regime.",
      "Transition matrix A: A[i][j] = probability of moving from regime i to regime j. High diagonal = persistent regimes.",
      "Baum-Welch = EM algorithm. It discovers regimes automatically — you never label which days were bull or bear.",
      "Posterior probabilities: P(regime=k | all observations). Use these as soft trading signals rather than hard state assignments.",
      "hmmlearn is the standard Python library: GaussianHMM for continuous returns.",
    ],
  },
  deepdive: {
    color: "#e879f9",
    sections: [
      {
        title: "Model Structure",
        body: "An HMM has three components: π (initial state probs), A (transition matrix), and B (emission parameters per state). For financial markets, emissions are Gaussian with regime-specific mean and variance.",
        code: `# HMM components:
# pi: initial state probs, e.g. [0.7, 0.3]
# A:  transition matrix:
#     [[0.95, 0.05],  # P(stay bull | bull) = 95%
#      [0.10, 0.90]]  # P(stay bear | bear) = 90%
# B:  emissions per state:
#     Bull: mean=+0.05%, sigma=0.8%  (calm uptrend)
#     Bear: mean=-0.10%, sigma=1.8%  (volatile decline)
# High diagonal in A = regimes are persistent.`,
      },
      {
        title: "Training with hmmlearn",
        body: "Baum-Welch discovers the regimes automatically. You provide return data; the algorithm finds the parameters that best explain the observations without any labels.",
        code: `from hmmlearn.hmm import GaussianHMM
import numpy as np

def train_hmm(returns, n_states=2, n_iter=200):
    X = returns.reshape(-1, 1)
    model = GaussianHMM(n_components=n_states,
                        covariance_type="full",
                        n_iter=n_iter).fit(X)
    states = model.predict(X)
    # Identify bull (highest mean) vs bear (lowest mean)
    means = model.means_.flatten()
    bull  = np.argmax(means)
    print(f"Bull: mean={means[bull]:.4f}, "
          f"sigma={np.sqrt(model.covars_[bull][0][0]):.4f}")
    print(f"Transition:\n{model.transmat_}")
    return model, states, bull`,
      },
      {
        title: "Regime-Based Strategy",
        body: "Use the smoothed posterior probabilities as soft signals. Momentum in bull regime; flat or short in bear regime. Sizing scales with bull probability.",
        code: `def regime_signal(returns, model, bull_state):
    X = returns.reshape(-1, 1)
    _, posteriors = model.score_samples(X)
    bull_prob = posteriors[:, bull_state]
    # Signal: scale between -1 and +1 based on bull probability
    signal = np.where(bull_prob > 0.65,  1,
             np.where(bull_prob < 0.35, -1, 0))
    return signal, bull_prob`,
      },
    ],
  },
  mentalModels: [
    { icon: "🌡️", title: "Market Moods Behind Frosted Glass", body: "Imagine watching a person behind frosted glass. You cannot see their face (the hidden regime). But you can hear them — laughing, crying, or silent. Each mood has a characteristic sound pattern. The HMM says: the market has hidden moods (bull/bear/sideways), and each mood produces a characteristic pattern of returns. By listening to the returns, you infer the mood.", insight: "You can never be certain which regime you are in — you only have probabilities. Use the posterior probability as a continuous signal, not a binary switch." },
    { icon: "🌦️", title: "Weather Regimes", body: "Weather has regimes: sunny spells last for days, rainy spells last for days, storm systems come and go. You cannot directly 'see' the weather system, only the current temperature and rainfall. An HMM for weather would model: 'sunny regime = warm, low rain. Rainy regime = cool, high rain. High probability of staying in the same regime tomorrow.' Financial markets work identically.", insight: "The transition matrix diagonal tells you how sticky regimes are. If A[bull][bull]=0.95, a bull regime typically lasts about 20 days (1/(1-0.95)). Plan your strategy's time horizon accordingly." },
    { icon: "⚙️", title: "The Hidden Gear Shift", body: "A car has a hidden gear — you cannot see it, but you can infer it from engine noise and speed. Low speed + high revs = first gear. High speed + low revs = fifth gear. Each gear has a characteristic behaviour. Market regimes are the gears. The HMM is the gear position estimator that tells you which gear the market is currently in, so you deploy the right strategy.", insight: "The most valuable use of regime detection is often the AVOIDANCE trade — knowing you are in a bear regime and simply going flat or short instead of running your normal strategy." },
  ],
  validation: [
    { claim: "Financial markets exhibit distinct statistical regimes detectable by HMMs", strength: "STRONG", evidence: "Hamilton (1989) Markov switching regression. Ang & Bekaert (2002) documented regime shifts in international equity markets. Turner, Startz & Nelson (1989) showed different return distributions in bull vs bear markets. Standard in central bank and macro models." },
    { claim: "Baum-Welch EM algorithm reliably estimates HMM parameters from financial data", strength: "STRONG", evidence: "Baum et al. (1970) original paper. Standard in speech recognition and computational biology for 50+ years. For finance: re-fitting the HMM periodically (quarterly) is required as parameters drift over time." },
  ],
  eli15: [
    { term: "Market Regimes", eli: "The market has moods that last days or weeks. Bull mood: prices drift up, low volatility. Bear mood: prices fall, high volatility. The key insight is that moods are persistent — they do not flip randomly every day. This persistence makes them tradeable." },
    { term: "Hidden Markov Model", eli: "You cannot directly observe the market's mood. But you can observe prices and returns. The HMM says: each mood produces a characteristic return pattern. By observing the pattern, you infer the mood. Hidden = unobservable mood. Markov = each day's mood depends only on yesterday's mood." },
    { term: "Baum-Welch Training", eli: "You feed the model a history of returns without any labels ('these days were bull, these were bear'). The algorithm figures it out entirely on its own — finding the regime parameters that make the observed returns most probable. Unsupervised learning at its most elegant." },
    { term: "Posterior Probability", eli: "Instead of a hard 'you are in bull regime', the HMM gives you 'there is a 75% probability you are in bull regime right now'. This soft probability is a much better trading signal. At 75% bull: be 75% allocated. At 50%: be flat. At 20%: consider short." },
    { term: "Transition Matrix", eli: "If A[bull][bull]=0.95, a bull regime typically lasts 1/(1-0.95)=20 days on average. This tells you: if you detect a regime switch, expect it to last about 20 days before the next switch. Size your position and time your hold accordingly." },
  ],
};

const GBM_DATA = {
  overview: {
    color: C.accent,
    what: "Geometric Brownian Motion (GBM) is the mathematical model underlying the Black-Scholes options formula and all of modern quantitative finance. It models asset prices as a drift (upward trend proportional to price) plus random shocks (also proportional to price). The 'geometric' part means percentage returns are normally distributed — not absolute price changes.",
    why: "GBM is the foundation. Every time you hear Black-Scholes, implied volatility, or risk-neutral pricing, GBM is underneath. Understanding it gives you the mathematical language of options pricing, Monte Carlo simulation, and stochastic differential equations.",
    when: "Use for: Monte Carlo simulation of option payoffs, generating synthetic price paths for backtesting, understanding options pricing from first principles, and as the baseline model before adding complexity (stochastic vol, jumps, mean reversion).",
    stats: [{ value: "1973", label: "Black-Scholes paper assumed GBM — Nobel Prize 1997" }, { value: "dS=μSdt+σSdW", label: "The SDE that defines Geometric Brownian Motion" }, { value: "Log-normal", label: "GBM produces log-normally distributed prices" }],
    keyFacts: [
      "GBM SDE: dS = μS dt + σS dW. Prices cannot go negative (bounded at zero). Percentage returns are normally distributed.",
      "Exact solution (via Ito's Lemma): S(t) = S(0)·exp((μ − σ²/2)t + σ√t·Z), where Z ~ N(0,1).",
      "The Ito correction (−σ²/2) is the extra term from stochastic calculus. Without it, the mean price grows faster than the median price — Jensen's inequality applied to log-normal distributions.",
      "GBM limitations: constant volatility (violated by vol smile), no jumps (violated by fat tails), no mean reversion (violated by rates and spreads).",
      "Risk-neutral pricing: replace μ with r (risk-free rate) for option pricing. This makes the math tractable without changing the option price.",
    ],
  },
  deepdive: {
    color: C.accent,
    sections: [
      {
        title: "The SDE & Solution",
        body: "The GBM SDE says: price change = drift × price × time + noise × price × random shock. The solution gives you the price at any future time T as a function of today's price and the integrated randomness.",
        code: `import numpy as np

def simulate_gbm(S0, mu, sigma, T, dt, n_paths=1000):
    """
    Exact GBM simulation using Ito's solution.
    S(t+dt) = S(t) * exp((mu - 0.5*sigma^2)*dt
                          + sigma*sqrt(dt)*Z)
    """
    n = int(T / dt)
    paths = np.zeros((n_paths, n + 1))
    paths[:, 0] = S0
    for t in range(1, n + 1):
        Z = np.random.standard_normal(n_paths)
        paths[:, t] = paths[:, t-1] * np.exp(
            (mu - 0.5*sigma**2)*dt + sigma*np.sqrt(dt)*Z)
    return paths

# 1000 paths, S0=100, 8% drift, 20% vol, 1 year, daily
paths = simulate_gbm(100, 0.08, 0.20, T=1.0,
                     dt=1/252, n_paths=1000)`,
      },
      {
        title: "Ito's Lemma",
        body: "Ito's Lemma is the chain rule of stochastic calculus. Regular calculus fails because (dW)² = dt (not zero). The extra term (0.5 × second derivative × variance) is the Ito correction. It is why the exact GBM solution has σ²/2 subtracted from the drift.",
        code: `# Classical chain rule:   df = (df/dX) dX
# Ito's Lemma:  df = (df/dt)dt + (df/dX)dX + 0.5*(d2f/dX2)(dX)^2
# For X=log(S) applied to GBM:
#   d(log S) = (mu - 0.5*sigma^2)*dt + sigma*dW
#   Extra term: -0.5*sigma^2*dt  <-- the Ito correction

# Physical interpretation:
# Arithmetic mean return ≠ geometric (compound) return
# Geometric return = arithmetic mean - 0.5*variance
# Example: +50% then -50% = -25% overall (not 0%)
# The -0.5*sigma^2 captures this compounding drag.`,
      },
      {
        title: "Monte Carlo Options Pricing",
        body: "Any option can be priced by simulation: generate paths, compute payoffs, average and discount. No analytical formula needed — works for complex path-dependent payoffs that Black-Scholes cannot handle.",
        code: `from scipy.stats import norm

def mc_call_price(S0, K, T, r, sigma, n=100000):
    Z  = np.random.standard_normal(n)
    ST = S0 * np.exp((r - 0.5*sigma**2)*T
                     + sigma*np.sqrt(T)*Z)
    payoff = np.maximum(ST - K, 0)
    price  = np.exp(-r*T) * np.mean(payoff)
    se     = np.exp(-r*T) * np.std(payoff) / np.sqrt(n)
    return price, se

# Compare to Black-Scholes analytical formula
price, se = mc_call_price(100, 100, 1.0, 0.05, 0.20)
# MC: ~$10.45 ± $0.02  |  BS exact: $10.45  ✓`,
      },
    ],
  },
  mentalModels: [
    { icon: "🚶", title: "The Drunk Uphill Walk", body: "GBM is a drunk person walking uphill on a slope. The slope is the drift μ — they tend to move upward over time. But at every step they stumble randomly to the left or right (the σ·dW noise). The 'geometric' part means the stumbles get bigger as they climb higher — a $10 stock stumbles by $1, a $100 stock stumbles by $10.", insight: "The drift μ matters less than you think for short horizons. For a 1-year option, the volatility σ dominates. For a 20-year investment, drift dominates. This is why traders care so much about vol and so little about expected returns when pricing short-term options." },
    { icon: "📉", title: "Why Prices Cannot Go Negative", body: "In arithmetic Brownian Motion (the naive model), dS = μdt + σdW. This allows S to go negative — absurd for prices. GBM fixes this by making the shocks proportional to S: dS = μS dt + σS dW. When S approaches zero, shocks shrink toward zero too. Prices asymptotically approach zero but never cross it. The log-normal distribution enforces this.", insight: "This is the mathematical reason options are never worth more than the underlying stock — the stock cannot go below zero, so the most an option can earn is bounded." },
    { icon: "⚖️", title: "Mean vs Median in GBM", body: "With +50% in year 1 and -50% in year 2, your arithmetic average return is 0%. But your actual money: $100 → $150 → $75. You LOST 25%. This gap between mean and median return is the volatility drag captured by the σ²/2 Ito correction. High volatility assets compound more slowly than their average return suggests.", insight: "This is why high-volatility strategies need significantly higher average returns to be worthwhile. The drag of volatility is a real cost, not a mathematical curiosity." },
  ],
  validation: [
    { claim: "GBM is the foundational model underlying Black-Scholes options pricing", strength: "VERY STRONG", evidence: "Samuelson (1965) proposed log-normal prices. Black & Scholes (1973) and Merton (1973) built the Nobel Prize-winning formula on GBM. Standard in all derivatives textbooks and every options trading desk globally." },
    { claim: "Ito's Lemma is the correct tool for differentiating functions of stochastic processes", strength: "VERY STRONG", evidence: "Ito (1951) original paper. Foundation of all stochastic calculus. Without the Ito correction, option pricing calculations give wrong answers. Proved formally: for any twice-differentiable function of a diffusion process, the quadratic variation term must be included." },
  ],
  eli15: [
    { term: "Geometric Brownian Motion", eli: "A drunk person walking uphill. They tend to drift upward (the μ drift) but stumble randomly left and right at every step (the σ noise). The 'geometric' part means: the bigger they get, the bigger the stumbles — a $100 stock has bigger absolute moves than a $10 stock, but the same percentage moves." },
    { term: "Ito's Lemma", eli: "Regular calculus says: if y=f(x), then dy = (df/dx)·dx. When x is random, there is an extra term because (dx)² is not zero — it equals dt. Ito's Lemma adds this correction. Without it, your option pricing calculations give the wrong answer. It is the fundamental 'second-order correction' of stochastic calculus." },
    { term: "Volatility Drag (σ²/2)", eli: "If a stock goes up 50% one year and down 50% the next, your average return is 0% but your actual return is −25%. The volatility drag is this gap. Mathematically it equals σ²/2. Higher vol = more drag on compound growth. This is why the GBM solution subtracts σ²/2 from the drift." },
    { term: "Risk-Neutral Pricing", eli: "To price options, pretend every asset grows at the risk-free rate r — not its actual drift μ. In this pretend 'risk-neutral world', take the expected payoff and discount at r. This gives the exact same price as a full equilibrium model, but is much easier to compute. The drift μ cancels out entirely." },
    { term: "Monte Carlo Simulation", eli: "Generate 100,000 possible future stock price paths. For each path, calculate what the option pays out. Average the payoffs. Discount to today. That is the option price. No formula needed. Works for any option, no matter how complex. The law of large numbers makes it accurate with enough paths." },
  ],
};

const MR_DATA = {
  overview: {
    color: C.amber,
    what: "Statistical mean reversion testing determines whether a time series — such as a spread between two assets — is genuinely mean-reverting or just a random walk that happens to look like it reverts. Three tools: the Augmented Dickey-Fuller (ADF) test, the Hurst Exponent, and the half-life calculation from an OU regression.",
    why: "Before entering any pairs trade or spread strategy, you must confirm the spread is actually mean-reverting. A random walk looks like it reverts in the short term but never reliably returns to any mean. Trading it as a mean-reversion strategy causes slow, consistent losses.",
    when: "Run these tests before every new pairs setup. Test on: the spread between two candidate assets, residuals from a cointegrating regression, implied vol spreads between related options, yield spreads between bonds.",
    stats: [{ value: "ADF", label: "Augmented Dickey-Fuller — p<0.05 confirms stationarity" }, { value: "H < 0.5", label: "Hurst Exponent below 0.5 indicates mean reversion" }, { value: "ln(2)/|λ|", label: "Half-life formula from AR(1) regression" }],
    keyFacts: [
      "ADF null hypothesis: series has a unit root (random walk). p<0.05 → reject null → series is stationary (mean-reverting).",
      "Hurst Exponent: H<0.5 = mean-reverting, H=0.5 = random walk, H>0.5 = trending. Fast calculation via variance ratio method.",
      "Half-life: fit AR(1) X_t = λ·X_{t-1} + μ + ε. Half-life = −ln(2)/ln(λ). Expected number of days to revert 50% to the mean.",
      "Test on the SPREAD, not individual assets. Individual prices are almost always unit root processes.",
      "All three tests should agree. A tradeable spread: ADF p<0.05, H significantly below 0.5, half-life of days to weeks.",
    ],
  },
  deepdive: {
    color: C.amber,
    sections: [
      {
        title: "ADF Test",
        body: "The gold standard for stationarity. Null hypothesis is unit root (random walk). Low p-value rejects the null — the series is stationary. The augmented version adds lag terms to handle autocorrelation in residuals.",
        code: `from statsmodels.tsa.stattools import adfuller

def adf_test(series, name="Series"):
    res = adfuller(series, autolag='AIC')
    p   = res[1]
    print(f"{name}:  ADF={res[0]:.4f}, p={p:.4f}")
    print(f"  {'STATIONARY (mean-reverting) ✓' if p < 0.05 else 'NON-STATIONARY (random walk) ✗'}")
    return p < 0.05`,
      },
      {
        title: "Hurst Exponent",
        body: "H < 0.5 = mean-reverting. H = 0.5 = random walk. H > 0.5 = trending. The variance ratio method is the fastest implementation.",
        code: `def hurst_exponent(series):
    lags = range(2, 100)
    tau  = [np.std(series[lag:] - series[:-lag])
            for lag in lags]
    H = np.polyfit(np.log(lags), np.log(tau), 1)[0]
    category = ("mean-reverting" if H < 0.45
                else "random walk" if H < 0.55
                else "trending")
    print(f"Hurst H={H:.3f} → {category}")
    return H`,
      },
      {
        title: "Half-Life Calculation",
        body: "Fit an AR(1) regression to compute how fast the spread mean-reverts. The half-life determines your expected holding period. If half-life is too long, capital is tied up; too short, and transaction costs eat the edge.",
        code: `import statsmodels.api as sm

def half_life(spread):
    model = sm.OLS(spread[1:],
                   sm.add_constant(spread[:-1])).fit()
    lam = model.params[1]
    if lam >= 1.0:
        print("Non-stationary — no mean reversion!")
        return None
    hl = -np.log(2) / np.log(lam)
    print(f"Half-life: {hl:.1f} days")
    return hl`,
      },
    ],
  },
  mentalModels: [
    { icon: "🧲", title: "The Price Magnet", body: "Mean reversion works like a magnet. The 'mean' is the magnetic centre. When prices are pulled away from it (by news, sentiment, temporary imbalance), they feel a force pulling them back. The stronger the magnet (higher θ in OU terms), the faster the snap back. The question these tests answer: is the magnet actually there, or is this just a compass with no north?", insight: "The ADF test checks whether the magnet exists. The Hurst exponent measures its strength. The half-life tells you how strong the pull is in practical time units." },
    { icon: "🔬", title: "Forensic Analysis", body: "A forensic analyst examines evidence to determine cause of death. A mean reversion analyst examines a time series to determine whether it has a genuine 'memory' (and will return to its mean) or is completely memoryless (random walk). The ADF test is the forensic tool. p<0.05 is the verdict: this series has memory.", insight: "Run all three tests — ADF, Hurst, and half-life. If they disagree, the series is borderline and the trade is risky. All three agreeing gives you confidence to size up." },
    { icon: "⏰", title: "Half-Life as Your Trade Timer", body: "The half-life is not just a statistical curiosity — it is your trade management clock. Enter when the spread is 2σ from the mean. Expect to wait one half-life for it to be 1σ away, another for it to reach 0.5σ. Most of your P&L should arrive within 2-3 half-lives. If the trade is not working after 3× the half-life, something has changed.", insight: "Never hold a mean-reversion trade past 3× the half-life. At that point you are no longer mean-reversion trading — you are hoping." },
  ],
  validation: [
    { claim: "ADF test is the standard for stationarity testing in financial time series", strength: "VERY STRONG", evidence: "Dickey & Fuller (1979, 1981) foundational papers. Standard in every econometrics textbook. Used universally by stat arb and pairs trading desks. The augmented version is robust to autocorrelated financial data." },
    { claim: "Hurst Exponent correctly classifies mean-reverting, random walk, and trending series", strength: "STRONG", evidence: "Hurst (1951) derived it for hydrology. Peters (1994) applied it to financial markets. The variance ratio implementation is the fastest and most stable version for financial data." },
    { claim: "Half-life from AR(1) regression is the correct estimator for OU reversion speed", strength: "STRONG", evidence: "Directly derived from the Euler-Maruyama discretisation of the OU SDE. Chan (2012) uses this formula throughout his pairs trading examples. Standard in all practical mean-reversion trading literature." },
  ],
  eli15: [
    { term: "Why We Test at All", eli: "A random walk LOOKS like it mean-reverts in the short term — it wiggles up and down around some level. But it will eventually drift far away and never come back. If you trade it as a mean-reversion strategy, you lose money slowly and steadily. The tests separate genuine mean reversion from random wandering." },
    { term: "ADF Test", eli: "The null hypothesis is: 'this series is a random walk.' ADF calculates a statistic. If the statistic is sufficiently negative (p < 0.05), you reject the null — the series mean-reverts. Think of it as a guilty-until-proven-innocent test for random walks." },
    { term: "Hurst Exponent", eli: "H=0.5 is a pure random walk — no memory, no mean reversion. H=0.2 is strongly mean-reverting — the series has strong memory pulling it back to the mean. H=0.8 is strongly trending — past moves predict future moves in the same direction. Check this before any pairs trade." },
    { term: "Half-Life in Plain English", eli: "Spread is currently $2 away from its mean. Half-life = 10 days. After 10 days: expected to be $1 away. After 20 days: $0.50 away. After 30 days: $0.25 away. This is your trade schedule. If the spread has not moved after 3× the half-life, the cointegration relationship may have broken down." },
    { term: "Test the Spread, Not the Assets", eli: "Individual stock prices wander without bound — they are random walks by design. But Shell minus 1.2×BP might be stationary. You test the SPREAD because that is what you are trading. The individual prices being non-stationary is actually REQUIRED for cointegration to be meaningful." },
  ],
};

const COINT_DATA = {
  overview: {
    color: C.accent,
    what: "Cointegration analysis determines whether two or more assets share a common long-run trend such that a linear combination of them is stationary. Unlike correlation (short-term), cointegration is a structural long-run relationship. Two stocks can have zero correlation today but still be cointegrated, or high correlation and not be cointegrated at all.",
    why: "Cointegration is the formal mathematical foundation of pairs trading and stat arb. Without it, you are eyeballing charts and hoping. With it, you have a statistical guarantee — under model assumptions — that the spread will remain bounded and mean-revert over time.",
    when: "Use to: validate a pairs relationship before committing capital, find the optimal static hedge ratio, detect cointegration breakdown, or build baskets of 3+ assets using the Johansen test.",
    stats: [{ value: "1987", label: "Engle & Granger — Nobel Prize 2003" }, { value: "β", label: "The cointegrating vector = optimal static hedge ratio" }, { value: "Two tests", label: "Engle-Granger (pairs) and Johansen (multi-asset)" }],
    keyFacts: [
      "Definition: X and Y are cointegrated if both are I(1) (unit root) but X − β·Y is I(0) (stationary).",
      "Engle-Granger two-step: (1) regress X on Y to get β, (2) ADF-test the residuals. Stationary residuals = cointegrated.",
      "Johansen test: multivariate ML approach. Handles 3+ assets, more powerful than Engle-Granger for small samples.",
      "The cointegrating vector β gives the optimal static hedge ratio. Use Kalman Filter to make β time-varying.",
      "Cointegration can break permanently. Monitor the z-score — if it stays above ±3σ for 20+ days without reverting, exit and stop trading the pair.",
    ],
  },
  deepdive: {
    color: C.accent,
    sections: [
      {
        title: "Engle-Granger Test",
        body: "Regress X on Y to get β. Test residuals (the spread) for stationarity with ADF. If ADF passes, X and Y are cointegrated and the spread is your tradeable instrument.",
        code: `import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller

def engle_granger(price_x, price_y, sig=0.05):
    model = sm.OLS(price_x,
                   sm.add_constant(price_y)).fit()
    beta, alpha = model.params[1], model.params[0]
    spread = price_x - beta*price_y - alpha
    p = adfuller(spread, autolag='AIC')[1]
    print(f"beta={beta:.4f}, ADF p={p:.4f}")
    print("Cointegrated ✓" if p < sig else "NOT cointegrated ✗")
    return p < sig, beta, spread`,
      },
      {
        title: "Johansen Test",
        body: "More powerful than Engle-Granger for small samples and multi-asset baskets. Tests for the number of cointegrating vectors. Essential when working with 3+ related assets.",
        code: `from statsmodels.tsa.vector_ar.vecm import coint_johansen

def johansen_test(prices_df, det_order=0, k_ar_diff=1):
    res = coint_johansen(prices_df, det_order, k_ar_diff)
    print("Trace stat | CVs (90%, 95%, 99%)")
    for i, r in enumerate(res.lr1):
        cv = res.cvt[i]
        sig = "✓" if r > cv[1] else "✗"
        print(f"  r<={i}: {r:.2f} | {cv[1]:.2f} {sig}")
    print(f"Cointegrating vectors:\n{res.evec}")
    return res`,
      },
      {
        title: "Breakdown Detection",
        body: "Cointegrating relationships can and do break permanently. Monitor the rolling z-score. A persistent deviation beyond ±3σ for 20+ days signals structural breakdown — exit immediately.",
        code: `def monitor_spread(spread, window=60, threshold=3.0):
    z = ((spread - spread.rolling(window).mean())
         / spread.rolling(window).std())
    # Breakdown signal: |z| > threshold for 20+ consecutive days
    breach = (abs(z) > threshold)
    consec = breach.rolling(20).sum()
    breakdown = consec >= 20
    return z, breakdown`,
      },
    ],
  },
  mentalModels: [
    { icon: "🐕🐕", title: "Two Dogs, One Leash", body: "Two dogs on a single leash attached to each other. Each dog can wander left or right freely in the short term — they might be 10 metres apart at any moment. But the leash ensures they cannot wander indefinitely far from each other. Shell and BP are the two dogs. The shared oil price exposure is the leash. Cointegration is the mathematical test for whether the leash actually exists.", insight: "If the leash breaks (cointegration fails), the dogs can now wander infinitely far apart. This is why you need breakdown monitoring — the moment cointegration fails, exit immediately." },
    { icon: "💍", title: "Long-Run Marriage vs Short-Term Dates", body: "Correlation is like two people who happen to be going to the same party tonight — they are correlated today, but there is no structural commitment. Cointegration is like a marriage — they may argue and drift apart for weeks, but they are structurally tethered over the long run. For pairs trading, you need the marriage, not just a shared calendar event.", insight: "A pair with high correlation but no cointegration is dangerous. It looks safe but has no structural anchor. Always verify cointegration before trading any pair." },
    { icon: "⚓", title: "The Economic Anchor", body: "Two oil companies should have cointegrated stock prices because they both depend on the oil price — that is the economic anchor. If you cannot identify the economic reason two assets should be cointegrated, the statistical relationship may be spurious. The Engle-Granger test tells you IF they are cointegrated. Your economic reasoning tells you WHY — and how durable that WHY is.", insight: "Always ask: what is the economic anchor? If Shell acquires a large non-oil business, the anchor weakens. If BP switches to renewables, the anchor breaks. Cointegration testing is lagging — your economic reasoning leads it." },
  ],
  validation: [
    { claim: "Cointegration is the formal statistical basis for pairs trading profitability", strength: "VERY STRONG", evidence: "Engle & Granger (1987) Nobel 2003. Gatev, Goetzmann & Rouwenhorst (2006, RFS) documented profitability over 50+ years of US equity data. Standard in all stat arb literature." },
    { claim: "Johansen test is more powerful than Engle-Granger for small samples and multi-asset portfolios", strength: "STRONG", evidence: "Johansen (1988, 1991) maximum likelihood approach. Cheung & Lai (1993) Monte Carlo study confirmed Johansen has superior power. For 3+ assets, Johansen is the only appropriate choice." },
  ],
  eli15: [
    { term: "Cointegration vs Correlation", eli: "Correlation says: today when Shell goes up, BP tends to go up too. Cointegration says: over years, Shell and BP are structurally tethered — they drift apart for weeks but always snap back. You can have zero correlation today and still be cointegrated. For pairs trading, you need cointegration, not just correlation." },
    { term: "I(1) and I(0)", eli: "I(1) means the series needs one round of differencing to become stationary — this is what most stock prices are. I(0) means already stationary. Cointegration says: two I(1) series can be combined to create an I(0) series. The combination is your tradeable spread. The individual prices are not tradeable on their own." },
    { term: "Engle-Granger Test", eli: "Step 1: regress Stock A on Stock B, get hedge ratio β. Step 2: compute the residuals (spread = A − β·B). Step 3: ADF test on residuals. p<0.05 means the spread is stationary. That is your cointegration confirmation. Simple two-step procedure." },
    { term: "Cointegration Breakdown", eli: "The leash between two dogs can snap. If Shell acquires a supermarket chain, it no longer tracks BP. The statistical test will eventually pick this up, but your z-score will tell you first — when it stays above ±3σ for 20+ consecutive days without reverting, the relationship is broken. Stop trading that pair immediately." },
  ],
};

const BS_DATA = {
  overview: {
    color: C.red,
    what: "The Black-Scholes model derives the fair price of a European call or put option from five inputs: stock price S, strike price K, time to expiry T, risk-free rate r, and volatility σ. The formula assumes the stock follows GBM and that a perfect hedge can be constructed at every instant — eliminating all risk and producing a unique fair price.",
    why: "Every options desk globally uses Black-Scholes as the baseline pricing language. Even traders who know its assumptions are wrong use it — they convert option prices into implied volatility to compare options on a standardised scale. Understanding it is non-negotiable for any quant working with derivatives.",
    when: "Use for: pricing European call and put options, computing the Greeks, calculating implied volatility from market prices, as the baseline before adding stochastic volatility or jumps.",
    stats: [{ value: "1973", label: "Black-Scholes-Merton — Nobel Prize 1997" }, { value: "5 inputs", label: "S, K, T, r, σ — all observable except implied vol" }, { value: "Greeks", label: "Δ, Γ, θ, ν, ρ — all derived analytically" }],
    keyFacts: [
      "Call: C = S·N(d₁) − K·e^(−rT)·N(d₂). Put: P = K·e^(−rT)·N(−d₂) − S·N(−d₁).",
      "d₁ = (ln(S/K) + (r + σ²/2)T) / (σ√T), d₂ = d₁ − σ√T.",
      "Put-Call Parity: C − P = S − K·e^(−rT). Given call price, put price follows immediately.",
      "Implied volatility: back-solve the formula given the market price. The vol smile/skew reveals where the model is wrong.",
      "The Black-Scholes PDE: ∂C/∂t + rS·∂C/∂S + 0.5σ²S²·∂²C/∂S² = rC. All Greeks are partial derivatives of this equation.",
    ],
  },
  deepdive: {
    color: C.red,
    sections: [
      {
        title: "The Formula & Greeks",
        body: "The call price C = S·N(d₁) − K·e^(−rT)·N(d₂). Intuition: S·N(d₁) is the expected value of receiving the stock at expiry (risk-neutral probability weighted). K·e^(−rT)·N(d₂) is the discounted expected payment of the strike.",
        code: `import numpy as np
from scipy.stats import norm

def black_scholes(S, K, T, r, sigma, opt='call'):
    d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    if opt == 'call':
        return S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)
    return K*np.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)

def bs_greeks(S, K, T, r, sigma):
    d1 = (np.log(S/K)+(r+0.5*sigma**2)*T)/(sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    return {
        "delta": norm.cdf(d1),
        "gamma": norm.pdf(d1)/(S*sigma*np.sqrt(T)),
        "theta": (-S*norm.pdf(d1)*sigma/(2*np.sqrt(T))
                  - r*K*np.exp(-r*T)*norm.cdf(d2))/365,
        "vega":  S*norm.pdf(d1)*np.sqrt(T)/100,
    }`,
      },
      {
        title: "Implied Volatility",
        body: "Implied vol is the σ that makes BS formula price equal the market price. Back-solve using Brent's method. The vol smile — different IV at different strikes — shows Black-Scholes is wrong about constant σ.",
        code: `from scipy.optimize import brentq

def implied_vol(mkt_price, S, K, T, r, opt='call'):
    f = lambda sig: black_scholes(S,K,T,r,sig,opt) - mkt_price
    try:
        return brentq(f, 0.001, 5.0, xtol=1e-6)
    except ValueError:
        return None  # No solution

# Vol smile: OTM puts imply higher vol (crash protection demand)
strikes = [80, 90, 95, 100, 105, 110, 120]
# Typical: [35%, 28%, 24%, 20%, 21%, 23%, 27%]
# The skew shows fear of crashes > euphoria of rallies`,
      },
      {
        title: "Delta Hedging",
        body: "The core insight of Black-Scholes: a market maker who sells an option can hedge the risk by holding Δ shares of the underlying. As the stock price moves, Δ changes, so the hedge must be continuously rebalanced. This dynamic hedging eliminates all risk — in the model.",
        code: `def delta_hedge_pnl(S_path, K, T, r, sigma, dt=1/252):
    """Simulate delta hedging P&L for a call seller."""
    pnl = 0
    for t in range(len(S_path) - 1):
        tau = T - t*dt
        if tau <= 0: break
        delta = bs_greeks(S_path[t], K, tau, r, sigma)["delta"]
        dS    = S_path[t+1] - S_path[t]
        # Hedge: sold call, bought delta shares
        pnl  += delta * dS     # Gain from stock hedge
        # In perfect GBM, cumulative P&L → 0 (perfect hedge)
    return pnl`,
      },
    ],
  },
  mentalModels: [
    { icon: "🛡️", title: "The Perfect Insurance Premium", body: "An option is insurance. You pay a premium today for the right to sell (put) or buy (call) at a fixed price in the future. The Black-Scholes formula computes the actuarially fair premium. Just as car insurance depends on your car value, your driving history, and the policy duration — the option premium depends on S (car value), σ (your driving risk), and T (policy duration).", insight: "Implied volatility IS the insurance premium expressed as a volatility percentage. When markets are scared (2008, 2020), implied vol spikes — the insurance becomes expensive. When markets are calm, implied vol falls — insurance is cheap." },
    { icon: "🔄", title: "The Perfect Hedge (and Why It Cannot Exist)", body: "The Black-Scholes logic: if you sell a call option, buy Δ shares of the stock. When the stock moves up, the call loses you money (you have to deliver the stock cheaply) — but your Δ shares gain money by exactly the same amount. The hedge is perfect — in a world of continuous trading, constant vol, and no jumps. Real markets have discrete trading, stochastic vol, and jumps. That is why implied vol smiles exist.", insight: "The vol smile is the market correcting for Black-Scholes being wrong. Out-of-the-money puts imply higher vol because real markets crash more than GBM predicts — buyers demand a crash risk premium." },
    { icon: "🗺️", title: "Implied Vol as a Map of Fear", body: "Plot implied volatility across all strikes and expiries for a stock. This is the volatility surface — a 3D map. At-the-money options are the centre. Out-of-the-money puts (crash protection) are higher vol (more expensive). The shape of the surface tells you exactly where the market sees risk: steep put skew = fear of crash; high short-term vol = immediate uncertainty; flat term structure = no particular event expected.", insight: "Every options trader looks at the vol surface before trading. It tells you: where is the market mispricing risk? Where can you buy cheap vol or sell expensive vol? The surface IS the market's collective fear distribution." },
  ],
  validation: [
    { claim: "Black-Scholes is the foundational model for options pricing", strength: "VERY STRONG", evidence: "Black & Scholes (1973) and Merton (1973) — Nobel Prize 1997. Fischer Black received it posthumously. The formula changed the options market immediately. CBOE introduced standardised options the same year (1973)." },
    { claim: "The vol smile proves Black-Scholes constant-σ assumption is violated", strength: "VERY STRONG", evidence: "The vol smile emerged after the 1987 crash and has been persistent ever since. Rubinstein (1994) documented it. Gatheral (2006) 'The Volatility Surface' extended the framework. Every practitioner knows BS is wrong but uses it as the universal language." },
  ],
  eli15: [
    { term: "Black-Scholes Formula", eli: "A formula that computes the fair price of an option given 5 inputs. The genius: it shows that if you continuously hedge a sold option by holding the right number of shares, all risk cancels out. This pinpoints a unique fair price. Five inputs: current price, strike, time, rate, and volatility." },
    { term: "Implied Volatility", eli: "Black-Scholes needs σ as an input. But nobody knows the future volatility. Instead: look at the option's market price, then back-solve — what σ makes the formula give that price? That is implied volatility. It is the market's consensus estimate of future volatility, embedded in the option price." },
    { term: "Delta (Δ)", eli: "A call with Δ=0.5 gains $0.50 when the stock rises $1. A call with Δ=0.9 (deep in-the-money) gains $0.90. Delta is how much stock exposure your option effectively represents. Market makers compute delta immediately and buy or sell the underlying stock to neutralise it." },
    { term: "The Vol Smile", eli: "If Black-Scholes were correct, all options on the same stock would have the same implied vol. In reality, out-of-the-money puts (downside protection) have higher IV than at-the-money options. This smile is proof that markets expect crashes more than GBM predicts. The smile is Black-Scholes being corrected by the market in real-time." },
    { term: "Theta (θ) — Time Decay", eli: "Every day that passes makes an option worth less — you have less time for a favourable move to happen. θ = −$5/day means the option loses $5 in value per day from the passage of time alone. Option SELLERS love theta. Option BUYERS fight it. Theta decay accelerates dramatically in the final weeks before expiry." },
  ],
};

const ARMA_DATA = {
  overview: {
    color: C.amber,
    what: "ARMA (AutoRegressive Moving Average) models are the foundational building blocks of time series analysis in quantitative finance. AR terms capture how today's return depends on past returns. MA terms capture how today's return depends on past shocks. ARIMA extends this by adding differencing to handle non-stationary price levels.",
    why: "Before GARCH, ML, and neural networks, ARMA was the standard forecasting toolkit. It is still the baseline every model must beat. Understanding ARMA gives you the language to discuss serial correlation, stationarity, and the Box-Jenkins methodology underlying all modern time series work.",
    when: "Use ARMA for: baseline return forecasting, identifying serial correlation in residuals, order selection for the mean equation in ARIMA+GARCH strategies, testing whether a series has predictable structure.",
    stats: [{ value: "AR(p)", label: "AutoRegressive: today depends on last p return values" }, { value: "MA(q)", label: "Moving Average: today depends on last q shock terms" }, { value: "ARIMA", label: "Adds differencing for non-stationary price series" }],
    keyFacts: [
      "White noise ε_t ~ iid N(0,σ²) is the baseline: no predictable structure, no autocorrelation.",
      "AR(1): X_t = φ·X_{t-1} + ε_t. Stationary if |φ| < 1. φ=1 is a random walk (unit root).",
      "MA(1): X_t = ε_t + θ·ε_{t-1}. Always stationary — shocks decay after q periods.",
      "ARMA(p,q): X_t = Σφᵢ·X_{t-i} + ε_t + Σθⱼ·ε_{t-j}. Most real series require both components.",
      "Model selection: minimise AIC/BIC across a grid of (p,q) combinations. AIC favours larger models; BIC penalises complexity more harshly.",
    ],
  },
  deepdive: {
    color: C.amber,
    sections: [
      {
        title: "The Model Family",
        body: "White noise → AR(1) → MA(1) → ARMA(1,1) → ARIMA(1,1,1). Each step adds one layer of structure. Understanding the progression reveals what each component actually captures.",
        code: `import numpy as np

def simulate_ar1(phi, n=500, sigma=1.0):
    X = np.zeros(n)
    for t in range(1, n):
        X[t] = phi*X[t-1] + np.random.normal(0, sigma)
    return X
# phi=0.8:  strong autocorrelation, slow mean reversion
# phi=-0.8: alternating signs, fast mean reversion
# phi=1.0:  RANDOM WALK — non-stationary!

def simulate_ma1(theta, n=500, sigma=1.0):
    eps = np.random.normal(0, sigma, n)
    X = eps.copy()
    X[1:] += theta * eps[:-1]
    return X  # Always stationary regardless of theta`,
      },
      {
        title: "ACF/PACF Order Identification",
        body: "ACF and PACF plots reveal the AR and MA orders. AR(p): PACF cuts off at lag p, ACF decays gradually. MA(q): ACF cuts off at lag q, PACF decays gradually. ARMA(p,q): both decay gradually — use AIC/BIC grid search instead.",
        code: `import statsmodels.api as sm
import itertools, warnings
warnings.filterwarnings("ignore")

def select_arma(returns, max_p=3, max_q=3):
    best_aic, best_order = np.inf, (0, 0, 0)
    for p, q in itertools.product(range(max_p+1),
                                   range(max_q+1)):
        try:
            m = sm.tsa.ARIMA(returns, order=(p,0,q)).fit()
            if m.aic < best_aic:
                best_aic = m.aic
                best_order = (p, 0, q)
        except: pass
    print(f"Best ARMA order: {best_order}, AIC={best_aic:.1f}")
    return best_order`,
      },
      {
        title: "Residual Diagnostics",
        body: "After fitting an ARMA model, the residuals must be white noise. Ljung-Box tests for remaining autocorrelation. Any significant autocorrelation means the model is misspecified — increase p or q.",
        code: `def fit_and_diagnose(series, order=(1,0,1)):
    model = sm.tsa.ARIMA(series, order=order).fit()
    resid = model.resid
    # Ljung-Box: H0 = residuals are white noise
    lb_p = sm.stats.acorr_ljungbox(
        resid, lags=10, return_df=False)[1][-1]
    print(f"Ljung-Box p={lb_p:.4f} — "
          f"{'White noise ✓' if lb_p > 0.05 else 'Autocorrelation remains ✗'}")
    # One-step-ahead forecast
    fc = model.forecast(steps=1)
    print(f"Next-period forecast: {fc[0]:.4f}")
    return model, fc[0]`,
      },
    ],
  },
  mentalModels: [
    { icon: "📺", title: "Yesterday's News", body: "AR says: today's return is partly explained by yesterday's return (and the day before, etc.). It is like reading yesterday's newspaper to predict today's headlines. The news has faded — yesterday's move is only a fraction (φ) of today's story. The further back you go, the fainter the echo. AR captures this fading memory.", insight: "AR(1) with φ=0.8 means yesterday's return explains 80% of today's expected return (above the mean). With φ=0.2, only 20%. For financial returns, φ is usually small — the autocorrelation is real but weak." },
    { icon: "💥", title: "Shock Decay (MA Terms)", body: "Imagine dropping a stone in still water. The ripples spread outward and gradually fade. MA says: today's return is partly driven by past random shocks (the stone drops), with each shock fading after q periods. After q periods, the shocks are completely gone. AR memory is infinite and decays gradually; MA memory is finite and cuts off sharply.", insight: "MA and AR are not competing — most real series have both. AR = the trend echoing forward. MA = the shock ripples fading. ARMA(1,1) is usually sufficient for daily financial returns." },
    { icon: "🔊", title: "Signal vs Noise", body: "A radio broadcast has a signal (the intended programme) and noise (static, interference). ARMA models the signal. The AR component is the part of today's return that echoes past returns (structured signal). The MA component is the part driven by past random shocks (decaying interference). The residual ε_t is the new, completely unpredictable noise arriving today.", insight: "The goal is to extract the predictable signal (AR + MA components) and isolate the white noise residual. If the residual still has structure (fails Ljung-Box), your model has not captured all the signal yet." },
  ],
  validation: [
    { claim: "ARMA/ARIMA captures autocorrelation structure in financial time series", strength: "STRONG", evidence: "Box & Jenkins (1970) 'Time Series Analysis' — foundational textbook. Autocorrelation in financial returns (especially in volatility) is extensively documented. ARIMA is the standard benchmark all modern forecasting models are tested against." },
    { claim: "AIC/BIC model selection correctly penalises overfitting in order identification", strength: "STRONG", evidence: "Akaike (1974) AIC, Schwarz (1978) BIC. Both proven to select appropriate model complexity. BIC is more conservative and tends to select simpler models. Standard in every time series software package globally." },
  ],
  eli15: [
    { term: "White Noise", eli: "The null hypothesis of time series analysis: completely random, zero memory, no pattern. Flipping a fair coin — past flips tell you nothing about the next. If returns were pure white noise, no strategy could ever work. In practice some structure exists, which is what ARMA tries to find and quantify." },
    { term: "AR — AutoRegressive", eli: "Today's return is partly a scaled echo of yesterday's return. φ=0.5 means: if yesterday was unusually high (+2%), today will be somewhat above average (+1%) plus new random noise. AR captures momentum-like patterns at short horizons. If φ=1, it is a random walk — no reversion ever." },
    { term: "MA — Moving Average", eli: "Today's return is partly driven by yesterday's surprise, not yesterday's return. If yesterday's market got shocking bad news (negative shock), today is somewhat affected by that surprise. MA shocks die out after exactly q periods. Short memory, clean cutoff." },
    { term: "AIC vs BIC", eli: "When choosing between ARMA(1,0), ARMA(1,1), ARMA(2,1) etc., AIC and BIC score each model. They reward good fit and penalise extra parameters. BIC penalises parameters more heavily. The model with the lowest score wins. This prevents you from adding lags forever to improve fit while actually just overfitting." },
    { term: "Ljung-Box Test", eli: "After fitting your ARMA model, check the residuals. If they still have autocorrelation, your model missed something. Ljung-Box tests this. p>0.05 means the residuals are white noise — you captured all the structure. p<0.05 means there is still predictable content in the residuals — increase p or q." },
  ],
};

const BACKTEST_DATA = {
  overview: {
    color: C.blue,
    what: "Backtesting simulates how a trading strategy would have performed on historical data. The gap between a research backtest (fast, vectorised, dangerous) and an event-driven backtest (slow, realistic, trustworthy) is the difference between a strategy that looks great on paper and one that actually works live.",
    why: "A poorly built backtest gives false confidence. You deploy capital based on a Sharpe-3 backtest and immediately start losing money. A correctly built backtest catches issues before they cost real money. The goal: maximum correlation between backtest results and live performance.",
    when: "Always backtest before deploying any systematic strategy. Research backtests for fast idea exploration. Event-driven backtests for final pre-deployment validation. Walk-forward testing to get honest out-of-sample performance estimates.",
    stats: [{ value: "3 biases", label: "Look-ahead, survivorship, and optimisation — each can make a loser look like a winner" }, { value: "Walk-forward", label: "The correct methodology: train on first 70%, evaluate on last 30%" }, { value: "Event-driven", label: "The gold standard: simulates actual order flow and fills" }],
    keyFacts: [
      "Research backtest: vectorised using pandas/numpy. Fast but easy to corrupt with look-ahead bias. For exploration only.",
      "Event-driven backtest: processes data bar by bar, maintains full simulation of orders, fills, and portfolio. Slower, much more reliable.",
      "Look-ahead bias: using data not available at trade time. The most common and dangerous flaw.",
      "Survivorship bias: testing only on assets still alive today. Dead companies are missing. Overstates returns by 1-2%+ per year.",
      "Optimisation bias: fitting parameters to in-sample data. Always validate on unseen out-of-sample data.",
    ],
  },
  deepdive: {
    color: C.blue,
    sections: [
      {
        title: "The Three Biases",
        body: "Understanding and eliminating the three major biases is the core engineering skill of backtesting. Each one can make a completely unprofitable strategy appear to have strong historical performance.",
        code: `# 1. LOOK-AHEAD BIAS — most common
# Wrong: signal uses today's close to trade AT the close
signal = (close[t] > close[t-1])  # Uses today's close!
fill   = close[t]                  # Can't trade at this price

# Correct: signal uses only past data, fill next day's open
signal = (close[t-1] > close[t-2])  # Yesterday's close
fill   = open_price[t+1]            # Next day's open

# 2. SURVIVORSHIP BIAS
# Wrong: load today's S&P500 constituents, backtest from 2000
# Correct: use point-in-time constituent data from each date

# 3. OPTIMISATION BIAS (data snooping)
# Wrong: try 1000 parameter combos, report the best
# Correct: optimise on train set, report ONLY test set result
train = prices[:int(len(prices)*0.7)]
test  = prices[int(len(prices)*0.7):]
best_params = optimise(train)  # Fit on train only
result = evaluate(test, best_params)  # Report test ONLY`,
      },
      {
        title: "Transaction Costs",
        body: "Many strategies that look profitable before costs become losers after. Always include commission + slippage + spread. For high-frequency strategies, costs can easily exceed gross returns.",
        code: `class TxCosts:
    def __init__(self, commission_bps=5,
                 slippage_bps=10, spread_bps=5):
        # Total round-trip cost in basis points
        self.bps = commission_bps + slippage_bps + spread_bps

    def fill_price(self, price, direction):
        # direction: +1 buy (pay more), -1 sell (receive less)
        return price * (1 + direction * self.bps/10000)

# Reality check:
# 20 bps round-trip x 200 trades/year = 4%/year in costs
# Strategy earning 5% gross => 1% net after costs
# Not worth the risk for that margin`,
      },
      {
        title: "Walk-Forward Testing",
        body: "The correct validation method. Split data chronologically. Train on the first portion. Test on the held-out portion. Never let test data touch the training process. Report only test-period performance.",
        code: `def walk_forward(prices, returns, train_frac=0.7,
                  n_windows=5):
    results = []
    n = len(prices)
    window = n // n_windows
    for i in range(n_windows - 1):
        train_end = (i + 1) * window
        test_end  = min(train_end + window, n)
        train_r = returns[:train_end]
        test_r  = returns[train_end:test_end]
        # Optimise ONLY on train
        params = optimise_strategy(train_r)
        # Evaluate ONLY on test
        oos_sharpe = evaluate_strategy(test_r, params)
        results.append(oos_sharpe)
        print(f"Window {i+1}: OOS Sharpe={oos_sharpe:.2f}")
    print(f"Mean OOS Sharpe: {np.mean(results):.2f}")
    return results`,
      },
    ],
  },
  mentalModels: [
    { icon: "📰", title: "The Newspaper Test", body: "Imagine trading using tomorrow's newspaper to make today's decision. You would win every time. Look-ahead bias is this — but subtle. It hides in places like: using a stock's final ticker symbol instead of its symbol at the time, using forward-adjusted prices in a non-forward-adjusted strategy, using quarterly earnings data before the release date. The test: for every data point you use, ask 'would I have had this exact data at trade time?'", insight: "Look-ahead bias is the most dangerous because it is silent. It produces no errors and no warnings. The only way to detect it is meticulous design review before running the backtest." },
    { icon: "🪦", title: "The Cemetery Problem", body: "You are writing a history of successful people who started businesses in 2000. You can only interview people who are still alive in 2026. The people who failed and died (businesses that went bankrupt) are invisible to you. Your history will be wildly optimistic. Survivorship bias in backtesting is identical: testing on the S&P500 as it exists today means all companies that failed between 2000 and 2026 are missing from your dataset.", insight: "The larger the time horizon of your backtest, the worse survivorship bias becomes. Strategies that 'avoid losers' look especially good because the losers were never in your test universe to begin with." },
    { icon: "🎯", title: "The Overfitted Suit", body: "A perfectly tailored suit fits you exactly in December 2024 but may not fit in December 2026 after you gained weight or changed shape. An overfitted strategy is tailored perfectly to historical data — it knows every bump and quirk of 2015-2024. Come 2025, it encounters a different 'shape' of market and falls apart. Walk-forward testing is trying on the suit in a fitting room that simulates next year's body, not this year's.", insight: "A strategy with Sharpe 4.0 in-sample and Sharpe 0.3 out-of-sample is not a strategy. It is a memorisation of historical noise. The gap between in-sample and out-of-sample Sharpe is your measure of overfitting." },
  ],
  validation: [
    { claim: "Look-ahead bias is the most common cause of backtest failure in live trading", strength: "VERY STRONG", evidence: "Lopez de Prado (2018) 'Advances in Financial Machine Learning' dedicates entire chapters to look-ahead and related biases. Survey data consistently shows it as the primary cause of strategy degradation from backtest to live trading." },
    { claim: "Survivorship bias overstates strategy returns by 1-2%+ per year", strength: "VERY STRONG", evidence: "Elton, Gruber & Blake (1996) quantified 0.9-2.0% per year in mutual fund databases. Brown, Goetzmann & Ross (1995) confirmed in hedge fund data. Standard finding across all empirical finance research." },
    { claim: "Walk-forward testing is the correct method to estimate out-of-sample performance", strength: "STRONG", evidence: "Pardo (2008) 'The Evaluation and Optimization of Trading Strategies'. Bailey et al. (2014) 'The Probability of Backtest Overfitting'. Standard in all serious systematic trading firms." },
  ],
  eli15: [
    { term: "Research Backtest", eli: "A research backtest is like doing maths in your head. Fast and useful for exploring ideas. But it is easy to make mistakes — accidentally using tomorrow's data to predict today. Fine for quick exploration. Never use it to make real capital decisions." },
    { term: "Event-Driven Backtest", eli: "A full simulation of your trading desk. Every price tick arrives one at a time. The system decides what to do, places an order, gets a fill with realistic cost and delay, updates the portfolio. Much harder to build, but also much harder to accidentally cheat." },
    { term: "Look-Ahead Bias", eli: "Using tomorrow's newspaper to make today's bet. In backtesting, it hides in subtle places: using closing prices to generate signals that supposedly execute AT the close, using constituent data from today to test what would have been in the index years ago. Silent, no error messages, completely lethal to backtest validity." },
    { term: "Walk-Forward Testing", eli: "Split your data in time: train on the first 70%, test on the last 30%. Report only the test period performance. The test data was never touched during development. This gives you the honest answer to: does this strategy actually work, or did I just fit noise?" },
    { term: "Transaction Cost Reality Check", eli: "Backtest shows 20% annual return. Sounds great. Add 5 bps commission + 10 bps slippage + 5 bps spread = 20 bps per round trip. 200 trades per year = 4% annual cost. Your 20% becomes 16%. If your gross was 5% — you are losing money. Always calculate the cost load before getting excited about gross returns." },
  ],
};

// ── 40 STABLE WRAPPER COMPONENTS ─────────────────────────────
const OUOverview    = () => <GenericOverview    {...OU_DATA.overview} />;
const OUDeepDive    = () => <GenericDeepDive    {...OU_DATA.deepdive} />;
const OUMental      = () => <GenericMentalModel models={OU_DATA.mentalModels} color={OU_DATA.overview.color} />;
const OUValidation  = () => <GenericValidation  entries={OU_DATA.validation} />;
const OUELI15       = () => <GenericELI15       items={OU_DATA.eli15} color={OU_DATA.overview.color} />;

const ARIGARCHOverview   = () => <GenericOverview    {...ARIGARCH_DATA.overview} />;
const ARIGARCHDeepDive   = () => <GenericDeepDive    {...ARIGARCH_DATA.deepdive} />;
const ARIGARCHMental     = () => <GenericMentalModel models={ARIGARCH_DATA.mentalModels} color={ARIGARCH_DATA.overview.color} />;
const ARIGARCHValidation = () => <GenericValidation  entries={ARIGARCH_DATA.validation} />;
const ARIGARCHELI15      = () => <GenericELI15       items={ARIGARCH_DATA.eli15} color={ARIGARCH_DATA.overview.color} />;

const KalmanOverview   = () => <GenericOverview    {...KALMAN_DATA.overview} />;
const KalmanDeepDive   = () => <GenericDeepDive    {...KALMAN_DATA.deepdive} />;
const KalmanMental     = () => <GenericMentalModel models={KALMAN_DATA.mentalModels} color={KALMAN_DATA.overview.color} />;
const KalmanValidation = () => <GenericValidation  entries={KALMAN_DATA.validation} />;
const KalmanELI15      = () => <GenericELI15       items={KALMAN_DATA.eli15} color={KALMAN_DATA.overview.color} />;

const HMMOverview   = () => <GenericOverview    {...HMM_DATA.overview} />;
const HMMDeepDive   = () => <GenericDeepDive    {...HMM_DATA.deepdive} />;
const HMMMental     = () => <GenericMentalModel models={HMM_DATA.mentalModels} color={HMM_DATA.overview.color} />;
const HMMValidation = () => <GenericValidation  entries={HMM_DATA.validation} />;
const HMMELI15      = () => <GenericELI15       items={HMM_DATA.eli15} color={HMM_DATA.overview.color} />;

const GBMOverview   = () => <GenericOverview    {...GBM_DATA.overview} />;
const GBMDeepDive   = () => <GenericDeepDive    {...GBM_DATA.deepdive} />;
const GBMMental     = () => <GenericMentalModel models={GBM_DATA.mentalModels} color={GBM_DATA.overview.color} />;
const GBMValidation = () => <GenericValidation  entries={GBM_DATA.validation} />;
const GBMELI15      = () => <GenericELI15       items={GBM_DATA.eli15} color={GBM_DATA.overview.color} />;

const MROverview   = () => <GenericOverview    {...MR_DATA.overview} />;
const MRDeepDive   = () => <GenericDeepDive    {...MR_DATA.deepdive} />;
const MRMental     = () => <GenericMentalModel models={MR_DATA.mentalModels} color={MR_DATA.overview.color} />;
const MRValidation = () => <GenericValidation  entries={MR_DATA.validation} />;
const MRELI15      = () => <GenericELI15       items={MR_DATA.eli15} color={MR_DATA.overview.color} />;

const COINTOverview   = () => <GenericOverview    {...COINT_DATA.overview} />;
const COINTDeepDive   = () => <GenericDeepDive    {...COINT_DATA.deepdive} />;
const COINTMental     = () => <GenericMentalModel models={COINT_DATA.mentalModels} color={COINT_DATA.overview.color} />;
const COINTValidation = () => <GenericValidation  entries={COINT_DATA.validation} />;
const COINTELI15      = () => <GenericELI15       items={COINT_DATA.eli15} color={COINT_DATA.overview.color} />;

const BSOverview   = () => <GenericOverview    {...BS_DATA.overview} />;
const BSDeepDive   = () => <GenericDeepDive    {...BS_DATA.deepdive} />;
const BSMental     = () => <GenericMentalModel models={BS_DATA.mentalModels} color={BS_DATA.overview.color} />;
const BSValidation = () => <GenericValidation  entries={BS_DATA.validation} />;
const BSELI15      = () => <GenericELI15       items={BS_DATA.eli15} color={BS_DATA.overview.color} />;

const ARMAOverview   = () => <GenericOverview    {...ARMA_DATA.overview} />;
const ARMADeepDive   = () => <GenericDeepDive    {...ARMA_DATA.deepdive} />;
const ARMAMental     = () => <GenericMentalModel models={ARMA_DATA.mentalModels} color={ARMA_DATA.overview.color} />;
const ARMAValidation = () => <GenericValidation  entries={ARMA_DATA.validation} />;
const ARMAELI15      = () => <GenericELI15       items={ARMA_DATA.eli15} color={ARMA_DATA.overview.color} />;

const BTOverview   = () => <GenericOverview    {...BACKTEST_DATA.overview} />;
const BTDeepDive   = () => <GenericDeepDive    {...BACKTEST_DATA.deepdive} />;
const BTMental     = () => <GenericMentalModel models={BACKTEST_DATA.mentalModels} color={BACKTEST_DATA.overview.color} />;
const BTValidation = () => <GenericValidation  entries={BACKTEST_DATA.validation} />;
const BTELI15      = () => <GenericELI15       items={BACKTEST_DATA.eli15} color={BACKTEST_DATA.overview.color} />;

// ── LIBRARY DATA ─────────────────────────────────────────────
// To add a new article: push a new object into ARTICLES.
// All section components referenced here must be defined above.
const ARTICLES = [
  {
    id: "world-cup-bot",
    title: "Trading the FIFA World Cup Like a Quant",
    subtitle: "Shock-recovery strategy for Polymarket — FIFA World Cup 2026",
    author: "RohOnChain",
    handle: "@RohOnChain",
    date: "Jun 6, 2026",
    difficulty: "INTERMEDIATE",
    color: C.accent,
    tags: ["Prediction Markets", "Sports Trading", "Python", "Strategy"],
    stats: ["104 matches", "$1.4B market", "135% backtest ROI"],
    description: "Complete breakdown of a systematic shock-recovery trading bot built for Polymarket during FIFA World Cup 2026. Covers price shock detection, five-dimension market classification, building historical depth distributions from the Dome API, and laddered limit order execution.",
    sourceUrl: "https://x.com/rohonchain/status/2061814989279949126",
    sections: [
      { id: "overview",   label: "Overview",        component: OverviewTab },
      { id: "shock",      label: "Shock Detection", component: ShockTab },
      { id: "classifier", label: "5D Classifier",   component: ClassifierTab },
      { id: "dist",       label: "Distributions",   component: DistributionsTab },
      { id: "ladder",     label: "Ladder",           component: LadderTab },
      { id: "example",    label: "Worked Example",  component: WorkedExampleTab },
      { id: "math",       label: "The Math",         component: MathTab },
      { id: "results",    label: "Results",          component: ResultsTab },
      { id: "eli15",      label: "Math: ELI15",      component: MathELI15Tab },
    ],
  },
  {
    id: "bimba-10-strategies",
    title: "10 Strategies That Turned Polymarket Trading From Gambling Into a Money Printer",
    subtitle: "A complete mental firmware upgrade for systematic Polymarket extraction",
    author: "Bimba",
    handle: "@BimbaCrypto",
    date: "Jun 2026",
    difficulty: "BEGINNER",
    color: C.amber,
    tags: ["Polymarket", "Strategy", "Copy Trading", "Psychology", "Sports"],
    stats: ["55% → 82% hit rate", "3× win size", "10 parallel plays"],
    description: "A self-described 'mental firmware upgrade' for trading Polymarket as a systematic extraction machine. Covers 10 parallel strategies — from hyper-low-probability snipes and 5-minute BTC windows to resolution rule exploits, whale copy trading, and the AI feedback loop that ties them all together. Each strategy validated against peer-reviewed research and live Polymarket data.",
    sourceUrl: "https://x.com/BimbaCrypto",
    sections: [
      { id: "overview",    label: "Overview",          component: BimbaOverviewTab },
      { id: "strategies",  label: "10 Strategies",     component: TenStrategiesTab },
      { id: "validation",  label: "Validation",        component: BimbaValidationTab },
      { id: "firmware",    label: "Mental Firmware",   component: BimbaMindTab },
    ],
  },
  {
    id: "quantstart-beginners-guide",
    title: "The Complete Beginner's Guide to Quantitative Trading",
    subtitle: "Strategy identification, backtesting, execution, and risk management — from scratch",
    author: "QuantStart",
    handle: "quantstart.com",
    date: "2024",
    difficulty: "BEGINNER",
    color: C.blue,
    tags: ["Foundations", "Backtesting", "Kelly Criterion", "Python", "Risk Management"],
    stats: ["4 system pillars", "3 bias types explained", "Kelly Criterion derived"],
    description: "QuantStart's foundational guide to building a complete quantitative trading system. Covers strategy identification (mean reversion vs momentum, trading frequency spectrum), backtesting pitfalls (look-ahead bias, survivorship bias, optimisation bias), execution systems and transaction costs, and risk management via both forms of the Kelly Criterion.",
    sourceUrl: "https://www.quantstart.com/articles/Beginners-Guide-to-Quantitative-Trading/",
    sections: [
      { id: "overview",  label: "Overview",     component: QSOverviewTab },
      { id: "pillars",   label: "The 4 Pillars", component: QSDeepDiveTab },
      { id: "valid",     label: "Validation",   component: QSValidationTab },
      { id: "eli15",     label: "ELI15",         component: QSELI15Tab },
    ],
  },
  {
    id: "zen-of-quant-trading",
    title: "The Zen of Quantitative Trading",
    subtitle: "A $1.5B hedge fund's philosophy on finding structure in market noise",
    author: "IKOS Asset Management",
    handle: "thehedgefundjournal.com",
    date: "2024",
    difficulty: "INTERMEDIATE",
    color: "#7c3aed",
    tags: ["Philosophy", "GARCH", "Cointegration", "Fat Tails", "Hedge Funds"],
    stats: ["$1.5B AUM", "7 asset classes", "70+ quant professionals"],
    description: "Written by IKOS Asset Management for The Hedge Fund Journal. A practitioner's philosophy on what quantitative trading really is: the search for structure in noisy market data. Covers GARCH volatility clustering, cointegration for pairs trading, fat tail risk, overfitting hazards, and why a portfolio of uncorrelated models outperforms any single strategy.",
    sourceUrl: "https://thehedgefundjournal.com/the-zen-of-quantitative-trading/",
    sections: [
      { id: "overview",  label: "Overview",      component: ZenOverviewTab },
      { id: "concepts",  label: "Key Concepts",  component: ZenConceptsTab },
      { id: "valid",     label: "Validation",    component: ZenValidationTab },
      { id: "eli15",     label: "ELI15",          component: ZenELI15Tab },
    ],
  },
  {
    id: "9-quant-strategies-2026",
    title: "9 Quant Trading Strategies That Actually Work in 2026",
    subtitle: "Edge sources, realistic Sharpe ratios, and who runs them — the complete picture",
    author: "Quantt",
    handle: "quantt.co.uk",
    date: "May 2026",
    difficulty: "ADVANCED",
    color: C.red,
    tags: ["Statistical Arbitrage", "Market Making", "Momentum", "HFT", "ML", "Crypto"],
    stats: ["9 strategies", "Sharpe 0.5–20+", "Citadel · IMC · D.E. Shaw"],
    description: "Quantt's 2026 guide to every major systematic trading strategy: statistical arbitrage, pairs trading, market making, momentum, mean reversion, machine learning, options volatility, HFT, and crypto quant. Each entry includes realistic Sharpe ratios, edge sources, the firms that run it at scale, and an implementation approach — plus a frank warning on backtest bias.",
    sourceUrl: "https://www.quantt.co.uk/resources/quant-trading-strategies-guide",
    sections: [
      { id: "overview",    label: "Overview",          component: NineOverviewTab },
      { id: "strategies",  label: "Strategy Explorer", component: NineStrategiesTab },
      { id: "valid",       label: "Validation",        component: NineValidationTab },
      { id: "eli15",       label: "ELI15",              component: NineELI15Tab },
    ],
  },
  {
    id: "symbols-glossary",
    title: "Quant Symbols & Formulas Glossary",
    subtitle: "Every symbol, metric, and formula in the library — searchable, with ELI15 explanations",
    author: "Quant Library",
    handle: "reference",
    date: "Ongoing",
    difficulty: "REFERENCE",
    color: "#8b5cf6",
    tags: ["Greek Letters", "Math Notation", "Statistics", "Finance", "Formulas"],
    stats: ["36 entries", "6 categories", "Fully searchable"],
    description: "An interactive, searchable reference for every mathematical symbol, statistical concept, finance metric, and key formula that appears across the library. Each entry shows a formal definition, a plain-English explanation, and an ELI15 analogy. Don't read like a dumb-dumb — look it up here first.",
    sourceUrl: null,
    sections: [
      { id: "search",    label: "Search All",    component: GlossaryHomeTab },
      { id: "greek",     label: "Greek Letters", component: GlossaryGreekTab },
      { id: "formulas",  label: "Formulas",      component: GlossaryFormulasTab },
    ],
  },
  {
    id: "ornstein-uhlenbeck",
    title: "The Ornstein-Uhlenbeck Process",
    subtitle: "Mean reversion modelled: half-life, parameter estimation, and pairs trading signals",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "INTERMEDIATE", color: C.accent,
    tags: ["Mean Reversion", "Pairs Trading", "Stochastic Processes", "Python"],
    stats: ["Half-life formula", "OLS estimation", "Z-score signals"],
    description: "The mathematical foundation of pairs trading and spread strategies. Covers the OU SDE (dX=θ(μ−X)dt+σdW), discrete-time parameter estimation via OLS regression, half-life calculation, and building a pairs trading signal from the OU z-score. Includes mental models, Python code, and validation against the Vasicek and CIR interest rate models.",
    sourceUrl: "https://www.quantstart.com/articles/Ornstein-Uhlenbeck-Simulation-with-Python/",
    sections: [
      { id: "overview",  label: "Overview",       component: OUOverview },
      { id: "model",     label: "The Model",      component: OUDeepDive },
      { id: "mental",    label: "Mental Models",  component: OUMental },
      { id: "valid",     label: "Validation",     component: OUValidation },
      { id: "eli15",     label: "ELI15",          component: OUELI15 },
    ],
  },
  {
    id: "arima-garch-strategy",
    title: "ARIMA + GARCH Trading Strategy on the S&P500",
    subtitle: "Combine time series mean and variance models into a complete directional strategy",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "INTERMEDIATE", color: C.amber,
    tags: ["ARIMA", "GARCH", "Time Series", "S&P500", "Python"],
    stats: ["Rolling window refit", "AIC order selection", "Direction + volatility signals"],
    description: "QuantStart's complete ARIMA+GARCH strategy applied to the S&P500. ARIMA forecasts the direction of next-day returns. GARCH forecasts their volatility. A daily rolling window keeps both models current. Covers AIC order selection, combined signal generation, position sizing, and honest out-of-sample backtest construction.",
    sourceUrl: "https://www.quantstart.com/articles/ARIMA-GARCH-Trading-Strategy-on-the-SP500-Stock-Market-Index-Using-R/",
    sections: [
      { id: "overview",  label: "Overview",       component: ARIGARCHOverview },
      { id: "model",     label: "The Model",      component: ARIGARCHDeepDive },
      { id: "mental",    label: "Mental Models",  component: ARIGARCHMental },
      { id: "valid",     label: "Validation",     component: ARIGARCHValidation },
      { id: "eli15",     label: "ELI15",          component: ARIGARCHELI15 },
    ],
  },
  {
    id: "kalman-filter",
    title: "State Space Models and the Kalman Filter",
    subtitle: "The optimal Bayesian estimator for hidden states — applied to dynamic hedge ratios",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "ADVANCED", color: C.blue,
    tags: ["Kalman Filter", "State Space", "Pairs Trading", "Bayesian", "Python"],
    stats: ["Predict-Update cycle", "Dynamic β estimation", "No lookback window"],
    description: "The Kalman Filter — originally built for NASA's Apollo program — tracks time-varying hidden states from noisy observations. In trading, it dynamically estimates the hedge ratio between two cointegrated assets, continuously updating as prices arrive. Covers the state space model, the predict-update algorithm, Q/R tuning, and the TLT/IEI pairs trading application.",
    sourceUrl: "https://www.quantstart.com/articles/State-Space-Models-and-the-Kalman-Filter/",
    sections: [
      { id: "overview",  label: "Overview",       component: KalmanOverview },
      { id: "model",     label: "The Model",      component: KalmanDeepDive },
      { id: "mental",    label: "Mental Models",  component: KalmanMental },
      { id: "valid",     label: "Validation",     component: KalmanValidation },
      { id: "eli15",     label: "ELI15",          component: KalmanELI15 },
    ],
  },
  {
    id: "hidden-markov-models",
    title: "Hidden Markov Models for Market Regime Detection",
    subtitle: "Detect bull, bear, and sideways regimes — and switch strategies accordingly",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "ADVANCED", color: "#e879f9",
    tags: ["HMM", "Regime Detection", "Machine Learning", "hmmlearn", "Python"],
    stats: ["Baum-Welch training", "Posterior probabilities", "Strategy switching"],
    description: "Hidden Markov Models treat markets as systems switching between hidden regimes (bull/bear/sideways) that emit characteristic return distributions. The Baum-Welch EM algorithm learns the regimes automatically from unlabelled return data. Covers model structure, training, Viterbi decoding, posterior probability signals, and regime-based strategy switching.",
    sourceUrl: "https://www.quantstart.com/articles/market-regime-detection-using-hidden-markov-models-in-qstrader/",
    sections: [
      { id: "overview",  label: "Overview",       component: HMMOverview },
      { id: "model",     label: "The Model",      component: HMMDeepDive },
      { id: "mental",    label: "Mental Models",  component: HMMMental },
      { id: "valid",     label: "Validation",     component: HMMValidation },
      { id: "eli15",     label: "ELI15",          component: HMMELI15 },
    ],
  },
  {
    id: "geometric-brownian-motion",
    title: "Geometric Brownian Motion",
    subtitle: "The foundation of Black-Scholes, Monte Carlo simulation, and stochastic calculus",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "INTERMEDIATE", color: C.accent,
    tags: ["GBM", "Stochastic Calculus", "Monte Carlo", "Options", "Ito's Lemma"],
    stats: ["dS=μSdt+σSdW", "Ito correction (−σ²/2)", "Monte Carlo pricing"],
    description: "Geometric Brownian Motion is the mathematical bedrock of modern quantitative finance. Covers the GBM SDE and its exact solution via Ito's Lemma, the Ito correction term and why it matters, Python simulation, and Monte Carlo European option pricing — showing how any option can be priced without an analytical formula.",
    sourceUrl: "https://www.quantstart.com/articles/Geometric-Brownian-Motion/",
    sections: [
      { id: "overview",  label: "Overview",       component: GBMOverview },
      { id: "model",     label: "The Model",      component: GBMDeepDive },
      { id: "mental",    label: "Mental Models",  component: GBMMental },
      { id: "valid",     label: "Validation",     component: GBMValidation },
      { id: "eli15",     label: "ELI15",          component: GBMELI15 },
    ],
  },
  {
    id: "mean-reversion-testing",
    title: "Statistical Mean Reversion Testing",
    subtitle: "ADF test, Hurst Exponent, and half-life — confirming a spread is actually tradeable",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "INTERMEDIATE", color: C.amber,
    tags: ["ADF Test", "Hurst Exponent", "Half-Life", "Pairs Trading", "Statistics"],
    stats: ["ADF p<0.05", "Hurst H<0.5", "Half-life = ln(2)/θ"],
    description: "Before committing capital to any pairs trade, you must confirm the spread is genuinely mean-reverting — not just a random walk that looks like it reverts. Covers the Augmented Dickey-Fuller test, the Hurst Exponent via variance ratio, and the half-life calculation from an AR(1) regression. All three tests should agree before you trade.",
    sourceUrl: "https://www.quantstart.com/articles/Basics-of-Statistical-Mean-Reversion-Testing/",
    sections: [
      { id: "overview",  label: "Overview",       component: MROverview },
      { id: "model",     label: "The Tests",      component: MRDeepDive },
      { id: "mental",    label: "Mental Models",  component: MRMental },
      { id: "valid",     label: "Validation",     component: MRValidation },
      { id: "eli15",     label: "ELI15",          component: MRELI15 },
    ],
  },
  {
    id: "cointegration-analysis",
    title: "Cointegrated Time Series Analysis for Mean Reversion Trading",
    subtitle: "Engle-Granger, Johansen, and the formal statistical foundation of pairs trading",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "INTERMEDIATE", color: C.accent,
    tags: ["Cointegration", "Pairs Trading", "Engle-Granger", "Johansen", "Statistics"],
    stats: ["Nobel 2003", "Two-step EG test", "Multi-asset Johansen"],
    description: "Cointegration is the formal statistical foundation of pairs trading. Covers the mathematical definition of I(0) and I(1) series, the Engle-Granger two-step test, the Johansen multivariate test for 3+ assets, cointegrating vector extraction, and breakdown detection using rolling z-scores.",
    sourceUrl: "https://www.quantstart.com/articles/cointegrated-time-series-analysis-for-mean-reversion-trading-with-r/",
    sections: [
      { id: "overview",  label: "Overview",       component: COINTOverview },
      { id: "model",     label: "The Tests",      component: COINTDeepDive },
      { id: "mental",    label: "Mental Models",  component: COINTMental },
      { id: "valid",     label: "Validation",     component: COINTValidation },
      { id: "eli15",     label: "ELI15",          component: COINTELI15 },
    ],
  },
  {
    id: "black-scholes-pricing",
    title: "Derivatives Pricing I — Black-Scholes Model",
    subtitle: "Deriving and implementing the most important formula in quantitative finance",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "ADVANCED", color: C.red,
    tags: ["Black-Scholes", "Options", "Greeks", "Implied Volatility", "Derivatives"],
    stats: ["Nobel Prize 1997", "5 inputs", "Greeks: Δ Γ θ ν ρ"],
    description: "The Black-Scholes formula derives the fair price of a European option from five observable inputs. Covers the formula and its intuitive interpretation, all five Greeks derived analytically, implied volatility back-solving via Brent's method, delta hedging simulation, and an honest discussion of where the model is wrong (the vol smile).",
    sourceUrl: "https://www.quantstart.com/articles/derivatives-pricing-i-pricing-under-the-black-scholes-model/",
    sections: [
      { id: "overview",  label: "Overview",       component: BSOverview },
      { id: "model",     label: "The Model",      component: BSDeepDive },
      { id: "mental",    label: "Mental Models",  component: BSMental },
      { id: "valid",     label: "Validation",     component: BSValidation },
      { id: "eli15",     label: "ELI15",          component: BSELI15 },
    ],
  },
  {
    id: "arma-time-series",
    title: "ARMA and ARIMA Time Series Models",
    subtitle: "White noise → AR → MA → ARMA → ARIMA — the full building-block progression",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "INTERMEDIATE", color: C.amber,
    tags: ["ARMA", "ARIMA", "Time Series", "ACF", "PACF", "Forecasting"],
    stats: ["AR + MA = ARMA", "AIC/BIC selection", "Ljung-Box residual test"],
    description: "The foundational time series model family. Builds from white noise through AR(1), MA(1), ARMA(p,q), to ARIMA(p,d,q) step by step. Covers ACF/PACF identification plots, AIC/BIC model selection across a parameter grid, and residual diagnostics via the Ljung-Box test. The baseline every other time series model is measured against.",
    sourceUrl: "https://www.quantstart.com/articles/ARMA-ARIMA-Models/",
    sections: [
      { id: "overview",  label: "Overview",       component: ARMAOverview },
      { id: "model",     label: "The Model",      component: ARMADeepDive },
      { id: "mental",    label: "Mental Models",  component: ARMAMental },
      { id: "valid",     label: "Validation",     component: ARMAValidation },
      { id: "eli15",     label: "ELI15",          component: ARMAELI15 },
    ],
  },
  {
    id: "backtesting-python",
    title: "Backtesting Systematic Strategies in Python",
    subtitle: "Research vs event-driven, the three fatal biases, and walk-forward validation",
    author: "QuantStart", handle: "quantstart.com", date: "2024",
    difficulty: "INTERMEDIATE", color: C.blue,
    tags: ["Backtesting", "Python", "Look-Ahead Bias", "Walk-Forward", "Risk"],
    stats: ["3 major biases", "Transaction cost modelling", "Walk-forward framework"],
    description: "Building a backtest that actually predicts live performance is one of the hardest parts of systematic trading. Covers the gap between research and event-driven backtests, the three fatal biases (look-ahead, survivorship, optimisation), realistic transaction cost modelling, and the walk-forward validation framework that gives honest out-of-sample performance estimates.",
    sourceUrl: "https://www.quantstart.com/articles/backtesting-systematic-trading-strategies-in-python-considerations-and-open-source-frameworks/",
    sections: [
      { id: "overview",  label: "Overview",       component: BTOverview },
      { id: "model",     label: "The Framework",  component: BTDeepDive },
      { id: "mental",    label: "Mental Models",  component: BTMental },
      { id: "valid",     label: "Validation",     component: BTValidation },
      { id: "eli15",     label: "ELI15",          component: BTELI15 },
    ],
  },
];

// ── ARTICLE CARD ──────────────────────────────────────────────
function ArticleCard({ article, onOpen }) {
  const diffColor = ({ BEGINNER: C.accent, INTERMEDIATE: C.amber, ADVANCED: C.red, REFERENCE: "#8b5cf6" })[article.difficulty] || C.blue;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${article.color}`, borderRadius: 6, padding: "22px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
        <div>
          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, color: diffColor, ...mono, fontWeight: "bold", padding: "2px 7px", background: diffColor + "18", border: `1px solid ${diffColor}40`, borderRadius: 2 }}>
              {article.difficulty}
            </span>
            <span style={{ fontSize: 10, color: article.color, ...mono }}>{article.author}</span>
            <span style={{ fontSize: 10, color: C.border }}>·</span>
            <span style={{ fontSize: 10, color: C.muted, ...mono }}>{article.handle}</span>
            <span style={{ fontSize: 10, color: C.border }}>·</span>
            <span style={{ fontSize: 10, color: C.muted, ...mono }}>{article.date}</span>
          </div>

          {/* Title + subtitle */}
          <div style={{ fontSize: 16, color: C.text, ...mono, fontWeight: "bold", marginBottom: 4, lineHeight: 1.35 }}>
            {article.title}
          </div>
          <div style={{ fontSize: 11, color: C.muted, ...mono, marginBottom: 14 }}>{article.subtitle}</div>

          {/* Description */}
          <div style={{ fontSize: 11, color: C.muted, ...mono, lineHeight: 1.8, marginBottom: 16 }}>{article.description}</div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {article.tags.map(tag => (
              <span key={tag} style={{ fontSize: 9, color: C.blue, ...mono, padding: "2px 8px", background: C.blue + "14", border: `1px solid ${C.blue}28`, borderRadius: 2 }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Key stats */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {article.stats.map((s, i) => (
              <span key={i} style={{ fontSize: 10, color: article.color, ...mono }}>↗ {s}</span>
            ))}
          </div>
        </div>

        {/* Right: section count + CTA + source */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: C.muted, ...mono, textAlign: "right" }}>
            {article.sections.length} sections
          </div>
          <button onClick={() => onOpen(article)} style={{
            padding: "10px 18px", background: article.color + "20", border: `1px solid ${article.color}`,
            color: article.color, borderRadius: 4, cursor: "pointer", fontSize: 11, ...mono, fontWeight: "bold", letterSpacing: "0.06em",
          }}>
            Open →
          </button>
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noreferrer"
              style={{ fontSize: 9, color: C.muted, ...mono, textDecoration: "none" }}>
              source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── LIBRARY HOME ──────────────────────────────────────────────
function LibraryHome({ articles, onOpen }) {
  const totalSections = articles.reduce((n, a) => n + a.sections.length, 0);
  const allTags = [...new Set(articles.flatMap(a => a.tags))];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 18px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 36, paddingBottom: 28, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.16em", marginBottom: 12 }}>QUANT LIBRARY</div>
        <div style={{ fontSize: 22, color: C.text, ...mono, fontWeight: "bold", lineHeight: 1.35, marginBottom: 14 }}>
          Systematic edges, broken<br />
          <span style={{ color: C.accent }}>down to first principles.</span>
        </div>
        <div style={{ fontSize: 12, color: C.muted, ...mono, lineHeight: 1.85, maxWidth: 540, marginBottom: 22 }}>
          Deep interactive breakdowns of quantitative trading strategies, prediction market mathematics, and systematic execution frameworks. Every article ships with diagrams, live demos, working code, and ELI15 plain-English sections.
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {[
            { value: articles.length, label: articles.length === 1 ? "article" : "articles" },
            { value: totalSections, label: "total sections" },
            { value: allTags.length, label: "topics covered" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 22, color: C.accent, fontWeight: "bold", ...mono }}>{m.value}</span>
              <span style={{ fontSize: 11, color: C.muted, ...mono }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Article list */}
      <div style={{ fontSize: 10, color: C.muted, ...mono, letterSpacing: "0.1em", marginBottom: 14 }}>
        ALL ARTICLES — {articles.length}
      </div>
      <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} onOpen={onOpen} />
        ))}
      </div>

      {/* Placeholder */}
      <div style={{ border: `1px dashed ${C.border}`, borderRadius: 6, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 3, height: 36, background: C.border, borderRadius: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, color: C.muted, ...mono, marginBottom: 4 }}>More articles in progress</div>
          <div style={{ fontSize: 10, color: C.border, ...mono }}>Push a new object to ARTICLES[] to publish here — the structure is already wired up.</div>
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE VIEW ──────────────────────────────────────────────
function ArticleView({ article, activeSection, setActiveSection }) {
  const Section = article.sections[activeSection].component;
  return (
    <div>
      {/* Section tab strip */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.surface, overflowX: "auto" }}>
        {article.sections.map((sec, i) => (
          <button key={i} onClick={() => setActiveSection(i)} style={{
            padding: "9px 14px",
            background: activeSection === i ? "#0d2030" : "transparent",
            color: activeSection === i ? article.color : C.muted,
            border: "none",
            borderBottom: activeSection === i ? `2px solid ${article.color}` : "2px solid transparent",
            cursor: "pointer", fontSize: 10, letterSpacing: "0.08em", whiteSpace: "nowrap", ...mono,
          }}>
            {sec.label.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Section content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "22px 18px" }}>
        <Section />
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("library");
  const [currentArticle, setCurrentArticle] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  function openArticle(article) {
    setCurrentArticle(article);
    setActiveSection(0);
    setView("article");
  }

  function goHome() {
    setView("library");
    setCurrentArticle(null);
    setActiveSection(0);
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", ...mono }}>
      {/* Persistent global header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "11px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={goHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
          <span style={{ color: C.accent, fontSize: 14, fontWeight: "bold" }}>◈</span>
          <span style={{ color: C.accent, fontSize: 11, letterSpacing: "0.12em" }}>QUANT LIBRARY</span>
        </button>
        {view === "article" && currentArticle && (
          <>
            <span style={{ color: C.border, fontSize: 13 }}>/</span>
            <span style={{ fontSize: 10, color: C.muted, ...mono, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentArticle.title}
            </span>
          </>
        )}
        <span style={{ marginLeft: "auto", fontSize: 10, color: C.muted }}>
          {view === "library"
            ? `${ARTICLES.length} article${ARTICLES.length !== 1 ? "s" : ""}`
            : `${currentArticle?.sections.length} sections`}
        </span>
      </div>

      {/* Route */}
      {view === "library" && <LibraryHome articles={ARTICLES} onOpen={openArticle} />}
      {view === "article" && currentArticle && (
        <ArticleView
          article={currentArticle}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
    </div>
  );
}
