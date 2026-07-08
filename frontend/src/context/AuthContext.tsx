import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Turns Firebase's terse error codes into messages people can act on. */
function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "That email address looks invalid.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/network-request-failed": "Network error — check your connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  };
  return map[code] ?? (err instanceof Error ? err.message : "Something went wrong. Please try again.");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const requireAuth = () => {
    if (!auth) {
      throw new Error(
        "Authentication isn't configured yet. Add your Firebase project keys to frontend/.env."
      );
    }
    return auth;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isFirebaseConfigured,
      signInWithGoogle: async () => {
        try {
          await signInWithPopup(requireAuth(), googleProvider);
        } catch (err) {
          throw new Error(friendlyAuthError(err));
        }
      },
      signUpWithEmail: async (name, email, password) => {
        try {
          const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
          if (name.trim()) {
            await updateProfile(cred.user, { displayName: name.trim() });
          }
        } catch (err) {
          throw new Error(friendlyAuthError(err));
        }
      },
      signInWithEmail: async (email, password) => {
        try {
          await signInWithEmailAndPassword(requireAuth(), email, password);
        } catch (err) {
          throw new Error(friendlyAuthError(err));
        }
      },
      resetPassword: async (email) => {
        try {
          await sendPasswordResetEmail(requireAuth(), email);
        } catch (err) {
          throw new Error(friendlyAuthError(err));
        }
      },
      updateDisplayName: async (name) => {
        const activeAuth = requireAuth();
        if (!activeAuth.currentUser) throw new Error("You must be signed in to do that.");
        try {
          await updateProfile(activeAuth.currentUser, { displayName: name.trim() });
          // updateProfile mutates currentUser in place but doesn't trigger a
          // re-render on its own — force one so the UI reflects the new name.
          setUser(Object.assign(Object.create(Object.getPrototypeOf(activeAuth.currentUser)), activeAuth.currentUser));
        } catch (err) {
          throw new Error(friendlyAuthError(err));
        }
      },
      logout: async () => {
        if (!auth) return;
        await signOut(auth);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
