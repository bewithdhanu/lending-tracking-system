import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';
import { startOfMonth, format } from 'date-fns';

export function FinancialOverview() {
  const transactions = useStore((state) => state.transactions);

  // Group transactions by month and calculate totals
  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const month = startOfMonth(transaction.startDate);
    const monthStr = format(month, 'MMM yyyy');
    
    const existingMonth = acc.find((item) => item.month === monthStr);
    
    if (existingMonth) {
      if (transaction.type === 'lending') {
        existingMonth.lent += transaction.amount;
      } else {
        existingMonth.borrowed += transaction.amount;
      }
    } else {
      acc.push({
        month: monthStr,
        lent: transaction.type === 'lending' ? transaction.amount : 0,
        borrowed: transaction.type === 'borrowing' ? transaction.amount : 0,
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="lent"
            stackId="1"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="borrowed"
            stackId="1"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}