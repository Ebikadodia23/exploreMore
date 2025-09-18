import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Plus, MapPin, Calendar, Users, MoreVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Trip {
  id: string;
  title: string;
  destination_name: string;
  start_date: string;
  end_date: string;
  traveler_count: number;
  status: string;
  budget_range: string | null;
  trip_style: string | null;
}

const Trips: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'planning' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => 
    filter === 'all' || trip.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTripDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your trips...</p>
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
            <h1 className="text-2xl font-bold">My Trips</h1>
            <Link to="/trip/create">
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Trip
              </Button>
            </Link>
          </div>
          
          <div className="flex space-x-2">
            {(['all', 'planning', 'active', 'completed'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize border-white/20 text-white hover:bg-white/20"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {filteredTrips.length === 0 ? (
          <Card className="text-center p-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">
              {filter === 'all' ? 'No trips yet' : `No ${filter} trips`}
            </h3>
            <p className="text-muted-foreground mb-4">
              Start planning your next adventure and create unforgettable memories.
            </p>
            <Link to="/trip/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Plan Your First Trip
              </Button>
            </Link>
          </Card>
        ) : (
          filteredTrips.map((trip) => (
            <Link key={trip.id} to={`/trip/${trip.id}`}>
              <Card className="hover:shadow-warm transition-smooth cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{trip.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {trip.destination_name}
                      </div>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {trip.traveler_count} traveler{trip.traveler_count > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {trip.budget_range && (
                        <Badge variant="outline" className="text-xs">
                          {trip.budget_range}
                        </Badge>
                      )}
                      {trip.trip_style && (
                        <Badge variant="outline" className="text-xs">
                          {trip.trip_style}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {getTripDuration(trip.start_date, trip.end_date)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Trips;