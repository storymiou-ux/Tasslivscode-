import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Shield,
  Zap,
  Truck,
  Phone,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Package,
  MapPin,
  Clock,
  Bot,
  Sparkles,
  BarChart3,
  Target,
  Globe,
  Lock,
  MessageCircle
} from 'lucide-react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'closer' | 'courier'>('business');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 overflow-hidden pt-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: 0.3
              }}
            ></div>
          ))}
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 animate-pulse-glow">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span className="text-white text-sm font-medium">Confirmation + Livraison tout-en-un</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
            Vendez plus. <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-sky-200 text-transparent bg-clip-text">Livrez mieux.</span>
          </h1>

          <p className="text-xl md:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            La plateforme qui confirme vos ventes et livre vos clients. Closing professionnel + Livraison rapide = Croissance garantie.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              to="/auth"
              className="group relative px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            <a
              href="https://wa.me/221762883202"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 px-10 py-5 glass-effect rounded-2xl font-semibold text-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Discuter avec nous</span>
            </a>
          </div>

          <div className="glass-effect rounded-3xl p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              <div className="space-y-2">
                <div className="text-4xl font-black text-gradient-blue">87%</div>
                <div className="text-sm text-blue-200">Taux de confirmation</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-gradient-blue">2500+</div>
                <div className="text-sm text-blue-200">Colis par mois</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-gradient-blue">24/7</div>
                <div className="text-sm text-blue-200">Support disponible</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-gradient-blue">500+</div>
                <div className="text-sm text-blue-200">E-commerçants</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">100% Sécurisé</span>
            </div>
            <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Livraison Express</span>
            </div>
            <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Analytiques Avancées</span>
            </div>
            <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <Globe className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Couverture Totale</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full px-6 py-2 mb-6">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900 font-semibold">Une plateforme, trois expériences</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Le problème qu'on <span className="text-gradient">résout</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vos clients hésitent. Vos colis traînent. Nous confirmons vos ventes ET livrons en 24h.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-2xl glass-effect p-2">
              <button
                onClick={() => setActiveTab('business')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'business'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                E-commerçants
              </button>
              <button
                onClick={() => setActiveTab('closer')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'closer'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Closers
              </button>
              <button
                onClick={() => setActiveTab('courier')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'courier'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Livreurs
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {activeTab === 'business' && (
              <>
                <div className="space-y-8">
                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Closing professionnel</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Notre équipe de closers appelle vos clients pour confirmer chaque commande. Fini les paniers abandonnés et les fausses commandes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Livraison rapide garantie</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Livraison en 24-48h partout au Sénégal. Vos clients reçoivent leurs commandes confirmées à temps, à chaque fois.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Zéro commandes perdues</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Suivi en temps réel de chaque commande : du closing jusqu'à la livraison. Vous savez exactement où en est chaque vente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-20 animate-pulse-glow"></div>
                  <div className="relative bg-gradient-to-br from-gray-900 to-blue-950 rounded-3xl p-8 glass-dark">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium text-blue-300">Dashboard en direct</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400">Live</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                          <div className="text-3xl font-black text-white mb-1">247</div>
                          <div className="text-sm text-blue-200">Commandes confirmées</div>
                          <div className="text-xs text-green-400 mt-1">↑ 23% vs mois dernier</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                          <div className="text-3xl font-black text-white mb-1">87%</div>
                          <div className="text-sm text-blue-200">Taux de closing</div>
                          <div className="text-xs text-green-400 mt-1">+34% de conversions</div>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-white">Recommandation</span>
                          <Sparkles className="h-4 w-4 text-cyan-400" />
                        </div>
                        <p className="text-sm text-blue-200">
                          12 commandes à confirmer - Closers disponibles maintenant
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-white">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Livreur #442 - En route</div>
                            <div className="text-xs text-blue-300">ETA: 12 min - Dakar</div>
                          </div>
                          <div className="text-xs text-green-400">●</div>
                        </div>
                        <div className="flex items-center space-x-3 text-white">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">3 colis prêts</div>
                            <div className="text-xs text-blue-300">Assigné à Livreur #891</div>
                          </div>
                          <div className="text-xs text-yellow-400">●</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'closer' && (
              <>
                <div className="space-y-8">
                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Interface dédiée</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Tableau de bord spécial closers pour confirmer les commandes rapidement et suivre vos performances
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Commissions transparentes</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Système de rémunération clair avec suivi en temps réel de vos commissions et statistiques
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Scripts optimisés</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Accédez aux informations produits et scripts de vente pour maximiser vos taux de conversion
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-2xl opacity-20 animate-pulse-glow"></div>
                  <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                    <img
                      src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Closer professionnel"
                      className="w-full h-96 object-cover rounded-2xl mb-6"
                    />
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                          <div className="text-3xl font-black text-blue-600 mb-1">47</div>
                          <div className="text-sm text-gray-600">Confirmations aujourd'hui</div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl">
                          <div className="text-3xl font-black text-cyan-600 mb-1">89%</div>
                          <div className="text-sm text-gray-600">Taux de conversion</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                        <div className="text-2xl font-black text-green-600 mb-1">42,500 FCFA</div>
                        <div className="text-sm text-gray-600">Commissions ce mois</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'courier' && (
              <>
                <div className="space-y-8">
                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Revenus optimisés</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Système qui optimise vos tournées pour maximiser vos gains et réduire vos déplacements
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Routes optimisées</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Navigation intelligente qui évite le trafic et regroupe les livraisons proches pour gagner du temps
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Protection complète</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Assurance, équipement professionnel et support juridique inclus
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-20 animate-pulse-glow"></div>
                  <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                    <img
                      src="https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Livreur professionnel"
                      className="w-full h-96 object-cover rounded-2xl mb-6"
                    />
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                          <div className="text-3xl font-black text-blue-600 mb-1">85K</div>
                          <div className="text-sm text-gray-600">FCFA aujourd'hui</div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl">
                          <div className="text-3xl font-black text-cyan-600 mb-1">12</div>
                          <div className="text-sm text-gray-600">Livraisons restantes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Résultats <span className="bg-gradient-to-r from-cyan-300 to-blue-300 text-transparent bg-clip-text">réels</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Des e-commerçants qui convertissent enfin leurs commandes en ventes livrées
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Fatou Diop",
                role: "Boutique Mode Dakar",
                text: "Avant, 40% de mes commandes n'aboutissaient pas. Avec Tassli, nos closers confirment 87% des ventes et la livraison suit derrière. Mon CA a doublé en 3 mois.",
                rating: 5
              },
              {
                name: "Moussa Fall",
                role: "Electronics Shop",
                text: "Le closing professionnel + livraison rapide = clients satisfaits. Mes avis Google sont passés de 3.2 à 4.8 étoiles. Je ne gère plus rien, je vends juste.",
                rating: 5
              },
              {
                name: "Aminata Sow",
                role: "Cosmétiques Bio",
                text: "Je dépensais 150K/mois en pubs Facebook pour rien. Tassli confirme les vraies intentions d'achat. Fini l'argent jeté par les fenêtres.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-dark rounded-3xl p-8 hover:scale-105 transition-transform duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-blue-300">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full px-6 py-2 mb-6">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900 font-semibold">Suivi en temps réel</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Visibilité <span className="text-gradient">totale</span> sur chaque colis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Du closing à la livraison, suivez chaque étape en direct. Vos clients sont informés, vous êtes tranquille.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Suivi de chaque étape</h3>
                  <p className="text-gray-600 leading-relaxed">
                    De la confirmation à la livraison, suivez le statut de chaque commande en temps réel. Vous savez exactement à quelle étape se trouve votre colis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Notifications automatiques</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Vos clients reçoivent des SMS à chaque étape : colis confirmé, en préparation, en route, livré. Zéro appel, zéro stress.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Statistiques détaillées</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Visualisez vos taux de confirmation, délais de livraison et performance globale. Toutes les données pour optimiser vos ventes.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500">
                    <defs>
                      <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 50 50 Q 100 150, 200 150 T 350 250 Q 300 350, 200 400 T 50 450"
                      stroke="url(#pathGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="10,5"
                      className="opacity-60"
                    />
                  </svg>

                  <div className="absolute top-8 left-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 animate-pulse-scale">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Commande confirmée</div>
                        <div className="text-xs text-gray-500">10:23 AM</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 font-semibold flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Closer validé
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 animate-pulse-scale" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">En livraison</div>
                        <div className="text-xs text-gray-500">14:45 PM</div>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-semibold flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      ETA: 2h30
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-16 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 animate-pulse-scale" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Livré avec succès</div>
                        <div className="text-xs text-gray-500">16:12 PM</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 font-semibold flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Client satisfait
                    </div>
                  </div>

                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-20 h-20 animate-package-move">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                        <Package className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <Sparkles className="h-16 w-16 text-cyan-300 mx-auto mb-8 animate-float" />
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Arrêtez de perdre des ventes
          </h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-light">
            Chaque commande non confirmée = argent perdu. Nos closers travaillent pendant que vous dormez. Livraison garantie le lendemain.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/auth"
              className="group relative px-12 py-6 bg-white text-blue-600 rounded-2xl font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Commencer gratuitement
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <a
              href="https://wa.me/221762883202"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 px-12 py-6 glass-effect rounded-2xl font-bold text-xl text-white hover:bg-white/30 transition-all"
            >
              <MessageCircle className="h-6 w-6" />
              <span>Écrivez-nous</span>
            </a>
          </div>
          <p className="text-blue-200 mt-8 text-sm">
            ✓ Sans engagement  ✓ Configuration en 5 minutes  ✓ Support dédié
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
