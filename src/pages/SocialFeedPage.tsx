import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ShoppingCart, Play, User, MoreHorizontal, Home, Compass, UserPlus, PlusSquare, Radio, Menu, X, Search, Package, Sparkles, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const SocialFeedPage: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('pour-toi');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const toggleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const toggleSave = (postId: number) => {
    const newSavedPosts = new Set(savedPosts);
    if (newSavedPosts.has(postId)) {
      newSavedPosts.delete(postId);
    } else {
      newSavedPosts.add(postId);
    }
    setSavedPosts(newSavedPosts);
  };

  const toggleFollow = (userName: string) => {
    const newFollowedUsers = new Set(followedUsers);
    if (newFollowedUsers.has(userName)) {
      newFollowedUsers.delete(userName);
    } else {
      newFollowedUsers.add(userName);
    }
    setFollowedUsers(newFollowedUsers);
  };

  const handleShare = async (post: typeof posts[0]) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.product,
          text: post.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  const posts = [
    {
      id: 1,
      user: 'Fatou Boutique',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      product: 'Robe Africaine Élégante',
      price: '25,000F',
      originalPrice: '35,000F',
      video: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      likes: 234,
      comments: 45,
      shares: 18,
      saves: 56,
      description: 'Magnifique robe traditionnelle, parfaite pour les occasions spéciales! 🌟 #ModeSenegal #RobeAfricaine'
    },
    {
      id: 2,
      user: 'Tech Dakar',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      product: 'Smartphone Samsung Galaxy',
      price: '180,000F',
      originalPrice: '220,000F',
      video: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      likes: 567,
      comments: 89,
      shares: 34,
      saves: 120,
      description: 'Le dernier Samsung Galaxy avec livraison gratuite à Dakar! 📱 #TechSenegal #Smartphone'
    },
    {
      id: 3,
      user: 'Bijoux Teranga',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      product: 'Collier en Or 18K',
      price: '45,000F',
      originalPrice: '60,000F',
      video: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      likes: 123,
      comments: 23,
      shares: 12,
      saves: 45,
      description: 'Bijoux artisanaux de qualité supérieure ✨ Livraison sécurisée avec Tassli #BijouxSenegal'
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Header - Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">LIVE</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('suivis')}
              className={`text-base font-medium transition-colors ${activeTab === 'suivis' ? 'text-white' : 'text-gray-400'}`}
            >
              Suivis
            </button>
            <button
              onClick={() => setActiveTab('pour-toi')}
              className={`text-base font-semibold transition-colors ${activeTab === 'pour-toi' ? 'text-white border-b-2 border-white pb-1' : 'text-gray-400'}`}
            >
              Pour toi
            </button>
            <button
              onClick={() => setActiveTab('stem')}
              className={`text-base font-medium transition-colors ${activeTab === 'stem' ? 'text-white' : 'text-gray-400'}`}
            >
              STEM
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`text-base font-medium transition-colors ${activeTab === 'explorer' ? 'text-white' : 'text-gray-400'}`}
            >
              Explorer
            </button>
          </div>

          <button
            className="text-white"
            onClick={() => setShowSearchModal(true)}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-3 border-b border-gray-800">
              <button
                className="text-white mr-3"
                onClick={() => setShowSearchModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des produits, utilisateurs..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-gray-400 text-center mt-8">Commencez à taper pour rechercher</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex flex-col w-64 border-r border-gray-800 h-screen sticky top-0 bg-black">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">Tassli</span>
            </div>
          </Link>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab('pour-toi')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'pour-toi' ? 'text-white bg-gray-900' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className={activeTab === 'pour-toi' ? 'font-semibold' : ''}>Pour vous</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'explorer' ? 'text-white bg-gray-900' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <Compass className="w-6 h-6" />
            <span className={activeTab === 'explorer' ? 'font-semibold' : ''}>Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('comptes')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'comptes' ? 'text-white bg-gray-900' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <UserPlus className="w-6 h-6" />
            <span className={activeTab === 'comptes' ? 'font-semibold' : ''}>Comptes</span>
          </button>

          <button
            onClick={() => setActiveTab('abonnements')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'abonnements' ? 'text-white bg-gray-900' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <Package className="w-6 h-6" />
            <span className={activeTab === 'abonnements' ? 'font-semibold' : ''}>Mes Abonnements</span>
          </button>

          <Link
            to="/booking"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors text-gray-400"
          >
            <PlusSquare className="w-6 h-6" />
            <span>Upload</span>
          </Link>

          <button
            onClick={() => setActiveTab('live')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'live' ? 'text-white bg-gray-900' : 'text-gray-400 hover:bg-gray-900'
            }`}
          >
            <Radio className="w-6 h-6" />
            <span className={activeTab === 'live' ? 'font-semibold' : ''}>LIVE</span>
          </button>
        </nav>

        <div className="px-4 pb-4 space-y-4 border-t border-gray-800 pt-4">
          <Link
            to="/dashboard"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors text-gray-400"
          >
            <User className="w-6 h-6" />
            <span>Profil</span>
          </Link>

          <Link
            to="/auth?mode=login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Feed */}
        <div className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
          <div className="max-w-2xl mx-auto lg:ml-64">
            {posts.map((post) => (
              <div key={post.id} className="relative h-screen snap-start">
                {/* Video/Image Container */}
                <div className="relative h-full bg-black">
                  <img
                    src={post.video}
                    alt={post.product}
                    className="w-full h-full object-cover"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </button>
                  </div>

                  {/* Right Side Actions */}
                  <div className="absolute right-3 bottom-20 lg:bottom-8 flex flex-col items-center space-y-4">
                    <div className="flex flex-col items-center">
                      <img
                        src={post.avatar}
                        alt={post.user}
                        className="w-12 h-12 rounded-full border-2 border-white mb-1 cursor-pointer"
                      />
                      <button
                        onClick={() => toggleFollow(post.user)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center -mt-3 border-2 border-black transition-colors ${
                          followedUsers.has(post.user) ? 'bg-gray-500' : 'bg-red-500'
                        }`}
                      >
                        <span className="text-white text-xl font-bold leading-none">
                          {followedUsers.has(post.user) ? '✓' : '+'}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex flex-col items-center transition-transform active:scale-95"
                    >
                      <Heart
                        className={`w-9 h-9 mb-1 transition-all ${
                          likedPosts.has(post.id)
                            ? 'text-red-500 fill-red-500 scale-110'
                            : 'text-white'
                        }`}
                      />
                      <span className="text-white text-xs font-semibold">
                        {likedPosts.has(post.id)
                          ? ((post.likes + 1) / 1000).toFixed(1) + 'K'
                          : (post.likes / 1000).toFixed(1) + 'K'
                        }
                      </span>
                    </button>

                    <button className="flex flex-col items-center transition-transform active:scale-95">
                      <MessageCircle className="w-9 h-9 text-white mb-1" />
                      <span className="text-white text-xs font-semibold">{post.comments}</span>
                    </button>

                    <button
                      onClick={() => toggleSave(post.id)}
                      className="flex flex-col items-center transition-transform active:scale-95"
                    >
                      <Bookmark
                        className={`w-9 h-9 mb-1 transition-all ${
                          savedPosts.has(post.id)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white'
                        }`}
                      />
                      <span className="text-white text-xs font-semibold">
                        {savedPosts.has(post.id) ? post.saves + 1 : post.saves}
                      </span>
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="flex flex-col items-center transition-transform active:scale-95"
                    >
                      <Share2 className="w-9 h-9 text-white mb-1" />
                      <span className="text-white text-xs font-semibold">{post.shares}</span>
                    </button>

                    <Link
                      to="/booking"
                      className="w-10 h-10 bg-gray-900/80 rounded-lg flex items-center justify-center backdrop-blur-sm transition-transform active:scale-95 hover:bg-blue-600"
                    >
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </Link>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-20 lg:bottom-8 left-3 right-20 text-white">
                    <div className="mb-2">
                      <h3 className="font-bold text-base mb-1">@{post.user}</h3>
                      <p className="text-sm mb-2 line-clamp-2">{post.description}</p>
                    </div>

                    {/* Product Card */}
                    <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-3">
                          <h4 className="font-semibold text-sm mb-1">{post.product}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{post.price}</span>
                            <span className="text-xs text-gray-300 line-through">{post.originalPrice}</span>
                          </div>
                        </div>
                        <Link
                          to="/booking"
                          className="bg-white text-black font-semibold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
                        >
                          Acheter
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('pour-toi')}
            className={`flex flex-col items-center ${
              activeTab === 'pour-toi' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Home className="w-7 h-7 mb-0.5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </button>

          <button
            onClick={() => setActiveTab('amis')}
            className={`flex flex-col items-center ${
              activeTab === 'amis' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <UserPlus className="w-7 h-7 mb-0.5" />
            <span className="text-[10px] font-medium">Ami(e)s</span>
          </button>

          <Link to="/booking" className="relative -mt-3">
            <div className="w-12 h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <PlusSquare className="w-6 h-6 text-white" />
            </div>
          </Link>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center ${
              activeTab === 'messages' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <MessageCircle className="w-7 h-7 mb-0.5" />
            <span className="text-[10px] font-medium">Messages</span>
          </button>

          <Link
            to="/dashboard"
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <User className="w-7 h-7 mb-0.5" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocialFeedPage;