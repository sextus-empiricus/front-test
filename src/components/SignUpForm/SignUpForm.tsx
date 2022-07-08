import React, { ChangeEvent, useState, useEffect } from "react";
import { ethers } from "ethers";
import { client, getProfiles } from "../../queries";
import { contractAddress } from "../../consts/index";
import RootContract from "../../abi/Root.json";

interface Profile {
  memberData_profilePicture: string;
  memberData_username: string;
  profileId: string;
  __typename: string;
}

const SignUpForm = () => {
  const [inputNameValue, setInputNameValue] = useState<string>("");
  const [inputImageValue, setInputImageValue] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [user, setUser] = useState(null);

  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "username") {
      setInputNameValue(e.target.value);
    }
    if (e.target.name === "image") {
      setInputImageValue(e.target.value);
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    profileCreate();
  };

  const connect = async () => {
    /* @ts-ignore */
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setUser(accounts[0]);
  };

  const profileCreate = async () => {
    /* @ts-ignore */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, RootContract, signer);

    try {
      const tx = await contract.mintProfileNFT(inputNameValue, inputImageValue);
      await tx.wait();
    } catch (error) {
      console.error({ error });
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await client.query(getProfiles).toPromise();
      setProfiles(response.data.profileNFTMinteds);
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProfiles();
    })();
  }, []);

  if (!user) {
    return <button onClick={connect}>Connect</button>;
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={inputNameValue}
            onChange={inputOnChangeHandler}
          />
        </label>
        <label>
          Image:
          <input
            name="image"
            type="text"
            value={inputImageValue}
            onChange={inputOnChangeHandler}
          />
        </label>
        <button>submit</button>
      </form>
      {profiles &&
        profiles.map((el: Profile, i: number) => (
          <p key={i}>
            id:
            <span style={{ fontWeight: "bold" }}>{el.profileId}</span>
            <br />
            username:
            <span style={{ fontWeight: "bold" }}>{el.memberData_username}</span>
          </p>
        ))}
    </div>
  );
};

export { SignUpForm };
