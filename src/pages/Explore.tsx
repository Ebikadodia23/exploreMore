import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Search, MapPin, Star, Filter, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Destination {
  id: string;
  name: string;
  country: string;
  city: string | null;
  description: string | null;
  climate: string | null;
  best_time_to_visit: string | null;
  average_budget: string | null;
  popular_activities: string[] | null;
}

const Explore: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name');

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = 
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (destination.city && destination.city.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'budget' && destination.average_budget?.toLowerCase().includes('low')) return matchesSearch;
    if (selectedFilter === 'luxury' && destination.average_budget?.toLowerCase().includes('high')) return matchesSearch;
    if (selectedFilter === 'tropical' && destination.climate?.toLowerCase().includes('tropical')) return matchesSearch;
    
    return matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'budget', label: 'Budget' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'tropical', label: 'Tropical' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Discovering amazing destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-ocean text-white p-6 rounded-b-3xl shadow-elegant">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Explore Destinations</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
            />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.value)}
              className="whitespace-nowrap"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* AI Ask Button */}
        <Card className="bg-gradient-wanderlust text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" />
              <div className="flex-1">
                <h3 className="font-semibold">Ask AI for Recommendations</h3>
                <p className="text-sm text-white/90">Get personalized suggestions based on your mood</p>
              </div>
              <Button variant="secondary" size="sm">
                Ask AI
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Destinations Grid */}
        <div className="space-y-4">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-warm transition-smooth cursor-pointer">
              <div className="flex">
                {/* Image placeholder */}
                <div className="w-24 h-24 bg-gradient-sunset flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>
                  
                  {destination.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {destination.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {destination.popular_activities?.slice(0, 3).map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Budget: </span>
                      <span className="font-medium">{destination.average_budget || 'Varies'}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <Card className="text-center p-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to discover amazing places.
            </p>
            <Button onClick={() => {setSearchQuery(''); setSelectedFilter('all');}}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Explore;