import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollReset() {
  const { pathname, state, search } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame to ensure scroll happens after render
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    });
  }, [pathname, state, search]);

  return null;
}