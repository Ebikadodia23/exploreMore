export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      destinations: {
        Row: {
          average_budget: string | null
          best_time_to_visit: string | null
          city: string | null
          climate: string | null
          country: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          popular_activities: string[] | null
        }
        Insert: {
          average_budget?: string | null
          best_time_to_visit?: string | null
          city?: string | null
          climate?: string | null
          country: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          popular_activities?: string[] | null
        }
        Update: {
          average_budget?: string | null
          best_time_to_visit?: string | null
          city?: string | null
          climate?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          popular_activities?: string[] | null
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          content: string | null
          created_at: string
          entry_date: string
          id: string
          image_urls: string[] | null
          is_public: boolean | null
          location: string | null
          mood: string | null
          tags: string[] | null
          title: string
          trip_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entry_date: string
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location?: string | null
          mood?: string | null
          tags?: string[] | null
          title: string
          trip_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location?: string | null
          mood?: string | null
          tags?: string[] | null
          title?: string
          trip_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      packing_items: {
        Row: {
          category: string
          created_at: string
          custom_added: boolean | null
          id: string
          is_checked: boolean | null
          is_essential: boolean | null
          name: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          custom_added?: boolean | null
          id?: string
          is_checked?: boolean | null
          is_essential?: boolean | null
          name: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          custom_added?: boolean | null
          id?: string
          is_checked?: boolean | null
          is_essential?: boolean | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          preferred_budget_range: string | null
          travel_style: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          preferred_budget_range?: string | null
          travel_style?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          preferred_budget_range?: string | null
          travel_style?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trip_activities: {
        Row: {
          activity_date: string
          booking_url: string | null
          category: string | null
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          notes: string | null
          order_index: number | null
          price_estimate: number | null
          start_time: string | null
          title: string
          trip_id: string
        }
        Insert: {
          activity_date: string
          booking_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          order_index?: number | null
          price_estimate?: number | null
          start_time?: string | null
          title: string
          trip_id: string
        }
        Update: {
          activity_date?: string
          booking_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          order_index?: number | null
          price_estimate?: number | null
          start_time?: string | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_activities_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget_range: string | null
          created_at: string
          destination_id: string | null
          destination_name: string
          end_date: string
          id: string
          notes: string | null
          start_date: string
          status: string | null
          title: string
          traveler_count: number | null
          trip_style: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          destination_id?: string | null
          destination_name: string
          end_date: string
          id?: string
          notes?: string | null
          start_date: string
          status?: string | null
          title: string
          traveler_count?: number | null
          trip_style?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          destination_id?: string | null
          destination_name?: string
          end_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string | null
          title?: string
          traveler_count?: number | null
          trip_style?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          accessibility_needs: string[] | null
          accommodation_type: string[] | null
          budget_preference: string | null
          created_at: string
          dietary_restrictions: string[] | null
          group_travel_preference: string | null
          id: string
          language_preferences: string[] | null
          preferred_activities: string[] | null
          transport_preferences: string[] | null
          trip_pace: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_needs?: string[] | null
          accommodation_type?: string[] | null
          budget_preference?: string | null
          created_at?: string
          dietary_restrictions?: string[] | null
          group_travel_preference?: string | null
          id?: string
          language_preferences?: string[] | null
          preferred_activities?: string[] | null
          transport_preferences?: string[] | null
          trip_pace?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_needs?: string[] | null
          accommodation_type?: string[] | null
          budget_preference?: string | null
          created_at?: string
          dietary_restrictions?: string[] | null
          group_travel_preference?: string | null
          id?: string
          language_preferences?: string[] | null
          preferred_activities?: string[] | null
          transport_preferences?: string[] | null
          trip_pace?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
