import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock, CheckCircle, AlertCircle, Phone, MapPin, Calendar, Filter, Download, Plus, Eye, CreditCard as Edit, MoreHorizontal, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders, getDashboardStats, type Order, type DashboardStats } from '../lib/orders';
import { getAnalyticsInsights, type AnalyticsInsights } from '../lib/analytics';
import { signOut } from '../lib/auth';

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analyticsInsights, setAnalyticsInsights] = useState<AnalyticsInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [ordersData, statsData, insights] = await Promise.all([
        getOrders(user.id),
        getDashboardStats(user.id),
        getAnalyticsInsights(user.id)
      ]);
      setOrders(ordersData);
      setStats(statsData);
      setAnalyticsInsights(insights);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const statsCards = [
    {
      title: 'Commandes ce mois',
      value: stats?.ordersThisMonth.toString() || '0',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Taux de conversion',
      value: `${stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'En cours',
      value: stats?.inProgress.toString() || '0',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Livrées aujourd\'hui',
      value: stats?.deliveredToday.toString() || '0',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} F`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      processing: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      processing: 'En préparation',
      in_transit: 'En livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getClosingStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getClosingStatusText = (status: string) => {
    const texts = {
      confirmed: 'Confirmée',
      pending: 'En attente',
      rejected: 'Refusée'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600">Gérez vos commandes et suivez vos performances</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <UserIcon className="h-5 w-5" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Vue d\'ensemble' },
                { id: 'orders', name: 'Commandes' },
                { id: 'closing', name: 'Service Closing' },
                { id: 'analytics', name: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                const bgColorClass = stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'orange' ? 'bg-orange-100' : 'bg-gray-100';
                const textColorClass = stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'orange' ? 'text-orange-600' : 'text-gray-600';
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${bgColorClass}`}>
                        <Icon className={`h-6 w-6 ${textColorClass}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Aucune commande pour le moment</p>
                    </div>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Package className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Commande {order.order_number} - {order.customers?.full_name || 'Client'}
                          </p>
                          <p className="text-sm text-gray-500">{order.product_name} • {formatAmount(order.amount)}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters and Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="processing">En préparation</option>
                      <option value="in_transit">En livraison</option>
                      <option value="delivered">Livrées</option>
                      <option value="cancelled">Annulées</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    <span>Exporter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Closing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p>Aucune commande trouvée</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                            <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.customers?.full_name || 'Client'}</div>
                            <div className="text-sm text-gray-500">{order.customers?.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatAmount(order.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.requires_closing ? (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClosingStatusColor(order.closing_status!)}`}>
                                {getClosingStatusText(order.closing_status!)}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Non demandé</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{order.delivery_zone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Closing Tab */}
        {activeTab === 'closing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Service de Closing</h2>
                  <p className="text-gray-600">Optimisez vos conversions avec notre équipe professionnelle</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-2">{stats?.conversionRate || 0}%</div>
                  <div className="text-sm text-green-800">Taux de conversion moyen</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{orders.filter(o => o.requires_closing && o.closing_called_at).length}</div>
                  <div className="text-sm text-blue-800">Appels ce mois</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600 mb-2">{orders.filter(o => o.requires_closing && o.closing_status === 'pending').length}</div>
                  <div className="text-sm text-orange-800">En attente</div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">Comment ça marche ?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Vous recevez une commande</h4>
                      <p className="text-blue-700 text-sm">Sur votre site ou via les réseaux sociaux</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Notre équipe appelle</h4>
                      <p className="text-blue-700 text-sm">Dans les 2h pour confirmer la commande</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Livraison garantie</h4>
                      <p className="text-blue-700 text-sm">Commande confirmée = vente assurée</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Closing requests table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Demandes de closing récentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'appel
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.filter(order => order.requires_closing).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          <Phone className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p>Aucune demande de closing pour le moment</p>
                        </td>
                      </tr>
                    ) : (
                      orders.filter(order => order.requires_closing).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.customers?.full_name || 'Client'}</div>
                            <div className="text-sm text-gray-500">{order.customers?.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatAmount(order.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClosingStatusColor(order.closing_status!)}`}>
                              {getClosingStatusText(order.closing_status!)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(order.created_at)}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics et performances</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Évolution des ventes</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analyticsInsights?.growthRate > 0 ? '+' : ''}{analyticsInsights?.growthRate || 0}%
                  </div>
                  <p className="text-blue-700">Croissance depuis votre inscription</p>
                  {analyticsInsights?.bestMonth && (
                    <div className="mt-4 text-sm text-blue-600">
                      Votre meilleur mois : {analyticsInsights.bestMonth.month} ({analyticsInsights.bestMonth.orders} commandes)
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Impact du closing</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">+{analyticsInsights?.averageClosingImprovement || 0}%</div>
                  <p className="text-green-700">Amélioration du taux de conversion</p>
                  {analyticsInsights?.totalRevenue && (
                    <div className="mt-4 text-sm text-green-600">
                      Revenus totaux : {(analyticsInsights.totalRevenue / 1000000).toFixed(1)}M F CFA
                    </div>
                  )}
                </div>
              </div>

              {analyticsInsights?.recommendations && analyticsInsights.recommendations.length > 0 && (
                <div className="mt-8 bg-orange-50 p-6 rounded-xl border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-4">Recommandations personnalisées</h3>
                  <ul className="space-y-2 text-orange-800">
                    {analyticsInsights.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;