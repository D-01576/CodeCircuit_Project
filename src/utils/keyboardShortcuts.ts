import { useEffect } from 'react';

export type ShortcutHandler = (event: KeyboardEvent) => void;

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  handler: ShortcutHandler;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.shiftKey === event.shiftKey &&
          !!shortcut.altKey === event.altKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const defaultShortcuts: Shortcut[] = [
  {
    key: 'Space',
    description: 'Flip card',
    handler: () => {},
  },
  {
    key: '1',
    description: 'Mark as difficult',
    handler: () => {},
  },
  {
    key: '2',
    description: 'Mark as good',
    handler: () => {},
  },
  {
    key: '3',
    description: 'Mark as easy',
    handler: () => {},
  },
  {
    key: 'n',
    description: 'Next card',
    handler: () => {},
  },
  {
    key: 'p',
    description: 'Previous card',
    handler: () => {},
  },
  {
    key: 'm',
    description: 'Toggle mute',
    handler: () => {},
  },
  {
    key: 'h',
    description: 'Show/hide hints',
    handler: () => {},
  },
  {
    key: 's',
    description: 'Skip card',
    handler: () => {},
  },
  {
    key: 'r',
    description: 'Reset progress',
    handler: () => {},
  },
  {
    key: '?',
    description: 'Show shortcuts help',
    handler: () => {},
  },
];

export const getShortcutDescription = (shortcut: Shortcut): string => {
  const modifiers = [];
  if (shortcut.ctrlKey) modifiers.push('Ctrl');
  if (shortcut.shiftKey) modifiers.push('Shift');
  if (shortcut.altKey) modifiers.push('Alt');
  
  const key = shortcut.key === ' ' ? 'Space' : shortcut.key;
  return [...modifiers, key].join(' + ');
};

export const formatShortcutsForDisplay = (shortcuts: Shortcut[]): string => {
  return shortcuts
    .map(shortcut => `${getShortcutDescription(shortcut)}: ${shortcut.description}`)
    .join('\n');
}; 