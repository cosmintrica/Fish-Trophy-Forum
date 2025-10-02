import { useState, useEffect } from 'react';
import ForumHeader from '../components/ForumHeader';
import ForumSidebar from '../components/ForumSidebar';
import CategoryList from '../components/CategoryList';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../hooks/useAuth';
import { forumQueries } from '../lib/supabase';
import type { ForumCategory, ForumStats } from '../types/forum';

export default function ForumHome() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [stats, setStats] = useState<ForumStats>({
    total_users: 0,
    total_topics: 0,
    total_posts: 0,
    online_users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, forumUser, signOut } = useAuth();

  // Mock data pentru dezvoltare
  const mockOnlineUsers = [
    { id: '1', username: 'PescarExpert', rank: 'expert' },
    { id: '2', username: 'CrapMaster', rank: 'maestru' },
    { id: '3', username: 'DebutantFericit', rank: 'incepator' },
    { id: '4', username: 'ModeratorForum', rank: 'moderator' },
  ];

  const mockRecentPosts = [
    {
      id: '1',
      title: 'Captură excepțională de crap la Snagov',
      user_name: 'PescarExpert',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      category_name: 'Pescuit la Crap'
    },
    {
      id: '2', 
      title: 'Cele mai bune momeli pentru șalău în această perioadă',
      user_name: 'CrapMaster',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      category_name: 'Pescuit la Șalău'
    },
    {
      id: '3',
      title: 'Întrebări de la un începător - ce echipament să aleg?',
      user_name: 'DebutantFericit', 
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category_name: 'Ghiduri pentru Începători'
    }
  ];

  const mockCategories: ForumCategory[] = [
    {
      id: '1',
      name: 'Pescuit în Apă Dulce',
      description: 'Discuții despre pescuitul în râuri, lacuri și bălți din România',
      icon: '🎣',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      subcategories: [
        {
          id: '1-1',
          category_id: '1',
          name: 'Pescuit la Crap',
          description: 'Tehnici, momeli și echipament pentru pescuitul la crap',
          icon: '🐟',
          sort_order: 1,
          is_active: true,
          moderator_only: false,
          created_at: new Date().toISOString(),
          stats: {
            topic_count: 234,
            post_count: 1567,
            last_post: {
              id: '1',
              user_name: 'PescarExpert',
              created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              topic_title: 'Captură excepțională de crap la Snagov'
            }
          }
        },
        {
          id: '1-2',
          category_id: '1', 
          name: 'Pescuit la Păstrăv',
          description: 'Locații, sezoane și tactici pentru păstrăv',
          icon: '🐠',
          sort_order: 2,
          is_active: true,
          moderator_only: false,
          created_at: new Date().toISOString(),
          stats: {
            topic_count: 89,
            post_count: 445,
            last_post: {
              id: '2',
              user_name: 'TroutMaster',
              created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              topic_title: 'Păstrăvi frumoși pe Argeș'
            }
          }
        }
      ],
      stats: {
        topic_count: 323,
        post_count: 2012,
        last_post: {
          id: '1',
          user_name: 'PescarExpert',
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          topic_title: 'Captură excepțională de crap la Snagov'
        }
      }
    },
    {
      id: '2',
      name: 'Pescuit în Marea Neagră',
      description: 'Pescuit de la mal și din barcă pe litoralul românesc',
      icon: '🌊',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      subcategories: [
        {
          id: '2-1',
          category_id: '2',
          name: 'Pescuit de la Mal',
          description: 'Surf casting și tehnici litorale',
          icon: '🏖️',
          sort_order: 1,
          is_active: true,
          moderator_only: false,
          created_at: new Date().toISOString(),
          stats: {
            topic_count: 156,
            post_count: 892,
            last_post: {
              id: '3',
              user_name: 'LitoralPro',
              created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              topic_title: 'Condiții excelente pentru pescuit la Vama Veche'
            }
          }
        }
      ]
    },
    {
      id: '3',
      name: 'Echipament și Accesorii',
      description: 'Reviews, recomandări și discuții despre echipamentul de pescuit',
      icon: '🎯',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      subcategories: [
        {
          id: '3-1',
          category_id: '3',
          name: 'Lansete și Mulinete',
          description: 'Reviews, comparații și recomandări',
          icon: '🎣',
          sort_order: 1,
          is_active: true,
          moderator_only: false,
          created_at: new Date().toISOString(),
          stats: {
            topic_count: 78,
            post_count: 334,
          }
        }
      ]
    }
  ];

  const mockStats: ForumStats = {
    total_users: 1247,
    total_topics: 892,
    total_posts: 5643,
    online_users: 4,
    newest_user: {
      id: '123',
      username: 'DebutantFericit'
    }
  };

  useEffect(() => {
    const loadForumData = async () => {
      try {
        setLoading(true);
        
        // Pentru dezvoltare, folosim mock data
        // În producție, vom înlocui cu apeluri reale către Supabase
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulăm loading
        
        setCategories(mockCategories);
        setStats(mockStats);
        
        // TODO: Load real data
        // const [categoriesResult, statsResult] = await Promise.all([
        //   forumQueries.getCategories(),
        //   forumQueries.getForumStats()
        // ]);
        
        // if (categoriesResult.data) setCategories(categoriesResult.data);
        // if (statsResult.data) setStats(statsResult.data);
        
      } catch (error) {
        console.error('Error loading forum data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForumData();
  }, []);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <ForumHeader 
        user={forumUser ? {
          id: forumUser.id,
          username: forumUser.username,
          avatar_url: forumUser.avatar_url,
          rank: forumUser.rank
        } : null}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      {/* Main Content - cu padding top pentru fixed header */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section - stil Fish Trophy */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Bine ai venit pe{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Forum Pescuit
              </span>
              {' '}🎣
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comunitatea oficială a pescarilor din România - împărtășește experiențe, găsește sfaturi și conectează-te cu alți pasionați
            </p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                <div className="text-2xl font-bold text-blue-600">{stats.total_users.toLocaleString('ro-RO')}</div>
                <div className="text-sm text-gray-600">Membri</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                <div className="text-2xl font-bold text-green-600">{stats.total_topics.toLocaleString('ro-RO')}</div>
                <div className="text-sm text-gray-600">Topicuri</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                <div className="text-2xl font-bold text-purple-600">{stats.total_posts.toLocaleString('ro-RO')}</div>
                <div className="text-sm text-gray-600">Postări</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                <div className="text-2xl font-bold text-orange-600">{stats.online_users}</div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Content principal */}
            <div className="flex-1">
              <CategoryList categories={categories} loading={loading} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-80">
              <ForumSidebar 
                stats={stats}
                onlineUsers={mockOnlineUsers}
                recentPosts={mockRecentPosts}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer - identic cu Fish Trophy */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & Mission */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/icon_free.png" alt="Fish Trophy Forum" className="w-10 h-10 rounded-lg" />
                <div>
                  <span className="text-xl font-bold text-gray-900">Fish Trophy Forum</span>
                  <p className="text-xs text-gray-500">Comunitatea pescarilor din România</p>
                </div>
              </div>
              <p className="text-gray-600 max-w-lg leading-relaxed mb-4 text-sm">
                Împărtășește experiențe, găsește sfaturi și conectează-te cu alți pescari pasionați din România.
              </p>
              <div className="flex gap-2">
                <a href="mailto:contact@fishtrophy.ro" className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs">
                  <span className="w-3 h-3 mr-1">✉️</span>
                  Contact
                </a>
                <a href="https://fishtrophy.ro" className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs">
                  <span className="w-3 h-3 mr-1">🌐</span>
                  Fish Trophy
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Navigare Forum</h3>
              <ul className="space-y-2">
                <li><a href="/forum" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Acasă</a></li>
                <li><a href="/forum/recent" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Postări Recente</a></li>
                <li><a href="/forum/members" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Membri</a></li>
                <li><a href="/forum/rules" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Regulament</a></li>
                <li><a href="/forum/help" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Ajutor</a></li>
              </ul>
            </div>

            {/* Community & Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Comunitate</h3>
              <ul className="space-y-2">
                <li><a href="https://fishtrophy.ro" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Fish Trophy</a></li>
                <li><a href="https://fishtrophy.ro/records" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Recorduri</a></li>
                <li><a href="https://fishtrophy.ro/species" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Specii</a></li>
                <li><a href="https://fishtrophy.ro/leaderboards" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Clasamente</a></li>
              </ul>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Urmărește-ne</h4>
                <div className="flex space-x-2">
                  <a href="https://www.facebook.com/fishtrophy.ro" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#1877F2] rounded-md flex items-center justify-center text-white hover:bg-[#166FE5] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/fishtrophy.ro" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-r from-[#E4405F] to-[#C13584] rounded-md flex items-center justify-center text-white hover:from-[#D7356A] hover:to-[#B02A73] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://x.com/fishtrophy_ro" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                <span>© 2025 Fish Trophy Forum</span>
                <span className="hidden sm:inline">•</span>
                <span>Toate drepturile rezervate</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>Făcut cu</span>
                <span className="text-red-500">❤️</span>
                <span>în România</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
