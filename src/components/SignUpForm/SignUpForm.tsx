import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import Avatar from "boring-avatars";
import { client, getUserProfiles } from "../../queries";
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
    /* @ts-ignore */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, RootContract, signer);

    try {
      const tx = await contract.mintProfileNFT(inputNameValue, profileImage);
      await tx.wait();
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await client
          .query(getUserProfiles, { address: user })
          .toPromise();
        setProfiles(response.data.profileNFTMinteds);
        console.log(response);
      } catch (error) {
        console.error({ error });
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
      const base64 = btoa(unescape(encodeURIComponent(svgResult)));
      setProfileImage(`data:image/svg+xml;base64,${base64}`);
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
      {profiles &&
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
        ))}
    </div>
  );
};

export { SignUpForm };
