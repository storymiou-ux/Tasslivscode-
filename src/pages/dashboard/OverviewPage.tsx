import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders, getDashboardStats, type Order, type DashboardStats } from '../../lib/orders';
import DashboardLayout from '../../components/DashboardLayout';

const OverviewPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>('all');

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
      const [ordersData, statsData] = await Promise.all([
        getOrders(user.id),
        getDashboardStats(user.id)
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} F`;
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

  const filterOrdersByDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return orders.filter(order => {
      const orderDate = new Date(order.created_at);

      switch (dateFilter) {
        case 'today':
          return orderDate >= today;
        case 'yesterday':
          return orderDate >= yesterday && orderDate < today;
        case 'week':
          return orderDate >= weekAgo;
        case 'month':
          return orderDate >= monthAgo;
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrdersByDate();

  const calculateTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + Number(order.amount) + Number(order.delivery_fee), 0);
  };

  const calculateFilteredStats = () => {
    const deliveredOrders = filteredOrders.filter(order => order.status === 'delivered');
    const allDeliveredOrders = orders.filter(order => order.status === 'delivered');
    const inProgress = filteredOrders.filter(order =>
      order.status === 'processing' || order.status === 'in_transit'
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveredToday = deliveredOrders.filter(order => {
      const deliveryDate = order.delivered_at ? new Date(order.delivered_at) : new Date(order.updated_at);
      return deliveryDate >= today;
    }).length;

    return {
      totalOrders: deliveredOrders.length,
      totalDeliveredAllTime: allDeliveredOrders.length,
      inProgress,
      deliveredToday
    };
  };

  const totalRevenue = calculateTotalRevenue();
  const filteredStats = calculateFilteredStats();

  const statsCards = [
    {
      title: 'Revenu total',
      value: formatAmount(totalRevenue),
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total commandes',
      value: filteredStats.totalOrders.toString(),
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Taux de conversion',
      value: `${stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'En cours',
      value: filteredStats.inProgress.toString(),
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Livrées aujourd\'hui',
      value: filteredStats.deliveredToday.toString(),
      totalValue: filteredStats.totalDeliveredAllTime.toString(),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const statsCardsRow1 = statsCards.slice(0, 2);
  const statsCardsRow2 = statsCards.slice(2, 4);
  const statsCardsRow3 = [statsCards[4]];

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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#246BFD] to-[#1557e0] rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Bienvenue sur votre dashboard Tassli !</h2>
              <p className="text-blue-100">Gérez vos commandes et suivez vos performances en temps réel</p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-100" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="all" className="text-gray-900">Toutes les périodes</option>
                <option value="today" className="text-gray-900">Aujourd'hui</option>
                <option value="yesterday" className="text-gray-900">Hier</option>
                <option value="week" className="text-gray-900">Cette semaine</option>
                <option value="month" className="text-gray-900">Ce mois</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {statsCardsRow1.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                        {stat.title}
                        <span className="text-lg font-bold text-gray-700">({(stat as any).totalValue || stat.value})</span>
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {statsCardsRow2.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                        {stat.title}
                        <span className="text-lg font-bold text-gray-700">({(stat as any).totalValue || stat.value})</span>
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {statsCardsRow3.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                        {stat.title}
                        <span className="text-lg font-bold text-gray-700">({(stat as any).totalValue || stat.value})</span>
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredOrders.filter(order => order.status === 'delivered').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Aucune commande livrée pour cette période</p>
                </div>
              ) : (
                filteredOrders.filter(order => order.status === 'delivered').slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-[#246BFD]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Commande {order.order_number} - {order.customers?.full_name || 'Client'}
                      </p>
                      <p className="text-sm text-gray-500">{order.product_name} • {formatAmount(order.amount)}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
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
    </DashboardLayout>
  );
};

export default OverviewPage;
