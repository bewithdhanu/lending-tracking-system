import React from 'react';
import { Edit, Trash2, Power } from 'lucide-react';
import { Contact } from '../../types';
import { usePagination } from '../../hooks/usePagination';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../common/Pagination';

interface ContactsListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onToggleStatus: (contactId: string, isDisabled: boolean) => void;
}

export function ContactsList({
  contacts,
  onEdit,
  onDelete,
  onToggleStatus,
}: ContactsListProps) {
  const navigate = useNavigate();
  const {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(contacts);

  const getReferralName = (referralId?: string) => {
    if (!referralId) return null;
    const referral = contacts.find(c => c.id === referralId);
    return referral?.name;
  };

  const handleRowClick = (contact: Contact) => {
    if (!contact.isDisabled) {
      navigate('/history', { state: { contactId: contact.id } });
    }
  };

  const handleActionClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="bg-gray-50">
            <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
            <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred By</th>
            <th className="w-1/10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="w-1/10 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedItems.map((contact) => (
            <tr 
              key={contact.id}
              onClick={() => handleRowClick(contact)}
              className={`${contact.isDisabled ? 'bg-gray-50' : 'hover:bg-gray-50'} ${
                !contact.isDisabled ? 'cursor-pointer' : ''
              }`}
            >
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {contact.name}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-500 truncate">{contact.phone}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-500 truncate">
                  {contact.address}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-500 truncate">
                  {getReferralName(contact.referralId) || '-'}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  contact.isDisabled ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                }`}>
                  {contact.isDisabled ? 'Disabled' : 'Active'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => handleActionClick(e, () => onToggleStatus(contact.id, !!contact.isDisabled))}
                    className={`${
                      contact.isDisabled
                        ? 'text-gray-600 hover:text-gray-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                    title={contact.isDisabled ? 'Enable Contact' : 'Disable Contact'}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleActionClick(e, () => onEdit(contact))}
                    className={`text-blue-600 hover:text-blue-900 ${
                      contact.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Edit Contact"
                    disabled={contact.isDisabled}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleActionClick(e, () => onDelete(contact.id))}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Contact"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                No contacts yet. Click "Add Contact" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalItems > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}