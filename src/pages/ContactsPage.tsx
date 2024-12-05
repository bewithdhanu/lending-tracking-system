import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserPlus } from 'lucide-react';
import { ContactsModal } from '../components/contacts/ContactsModal';
import { ContactsList } from '../components/contacts/ContactsList';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '../types';

export function ContactsPage() {
  const { contacts, removeContact, updateContact } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | undefined>();
  const navigate = useNavigate();

  const viewTransactions = (contactId: string) => {
    navigate('/transactions', { state: { contactId } });
  };

  const toggleContactStatus = (contactId: string, isDisabled: boolean) => {
    updateContact(contactId, { isDisabled: !isDisabled });
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContactToEdit(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Contact
        </button>
      </div>

      <ContactsList
        contacts={contacts}
        onEdit={handleEditContact}
        onDelete={removeContact}
        onToggleStatus={toggleContactStatus}
        onViewTransactions={viewTransactions}
      />

      <ContactsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        contactToEdit={contactToEdit}
      />
    </div>
  );
}