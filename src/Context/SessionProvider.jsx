import { SessionContext } from "./SessionContext";

export function SessionProvider({ children }) {
  return (
    <SessionContext.Provider value={{}}>
      {children}
    </SessionContext.Provider>
  );
}