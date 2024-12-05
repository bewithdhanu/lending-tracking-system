import { User, Transaction, Contact } from '../types';

const STORAGE_KEYS = {
  USER: 'lendtrack_user',
  TRANSACTIONS: 'lendtrack_transactions',
  CONTACTS: 'lendtrack_contacts',
} as const;

export function loadStoredData() {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const storedContacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      transactions: storedTransactions ? JSON.parse(storedTransactions) : [],
      contacts: storedContacts ? JSON.parse(storedContacts) : [],
    };
  } catch (error) {
    console.error('Error loading stored data:', error);
    return { user: null, transactions: [], contacts: [] };
  }
}

export function saveUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

export function saveTransactions(transactions: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
}

export function saveContacts(contacts: Contact[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts:', error);
  }
}