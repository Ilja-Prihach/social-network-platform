'use client';

import { useMemo, useState } from 'react';
import { useDictionary } from 'next-intlayer';
import Pagination from '@/shared/ui/Pagination';
import type { PaymentItem } from '@/entities/payment';
import { useMyPaymentsQuery } from '../model/useMyPaymentsQuery';
import myPaymentsContent from '../my-payments.content';
import styles from './MyPaymentsSettingsPage.module.scss';

type DictionaryText = string | { value: string };

const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

const formatDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();

  return `${day}.${month}.${year}`;
};

const formatPrice = (value: number): string => {
  if (!Number.isFinite(value)) return '$0';
  if (Number.isInteger(value)) return `$${value}`;
  return `$${value.toFixed(2)}`;
};

export function MyPaymentsSettingsPage() {
  const content = useDictionary(myPaymentsContent);
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const paymentsQuery = useMyPaymentsQuery({ pageNumber, pageSize });
  const pageData = paymentsQuery.data;

  const items = pageData?.items ?? [];
  const totalCount = pageData?.totalCount ?? 0;

  const subscription_labels = useMemo(
    () => ({
      DAY: toText(content.subscriptionDaily),
      DAILY: toText(content.subscriptionDaily),
      WEEK: toText(content.subscriptionWeekly),
      WEEKLY: toText(content.subscriptionWeekly),
      MONTH: toText(content.subscriptionMonthly),
      MONTHLY: toText(content.subscriptionMonthly),
      YEAR: toText(content.subscriptionYearly),
      YEARLY: toText(content.subscriptionYearly),
    }),
    [content],
  );

  const payment_labels = useMemo(
    () => ({
      STRIPE: toText(content.paymentStripe),
      PAYPAL: toText(content.paymentPaypal),
    }),
    [content],
  );

  const mapSubscriptionType = (subscriptionType: string): string => {
    const normalized = subscriptionType.trim().toUpperCase();
    return (
      subscription_labels[normalized as keyof typeof subscription_labels] ??
      toText(content.subscriptionUnknown)
    );
  };

  const mapPaymentType = (paymentType: string): string => {
    const normalized = paymentType.trim().toUpperCase();
    return (
      payment_labels[normalized as keyof typeof payment_labels] ?? toText(content.paymentUnknown)
    );
  };

  const renderState = () => {
    if (paymentsQuery.isPending) {
      return <p className={styles.state_text}>{toText(content.loading)}</p>;
    }

    if (paymentsQuery.isError) {
      return <p className={styles.state_text}>{toText(content.failedToLoad)}</p>;
    }

    if (!items.length) {
      return <p className={styles.state_text}>{toText(content.noPayments)}</p>;
    }

    return null;
  };

  return (
    <section className={styles.page}>
      <div className={styles.table_scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{toText(content.dateOfPayment)}</th>
              <th>{toText(content.endDateOfSubscription)}</th>
              <th>{toText(content.price)}</th>
              <th>{toText(content.subscriptionType)}</th>
              <th>{toText(content.paymentType)}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: PaymentItem) => (
              <tr key={`${item.subscriptionId}-${item.dateOfPayment}-${item.price}`}>
                <td>{formatDate(item.dateOfPayment)}</td>
                <td>{formatDate(item.endDateOfSubscription)}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{mapSubscriptionType(item.subscriptionType)}</td>
                <td>{mapPaymentType(item.paymentType)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderState()}

      {!paymentsQuery.isPending && !paymentsQuery.isError && totalCount > 0 && (
        <Pagination
          className={styles.pagination}
          totalItems={totalCount}
          itemsPerPage={pageSize}
          currentPage={pageNumber}
          onPageChange={setPageNumber}
          onItemsPerPageChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPageNumber(DEFAULT_PAGE_NUMBER);
          }}
          showItemsPerPageOptions
        />
      )}
    </section>
  );
}
