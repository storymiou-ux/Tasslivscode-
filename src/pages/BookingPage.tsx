import React, { useState } from 'react';
import { MapPin, Package, Phone, User, Calendar, Clock, CheckCircle, Truck, Shield, Star, Plus, Minus, ChevronDown, ChevronUp, X, CreditCard as Edit3, ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { findOrCreateCustomer } from '../lib/customers';
import { createOrder } from '../lib/orders';

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const minDeliveries = hasSubscription ? 1 : 3;

  const [pickupInfo, setPickupInfo] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    businessName: '',
    businessType: ''
  });

  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      expanded: true,
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      deliveryZone: 'dakar',
      deliveryDate: '',
      deliveryTime: 'morning',
      needsCalling: false,
      products: [
        {
          id: 1,
          description: '',
          value: '',
          weight: '',
          quantity: 1
        }
      ]
    }
  ]);

  const [expandedSections, setExpandedSections] = useState({
    pickup: true,
    deliveries: true
  });

  const deliveryZones = [
    { id: 'dakar', name: 'Dakar', price: 1500, callingPrice: 2500 },
    { id: 'banlieue1', name: 'Banlieue 1 (Guediawaye, Thiaroye, Pikine, Sicap Mbao)', price: 2500, callingPrice: 3500 },
    { id: 'banlieue2', name: 'Banlieue 2 (Rufisque, Lac Rose, Zac Mbao, Keur Massar, Yeumbeul...)', price: 3500, callingPrice: 4500 },
    { id: 'regions', name: 'Régions', price: 3500, callingPrice: 4500 }
  ];

  const addDelivery = () => {
    const newDelivery = {
      id: Date.now(),
      expanded: true,
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      deliveryZone: 'dakar',
      deliveryDate: '',
      deliveryTime: 'morning',
      needsCalling: false,
      products: [
        {
          id: 1,
          description: '',
          value: '',
          weight: '',
          quantity: 1
        }
      ]
    };
    setDeliveries([...deliveries, newDelivery]);
  };

  const removeDelivery = (deliveryId: number) => {
    if (deliveries.length > minDeliveries) {
      setDeliveries(deliveries.filter(d => d.id !== deliveryId));
    }
  };

  const toggleDeliveryExpansion = (deliveryId: number) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? { ...d, expanded: !d.expanded } : d
    ));
  };

  const updateDelivery = (deliveryId: number, field: string, value: any) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? { ...d, [field]: value } : d
    ));
  };

  const addProduct = (deliveryId: number) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? {
        ...d,
        products: [...d.products, {
          id: Date.now(),
          description: '',
          value: '',
          weight: '',
          quantity: 1
        }]
      } : d
    ));
  };

  const removeProduct = (deliveryId: number, productId: number) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? {
        ...d,
        products: d.products.filter(p => p.id !== productId)
      } : d
    ));
  };

  const updateProduct = (deliveryId: number, productId: number, field: string, value: any) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? {
        ...d,
        products: d.products.map(p => 
          p.id === productId ? { ...p, [field]: value } : p
        )
      } : d
    ));
  };

  const calculateTotalPrice = () => {
    let total = 0;
    deliveries.forEach(delivery => {
      const zone = deliveryZones.find(z => z.id === delivery.deliveryZone);
      if (zone) {
        const basePrice = delivery.needsCalling ? zone.callingPrice : zone.price;
        const totalProducts = delivery.products.reduce((sum, product) => sum + product.quantity, 0);
        total += basePrice * totalProducts;
      }
    });
    return total;
  };

  const validateForm = () => {
    if (!pickupInfo.senderName || !pickupInfo.senderPhone || !pickupInfo.senderAddress) {
      setError('Veuillez remplir toutes les informations de l\'expéditeur');
      return false;
    }

    for (const delivery of deliveries) {
      if (!delivery.receiverName || !delivery.receiverPhone || !delivery.receiverAddress) {
        setError('Veuillez remplir toutes les informations pour chaque destinataire');
        return false;
      }

      for (const product of delivery.products) {
        if (!product.description || !product.value) {
          setError('Veuillez remplir la description et la valeur de chaque produit');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Vous devez être connecté pour créer une commande');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPromises = deliveries.map(async (delivery) => {
        const customer = await findOrCreateCustomer(
          user.id,
          delivery.receiverPhone,
          delivery.receiverName,
          delivery.receiverAddress,
          delivery.deliveryZone
        );

        const zone = deliveryZones.find(z => z.id === delivery.deliveryZone);
        const deliveryFee = delivery.needsCalling ? zone!.callingPrice : zone!.price;

        for (const product of delivery.products) {
          const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

          await createOrder({
            user_id: user.id,
            customer_id: customer.id!,
            order_number: orderNumber,
            product_name: product.description,
            product_description: `${product.quantity}x ${product.description} - ${product.value} FCFA${product.weight ? ` - ${product.weight}kg` : ''}`,
            amount: parseInt(product.value),
            delivery_zone: delivery.deliveryZone,
            delivery_address: delivery.receiverAddress,
            delivery_fee: deliveryFee,
            requires_closing: delivery.needsCalling,
            sender_name: pickupInfo.senderName,
            sender_phone: pickupInfo.senderPhone,
            sender_address: pickupInfo.senderAddress,
            sender_business_name: pickupInfo.businessName
          });
        }
      });

      await Promise.all(orderPromises);

      alert('Commandes enregistrées avec succès ! Vous pouvez les consulter dans votre tableau de bord.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error creating orders:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement des commandes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour à l'accueil</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Réservez vos livraisons
            </h1>
            <p className="text-xl opacity-90">
              Service professionnel, livraisons multiples en une seule commande
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Pickup Information Section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div 
                className="p-6 border-b border-gray-200 cursor-pointer"
                onClick={() => setExpandedSections({...expandedSections, pickup: !expandedSections.pickup})}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Expéditeur</h2>
                  </div>
                  {expandedSections.pickup ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </div>

              {expandedSections.pickup && (
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={pickupInfo.senderName}
                        onChange={(e) => setPickupInfo({...pickupInfo, senderName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={pickupInfo.senderPhone}
                        onChange={(e) => setPickupInfo({...pickupInfo, senderPhone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+221 77 123 4567"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse d'enlèvement *
                      </label>
                      <input
                        type="text"
                        value={pickupInfo.senderAddress}
                        onChange={(e) => setPickupInfo({...pickupInfo, senderAddress: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Rue 10, Point E, Dakar"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de votre business
                      </label>
                      <input
                        type="text"
                        value={pickupInfo.businessName}
                        onChange={(e) => setPickupInfo({...pickupInfo, businessName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ma Boutique Mode"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de business
                      </label>
                      <select
                        value={pickupInfo.businessType}
                        onChange={(e) => setPickupInfo({...pickupInfo, businessType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="fashion">Mode & Vêtements</option>
                        <option value="beauty">Beauté & Cosmétiques</option>
                        <option value="electronics">Électronique</option>
                        <option value="food">Alimentation</option>
                        <option value="home">Maison & Décoration</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deliveries Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Package className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Destinataires</h2>
                    <p className="text-sm text-gray-500 mt-1">(minimum {minDeliveries})</p>
                  </div>
                </div>
                <button
                  onClick={addDelivery}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter destinataire</span>
                </button>
              </div>

              {/* Deliveries List */}
              <div className="space-y-6">
                {deliveries.map((delivery, index) => (
                  <div key={delivery.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Delivery Header */}
                    <div 
                      className="p-5 bg-gray-50 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
                      onClick={() => toggleDeliveryExpansion(delivery.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Destinataire #{index + 1}</h3>
                          {delivery.receiverName && (
                            <p className="text-sm text-gray-600">{delivery.receiverName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {delivery.receiverPhone && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {delivery.receiverPhone}
                          </span>
                        )}
                        {deliveries.length > minDeliveries && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDelivery(delivery.id);
                            }}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                        {delivery.expanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                      </div>
                    </div>

                    {/* Delivery Content */}
                    {delivery.expanded && (
                      <div className="p-6 bg-white space-y-6">
                        {/* Products Section */}
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                          <div className="mb-4">
                            <h4 className="font-semibold text-blue-900 flex items-center space-x-2">
                              <Package className="h-5 w-5" />
                              <span>Produits à livrer</span>
                            </h4>
                          </div>

                          <div className="space-y-4">
                            {delivery.products.map((product, productIndex) => (
                              <div key={product.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                      {productIndex + 1}
                                    </span>
                                    <span>Produit #{productIndex + 1}</span>
                                  </h5>
                                  {delivery.products.length > 1 && (
                                    <button
                                      onClick={() => removeProduct(delivery.id, product.id)}
                                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Description du produit *
                                    </label>
                                    <input
                                      type="text"
                                      value={product.description}
                                      onChange={(e) => updateProduct(delivery.id, product.id, 'description', e.target.value)}
                                      placeholder="Ex: Robe traditionnelle"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Valeur (F CFA) *
                                    </label>
                                    <input
                                      type="number"
                                      value={product.value}
                                      onChange={(e) => updateProduct(delivery.id, product.id, 'value', e.target.value)}
                                      placeholder="45000"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Poids (kg)
                                    </label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={product.weight}
                                      onChange={(e) => updateProduct(delivery.id, product.id, 'weight', e.target.value)}
                                      placeholder="1.5"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>

                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Quantité
                                    </label>
                                    <div className="flex items-center space-x-3">
                                      <button
                                        type="button"
                                        onClick={() => updateProduct(delivery.id, product.id, 'quantity', Math.max(1, product.quantity - 1))}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                                        {product.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => updateProduct(delivery.id, product.id, 'quantity', product.quantity + 1)}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nom du destinataire *
                            </label>
                            <input
                              type="text"
                              value={delivery.receiverName}
                              onChange={(e) => updateDelivery(delivery.id, 'receiverName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Téléphone destinataire *
                            </label>
                            <input
                              type="tel"
                              value={delivery.receiverPhone}
                              onChange={(e) => updateDelivery(delivery.id, 'receiverPhone', e.target.value)}
                              placeholder="+221 77 123 4567"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Zone de réception *
                            </label>
                            <select
                              value={delivery.deliveryZone}
                              onChange={(e) => updateDelivery(delivery.id, 'deliveryZone', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                              {deliveryZones.map((zone) => (
                                <option key={zone.id} value={zone.id}>
                                  {zone.name} - {zone.price}F (avec closing: {zone.callingPrice}F)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Adresse de réception *
                            </label>
                            <input
                              type="text"
                              value={delivery.receiverAddress}
                              onChange={(e) => updateDelivery(delivery.id, 'receiverAddress', e.target.value)}
                              placeholder="Ex: Cité Keur Gorgui, Villa 123, Dakar"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date de réception
                            </label>
                            <input
                              type="date"
                              value={delivery.deliveryDate}
                              onChange={(e) => updateDelivery(delivery.id, 'deliveryDate', e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Créneau horaire
                            </label>
                            <select
                              value={delivery.deliveryTime}
                              onChange={(e) => updateDelivery(delivery.id, 'deliveryTime', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="morning">Matin (8h - 12h)</option>
                              <option value="afternoon">Après-midi (12h - 18h)</option>
                              <option value="evening">Soir (18h - 20h)</option>
                              <option value="flexible">Flexible</option>
                            </select>
                          </div>
                        </div>

                        {/* Closing Service Option */}
                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start space-x-3">
                              <Phone className="h-6 w-6 text-orange-600 mt-1" />
                              <div>
                                <h4 className="font-semibold text-orange-900">Service de closing professionnel</h4>
                                <p className="text-sm text-orange-700 mt-1">
                                  Notre équipe appelle le destinataire pour confirmer la commande et rassurer sur la qualité.
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={delivery.needsCalling}
                                onChange={(e) => updateDelivery(delivery.id, 'needsCalling', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {!user && (
                <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Vous devez être connecté pour créer une commande.
                    <button
                      onClick={() => navigate('/auth')}
                      className="ml-1 underline font-medium hover:text-orange-900"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !user}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-5 w-5 animate-spin" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Confirmer toutes les livraisons</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des commandes</h3>
                
                {!hasSubscription && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-orange-800">
                      <strong>Minimum 3 destinataires</strong> requis pour les non-abonnés
                    </p>
                  </div>
                )}
                
                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>{deliveries.length} destinataire{deliveries.length > 1 ? 's' : ''}</span>
                    <span>{calculateTotalPrice().toLocaleString()}F</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {deliveries.reduce((total, delivery) => 
                      total + delivery.products.reduce((sum, product) => sum + product.quantity, 0), 0
                    )} produit{deliveries.reduce((total, delivery) => 
                      total + delivery.products.reduce((sum, product) => sum + product.quantity, 0), 0) > 1 ? 's' : ''} au total
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold text-lg mt-4">
                    <span>Total</span>
                    <span className="text-blue-600">{calculateTotalPrice().toLocaleString()}F</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4">Pourquoi choisir Tassli ?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-800">Colis sécurisés et assurés</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-800">Suivi temps réel</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-blue-600 fill-current" />
                    <span className="text-sm text-blue-800">99.2% de satisfaction client</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-800">Support 24/7</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSubscription}
                      onChange={(e) => setHasSubscription(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-blue-700">J'ai un abonnement Tassli</span>
                  </label>
                </div>
                
                <h3 className="font-semibold text-blue-900 mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Notre équipe est là pour vous accompagner
                </p>
                <a
                  href="https://wa.me/221762883202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Support live</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;