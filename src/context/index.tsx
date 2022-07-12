import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Profile } from "../types/";

interface RootContextInterface {
  userAddress: string | null;
  selectedUser: string | null;
  selectedUsername: string | null;
  rootContract: any | null;
  profile: Profile | null;
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
  setSelectedUsername: Dispatch<SetStateAction<string | null>>;
  setUserAddress: Dispatch<SetStateAction<string | null>>;
  setRootContract: Dispatch<SetStateAction<any>>;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
}

export const RootContext = createContext<RootContextInterface>({
  userAddress: null,
  selectedUser: null,
  selectedUsername: null,
  rootContract: null,
  profile: null,
  setSelectedUser: () => {},
  setSelectedUsername: () => {},
  setUserAddress: () => {},
  setRootContract: () => {},
  setProfile: () => {},
});

export const RootProvider: React.FC<any> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [rootContract, setRootContract] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <RootContext.Provider
      value={{
        selectedUser,
        selectedUsername,
        userAddress,
        rootContract,
        profile,
        setSelectedUser,
        setSelectedUsername,
        setUserAddress,
        setRootContract,
        setProfile,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};
