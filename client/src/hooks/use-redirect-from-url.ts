import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useRedirectFromUrl = (defaultTo = '/') => {
  const [searchParams] = useSearchParams();

  return useCallback(() => {
    window.location.href = searchParams.get('redirect')
      ? decodeURIComponent(searchParams.get('redirect') ?? '')
      : defaultTo;
  }, [searchParams, defaultTo]);
};
