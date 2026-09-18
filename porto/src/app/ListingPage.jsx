import { supabase } from '@/utils/supabase';
import FilterBar from './Component/FilterBar';
import ProjectCardList from './Component/ProjectCardList';

function truncateText(text, maxLength = 150) {
  if (!text) return 'No description available yet.';
  return text.length > maxLength
    ? text.slice(0, maxLength).trimEnd() + '...'
    : text;
}

async function getTypeMaps() {
  const { data, error } = await supabase
    .from('Type')
    .select('*')
    .order('Typeid', { ascending: true });

  if (error) {
    console.error('Error fetching types:', error);
    return { typeLabels: {}, typeMap: {}, typeList: [] };
  }

  const typeLabels = {};
  const typeMap = {};

  (data ?? []).forEach((t) => {
    typeLabels[t.Typeid] = t.Types;

    const nameKey = t.Types.trim().toUpperCase();
    const firstLetterKey = nameKey.charAt(0);
    const noSpaceKey = nameKey.replace(/\s+/g, '');

    typeMap[nameKey] = t.Typeid;
    typeMap[noSpaceKey] = t.Typeid;
    typeMap[firstLetterKey] = t.Typeid;
  });

  return { typeLabels, typeMap, typeList: data ?? [] };
}

function normalizeType(typeValue, typeMap) {
  if (!typeValue) return null;

  const raw = String(typeValue).trim().toUpperCase();

  if (typeMap[raw] !== undefined) {
    return typeMap[raw];
  }

  const numericType = Number(typeValue);
  if (Number.isInteger(numericType) && typeMap[numericType] === undefined) {
    // still allow raw numeric ids even if not in map keys as string
    return numericType;
  }

  return null;
}

function getRandomAccent(index = 0) {
  const starterPalettes = [
    ['#7c3aed', '#5b21b6'],
    ['#38bdf8', '#2563eb'],
  ];

  if (index < starterPalettes.length) {
    const [start, end] = starterPalettes[index];
    return `radial-gradient(120% 120% at 10% 12%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.32) 18%, rgba(255,255,255,0.06) 28%, transparent 42%), linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
  }

  const palettes = [
    ['#8b5cf6', '#4c1d95'],
    ['#38bdf8', '#0f5bd6'],
    ['#14b8a6', '#0f766e'],
    ['#f97316', '#b45309'],
    ['#ef4444', '#7f1d1d'],
    ['#22c55e', '#166534'],
    ['#f59e0b', '#a16207'],
    ['#e879f9', '#7e22ce'],
  ];

  const [start, end] = palettes[Math.floor(Math.random() * palettes.length)];
  return `radial-gradient(120% 120% at 10% 12%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.32) 18%, rgba(255,255,255,0.06) 28%, transparent 42%), linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
}

export default async function ListingPage({ type }) {
  const { typeLabels, typeMap, typeList } = await getTypeMaps();
  const activeType = normalizeType(type, typeMap);

  let items = [];

  let query = supabase.from('lists').select('*').order('id', { ascending: true });

  if (activeType) {
    query = query.eq('Project_Type', activeType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data:', error);
  }

  if (data && data.length > 0) {
  items = data.map((item, index) => ({
    id: item.id,
    type: item.Project_Type,
    title: item.Project_Name ?? 'Untitled item',
    category: typeLabels[item.Project_Type] ?? 'Project',
    date: item.Begin_date
      ? new Date(item.Begin_date).getFullYear().toString()
      : '',
    accent: getRandomAccent(index),
    summary: truncateText(item.About_Project),
    description: item.About_Project ?? 'No description available yet.',

    // field mentah tambahan buat detail modal
    beginDate: item.Begin_date ?? null,
    endDate: item.End_Date ?? null,
    participation: item.MyParticipation ?? null,
    linkBukti: item.Link_bukti ?? null,
  }));
}

  const tabs = [
    { key: 'All', value: null },
    ...typeList.map((t) => ({
      key: t.Types,
      value: t.Types.trim().toUpperCase().charAt(0),
    })),
  ];

  const activeTitle = activeType ? typeLabels[activeType] : 'All Experience';

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#171717]">
      <header className="absolute top-20 left-50 z-50 px-6 py-4 bg-[#f5f5f5] rounded-2xl">
        <div className="text-xl font-light text-29">
          <nav className="flex gap-70">
            <a href="/" className="inline-flex items-center justify-center gap-1.5 ">Home <span className="w-2.5 h-2.5 rounded-full bg-current"></span> </a>
            <a href="/projects" className="inline-flex items-center justify-center gap-1.5">Projects <span className="w-2.5 h-2.5 rounded-full bg-current"></span> </a>
            <a href="/" className="inline-flex items-center justify-center gap-1.5">About Me <span className="w-2.5 h-2.5 rounded-full bg-current"></span></a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-36">
        <section className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.28em] text-[#545454]">
              Portfolio catalog
            </p>
            <h1 className="text-5xl font-black tracking-[-0.06em] md:text-7xl">
              {activeTitle}
            </h1>
          </div>
          <FilterBar tabs={tabs} selectedType={type} />
        </section>

        <ProjectCardList items={items} />
      </main>
    </div>
  );
}