export type DashboardData = {
  stockAlerts: {
    outOfStock: number;
    lowStock: number;
    items: { id: string; name: string; stock: number }[];
  };
  contentAlerts: {
    visibleHighlights: number;
    activeSlides: number;
  };
  salesAlerts: {
    pendingPayments: number;
  };
  sales: {
    unitsThisMonth: number;
    unitsLastMonth: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
  };
  topProducts: { productId: string; name: string; total: number }[];
  inventoryValue: {
    total: number;
    missingCostCount: number;
  };
  catalog: {
    published: number;
    hidden: number;
  };
  recentSales: {
    id: string;
    sale_number: number;
    customer_name: string | null;
    total: number;
    payment_method: string;
    status: string;
    created_at: string;
  }[];
  charts: {
    daily: { label: string; value: number }[];
    weekly: { label: string; value: number }[];
    monthly: { label: string; value: number }[];
  };
};