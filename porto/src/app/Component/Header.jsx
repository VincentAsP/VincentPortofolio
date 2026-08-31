export default function Header() {
  return (
    <header className="fixed top-20 left-50 px-6 py-4">
        <div className="text-xl font-light text-29">
          <nav className="flex gap-70">
            <a href="/" className="inline-flex items-center justify-center gap-1.5 ">Home <span className="w-2.5 h-2.5 rounded-full bg-current"></span> </a>
            <a href="/" className="inline-flex items-center justify-center gap-1.5">Projects <span className="w-2.5 h-2.5 rounded-full bg-current"></span> </a>
            <a href="/" className="inline-flex items-center justify-center gap-1.5">About Me <span className="w-2.5 h-2.5 rounded-full bg-current"></span></a>
          </nav>
        </div>
      </header>
  );
}
