import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, MapPin, Camera, Plane, Star, Users, DollarSign, Calendar, Sparkles, ArrowRight, Globe, Shield, Clock } from 'lucide-react';

const Landing: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on your mood and budget',
      color: 'text-blue-600'
    },
    {
      icon: MapPin,
      title: 'Trip Organization',
      description: 'Plan and organize every detail of your journey',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Smart Reminders',
      description: 'Never forget important travel accessories and documents',
      color: 'text-yellow-600'
    },
    {
      icon: Camera,
      title: 'Memory Keeper',
      description: 'Capture and organize your travel experiences',
      color: 'text-green-600'
    }
  ];

  const destinations = [
    {
      name: 'Paris',
      country: 'France',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'City of Light with iconic landmarks',
      rating: 4.9,
      budget: '$$$'
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Modern metropolis meets ancient culture',
      rating: 4.8,
      budget: '$$'
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Tropical paradise with stunning beaches',
      rating: 4.7,
      budget: '$'
    },
    {
      name: 'New York',
      country: 'USA',
      image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'The city that never sleeps',
      rating: 4.6,
      budget: '$$$$'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-smart rounded-xl">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-extra-bold text-black font-display">ExploreMore</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="font-bold text-black hover:bg-gray-100"
                onClick={() => setShowLogin(!showLogin)}
              >
                Login
              </Button>
              <Link to="/auth">
                <Button className="smart-button">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-smart text-white font-bold px-4 py-2 text-lg mb-6">
              🚀 Smart Travel Planning
            </Badge>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-extra-bold text-black mb-8 font-display leading-tight">
            Discover Your
            <br />
            <span className="bg-gradient-smart bg-clip-text text-transparent">Perfect Journey</span>
          </h2>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Find smart places tailored to your mood and budget. Organize trips effortlessly. 
            Never forget travel essentials with intelligent reminders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="smart-button text-xl py-6 px-10">
                Start Planning Now
                <Sparkles className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-xl py-6 px-10 font-bold border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            >
              Watch Demo
              <Plane className="ml-3 h-6 w-6" />
            </Button>
          </div>

          {/* Featured Destinations Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {destinations.map((destination, index) => (
              <Card key={index} className="country-card group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-black font-bold">
                      {destination.budget}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-black">{destination.name}</h3>
                      <p className="text-gray-600 font-medium">{destination.country}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 font-bold text-black">{destination.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">{destination.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-extra-bold text-black mb-6 font-display">
              Why Choose ExploreMore?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Our smart platform combines AI technology with travel expertise to create 
              the perfect journey tailored just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="country-card text-center group">
                <CardContent className="p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-black mb-4">{feature.title}</h4>
                  <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-5xl font-extra-bold text-white mb-6 font-display">
            Ready to Explore Smarter?
          </h3>
          <p className="text-xl text-white/90 mb-10 font-medium">
            Join thousands of travelers who trust ExploreMore to plan their perfect adventures.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl py-6 px-12 shadow-bold">
              Start Your Journey Today
              <Globe className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-smart rounded-xl">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl font-extra-bold text-black font-display">ExploreMore</h4>
          </div>
          <p className="text-gray-600 font-medium mb-6">
            Smart travel planning for the modern explorer
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>© 2024 ExploreMore</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;