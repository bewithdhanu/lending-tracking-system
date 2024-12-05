import { addDays, subDays, subMonths, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { User, Contact, Transaction, TransactionActivity } from '../types';
import { generateId } from './utils';

const DUMMY_CURRENCIES = ['USD', 'EUR', 'INR', 'GBP'];
const TRANSACTION_TYPES = ['lending', 'borrowing'] as const;
const TRANSACTION_STATUSES = ['pending', 'active', 'completed', 'overdue'] as const;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

interface TimeDistribution {
  period: string;
  startDate: Date;
  endDate: Date;
  count: number;
}

function getTimeDistributions(): TimeDistribution[] {
  const now = new Date();
  const today = startOfDay(now);
  const thisWeek = startOfWeek(now);
  const thisMonth = startOfMonth(now);
  const lastMonth = startOfMonth(subMonths(now, 1));
  const thisYear = startOfYear(now);
  const allTime = subMonths(now, 24); // 2 years ago

  return [
    { period: 'today', startDate: today, endDate: now, count: 5 },
    { period: 'this_week', startDate: thisWeek, endDate: today, count: 10 },
    { period: 'this_month', startDate: thisMonth, endDate: thisWeek, count: 15 },
    { period: 'last_month', startDate: lastMonth, endDate: thisMonth, count: 20 },
    { period: 'this_year', startDate: thisYear, endDate: lastMonth, count: 25 },
    { period: 'all_time', startDate: allTime, endDate: thisYear, count: 25 },
  ];
}

function generateDummyContacts(userId: string): Contact[] {
  const contacts: Contact[] = [];
  const distributions = getTimeDistributions();
  
  distributions.forEach(({ startDate, endDate, count }) => {
    for (let i = 0; i < count; i++) {
      const createdAt = getRandomDate(startDate, endDate);
      contacts.push({
        id: generateId(),
        userId,
        name: `Contact ${contacts.length + 1}`,
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        address: `${getRandomInt(100, 9999)} Test Street, City ${contacts.length + 1}`,
        referralId: contacts.length > 0 ? contacts[getRandomInt(0, contacts.length - 1)].id : undefined,
        isDisabled: Math.random() > 0.9, // 10% chance of being disabled
        createdAt,
        updatedAt: createdAt,
      });
    }
  });

  return contacts;
}

function generateDummyActivities(
  transactionId: string,
  userId: string,
  startDate: Date,
  amount: number,
  endDate: Date
): TransactionActivity[] {
  const activities: TransactionActivity[] = [];

  // Add initial comment
  activities.push({
    id: generateId(),
    type: 'comment',
    content: 'Transaction created',
    createdAt: startDate,
    userId,
  });

  // Generate 2-5 activities per transaction
  const activityCount = getRandomInt(2, 5);
  for (let i = 0; i < activityCount; i++) {
    const isPayment = Math.random() > 0.5;
    const createdAt = getRandomDate(startDate, endDate);

    if (isPayment) {
      const interestMonths = getRandomInt(1, 3);
      const paymentAmount = (amount * 0.1) * interestMonths; // 10% per month
      activities.push({
        id: generateId(),
        type: 'payment',
        content: `Interest payment for ${interestMonths} month(s)`,
        amount: paymentAmount,
        interestMonths,
        includedPrincipal: false,
        createdAt,
        userId,
      });
    } else {
      activities.push({
        id: generateId(),
        type: 'comment',
        content: `Follow-up comment ${i + 1}`,
        createdAt,
        userId,
      });
    }
  }

  return activities.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

function generateDummyTransactions(userId: string, contacts: Contact[]): Transaction[] {
  const transactions: Transaction[] = [];
  const distributions = getTimeDistributions();
  
  distributions.forEach(({ startDate, endDate, count }) => {
    for (let i = 0; i < count; i++) {
      const transactionStartDate = getRandomDate(startDate, endDate);
      const amount = getRandomInt(1000, 50000);
      const type = getRandomElement(TRANSACTION_TYPES);
      
      // Adjust status based on date
      let status: typeof TRANSACTION_STATUSES[number];
      const daysSinceStart = Math.floor((new Date().getTime() - transactionStartDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceStart > 90) {
        status = Math.random() > 0.5 ? 'completed' : 'overdue';
      } else if (daysSinceStart > 30) {
        status = getRandomElement(['active', 'overdue']);
      } else {
        status = getRandomElement(['pending', 'active']);
      }

      transactions.push({
        id: generateId(),
        userId,
        type,
        amount,
        currency: getRandomElement(DUMMY_CURRENCIES),
        contactId: getRandomElement(contacts).id,
        interestRate: getRandomInt(12, 36), // 12% to 36% per year
        startDate: transactionStartDate,
        status,
        notes: Math.random() > 0.5 ? `Test note for transaction ${transactions.length + 1}` : undefined,
        activities: generateDummyActivities(generateId(), userId, transactionStartDate, amount, endDate),
        createdAt: transactionStartDate,
        updatedAt: transactionStartDate,
      });
    }
  });

  return transactions;
}

export function generateDummyData(user: User) {
  const contacts = generateDummyContacts(user.id);
  const transactions = generateDummyTransactions(user.id, contacts);
  return { contacts, transactions };
}