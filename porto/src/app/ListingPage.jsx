import Header from './Component/Header';

const projects = [
  {
    title: 'AI Research Assistant',
    category: 'AI',
    year: '2025',
    accent: 'from-[#FF7373] to-[#FFD1D1]',
    summary: 'An intelligent workspace that summarizes insights and helps users move faster from idea to action.',
  },
  {
    title: 'Smart Home Dashboard',
    category: 'IoT',
    year: '2024',
    accent: 'from-[#307FC8] to-[#BFE3FF]',
    summary: 'A connected interface for monitoring devices, automation rules, and energy usage in real time.',
  },
  {
    title: 'Portfolio Experience',
    category: 'Web',
    year: '2025',
    accent: 'from-[#171717] to-[#7A7A7A]',
    summary: 'A visually rich digital portfolio built around storytelling, motion, and bold interaction design.',
  },
  {
    title: 'Inventory Intelligence',
    category: 'Productivity',
    year: '2024',
    accent: 'from-[#FFB347] to-[#FFE7B8]',
    summary: 'A practical product tracking solution for managing stock, alerts, and trends without extra friction.',
  },
  {
    title: 'Motion Brand Landing',
    category: 'Design',
    year: '2023',
    accent: 'from-[#5F6FFF] to-[#D6D9FF]',
    summary: 'A highly branded landing page concept focused on conversion, clarity, and visual storytelling.',
  },
  {
    title: 'Campus Monitoring App',
    category: 'System',
    year: '2024',
    accent: 'from-[#37B76A] to-[#C9F4D8]',
    summary: 'A campus-related digital dashboard that combines reporting, tracking, and operational visibility.',
  },
];

const filters = ['All', 'AI', 'IoT', 'Web', 'Productivity', 'Design'];

export default function ListingPage() {
  return (
    <div className="min-h-screen bg-[#FFFEF7] text-[#171717]">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-36">
        <section className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.28em] text-[#545454]">
              Portfolio catalog
            </p>
            <h1 className="text-5xl font-black tracking-[-0.06em] md:text-7xl">
              Selected work
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  index === 0
                    ? 'border-[#171717] bg-[#171717] text-[#FFFEF7]'
                    : 'border-[#171717]/20 bg-white text-[#171717] hover:border-[#171717]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-4xl border border-[#171717]/10 bg-white shadow-[0_20px_60px_rgba(22,22,22,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(22,22,22,0.12)]"
            >
              <div className={`relative h-56 overflow-hidden bg-linear-to-br ${project.accent}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_42%)]" />
                <div className="absolute right-6 top-6 rounded-full border border-white/60 bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#171717] backdrop-blur-sm">
                  {project.category}
                </div>
                <div className="absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#5B5B5B]">
                  <span>{project.year}</span>
                  <span>0{index + 1}</span>
                </div>

                <h2 className="mb-3 text-3xl font-bold tracking-tighter">{project.title}</h2>
                <p className="text-base leading-7 text-[#3D3D3D]">{project.summary}</p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-[0.18em] text-[#171717]/70">
                    View project
                  </span>
                  <span className="text-2xl leading-none text-[#171717] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
