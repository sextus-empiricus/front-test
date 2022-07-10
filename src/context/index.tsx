import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

interface RootContextInterface {
  userAddress: string | null;
  selectedUser: string | null;
  rootContract: any | null;
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
  setUserAddress: Dispatch<SetStateAction<string | null>>;
  setRootContract: Dispatch<SetStateAction<any>>;
}

export const RootContext = createContext<RootContextInterface>({
  userAddress: null,
  selectedUser: null,
  rootContract: null,
  setSelectedUser: () => {},
  setUserAddress: () => {},
  setRootContract: () => {},
});

export const RootProvider: React.FC<any> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [rootContract, setRootContract] = useState<string | null>(null);

  return (
    <RootContext.Provider
      value={{
        selectedUser,
        userAddress,
        rootContract,
        setSelectedUser,
        setUserAddress,
        setRootContract,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};
