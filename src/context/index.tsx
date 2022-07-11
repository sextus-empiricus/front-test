import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

interface RootContextInterface {
  userAddress: string | null;
  selectedUser: string | null;
  selectedUsername: string | null;
  rootContract: any | null;
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
  setSelectedUsername: Dispatch<SetStateAction<string | null>>;
  setUserAddress: Dispatch<SetStateAction<string | null>>;
  setRootContract: Dispatch<SetStateAction<any>>;
}

export const RootContext = createContext<RootContextInterface>({
  userAddress: null,
  selectedUser: null,
  selectedUsername: null,
  rootContract: null,
  setSelectedUser: () => {},
  setSelectedUsername: () => {},
  setUserAddress: () => {},
  setRootContract: () => {},
});

export const RootProvider: React.FC<any> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [rootContract, setRootContract] = useState<string | null>(null);

  return (
    <RootContext.Provider
      value={{
        selectedUser,
        selectedUsername,
        userAddress,
        rootContract,
        setSelectedUser,
        setSelectedUsername,
        setUserAddress,
        setRootContract,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};
