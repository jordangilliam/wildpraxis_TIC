// Video Content Library Component
// Browse and watch educational videos

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { VIDEO_LIBRARY, VIDEO_CATEGORIES, Video } from '../data/videos';
import { Play, Clock, ExternalLink, X } from 'lucide-react';

export function VideoLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = VIDEO_LIBRARY.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🎬 Video Library
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Educational videos from PFBC, Penn State Extension, and TIC classrooms
        </p>
      </div>

      {/* Search */}
      <div>
        <Input
          type="search"
          placeholder="Search videos by title, topic, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-2xl"
        />
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex flex-wrap">
          {VIDEO_CATEGORIES.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id}>
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No videos found. Try adjusting your search or category filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle>About This Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>Content Sources:</strong> Videos are curated from PA Fish & Boat Commission,
              Penn State Extension, Trout Unlimited, and participating TIC schools.
            </p>
            <p>
              <strong>Accessibility:</strong> All videos include captions. Some have full transcripts available.
            </p>
            <p>
              <strong>Permissions:</strong> Videos are used with permission for educational purposes. Please
              respect copyright and do not download or redistribute without authorization.
            </p>
            <p>
              <strong>Submit Your Video:</strong> Have TIC content to share? Contact us at 
              videos@wildpraxis.org
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
          <Play className="w-16 h-16 text-white opacity-80" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}m
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {VIDEO_CATEGORIES.find(c => c.id === video.category)?.icon}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {video.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div className="font-semibold">{video.educator}</div>
          <div>{video.source}</div>
        </div>
        {video.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {video.topics.slice(0, 3).map(topic => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const getEmbedUrl = (url: string) => {
    // Convert YouTube/Vimeo URLs to embed format
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold dark:text-white">{video.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Video Player */}
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(video.videoUrl)}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Info */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{video.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Educator</div>
                <div className="text-gray-900 dark:text-white">{video.educator}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Source</div>
                <div className="text-gray-900 dark:text-white">{video.source}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Duration</div>
                <div className="text-gray-900 dark:text-white">{video.duration} minutes</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Category</div>
                <div className="text-gray-900 dark:text-white">
                  {VIDEO_CATEGORIES.find(c => c.id === video.category)?.name}
                </div>
              </div>
            </div>

            {video.topics.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Topics</div>
                <div className="flex flex-wrap gap-2">
                  {video.topics.map(topic => (
                    <Badge key={topic} variant="secondary">
                      {topic.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {video.relatedLessons.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Related Lessons
                </div>
                <div className="flex flex-wrap gap-2">
                  {video.relatedLessons.map(lesson => (
                    <Badge key={lesson} variant="outline">
                      {lesson.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* External Link */}
          <Button variant="outline" asChild>
            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch on {video.videoUrl.includes('youtube') ? 'YouTube' : 'Vimeo'}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

