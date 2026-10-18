import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
}

interface LocalUserRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
  created_at: string;
}

const DEFAULT_DEMO_USERS: LocalUserRecord[] = [
  {
    id: "usr_admin_001",
    username: "admin",
    name: "System Administrator",
    email: "admin@vendorplus.com",
    phone: "+919876543210",
    role: "admin",
    password: "password",
    created_at: new Date().toISOString(),
  },
  {
    id: "usr_shopowner_001",
    username: "shopkeeper",
    name: "Ramesh Sharma",
    email: "sharma@vendorplus.com",
    phone: "+918476003000",
    role: "shopowner",
    password: "password",
    created_at: new Date().toISOString(),
  },
  {
    id: "usr_customer_001",
    username: "customer",
    name: "Rahul Verma",
    email: "customer@vendorplus.com",
    phone: "+919876543211",
    role: "customer",
    password: "password",
    created_at: new Date().toISOString(),
  },
];

function getLocalUsers(): LocalUserRecord[] {
  if (typeof window === "undefined") return DEFAULT_DEMO_USERS;
  try {
    const raw = localStorage.getItem("vendorplus_local_users");
    if (!raw) {
      localStorage.setItem("vendorplus_local_users", JSON.stringify(DEFAULT_DEMO_USERS));
      return DEFAULT_DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as LocalUserRecord[]) : DEFAULT_DEMO_USERS;
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

function saveLocalUser(user: LocalUserRecord): void {
  if (typeof window === "undefined") return;
  const users = getLocalUsers();
  users.push(user);
  localStorage.setItem("vendorplus_local_users", JSON.stringify(users));
}

function saveCurrentSession(user: SupabaseUser | null, profile: Profile | null, session: Session | null): void {
  if (typeof window === "undefined") return;
  if (user && profile) {
    localStorage.setItem("vendorplus_current_session", JSON.stringify({ user, profile, session }));
  } else {
    localStorage.removeItem("vendorplus_current_session");
  }
}

function getSavedSession(): { user: SupabaseUser; profile: Profile; session: Session } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("vendorplus_current_session");
    if (!raw) return null;
    return JSON.parse(raw) as { user: SupabaseUser; profile: Profile; session: Session };
  } catch {
    return null;
  }
}

export function isNetworkError(err: unknown): boolean {
  if (!err) return false;
  if (typeof err === "string") {
    const s = err.toLowerCase();
    return s.includes("fetch") || s.includes("network") || s.includes("enotfound") || s.includes("load failed") || s.includes("offline") || s.includes("connection");
  }
  if (typeof err === "object" && err !== null) {
    const obj = err as Record<string, unknown>;
    const msg = String(obj.message || obj.error_description || obj.msg || "").toLowerCase();
    const code = String(obj.code || "").toLowerCase();
    const details = String(obj.details || "").toLowerCase();
    return (
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("fetch failed") ||
      msg.includes("enotfound") ||
      msg.includes("load failed") ||
      msg.includes("connection refused") ||
      code.includes("enotfound") ||
      details.includes("failed to fetch")
    );
  }
  return false;
}

function createMockUser(profile: Profile): SupabaseUser {
  return {
    id: profile.id,
    app_metadata: {},
    user_metadata: {
      name: profile.name,
      username: profile.username,
      phone: profile.phone,
    },
    aud: "authenticated",
    created_at: new Date().toISOString(),
    email: profile.email || "",
    phone: profile.phone || "",
    role: "authenticated",
    updated_at: new Date().toISOString(),
  };
}

function createMockSession(user: SupabaseUser): Session {
  return {
    access_token: `mock-token-${user.id}`,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: `mock-refresh-${user.id}`,
    user,
  };
}

export interface AuthResponse {
  success: boolean;
  role?: string;
  error?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  loginWithUsername: (username: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string, name: string, phone: string, username: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfileRole: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) {
        setProfile(data as Profile);
        return;
      }
    } catch {
      // offline
    }
    const localUsers = getLocalUsers();
    const found = localUsers.find((u) => u.id === userId);
    if (found) {
      setProfile({
        id: found.id,
        username: found.username,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: found.role,
      });
    }
  };

  useEffect(() => {
    const saved = getSavedSession();
    if (saved?.user && saved?.profile) {
      setUser(saved.user);
      setProfile(saved.profile);
      setSession(saved.session);
    }

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);
          setTimeout(() => fetchProfile(newSession.user.id), 0);
        } else if (!saved) {
          setProfile(null);
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      });

      supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          fetchProfile(initialSession.user.id);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        let role = "customer";
        try {
          const { data: prof } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
          if (prof?.role) role = prof.role;
        } catch {
          // ignore profile fetch error
        }
        return { success: true, role };
      }
      if (error && !isNetworkError(error)) {
        return { success: false, error: error.message };
      }
    } catch (err) {
      if (!isNetworkError(err)) {
        return { success: false, error: err instanceof Error ? err.message : "Login failed" };
      }
    }

    const localUsers = getLocalUsers();
    const found = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.password && found.password !== password) {
        return { success: false, error: "Invalid password" };
      }
      const mockProf: Profile = {
        id: found.id,
        username: found.username,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: found.role,
      };
      const mockU = createMockUser(mockProf);
      const mockS = createMockSession(mockU);
      saveCurrentSession(mockU, mockProf, mockS);
      setUser(mockU);
      setProfile(mockProf);
      setSession(mockS);
      return { success: true, role: found.role };
    }

    return { success: false, error: "Invalid email or password" };
  }, []);

  const loginWithUsername = useCallback(async (username: string, password: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email, role")
        .eq("username", username)
        .single();

      if (profileData?.email) {
        const { error } = await supabase.auth.signInWithPassword({ email: profileData.email, password });
        if (!error) return { success: true, role: profileData.role || "customer" };
        if (error && !isNetworkError(error)) {
          return { success: false, error: error.message };
        }
      } else if (profileError && !isNetworkError(profileError)) {
        return { success: false, error: "Username not found" };
      }
    } catch (err) {
      if (!isNetworkError(err)) {
        return { success: false, error: err instanceof Error ? err.message : "Login failed" };
      }
    }

    const localUsers = getLocalUsers();
    const found = localUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (found) {
      if (found.password && found.password !== password) {
        return { success: false, error: "Invalid password" };
      }
      const mockProf: Profile = {
        id: found.id,
        username: found.username,
        name: found.name,
        email: found.email,
        phone: found.phone,
        role: found.role,
      };
      const mockU = createMockUser(mockProf);
      const mockS = createMockSession(mockU);
      saveCurrentSession(mockU, mockProf, mockS);
      setUser(mockU);
      setProfile(mockProf);
      setSession(mockS);
      return { success: true, role: found.role };
    }

    return { success: false, error: "Username not found" };
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, phone: string, username: string) => {
    try {
      const { data: limitCheck, error: limitErr } = await supabase.rpc("check_account_limit", {
        check_email: email,
        check_phone: phone || null,
      });

      if (!limitErr) {
        const check = limitCheck as { allowed?: boolean; reason?: string } | null;
        if (check && !check.allowed) {
          return { success: false, error: check.reason };
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name, phone, username },
          },
        });
        if (!error) return { success: true, role: "customer" };
        if (error && !isNetworkError(error)) {
          return { success: false, error: error.message };
        }
      }
    } catch (err) {
      if (!isNetworkError(err)) {
        return { success: false, error: err instanceof Error ? err.message : "Signup failed" };
      }
    }

    // Local offline signup fallback
    const localUsers = getLocalUsers();
    if (localUsers.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "Username already exists" };
    }
    if (localUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }

    const newUserRecord: LocalUserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      username,
      name,
      email,
      phone,
      role: "customer",
      password,
      created_at: new Date().toISOString(),
    };
    saveLocalUser(newUserRecord);

    const mockProf: Profile = {
      id: newUserRecord.id,
      username: newUserRecord.username,
      name: newUserRecord.name,
      email: newUserRecord.email,
      phone: newUserRecord.phone,
      role: newUserRecord.role,
    };
    const mockU = createMockUser(mockProf);
    const mockS = createMockSession(mockU);
    saveCurrentSession(mockU, mockProf, mockS);
    setUser(mockU);
    setProfile(mockProf);
    setSession(mockS);

    return { success: true, role: "customer" };
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // offline
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    saveCurrentSession(null, null, null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (!error) return { success: true };
      if (error && !isNetworkError(error)) {
        return { success: false, error: error.message };
      }
    } catch (err) {
      if (!isNetworkError(err)) {
        return { success: false, error: err instanceof Error ? err.message : "Failed to reset password" };
      }
    }
    return { success: true };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) return { success: true };
      if (error && !isNetworkError(error)) {
        return { success: false, error: error.message };
      }
    } catch (err) {
      if (!isNetworkError(err)) {
        return { success: false, error: err instanceof Error ? err.message : "Failed to update password" };
      }
    }
    return { success: true };
  }, []);

  const updateProfileRole = useCallback(async (newRole: string) => {
    if (user) {
      try {
        await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
      } catch {
        // offline fallback
      }
      setProfile((prev) => (prev ? { ...prev, role: newRole } : null));
      if (typeof window !== "undefined") {
        const users = getLocalUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          users[idx].role = newRole;
          localStorage.setItem("vendorplus_local_users", JSON.stringify(users));
        }
        const saved = getSavedSession();
        if (saved) {
          saved.profile.role = newRole;
          localStorage.setItem("vendorplus_current_session", JSON.stringify(saved));
        }
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        login,
        loginWithUsername,
        signup,
        logout,
        resetPassword,
        updatePassword,
        updateProfileRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
