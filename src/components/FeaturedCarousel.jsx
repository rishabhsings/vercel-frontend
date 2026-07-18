import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BorderGlow from './BorderGlow';

const features = [
  {
    id: 1,
    icon: "🎙️",
    tag: "Core Engine",
    title: "Live Pitch Monitor",
    desc: "Sing into your mic and see your real-time pitch accuracy and note detection. Our advanced audio core handles autocorrelation to instantly display your exact frequency and cents deviation.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    icon: "📈",
    tag: "Onboarding",
    title: "Vocal Range Finder",
    desc: "Discover your true vocal range profile. By humming your lowest and highest comfortable notes, our AI categorizes your voice type (Soprano, Alto, Tenor, Bass) and calibrates your lessons.",
    image: "https://images.unsplash.com/photo-1516280440502-0bd126b89154?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    icon: "🎵",
    tag: "Practice",
    title: "Daily Warm-ups",
    desc: "A quick 5-minute interactive vocal track routine designed for beginner safety. Loosen your vocal cords with dynamic scales before jumping into intense singing sessions.",
    image: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4f8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    icon: "🥁",
    tag: "Rhythm",
    title: "Visual Metronome",
    desc: "Master timing, tempo, and time signatures with dynamic flashing beat indicators. Perfect your groove and stay on beat with customizable BPM settings.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    icon: "🏆",
    tag: "Profile Stats",
    title: "Milestone Showcase",
    desc: "Track your active daily login streaks, accumulated XP points, and unlocked singing badges. Stay motivated by visualizing your progress over time.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  }
];

const FeaturedCarousel = () => {
  const containerRef = useRef(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // Duplicate the features to create a seamless infinite scroll loop
  const duplicatedFeatures = [...features, ...features];

  return (
    <section className="w-full bg-transparent py-16 overflow-hidden relative z-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
          Platform <span className="text-indigo-400">Features</span>
        </h2>
        <p className="text-slate-500 max-w-2xl text-sm md:text-base font-medium mx-auto">
          Explore the powerful tools designed to elevate your vocal journey. Click any card to expand.
        </p>
      </div>

      <div className="relative max-w-[100vw] overflow-hidden">
        {/* Fading edges for infinite scroll effect without rectangular banding */}
        <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />
        
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          /* Pause animation when hovering over the container or when a card is selected */
          .marquee-container:hover .marquee-content {
            animation-play-state: paused !important;
          }
        `}} />
        
        {/* Infinite scrolling container. Using Framer Motion for the wrapper and controlling playback via state/CSS */}
        <div className="marquee-container flex pb-8 hide-scrollbar">
          <motion.div
            className="marquee-content flex gap-12 w-max"
            animate={{ x: selectedCard ? undefined : ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35, // Slower for readability
                ease: "linear",
              },
            }}
            // Pause animation when a card is selected
            style={{ animationPlayState: selectedCard ? 'paused' : 'running' }}
          >
            {duplicatedFeatures.map((feature, index) => {
              const uniqueId = `${feature.id}-${index}`;
              
              return (
                <BorderGlow
                  key={uniqueId}
                  className="w-[280px] h-[392px] md:w-[320px] md:h-[448px] flex-shrink-0 mx-2 group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  backgroundColor="#020617"
                  glowColor="238 80 60"
                  glowIntensity={2.5}
                  glowRadius={80}
                  edgeSensitivity={60}
                  borderRadius={16}
                  animated={false}
                >
                  <motion.div
                    layoutId={`card-container-${uniqueId}`}
                    onClick={() => setSelectedCard({ ...feature, uniqueId })}
                    className="relative w-full h-full rounded-2xl bg-slate-900 border border-slate-800/80 overflow-hidden flex flex-col shadow-lg z-10"
                  >
                  {/* Card Image Background (Full Height) */}
                  <motion.div layoutId={`card-image-container-${uniqueId}`} className="absolute inset-0 w-full h-full overflow-hidden">
                    <motion.img 
                      layoutId={`card-image-${uniqueId}`}
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </motion.div>

                  {/* Dark Gradient Overlay for text legibility */}
                  <motion.div layoutId={`card-gradient-${uniqueId}`} className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-0 group-hover:from-black transition-colors duration-500" />

                  {/* Content Container */}
                  <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                    
                    {/* Header (Icon + Tag) */}
                    <div className="flex justify-between items-start">
                      <motion.div layoutId={`card-icon-${uniqueId}`} className="text-3xl bg-white/20 backdrop-blur-md p-2 rounded-full shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                        {feature.icon}
                      </motion.div>
                      <motion.span layoutId={`card-tag-${uniqueId}`} className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-colors duration-300">
                        {feature.tag}
                      </motion.span>
                    </div>
                    
                    {/* Text Footer */}
                    <motion.div layoutId={`card-text-container-${uniqueId}`} className="mt-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <motion.h3 layoutId={`card-title-${uniqueId}`} className="text-xl md:text-2xl font-black text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors duration-300">
                        {feature.title}
                      </motion.h3>
                      <motion.p layoutId={`card-desc-${uniqueId}`} className="text-slate-300 text-sm leading-relaxed font-medium line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        {feature.desc}
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
                </BorderGlow>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Expanded Modal View using AnimatePresence */}
      <AnimatePresence>
        {selectedCard && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 cursor-pointer"
            />
            
            {/* Expanded Card */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
              <motion.div
                layoutId={`card-container-${selectedCard.uniqueId}`}
                className="w-full max-w-2xl h-[80vh] max-h-[800px] relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col shadow-2xl pointer-events-auto"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-indigo-500 text-white p-2 rounded-full backdrop-blur-md transition-colors duration-200"
                >
                  <X size={24} />
                </button>

                {/* Expanded Image */}
                <motion.div layoutId={`card-image-container-${selectedCard.uniqueId}`} className="absolute inset-0 w-full h-full overflow-hidden">
                  <motion.img 
                    layoutId={`card-image-${selectedCard.uniqueId}`}
                    src={selectedCard.image} 
                    alt={selectedCard.title} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Expanded Gradient */}
                <motion.div layoutId={`card-gradient-${selectedCard.uniqueId}`} className="absolute inset-0 w-full h-full bg-gradient-to-t from-black via-black/60 to-black/10 z-0" />

                {/* Expanded Content */}
                <div className="relative z-10 p-10 md:p-14 flex flex-col h-full justify-between">
                  
                  <div className="flex justify-between items-start">
                    <motion.div layoutId={`card-icon-${selectedCard.uniqueId}`} className="text-5xl md:text-6xl bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg">
                      {selectedCard.icon}
                    </motion.div>
                    <motion.span layoutId={`card-tag-${selectedCard.uniqueId}`} className="px-4 py-2 bg-indigo-500 backdrop-blur-md border border-indigo-500/50 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                      {selectedCard.tag}
                    </motion.span>
                  </div>
                  
                  <motion.div layoutId={`card-text-container-${selectedCard.uniqueId}`} className="mt-auto">
                    <motion.h3 layoutId={`card-title-${selectedCard.uniqueId}`} className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-md">
                      {selectedCard.title}
                    </motion.h3>
                    <motion.p layoutId={`card-desc-${selectedCard.uniqueId}`} className="text-slate-200 text-base md:text-xl leading-relaxed font-medium drop-shadow-sm max-w-xl">
                      {selectedCard.desc}
                    </motion.p>
                    
                    <motion.button 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setSelectedCard(null)}
                      className="mt-8 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Explore Feature
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedCarousel;
