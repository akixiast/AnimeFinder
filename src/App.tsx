/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { BrowseView } from './views/BrowseView';
import { ScheduleView } from './views/ScheduleView';
import { QuizView } from './views/QuizView';
import { WatchlistView } from './views/WatchlistView';
import { AnimeModal } from './components/AnimeModal';
import { CharacterModal } from './components/CharacterModal';
import { SurpriseModal } from './components/SurpriseModal';
import { CompareModal } from './components/CompareModal';
import { QuickSearchModal } from './components/QuickSearchModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [browseFilters, setBrowseFilters] = useState<any>(null);

  // Modals state
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: string, filterParams?: any) => {
    setCurrentTab(tab);
    if (filterParams) {
      setBrowseFilters(filterParams);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#FF3E00] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => handleNavigate(tab)}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-8">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectAnime={(id) => setSelectedAnimeId(id)}
            onOpenSurprise={() => setIsSurpriseOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentTab === 'browse' && (
          <BrowseView
            onSelectAnime={(id) => setSelectedAnimeId(id)}
            initialFilters={browseFilters}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleView onSelectAnime={(id) => setSelectedAnimeId(id)} />
        )}

        {currentTab === 'quiz' && (
          <QuizView onSelectAnime={(id) => setSelectedAnimeId(id)} />
        )}

        {currentTab === 'watchlist' && (
          <WatchlistView
            onSelectAnime={(id) => setSelectedAnimeId(id)}
            onNavigateBrowse={() => handleNavigate('browse')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => handleNavigate(tab)}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
      />

      {/* Modals & Overlays */}
      <AnimeModal
        animeId={selectedAnimeId}
        onClose={() => setSelectedAnimeId(null)}
        onSelectAnime={(id) => setSelectedAnimeId(id)}
        onSelectCharacter={(charId) => setSelectedCharacterId(charId)}
      />

      <CharacterModal
        characterId={selectedCharacterId}
        onClose={() => setSelectedCharacterId(null)}
      />

      <SurpriseModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        onSelectAnime={(id) => setSelectedAnimeId(id)}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectAnime={(id) => {
          setIsCompareOpen(false);
          setSelectedAnimeId(id);
        }}
      />

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAnime={(id) => setSelectedAnimeId(id)}
      />
    </div>
  );
}

