import React, { useState } from 'react';
import {
  Card,
  TabGroup,
  TabList,
  Tab,
  AreaChart,
  BarChart,
} from '@tremor/react';
import { useStore } from '../../store/useStore';
import type { DateRange } from './DateRangeFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { aggregateChartData } from '../../lib/chartUtils';
import { getDateFormat, formatChartValue } from '../../lib/charts/formatters';
import { chartTypes, aggregationTypes, chartCategories, chartColors } from '../../lib/charts/config';
import type { ChartType, AggregationType } from '../../lib/charts/types';

interface FinancialChartProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function FinancialChart({ dateRange, onDateRangeChange }: FinancialChartProps) {
  const { transactions } = useStore();
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('area');
  const [aggregationType, setAggregationType] = useState<AggregationType>('day');

  const chartData = aggregateChartData(transactions, {
    start: dateRange.start,
    end: dateRange.end,
    aggregationType,
  });

  const formattedData = chartData.map(item => ({
    date: getDateFormat(aggregationType, new Date(item.date)),
    Lending: item.lendingTransactions,
    'Lending Payments': item.lendingPayments,
    Borrowing: item.borrowingTransactions,
    'Borrowing Payments': item.borrowingPayments,
    Net: item.cumulative,
  }));

  const commonProps = {
    className: "h-80 mt-6",
    data: formattedData,
    index: "date",
    categories: chartCategories,
    colors: chartColors,
    valueFormatter: formatChartValue,
    showLegend: true,
    showGridLines: true,
    showAnimation: true,
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-4">
        <DateRangeFilter
          selectedRange={dateRange}
          onRangeChange={onDateRangeChange}
        />
        
        <div className="flex items-center space-x-4">
          <TabGroup index={chartTypes.findIndex(t => t.value === selectedChartType)}>
            <TabList variant="solid" size="sm">
              {chartTypes.map(({ label, value }) => (
                <Tab
                  key={value}
                  onClick={() => setSelectedChartType(value)}
                >
                  {label}
                </Tab>
              ))}
            </TabList>
          </TabGroup>

          <TabGroup index={aggregationTypes.findIndex(t => t.value === aggregationType)}>
            <TabList variant="solid" size="sm">
              {aggregationTypes.map(({ label, value }) => (
                <Tab
                  key={value}
                  onClick={() => setAggregationType(value)}
                >
                  {label}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        </div>
      </div>

      {selectedChartType === 'area' ? (
        <AreaChart
          {...commonProps}
          curveType="monotone"
        />
      ) : (
        <BarChart
          {...commonProps}
          stack={true}
        />
      )}
    </Card>
  );
}