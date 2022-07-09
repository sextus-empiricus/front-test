import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

interface RootContextInterface {
  selectedUser: string | null;
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
}

export const RootContext = createContext<RootContextInterface>({
  selectedUser: null,
  setSelectedUser: () => {},
});

export const RootProvider: React.FC<any> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <RootContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </RootContext.Provider>
  );
};
