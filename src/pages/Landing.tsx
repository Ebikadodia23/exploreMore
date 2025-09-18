import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, MapPin, Camera, Plane } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Compass className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white font-display">ExploreMore</h1>
        </div>
        <Link to="/auth">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
            Login
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-20">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6 font-display">
            Your AI Travel
            <br />
            <span className="text-accent">Companion</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Discover amazing destinations, plan perfect itineraries, and capture unforgettable memories with our AI-powered travel assistant.
          </p>

          <div className="space-y-4 mb-12">
            <Link to="/auth">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 shadow-warm text-lg py-6">
                Start Your Journey
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-white">Smart Planning</h3>
              <p className="text-sm text-white/80">AI-powered itineraries</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Camera className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-white">Memory Keeper</h3>
              <p className="text-sm text-white/80">Travel diary & photos</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-white/60 text-sm">
          Ready to explore the world? Join thousands of travelers already using ExploreMore.
        </p>
      </footer>
    </div>
  );
};

export default Landing;