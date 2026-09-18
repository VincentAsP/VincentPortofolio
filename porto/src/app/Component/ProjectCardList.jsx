'use client';

import { useEffect, useState } from 'react';

export default function ProjectCardList({ items }) {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!selectedProject) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 && (
          <p className="text-[#5B5B5B]">No items found.</p>
        )}

        {items.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            type="button"
            onClick={() => setSelectedProject(item)}
            className="group overflow-hidden rounded-4xl border border-[#171717]/10 bg-white text-left shadow-[0_20px_60px_rgba(22,22,22,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(22,22,22,0.12)] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-4"
          >
            <div
              className="relative h-56 overflow-hidden"
              style={{
                backgroundImage: item.accent,
                backgroundBlendMode: 'screen, normal',
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_38%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_45%,rgba(15,23,42,0.04))]" />
              <div className="absolute right-6 top-6 rounded-full border border-white/60 bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#171717] backdrop-blur-sm">
                {item.category}
              </div>
              <div className="absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#5B5B5B]">
                <span>{item.date}</span>
                <span>0{index + 1}</span>
              </div>

              <h2 className="mb-3 text-3xl font-bold tracking-tighter">{item.title}</h2>
              <p className="text-base leading-7 text-[#3D3D3D]">{item.summary}</p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium uppercase tracking-[0.18em] text-[#171717]/70">
                  View project
                </span>
                <span className="text-2xl leading-none text-[#171717] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </section>

      {selectedProject && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#171717]/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProject(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-overlay-title"
            className="relative max-h-[min(44rem,calc(100vh-2rem))] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#FFFEF7] shadow-[0_30px_100px_rgba(22,22,22,0.25)]"
          >
            <div
              className="relative h-52"
              style={{ backgroundImage: selectedProject.accent }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_42%)]" />
              <span className="absolute bottom-5 left-6 rounded-full border border-white/60 bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#171717] backdrop-blur-sm">
                {selectedProject.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                title="Close project details"
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/30 text-xl text-[#171717] backdrop-blur-sm transition hover:bg-white/70"
              >
                ×
              </button>
            </div>

            <div className="p-7 md:p-10">
              <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#5B5B5B]">
                <span>{selectedProject.date}</span>
                <span>Project details</span>
              </div>
              <h2 id="project-overlay-title" className="mb-5 text-4xl font-bold tracking-tighter md:text-5xl">
                {selectedProject.title}
              </h2>
              <p className="mb-8 text-base leading-8 text-[#3D3D3D]">
                {selectedProject.description}
              </p>

              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#171717]/10 pt-6 sm:grid-cols-2">
                {selectedProject.beginDate && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.18em] text-[#5B5B5B]">
                      Begin Date
                    </dt>
                    <dd className="mt-1 text-sm text-[#171717]">
                      {new Date(selectedProject.beginDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                )}

                {selectedProject.endDate && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.18em] text-[#5B5B5B]">
                      End Date
                    </dt>
                    <dd className="mt-1 text-sm text-[#171717]">
                      {new Date(selectedProject.endDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                )}

                {selectedProject.participation && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-[0.18em] text-[#5B5B5B]">
                      My Participation
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-[#171717]">
                      {selectedProject.participation}
                    </dd>
                  </div>
                )}

                {selectedProject.linkBukti && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-[0.18em] text-[#5B5B5B]">
                      Link of Proof
                    </dt>
                    <dd className="mt-1 text-sm">
                      <a
                        href={selectedProject.linkBukti}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#171717] underline decoration-[#171717]/30 underline-offset-4 hover:decoration-[#171717]"
                      >
                        {selectedProject.linkBukti}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
