import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  User,
  onAuthStateChanged,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => {
  // Listen to auth state changes
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true,
    error: null,
    signUp: async (email: string, password: string, name: string) => {
      try {
        set({ error: null });
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);
        set({ user: userCredential.user });
      } catch (error) {
        set({ error: (error as Error).message });
        throw error;
      }
    },
    signIn: async (email: string, password: string) => {
      try {
        set({ error: null });
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        set({ user: userCredential.user });
      } catch (error) {
        set({ error: (error as Error).message });
        throw error;
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
        set({ user: null });
      } catch (error) {
        set({ error: (error as Error).message });
        throw error;
      }
    },
    updateUserProfile: async (name: string) => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        await updateProfile(user, { displayName: name });
        set({ user: auth.currentUser });
      } catch (error) {
        set({ error: (error as Error).message });
        throw error;
      }
    },
    updateUserPassword: async (currentPassword: string, newPassword: string) => {
      try {
        const user = auth.currentUser;
        if (!user || !user.email) throw new Error('No user logged in');

        // Re-authenticate user before password change
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        await updatePassword(user, newPassword);
      } catch (error) {
        set({ error: (error as Error).message });
        throw error;
      }
    },
    sendVerificationEmail: async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        await sendEmailVerification(user);
      } catch (error) {
        set({ error: (error as Error).message });
        throw error;
      }
    },
  };
});

export default useAuthStore;