import React, { useState } from 'react';
import { Contact, TransactionType, TransactionStatus } from '../../types';
import { cn } from '../../lib/utils';
import { DateRangeFilter, type DateRange } from '../common/DateRangeFilter';

interface TransactionFiltersProps {
  contacts: Contact[];
  selectedContacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
  dateRange: DateRange;
  type: TransactionType | null;
  status: TransactionStatus | null;
  onDateRangeChange: (range: DateRange) => void;
  onTypeChange: (type: TransactionType | null) => void;
  onStatusChange: (status: TransactionStatus | null) => void;
}

export function TransactionFilters({
  contacts,
  selectedContacts,
  onContactsChange,
  dateRange,
  type,
  status,
  onDateRangeChange,
  onTypeChange,
  onStatusChange,
}: TransactionFiltersProps) {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const contactsRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contactsRef.current && !contactsRef.current.contains(event.target as Node)) {
        setIsContactsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !contact.isDisabled
  );

  const toggleContact = (contact: Contact) => {
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    if (isSelected) {
      onContactsChange(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      onContactsChange([...selectedContacts, contact]);
    }
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow mb-6">
      <div className="flex items-center justify-end gap-2">
        {/* Contact Filter */}
        <div className="relative w-64" ref={contactsRef}>
          <div
            className="h-7 px-2 flex flex-wrap gap-1 border rounded-md cursor-text items-center"
            onClick={() => setIsContactsOpen(true)}
          >
            {selectedContacts.map(contact => (
              <span
                key={contact.id}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800"
              >
                {contact.name}
                <button
                  type="button"
                  className="ml-1 hover:text-indigo-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleContact(contact);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              className="flex-1 min-w-[60px] border-none focus:ring-0 text-xs p-0 h-5"
              placeholder={selectedContacts.length ? '' : 'Select contacts...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsContactsOpen(true)}
            />
          </div>
          {isContactsOpen && (
            <div className="absolute z-[100] mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className={cn(
                      'px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-100',
                      selectedContacts.some(c => c.id === contact.id) && 'bg-indigo-50'
                    )}
                    onClick={() => toggleContact(contact)}
                  >
                    {contact.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-1.5 text-xs text-gray-500">
                  No contacts found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex gap-1">
          <button
            onClick={() => onTypeChange(type === 'lending' ? null : 'lending')}
            className={cn(
              'h-7 px-2 rounded-md text-xs font-medium',
              type === 'lending'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            )}
          >
            Lending
          </button>
          <button
            onClick={() => onTypeChange(type === 'borrowing' ? null : 'borrowing')}
            className={cn(
              'h-7 px-2 rounded-md text-xs font-medium',
              type === 'borrowing'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            )}
          >
            Borrowing
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1">
          <button
            onClick={() => onStatusChange(status === 'pending' ? null : 'pending')}
            className={cn(
              'h-7 px-2 rounded-md text-xs font-medium',
              status === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            )}
          >
            Pending
          </button>
          <button
            onClick={() => onStatusChange(status === 'active' ? null : 'active')}
            className={cn(
              'h-7 px-2 rounded-md text-xs font-medium',
              status === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            )}
          >
            Active
          </button>
          <button
            onClick={() => onStatusChange(status === 'completed' ? null : 'completed')}
            className={cn(
              'h-7 px-2 rounded-md text-xs font-medium',
              status === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            )}
          >
            Completed
          </button>
          <button
            onClick={() => onStatusChange(status === 'overdue' ? null : 'overdue')}
            className={cn(
              'h-7 px-2 rounded-md text-xs font-medium',
              status === 'overdue'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            )}
          >
            Due
          </button>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          selectedRange={dateRange}
          onRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
}