import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface Profile {
  display_name: string;
  phone_number: string | null;
  tier: number;
  avatar_url: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (phoneNumber: string, pin: string, username: string) => Promise<{ error: any }>;
  signIn: (phoneNumber: string, pin: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Convert phone number to a pseudo-email for Supabase auth
const phoneToEmail = (phone: string) => `${phone}@opay.local`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, phone_number, tier, avatar_url")
      .eq("user_id", userId)
      .single();
    if (data) setProfile(data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (phoneNumber: string, pin: string, username: string) => {
    const email = phoneToEmail(phoneNumber);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pin,
      options: { data: { display_name: username, phone_number: phoneNumber } },
    });
    
    if (!error && data.user) {
      await supabase
        .from("profiles")
        .update({ phone_number: phoneNumber, display_name: username })
        .eq("user_id", data.user.id);
    }
    
    return { error };
  };

  const signIn = async (phoneNumber: string, pin: string) => {
    const email = phoneToEmail(phoneNumber);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pin });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
