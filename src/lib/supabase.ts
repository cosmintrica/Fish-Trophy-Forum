import { createClient } from '@supabase/supabase-js';

// Pentru dezvoltare fără baza de date - folosim valori mock
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key-for-development';

// Comentez verificarea pentru dezvoltare locală
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Helper functions pentru forum
export const forumQueries = {
  // Categorii
  getCategories: () => 
    supabase
      .from('forum_categories')
      .select(`
        *,
        subcategories:forum_subcategories(*)
      `)
      .eq('is_active', true)
      .order('sort_order'),

  // Subcategorii cu statistici
  getSubcategoriesWithStats: (categoryId: string) =>
    supabase
      .from('forum_subcategories')
      .select(`
        *,
        topics:forum_topics(count),
        posts:forum_posts(count)
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('sort_order'),

  // Topicuri din subcategorie
  getTopics: (subcategoryId: string, limit = 20, offset = 0) =>
    supabase
      .from('forum_topics')
      .select(`
        *,
        user:forum_users(username, avatar_url, rank),
        last_post_user:forum_users(username, avatar_url),
        subcategory:forum_subcategories(name)
      `)
      .eq('subcategory_id', subcategoryId)
      .eq('is_deleted', false)
      .order('is_pinned', { ascending: false })
      .order('last_post_at', { ascending: false })
      .range(offset, offset + limit - 1),

  // Postări din topic
  getPosts: (topicId: string, limit = 10, offset = 0) =>
    supabase
      .from('forum_posts')
      .select(`
        *,
        user:forum_users(username, avatar_url, rank, post_count, reputation_points),
        attachments:forum_attachments(*)
      `)
      .eq('topic_id', topicId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1),

  // Statistici forum
  getForumStats: () =>
    supabase.rpc('get_forum_stats'),

  // Căutare
  searchPosts: (query: string, limit = 20) =>
    supabase.rpc('search_posts', { search_query: query, result_limit: limit }),
};
