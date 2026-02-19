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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      community_answers: {
        Row: {
          answer_text: string
          created_at: string
          id: string
          question_id: string
          upvoted_by: string[]
          upvotes: number
          user_id: string
          username: string
        }
        Insert: {
          answer_text: string
          created_at?: string
          id?: string
          question_id: string
          upvoted_by?: string[]
          upvotes?: number
          user_id: string
          username: string
        }
        Update: {
          answer_text?: string
          created_at?: string
          id?: string
          question_id?: string
          upvoted_by?: string[]
          upvotes?: number
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_eligibilities: {
        Row: {
          additional_info: string | null
          backlogs: string | null
          branches: string | null
          company: string
          created_at: string
          id: string
          min_cgpa: string
          user_id: string
          username: string
        }
        Insert: {
          additional_info?: string | null
          backlogs?: string | null
          branches?: string | null
          company: string
          created_at?: string
          id?: string
          min_cgpa: string
          user_id: string
          username: string
        }
        Update: {
          additional_info?: string | null
          backlogs?: string | null
          branches?: string | null
          company?: string
          created_at?: string
          id?: string
          min_cgpa?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      community_experience_comments: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          text: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          text: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          text?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_experience_comments_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "community_experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      community_experiences: {
        Row: {
          company: string
          created_at: string
          difficulty: string
          id: string
          interview_date: string | null
          liked_by: string[]
          likes: number
          questions: string | null
          role: string
          rounds: string | null
          tips: string | null
          user_id: string
          username: string
        }
        Insert: {
          company: string
          created_at?: string
          difficulty?: string
          id?: string
          interview_date?: string | null
          liked_by?: string[]
          likes?: number
          questions?: string | null
          role: string
          rounds?: string | null
          tips?: string | null
          user_id: string
          username: string
        }
        Update: {
          company?: string
          created_at?: string
          difficulty?: string
          id?: string
          interview_date?: string | null
          liked_by?: string[]
          likes?: number
          questions?: string | null
          role?: string
          rounds?: string | null
          tips?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      community_questions: {
        Row: {
          best_answer_id: string | null
          company: string
          created_at: string
          description: string | null
          id: string
          liked_by: string[]
          likes: number
          title: string
          user_id: string
          username: string
        }
        Insert: {
          best_answer_id?: string | null
          company: string
          created_at?: string
          description?: string | null
          id?: string
          liked_by?: string[]
          likes?: number
          title: string
          user_id: string
          username: string
        }
        Update: {
          best_answer_id?: string | null
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          liked_by?: string[]
          likes?: number
          title?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      community_vlog_comments: {
        Row: {
          created_at: string
          id: string
          text: string
          user_id: string
          username: string
          vlog_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
          user_id: string
          username: string
          vlog_id: string
        }
        Update: {
          created_at?: string
          id?: string
          text?: string
          user_id?: string
          username?: string
          vlog_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_vlog_comments_vlog_id_fkey"
            columns: ["vlog_id"]
            isOneToOne: false
            referencedRelation: "community_vlogs"
            referencedColumns: ["id"]
          },
        ]
      }
      community_vlogs: {
        Row: {
          company: string
          created_at: string
          description: string | null
          id: string
          liked_by: string[]
          likes: number
          text_content: string | null
          title: string
          type: string
          user_id: string
          username: string
          video_url: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          id?: string
          liked_by?: string[]
          likes?: number
          text_content?: string | null
          title: string
          type?: string
          user_id: string
          username: string
          video_url?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          liked_by?: string[]
          likes?: number
          text_content?: string | null
          title?: string
          type?: string
          user_id?: string
          username?: string
          video_url?: string | null
        }
        Relationships: []
      }
      habits: {
        Row: {
          completed_dates: string[]
          created_at: string
          id: string
          name: string
          streak: number
          type: string
          user_id: string
        }
        Insert: {
          completed_dates?: string[]
          created_at?: string
          id?: string
          name: string
          streak?: number
          type: string
          user_id: string
        }
        Update: {
          completed_dates?: string[]
          created_at?: string
          id?: string
          name?: string
          streak?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_goal_minutes: number
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_goal_minutes?: number
          id?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_goal_minutes?: number
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string
          date: string
          duration: number
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          duration: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: number
          id?: string
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
