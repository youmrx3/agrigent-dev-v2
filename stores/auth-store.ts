import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { seedInitialData } from "@/services/seed-service";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "farmer";
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

function mapUser(session: import("@supabase/supabase-js").User | null): User | null {
  if (!session) return null;
  const meta = session.user_metadata;
  return {
    id: session.id,
    email: session.email ?? "",
    name: meta?.name ?? session.email?.split("@")[0] ?? "",
    role: (meta?.role as "admin" | "farmer") ?? "farmer",
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({ user: mapUser(session.user), isAuthenticated: true, isInitialized: true });
        } else {
          set({ user: null, isAuthenticated: false, isInitialized: true });
        }
      },

      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);

        const mapped = mapUser(data.user ?? null);
        set({ user: mapped, isAuthenticated: !!mapped });

        if (data.user) {
          seedInitialData(data.user.id).catch(console.error);
        }
      },

      signup: async (email: string, password: string, name: string) => {
        // Use the server API route (bypasses Supabase rate limits)
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error ?? "Signup failed");
        }

        // Auto-login after successful admin creation
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);

        const mapped = mapUser(data.user ?? null);
        set({ user: mapped, isAuthenticated: !!mapped });

        if (data.user) {
          seedInitialData(data.user.id).catch(console.error);
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "agrigent-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
