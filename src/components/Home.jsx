import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Mic, BarChart2, Activity, Clock, ShieldCheck, ChevronRight, User, PlayCircle, Award, Star } from 'lucide-react';
import BorderGlow from './BorderGlow';
import CardSwap, { Card } from './CardSwap';

const features = [
  {
    id: 1,
    icon: "🎙️",
    title: "Live Pitch Monitor",
    desc: "Sing into your mic and see your real-time vocal accuracy graph map out notes automatically."
  },
  {
    id: 2,
    icon: "📈",
    title: "Vocal Range Finder",
    desc: "Find your lowest and highest safe notes to calculate your true voice type during onboarding."
  },
  {
    id: 3,
    icon: "🎵",
    title: "Daily Vocal Warm-ups",
    desc: "A quick 5-minute interactive vocal track routine designed for beginner vocal safety."
  },
  {
    id: 4,
    icon: "🥁",
    title: "Visual Metronome",
    desc: "Master timing, tempo, and time signatures with dynamic flashing beat indicators."
  },
  {
    id: 5,
    icon: "🏆",
    title: "Milestone Showcase",
    desc: "Track active daily login streaks, accumulated XP points, and unlocked badges."
  }
];

const Home = () => {
  const { setCurrentView } = useApp();
  const carouselRef = useRef(null);
  const duplicatedFeatures = [...features, ...features];

  return (
    <div className="relative">

      {/* 2. HIGH-IMPACT HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-indigo-500/30 mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
            ✨ Native Browser Pitch Analysis Now Live
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6 max-w-4xl bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent drop-shadow-sm">
          Master Your Singing Voice Through Real-Time Visual Feedback
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 font-medium leading-relaxed">
          No expensive studio gear required. Just your device's microphone and an eager beginner singer ready to decode their voice using our advanced AI-driven audio core.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setCurrentView('range-finder')}
            className="w-full sm:w-auto bg-white text-slate-950 font-bold py-3.5 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            Start Free Assessment 🚀
          </button>
          <button 
            onClick={() => setCurrentView('lessons')}
            className="w-full sm:w-auto bg-slate-900/50 border border-slate-700 text-white font-bold py-3.5 px-8 rounded-full hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <PlayCircle size={18} className="text-slate-400" /> Explore Lessons
          </button>
        </div>
      </section>

      {/* 3. RIGHT-TO-LEFT HORIZONTAL SWIPING CAROUSEL TRACK */}
      <section className="py-20 relative border-y border-slate-800/30 bg-slate-950/20 backdrop-blur-[2px] overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight">Platform Core</h2>
        </div>

        {/* CSS for hiding scrollbars strictly */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scroll::-webkit-scrollbar { display: none; }
          .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        <div className="relative max-w-[100vw] overflow-hidden">
          {/* Edge Fades */}
          <div className="absolute top-0 left-0 w-16 md:w-48 h-full bg-gradient-to-r from-slate-950/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 md:w-48 h-full bg-gradient-to-l from-slate-950/80 to-transparent z-20 pointer-events-none" />
          
          <motion.div
            ref={carouselRef}
            className="flex gap-6 pb-8 hide-scroll w-max cursor-grab active:cursor-grabbing px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {duplicatedFeatures.map((feature, index) => (
              <BorderGlow
                key={`${feature.id}-${index}`}
                className="w-[300px] md:w-[350px] h-[220px] flex-shrink-0 group transition-all duration-300 hover:scale-[1.02]"
                backgroundColor="#020617"
                glowColor="238 80 60"
                glowIntensity={2.5}
                glowRadius={80}
                edgeSensitivity={60}
                borderRadius={16}
                animated={false}
              >
                <div className="p-6 h-full flex flex-col bg-slate-900/60 backdrop-blur-md rounded-2xl z-10 relative">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </BorderGlow>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. THREE-STEP 'HOW IT WORKS' BLUEPRINT SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white tracking-tight mb-4">The Onboarding Blueprint</h2>
          <p className="text-slate-400 max-w-xl mx-auto">A frictionless journey for anxious beginners to find their voice safely and accurately.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />

          {/* Step 1 */}
          <BorderGlow 
            className="group transition-all duration-300 hover:scale-[1.02]"
            backgroundColor="#020617"
            glowColor="238 80 60"
            glowIntensity={2.5}
            glowRadius={80}
            edgeSensitivity={60}
            borderRadius={24}
          >
            <div className="p-8 text-center h-full bg-slate-900/60 backdrop-blur-md rounded-3xl z-10 relative">
              <div className="w-16 h-16 mx-auto bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden transition-colors">
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Mic className="text-indigo-400" size={28} />
              </div>
              <span className="text-xs font-bold text-indigo-500 tracking-widest uppercase mb-2 block">Step 01</span>
              <h3 className="text-xl font-bold text-white mb-3">Connect Microphone</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Instant local audio stream capture directly in your browser. No downloads needed.</p>
            </div>
          </BorderGlow>

          {/* Step 2 */}
          <BorderGlow 
            className="group transition-all duration-300 hover:scale-[1.02]"
            backgroundColor="#020617"
            glowColor="160 84 40"
            glowIntensity={2.5}
            glowRadius={80}
            edgeSensitivity={60}
            borderRadius={24}
          >
            <div className="p-8 text-center h-full bg-slate-900/60 backdrop-blur-md rounded-3xl z-10 relative">
              <div className="w-16 h-16 mx-auto bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden transition-colors">
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Activity className="text-emerald-400" size={28} />
              </div>
              <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase mb-2 block">Step 02</span>
              <h3 className="text-xl font-bold text-white mb-3">Match the Targets</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Follow the moving note guide lines on screen and match the pitch visualizer.</p>
            </div>
          </BorderGlow>

          {/* Step 3 */}
          <BorderGlow 
            className="group transition-all duration-300 hover:scale-[1.02]"
            backgroundColor="#020617"
            glowColor="40 96 50"
            glowIntensity={2.5}
            glowRadius={80}
            edgeSensitivity={60}
            borderRadius={24}
          >
            <div className="p-8 text-center h-full bg-slate-900/60 backdrop-blur-md rounded-3xl z-10 relative">
              <div className="w-16 h-16 mx-auto bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden transition-colors">
                <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Award className="text-amber-400" size={28} />
              </div>
              <span className="text-xs font-bold text-amber-500 tracking-widest uppercase mb-2 block">Step 03</span>
              <h3 className="text-xl font-bold text-white mb-3">Level Up & Unlock Stats</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Collect XP points, maintain your streak, and track your voice parameters over time.</p>
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* 5. COMMUNITY REVIEWS & METRICS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white tracking-tight mb-4">Student Reviews & Vocal Progress Analytics</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Explore real student success transformations powered by real-time vocal audio analysis and gamified pitch milestones.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Performance Metrics */}
          <div className="flex flex-col gap-5">
            {[
              {
                title: "Real-Time Calibration",
                icon: "⚡",
                desc: "Validated by instant browser pitch algorithms for direct, zero-latency biofeedback."
              },
              {
                title: "Tone Correction Precision",
                icon: "🎯",
                desc: "Smart audio matching engine flags flat or sharp registers to guide adjustments in milliseconds."
              },
              {
                title: "Safe Range Expansion",
                icon: "📈",
                desc: "Automated profiling logs comfortable decibel and frequency bounds to gently extend vocal limits."
              },
              {
                title: "Milestone Verification",
                icon: "🏆",
                desc: "Track and compare daily consistency data markers against standard vocal training tracks."
              }
            ].map((metric, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex items-start gap-5 hover:bg-slate-900/80 transition-colors hover:border-slate-700">
                <div className="text-2xl mt-0.5 bg-slate-800 w-12 h-12 flex items-center justify-center rounded-full border border-slate-700 shadow-inner">
                  {metric.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1.5">{metric.title}</h4>
                  <p className="text-slate-400 leading-relaxed text-sm font-medium">{metric.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Overlapping Testimonial Cards (CardSwap) */}
          <div className="flex justify-center items-center h-[600px] relative w-full overflow-hidden">
            <CardSwap
              width={460}
              height={440}
              cardDistance={65}
              verticalDistance={50}
              delay={3500}
              pauseOnHover={true}
            >
              {[
                {
                  title: "Pitch Match Mastery",
                  name: "Garv K., Absolute Beginner",
                  icon: "🎙️",
                  iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
                  review: "I thought I was completely tone-deaf until the live visual tracker showed me exactly how to adjust my pitch. Unlocked a steady Middle C4 in less than a week!",
                },
                {
                  title: "Range Expansion",
                  name: "Mayank S., Tech Student",
                  icon: "📈",
                  iconBg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.2)]",
                  review: "The daily onboarding tool mapped out my exact safe vocal range benchmarks. I went from straining on basic scales to cleanly stepping into my natural Tenor spectrum.",
                },
                {
                  title: "Rhythm & Timing Control",
                  name: "rishabh singh",
                  icon: "🥁",
                  iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
                  review: "The visual metronome grid completely fixed my timing issues. Seeing the beats flash in real-time makes understanding 4/4 timing signatures feel like a video game.",
                }
              ].map((review, i) => (
                <Card key={i} className="p-10 flex flex-col cursor-pointer border-slate-700 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl border ${review.iconBg} text-3xl shrink-0`}>
                      {review.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl leading-tight mb-1.5">{review.title}</h3>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={16} className="text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-8 italic leading-relaxed font-medium text-lg">"{review.review}"</p>
                  <div className="mt-auto">
                    <span className="text-indigo-400 text-base font-bold tracking-wider">— {review.name}</span>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
