import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { authenticateUser } from '../services/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  hasDeviceLockWarning: boolean;
  authenticate: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isAuthenticating: false,
  hasDeviceLockWarning: false,
  authenticate: async () => false,
});

const BACKGROUND_LOCK_THRESHOLD_MS = 30000; // 30 seconds

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [hasDeviceLockWarning, setHasDeviceLockWarning] = useState<boolean>(false);

  const backgroundTimestampRef = useRef<number | null>(null);
  const isAuthenticatingRef = useRef<boolean>(false);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (isAuthenticatingRef.current) return false;

    isAuthenticatingRef.current = true;
    setIsAuthenticating(true);

    try {
      const result = await authenticateUser();
      if (result.success) {
        if (result.error === 'NO_DEVICE_LOCK') {
          setHasDeviceLockWarning(true);
        }
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } finally {
      isAuthenticatingRef.current = false;
      setIsAuthenticating(false);
    }
  }, []);

  // Initial prompt on launch
  useEffect(() => {
    const timer = setTimeout(() => {
      authenticate();
    }, 150);
    return () => clearTimeout(timer);
  }, [authenticate]);

  // AppState listener for 30s background relock
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        backgroundTimestampRef.current = Date.now();
      } else if (nextState === 'active') {
        const bgTime = backgroundTimestampRef.current;
        if (bgTime && Date.now() - bgTime >= BACKGROUND_LOCK_THRESHOLD_MS) {
          setIsAuthenticated(false);
          // Prompt automatically on return
          setTimeout(() => {
            authenticate();
          }, 100);
        }
        backgroundTimestampRef.current = null;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [authenticate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        hasDeviceLockWarning,
        authenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
