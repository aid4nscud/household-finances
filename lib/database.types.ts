export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your tables here as they are defined in your Supabase database
      // For example:
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          created_at: string | null
          email: string | null
          name: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          created_at?: string | null
          email?: string | null
          name?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          created_at?: string | null
          email?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // Add other tables as needed
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