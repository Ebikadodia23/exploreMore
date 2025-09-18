import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Users, DollarSign, Sparkles, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string | null;
}

const TripCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination_id: '',
    destination_name: '',
    start_date: null as Date | null,
    end_date: null as Date | null,
    traveler_count: 1,
    budget_range: '',
    trip_style: '',
    notes: ''
  });

  const budgetRanges = [
    { value: 'budget', label: 'Budget ($0-$50/day)', icon: '💰' },
    { value: 'mid-range', label: 'Mid-range ($50-$150/day)', icon: '💳' },
    { value: 'luxury', label: 'Luxury ($150+/day)', icon: '💎' }
  ];

  const tripStyles = [
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'culinary', label: 'Culinary', icon: '🍜' },
    { value: 'nightlife', label: 'Nightlife', icon: '🌃' },
    { value: 'nature', label: 'Nature', icon: '🌲' }
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, description')
        .order('name');

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDestinationSelect = (destination: Destination) => {
    setFormData(prev => ({
      ...prev,
      destination_id: destination.id,
      destination_name: `${destination.name}, ${destination.country}`,
      title: prev.title || `Trip to ${destination.name}`
    }));
  };

  const createTrip = async () => {
    if (!formData.title || !formData.destination_name || !formData.start_date || !formData.end_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([{
          user_id: user?.id,
          title: formData.title,
          destination_id: formData.destination_id || null,
          destination_name: formData.destination_name,
          start_date: formData.start_date.toISOString().split('T')[0],
          end_date: formData.end_date.toISOString().split('T')[0],
          traveler_count: formData.traveler_count,
          budget_range: formData.budget_range || null,
          trip_style: formData.trip_style || null,
          notes: formData.notes || null
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Trip Created!",
        description: "Your trip has been created successfully. AI will now generate your itinerary."
      });

      navigate(`/trip/${data.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="bg-gradient-ocean text-white p-6 rounded-b-3xl shadow-elegant">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 mr-3 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Plan New Trip</h1>
          </div>
          <p className="text-white/90">Let's create your perfect adventure</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Trip Title */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title *</Label>
              <Input
                id="title"
                placeholder="My Amazing Adventure"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Destination *</Label>
              <Input
                placeholder="Where are you going?"
                value={formData.destination_name}
                onChange={(e) => handleInputChange('destination_name', e.target.value)}
              />
              
              {destinations.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <p className="text-sm text-muted-foreground">Popular destinations:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {destinations.slice(0, 6).map((destination) => (
                      <div
                        key={destination.id}
                        className="p-2 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleDestinationSelect(destination)}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-primary mr-2" />
                          <div>
                            <span className="font-medium">{destination.name}, {destination.country}</span>
                            {destination.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{destination.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">When are you traveling?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "MMM dd") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => handleInputChange('start_date', date)}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.end_date ? format(formData.end_date, "MMM dd") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.end_date}
                      onSelect={(date) => handleInputChange('end_date', date)}
                      disabled={(date) => date < (formData.start_date || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travelers & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trip Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.traveler_count}
                  onChange={(e) => handleInputChange('traveler_count', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">travelers</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Budget Range</Label>
              <div className="grid grid-cols-1 gap-2">
                {budgetRanges.map((budget) => (
                  <Button
                    key={budget.value}
                    variant={formData.budget_range === budget.value ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleInputChange('budget_range', budget.value)}
                  >
                    <span className="mr-2">{budget.icon}</span>
                    <span>{budget.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Trip Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {tripStyles.map((style) => (
                  <Button
                    key={style.value}
                    variant={formData.trip_style === style.value ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleInputChange('trip_style', style.value)}
                  >
                    <span className="mr-2">{style.icon}</span>
                    <span className="text-xs">{style.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes</CardTitle>
            <CardDescription>
              Any special requirements or preferences for your trip?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g., dietary restrictions, accessibility needs, must-see attractions..."
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Create Button */}
        <Card className="bg-gradient-wanderlust text-white">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Ready to Create Your Trip?</h3>
              </div>
              <p className="text-white/90 text-sm">
                Our AI will generate a personalized itinerary based on your preferences
              </p>
              <Button
                onClick={createTrip}
                disabled={loading}
                className="w-full bg-white text-primary hover:bg-white/90"
                size="lg"
              >
                {loading ? 'Creating Trip...' : 'Generate My Itinerary'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripCreate;