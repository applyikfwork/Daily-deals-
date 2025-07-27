
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch(error) {
        console.error("Error signing in with email", error);
        throw error;
    }
  }

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
    } catch(error) {
        console.error("Error signing up with email", error);
        throw error;
    }
  }

  const firebaseSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Success', description: 'Logged out successfully.' });
      router.push('/signin');
    } catch (error) {
      console.error("Error signing out", error);
      toast({ title: 'Error', description: 'Failed to sign out.', variant: 'destructive' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: firebaseSignOut, signInWithEmail, signUpWithEmail }}>
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
