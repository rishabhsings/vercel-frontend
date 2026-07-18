import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Video, Play, Search, Youtube, ArrowLeft, ArrowRight } from 'lucide-react';

const Tutorials = () => {
  const { user, setCurrentView } = useApp();
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract video ID from youtube URL
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getRecommendations = (voiceType) => {
    const defaultRecs = [
      {
        title: "Daily Humming and Vocal Exercises",
        duration: "5 mins",
        url: "https://www.youtube.com/watch?v=2TzC7s9j59Y",
        description: "Perfect for absolute beginners to loosen vocal cords gently.",
        category: "Warmup"
      },
      {
        title: "Pitch Matching for Complete Beginners",
        duration: "8 mins",
        url: "https://www.youtube.com/watch?v=68TjR0B6x3c",
        description: "Focuses on tuning your ears to match key piano chords.",
        category: "Pitch Control"
      },
      {
        title: "Breathing Techniques for Singers",
        duration: "11 mins",
        url: "https://www.youtube.com/watch?v=a3JMlsMbGz0",
        description: "Learn diaphragmatic breathing to support longer and stronger notes.",
        category: "Technique"
      },
      {
        title: "How to Sing High Notes Safely",
        duration: "14 mins",
        url: "https://www.youtube.com/watch?v=kR2tI8v9Vpw",
        description: "Prevent vocal strain when reaching for the top of your range.",
        category: "Vocal Range"
      }
    ];

    switch (voiceType) {
      case 'Soprano':
        return [
          {
            title: "Soprano High Range Extension & Warmup",
            duration: "10 mins",
            url: "https://www.youtube.com/watch?v=3g8K9114b0Y",
            description: "Exercises focusing on safe head voice transitions and breath support for high sopranos.",
            category: "Range Extension"
          },
          {
            title: "Breathing Exercises for High Notes",
            duration: "6 mins",
            url: "https://www.youtube.com/watch?v=FjUcr7z5J4A",
            description: "Strengthen diaphragmatic posture to support higher octaves.",
            category: "Technique"
          },
          ...defaultRecs
        ];
      case 'Alto':
        return [
          {
            title: "Alto Vocal Warmups (D3 to A5)",
            duration: "12 mins",
            url: "https://www.youtube.com/watch?v=zJg4v4vI7k0",
            description: "Ideal chest and middle-voice mix exercises for alto ranges.",
            category: "Warmup"
          },
          {
            title: "Rich Warmth in Lower-Mid Registry",
            duration: "7 mins",
            url: "https://www.youtube.com/watch?v=aPzJ3_e2eD4",
            description: "Techniques to maintain a full alto warmth without cracking.",
            category: "Tone Quality"
          },
          ...defaultRecs
        ];
      case 'Tenor':
        return [
          {
            title: "Tenor Head Voice Expansion Tutorial",
            duration: "15 mins",
            url: "https://www.youtube.com/watch?v=2K4Vb7aN0X4",
            description: "Unlocking falsetto and bridging register transitions for tenors.",
            category: "Range Extension"
          },
          {
            title: "Pitch Closeness for High Male Registers",
            duration: "8 mins",
            url: "https://www.youtube.com/watch?v=GkX0q5kZ10g",
            description: "Prevent straining on F4 to A4 notes.",
            category: "Pitch Control"
          },
          ...defaultRecs
        ];
      case 'Bass':
        return [
          {
            title: "Deep Vocal Resonance for Basses (E2 to C4)",
            duration: "10 mins",
            url: "https://www.youtube.com/watch?v=dpxXQ1q7u5o",
            description: "Maximize chest cavity resonance and control deep frequencies safely.",
            category: "Tone Quality"
          },
          {
            title: "Deep Bass Warmup Exercises",
            duration: "8 mins",
            url: "https://www.youtube.com/watch?v=M2Oszb8j_k8",
            description: "Exercises for starting singing in the lower octaves safely.",
            category: "Warmup"
          },
          ...defaultRecs
        ];
      default:
        return defaultRecs;
    }
  };

  const vocalProfile = user?.vocalProfile || {};
  const voiceType = vocalProfile.voiceType || 'Undetermined';
  const allVideos = getRecommendations(voiceType);

  const filteredVideos = allVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 animate-fade-in relative z-10">
      {activeVideo ? (
        // Video Player View
        <div className="animate-fade-in flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveVideo(null)}
              className="btn-secondary flex items-center gap-1.5 py-2 px-4 text-sm"
            >
              <ArrowLeft size={16} /> Back to Library
            </button>
            <span className="bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1.5 rounded-full font-bold border border-indigo-500/30">
              {activeVideo.category}
            </span>
          </div>

          <div className="glass-card overflow-hidden p-0 border-slate-800/80 shadow-2xl shadow-black/50">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.url)}?autoplay=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">{activeVideo.title}</h2>
              <p className="text-slate-300 mb-4 font-medium">{activeVideo.description}</p>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><Youtube size={14} className="text-red-500" /> YouTube</span>
                <span>•</span>
                <span>{activeVideo.duration}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Library View
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-2 tracking-tight">
                <Video className="text-indigo-400" size={28} /> Video Tutorials
              </h1>
              <p className="text-slate-400 font-medium">
                Master vocal techniques with curated video lessons for your {voiceType !== 'Undetermined' ? <span className="text-indigo-400 font-bold">{voiceType}</span> : 'starter'} voice.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 shadow-inner">
              <Video size={48} className="mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-black text-white mb-2">No videos found</h3>
              <p className="text-slate-400 text-sm font-medium">Try adjusting your search query.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-indigo-400 text-sm font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => {
                const videoId = getYoutubeId(video.url);
                const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

                return (
                  <div 
                    key={index}
                    className="glass-card-hover border-slate-800/50 overflow-hidden flex flex-col group cursor-pointer p-0"
                    onClick={() => setActiveVideo(video)}
                  >
                    <div className="relative h-48 bg-slate-800 overflow-hidden">
                      {thumbnailUrl ? (
                        <img 
                          src={thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                          <Youtube size={48} className="text-slate-600" />
                        </div>
                      )}
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play size={24} className="text-indigo-400 ml-1 flex-shrink-0" fill="currentColor" />
                        </div>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        {video.duration}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                          {video.category}
                        </span>
                        <h3 className="text-sm font-black text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tutorials;
