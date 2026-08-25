import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Play, ChevronRight, Tv } from 'lucide-react';
import { AiringScheduleItem } from '../types/anime';
import { fetchAiringSchedule } from '../services/anilist';

interface ScheduleViewProps {
  onSelectAnime: (id: number) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onSelectAnime }) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [schedules, setSchedules] = useState<AiringScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Generate 7 days starting from today
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return {
      offset: i,
      date: d,
      timestamp: Math.floor(d.getTime() / 1000),
      dayName: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday: i === 0,
    };
  });

  const currentSelectedDay = days[selectedDayOffset] || days[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchAiringSchedule(currentSelectedDay.timestamp).then((data) => {
      if (!isMounted) return;
      setSchedules(data);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedDayOffset, currentSelectedDay.timestamp]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FF3E00]">
            03 / BROADCASTING FEED
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display mt-1">
            Airing Schedule
          </h1>
        </div>
        <p className="text-xs uppercase font-mono tracking-wider text-white/50">
          TIMESTAMPS SYNCED TO LOCAL DEVICE TIME
        </p>
      </div>

      {/* 7-Day Pill Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {days.map((day) => {
          const isSelected = selectedDayOffset === day.offset;
          return (
            <button
              key={day.offset}
              onClick={() => setSelectedDayOffset(day.offset)}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-sm border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black border-white shadow-xl'
                  : 'bg-black hover:bg-white/10 border-white/20 text-white/60 hover:text-white'
              }`}
            >
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                  isSelected ? 'text-[#FF3E00]' : 'text-white/40'
                }`}
              >
                {day.dayName}
              </span>
              <span className="text-xl font-black font-display mt-0.5">{day.date.getDate()}</span>
              <span
                className={`text-[9px] font-mono uppercase tracking-wider ${
                  isSelected ? 'text-black/70' : 'text-white/40'
                }`}
              >
                {day.date.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Airing List */}
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-sm bg-white/5 animate-pulse border border-white/10"
              />
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-16 text-center bg-[#111111] rounded-sm border border-white/10 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-sm bg-black border border-white/20 text-white/40 flex items-center justify-center mx-auto text-xl font-mono">
              ∅
            </div>
            <h3 className="text-lg font-black uppercase text-white font-display">No Airing Releases</h3>
            <p className="text-xs uppercase font-mono tracking-wider text-white/50">
              No new episodes scheduled to broadcast on this date.
            </p>
          </div>
        ) : (
          schedules.map((item, idx) => {
            const date = new Date(item.airingAt * 1000);
            const timeString = date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const anime = item.media;
            const title = anime.title.english || anime.title.romaji || 'Unknown Anime';
            const score = anime.averageScore;

            return (
              <div
                key={item.id}
                onClick={() => onSelectAnime(anime.id)}
                className="group flex items-center gap-4 p-3.5 rounded-sm bg-[#111111] hover:bg-black border border-white/10 hover:border-[#FF3E00] transition-all duration-150 cursor-pointer"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {/* Time & Episode Box */}
                <div className="w-20 sm:w-24 shrink-0 text-center py-2 px-1 rounded-sm bg-black border border-white/20">
                  <span className="block text-sm sm:text-base font-bold text-white font-mono">
                    {timeString}
                  </span>
                  <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#FF3E00] text-white">
                    EP {item.episode}
                  </span>
                </div>

                {/* Poster Thumbnail */}
                <div className="w-12 sm:w-14 h-16 shrink-0 rounded-sm overflow-hidden bg-black border border-white/20">
                  <img
                    src={anime.coverImage.medium || anime.coverImage.large}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Title & Metadata */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-white truncate group-hover:text-[#FF3E00] transition-colors font-display">
                    {title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/50 mt-1 font-mono">
                    <span className="flex items-center gap-1 uppercase">
                      {anime.format || 'TV'}
                    </span>

                    {score && (
                      <span className="flex items-center gap-1 text-white font-bold">
                        <span className="text-[#FF3E00]">★</span>
                        {score}%
                      </span>
                    )}

                    {anime.genres && anime.genres.length > 0 && (
                      <span className="hidden sm:inline text-white/30 truncate">
                        • {anime.genres.slice(0, 3).join(' / ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Arrow Icon */}
                <div className="shrink-0 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase text-[#FF3E00]">
                    VIEW <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
