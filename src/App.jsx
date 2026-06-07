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

// ── MAIN ─────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const tabs = ["Overview", "Shock Detection", "5D Classifier", "Distributions", "Ladder", "Worked Example", "The Math", "Results", "Math: ELI15"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", ...mono }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "11px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: C.accent, fontSize: 14, fontWeight: "bold" }}>◈</span>
        <span style={{ color: C.accent, fontSize: 11, letterSpacing: "0.12em" }}>ROHONCHAIN · WORLD CUP QUANT BOT</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: C.muted }}>FIFA 2026 · POLYMARKET · SHOCK-RECOVERY STRATEGY</span>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.surface, overflowX: "auto" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding: "9px 14px", background: tab === i ? "#0d2030" : "transparent", color: tab === i ? C.accent : C.muted, border: "none", borderBottom: tab === i ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", fontSize: 10, letterSpacing: "0.08em", whiteSpace: "nowrap", ...mono }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "22px 18px" }}>
        {tab === 0 && <OverviewTab />}
        {tab === 1 && <ShockTab />}
        {tab === 2 && <ClassifierTab />}
        {tab === 3 && <DistributionsTab />}
        {tab === 4 && <LadderTab />}
        {tab === 5 && <WorkedExampleTab />}
        {tab === 6 && <MathTab />}
        {tab === 7 && <ResultsTab />}
        {tab === 8 && <MathELI15Tab />}
      </div>
    </div>
  );
}
