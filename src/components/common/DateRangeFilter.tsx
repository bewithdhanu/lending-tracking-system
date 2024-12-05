import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { getTransactionDateRange } from '../../lib/chartUtils';
import { dateRangePresets } from '../../lib/charts/config';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export type DateRange = {
  start: Date;
  end: Date;
  label: string;
};

interface DateRangeFilterProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DateRangeFilter({ selectedRange, onRangeChange, minDate: propMinDate, maxDate: propMaxDate }: DateRangeFilterProps) {
  const { transactions } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { minDate: dataMinDate, maxDate: dataMaxDate } = getTransactionDateRange(transactions);

  const minDate = propMinDate || dataMinDate;
  const maxDate = propMaxDate || dataMaxDate;

  const [state, setState] = useState([
    {
      startDate: selectedRange.start,
      endDate: selectedRange.end,
      key: 'selection'
    }
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ranges: any) => {
    setState([ranges.selection]);
    onRangeChange({
      start: ranges.selection.startDate,
      end: ranges.selection.endDate,
      label: 'Custom Range'
    });
  };

  const handlePresetClick = (preset: typeof dateRangePresets[number]) => {
    let start: Date;
    let end: Date;

    if (preset.days === -2) { // All Time
      start = minDate;
      end = maxDate;
    } else if (preset.days === -1) { // Yesterday
      const yesterday = subDays(new Date(), 1);
      start = startOfDay(yesterday);
      end = endOfDay(yesterday);
    } else if (preset.days === 0) { // Today
      start = startOfDay(new Date());
      end = endOfDay(new Date());
    } else { // Other ranges
      end = endOfDay(new Date());
      start = startOfDay(subDays(end, preset.days - 1));
    }
    
    setState([{ startDate: start, endDate: end, key: 'selection' }]);
    onRangeChange({
      start,
      end,
      label: preset.label
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 inline-flex items-center px-2 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50"
      >
        <Calendar className="h-3 w-3 mr-1" />
        <span>
          {selectedRange.label === 'Custom Range' ? (
            `${format(selectedRange.start, 'MMM d, yyyy')} - ${format(selectedRange.end, 'MMM d, yyyy')}`
          ) : (
            selectedRange.label
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1 right-0">
          <div className={cn(
            "bg-white rounded-lg shadow-lg border",
            "transform scale-75 origin-top-right"
          )}>
            <div className="p-2 border-b">
              <div className="grid grid-cols-2 gap-1">
                {dateRangePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-md",
                      selectedRange.label === preset.label
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <DateRange
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={state}
              direction="horizontal"
              rangeColors={['#4F46E5']}
              minDate={minDate}
              maxDate={maxDate}
              monthDisplayFormat="MMM yyyy"
              className="text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}