// Podcast Player Component
// "Trout Talk" podcast player with episode management

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { PODCAST_EPISODES, formatDuration, formatDate, PodcastEpisode } from '../data/podcasts';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ExternalLink, FileText } from 'lucide-react';

export function PodcastPlayer() {
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setPlaying(false);
      // Auto-play next episode
      const currentIndex = PODCAST_EPISODES.findIndex(ep => ep.id === selectedEpisode?.id);
      if (currentIndex >= 0 && currentIndex < PODCAST_EPISODES.length - 1) {
        setSelectedEpisode(PODCAST_EPISODES[currentIndex + 1]);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedEpisode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => setMuted(!muted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🎙️ Trout Talk Podcast
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Educational podcast series for students, teachers, and citizen scientists
        </p>
      </div>

      {/* Now Playing */}
      {selectedEpisode && (
        <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  Season {selectedEpisode.season}, Episode {selectedEpisode.episode}
                </Badge>
                <CardTitle className="text-2xl mb-2">{selectedEpisode.title}</CardTitle>
                <CardDescription className="text-base">
                  {selectedEpisode.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Audio Player */}
            <audio ref={audioRef} src={selectedEpisode.audioUrl} preload="metadata" />

            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{formatDuration(Math.floor(currentTime))}</span>
                <span>{formatDuration(Math.floor(duration || selectedEpisode.duration))}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm" onClick={skipBackward}>
                <SkipBack className="w-4 h-4" />
                <span className="ml-1 text-xs">15s</span>
              </Button>
              
              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full"
              >
                {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={skipForward}>
                <span className="mr-1 text-xs">15s</span>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={toggleMute}>
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Episode Info */}
            <div className="pt-4 border-t dark:border-gray-700 space-y-3">
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Guests</div>
                <div className="text-gray-900 dark:text-white">{selectedEpisode.guests.join(', ')}</div>
              </div>
              
              {selectedEpisode.resources.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Episode Resources
                  </div>
                  <div className="space-y-1">
                    {selectedEpisode.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {resource.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedEpisode.transcript && (
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  View Transcript
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Episode List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Season 1 Episodes
        </h3>
        <div className="space-y-3">
          {PODCAST_EPISODES.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              isPlaying={selectedEpisode?.id === episode.id && playing}
              onPlay={() => {
                setSelectedEpisode(episode);
                setPlaying(true);
                setTimeout(() => audioRef.current?.play(), 100);
              }}
            />
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <CardHeader>
          <CardTitle>About Trout Talk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-purple-800 dark:text-purple-200">
            <p>
              <strong>Format:</strong> 15-25 minute educational episodes featuring experts, educators,
              and students from the Pennsylvania TIC community.
            </p>
            <p>
              <strong>Topics:</strong> Trout biology, water quality, stream ecology, conservation,
              careers in environmental science, and student stories.
            </p>
            <p>
              <strong>Subscribe:</strong> Available on Spotify, Apple Podcasts, Google Podcasts, and RSS feed.
            </p>
            <p>
              <strong>Accessibility:</strong> All episodes include full transcripts for hearing-impaired users
              and English language learners.
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <a href="https://podcasts.apple.com" target="_blank" rel="noopener noreferrer">
                  Apple Podcasts
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
                  Spotify
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EpisodeCard({ 
  episode, 
  isPlaying, 
  onPlay 
}: { 
  episode: PodcastEpisode; 
  isPlaying: boolean; 
  onPlay: () => void; 
}) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${isPlaying ? 'border-2 border-blue-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">S{episode.season}E{episode.episode}</Badge>
              <Badge variant="outline">{formatDuration(episode.duration)}</Badge>
              {isPlaying && <Badge variant="default">Now Playing</Badge>}
            </div>
            <CardTitle className="text-lg mb-1">{episode.title}</CardTitle>
            <CardDescription className="text-sm">{episode.description}</CardDescription>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Released: {formatDate(episode.releaseDate)}
            </div>
          </div>
          <Button onClick={onPlay} size="lg" className="shrink-0">
            <Play className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      {episode.topics.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {episode.topics.map(topic => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

