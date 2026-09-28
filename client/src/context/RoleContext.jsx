import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  clearSelectedRole,
  // setSelectedRole,
} from "../api/client";

const RoleContext = createContext(null);

const STORAGE_KEY = "pravi.selected-role";

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(
    () =>
      sessionStorage.getItem(STORAGE_KEY) || "",
  );

  const setRole = (nextRole) => {
    const normalizedRole =
      nextRole.toLowerCase();

    sessionStorage.setItem(
      STORAGE_KEY,
      normalizedRole,
    );

    setRoleState(normalizedRole);
  };

  const clearRole = () => {
    clearSelectedRole();
    setRoleState("");
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      clearRole,
    }),
    [role],
  );

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error(
      "useRole must be used inside RoleProvider",
    );
  }

  return context;
}