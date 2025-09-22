import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // data is fresh for 5m
      gcTime: 30 * 60 * 1000,       // cache kept for 30m after unused
      retry: 2,
      refetchOnReconnect: true,
      refetchOnMount: false,        // don’t refetch if still fresh
      refetchOnWindowFocus: true,   // mapped to AppState below
    },
  },
});

// Tell RQ about connectivity (RN doesn’t have browser events)
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener(state => setOnline(!!state.isConnected))
);

// Tell RQ about app focus (foreground/background)
focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener('change', (state) => {
    handleFocus(state === 'active');
  });
  return () => sub.remove();
});