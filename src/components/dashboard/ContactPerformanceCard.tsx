import React, { useState } from 'react';
import { Card, Title, List, ListItem, Text } from '@tremor/react';
import { Clock, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContactLink } from '../common/ContactLink';
import { calculateContactPerformance } from '../../lib/contactPerformance';
import type { ContactPerformanceData } from '../../lib/contactPerformance';

interface ContactPerformanceCardProps {
  title: string;
  icon: React.ReactNode;
  contacts: ContactPerformanceData[];
  colorClass: string;
}

export function ContactPerformanceCard({ title, icon, contacts, colorClass }: ContactPerformanceCardProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const totalPages = Math.ceil(contacts.length / pageSize);

  const paginatedContacts = contacts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <Title>{title}</Title>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <Text>
              {currentPage + 1} / {totalPages}
            </Text>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <List className="mt-4">
        {paginatedContacts.map((item) => (
          <ListItem key={item.contact.id}>
            <div>
              <ContactLink contactId={item.contact.id}>
                {item.contact.name}
              </ContactLink>
              <Text className="text-xs text-gray-500">
                {item.totalTransactions} lending transactions, {item.onTimePayments} on-time payments
              </Text>
            </div>
            <Text>
              {item.avgPaymentDelay > 0 
                ? `${Math.round(item.avgPaymentDelay)} days delay`
                : 'On time'}
            </Text>
          </ListItem>
        ))}
        {contacts.length === 0 && (
          <ListItem>
            <Text className="text-gray-500">No data available</Text>
          </ListItem>
        )}
      </List>
    </Card>
  );
}

export { calculateContactPerformance };