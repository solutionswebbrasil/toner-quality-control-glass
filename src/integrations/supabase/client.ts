
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://olyozgenxsccrodcfetf.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seW96Z2VueHNjY3JvZGNmZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjk2NjIsImV4cCI6MjA2NTYwNTY2Mn0.0FxkzeZ0mYVbGYmwUmsibCaBa6vUIVAF65YRXXknuBc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: false,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
