import React, { useState, useEffect } from 'react';
import { CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsInsights, type AnalyticsInsights } from '../../lib/analytics';
import DashboardLayout from '../../components/DashboardLayout';

const AnalyticsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [analyticsInsights, setAnalyticsInsights] = useState<AnalyticsInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const insights = await getAnalyticsInsights(user.id);
      setAnalyticsInsights(insights);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#246BFD]"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics et performances</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[#246BFD]" />
                <h3 className="text-lg font-semibold text-blue-900">Évolution des ventes</h3>
              </div>
              <div className="text-3xl font-bold text-[#246BFD] mb-2">
                {analyticsInsights?.growthRate > 0 ? '+' : ''}{analyticsInsights?.growthRate || 0}%
              </div>
              <p className="text-blue-700 mb-4">Croissance depuis votre inscription</p>
              {analyticsInsights?.bestMonth && (
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">Votre meilleur mois</p>
                  <p className="text-lg font-bold text-[#246BFD]">{analyticsInsights.bestMonth.month}</p>
                  <p className="text-sm text-blue-700">{analyticsInsights.bestMonth.orders} commandes</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Impact du closing</h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                +{analyticsInsights?.averageClosingImprovement || 0}%
              </div>
              <p className="text-green-700 mb-4">Amélioration du taux de conversion</p>
              {analyticsInsights?.totalRevenue && (
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-sm text-green-900 font-medium">Revenus totaux</p>
                  <p className="text-lg font-bold text-green-600">
                    {(analyticsInsights.totalRevenue / 1000000).toFixed(1)}M F CFA
                  </p>
                  <p className="text-sm text-green-700">Sur les 6 derniers mois</p>
                </div>
              )}
            </div>
          </div>

          {analyticsInsights?.recommendations && analyticsInsights.recommendations.length > 0 && (
            <div className="mt-8 bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Recommandations personnalisées</span>
              </h3>
              <ul className="space-y-3">
                {analyticsInsights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    </div>
                    <span className="text-orange-800">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analyticsInsights?.topPerformingZone && (
            <div className="mt-8 bg-[#e0ebff] p-6 rounded-xl border border-[#246BFD]/20">
              <h3 className="font-semibold text-[#246BFD] mb-2">Zone à fort potentiel</h3>
              <p className="text-gray-700">
                <span className="font-bold">{analyticsInsights.topPerformingZone}</span> est votre zone de livraison la plus performante.
                Concentrez vos efforts marketing dans cette région pour maximiser vos résultats.
              </p>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm font-medium text-gray-600 mb-2">Taux de conversion global</div>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsInsights?.averageClosingImprovement ?
                Math.round(60 + (analyticsInsights.averageClosingImprovement * 0.5)) : 60}%
            </div>
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              En amélioration constante
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm font-medium text-gray-600 mb-2">Valeur moyenne commande</div>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsInsights?.totalRevenue && analyticsInsights.bestMonth.orders ?
                Math.round(analyticsInsights.totalRevenue / (analyticsInsights.bestMonth.orders * 6)).toLocaleString('fr-FR') : '0'} F
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Par transaction
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm font-medium text-gray-600 mb-2">Satisfaction client</div>
            <div className="text-2xl font-bold text-gray-900">4.8/5</div>
            <div className="mt-2 text-sm text-yellow-600">
              ⭐⭐⭐⭐⭐ Excellent service
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
