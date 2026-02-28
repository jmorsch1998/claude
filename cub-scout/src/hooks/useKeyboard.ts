import { useEffect } from 'react';

export function useKeyboard(
  onAction: (action: 'press' | 'release') => void,
  showToast: (msg: string) => void,
): void {
  useEffect(() => {
    function isInputFocused(): boolean {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || (el as HTMLElement).isContentEditable;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space') return;
      if (isInputFocused()) {
        if (!e.repeat) {
          showToast('Timer not triggered — focus is in a text field. Click outside or press Escape first.');
        }
        return;
      }

      e.preventDefault();
      if (e.repeat) return;
      onAction('press');
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.code !== 'Space') return;
      if (isInputFocused()) return;
      e.preventDefault();
      onAction('release');
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onAction, showToast]);
}
