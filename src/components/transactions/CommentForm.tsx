import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (comment: string) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label htmlFor="comment" className="sr-only">
        Add comment
      </label>
      <div className="flex items-start space-x-4">
        <div className="min-w-0 flex-1">
          <textarea
            id="comment"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <div className="flex-shrink-0">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Comment
          </button>
        </div>
      </div>
    </form>
  );
}