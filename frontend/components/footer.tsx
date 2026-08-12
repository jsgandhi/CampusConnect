import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 py-6 px-6 glass-panel text-center md:flex md:justify-between md:items-center text-xs text-slate-500">
      <div>
        <p>© 2026 CampusConnect — Nexus Solutions (CSTU MB668 Project Management with AI)</p>
      </div>
      <div className="mt-2 md:mt-0 flex justify-center gap-4 text-slate-400">
        <span>Sprint 4 Delivery</span>
        <span>•</span>
        <span>Academic MVP</span>
        <span>•</span>
        <span className="text-brand-400 font-mono">Next.js 15 + Express + Prisma</span>
      </div>
    </footer>
  );
};
