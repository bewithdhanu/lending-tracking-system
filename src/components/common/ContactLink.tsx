import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface ContactLinkProps {
  contactId: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function ContactLink({ contactId, children, className, disabled }: ContactLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      // Scroll to top before navigation
      window.scrollTo(0, 0);
      
      // Navigate with a unique timestamp to force re-render
      navigate('/history', { 
        state: { contactId, timestamp: Date.now() },
        replace: true 
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'text-sm font-medium text-indigo-600 hover:text-indigo-900',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}