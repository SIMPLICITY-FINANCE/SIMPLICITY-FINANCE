import { X, User, Calendar, Clock, Podcast as PodcastIcon, Bookmark, Share2, Download, Globe, CheckCircle2, List, FileText, Youtube } from 'lucide-react';
import { useState } from 'react';
import React from 'react';

interface Appearance {
  id: string;
  podcastId: string;
  episodeTitle: string;
  podcastName: string;
  date: string;
  thumbnailUrl: string;
  guest?: string;
  description?: string;
  tags?: string[];
}

interface Person {
  id: string;
  name: string;
  handle: string;
  title: string;
  imageUrl: string;
  bio: string;
  expertise: string[];
  isVerified: boolean;
  totalAppearances: number;
  appearances: Appearance[];
}

interface PersonProfileProps {
  personId: string;
  onBack: () => void;
  onEpisodeClick?: (podcastId: string, episodeId: string) => void;
}

// Mock person data
const mockPersonData: Record<string, Person> = {
  '1': {
    id: '1',
    name: 'Ray Dalio',
    handle: '@raydalio',
    title: 'Founder of Bridgewater Associates',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Founder of Bridgewater Associates, one of the world\'s largest hedge funds. Author of Principles. Known for pioneering radical transparency and systematic decision-making approaches in investment management.',
    expertise: ['Investing', 'Economics', 'Management', 'Philosophy'],
    isVerified: true,
    totalAppearances: 24,
    appearances: [
      {
        id: 'a1',
        podcastId: 'p1',
        episodeTitle: 'Understanding the Changing World Order',
        podcastName: 'The Compound and Friends',
        guest: 'Ray Dalio',
        date: '3d ago',
        description: 'Ray discusses his perspectives on the changing global economic order, analyzing historical patterns of rising and declining empires. He explores how these cycles affect modern investing and provides insights on navigating the current geopolitical landscape.',
        tags: ['Economics', 'Geopolitics', 'Investing', 'History', 'Strategy'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
      },
      {
        id: 'a2',
        podcastId: 'p2',
        episodeTitle: 'Principles for Navigating Big Debt Crises',
        podcastName: 'Planet Money',
        guest: 'Ray Dalio',
        date: '1 week ago',
        description: 'An in-depth conversation about debt cycles and how to prepare for economic downturns. Ray shares principles from his extensive research on historical debt crises and provides actionable frameworks for investors and policymakers.',
        tags: ['Debt', 'Economics', 'Crisis Management', 'Policy', 'Markets'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop'
      },
      {
        id: 'a3',
        podcastId: 'p3',
        episodeTitle: 'The Future of Capitalism',
        podcastName: 'All-In Podcast',
        guest: 'Ray Dalio',
        date: '2 weeks ago',
        description: 'Ray examines the current state of capitalism and proposes reforms needed for a more sustainable economic system. He discusses wealth inequality, productivity, and the role of policy in shaping our economic future.',
        tags: ['Capitalism', 'Reform', 'Policy', 'Inequality', 'Economics'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Cathie Wood',
    handle: '@cathiewood',
    title: 'Founder and CEO of ARK Invest',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Founder and CEO of ARK Invest, focused on disruptive innovation in technology and healthcare. Pioneer of actively managed ETFs focused on innovation and technological disruption.',
    expertise: ['Innovation', 'Technology', 'Healthcare', 'ETFs'],
    isVerified: true,
    totalAppearances: 18,
    appearances: [
      {
        id: 'a1',
        podcastId: 'p3',
        episodeTitle: 'AI and the Future of Innovation',
        podcastName: 'All-In Podcast',
        date: '1d ago',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&h=400&fit=crop'
      },
      {
        id: 'a2',
        podcastId: 'p4',
        episodeTitle: 'Disruptive Innovation in 2026',
        podcastName: 'Invest Like the Best',
        date: '4d ago',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=400&fit=crop'
      }
    ]
  }
};

export function PersonProfile({ personId, onBack, onEpisodeClick }: PersonProfileProps) {
  const [savedAppearances, setSavedAppearances] = useState<Set<string>>(new Set());
  const person = mockPersonData[personId];

  const handleSaveToggle = (appearanceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAppearances(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appearanceId)) {
        newSet.delete(appearanceId);
      } else {
        newSet.add(appearanceId);
      }
      return newSet;
    });
  };

  if (!person) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Person not found</h2>
        <p className="text-muted-foreground">This person doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section - Matching PodcastDetailModal */}
      <div className="bg-card border border-border/50 rounded-xl p-4 mb-5 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200">
        <div className="flex gap-4 items-start">
          {/* Person Photo */}
          <div className="flex-shrink-0">
            <img
              src={person.imageUrl}
              alt={person.name}
              className="w-20 h-20 rounded-lg object-cover border border-border/50 shadow-sm"
            />
          </div>

          {/* Person Info */}
          <div className="flex-1 min-w-0">
            {/* Title row with social buttons */}
            <div className="flex items-center justify-between gap-3 mb-2.5">
              {/* Name with handle and user icon */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <h1 className="text-[11px] font-semibold text-foreground truncate">
                  {person.name} <span className="text-[10px] text-muted-foreground font-normal">- {person.title}</span>
                </h1>
              </div>

              {/* Social Links - Horizontal on title line */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                  title="YouTube"
                >
                  <Youtube className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                  title="Substack"
                >
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                  </svg>
                </a>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-6 h-6 rounded-lg bg-background border border-border/50 hover:bg-muted hover:shadow-sm transition-all flex items-center justify-center"
                  title="Website"
                >
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              </div>
            </div>
            
            {/* Separator */}
            <div className="border-t border-border/30 mb-2.5" />

            {/* Bio - matching summary card size */}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {person.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Separator before appearances */}
      <div className="border-t border-border/30 mb-4" />

      {/* Appearances Section - Matching Episodes Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <List className="w-3.5 h-3.5 text-foreground" />
            <h2 className="text-xs font-semibold text-foreground">Recent Appearances</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">
              {person.appearances.length} Appearances
            </span>
          </div>
        </div>

        {/* Appearances List */}
        <div className="space-y-3">
          {person.appearances.map((appearance) => (
            <div
              key={appearance.id}
              className="rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-md hover:bg-accent/30 hover:border-border transition-all duration-200 cursor-pointer"
              onClick={() => {
                onEpisodeClick?.(appearance.podcastId, appearance.id);
              }}
            >
              <div className="p-3">
                <div className="flex gap-3">
                  {/* Episode Image */}
                  <img
                    src={appearance.thumbnailUrl}
                    alt={appearance.episodeTitle}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title Row with Action Buttons */}
                    <div className="flex items-start justify-between gap-3 mb-2 pb-2 border-b border-border/30">
                      {/* Title - Left Aligned */}
                      <div className="flex items-start gap-1.5 flex-1 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-foreground flex-shrink-0 mt-0.5" />
                        <h3 className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2">
                          {appearance.episodeTitle}
                        </h3>
                      </div>

                      {/* Action Buttons - Right Side */}
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button 
                          onClick={(e) => handleSaveToggle(appearance.id, e)}
                          className="p-1 rounded-lg hover:bg-muted transition-all" 
                          title="Save"
                          aria-label="Save"
                        >
                          <Bookmark className={`w-3.5 h-3.5 transition-colors ${savedAppearances.has(appearance.id) ? 'fill-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'}`} />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg hover:bg-muted transition-all" 
                          title="Share"
                          aria-label="Share"
                        >
                          <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg hover:bg-muted transition-all" 
                          title="Download"
                          aria-label="Download"
                        >
                          <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                      </div>
                    </div>

                    {/* Show and Date Row */}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 pb-2 border-b border-border/30">
                      {/* Show */}
                      <div className="flex items-center gap-1">
                        <PodcastIcon className="w-3 h-3" />
                        <span>{appearance.podcastName}</span>
                      </div>
                      <div className="h-3 w-px bg-border/40 flex-shrink-0" />
                      {/* Date */}
                      <div className="flex items-center gap-1">
                        {appearance.date.includes('ago') ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <Calendar className="w-3 h-3" />
                        )}
                        <span>{appearance.date}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {appearance.description && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 mb-2 pb-2 border-b border-border/30">
                        {appearance.description}
                      </p>
                    )}

                    {/* Tags at bottom - evenly distributed like episode card */}
                    {appearance.tags && appearance.tags.length > 0 && (
                      <div className="flex items-center justify-between gap-1">
                        {appearance.tags.slice(0, 5).map((tag, tagIndex) => (
                          <React.Fragment key={tagIndex}>
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted border border-border/40 text-[10px] font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {tag}
                            </span>
                            {tagIndex < Math.min(appearance.tags.length, 5) - 1 && (
                              <div className="h-3 w-px bg-border/40 flex-shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}