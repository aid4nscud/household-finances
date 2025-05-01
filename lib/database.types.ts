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
      },
      income_statements: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          user_id: string
          amount: number
          category: string | null
          description: string | null
          date: string | null
          type: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          user_id: string
          amount: number
          category?: string | null
          description?: string | null
          date?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
          amount?: number
          category?: string | null
          description?: string | null
          date?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_statements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      value_chains: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          user_id: string
          chain_data: Json
          name: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          user_id: string
          chain_data: Json
          name?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
          chain_data?: Json
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "value_chains_user_id_fkey"
            columns: ["user_id"]
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