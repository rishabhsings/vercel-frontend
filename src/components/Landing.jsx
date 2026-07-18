import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight } from 'lucide-react';
import FeaturedCarousel from './FeaturedCarousel';

const Landing = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in relative z-10">
      
      {/* Background soft animated waves simulation (can be done with pseudo elements or an SVG, but the index.css handles the gradient base well) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[100px] rounded-full animate-pulse-ring"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-cyan-400/10 blur-[100px] rounded-full animate-float"></div>
      </div>

      <div className="text-center max-w-4xl mx-auto mt-10 md:mt-20">
        
        {/* Massive Typography matching screenshot */}
        <div className="flex items-center justify-center gap-4 mb-2 md:mb-4">
          <div className="h-0.5 w-12 md:w-20 bg-taxaBlue"></div>
          <h1 className="text-4xl md:text-7xl font-black text-taxaNavy tracking-tight uppercase">
            DECODE THE
          </h1>
        </div>
        
        <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-none mb-2 md:mb-4 bg-gradient-to-r from-taxaBlue to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
          VOICE.
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-10">
          <h1 className="text-4xl md:text-7xl font-black text-taxaNavy tracking-tight uppercase">
            WITH AI
          </h1>
          <div className="h-0.5 w-12 md:w-20 bg-taxaBlue"></div>
        </div>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl font-bold text-taxaNavy mb-4">
          AI-Powered Vocal Classification Platform
        </h2>
        
        <p className="text-slate-500 max-w-lg mx-auto mb-12 text-sm md:text-base font-medium">
          Uncover pitch accuracy and musical patterns hidden in your voice with Raagam's real-time autocorrelation analysis.
        </p>

        {/* Action Button */}
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="bg-taxaButton hover:bg-black text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-black/10 flex items-center justify-center gap-3 mx-auto transition-all duration-300 hover:scale-105 active:scale-95 group mb-20"
        >
          <span className="tracking-widest text-sm">START ANALYZING</span>
          <ChevronRight size={18} className="text-white/70 group-hover:text-white transition-colors group-hover:translate-x-1" />
        </button>
      </div>

      {/* Feature Carousel */}
      <div className="w-full">
        <FeaturedCarousel />
      </div>

    </div>
  );
};

export default Landing;
