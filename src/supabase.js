import { createClient } from '@supabase/supabase-js'

// REEMPLAZA ESTO CON TUS DATOS DE SUPABASE (Settings -> API)
const supabaseUrl = 'https://tvielqhgvhggnnrzxvkz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aWVscWhndmhnZ25ucnp4dmt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTU3MzEsImV4cCI6MjA4NjA5MTczMX0.qqmV44-bG6XN6gnaTeQBwOouB4iCWi6cZnTcfiIpIho'

export const supabase = createClient(supabaseUrl, supabaseKey)