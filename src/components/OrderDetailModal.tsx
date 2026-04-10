import { X, Package, User, Phone, MapPin, Calendar, DollarSign, Truck, Store } from 'lucide-react';
import { useState } from 'react';
import { updateOrderStatusAsAdmin } from '../lib/admin';

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
  notes?: string;
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
  email: string;
  business_name: string;
  full_name?: string;
  phone?: string;
}

interface OrderDetailModalProps {
  order: Order;
  customer: Customer;
  seller: Profile;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderDetailModal({ order, customer, seller, onClose, onUpdate }: OrderDetailModalProps) {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await updateOrderStatusAsAdmin(order.id, status);
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Détails de la commande</h2>
            <p className="text-sm text-gray-600 mt-1">#{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(order.sender_name || order.sender_phone) && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Informations d'enlèvement</h3>
                </div>
                <div className="space-y-2">
                  {order.sender_name && (
                    <div>
                      <p className="text-sm text-gray-600">Nom</p>
                      <p className="font-medium text-gray-900">{order.sender_name}</p>
                    </div>
                  )}
                  {order.sender_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{order.sender_phone}</p>
                    </div>
                  )}
                  {order.sender_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-gray-900">{order.sender_address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Informations produit</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Produit</p>
                  <p className="font-medium text-gray-900">{order.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Montant</p>
                  <p className="font-medium text-gray-900">{Number(order.amount).toLocaleString()} F</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Frais de livraison</p>
                  <p className="font-medium text-gray-900">{Number(order.delivery_fee).toLocaleString()} F</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(Number(order.amount) + Number(order.delivery_fee)).toLocaleString()} F
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Client</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-medium text-gray-900">{customer.full_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{customer.address}</p>
                    <p className="text-sm text-gray-600">{customer.zone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Expéditeur / Vendeur</h3>
              </div>
              <div className="space-y-2">
                {seller.full_name && (
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium text-gray-900">{seller.full_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{seller.email}</p>
                </div>
                {seller.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{seller.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Commerce</p>
                  <p className="font-medium text-gray-900">{seller.business_name || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Livraison</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Zone de livraison</p>
                  <p className="font-medium text-gray-900">{order.delivery_zone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date de commande</p>
                    <p className="text-gray-900">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Statut de la commande</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg font-medium ${getStatusColor(status)}`}
                >
                  <option value="processing">En cours</option>
                  <option value="in_transit">En transit</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              <div className="text-center">
                <span className={`px-4 py-2 rounded-lg font-semibold border-2 ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <p className="text-xs text-gray-600 mt-1">Statut actuel</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || status === order.status}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Mise à jour...' : 'Mettre à jour le statut'}
          </button>
        </div>
      </div>
    </div>
  );
}
