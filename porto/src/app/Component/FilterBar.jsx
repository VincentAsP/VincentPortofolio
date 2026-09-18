'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FilterBar({ tabs, selectedType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const fields = ['AI', 'IoT', 'Website', 'Photography', 'Design', 'Other'];

  function toggleField(field) {
    setSelectedFields((currentFields) =>
      currentFields.includes(field)
        ? currentFields.filter((currentField) => currentField !== field)
        : [...currentFields, field],
    );
  }

  return (
    <div className="relative h-11 w-11 shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close project filters' : 'Open project filters'}
        title={isOpen ? 'Close filters' : 'Open filters'}
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition ${
          isOpen
            ? 'border-[#171717] bg-[#171717] text-[#FFFEF7]'
            : 'border-[#171717]/20 bg-white text-[#171717] hover:border-[#171717]'
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 flex w-[min(32rem,calc(100vw-3rem))] origin-top-right animate-[filterPanelIn_180ms_ease-out] flex-col gap-4 rounded-2xl border border-[#171717]/10 bg-white p-4 shadow-[0_12px_30px_rgba(22,22,22,0.08)]">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#5B5B5B]">
              Project type
            </p>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = tab.value === selectedType || (!tab.value && !selectedType);

                return (
                  <Link
                    key={tab.key}
                    href={tab.value ? `/projects?type=${tab.value}` : '/projects'}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? 'border-[#171717] bg-[#171717] text-[#FFFEF7]'
                        : 'border-[#171717]/10 text-[#171717] hover:border-[#171717]'
                    }`}
                  >
                    {tab.key}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#171717]/10 pt-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#5B5B5B]">
              Bidang
            </p>
            <div className="flex flex-wrap gap-2">
              {fields.map((field) => {
                const isSelected = selectedFields.includes(field);

                return (
                  <button
                    key={field}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleField(field)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      isSelected
                        ? 'border-[#171717] bg-[#171717] text-[#FFFEF7]'
                        : 'border-[#171717]/10 text-[#171717] hover:border-[#171717]'
                    }`}
                  >
                    {field}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}