import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | InsureCorp Portal`;
    return () => { document.title = prevTitle; };
  }, [title]);
}
