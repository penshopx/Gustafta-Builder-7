const MIDTRANS_API_URL = process.env.MIDTRANS_SERVER_KEY?.startsWith("SB-")
  ? "https://app.sandbox.midtrans.com/snap/v1"
  : "https://app.midtrans.com/snap/v1";

const MIDTRANS_CORE_URL = process.env.MIDTRANS_SERVER_KEY?.startsWith("SB-")
  ? "https://api.sandbox.midtrans.com/v2"
  : "https://api.midtrans.com/v2";

function getAuthHeader(): string {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  return "Basic " + Buffer.from(serverKey + ":").toString("base64");
}

export interface MidtransTransactionDetail {
  order_id: string;
  gross_amount: number;
}

export interface MidtransCustomerDetail {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
}

export interface MidtransItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface MidtransSnapRequest {
  transaction_details: MidtransTransactionDetail;
  customer_details: MidtransCustomerDetail;
  item_details?: MidtransItemDetail[];
  callbacks?: {
    finish?: string;
    error?: string;
    pending?: string;
  };
}

export interface MidtransSnapResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransNotification {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  gross_amount?: string;
  status_code?: string;
  transaction_id?: string;
  transaction_time?: string;
  signature_key?: string;
}

export async function createSnapToken(data: MidtransSnapRequest): Promise<MidtransSnapResponse> {
  const response = await fetch(`${MIDTRANS_API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Midtrans Snap error: ${error}`);
  }

  return response.json();
}

export async function getTransactionStatus(orderId: string): Promise<MidtransNotification> {
  const response = await fetch(`${MIDTRANS_CORE_URL}/${orderId}/status`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Midtrans status check error: ${error}`);
  }

  return response.json();
}

export function isPaymentSuccess(notification: MidtransNotification): boolean {
  const { transaction_status, fraud_status } = notification;
  return (
    transaction_status === "capture" && fraud_status === "accept" ||
    transaction_status === "settlement"
  );
}

export function isPaymentPending(notification: MidtransNotification): boolean {
  return notification.transaction_status === "pending";
}

export function isPaymentFailed(notification: MidtransNotification): boolean {
  return ["cancel", "deny", "expire", "failure"].includes(notification.transaction_status || "");
}

export function isSandbox(): boolean {
  return (process.env.MIDTRANS_SERVER_KEY || "").startsWith("SB-");
}

export const CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";
