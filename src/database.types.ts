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
      areas: {
        Row: {
          attestation_signature: string
          boundaries: Json | null
          created_at: string
          crop: string
          description: string
          farm_id: string
          id: string
          months_under_practice: number
          name: string
          tillage_practice: Database["public"]["Enums"]["tillage_practice"]
          updated_at: string
        }
        Insert: {
          attestation_signature: string
          boundaries?: Json | null
          created_at?: string
          crop: string
          description: string
          farm_id: string
          id?: string
          months_under_practice: number
          name: string
          tillage_practice: Database["public"]["Enums"]["tillage_practice"]
          updated_at?: string
        }
        Update: {
          attestation_signature?: string
          boundaries?: Json | null
          created_at?: string
          crop?: string
          description?: string
          farm_id?: string
          id?: string
          months_under_practice?: number
          name?: string
          tillage_practice?: Database["public"]["Enums"]["tillage_practice"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "areas_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          address: string
          area: string | null
          boundaries: Json | null
          country: string
          created_at: string
          id: string
          name: string | null
          parcel_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          area?: string | null
          boundaries?: Json | null
          country: string
          created_at?: string
          id?: string
          name?: string | null
          parcel_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          area?: string | null
          boundaries?: Json | null
          country?: string
          created_at?: string
          id?: string
          name?: string | null
          parcel_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mulching_practices: {
        Row: {
          coverage: Database["public"]["Enums"]["coverage_level"]
          id: string
          material: Database["public"]["Enums"]["mulch_material"]
          material_other: string | null
          material_state: Database["public"]["Enums"]["material_state"]
          mulch_amount_in_kg: number
          practice_id: string
          practice_type: Database["public"]["Enums"]["practice_type"]
          source: Database["public"]["Enums"]["input_source"]
          source_description: string | null
        }
        Insert: {
          coverage: Database["public"]["Enums"]["coverage_level"]
          id?: string
          material: Database["public"]["Enums"]["mulch_material"]
          material_other?: string | null
          material_state: Database["public"]["Enums"]["material_state"]
          mulch_amount_in_kg: number
          practice_id: string
          practice_type?: Database["public"]["Enums"]["practice_type"]
          source: Database["public"]["Enums"]["input_source"]
          source_description?: string | null
        }
        Update: {
          coverage?: Database["public"]["Enums"]["coverage_level"]
          id?: string
          material?: Database["public"]["Enums"]["mulch_material"]
          material_other?: string | null
          material_state?: Database["public"]["Enums"]["material_state"]
          mulch_amount_in_kg?: number
          practice_id?: string
          practice_type?: Database["public"]["Enums"]["practice_type"]
          source?: Database["public"]["Enums"]["input_source"]
          source_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mulching_practices_practice_id_practice_type_fkey"
            columns: ["practice_id", "practice_type"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id", "type"]
          },
        ]
      }
      practices: {
        Row: {
          area_id: string
          attestation_signature: string
          burn_area: Database["public"]["Enums"]["coverage_level"] | null
          burn_material:
            | Database["public"]["Enums"]["burn_material_kind"]
            | null
          burn_material_other: string | null
          compost_manure_amount_in_kg: number | null
          compost_manure_type:
            | Database["public"]["Enums"]["compost_manure_kind"]
            | null
          created_at: string
          crop: string
          fertilizer_amount_in_kg: number | null
          fertilizer_other: string | null
          fertilizer_type: Database["public"]["Enums"]["fertilizer_kind"] | null
          finished_at: string | null
          id: string
          planted_at: string | null
          started_at: string
          tillage_area: Database["public"]["Enums"]["coverage_level"] | null
          tillage_practice: Database["public"]["Enums"]["tillage_practice"]
          tillage_times: number | null
          tillage_tool: Database["public"]["Enums"]["tillage_tool"] | null
          type: Database["public"]["Enums"]["practice_type"]
          updated_at: string
        }
        Insert: {
          area_id: string
          attestation_signature: string
          burn_area?: Database["public"]["Enums"]["coverage_level"] | null
          burn_material?:
            | Database["public"]["Enums"]["burn_material_kind"]
            | null
          burn_material_other?: string | null
          compost_manure_amount_in_kg?: number | null
          compost_manure_type?:
            | Database["public"]["Enums"]["compost_manure_kind"]
            | null
          created_at?: string
          crop: string
          fertilizer_amount_in_kg?: number | null
          fertilizer_other?: string | null
          fertilizer_type?:
            | Database["public"]["Enums"]["fertilizer_kind"]
            | null
          finished_at?: string | null
          id?: string
          planted_at?: string | null
          started_at: string
          tillage_area?: Database["public"]["Enums"]["coverage_level"] | null
          tillage_practice: Database["public"]["Enums"]["tillage_practice"]
          tillage_times?: number | null
          tillage_tool?: Database["public"]["Enums"]["tillage_tool"] | null
          type: Database["public"]["Enums"]["practice_type"]
          updated_at?: string
        }
        Update: {
          area_id?: string
          attestation_signature?: string
          burn_area?: Database["public"]["Enums"]["coverage_level"] | null
          burn_material?:
            | Database["public"]["Enums"]["burn_material_kind"]
            | null
          burn_material_other?: string | null
          compost_manure_amount_in_kg?: number | null
          compost_manure_type?:
            | Database["public"]["Enums"]["compost_manure_kind"]
            | null
          created_at?: string
          crop?: string
          fertilizer_amount_in_kg?: number | null
          fertilizer_other?: string | null
          fertilizer_type?:
            | Database["public"]["Enums"]["fertilizer_kind"]
            | null
          finished_at?: string | null
          id?: string
          planted_at?: string | null
          started_at?: string
          tillage_area?: Database["public"]["Enums"]["coverage_level"] | null
          tillage_practice?: Database["public"]["Enums"]["tillage_practice"]
          tillage_times?: number | null
          tillage_tool?: Database["public"]["Enums"]["tillage_tool"] | null
          type?: Database["public"]["Enums"]["practice_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practices_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          inquiry_id: string | null
          last_name: string | null
          national_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          inquiry_id?: string | null
          last_name?: string | null
          national_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          inquiry_id?: string | null
          last_name?: string | null
          national_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_mulching_practice: {
        Args: { p_mulching: Json; p_practice: Json }
        Returns: string
      }
    }
    Enums: {
      burn_material_kind: "crop_residue" | "weeds_or_brush" | "other"
      compost_manure_kind: "compost" | "manure"
      coverage_level: "all" | "about_half" | "small_part"
      fertilizer_kind: "urea" | "npk" | "other"
      input_source: "this_farm" | "brought_in"
      material_state: "fresh_green" | "dry"
      mulch_material:
        | "crop_residue"
        | "straw_or_hay"
        | "leaves_and_cuttings"
        | "other"
      practice_type: "mulching" | "organic_amendments" | "cover_crops"
      tillage_practice: "conventional" | "reduced" | "no_till" | "native_fallow"
      tillage_tool: "hand_hoe" | "animal_plow" | "tractor"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      burn_material_kind: ["crop_residue", "weeds_or_brush", "other"],
      compost_manure_kind: ["compost", "manure"],
      coverage_level: ["all", "about_half", "small_part"],
      fertilizer_kind: ["urea", "npk", "other"],
      input_source: ["this_farm", "brought_in"],
      material_state: ["fresh_green", "dry"],
      mulch_material: [
        "crop_residue",
        "straw_or_hay",
        "leaves_and_cuttings",
        "other",
      ],
      practice_type: ["mulching", "organic_amendments", "cover_crops"],
      tillage_practice: ["conventional", "reduced", "no_till", "native_fallow"],
      tillage_tool: ["hand_hoe", "animal_plow", "tractor"],
    },
  },
} as const
