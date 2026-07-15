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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          intro: string | null
          is_active: boolean
          mission: string | null
          story: string | null
          updated_at: string
          values: Json
          vision: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          intro?: string | null
          is_active?: boolean
          mission?: string | null
          story?: string | null
          updated_at?: string
          values?: Json
          vision?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          intro?: string | null
          is_active?: boolean
          mission?: string | null
          story?: string | null
          updated_at?: string
          values?: Json
          vision?: string | null
        }
        Relationships: []
      }
      contact_branches: {
        Row: {
          address: string
          created_at: string
          hours: string | null
          id: string
          is_primary: boolean
          is_visible: boolean
          map_embed: string | null
          name: string | null
          notes: string | null
          phone: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          hours?: string | null
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          map_embed?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          hours?: string | null
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          map_embed?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      contact_emails: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          is_visible: boolean
          label: string | null
          notes: string | null
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          hours: string | null
          id: string
          is_active: boolean
          map_embed: string | null
          phone: string | null
          phone_intl: string | null
          socials: Json
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          hours?: string | null
          id?: string
          is_active?: boolean
          map_embed?: string | null
          phone?: string | null
          phone_intl?: string | null
          socials?: Json
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          hours?: string | null
          id?: string
          is_active?: boolean
          map_embed?: string | null
          phone?: string | null
          phone_intl?: string | null
          socials?: Json
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["submission_status"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_phones: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          is_visible: boolean
          label: string | null
          notes: string | null
          sort_order: number
          updated_at: string
          value: string
          value_intl: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
          updated_at?: string
          value: string
          value_intl?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
          updated_at?: string
          value?: string
          value_intl?: string | null
        }
        Relationships: []
      }
      contact_whatsapps: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          is_visible: boolean
          label: string | null
          notes: string | null
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          is_visible?: boolean
          label?: string | null
          notes?: string | null
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          created_at: string
          description: string | null
          experience: string | null
          id: string
          is_available: boolean
          is_visible: boolean
          name: string
          phone: string | null
          photo_url: string | null
          qualifications: string | null
          sort_order: number
          specialty: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          experience?: string | null
          id?: string
          is_available?: boolean
          is_visible?: boolean
          name: string
          phone?: string | null
          photo_url?: string | null
          qualifications?: string | null
          sort_order?: number
          specialty?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          experience?: string | null
          id?: string
          is_available?: boolean
          is_visible?: boolean
          name?: string
          phone?: string | null
          photo_url?: string | null
          qualifications?: string | null
          sort_order?: number
          specialty?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string | null
          category: string | null
          created_at: string
          id: string
          is_visible: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          badge: string | null
          created_at: string
          cta_primary_href: string | null
          cta_primary_label: string | null
          cta_secondary_href: string | null
          cta_secondary_label: string | null
          headline: string
          headline_highlight: string | null
          id: string
          image_url: string | null
          is_active: boolean
          stats: Json
          subheading: string | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          created_at?: string
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          headline: string
          headline_highlight?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          stats?: Json
          subheading?: string | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          created_at?: string
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          headline?: string
          headline_highlight?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          stats?: Json
          subheading?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          id: string
          is_visible: boolean
          key: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          is_visible?: boolean
          key: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          is_visible?: boolean
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          cv_url: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          position: string | null
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          cv_url?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          position?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          cv_url?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          position?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          employment_type: string | null
          id: string
          is_open: boolean
          location: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          is_open?: boolean
          location?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          is_open?: boolean
          location?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          href: string
          id: string
          is_visible: boolean
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          is_visible?: boolean
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_visible?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          buy_price: number | null
          category: string | null
          created_at: string
          details: Json
          id: string
          image: string | null
          is_available: boolean
          is_featured: boolean
          is_visible: boolean
          name: string
          old_price: number | null
          rent_price: number | null
          short: string | null
          slug: string | null
          sort_order: number
          stock: number | null
          updated_at: string
        }
        Insert: {
          buy_price?: number | null
          category?: string | null
          created_at?: string
          details?: Json
          id?: string
          image?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_visible?: boolean
          name: string
          old_price?: number | null
          rent_price?: number | null
          short?: string | null
          slug?: string | null
          sort_order?: number
          stock?: number | null
          updated_at?: string
        }
        Update: {
          buy_price?: number | null
          category?: string | null
          created_at?: string
          details?: Json
          id?: string
          image?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_visible?: boolean
          name?: string
          old_price?: number | null
          rent_price?: number | null
          short?: string | null
          slug?: string | null
          sort_order?: number
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_visible: boolean
          name: string
          slug: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          name: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          name?: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      service_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          phone: string
          service_slug: string | null
          status: Database["public"]["Enums"]["submission_status"]
          sub_service: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          service_slug?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          sub_service?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          service_slug?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          sub_service?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_subs: {
        Row: {
          category_id: string
          created_at: string
          featured: boolean
          id: string
          is_visible: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          featured?: boolean
          id?: string
          is_visible?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          featured?: boolean
          id?: string
          is_visible?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_subs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          sort_order: number
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean
          label: string
          sort_order?: number
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_visible?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_visible: boolean
          name: string
          photo_url: string | null
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          name: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          name?: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          created_at: string
          id: string
          is_visible: boolean
          photo_url: string | null
          quote: string | null
          rating: number
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          is_visible?: boolean
          photo_url?: string | null
          quote?: string | null
          rating?: number
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          photo_url?: string | null
          quote?: string | null
          rating?: number
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      why_us_items: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_visible: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      submission_status:
        | "new"
        | "contacted"
        | "in_progress"
        | "done"
        | "archived"
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
    Enums: {
      app_role: ["admin", "editor"],
      submission_status: [
        "new",
        "contacted",
        "in_progress",
        "done",
        "archived",
      ],
    },
  },
} as const
