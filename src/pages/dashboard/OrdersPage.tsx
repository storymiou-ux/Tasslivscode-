import React, { useState, useEffect } from 'react';
import { Package, MapPin, Eye, CreditCard as Edit, MoreHorizontal, Filter, Download, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders, type Order } from '../../lib/orders';
import DashboardLayout from '../../components/DashboardLayout';

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const ordersData = await getOrders(user.id);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const applyFilters = () => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => new Date(order.created_at) >= startOfToday);
          break;
        case 'yesterday':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= startOfYesterday && orderDate < startOfToday;
          });
          break;
        case 'week':
          filtered = filtered.filter(order => new Date(order.created_at) >= startOfWeek);
          break;
        case 'month':
          filtered = filtered.filter(order => new Date(order.created_at) >= startOfMonth);
          break;
      }
    }

    return filtered;
  };

  const filteredOrders = applyFilters();

  const calculateTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + Number(order.amount) + Number(order.delivery_fee), 0);
  };

  const totalRevenue = calculateTotalRevenue();

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
        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#246BFD] focus:border-[#246BFD]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="processing">En préparation</option>
                  <option value="in_transit">En livraison</option>
                  <option value="delivered">Livrées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#246BFD] focus:border-[#246BFD]"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="yesterday">Hier</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredOrders.filter(order => order.status === 'delivered').length}</span> commande(s) livrée(s)
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-gray-600">Revenu total:</span>
                <span className="text-lg font-bold text-green-700">{totalRevenue.toLocaleString('fr-FR')} F</span>
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
                          <button className="text-[#246BFD] hover:text-[#1557e0]">
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
    </DashboardLayout>
  );
};

export default OrdersPage;
