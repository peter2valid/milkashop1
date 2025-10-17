// Supabase client initialized with project's URL and anon key
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://caqnxlmjlixaxqfbqxak.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcW54bG1qbGl4YXhxZmJxeGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTY3OTIsImV4cCI6MjA3NjIzMjc5Mn0._5REzoui8oT-N2s5ut0lboFRTah_4cJxNtERcOBCWxg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export const PRODUCTS_TABLE = "products";
export const PRODUCT_BUCKET = "product-images";


