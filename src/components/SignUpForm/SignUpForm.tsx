import React, { useState, useEffect, useRef } from "react";
import { encode } from "base-64";
import { ethers } from "ethers";
import Avatar from "boring-avatars";
import { client, getUserProfiles, checkUsername } from "../../queries";
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
  const [profileImage, setProfileImage] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const avatarRef = useRef();

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
    setErrorMessage("");
    try {
      const response = await client
        .query(checkUsername, { username: inputNameValue })
        .toPromise();
      setIsLoading(false);
      if (response.data.profileNFTMinteds.length) {
        setErrorMessage("Username already exists!");
        return;
      }
      /* @ts-ignore */
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        RootContract,
        signer
      );
      const tx = await contract.mintProfileNFT(inputNameValue, profileImage);
      await tx.wait();
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const response = await client
          .query(getUserProfiles, { address: user })
          .toPromise();
        setProfiles(response.data.profileNFTMinteds);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setIsLoading(false);
      }
    };
    if (user) {
      (async () => {
        await fetchProfiles();
      })();
    }
  }, [user]);

  useEffect(() => {
    if (avatarRef.current) {
      /* @ts-ignore */
      const svgNode = avatarRef.current.innerHTML;
      const svgStart = svgNode.indexOf("<svg");
      const svgEnd = svgNode.indexOf("</svg>") + 6;
      const svgResult = svgNode.substring(svgStart, svgEnd).toString();
      const encoded = encode(svgResult);
      setProfileImage(`data:image/svg+xml;base64,${encoded}`);
    }
  }, [inputNameValue]);

  if (!user) {
    return <button onClick={connect}>Connect</button>;
  }

  return (
    <div>
      {/* @ts-ignore */}
      <div ref={avatarRef}>
        <Avatar
          size={40}
          name={inputNameValue}
          variant="beam"
          colors={["#ffe30b", "#083e48", "#ffb53d", "#98f421", "#ff0000"]}
        />
      </div>
      <form onSubmit={submitHandler}>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={inputNameValue}
            onChange={(e) => setInputNameValue(e.target.value)}
          />
        </label>
        <button>submit</button>
      </form>
      {isLoading ? (
        <div>Loading</div>
      ) : profiles ? (
        profiles.map((element: Profile, index: number) => (
          <p key={index}>
            {element.memberData_profilePicture.includes("base64") && (
              <img
                src={element.memberData_profilePicture}
                alt={element.memberData_username}
              />
            )}
            id:
            <span style={{ fontWeight: "bold" }}>{element.profileId}</span>
            <br />
            username:
            <span style={{ fontWeight: "bold" }}>
              {element.memberData_username}
            </span>
          </p>
        ))
      ) : (
        <div>You don't have any profile please create one</div>
      )}
    </div>
  );
};

export { SignUpForm };
