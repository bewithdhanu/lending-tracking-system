import { create } from 'zustand';
import { Transaction, User, Contact } from '../types';
import { loadStoredData, saveUser, saveTransactions, saveContacts } from '../lib/storage';

const { user: storedUser, transactions: storedTransactions, contacts: storedContacts } = loadStoredData();

interface Store {
  user: User | null;
  contacts: Contact[];
  transactions: Transaction[];
  setUser: (user: User | null) => void;
  updateUserSettings: (settings: Partial<User['settings']>) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  logout: () => void;
}

export const useStore = create<Store>((set) => ({
  user: storedUser,
  contacts: storedContacts,
  transactions: storedTransactions,
  setUser: (user) => {
    set({ user });
    saveUser(user);
  },
  updateUserSettings: (settings) =>
    set((state) => {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        settings: { ...state.user.settings, ...settings },
      };
      saveUser(updatedUser);
      return { user: updatedUser };
    }),
  addContact: (contact) =>
    set((state) => {
      const newContacts = [...state.contacts, contact];
      saveContacts(newContacts);
      return { contacts: newContacts };
    }),
  updateContact: (id, updates) =>
    set((state) => {
      const newContacts = state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      );
      saveContacts(newContacts);
      return { contacts: newContacts };
    }),
  removeContact: (id) =>
    set((state) => {
      const newContacts = state.contacts.filter((c) => c.id !== id);
      saveContacts(newContacts);
      return { contacts: newContacts };
    }),
  addTransaction: (transaction) =>
    set((state) => {
      const newTransactions = [...state.transactions, transaction];
      saveTransactions(newTransactions);
      return { transactions: newTransactions };
    }),
  updateTransaction: (id, updates) =>
    set((state) => {
      const newTransactions = state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      );
      saveTransactions(newTransactions);
      return { transactions: newTransactions };
    }),
  removeTransaction: (id) =>
    set((state) => {
      const newTransactions = state.transactions.filter((t) => t.id !== id);
      saveTransactions(newTransactions);
      return { transactions: newTransactions };
    }),
  logout: () => {
    set({ user: null, transactions: [], contacts: [] });
    saveUser(null);
    saveTransactions([]);
    saveContacts([]);
  },
}));