import React, { useState } from 'react';
import { Contact } from '../../types';
import { cn } from '../../lib/utils';
import { DateRangeFilter, type DateRange } from '../common/DateRangeFilter';

interface HistoryFiltersProps {
  contacts: Contact[];
  selectedContacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function HistoryFilters({
  contacts,
  selectedContacts,
  onContactsChange,
  dateRange,
  onDateRangeChange,
}: HistoryFiltersProps) {
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

        {/* Date Range Filter */}
        <DateRangeFilter
          selectedRange={dateRange}
          onRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
}