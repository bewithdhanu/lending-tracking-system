import { format, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, min, max } from 'date-fns';
import type { Transaction, TransactionActivity } from '../types';
import type { ChartData, AggregationOptions } from './charts/types';

export function getTransactionDateRange(transactions: Transaction[]) {
  if (!transactions.length) {
    const today = new Date();
    return {
      minDate: today,
      maxDate: today,
    };
  }

  const dates = transactions.map(t => new Date(t.startDate));
  const activityDates = transactions.flatMap(t => 
    (t.activities || []).map(a => new Date(a.createdAt))
  );

  const allDates = [...dates, ...activityDates];
  
  return {
    minDate: min(allDates),
    maxDate: max(allDates),
  };
}

export function aggregateChartData(
  transactions: Transaction[],
  options: AggregationOptions
): ChartData[] {
  const { start, end, aggregationType } = options;

  // Initialize periods based on aggregation type
  let periods: Date[];
  switch (aggregationType) {
    case 'day':
      periods = eachDayOfInterval({ start, end });
      break;
    case 'week':
      periods = eachWeekOfInterval({ start, end });
      break;
    case 'month':
      periods = eachMonthOfInterval({ start, end });
      break;
    case 'year':
      periods = eachYearOfInterval({ start, end });
      break;
    default:
      periods = eachDayOfInterval({ start, end });
  }

  // Initialize data structure
  const aggregatedData: { [key: string]: ChartData } = {};
  periods.forEach(date => {
    const key = date.toISOString();
    aggregatedData[key] = {
      date: key,
      lendingTransactions: 0,
      borrowingTransactions: 0,
      lendingPayments: 0,
      borrowingPayments: 0,
      cumulative: 0,
    };
  });

  // Filter and aggregate transactions
  transactions
    .filter(transaction => {
      const date = new Date(transaction.startDate);
      return isWithinInterval(date, { start, end });
    })
    .forEach(transaction => {
      const transactionDate = new Date(transaction.startDate);
      let periodStart: Date;

      // Get the start of the period for this transaction
      switch (aggregationType) {
        case 'week':
          periodStart = startOfWeek(transactionDate);
          break;
        case 'month':
          periodStart = startOfMonth(transactionDate);
          break;
        case 'year':
          periodStart = startOfYear(transactionDate);
          break;
        default:
          periodStart = transactionDate;
      }

      const key = periodStart.toISOString();
      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          date: key,
          lendingTransactions: 0,
          borrowingTransactions: 0,
          lendingPayments: 0,
          borrowingPayments: 0,
          cumulative: 0,
        };
      }

      // Add transaction amount based on type
      if (transaction.type === 'lending') {
        aggregatedData[key].lendingTransactions += transaction.amount;
      } else {
        aggregatedData[key].borrowingTransactions += transaction.amount;
      }

      // Add payments
      transaction.activities?.forEach(activity => {
        if (activity.type === 'payment' && activity.amount) {
          const activityDate = new Date(activity.createdAt);
          if (!isWithinInterval(activityDate, { start, end })) return;

          let activityPeriodStart: Date;
          switch (aggregationType) {
            case 'week':
              activityPeriodStart = startOfWeek(activityDate);
              break;
            case 'month':
              activityPeriodStart = startOfMonth(activityDate);
              break;
            case 'year':
              activityPeriodStart = startOfYear(activityDate);
              break;
            default:
              activityPeriodStart = activityDate;
          }

          const activityKey = activityPeriodStart.toISOString();
          if (!aggregatedData[activityKey]) {
            aggregatedData[activityKey] = {
              date: activityKey,
              lendingTransactions: 0,
              borrowingTransactions: 0,
              lendingPayments: 0,
              borrowingPayments: 0,
              cumulative: 0,
            };
          }

          if (transaction.type === 'lending') {
            aggregatedData[activityKey].lendingPayments += activity.amount;
          } else {
            aggregatedData[activityKey].borrowingPayments += activity.amount;
          }
        }
      });
    });

  // Convert to array and sort by date
  const sortedData = Object.values(aggregatedData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate cumulative values
  let cumulative = 0;
  sortedData.forEach(data => {
    cumulative += (data.lendingTransactions - data.lendingPayments) - 
                 (data.borrowingTransactions - data.borrowingPayments);
    data.cumulative = cumulative;
  });

  return sortedData;
}