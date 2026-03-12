export type SubscriptionType = 'MONTHLY' | 'YEARLY' | (string & {});
export type PaymentType = 'STRIPE' | 'PAYPAL' | (string & {});

export type PaymentItem = {
  userId: number;
  subscriptionId: string;
  dateOfPayment: string;
  endDateOfSubscription: string;
  price: number;
  subscriptionType: SubscriptionType;
  paymentType: PaymentType;
};

export type PaymentsPage = {
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
  items: PaymentItem[];
};

export type GetMyPaymentsParams = {
  pageNumber?: number;
  pageSize?: number;
};
