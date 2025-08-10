import React, { useEffect, useMemo, useState } from "react";

const FALLBACK_KITS = [
  {
    id: "sf-1200",
    name: "Starter Kit — SF‑1200",
    tagline: "Fast, clean shell for ADUs & small homes",
    price: 89000,
    img: "https://picsum.photos/seed/spaceframe1/1200/700",
    leadTimeWeeks: 6,
    footprint: "24' x 40' (960 ft²)",
    envelopeArea: "~3,250 ft²",
    bays: 6,
    grid: "8' module",
    clearSpan: "24'",
    roofOptions: ["Gable", "Mono‑slope"],
    cladding: ["Metal panel", "Cedar rainscreen", "Stucco"],
    steel: "ASTM A500 Grade B / A36 nodes",
    finish: "Hot‑dip galvanized + powder‑coat (RAL options)",
    designLoads: "Roof: 30 psf • Wind: 110 mph (ASCE 7‑16) • Seismic: D1/D2",
    energy: "R‑30 roof / R‑21 wall compatible assemblies",
    shippingWeight: "~7,200 lb",
    crew: "3–4 ppl, 2–3 days to dry‑in",
    tools: "Impact driver, ratchets, laser level, 2 ladders",
    warrantyYears: 15,
  },
  {
    id: "sf-1800",
    name: "Builder Kit — SF‑1800",
    tagline: "Family plan with expanded span & bay count",
    price: 129000,
    img: "https://picsum.photos/seed/spaceframe2/1200/700",
    leadTimeWeeks: 8,
    footprint: "30' x 60' (1,800 ft²)",
    envelopeArea: "~5,900 ft²",
    bays: 10,
    grid: "10' module",
    clearSpan: "30'",
    roofOptions: ["Gable", "Mono‑slope", "Clerestory"],
    cladding: ["Metal panel", "Fiber‑cement", "Brick veneer"],
    steel: "ASTM A500 Grade C / A572 nodes",
    finish: "Hot‑dip galvanized + powder‑coat (custom)",
    designLoads: "Roof: 40 psf • Wind: 130 mph • Seismic: D2",
    energy: "R‑38 roof / R‑23 wall compatible assemblies",
    shippingWeight: "~12,500 lb",
    crew: "4–5 ppl, 4–5 days to dry‑in",
    tools: "Impact wrenches, laser level, 2 scaffolds",
    warrantyYears: 20,
    bestSeller: true,
  },
  {
    id: "sf-2400",
    name: "Pro Kit — SF‑2400",
    tagline: "Developer‑grade speed with premium spans",
    price: 169000,
    img: "https://picsum.photos/seed/spaceframe3/1200/700",
    leadTimeWeeks: 10,
    footprint: "40' x 60' (2,400 ft²)",
    envelopeArea: "~7,600 ft²",
    bays: 12,
    grid: "10' module",
    clearSpan: "40'",
    roofOptions: ["Gable", "Mono‑slope", "Sawtooth", "Green roof‑ready"],
    cladding: ["High‑rib metal", "Composite panel", "EIFS"],
    steel: "ASTM A500 Grade C / A572 nodes",
    finish: "HDG + architectural powder‑coat (project palette)",
    designLoads: "Roof: 50 psf • Wind: 140 mph • Seismic: D2",
    energy: "R‑49 roof / R‑24 wall compatible assemblies",
    shippingWeight: "~16,800 lb",
    crew: "5–6 ppl, 5–7 days to dry‑in",
    tools: "Torque‑controlled impacts, lasers, small telehandler",
    warrantyYears: 25,
    premium: true,
  },
];

function currency(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function smartNumber(v) {
  if (v === undefined || v === null || v === "") return v;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : v;
}
function smartBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return /^(true|1|yes|y)$/i.test(v.trim());
  return false;
}
function splitList(v) {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return [];
  return v.split(";").map((s) => s.trim()).filter(Boolean);
}

function parseCSV(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; }
        if (c === '\r' && text[i + 1] === '\n') i++;
      } else { field += c; }
    }
    i++;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).filter(r => r.length && r.some(c => c.trim() !== '')).map((r) => Object.fromEntries(header.map((k, idx) => [k, (r[idx] ?? '').trim()])));
}

async function fetchExternalData() {
  for (const path of ["/kits.json", "/kits.csv"]) {
    try {
      const res = await fetch(path);
      if (!res.ok) continue;
      const isJSON = path.endsWith(".json");
      const raw = isJSON ? await res.json() : parseCSV(await res.text());
      const list = (isJSON ? raw : raw).map((k) => ({
        id: k.id,
        name: k.name,
        tagline: k.tagline,
        price: smartNumber(k.price),
        img: k.img,
        leadTimeWeeks: smartNumber(k.leadTimeWeeks),
        footprint: k.footprint,
        envelopeArea: k.envelopeArea,
        bays: smartNumber(k.bays),
        grid: k.grid,
        clearSpan: k.clearSpan,
        roofOptions: splitList(k.roofOptions),
        cladding: splitList(k.cladding),
        steel: k.steel,
        finish: k.finish,
        designLoads: k.designLoads,
        energy: k.energy,
        shippingWeight: k.shippingWeight,
        crew: k.crew,
        tools: k.tools,
        warrantyYears: smartNumber(k.warrantyYears),
        bestSeller: smartBool(k.bestSeller),
        premium: smartBool(k.premium),
      }));
      if (list.every((k) => k && k.id && typeof k.price === 'number')) return list;
    } catch {}
  }
  return null;
}

function DevTestPanel({ kits }) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const run = () => {
    const tests = [];
    const add = (name, fn) => { try { fn(); tests.push({ name, pass: true }); } catch (e) { tests.push({ name, pass: false, details: String(e?.message || e) }); } };
    add("has >= 1 kit", () => { if (!(kits.length >= 1)) throw new Error(`Expected >=1, got ${kits.length}`); });
    add("each kit has id & price", () => { kits.forEach((k) => { if (!k.id) throw new Error("missing id"); if (typeof k.price !== "number" || !(k.price > 0)) throw new Error(`${k.id} bad price`); }); });
    add("joins produce plain strings", () => { kits.forEach((k) => { const a = (k.roofOptions||[]).join(", "); const b = (k.cladding||[]).join(", "); if (a.includes('"') || b.includes('"')) throw new Error("stray quotes"); }); });
    setResults(tests);
  };
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <button onClick={() => { if (!open) run(); setOpen(v => !v); }} className="rounded-xl border border-neutral-800 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900/50">
        {open ? "Hide tests" : "Run tests"}
      </button>
      {open && (
        <ul className="mt-3 space-y-2 text-xs">
          {results.map((t, i) => (
            <li key={i} className={`rounded-lg border px-3 py-2 ${t.pass ? "border-teal-600/40 text-teal-300" : "border-red-600/40 text-red-300"}`}>
              <b>{t.pass ? "PASS" : "FAIL"}</b> — {t.name}
              {!t.pass && t.details ? <div className="mt-1 text-red-400/90">{t.details}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SpaceframingKitsPage() {
  const [kits, setKits] = useState(FALLBACK_KITS);
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchExternalData().then((list) => { if (mounted && Array.isArray(list) && list.length) setKits(list); });
    return () => { mounted = false; };
  }, []);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  function addToCart(kit) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === kit.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { id: kit.id, name: kit.name, price: kit.price, qty: 1 }];
    });
    setOpenCart(true);
  }

  function updateQty(id, delta) {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)).filter((i) => i.qty > 0));
  }
  function removeItem(id) { setCart((prev) => prev.filter((i) => i.id !== id)); }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (file.name.endsWith('.json')) {
          const raw = JSON.parse(String(reader.result));
          setKits(raw.map((k) => ({
            ...k,
            price: smartNumber(k.price),
            leadTimeWeeks: smartNumber(k.leadTimeWeeks),
            bays: smartNumber(k.bays),
            warrantyYears: smartNumber(k.warrantyYears),
            bestSeller: smartBool(k.bestSeller),
            premium: smartBool(k.premium),
            roofOptions: splitList(k.roofOptions),
            cladding: splitList(k.cladding),
          })));
        } else {
          const rows = parseCSV(String(reader.result));
          setKits(rows.map((k) => ({
            id: k.id,
            name: k.name,
            tagline: k.tagline,
            price: smartNumber(k.price),
            img: k.img,
            leadTimeWeeks: smartNumber(k.leadTimeWeeks),
            footprint: k.footprint,
            envelopeArea: k.envelopeArea,
            bays: smartNumber(k.bays),
            grid: k.grid,
            clearSpan: k.clearSpan,
            roofOptions: splitList(k.roofOptions),
            cladding: splitList(k.cladding),
            steel: k.steel,
            finish: k.finish,
            designLoads: k.designLoads,
            energy: k.energy,
            shippingWeight: k.shippingWeight,
            crew: k.crew,
            tools: k.tools,
            warrantyYears: smartNumber(k.warrantyYears),
            bestSeller: smartBool(k.bestSeller),
            premium: smartBool(k.premium),
          })));
        }
      } catch (err) {
        alert("Failed to load data: " + err);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500" />
            <div className="font-semibold tracking-wide">OASYS Spaceframing</div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-neutral-300">
            <a href="#kits" className="hover:text-white">Kits</a>
            <a href="#compare" className="hover:text-white">Compare</a>
            <a href="#specs" className="hover:text-white">Specs</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAdmin(v => !v)} className="hidden md:inline rounded-xl border border-neutral-700 px-4 py-2 text-xs hover:bg-neutral-800">Admin: Load file</button>
            <button onClick={() => setOpenCart(true)} className="relative rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800" aria-label="Open cart">
              Cart
              {cart.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-lg bg-teal-500 px-2 py-0.5 text-xs font-medium text-black">{cart.reduce((s, i) => s + i.qty, 0)}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {showAdmin && (
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="rounded-2xl border border-neutral-800 p-4 text-xs text-neutral-300">
            <div className="font-medium mb-2">Admin loader</div>
            <p>Upload <b>kits.json</b> or <b>kits.csv</b> (semicolon‑separated lists) to update this page instantly. No page reload required.</p>
            <input type="file" accept=".json,.csv" onChange={handleFile} className="mt-3" />
          </div>
        </div>
      )}

      <section className="overflow-hidden border-b border-neutral-800 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(45,212,191,0.15),transparent_60%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Build faster with <span className="bg-clip-text text-transparent bg-gradient-to-tr from-teal-400 to-cyan-400">Spaceframing</span></h1>
            <p className="mt-5 text-neutral-300 max-w-xl">Three turnkey core‑and‑shell kits engineered for speed, precision, and clean MEP routing. Fewer parts, clearer spans, predictable installs.</p>
            <div className="mt-8 flex gap-4">
              <a href="#kits" className="rounded-2xl bg-white text-black px-5 py-3 text-sm font-medium hover:bg-neutral-200">Browse Kits</a>
              <a href="#contact" className="rounded-2xl border border-neutral-700 px-5 py-3 text-sm hover:bg-neutral-800">Talk to an engineer</a>
            </div>
            <p className="mt-6 text-xs text-neutral-400">Pricing shown is for frame + connectors + fasteners + engineering package. Foundations, cladding, MEP, and permits sold separately.</p>
          </div>
          <div className="relative">
            <img src="https://picsum.photos/seed/spaceframe-hero/1400/900" alt="Spaceframing hero" className="rounded-3xl border border-neutral-800 shadow-[0_0_60px_rgba(45,212,191,0.15)]" />
            <div className="absolute bottom-4 left-4 rounded-xl bg-neutral-900/70 backdrop-blur border border-neutral-800 px-4 py-3 text-xs">
              <div className="font-medium">On‑site assembly ready</div>
              <div className="text-neutral-400">Color‑coded members, pre‑drilled nodes, torque‑spec fasteners</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-6 grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3">
            <div className="text-neutral-300 text-xs">Lead time</div>
            <div className="font-medium">6–10 weeks per kit</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3">
            <div className="text-neutral-300 text-xs">Financing</div>
            <div className="font-medium">From $899/mo OAC</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 px-4 py-3">
            <div className="text-neutral-300 text-xs">Warranty</div>
            <div className="font-medium">15–25 years structural</div>
          </div>
        </div>
      </section>

      <section id="kits" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl md:text-4xl font-semibold">Choose your kit</h2>
          <p className="text-sm text-neutral-400">Add to cart to reserve production slot — fully refundable.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {kits.map((k) => (
            <article key={k.id} className={`relative rounded-3xl border ${k.premium ? "border-cyan-500/50" : k.bestSeller ? "border-teal-500/50" : "border-neutral-800"} bg-neutral-900/40 overflow-hidden`}>
              {k.bestSeller && (<div className="absolute left-4 top-4 rounded-full bg-teal-500/20 text-teal-300 text-xs px-3 py-1 border border-teal-500/40">Best Seller</div>)}
              {k.premium && (<div className="absolute left-4 top-4 rounded-full bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 border border-cyan-500/40">Developer</div>)}
              <img src={k.img} alt={k.name} className="h-44 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{k.name}</h3>
                <p className="mt-1 text-sm text-neutral-300">{k.tagline}</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <div className="text-2xl font-semibold">{currency(k.price)}</div>
                  <div className="text-xs text-neutral-400">Lead time ~{k.leadTimeWeeks} weeks</div>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-neutral-300">
                  <Spec label="Footprint" value={k.footprint} />
                  <Spec label="Clear span" value={k.clearSpan} />
                  <Spec label="Grid module" value={k.grid} />
                  <Spec label="Bays" value={`${k.bays}`} />
                  <Spec label="Roof" value={(k.roofOptions || []).join(", ")} />
                  <Spec label="Cladding" value={(k.cladding || []).join(", ")} />
                </ul>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => addToCart(k)} className="rounded-2xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-neutral-200">Add to cart</button>
                  <a href={`#${k.id}-details`} className="rounded-2xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800">View details</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Compare kits</h2>
        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60">
              <tr className="text-left">
                <th className="p-3">Spec</th>
                {kits.map((k) => (<th key={k.id} className="p-3 font-semibold">{k.name}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {[
                ["Price", ...kits.map((k) => currency(k.price))],
                ["Footprint", ...kits.map((k) => k.footprint)],
                ["Envelope area", ...kits.map((k) => k.envelopeArea)],
                ["Bays", ...kits.map((k) => String(k.bays))],
                ["Grid module", ...kits.map((k) => k.grid)],
                ["Clear span", ...kits.map((k) => k.clearSpan)],
                ["Roof options", ...kits.map((k) => (k.roofOptions || []).join(", "))],
                ["Compatible cladding", ...kits.map((k) => (k.cladding || []).join(", "))],
                ["Steel grade", ...kits.map((k) => k.steel)],
                ["Finish", ...kits.map((k) => k.finish)],
                ["Design loads", ...kits.map((k) => k.designLoads)],
                ["Energy assemblies", ...kits.map((k) => k.energy)],
                ["Shipping weight", ...kits.map((k) => k.shippingWeight)],
                ["Crew & time", ...kits.map((k) => k.crew)],
                ["Tools needed", ...kits.map((k) => k.tools)],
                ["Warranty", ...kits.map((k) => `${k.warrantyYears} years`)],
              ].map((row, i) => (
                <tr key={i} className="align-top">
                  <td className="p-3 text-neutral-400 min-w-[180px]">{row[0]}</td>
                  {row.slice(1).map((cell, j) => (<td key={j} className="p-3">{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="specs" className="mx-auto max-w-7xl px-4 pb-16 space-y-10">
        {kits.map((k) => (
          <div key={k.id} id={`${k.id}-details`} className="rounded-3xl border border-neutral-800 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <img src={k.img} alt={k.name} className="w-full h-full object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold">{k.name}</h3>
                <p className="text-neutral-300 mt-1">{k.tagline}</p>
                <div className="mt-4 text-xl font-semibold">{currency(k.price)}</div>
                <ul className="mt-6 space-y-2 text-sm text-neutral-300">
                  <li><b>Design loads:</b> {k.designLoads}</li>
                  <li><b>Steel:</b> {k.steel}</li>
                  <li><b>Finish:</b> {k.finish}</li>
                  <li><b>Energy assemblies:</b> {k.energy}</li>
                  <li><b>Included:</b> Labeled members, node connectors, fasteners, erection drawings, calc package, QA docs.</li>
                  <li><b>Not included:</b> Foundation, envelope, doors/windows, MEP, inspections, permits, shipping & taxes.</li>
                </ul>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => addToCart(k)} className="rounded-2xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-neutral-200">Add to cart</button>
                  <a href="#compare" className="rounded-2xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800">Compare</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 pb-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Frequently asked</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <FAQ q="How do I reserve a production slot?" a="Add a kit to cart and checkout with a fully refundable deposit. We’ll confirm engineering, site, and schedule before releasing drawings to fabrication." />
          <FAQ q="Do you provide foundations and envelope?" a="We provide stamped structural drawings and the spaceframe kit. We coordinate with your GC on foundation details and envelope compatibility." />
          <FAQ q="Can I customize spans or roof geometry?" a="Yes. Custom grids, bays, and roof profiles are available. Lead time and pricing adjust based on engineering complexity." />
          <FAQ q="Where do you ship?" a="Continental US by LTL/flatbed. International on request. Freight quoted at checkout based on destination and lift requirements." />
        </div>
      </section>

      <DevTestPanel kits={kits} />

      <footer id="contact" className="border-t border-neutral-800 py-10 text-sm text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} OASYS Spaceframing</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Spec library</a>
            <a href="#" className="hover:text-white">Install guide</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>

      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-neutral-950 border-l border-neutral-800 transition-transform duration-300 ${openCart ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-label="Cart">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold">Your cart</h3>
          <button onClick={() => setOpenCart(false)} className="rounded-xl border border-neutral-700 px-3 py-1 text-sm hover:bg-neutral-800">Close</button>
        </div>
        <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-neutral-400 text-sm">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 border border-neutral-800 rounded-2xl p-3">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-neutral-400">{currency(item.price)} each</div>
                  <div className="mt-2 inline-flex items-center gap-2 text-sm">
                    <button onClick={() => updateQty(item.id, -1)} className="rounded-lg border border-neutral-700 px-2 py-0.5 hover:bg-neutral-800">−</button>
                    <span className="min-w-[2ch] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="rounded-lg border border-neutral-700 px-2 py-0.5 hover:bg-neutral-800">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-3 text-xs text-red-300 hover:underline">Remove</button>
                  </div>
                </div>
                <div className="font-medium">{currency(item.price * item.qty)}</div>
              </div>
            ))
          )}
        </div>
        <div className="mt-auto border-t border-neutral-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Subtotal</span>
            <span className="font-medium">{currency(subtotal)}</span>
          </div>
          <p className="text-xs text-neutral-500">Taxes & freight calculated at checkout. Deposits fully refundable prior to fabrication release.</p>
          <button className="w-full rounded-2xl bg-white text-black px-4 py-3 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50" disabled={cart.length === 0}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <li className="flex flex-col rounded-xl border border-neutral-800 px-3 py-2">
      <span className="text-xs text-neutral-400">{label}</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-neutral-800 overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full text-left px-4 py-3 hover:bg-neutral-900/60">
        <div className="font-medium">{q}</div>
      </button>
      {open && <div className="px-4 pb-4 text-neutral-300 text-sm">{a}</div>}
    </div>
  );
}
