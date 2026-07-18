import React from 'react';
import { Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/50 py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} className="text-yellow-500 fill-yellow-500" />)}
            </div>
            <p className="text-white font-medium">"The most intuitive pitch tracker ever built for the browser."</p>
            <p className="text-slate-500 text-sm">— Audio Engineering Weekly</p>
          </div>

          <div className="flex flex-wrap items-center gap-8 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="text-3xl font-black text-white mb-1">1.2M+</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Vocals Analyzed</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-black text-white mb-1">0ms</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Perceived Latency</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-black text-white mb-1">99.9%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Note Accuracy</div>
            </div>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800/50 text-center text-xs text-slate-600">
          <p>© 2026 Raagam Music. Engineered with real-time browser Pitch Autocorrelation (Web Audio API).</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
