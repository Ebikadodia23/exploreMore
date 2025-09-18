import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Settings, MapPin, Camera, Plane, LogOut, Edit, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  travel_style: string | null;
  preferred_budget_range: string | null;
}

interface TravelStats {
  tripsCount: number;
  countriesCount: number;
  memoriesCount: number;
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<TravelStats>({ tripsCount: 0, countriesCount: 0, memoriesCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch trips count
      const { count: tripsCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch unique countries count from trips
      const { data: trips } = await supabase
        .from('trips')
        .select('destination_name')
        .eq('user_id', user?.id);

      const countriesCount = new Set(trips?.map(trip => trip.destination_name)).size;

      // Fetch diary entries count
      const { count: memoriesCount } = await supabase
        .from('diary_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      setStats({
        tripsCount: tripsCount || 0,
        countriesCount,
        memoriesCount: memoriesCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const menuItems = [
    {
      icon: Edit,
      title: 'Edit Profile',
      description: 'Update your personal information',
      to: '/profile/edit'
    },
    {
      icon: Package,
      title: 'Packing List',
      description: 'Manage your universal packing checklist',
      to: '/packing'
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'App preferences and notifications',
      to: '/settings'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-ocean text-white p-6 rounded-b-3xl shadow-elegant">
        <div className="max-w-md mx-auto text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white/20">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="text-2xl bg-white/20 text-white">
              {getInitials(profile?.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold mb-2">
            {profile?.display_name || 'Travel Explorer'}
          </h1>
          <p className="text-white/80 mb-4">{profile?.email}</p>
          
          {profile?.travel_style && (
            <Badge variant="secondary" className="mb-4">
              {profile.travel_style} traveler
            </Badge>
          )}
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Travel Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Plane className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{stats.tripsCount}</div>
              <div className="text-sm text-muted-foreground">Trips</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <MapPin className="h-6 w-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">{stats.countriesCount}</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Camera className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">{stats.memoriesCount}</div>
              <div className="text-sm text-muted-foreground">Memories</div>
            </CardContent>
          </Card>
        </div>

        {/* Travel Preferences */}
        {(profile?.travel_style || profile?.preferred_budget_range) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Travel Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile?.travel_style && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Travel Style</span>
                  <Badge variant="outline">{profile.travel_style}</Badge>
                </div>
              )}
              {profile?.preferred_budget_range && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget Range</span>
                  <Badge variant="outline">{profile.preferred_budget_range}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.to}>
              <Card className="hover:shadow-warm transition-smooth cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <Card className="border-destructive/20">
          <CardContent className="p-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;