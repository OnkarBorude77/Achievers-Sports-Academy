import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../data/supabase.js";

const OwnerContext = createContext({
  isOwner: false,
  login: async () => ({ ok: false }),
  logout: async () => {},
});

// Owner mode = being signed in with the owner account created in Supabase.
// Even if someone opens the add forms by tricking the page, the database refuses their changes.
export function OwnerProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    if (!supabase) return { ok: false, error: "The database is not connected yet." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { ok: false, error: "Email or password is not correct." } : { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  const value = useMemo(() => ({ isOwner: Boolean(session), login, logout }), [session, login, logout]);
  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export const useOwner = () => useContext(OwnerContext);
