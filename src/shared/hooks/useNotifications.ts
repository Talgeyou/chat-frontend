import { useCallback, useEffect, useRef } from 'react';

export function useNotifications() {
  const hasNotification =
    typeof window !== 'undefined' && 'Notification' in window;
  useEffect(() => {
    if (hasNotification) {
      Notification.requestPermission();
    }
  }, [hasNotification]);

  const showNotification = useCallback(
    (text: string) => {
      if (hasNotification && !document.hasFocus()) {
        new Notification(text);
      }
    },
    [hasNotification],
  );

  return showNotification;
}
