import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { site } from "../data/siteData.js";

const OwnerContext = createContext({ isOwner: false, login: () => false, logout: () => {} });

// Owner mode shows the "add" forms. This passcode check only hides the forms from casual
// visitors. It is not real security (see README note in siteData.js).
export function OwnerProvider({ children }) {
  const [isOwner, setIsOwner] = useState(() => {
    try {
      return localStorage.getItem("dojo_owner") === "1";
    } catch {
      return false;
    }
  });

  const login = useCallback((passcode) => {
    if (passcode !== site.ownerPasscode) return false;
    try {
      localStorage.setItem("dojo_owner", "1");
    } catch {
      /* ignore */
    }
    setIsOwner(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("dojo_owner");
    } catch {
      /* ignore */
    }
    setIsOwner(false);
  }, []);

  const value = useMemo(() => ({ isOwner, login, logout }), [isOwner, login, logout]);
  return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>;
}

export const useOwner = () => useContext(OwnerContext);
