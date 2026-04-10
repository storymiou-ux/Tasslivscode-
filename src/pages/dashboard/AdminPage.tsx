import { useEffect, useState } from 'react';
import { Package, Users, TrendingUp, AlertCircle, ChevronDown, ChevronUp, Eye, Edit2, Check, X as XIcon, Calendar, Filter, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import OrderDetailModal from '../../components/OrderDetailModal';
import { fetchAllOrdersAsAdmin, fetchAllCustomersAsAdmin, fetchAllProfilesAsAdmin, updateOrderStatusAsAdmin } from '../../lib/admin';

interface Order {
  id: string;
  order_number: string;
  product_name: string;
  amount: number;
  delivery_fee: number;
  status: string;
  delivery_zone: string;
  created_at: string;
  user_id: string;
  customer_id: string;
  sender_name?: string;
  sender_phone?: string;
  sender_address?: string;
  sender_business_name?: string;
}

interface Customer {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  zone: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  business_name: string;
  subscription_plan: string;
}

interface UserWithOrders extends Profile {
  orderCount: number;
  totalRevenue: number;
  orders: Order[];
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [usersWithOrders, setUsersWithOrders] = useState<UserWithOrders[]>([]);
  const [filteredUsersWithOrders, setFilteredUsersWithOrders] = useState<UserWithOrders[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeOrders: 0
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [dateFilter, orders, usersWithOrders]);

  const applyDateFilter = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let filtered = [...orders];

    switch (dateFilter) {
      case 'today':
        filtered = orders.filter(order => new Date(order.created_at) >= startOfToday);
        break;
      case 'yesterday':
        filtered = orders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= startOfYesterday && orderDate < startOfToday;
        });
        break;
      case 'week':
        filtered = orders.filter(order => new Date(order.created_at) >= startOfWeek);
        break;
      case 'month':
        filtered = orders.filter(order => new Date(order.created_at) >= startOfMonth);
        break;
      default:
        filtered = orders;
    }

    setFilteredOrders(filtered);

    const filteredUsers = usersWithOrders.map(user => {
      let userFilteredOrders = [...user.orders];

      switch (dateFilter) {
        case 'today':
          userFilteredOrders = user.orders.filter(order => new Date(order.created_at) >= startOfToday);
          break;
        case 'yesterday':
          userFilteredOrders = user.orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= startOfYesterday && orderDate < startOfToday;
          });
          break;
        case 'week':
          userFilteredOrders = user.orders.filter(order => new Date(order.created_at) >= startOfWeek);
          break;
        case 'month':
          userFilteredOrders = user.orders.filter(order => new Date(order.created_at) >= startOfMonth);
          break;
        default:
          userFilteredOrders = user.orders;
      }

      const deliveredOrders = userFilteredOrders.filter(order => order.status === 'delivered');
      const totalRevenue = deliveredOrders.reduce(
          (sum, order) => sum + Number(order.amount) - Number(order.delivery_fee),
          0
        );

      return {
        ...user,
        orders: userFilteredOrders,
        orderCount: deliveredOrders.length,
        totalRevenue
      };
    }).filter(user => user.orderCount > 0);

    setFilteredUsersWithOrders(filteredUsers);
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ordersData, customersData, profilesData] = await Promise.all([
        fetchAllOrdersAsAdmin(),
        fetchAllCustomersAsAdmin(),
        fetchAllProfilesAsAdmin()
      ]);

      setOrders(ordersData || []);
      setCustomers(customersData || []);
      setProfiles(profilesData || []);

      const usersWithOrdersData = profilesData.map(profile => {
        const userOrders = ordersData.filter(order => order.user_id === profile.id);
        const deliveredOrders = userOrders.filter(order => order.status === 'delivered');
        const totalRevenue = deliveredOrders.reduce(
            (sum, order) => sum + Number(order.amount) - Number(order.delivery_fee),
            0
          );
        return {
          ...profile,
          orderCount: deliveredOrders.length,
          totalRevenue,
          orders: userOrders
        };
      }).sort((a, b) => b.orderCount - a.orderCount);

      setUsersWithOrders(usersWithOrdersData);

      const deliveredOrders = (ordersData || []).filter(order => order.status === 'delivered');
      const totalRevenue = deliveredOrders.reduce(
          (sum, order) => sum + Number(order.amount) - Number(order.delivery_fee),
          0
        );

      const activeOrders = (ordersData || []).filter(
        order => order.status === 'processing' || order.status === 'in_transit'
      ).length;

      setStats({
        totalOrders: deliveredOrders.length,
        totalRevenue,
        totalUsers: profilesData?.length || 0,
        activeOrders
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Livré';
      case 'in_transit':
        return 'En transit';
      case 'processing':
        return 'En cours';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const startEditing = (orderId: string, currentStatus: string) => {
    setEditingOrderId(orderId);
    setEditingStatus(currentStatus);
  };

  const cancelEditing = () => {
    setEditingOrderId(null);
    setEditingStatus('');
  };

  const saveStatus = async (orderId: string) => {
    try {
      setUpdatingStatus(true);
      await updateOrderStatusAsAdmin(orderId, editingStatus);
      await loadAdminData();
      setEditingOrderId(null);
      setEditingStatus('');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold mb-1">Accès refusé</h3>
            <p className="text-red-700">
              Vous n'avez pas les permissions d'administrateur pour accéder à cette page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de toutes les commandes et utilisateurs</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Commandes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes Actives</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeOrders}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalRevenue.toLocaleString()} F
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Toutes les Commandes</h2>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="yesterday">Hier</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Aucune commande trouvée pour cette période
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Number(order.amount).toLocaleString()} F
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Number(order.delivery_fee).toLocaleString()} F
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.delivery_zone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingOrderId === order.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={updatingStatus}
                          >
                            <option value="processing">En cours</option>
                            <option value="in_transit">En transit</option>
                            <option value="delivered">Livré</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                          <button
                            onClick={() => saveStatus(order.id)}
                            disabled={updatingStatus}
                            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                            title="Enregistrer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={updatingStatus}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                            title="Annuler"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <button
                            onClick={() => startEditing(order.id, order.status)}
                            className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded"
                            title="Modifier le statut"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Utilisateurs et leurs Commandes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commerce
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredUsersWithOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucun utilisateur avec des commandes pour cette période
                  </td>
                </tr>
              ) : (
                filteredUsersWithOrders.map((user) => (
                  <>
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.full_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.business_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {user.orderCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {user.totalRevenue.toLocaleString()} F
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {user.subscription_plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.orderCount > 0 && (
                          <button
                            onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {expandedUserId === user.id ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                Masquer
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                Voir
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedUserId === user.id && user.orders.length > 0 && (
                      <tr key={`${user.id}-orders`}>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700 mb-3">Commandes de {user.email}</h4>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">N° Commande</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Produit</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Montant</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Livraison</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Zone</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Statut</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {user.orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-sm text-gray-900">{order.order_number}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900">{order.product_name}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {Number(order.amount).toLocaleString()} F
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {Number(order.delivery_fee).toLocaleString()} F
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-600">{order.delivery_zone}</td>
                                      <td className="px-4 py-3 text-sm">
                                        {editingOrderId === order.id ? (
                                          <div className="flex items-center gap-2">
                                            <select
                                              value={editingStatus}
                                              onChange={(e) => setEditingStatus(e.target.value)}
                                              className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                              disabled={updatingStatus}
                                            >
                                              <option value="processing">En cours</option>
                                              <option value="in_transit">En transit</option>
                                              <option value="delivered">Livré</option>
                                              <option value="cancelled">Annulé</option>
                                            </select>
                                            <button
                                              onClick={() => saveStatus(order.id)}
                                              disabled={updatingStatus}
                                              className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                                              title="Enregistrer"
                                            >
                                              <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={cancelEditing}
                                              disabled={updatingStatus}
                                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                              title="Annuler"
                                            >
                                              <XIcon className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                              {getStatusText(order.status)}
                                            </span>
                                            <button
                                              onClick={() => startEditing(order.id, order.status)}
                                              className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded"
                                              title="Modifier le statut"
                                            >
                                              <Edit2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        <button
                                          onClick={() => setSelectedOrder(order)}
                                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                          <Eye className="w-4 h-4" />
                                          Voir
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          customer={customers.find(c => c.id === selectedOrder.customer_id)!}
          seller={profiles.find(p => p.id === selectedOrder.user_id)!}
          onClose={() => setSelectedOrder(null)}
          onUpdate={loadAdminData}
        />
      )}
    </div>
  );
}
