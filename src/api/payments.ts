import api from './client';

export interface CreatePaymentRequest {
  amount?: number; // Amount to top-up (minimum 10,000 UZS)
  description?: string;
}

export interface CreatePaymentResponse {
  paymentId: string;
  amount: number;
  currency: string;
  provider: string;
  clickUrl: string;
}

export interface UserAccessInfo {
  balance: number;
  hasEnoughBalance: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  type: string;
  createdAt: string;
  providerTransactionId: string | null;
}

export const paymentsApi = {
  // Create Click payment
  createPayment: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    const response = await api.post<CreatePaymentResponse>('/payments/click/create', data);
    return response.data;
  },

  // Get user access info
  getUserAccess: async (): Promise<UserAccessInfo> => {
    const response = await api.get<UserAccessInfo>('/payments/access');
    return response.data;
  },

  // Check user balance
  checkBalance: async (): Promise<{ balance: number; hasEnough: boolean }> => {
    const response = await api.get<{ balance: number; hasEnough: boolean }>('/payments/check-balance');
    return response.data;
  },

  // Deduct balance for exam
  deductForExam: async (): Promise<{ success: boolean; newBalance: number }> => {
    const response = await api.post<{ success: boolean; newBalance: number }>('/payments/deduct-exam');
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (): Promise<PaymentHistoryItem[]> => {
    const response = await api.get<PaymentHistoryItem[]>('/payments/history');
    return response.data;
  },
};
