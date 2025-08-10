import React from "react";

export default function SpaceframingTechnologySection() {
  const advantages = [
    {
      title: "Faster Assembly",
      desc: "Precision-engineered components arrive labeled, pre-drilled, and ready to bolt together—cutting days or weeks off your build time.",
      icon: "⚡",
    },
    {
      title: "Open Layouts",
      desc: "Spaceframing’s clear-span structure eliminates interior load-bearing walls, giving trades wide-open runs for MEP and limitless floor plan flexibility.",
      icon: "🏠",
    },
    {
      title: "Material Efficiency",
      desc: "Triangulated geometry delivers strength with fewer members, reducing waste and embodied carbon without compromising performance.",
      icon: "♻️",
    },
    {
      title: "Adaptable Design",
      desc: "Grid modules, roof profiles, and spans are easily customized to fit your site, climate, and architectural vision.",
      icon: "🛠️",
    },
  ];

  return (
    <section id="technology" className="bg-neutral-950 text-neutral-100 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-tr from-teal-400 to-cyan-400">
            The Spaceframing Advantage
          </h2>
          <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
            Our spaceframing approach redefines how homes are built—combining speed, precision, and design freedom in one structural system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv) => (
            <div
              key={adv.title}
              className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col items-center text-center hover:border-teal-500/50 transition-colors"
            >
              <div className="text-4xl mb-4">{adv.icon}</div>
              <h3 className="text-lg font-medium mb-2">{adv.title}</h3>
              <p className="text-sm text-neutral-400">{adv.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://picsum.photos/seed/spaceframe-tech/900/600"
              alt="Spaceframing structure"
              className="rounded-3xl border border-neutral-800 shadow-[0_0_40px_rgba(45,212,191,0.15)]"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Why it Works Better</h3>
            <p className="text-neutral-300 mb-6">
              Spaceframing distributes loads through a network of triangles, creating a lighter yet stronger shell. This enables larger spans, faster installs, and simpler high-performance envelopes.
            </p>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li><b>Strength-to-Weight:</b> High load capacity with less steel per square foot.</li>
              <li><b>Precision Fit:</b> CNC-cut components for tight tolerances.</li>
              <li><b>Future-Proof:</b> Flexible grid allows future modifications or expansions.</li>
              <li><b>Sustainable:</b> Reduced material use and optimized shipping volumes.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
