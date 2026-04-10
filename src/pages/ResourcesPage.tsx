import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Video, FileText, Download, TrendingUp,
  ShoppingBag, Truck, DollarSign, Users, Target,
  BarChart3, Lightbulb, MessageCircle, Play,
  ExternalLink, Search, Filter, ArrowRight,
  Package, Zap, Shield, Clock, Sparkles, ArrowLeft, X
} from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tout', icon: Package },
    { id: 'guides', name: 'Guides', icon: BookOpen },
    { id: 'videos', name: 'Vidéos', icon: Video },
    { id: 'tools', name: 'Outils', icon: Target },
    { id: 'blog', name: 'Blog', icon: FileText },
  ];

  const resources = [
    {
      id: 1,
      category: 'guides',
      type: 'Guide',
      title: 'Démarrer son e-commerce au Sénégal',
      description: 'Guide complet pour lancer votre boutique en ligne et générer vos premières ventes en 30 jours',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '15 min',
      level: 'Débutant',
      downloads: 2453,
      link: '#'
    },
    {
      id: 2,
      category: 'videos',
      type: 'Vidéo',
      title: 'Comment optimiser vos livraisons avec Tassli',
      description: 'Tutoriel vidéo pour maximiser l\'efficacité de vos livraisons et réduire vos coûts',
      image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '12 min',
      level: 'Intermédiaire',
      views: 5642,
      link: '#'
    },
    {
      id: 3,
      category: 'guides',
      type: 'Guide',
      title: 'Marketing sur les réseaux sociaux',
      description: 'Stratégies éprouvées pour attirer plus de clients via Facebook, Instagram et WhatsApp',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '20 min',
      level: 'Intermédiaire',
      downloads: 3821,
      link: '#'
    },
    {
      id: 4,
      category: 'tools',
      type: 'Outil',
      title: 'Calculateur de prix de vente',
      description: 'Calculez le prix idéal de vos produits en tenant compte des coûts et marges',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: 'Interactif',
      level: 'Tous niveaux',
      downloads: 1892,
      link: '#'
    },
    {
      id: 5,
      category: 'blog',
      type: 'Article',
      title: '10 erreurs à éviter en e-commerce',
      description: 'Les pièges les plus courants et comment les éviter pour assurer le succès de votre business',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '8 min',
      level: 'Débutant',
      views: 4231,
      link: '#'
    },
    {
      id: 6,
      category: 'videos',
      type: 'Vidéo',
      title: 'Gérer son équipe de closers',
      description: 'Comment recruter, former et motiver votre équipe de closers pour maximiser les conversions',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '18 min',
      level: 'Avancé',
      views: 2156,
      link: '#'
    },
    {
      id: 7,
      category: 'guides',
      type: 'Guide',
      title: 'Guide complet des zones de livraison',
      description: 'Tout savoir sur les zones de livraison à Dakar et dans les régions',
      image: 'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '10 min',
      level: 'Débutant',
      downloads: 5621,
      link: '#'
    },
    {
      id: 8,
      category: 'tools',
      type: 'Outil',
      title: 'Template de contrats',
      description: 'Modèles de contrats pour vos closers, livreurs et partenaires commerciaux',
      image: 'https://images.pexels.com/photos/4427610/pexels-photo-4427610.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: 'Documents',
      level: 'Tous niveaux',
      downloads: 3456,
      link: '#'
    },
    {
      id: 9,
      category: 'blog',
      type: 'Article',
      title: 'Tendances e-commerce 2024',
      description: 'Les tendances qui vont transformer le e-commerce sénégalais cette année',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '12 min',
      level: 'Tous niveaux',
      views: 6782,
      link: '#'
    },
  ];

  const stats = [
    { icon: BookOpen, value: '150+', label: 'Guides & Articles' },
    { icon: Video, value: '80+', label: 'Tutoriels Vidéo' },
    { icon: Users, value: '5,000+', label: 'Membres Actifs' },
    { icon: Download, value: '25K+', label: 'Téléchargements' },
  ];

  const quickLinks = [
    { icon: Zap, title: 'Démarrage rapide', description: 'Lancez votre première livraison', link: '/auth' },
    { icon: BarChart3, title: 'Dashboard', description: 'Suivez vos performances', link: '/auth' },
    { icon: DollarSign, title: 'Tarifs', description: 'Découvrez nos offres', link: '/pricing' },
    { icon: MessageCircle, title: 'Support', description: 'Contactez notre équipe', link: '#' },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white hover:text-cyan-200 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Retour</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 mb-6">
              <Lightbulb className="h-5 w-5" />
              <span className="text-sm font-semibold">Centre de Ressources</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Développez votre <span className="text-cyan-300">expertise</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Guides, tutoriels, outils et conseils d'experts pour réussir votre e-commerce au Sénégal
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des ressources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Accès rapide</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {quickLinks.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all hover:scale-105"
              >
                <item.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {resource.type}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                    {resource.duration}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      resource.level === 'Débutant' ? 'bg-green-100 text-green-700' :
                      resource.level === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-700' :
                      resource.level === 'Avancé' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {resource.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {resource.downloads && (
                        <span className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{resource.downloads.toLocaleString()}</span>
                        </span>
                      )}
                      {resource.views && (
                        <span className="flex items-center space-x-1">
                          <Play className="h-4 w-4" />
                          <span>{resource.views.toLocaleString()}</span>
                        </span>
                      )}
                    </div>
                    <a
                      href={resource.link}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      <span>Voir</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white mb-12">
          <Sparkles className="h-16 w-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl font-black mb-4">
            Besoin d'aide personnalisée ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est disponible pour vous accompagner dans le développement de votre e-commerce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+221123456789"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              Appeler le support
            </a>
            <Link
              to="/auth"
              className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
