import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Plus, MapPin, Camera, Package, Sparkles, Star, Users, DollarSign, Heart, Zap, Coffee, Mountain } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userMood, setUserMood] = useState('');
  const [userBudget, setUserBudget] = useState('');
  const [showQuestions, setShowQuestions] = useState(true);

  const moodOptions = [
    { value: 'adventure', label: 'Adventure', icon: Mountain, color: 'bg-red-500' },
    { value: 'relaxation', label: 'Relaxation', icon: Coffee, color: 'bg-blue-500' },
    { value: 'cultural', label: 'Cultural', icon: Star, color: 'bg-purple-500' },
    { value: 'romantic', label: 'Romantic', icon: Heart, color: 'bg-pink-500' }
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget ($0-50/day)', icon: '💰' },
    { value: 'mid-range', label: 'Mid-range ($50-150/day)', icon: '💳' },
    { value: 'luxury', label: 'Luxury ($150+/day)', icon: '💎' }
  ];

  const smartDestinations = [
    {
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.pexels.com/photos/161901/santorini-travel-vacation-greece-161901.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Stunning sunsets and white-washed buildings overlooking the Aegean Sea',
      rating: 4.9,
      budget: 'luxury',
      mood: 'romantic',
      tips: ['Best sunset views from Oia', 'Book restaurants in advance', 'Visit during shoulder season']
    },
    {
      name: 'Kyoto',
      country: 'Japan',
      image: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ancient temples, traditional gardens, and rich cultural heritage',
      rating: 4.8,
      budget: 'mid-range',
      mood: 'cultural',
      tips: ['Visit temples early morning', 'Try traditional kaiseki dining', 'Rent a bicycle to explore']
    },
    {
      name: 'Banff',
      country: 'Canada',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Breathtaking mountain landscapes and pristine wilderness',
      rating: 4.7,
      budget: 'mid-range',
      mood: 'adventure',
      tips: ['Pack layers for weather changes', 'Book accommodations early', 'Try ice walking in winter']
    },
    {
      name: 'Maldives',
      country: 'Maldives',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Crystal clear waters and overwater bungalows for ultimate relaxation',
      rating: 4.9,
      budget: 'luxury',
      mood: 'relaxation',
      tips: ['Book overwater villa for best experience', 'Try snorkeling at house reef', 'Sunset dolphin cruise is magical']
    },
    {
      name: 'Prague',
      country: 'Czech Republic',
      image: 'https://images.pexels.com/photos/161901/santorini-travel-vacation-greece-161901.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Medieval architecture and vibrant cultural scene',
      rating: 4.6,
      budget: 'budget',
      mood: 'cultural',
      tips: ['Climb Prague Castle for views', 'Try traditional Czech beer', 'Walk across Charles Bridge at sunrise']
    },
    {
      name: 'Queenstown',
      country: 'New Zealand',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Adventure capital with bungee jumping and stunning landscapes',
      rating: 4.8,
      budget: 'mid-range',
      mood: 'adventure',
      tips: ['Book adventure activities in advance', 'Try Fergburger', 'Take the Skyline Gondola for views']
    }
  ];

  const getFilteredDestinations = () => {
    if (!userMood && !userBudget) return smartDestinations;
    
    return smartDestinations.filter(dest => {
      const moodMatch = !userMood || dest.mood === userMood;
      const budgetMatch = !userBudget || dest.budget === userBudget;
      return moodMatch && budgetMatch;
    });
  };

  const handleMoodBudgetSubmit = () => {
    setShowQuestions(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-gradient-smart text-white p-6 rounded-b-3xl shadow-bold">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-extra-bold mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-white/90 font-medium">Ready for your next smart adventure?</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Smart Questions */}
        {showQuestions && (
          <Card className="country-card border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl font-extra-bold text-black flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
                Tell Us About Your Mood
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Help us find the perfect destinations for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold text-black mb-3">What's your travel mood?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {moodOptions.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={userMood === mood.value ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                        userMood === mood.value ? 'bg-gradient-smart text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setUserMood(mood.value)}
                    >
                      <mood.icon className="h-6 w-6" />
                      <span className="font-bold">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-black mb-3">What's your budget range?</h3>
                <div className="space-y-2">
                  {budgetOptions.map((budget) => (
                    <Button
                      key={budget.value}
                      variant={userBudget === budget.value ? "default" : "outline"}
                      className={`w-full justify-start h-auto p-4 ${
                        userBudget === budget.value ? 'bg-gradient-smart text-white' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setUserBudget(budget.value)}
                    >
                      <span className="mr-3 text-xl">{budget.icon}</span>
                      <span className="font-bold">{budget.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleMoodBudgetSubmit}
                className="w-full smart-button text-lg py-4"
                disabled={!userMood || !userBudget}
              >
                Find My Perfect Destinations
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center country-card">
            <CardContent className="p-4">
              <div className="text-3xl font-extra-bold text-blue-600">0</div>
              <div className="text-sm font-bold text-gray-600">Trips Planned</div>
            </CardContent>
          </Card>
          <Card className="text-center country-card">
            <CardContent className="p-4">
              <div className="text-3xl font-extra-bold text-purple-600">0</div>
              <div className="text-sm font-bold text-gray-600">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center country-card">
            <CardContent className="p-4">
              <div className="text-3xl font-extra-bold text-yellow-600">0</div>
              <div className="text-sm font-bold text-gray-600">Memories</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extra-bold text-black">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/trip/create">
              <Card className="h-full country-card group">
                <CardContent className="p-4 text-center space-y-2">
                  <Plus className="h-8 w-8 mx-auto text-blue-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-black text-sm">Plan New Trip</h3>
                  <p className="text-xs text-gray-600 font-medium">AI-powered itinerary</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/explore">
              <Card className="h-full country-card group">
                <CardContent className="p-4 text-center space-y-2">
                  <MapPin className="h-8 w-8 mx-auto text-purple-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-black text-sm">Explore Places</h3>
                  <p className="text-xs text-gray-600 font-medium">Discover destinations</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/diary">
              <Card className="h-full country-card group">
                <CardContent className="p-4 text-center space-y-2">
                  <Camera className="h-8 w-8 mx-auto text-green-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-black text-sm">My Diary</h3>
                  <p className="text-xs text-gray-600 font-medium">Capture memories</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/packing">
              <Card className="h-full country-card group">
                <CardContent className="p-4 text-center space-y-2">
                  <Package className="h-8 w-8 mx-auto text-yellow-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-black text-sm">Packing List</h3>
                  <p className="text-xs text-gray-600 font-medium">Smart reminders</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Smart Destinations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extra-bold text-black">
              {userMood || userBudget ? 'Perfect for You' : 'Popular Destinations'}
            </h2>
            {(userMood || userBudget) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {setUserMood(''); setUserBudget(''); setShowQuestions(true);}}
                className="font-bold"
              >
                Reset
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {getFilteredDestinations().slice(0, 4).map((destination, index) => (
              <Card key={index} className="country-card group">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-l-2xl">
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-extra-bold text-black">{destination.name}</h3>
                          <p className="text-sm text-gray-600 font-medium">{destination.country}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1 font-bold text-black text-sm">{destination.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mb-2 line-clamp-2">
                        {destination.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800 font-bold text-xs">
                          {destination.tips.length} Smart Tips
                        </Badge>
                        <Button size="sm" variant="outline" className="font-bold text-xs">
                          Explore
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;