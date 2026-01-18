const SCALEV_API_URL = 'https://api.scalev.id/v2';
const SCALEV_API_TOKEN = process.env.SCALEV_API_TOKEN;

interface ScalevOrderPayload {
  product_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: 'epayment' | 'bank_transfer';
  amount?: number;
  notes?: string;
}

interface ScalevOrder {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_status: 'pending' | 'paid' | 'expired' | 'cancelled';
  payment_url?: string;
  total_amount: number;
  created_at: string;
}

interface ScalevApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

interface ScalevProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
}

async function scalevRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  if (!SCALEV_API_TOKEN) {
    throw new Error('SCALEV_API_TOKEN is not configured');
  }

  const response = await fetch(`${SCALEV_API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${SCALEV_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Scalev API error: ${response.status}`);
  }

  const data: ScalevApiResponse<T> = await response.json();
  return data.data;
}

export async function createScalevOrder(payload: ScalevOrderPayload): Promise<ScalevOrder> {
  return scalevRequest<ScalevOrder>('/orders', 'POST', payload as unknown as Record<string, unknown>);
}

export async function getScalevOrder(orderId: number): Promise<ScalevOrder> {
  return scalevRequest<ScalevOrder>(`/orders/${orderId}`);
}

export async function getScalevProducts(): Promise<ScalevProduct[]> {
  const response = await scalevRequest<{ results: ScalevProduct[] }>('/products');
  return response.results;
}

export async function getScalevProduct(productId: number): Promise<ScalevProduct> {
  return scalevRequest<ScalevProduct>(`/products/${productId}`);
}

export function isScalevConfigured(): boolean {
  return !!SCALEV_API_TOKEN;
}

export interface ScalevWebhookPayload {
  event: string;
  order: {
    id: number;
    invoice_number: string;
    payment_status: 'pending' | 'paid' | 'expired' | 'cancelled';
    customer_email: string;
    total_amount: number;
  };
}

export function parseScalevWebhook(body: unknown): ScalevWebhookPayload | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  
  const payload = body as ScalevWebhookPayload;
  if (!payload.event || !payload.order) {
    return null;
  }
  
  return payload;
}
