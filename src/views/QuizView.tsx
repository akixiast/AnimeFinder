import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Check, Star, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimeMedia } from '../types/anime';
import { browseAnime } from '../services/anilist';
import { AnimeCard } from '../components/AnimeCard';

interface QuizViewProps {
  onSelectAnime: (id: number) => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    label: string;
    value: string;
    icon: string;
    desc: string;
    genreMatch?: string;
    formatMatch?: string;
    sortMatch?: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'What mood or vibe are you looking for?',
    subtitle: 'Choose the primary emotion you want to experience.',
    options: [
      {
        label: 'Adrenaline & High Stakes',
        value: 'Action',
        icon: '⚔️',
        desc: 'Intense battles, mind-blowing animation & hype.',
        genreMatch: 'Action',
      },
      {
        label: 'Heartwarming & Romance',
        value: 'Romance',
        icon: '💖',
        desc: 'Cute moments, butterfly feelings & emotional bonds.',
        genreMatch: 'Romance',
      },
      {
        label: 'Mind-Bending & Mystery',
        value: 'Mystery',
        icon: '🕵️',
        desc: 'Psychological mind games, plot twists & deep lore.',
        genreMatch: 'Mystery',
      },
      {
        label: 'Relaxing & Laughs',
        value: 'Comedy',
        icon: '😂',
        desc: 'Wholesome slice-of-life vibes and pure comedy.',
        genreMatch: 'Comedy',
      },
    ],
  },
  {
    id: 2,
    title: 'What kind of universe do you want to enter?',
    subtitle: 'Pick your ideal world building setting.',
    options: [
      {
        label: 'High Fantasy / Magic',
        value: 'Fantasy',
        icon: '🐉',
        desc: 'Dragons, spells, guilds, and magical realms.',
        genreMatch: 'Fantasy',
      },
      {
        label: 'Sci-Fi & Cyberpunk',
        value: 'Sci-Fi',
        icon: '🚀',
        desc: 'Space exploration, mecha, AI, and futuristic tech.',
        genreMatch: 'Sci-Fi',
      },
      {
        label: 'Dark Supernatural',
        value: 'Supernatural',
        icon: '👻',
        desc: 'Demons, spirits, vampires, and eerie powers.',
        genreMatch: 'Supernatural',
      },
      {
        label: 'Modern Realistic',
        value: 'Slice of Life',
        icon: '🏫',
        desc: 'Relatable everyday school, workplace, or sports life.',
        genreMatch: 'Slice of Life',
      },
    ],
  },
  {
    id: 3,
    title: 'What kind of main character do you root for?',
    subtitle: 'The protagonist that makes a story unforgettable.',
    options: [
      {
        label: 'The Underdog',
        value: 'underdog',
        icon: '🌱',
        desc: 'Starts with nothing, earns every victory through grit.',
        genreMatch: 'Sports',
      },
      {
        label: 'The Mastermind Genius',
        value: 'genius',
        icon: '🧠',
        desc: '10 steps ahead of everyone with ruthless intelligence.',
        genreMatch: 'Psychological',
      },
      {
        label: 'The Legendary Hero',
        value: 'hero',
        icon: '⚡',
        desc: 'Overpowered, charismatic, and protecting friends.',
        genreMatch: 'Action',
      },
      {
        label: 'The Relatable Misfit',
        value: 'misfit',
        icon: '🎒',
        desc: 'Ordinary human thrust into extraordinary situations.',
        genreMatch: 'Drama',
      },
    ],
  },
  {
    id: 4,
    title: 'How much commitment are you ready for?',
    subtitle: 'Choose your desired format length.',
    options: [
      {
        label: 'Full Binge Series',
        value: 'TV',
        icon: '📺',
        desc: '12 to 24+ episodic seasons to get fully invested.',
        formatMatch: 'TV',
      },
      {
        label: 'Single Feature Film',
        value: 'MOVIE',
        icon: '🎬',
        desc: '2 hours of breathtaking cinema from start to finish.',
        formatMatch: 'MOVIE',
      },
      {
        label: 'Short OVA / Special',
        value: 'OVA',
        icon: '⚡',
        desc: 'Compact standalone story with zero filler.',
        formatMatch: 'OVA',
      },
      {
        label: 'Anything Goes',
        value: 'ANY',
        icon: '✨',
        desc: 'As long as the plot and visuals are fire, count me in.',
      },
    ],
  },
  {
    id: 5,
    title: 'What matters most to you?',
    subtitle: 'Your final quality touchstone.',
    options: [
      {
        label: 'Peak Animation Quality',
        value: 'modern',
        icon: '🌟',
        desc: 'Top-tier studio budget (Ufotable, MAPPA, Wit, Kyoto Animation).',
        sortMatch: 'SCORE_DESC',
      },
      {
        label: 'Plot Twists & Depth',
        value: 'story',
        icon: '📜',
        desc: 'Complex storylines with emotional resonance.',
        sortMatch: 'SCORE_DESC',
      },
      {
        label: 'Fan Community Hype',
        value: 'hype',
        icon: '🔥',
        desc: 'The most popular trending shows everyone talks about.',
        sortMatch: 'POPULARITY_DESC',
      },
      {
        label: 'Hidden Masterpiece',
        value: 'hidden',
        icon: '💎',
        desc: 'Underrated gem with a cult following and 80%+ ratings.',
        sortMatch: 'SCORE_DESC',
      },
    ],
  },
];

export const QuizView: React.FC<QuizViewProps> = ({ onSelectAnime }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [results, setResults] = useState<AnimeMedia[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const handleSelectOption = async (option: any) => {
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all questions! Calculate results!
      setCurrentStep(QUESTIONS.length);
      setLoadingResults(true);

      const genre1 = nextAnswers[0]?.genreMatch;
      const genre2 = nextAnswers[1]?.genreMatch;
      const format = nextAnswers[3]?.formatMatch;
      const sort = nextAnswers[4]?.sortMatch || 'SCORE_DESC';

      const data = await browseAnime({
        page: 1,
        search: '',
        genre: genre1 || genre2 || '',
        format: format || '',
        status: '',
        sort: sort,
        minScore: '75',
        year: '',
      });

      if (data && data.media.length > 0) {
        // Pick top 4 curated picks
        const picks = data.media.slice(0, 4);
        setResults(picks);

        // Confetti!
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } else {
        setResults([]);
      }
      setLoadingResults(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResults([]);
  };

  // If completed questions
  if (currentStep >= QUESTIONS.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 pb-16 animate-in fade-in duration-300">
        <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FF3E00]">
              MATCH COMPLETE // 100%
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display mt-1">
              Your Curated Picks
            </h1>
          </div>
          <p className="text-xs uppercase font-mono tracking-wider text-white/50 max-w-sm">
            Based on: {answers.map((a) => a.label).slice(0, 2).join(' + ')}
          </p>
        </div>

        {loadingResults ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-white/20 border-t-[#FF3E00] rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-white/50 animate-pulse">
              ANALYZING PROFILE & QUERYING RECOMMENDATIONS...
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center bg-[#111111] rounded-sm border border-white/10">
            <p className="text-sm uppercase font-mono text-white/60">No exact matches found for this specific combination.</p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-3 bg-white hover:bg-[#FF3E00] text-black hover:text-white font-bold text-xs uppercase tracking-widest rounded-sm transition"
            >
              Start Over
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((anime, idx) => (
              <div key={anime.id} className="h-full">
                <AnimeCard
                  anime={anime}
                  index={idx}
                  onClick={() => onSelectAnime(anime.id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center pt-6 border-t border-white/10">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-sm bg-black hover:bg-white text-white hover:text-black border border-white/20 font-bold text-xs uppercase tracking-widest transition-all group"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500 text-[#FF3E00] group-hover:text-black" />
            <span>Retake Recommendation Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentStep];
  const progressPercent = ((currentStep) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Progress Bar Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-white/50">
          <span>
            QUESTION {currentStep + 1} OF {QUESTIONS.length}
          </span>
          <span className="text-[#FF3E00] font-bold">{Math.round(progressPercent)}% COMPLETE</span>
        </div>

        <div className="w-full bg-black h-1 rounded-none overflow-hidden border border-white/10">
          <div
            className="h-full bg-[#FF3E00] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card Box */}
      <div className="bg-[#111111] p-6 sm:p-10 rounded-sm border border-white/10 relative overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#FF3E00] font-bold">
            STEP {currentStep + 1}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-display mt-2 leading-tight">
            {currentQ.title}
          </h2>
          <p className="text-xs uppercase font-mono tracking-wider text-white/50 mt-2">{currentQ.subtitle}</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelectOption(opt)}
              className="group flex items-start gap-4 p-4 rounded-sm bg-black hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-150 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-sm bg-white/5 group-hover:bg-black/10 border border-white/10 group-hover:border-black/20 text-xl flex items-center justify-center shrink-0">
                {opt.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight font-display transition-colors">
                  {opt.label}
                </h4>
                <p className="text-[11px] text-white/50 group-hover:text-black/70 mt-1 uppercase font-mono leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Back / Skip Option */}
      <div className="flex justify-between items-center px-1 font-mono text-xs uppercase tracking-wider">
        {currentStep > 0 ? (
          <button
            onClick={() => {
              setCurrentStep(currentStep - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="text-white/60 hover:text-white font-bold"
          >
            ← PREVIOUS STEP
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleReset}
          className="text-white/40 hover:text-[#FF3E00]"
        >
          RESET
        </button>
      </div>
    </div>
  );
};
