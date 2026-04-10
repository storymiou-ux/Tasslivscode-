import { supabase } from './supabase';

export interface AnalyticsStat {
  id: string;
  user_id: string;
  month: string;
  total_orders: number;
  conversion_rate: number;
  closing_improvement: number;
  revenue: number;
  created_at: string;
}

export interface AnalyticsInsights {
  bestMonth: {
    month: string;
    orders: number;
    revenue: number;
  };
  growthRate: number;
  averageClosingImprovement: number;
  totalRevenue: number;
  topPerformingZone?: string;
  recommendations: string[];
}

export const getAnalyticsStats = async (userId: string): Promise<AnalyticsStat[]> => {
  const { data, error } = await supabase
    .from('analytics_stats')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data as AnalyticsStat[];
};

export const getAnalyticsInsights = async (userId: string): Promise<AnalyticsInsights> => {
  const [statsResult, ordersResult] = await Promise.all([
    supabase
      .from('analytics_stats')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false }),
    supabase
      .from('orders')
      .select('delivery_zone, amount, status, product_name, created_at')
      .eq('user_id', userId)
  ]);

  if (statsResult.error) throw statsResult.error;
  if (ordersResult.error) throw ordersResult.error;

  const stats = statsResult.data as AnalyticsStat[];
  const orders = ordersResult.data as any[];

  const bestMonth = stats.reduce((best, current) =>
    current.total_orders > best.total_orders ? current : best
  , stats[0] || { month: '', total_orders: 0, revenue: 0 });

  const oldestStat = stats[stats.length - 1];
  const newestStat = stats[0];
  const growthRate = oldestStat && newestStat
    ? Math.round(((newestStat.total_orders - oldestStat.total_orders) / oldestStat.total_orders) * 100)
    : 0;

  const averageClosingImprovement = stats.length > 0
    ? Math.round(stats.reduce((sum, stat) => sum + Number(stat.closing_improvement), 0) / stats.length)
    : 0;

  const totalRevenue = stats.reduce((sum, stat) => sum + Number(stat.revenue), 0);

  const zoneStats = orders.reduce((acc, order) => {
    if (order.status === 'delivered') {
      acc[order.delivery_zone] = (acc[order.delivery_zone] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topPerformingZone = Object.entries(zoneStats).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];

  const zoneSuccessRate = topPerformingZone
    ? Math.round((zoneStats[topPerformingZone] / orders.filter(o => o.delivery_zone === topPerformingZone).length) * 100)
    : 0;

  const recommendations: string[] = [];

  if (topPerformingZone && zoneSuccessRate >= 90) {
    recommendations.push(
      `Vos livraisons vers ${topPerformingZone} ont un excellent taux de succès (${zoneSuccessRate}%) - considérez y étendre votre marketing`
    );
  }

  if (averageClosingImprovement > 30) {
    recommendations.push(
      `Le service closing améliore vos conversions de ${averageClosingImprovement}% en moyenne - excellent investissement`
    );
  }

  const weekendOrders = orders.filter(order => {
    const date = new Date(order.created_at);
    return date.getDay() === 0 || date.getDay() === 6;
  });

  const weekendCancellations = weekendOrders.filter(o => o.status === 'cancelled').length;
  if (weekendOrders.length > 0 && (weekendCancellations / weekendOrders.length) > 0.2) {
    recommendations.push(
      "Les commandes du weekend ont un taux d'annulation plus élevé - notre équipe closing peut vous aider"
    );
  }

  const productStats = orders.reduce((acc, order) => {
    if (order.status === 'delivered') {
      acc[order.product_name] = (acc[order.product_name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topProduct = Object.entries(productStats).sort(([, a], [, b]) => (b as number) - (a as number))[0];
  if (topProduct && topProduct[1] >= 3) {
    recommendations.push(
      `Votre produit "${topProduct[0]}" performe très bien - pensez à des produits complémentaires`
    );
  }

  return {
    bestMonth: {
      month: formatMonthName(bestMonth.month),
      orders: bestMonth.total_orders,
      revenue: bestMonth.revenue
    },
    growthRate,
    averageClosingImprovement,
    totalRevenue,
    topPerformingZone,
    recommendations
  };
};

const formatMonthName = (monthStr: string): string => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const [year, month] = monthStr.split('-');
  const monthIndex = parseInt(month) - 1;

  return `${months[monthIndex]} ${year}`;
};
