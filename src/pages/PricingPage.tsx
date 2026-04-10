import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Globe, Package, Truck, ArrowLeft, Sparkles } from 'lucide-react';

const PricingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const deliveryRates = [
    { zone: 'Dakar', simple: '1 500F', withClosing: '2 500F' },
    { zone: 'Banlieue 1 (Guediawaye, Thiaroye, Pikine, Sicap Mbao)', simple: '2 500F', withClosing: '3 500F' },
    { zone: 'Banlieue 2 (Rufisque, Lac Rose, Zac Mbao, Keur Massar, Yeumbeul...)', simple: '3 500F', withClosing: '4 500F' },
    { zone: 'Régions', simple: '3 500F', withClosing: '4 500F' }
  ];


  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 overflow-hidden">
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

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white hover:text-cyan-200 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Retour</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 animate-pulse-glow">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span className="text-white text-sm font-medium">Tarifs transparents</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
              Tarifs <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-sky-200 text-transparent bg-clip-text">sur mesure</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 font-light leading-relaxed">
              Des formules adaptées à chaque étape de votre croissance. Pas de frais cachés, pas de surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Rates Table */}
      <section id="zones" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 text-center mb-4">
            Tarifs de livraison par zone
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Des prix compétitifs pour toutes les zones du Sénégal
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Zone de livraison
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center justify-center space-x-2">
                        <Truck className="h-4 w-4" />
                        <span>Livraison simple</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Closing + Livraison</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveryRates.map((rate, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rate.zone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-2xl font-bold text-blue-600">{rate.simple}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-2xl font-bold text-green-600">{rate.withClosing}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 text-center mb-4">
            Questions <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">fréquentes</span>
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Tout ce que vous devez savoir sur nos tarifs et services
          </p>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Puis-je changer de pack en cours d'abonnement ?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Oui, vous pouvez upgrader votre pack à tout moment. La différence sera calculée au prorata
                et votre nouvel abonnement commencera immédiatement.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-cyan-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Comment fonctionne le service de closing ?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Nos téléconseillers professionnels appellent vos prospects pour confirmer les commandes,
                répondre aux questions et rassurer sur la qualité de vos produits. Cela augmente vos conversions de 40% en moyenne.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Le site e-commerce inclus dans le Pack Complet est-il vraiment professionnel ?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Absolument. Nos développeurs créent des sites modernes, optimisés pour mobile, avec paiement mobile intégré,
                SEO optimisé et design personnalisé selon votre marque. C'est un site prêt à générer des ventes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Y a-t-il des frais d'installation ?
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Non, l'installation et la configuration initiale sont incluses dans tous nos packs.
                Nous vous accompagnons gratuitement pour bien démarrer avec Tassli.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span className="text-white text-sm font-medium">Lancez-vous maintenant</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Prêt à révolutionner votre <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-sky-200 text-transparent bg-clip-text">logistique</span> ?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 font-light leading-relaxed">
            Rejoignez les centaines de e-commerçants qui font confiance à Tassli pour développer leur business.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/auth"
              className="group relative px-10 py-5 bg-white text-blue-900 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <span className="relative z-10">Commencer maintenant</span>
            </Link>
            <a
              href="tel:+221123456789"
              className="group px-10 py-5 glass-effect text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
            >
              Discuter avec un expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;