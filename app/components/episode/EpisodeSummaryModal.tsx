"use client";

import { X, Bookmark, Share2, Download, ExternalLink, Globe, TrendingUp, DollarSign, Target, Cpu, Clock } from "lucide-react";
import { AccordionSection } from "./AccordionSection.js";
import { SaveableQuoteCard } from "./SaveableQuoteCard.js";
import { SaveableChecklistCard } from "./SaveableChecklistCard.js";
import { SaveableChapterCard } from "./SaveableChapterCard.js";
import { ReferencesGrid } from "./ReferencesGrid.js";
import { VideoEmbedCard } from "./VideoEmbedCard.js";
import { DisclaimersCard } from "./DisclaimersCard.js";
import { ReportHeader } from "./ReportHeader.js";
import type { Summary } from "../../../schemas/summary.schema.js";

interface EpisodeSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: {
    title: string;
    show: string;
    host?: string;
    date: string;
    thumbnail?: string | undefined;
    videoId: string;
    episodeId: string;
    qcStatus?: string | null;
    qcScore?: number | null;
    summary: Summary | null;
  };
}

const sectionIconMap: Record<string, any> = {
  "GEO-POLITICS": Globe,
  "GEOPOLITICS": Globe,
  "TECHNOLOGY": Cpu,
  "ECONOMY": TrendingUp,
  "MARKETS": DollarSign,
  "FORECASTS": Target,
  "TARGETS": Target,
};

export function EpisodeSummaryModal({ isOpen, onClose, episode }: EpisodeSummaryModalProps) {
  if (!isOpen) return null;

  const { summary } = episode;

  // Extract key quotes
  const keyQuotes: Array<{ text: string; speaker?: string; id?: string }> = (summary as any)?.keyQuotes || [];

  // Extract sections (excluding KEY QUOTES)
  const sections = summary?.sections || [];
  const summarySections = sections.filter((s: any) => s.name !== "KEY QUOTES" && s.bullets && s.bullets.length > 0);

  // Generate chapters from sections
  const chapters = summarySections.slice(0, 6).map((section: any, idx: number) => ({
    id: `chapter-${idx}`,
    time: idx === 0 ? "0:00" : `${idx * 8}:${(idx * 15) % 60}`,
    title: section.name,
    bullets: section.bullets.slice(0, 4).map((b: any) => ({
      id: b.id || `bullet-${idx}-${Math.random()}`,
      text: b.text,
    })),
  }));

  // Mock references
  const references = [
    {
      personName: "Josh Brown",
      personRole: "Host & CEO of Ritholtz Wealth Management",
      links: [
        { type: "twitter" as const, label: "Twitter/X", url: "https://twitter.com" },
        { type: "youtube" as const, label: "YouTube", url: "https://youtube.com" },
        { type: "substack" as const, label: "Substack", url: "https://substack.com" },
        { type: "website" as const, label: "Website", url: "https://ritholtz.com" },
      ],
    },
    {
      personName: "Barry Ritholtz",
      personRole: "Guest & Chairman of Ritholtz Wealth Management",
      links: [
        { type: "twitter" as const, label: "Twitter/X", url: "https://twitter.com" },
        { type: "youtube" as const, label: "YouTube", url: "https://youtube.com" },
        { type: "substack" as const, label: "Substack", url: "https://substack.com" },
        { type: "website" as const, label: "Website", url: "https://ritholtz.com" },
      ],
    },
  ];

  // Extract tags
  const tags = summarySections.slice(0, 5).map((s: any) => 
    s.name.split('-').map((word: string) => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  );

  const youtubeUrl = episode.videoId 
    ? `https://www.youtube.com/watch?v=${episode.videoId}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-lg"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <ReportHeader
            title={episode.title}
            showName={episode.show}
            peopleLine={episode.host || "Host"}
            publishedAt={episode.date}
            intro="In this episode, the hosts discuss key market insights and investment strategies."
            tags={tags}
            episodeId={episode.episodeId}
          />

          {keyQuotes.length > 0 && (
            <AccordionSection icon={<span className="text-base">💬</span>} title="KEY QUOTES">
              <div className="space-y-3">
                {keyQuotes.map((quote, idx) => (
                  <SaveableQuoteCard
                    key={quote.id || idx}
                    id={quote.id || `quote-${idx}`}
                    text={quote.text}
                    speaker={quote.speaker || "Unknown"}
                    episodeId={episode.episodeId}
                    episodeTitle={episode.title}
                    showName={episode.show}
                    hosts={episode.host || "Unknown"}
                    publishedAt={episode.date}
                    sourceUrl={youtubeUrl}
                  />
                ))}
              </div>
            </AccordionSection>
          )}

          {summarySections.length > 0 && (
            <AccordionSection icon={<span className="text-base">📋</span>} title="SUMMARY">
              <div className="space-y-3">
                {summarySections.map((section: any, idx: number) => {
                  const IconComponent = sectionIconMap[section.name] || Globe;
                  return (
                    <SaveableChecklistCard
                      key={idx}
                      icon={<IconComponent size={18} />}
                      title={section.name}
                      items={section.bullets.map((b: any) => ({
                        id: b.id || `${idx}-${Math.random()}`,
                        text: b.text,
                      }))}
                      episodeId={episode.episodeId}
                      episodeTitle={episode.title}
                      showName={episode.show}
                      hosts={episode.host || "Unknown"}
                      publishedAt={episode.date}
                      sourceUrl={youtubeUrl}
                    />
                  );
                })}
              </div>
            </AccordionSection>
          )}

          {chapters.length > 0 && (
            <AccordionSection icon={<Clock size={16} />} title="CHAPTERS">
              <div className="space-y-3">
                {chapters.map((chapter: any) => (
                  <SaveableChapterCard
                    key={chapter.id}
                    id={chapter.id}
                    time={chapter.time}
                    title={chapter.title}
                    bullets={chapter.bullets}
                    episodeId={episode.episodeId}
                    episodeTitle={episode.title}
                    showName={episode.show}
                    hosts={episode.host || "Unknown"}
                    publishedAt={episode.date}
                    sourceUrl={youtubeUrl}
                  />
                ))}
              </div>
            </AccordionSection>
          )}

          <AccordionSection icon={<span className="text-base">🔗</span>} title="LINKS & REFERENCES">
            <ReferencesGrid references={references} />
          </AccordionSection>

          {youtubeUrl && (
            <AccordionSection icon={<span className="text-base">🎬</span>} title="WATCH FULL EPISODE">
              <VideoEmbedCard
                youtubeUrl={youtubeUrl}
                title={episode.title}
              />
            </AccordionSection>
          )}

          <DisclaimersCard />
        </div>
      </div>
    </div>
  );
}
