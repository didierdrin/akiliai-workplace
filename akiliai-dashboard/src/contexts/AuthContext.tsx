'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export interface AdminUser extends User {
  role: 'super_admin' | 'editor' | 'author';
  permissions: string[];
  department?: string;
  lastLogin?: Date;
  isActive: boolean;
}

interface AuthContextType {
  currentUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  createUser: (email: string, password: string, userData: Partial<AdminUser>) => Promise<void>;
  updateUserProfile: (userData: Partial<AdminUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user role and permissions from Firestore
      const userDoc = await getDoc(doc(firestore, 'admin_users', result.user.uid));
      if (!userDoc.exists()) {
        throw new Error('User not authorized for admin access');
      }
      
      const userData = userDoc.data();
      if (!userData.isActive) {
        throw new Error('Account is deactivated');
      }

      // Update last login
      await updateDoc(doc(firestore, 'admin_users', result.user.uid), {
        lastLogin: new Date(),
        lastIP: 'detected_ip' // In production, get actual IP
      });

      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const createUser = async (email: string, password: string, userData: Partial<AdminUser>) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, {
        displayName: userData.displayName || email.split('@')[0]
      });

      // Create admin user document
      await setDoc(doc(firestore, 'admin_users', result.user.uid), {
        email,
        role: userData.role || 'author',
        permissions: userData.permissions || ['read_articles', 'create_articles'],
        department: userData.department || '',
        createdAt: new Date(),
        isActive: true,
        displayName: userData.displayName || email.split('@')[0],
        createdBy: currentUser?.uid || result.user.uid // Use self as creator if no current user
      });

      toast.success('User created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<AdminUser>) => {
    if (!currentUser) return;

    try {
      // Update Firebase Auth profile
      if (userData.displayName) {
        await updateProfile(currentUser, {
          displayName: userData.displayName
        });
      }

      // Update Firestore document
      await updateDoc(doc(firestore, 'admin_users', currentUser.uid), {
        ...userData,
        updatedAt: new Date()
      });

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        try {
          // Get user role and permissions from Firestore
          const userDoc = await getDoc(doc(firestore, 'admin_users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              ...user,
              role: userData.role,
              permissions: userData.permissions,
              department: userData.department,
              lastLogin: userData.lastLogin?.toDate(),
              isActive: userData.isActive
            } as AdminUser);
          } else {
            // User exists in Auth but not in admin_users collection
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    resetPassword,
    createUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
