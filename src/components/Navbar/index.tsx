import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { RootContext } from "../../context";
import { contractAddress } from "../../consts/index";
import RootContract from "../../abi/Root.json";

const Navbar = () => {
  const { selectedUsername, userAddress, setUserAddress, setRootContract } =
    useContext(RootContext);

  const connect = async () => {
    /* @ts-ignore */
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setUserAddress(accounts[0]);
    /* @ts-ignore */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, RootContract, signer);
    setRootContract(contract);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      {selectedUsername && <p>Logged as: {selectedUsername}</p>}
      <div>
        {userAddress ? (
          <button>{`Signed in ${userAddress.slice(0, 4)}...${userAddress.slice(
            38,
            42
          )}`}</button>
        ) : (
          <button onClick={connect}>Connect Wallet</button>
        )}
      </div>
      <Link to="/">Posts</Link>
      <Link to="/signup">Sign up</Link>
      {selectedUsername && (
        <Link to={`profile/${selectedUsername}`}>Profile</Link>
      )}
    </div>
  );
};

export { Navbar };
