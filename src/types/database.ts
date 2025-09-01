export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
          uploads_count: number;
          downloads_count: number;
          favorites_count: number;
          is_active: boolean;
          is_suspended: boolean;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          is_premium?: boolean;
          uploads_count?: number;
          downloads_count?: number;
          favorites_count?: number;
          is_active?: boolean;
          is_suspended?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          is_premium?: boolean;
          uploads_count?: number;
          downloads_count?: number;
          favorites_count?: number;
          is_active?: boolean;
          is_suspended?: boolean;
        };
      };
      exams: {
        Row: {
          id: string;
          title: string;
          description: string;
          classe: string;
          matiere: string;
          level: string;
          file_name: string;
          file_size: number;
          file_url: string;
          thumbnail_url: string | null;
          uploader_id: string;
          status: 'pending' | 'approved' | 'rejected';
          is_official: boolean;
          downloads_count: number;
          favorites_count: number;
          created_at: string;
          updated_at: string;
          approved_at: string | null;
          rejected_at: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          title: string;
          description: string;
          classe: string;
          matiere: string;
          level: string;
          file_name: string;
          file_size: number;
          file_url: string;
          thumbnail_url?: string | null;
          uploader_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          is_official?: boolean;
          downloads_count?: number;
          favorites_count?: number;
        };
        Update: {
          title?: string;
          description?: string;
          classe?: string;
          matiere?: string;
          level?: string;
          file_name?: string;
          file_size?: number;
          file_url?: string;
          thumbnail_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          is_official?: boolean;
          downloads_count?: number;
          favorites_count?: number;
          approved_at?: string | null;
          rejected_at?: string | null;
          rejection_reason?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          exam_id: string;
        };
        Update: {
          user_id?: string;
          exam_id?: string;
        };
      };
      downloads: {
        Row: {
          id: string;
          user_id: string | null;
          exam_id: string;
          ip_address: string;
          user_agent: string;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          exam_id: string;
          ip_address: string;
          user_agent: string;
        };
        Update: {
          user_id?: string | null;
          exam_id?: string;
          ip_address?: string;
          user_agent?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}