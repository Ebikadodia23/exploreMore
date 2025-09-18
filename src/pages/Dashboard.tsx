import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Plus, MapPin, Camera, Package, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Plan New Trip',
      description: 'Let AI create your perfect itinerary',
      icon: Plus,
      to: '/trip/create',
      variant: 'primary' as const
    },
    {
      title: 'Explore Destinations',
      description: 'Discover amazing places to visit',
      icon: MapPin,
      to: '/explore',
      variant: 'secondary' as const
    },
    {
      title: 'My Diary',
      description: 'Capture your travel memories',
      icon: Camera,
      to: '/diary',
      variant: 'outline' as const
    },
    {
      title: 'Packing List',
      description: 'Never forget the essentials',
      icon: Package,
      to: '/packing',
      variant: 'outline' as const
    }
  ];

  const moodSuggestions = [
    {
      mood: 'Adventure',
      destination: 'New Zealand',
      image: '/placeholder.svg',
      activities: ['Hiking', 'Bungee Jumping', 'Skydiving']
    },
    {
      mood: 'Relaxation',
      destination: 'Maldives',
      image: '/placeholder.svg',
      activities: ['Beach', 'Spa', 'Sunset Cruise']
    },
    {
      mood: 'Culture',
      destination: 'Kyoto, Japan',
      image: '/placeholder.svg',
      activities: ['Temples', 'Museums', 'Traditional Arts']
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-ocean text-white p-6 rounded-b-3xl shadow-elegant">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-white/90">Ready for your next adventure?</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Trips Planned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary">0</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">0</div>
              <div className="text-sm text-muted-foreground">Memories</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.to}>
                <Card className="h-full hover:shadow-warm transition-smooth cursor-pointer">
                  <CardContent className="p-4 text-center space-y-2">
                    <action.icon className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Mood-Based Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">AI Suggestions for You</h2>
          </div>
          
          <div className="space-y-3">
            {moodSuggestions.map((suggestion, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-20 h-20 bg-gradient-sunset flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{suggestion.destination}</h3>
                          <p className="text-sm text-muted-foreground">Perfect for {suggestion.mood.toLowerCase()}</p>
                        </div>
                        <Button size="sm" variant="outline">Explore</Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.activities.slice(0, 2).map((activity, actIndex) => (
                          <span key={actIndex} className="text-xs bg-muted px-2 py-1 rounded-full">
                            {activity}
                          </span>
                        ))}
                        {suggestion.activities.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{suggestion.activities.length - 2} more</span>
                        )}
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