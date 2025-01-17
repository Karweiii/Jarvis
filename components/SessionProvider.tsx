'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SessionData = {
  userId?: string;
  role?: string;
  // Add other session properties as needed
};

const SessionContext = createContext<{
  session: SessionData | null;
  setSession: React.Dispatch<React.SetStateAction<SessionData | null>>;
}>({ session: null, setSession: () => {} });

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/session');
        const sessionData = await response.json();
        setSession(sessionData);
      } catch (error) {
        console.error('Failed to fetch session:', error);
      }
    }
    fetchSession();
  }, []);

  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
