export const RouteLoadingFallback = () => {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-cyan-500/10 blur-sm" />
      </div>
      <span className="text-[11px] font-mono text-muted mt-4 tracking-wider uppercase animate-pulse">
        Loading module...
      </span>
    </div>
  );
};
