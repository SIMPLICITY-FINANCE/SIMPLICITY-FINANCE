"use client";

import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card.js";
import { FeedEpisodeCard } from "../../components/feed/FeedEpisodeCard.js";
import { EpisodeSummaryModal } from "../../components/episode/EpisodeSummaryModal.js";
import { extractSummaryPreview, formatBulletsForDisplay, extractTopics } from "../../../lib/feed-helpers.js";
import type { Summary } from "../../../schemas/summary.schema.js";


interface FeedEpisode {
  episode_id: string;
  title: string;
  published_at: Date | null;
  created_at: Date;
  video_id: string | null;
  qc_score: number | null;
  qc_status: string | null;
  youtube_channel_title: string | null;
  youtube_description: string | null;
  youtube_thumbnail_url: string | null;
  summary_json: any; // Summary JSON from episode_summary table
  summary_id: string | null;
}

export default function DashboardPage() {
  const [feedEpisodes, setFeedEpisodes] = useState<FeedEpisode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<FeedEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const response = await fetch('/api/feed');
        const data = await response.json();
        setFeedEpisodes(data);
      } catch (err) {
        console.error('Failed to fetch feed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeed();
  }, []);

  const handleCardClick = (episode: FeedEpisode) => {
    console.log('Card clicked:', episode.title);
    setSelectedEpisode(episode);
    setIsModalOpen(true);
    console.log('Modal state set to true');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEpisode(null), 300);
  };

  if (isLoading) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Loading episodes...</p>
      </Card>
    );
  }

  // Placeholder query structure (moved to API route)
  const _queryStructure = `
    SELECT 
      e.id as episode_id,
      COALESCE(e.youtube_title, 'Untitled Episode') as title,
      e.published_at,
      e.created_at,
      e.video_id,
      e.qc_score,
      e.qc_status,
      e.youtube_channel_title,
      e.youtube_description,
      e.youtube_thumbnail_url,
      s.id as summary_id,
      (
        SELECT json_build_object(
          'version', s.version,
          'videoId', s.video_id,
          'title', s.title,
          'publishedAt', s.published_at,
          'sections', (
            SELECT json_agg(
              json_build_object(
                'name', sb.section_name,
                'bullets', (
                  SELECT json_agg(
                    json_build_object(
                      'text', sb2.bullet_text,
                      'confidence', sb2.confidence
                    ) ORDER BY sb2.created_at
                  )
                  FROM summary_bullets sb2
                  WHERE sb2.summary_id = s.id AND sb2.section_name = sb.section_name
                )
              )
            )
            FROM (
              SELECT DISTINCT section_name
              FROM summary_bullets
              WHERE summary_id = s.id
              ORDER BY section_name
            ) sb
          ),
          'keyQuotes', (
            SELECT json_agg(
              json_build_object(
                'text', bullet_text,
                'speaker', 'Unknown'
              )
            )
            FROM summary_bullets
            WHERE summary_id = s.id AND section_name = 'KEY QUOTES'
            LIMIT 10
          )
        )
        FROM episode_summary s
        WHERE s.episode_id = e.id
        LIMIT 1
      ) as summary_json
    FROM episodes e
    LEFT JOIN episode_summary s ON s.episode_id = e.id
    WHERE e.is_published = true
      AND s.id IS NOT NULL
    ORDER BY COALESCE(e.published_at, e.created_at) DESC
    LIMIT 50
  `;

  return (
    <>
      {feedEpisodes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No episodes available yet</p>
          <p className="text-muted-foreground/70 text-sm mt-2">
            Submit a YouTube URL to get started
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedEpisodes.map((episode) => {
            // Extract preview data from summary JSON
            let summaryPreview = 'Summary preview not available';
            let topics: string[] = ['Finance'];
            let quoteCount = 0;
            
            try {
              if (episode.summary_json) {
                const summary = episode.summary_json as Summary;
                const preview = extractSummaryPreview(summary, 4);
                summaryPreview = formatBulletsForDisplay(preview.bullets);
                quoteCount = preview.quoteCount;
                topics = extractTopics(summary, 5);
              }
            } catch (err) {
              console.error('Failed to extract summary preview for episode', episode.episode_id, err);
            }
            
            const displayDate = episode.published_at || episode.created_at;
            const thumbnail = episode.youtube_thumbnail_url || (episode.video_id ? `https://img.youtube.com/vi/${episode.video_id}/maxresdefault.jpg` : undefined);
            
            return (
              <FeedEpisodeCard
                key={episode.episode_id}
                title={episode.title}
                show={episode.youtube_channel_title || 'Unknown Show'}
                host="Host Name"
                date={new Date(displayDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                summary={summaryPreview}
                thumbnail={thumbnail}
                topics={topics}
                videoId={episode.video_id || ''}
                episodeId={episode.episode_id}
                qcStatus={episode.qc_status}
                qcScore={episode.qc_score}
                quoteCount={quoteCount}
                onClick={() => handleCardClick(episode)}
              />
            );
          })}
        </div>
      )}
      
      {/* Episode Summary Modal */}
      {selectedEpisode && (
        <EpisodeSummaryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          episode={{
            title: selectedEpisode.title,
            show: selectedEpisode.youtube_channel_title || 'Unknown Show',
            host: 'Host Name',
            date: new Date(selectedEpisode.published_at || selectedEpisode.created_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            thumbnail: selectedEpisode.youtube_thumbnail_url || (selectedEpisode.video_id ? `https://img.youtube.com/vi/${selectedEpisode.video_id}/maxresdefault.jpg` : undefined),
            videoId: selectedEpisode.video_id || '',
            episodeId: selectedEpisode.episode_id,
            qcStatus: selectedEpisode.qc_status,
            qcScore: selectedEpisode.qc_score,
            summary: selectedEpisode.summary_json as Summary | null,
          }}
        />
      )}
    </>
  );
}
