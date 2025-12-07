
// --------------------------------------------
// 1. src/app/models/order.model.ts
// --------------------------------------------
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: 'kitchen' | 'bar' | 'receipt';
}

export interface Order {
  orderId: string;
  orderNumber: number;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  tableNumber?: string;
}

export interface PrintRequest {
  category: string;
  content: any;
  timestamp: Date;
}

export interface PrintResponse {
  success: boolean;
  jobId?: string;
  message?: string;
  error?: string;
}
