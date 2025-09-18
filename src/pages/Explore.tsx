import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Search, MapPin, Star, Filter, Sparkles, Users, DollarSign, Camera, Mountain, Coffee, Heart } from 'lucide-react';
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

  // Enhanced destinations with images and detailed descriptions
  const enhancedDestinations = [
    {
      id: '1',
      name: 'Paris',
      country: 'France',
      city: 'Paris',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'The City of Light captivates with its iconic landmarks, world-class museums, and romantic atmosphere. From the Eiffel Tower to the Louvre, every corner tells a story.',
      climate: 'Temperate',
      best_time_to_visit: 'April-June, September-October',
      average_budget: 'High',
      popular_activities: ['Museums', 'Architecture', 'Dining', 'Shopping'],
      rating: 4.9,
      tips: ['Book museum tickets in advance', 'Try local bistros in Montmartre', 'Walk along the Seine at sunset'],
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Champs-Élysées']
    },
    {
      id: '2',
      name: 'Tokyo',
      country: 'Japan',
      city: 'Tokyo',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'A mesmerizing blend of ultra-modern technology and ancient traditions. Experience bustling streets, serene temples, and incredible cuisine in this vibrant metropolis.',
      climate: 'Humid Subtropical',
      best_time_to_visit: 'March-May, September-November',
      average_budget: 'Medium-High',
      popular_activities: ['Temples', 'Technology', 'Food', 'Shopping'],
      rating: 4.8,
      tips: ['Get a JR Pass for easy travel', 'Try authentic ramen in Shibuya', 'Visit temples early morning'],
      highlights: ['Senso-ji Temple', 'Shibuya Crossing', 'Tokyo Skytree', 'Tsukiji Fish Market']
    },
    {
      id: '3',
      name: 'Bali',
      country: 'Indonesia',
      city: 'Denpasar',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Tropical paradise offering pristine beaches, ancient temples, lush rice terraces, and a rich cultural heritage. Perfect for relaxation and spiritual rejuvenation.',
      climate: 'Tropical',
      best_time_to_visit: 'April-October',
      average_budget: 'Low-Medium',
      popular_activities: ['Beaches', 'Temples', 'Nature', 'Wellness'],
      rating: 4.7,
      tips: ['Rent a scooter to explore', 'Try traditional Balinese massage', 'Watch sunrise at Mount Batur'],
      highlights: ['Tanah Lot Temple', 'Ubud Rice Terraces', 'Seminyak Beach', 'Sacred Monkey Forest']
    },
    {
      id: '4',
      name: 'New York City',
      country: 'United States',
      city: 'New York',
      image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'The city that never sleeps offers iconic skylines, Broadway shows, world-class museums, and diverse neighborhoods. Experience the energy of the Big Apple.',
      climate: 'Humid Continental',
      best_time_to_visit: 'April-June, September-November',
      average_budget: 'High',
      popular_activities: ['Museums', 'Broadway', 'Shopping', 'Dining'],
      rating: 4.6,
      tips: ['Book Broadway shows in advance', 'Walk the High Line', 'Visit Central Park in fall'],
      highlights: ['Statue of Liberty', 'Times Square', 'Central Park', 'Brooklyn Bridge']
    },
    {
      id: '5',
      name: 'Barcelona',
      country: 'Spain',
      city: 'Barcelona',
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Architectural masterpieces by Gaudí, beautiful beaches, vibrant nightlife, and delicious tapas make Barcelona a perfect Mediterranean destination.',
      climate: 'Mediterranean',
      best_time_to_visit: 'May-September',
      average_budget: 'Medium',
      popular_activities: ['Architecture', 'Beaches', 'Art', 'Nightlife'],
      rating: 4.7,
      tips: ['Book Sagrada Familia tickets online', 'Try tapas in Gothic Quarter', 'Enjoy sunset at Park Güell'],
      highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Barceloneta Beach']
    },
    {
      id: '6',
      name: 'Bangkok',
      country: 'Thailand',
      city: 'Bangkok',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Bustling capital with golden temples, floating markets, incredible street food, and vibrant culture. A sensory adventure in Southeast Asia.',
      climate: 'Tropical',
      best_time_to_visit: 'November-March',
      average_budget: 'Low',
      popular_activities: ['Temples', 'Markets', 'Food', 'Culture'],
      rating: 4.5,
      tips: ['Try street food at Chatuchak Market', 'Take a boat tour of temples', 'Visit Grand Palace early'],
      highlights: ['Grand Palace', 'Wat Pho Temple', 'Floating Markets', 'Khao San Road']
    }
  ];

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

  const filteredDestinations = enhancedDestinations.filter(destination => {
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
    { value: 'all', label: 'All', icon: '🌍' },
    { value: 'budget', label: 'Budget', icon: '💰' },
    { value: 'luxury', label: 'Luxury', icon: '💎' },
    { value: 'tropical', label: 'Tropical', icon: '🏝️' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Discovering amazing destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-gradient-smart text-white p-6 rounded-b-3xl shadow-bold">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-extra-bold mb-4">Explore Smart Destinations</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 font-medium"
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
              className={`whitespace-nowrap font-bold ${
                selectedFilter === filter.value ? 'bg-gradient-smart text-white' : 'hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>

        {/* AI Ask Button */}
        <Card className="bg-gradient-smart text-white country-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" />
              <div className="flex-1">
                <h3 className="font-extra-bold">Ask AI for Smart Recommendations</h3>
                <p className="text-sm text-white/90 font-medium">Get personalized suggestions based on your preferences</p>
              </div>
              <Button variant="secondary" size="sm" className="font-bold">
                Ask AI
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Destinations Grid */}
        <div className="space-y-6">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="country-card group">
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-black font-bold">
                    {destination.average_budget}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="flex items-center bg-black/50 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-white text-sm font-bold">{destination.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-extra-bold text-black">{destination.name}</h3>
                    <p className="text-gray-600 font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {destination.country}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 font-medium mb-4 leading-relaxed">
                  {destination.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-bold text-black mb-2">Top Highlights</h4>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights?.slice(0, 4).map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs font-medium">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-black mb-2">Smart Travel Tips</h4>
                    <div className="space-y-1">
                      {destination.tips?.slice(0, 2).map((tip, index) => (
                        <p key={index} className="text-xs text-gray-600 font-medium flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500 font-medium">Best time: </span>
                    <span className="font-bold text-black">{destination.best_time_to_visit}</span>
                  </div>
                  <Button className="smart-button">
                    Explore Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <Card className="text-center p-8 country-card">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-extra-bold text-black mb-2">No destinations found</h3>
            <p className="text-gray-600 font-medium mb-4">
              Try adjusting your search or filters to discover amazing places.
            </p>
            <Button onClick={() => {setSearchQuery(''); setSelectedFilter('all');}} className="smart-button">
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