export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border-subtle bg-[#040406]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold">
            TH
          </div>
          <span className="text-xs font-mono text-muted">
            © {new Date().getFullYear()} Tran Hieu. Built with Next-Gen Fullstack Architecture.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-muted">
          <a
            href="https://github.com/tran-hius/portfolio"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Source Code
          </a>
          <span>•</span>
          <a href="#hero" className="hover:text-cyan-300 transition-colors">
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
};
