import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bsinaducjbtvzaffyjeo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaW5hZHVjamJ0dnphZmZ5amVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NjI5OTYsImV4cCI6MjA5MjMzODk5Nn0.pq41VX4J5VOm34TROTP5qzClrpeyRVLpr7EauFZysL8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
