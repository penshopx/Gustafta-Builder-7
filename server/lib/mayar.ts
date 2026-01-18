const MAYAR_API_URL = "https://api.mayar.id/hl/v1";

interface MayarPaymentRequest {
  name: string;
  email: string;
  mobile?: string;
  amount: number;
  description: string;
  redirectUrl?: string;
}

interface MayarPaymentResponse {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    link: string;
    status: string;
    amount: number;
    createdAt: string;
  };
}

interface MayarWebhookPayload {
  event: string;
  id: string;
  amount: number;
  status: string;
  customerEmail: string;
  customerName: string;
  description: string;
  paidAt?: string;
  metadata?: Record<string, any>;
}

export const subscriptionPlans = {
  free_trial: {
    name: "Free Trial",
    duration: 14,
    price: 0,
    chatbotLimit: 1,
    description: "14 hari gratis untuk mencoba semua fitur",
  },
  monthly_1: {
    name: "1 Bulan",
    duration: 30,
    price: 199000,
    chatbotLimit: 3,
    description: "Langganan bulanan dengan akses penuh",
  },
  monthly_3: {
    name: "3 Bulan",
    duration: 90,
    price: 499000,
    chatbotLimit: 5,
    description: "Hemat 16% dibanding bulanan",
  },
  monthly_6: {
    name: "6 Bulan",
    duration: 180,
    price: 999000,
    chatbotLimit: 10,
    description: "Hemat 17% dibanding bulanan",
  },
  monthly_12: {
    name: "12 Bulan",
    duration: 365,
    price: 1999000,
    chatbotLimit: 25,
    description: "Hemat 16% dibanding bulanan",
  },
};

export type SubscriptionPlanKey = keyof typeof subscriptionPlans;

export async function createPaymentLink(
  apiKey: string,
  data: MayarPaymentRequest
): Promise<MayarPaymentResponse> {
  const response = await fetch(`${MAYAR_API_URL}/payment`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      mobile: data.mobile || "",
      amount: data.amount,
      description: data.description,
      redirectUrl: data.redirectUrl || "",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mayar API error: ${error}`);
  }

  return response.json();
}

export function parseWebhookPayload(payload: any): MayarWebhookPayload {
  return {
    event: payload.event || "unknown",
    id: payload.id || payload.transactionId,
    amount: payload.amount || 0,
    status: payload.status || "unknown",
    customerEmail: payload.customer_email || payload.customerEmail || "",
    customerName: payload.customer_name || payload.customerName || "",
    description: payload.description || "",
    paidAt: payload.paid_at || payload.paidAt,
    metadata: payload.metadata || {},
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
