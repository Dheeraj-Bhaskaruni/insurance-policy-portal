import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey;
        const modMatch = ctrlOrMeta ? event.ctrlKey || event.metaKey : true;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;

        if (event.key.toLowerCase() === shortcut.key.toLowerCase() && modMatch && shiftMatch) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
