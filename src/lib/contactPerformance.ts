import { Contact, Transaction } from '../types';
import { differenceInDays } from 'date-fns';

export interface ContactPerformanceData {
  contact: Contact;
  totalTransactions: number;
  onTimePayments: number;
  avgPaymentDelay: number;
}

export function calculateContactPerformance(contacts: Contact[], transactions: Transaction[]): ContactPerformanceData[] {
  return contacts.map(contact => {
    // Get all lending transactions for this contact
    const contactTransactions = transactions.filter(t => 
      t.contactId === contact.id && 
      t.type === 'lending'
    );

    let totalPayments = 0;
    let totalDelay = 0;
    let onTimePayments = 0;

    // Calculate payment performance
    contactTransactions.forEach(transaction => {
      transaction.activities?.forEach(activity => {
        if (activity.type === 'payment') {
          totalPayments++;
          const paymentDate = new Date(activity.createdAt);
          const dueDate = new Date(transaction.startDate);
          dueDate.setMonth(dueDate.getMonth() + (activity.interestMonths || 1));
          
          const delay = differenceInDays(paymentDate, dueDate);
          if (delay <= 0) {
            onTimePayments++;
          } else {
            totalDelay += delay;
          }
        }
      });
    });

    const avgPaymentDelay = totalPayments > 0 ? totalDelay / totalPayments : 0;

    return {
      contact,
      totalTransactions: contactTransactions.length,
      onTimePayments,
      avgPaymentDelay,
    };
  });
}