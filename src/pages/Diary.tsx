import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Plus, Camera, MapPin, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DiaryEntry {
  id: string;
  title: string;
  content: string | null;
  entry_date: string;
  location: string | null;
  mood: string | null;
  tags: string[] | null;
  image_urls: string[] | null;
  created_at: string;
}

const Diary: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'timeline' | 'grid'>('timeline');

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case 'amazing': return '🤩';
      case 'great': return '😊';
      case 'good': return '😌';
      case 'okay': return '😐';
      case 'challenging': return '😅';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-ocean text-white p-6 rounded-b-3xl shadow-elegant">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">My Travel Diary</h1>
            <Link to="/diary/create">
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
            />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{entries.length}</div>
              <div className="text-sm text-muted-foreground">Memories</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary">
                {new Set(entries.map(e => e.location).filter(Boolean)).size}
              </div>
              <div className="text-sm text-muted-foreground">Places</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">
                {entries.reduce((sum, e) => sum + (e.image_urls?.length || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </CardContent>
          </Card>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card className="text-center p-8">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No memories yet</h3>
              <p className="text-muted-foreground mb-4">
                Start documenting your travel experiences and create lasting memories.
              </p>
              <Link to="/diary/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Entry
                </Button>
              </Link>
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Link key={entry.id} to={`/diary/entry/${entry.id}`}>
                <Card className="hover:shadow-warm transition-smooth cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Image or placeholder */}
                      <div className="w-20 h-20 bg-gradient-sunset flex items-center justify-center flex-shrink-0">
                        {entry.image_urls && entry.image_urls.length > 0 ? (
                          <div className="text-white font-bold">{entry.image_urls.length}</div>
                        ) : (
                          <Camera className="h-6 w-6 text-white" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">{entry.title}</h3>
                          <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                        </div>
                        
                        {entry.content && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {entry.content}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(entry.entry_date)}
                          {entry.location && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="h-3 w-3 mr-1" />
                              {entry.location}
                            </>
                          )}
                        </div>
                        
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {entry.tags.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{entry.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Diary;