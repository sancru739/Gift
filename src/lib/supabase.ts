import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Letter = {
  id: string
  title: string
  content: string
  image_url?: string
  created_at: string
}

export type DetailItem = {
  id: string
  title: string
  description?: string
  file_url: string
  file_type: string // e.g., 'image', 'pdf', 'text', 'doc'
  created_at: string
}
