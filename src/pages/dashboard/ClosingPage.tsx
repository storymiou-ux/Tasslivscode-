import React, { useState, useEffect } from 'react';
import { Phone, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders, type Order } from '../../lib/orders';
import DashboardLayout from '../../components/DashboardLayout';

const ClosingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
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

  const closingOrders = orders.filter(order => order.requires_closing);
  const pendingClosing = closingOrders.filter(o => o.closing_status === 'pending').length;
  const confirmedClosing = closingOrders.filter(o => o.closing_status === 'confirmed').length;
  const totalCalls = closingOrders.filter(o => o.closing_called_at).length;

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
        {/* Service Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Service de Closing</h2>
              <p className="text-gray-600">Optimisez vos conversions avec notre équipe professionnelle</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-2">{confirmedClosing}</div>
              <div className="text-sm text-green-800">Confirmées ce mois</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">{totalCalls}</div>
              <div className="text-sm text-blue-800">Appels effectués</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-600 mb-2">{pendingClosing}</div>
              <div className="text-sm text-orange-800">En attente</div>
            </div>
          </div>

          <div className="bg-[#e0ebff] p-6 rounded-xl border border-[#246BFD]/20">
            <h3 className="font-semibold text-[#246BFD] mb-4">Comment ça marche ?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-[#246BFD] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-gray-900">Vous recevez une commande</h4>
                  <p className="text-gray-700 text-sm">Sur votre site ou via les réseaux sociaux</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-[#246BFD] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-gray-900">Notre équipe appelle</h4>
                  <p className="text-gray-700 text-sm">Dans les 2h pour confirmer la commande</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-[#246BFD] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-gray-900">Livraison garantie</h4>
                  <p className="text-gray-700 text-sm">Commande confirmée = vente assurée</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Requests Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
                {closingOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Phone className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Aucune demande de closing pour le moment</p>
                    </td>
                  </tr>
                ) : (
                  closingOrders.map((order) => (
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
                          <span>{order.closing_called_at ? formatDate(order.closing_called_at) : 'En attente'}</span>
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

export default ClosingPage;
