-- ExploreMore Database Schema

-- User profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  travel_style TEXT CHECK (travel_style IN ('budget', 'luxury', 'adventure', 'cultural', 'relaxation')),
  preferred_budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  description TEXT,
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  climate TEXT,
  best_time_to_visit TEXT,
  average_budget TEXT,
  popular_activities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination_id UUID REFERENCES public.destinations(id),
  destination_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  traveler_count INTEGER DEFAULT 1,
  budget_range TEXT,
  trip_style TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trip activities/itinerary items
CREATE TABLE public.trip_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  activity_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  category TEXT CHECK (category IN ('activity', 'restaurant', 'accommodation', 'transport', 'other')),
  price_estimate DECIMAL(10, 2),
  booking_url TEXT,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Packing list items (universal, not trip-specific)
CREATE TABLE public.packing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('clothes', 'electronics', 'toiletries', 'documents', 'accessories', 'medication', 'other')),
  is_essential BOOLEAN DEFAULT false,
  is_checked BOOLEAN DEFAULT false,
  custom_added BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Travel diary entries
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  entry_date DATE NOT NULL,
  location TEXT,
  mood TEXT CHECK (mood IN ('amazing', 'great', 'good', 'okay', 'challenging')),
  tags TEXT[],
  image_urls TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User preferences for AI recommendations
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_activities TEXT[],
  accommodation_type TEXT[],
  transport_preferences TEXT[],
  dietary_restrictions TEXT[],
  accessibility_needs TEXT[],
  language_preferences TEXT[],
  budget_preference TEXT,
  trip_pace TEXT CHECK (trip_pace IN ('slow', 'moderate', 'fast')),
  group_travel_preference TEXT CHECK (group_travel_preference IN ('solo', 'couple', 'family', 'friends', 'any')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for destinations (public read access)
CREATE POLICY "Anyone can view destinations" ON public.destinations FOR SELECT USING (true);

-- RLS Policies for trips
CREATE POLICY "Users can view their own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for trip activities
CREATE POLICY "Users can view their trip activities" ON public.trip_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_activities.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Users can create trip activities" ON public.trip_activities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_activities.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Users can update their trip activities" ON public.trip_activities FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_activities.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Users can delete their trip activities" ON public.trip_activities FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_activities.trip_id AND trips.user_id = auth.uid())
);

-- RLS Policies for packing items
CREATE POLICY "Users can view their own packing items" ON public.packing_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own packing items" ON public.packing_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own packing items" ON public.packing_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own packing items" ON public.packing_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for diary entries
CREATE POLICY "Users can view their own diary entries" ON public.diary_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public diary entries" ON public.diary_entries FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create their own diary entries" ON public.diary_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own diary entries" ON public.diary_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own diary entries" ON public.diary_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE ON public.diary_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  
  -- Create default packing items for new users
  INSERT INTO public.packing_items (user_id, name, category, is_essential) VALUES
  (NEW.id, 'Passport', 'documents', true),
  (NEW.id, 'Phone Charger', 'electronics', true),
  (NEW.id, 'Toothbrush', 'toiletries', true),
  (NEW.id, 'Underwear', 'clothes', true),
  (NEW.id, 'Socks', 'clothes', true),
  (NEW.id, 'Comfortable Walking Shoes', 'clothes', true),
  (NEW.id, 'Sunglasses', 'accessories', false),
  (NEW.id, 'Sunscreen', 'toiletries', false),
  (NEW.id, 'Camera', 'electronics', false),
  (NEW.id, 'Travel Insurance Documents', 'documents', true);
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some example destinations
INSERT INTO public.destinations (name, country, city, description, climate, best_time_to_visit, average_budget, popular_activities) VALUES
('Paris', 'France', 'Paris', 'The City of Light, famous for its art, culture, and romance', 'Temperate', 'April-June, September-October', 'Medium-High', ARRAY['Museums', 'Architecture', 'Dining', 'Shopping']),
('Tokyo', 'Japan', 'Tokyo', 'A vibrant metropolis blending traditional and modern culture', 'Humid Subtropical', 'March-May, September-November', 'Medium-High', ARRAY['Temples', 'Technology', 'Food', 'Shopping']),
('Bali', 'Indonesia', 'Denpasar', 'Tropical paradise known for beaches, temples, and rice terraces', 'Tropical', 'April-October', 'Low-Medium', ARRAY['Beaches', 'Temples', 'Nature', 'Wellness']),
('New York City', 'United States', 'New York', 'The Big Apple - iconic skyline, Broadway, and diverse culture', 'Humid Continental', 'April-June, September-November', 'High', ARRAY['Museums', 'Broadway', 'Shopping', 'Dining']),
('Barcelona', 'Spain', 'Barcelona', 'Architectural marvels, beaches, and vibrant nightlife', 'Mediterranean', 'May-September', 'Medium', ARRAY['Architecture', 'Beaches', 'Art', 'Nightlife']),
('Bangkok', 'Thailand', 'Bangkok', 'Bustling capital with temples, markets, and street food', 'Tropical', 'November-March', 'Low', ARRAY['Temples', 'Markets', 'Food', 'Culture']);