'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: 'Success', description: 'Logged in successfully.' });
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({ title: 'Error', description: 'Failed to sign in.', variant: 'destructive' });
    }
  };

  const firebaseSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Success', description: 'Logged out successfully.' });
    } catch (error) {
      console.error("Error signing out", error);
      toast({ title: 'Error', description: 'Failed to sign out.', variant: 'destructive' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut: firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
