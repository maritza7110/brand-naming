import { createClient } from '@supabase/supabase-js';

// 보안을 위해 나중에 다시 .env로 옮기는 것을 권장합니다.
const supabaseUrl = 'https://qfvhbabxrurntoxlvuqo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdmhiYWJ4cnVybnRveGx2dXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjE5MjMsImV4cCI6MjA5MDczNzkyM30.9ud7tx_6y6Z2aDVj3GZsIeq7-C7HUpN3PWQUIXEtjx4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
