import React, { useState, useEffect, useRef, useContext } from "react";
import { encode } from "base-64";
import Avatar from "boring-avatars";
import {
  client,
  getUserProfiles,
  getFollowed,
  checkUsername,
} from "../../queries";
import { RootContext } from "../../context";
import { Profile } from "../../types";

const SignUpForm = () => {
  const [inputNameValue, setInputNameValue] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    userAddress,
    rootContract,
    setSelectedUser,
    setSelectedUsername,
    setProfile,
  } = useContext(RootContext);
  const avatarRef = useRef();

  const submitHandler = (e: any) => {
    e.preventDefault();
    profileCreate();
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

      const tx = await rootContract.mintProfileNFT(
        inputNameValue,
        profileImage
      );
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
          .query(getUserProfiles, { address: userAddress })
          .toPromise();
        const addressProfiles = response.data.profileNFTMinteds;

        addressProfiles.forEach((profile: Profile, index: number) => {
          client
            .query(getFollowed, {
              authorId: profile.profileId,
            })
            .toPromise()
            .then(
              (data) =>
                (addressProfiles[index].follows = [
                  data.data.profileFolloweds.map(
                    (followed: any) => followed.followed
                  ),
                ])
            );
        });

        setProfiles(addressProfiles);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setIsLoading(false);
      }
    };
    if (userAddress) {
      (async () => {
        await fetchProfiles();
      })();
    }
  }, [userAddress]);

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

  if (!userAddress) {
    return <p>Please Connect Wallet to login</p>;
  }

  return (
    <div>
      <form
        onSubmit={submitHandler}
        className="border-solid border-2 border-black p-4 m-auto mb-4 w-1/3 rounded-md"
      >
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {/* @ts-ignore */}
        <div ref={avatarRef} className="m-auto mb-4 mt-4 w-1/3 flex">
          <Avatar
            size={40}
            name={inputNameValue}
            variant="beam"
            colors={["#ffe30b", "#083e48", "#ffb53d", "#98f421", "#ff0000"]}
          />
          <p className="ml-4">Avatar for: {inputNameValue}</p>
        </div>
        <div className="w-1/2 m-auto">
          <label htmlFor="username" className="ml-2">
            Username:
          </label>
          <input
            name="username"
            type="text"
            value={inputNameValue}
            className="border-solid border-2 rounded-md m-2"
            onChange={(e) => setInputNameValue(e.target.value)}
          />
          <button className="bg-lime-400 p-1 border-solid border-black border-2 rounded-md">
            CREATE
          </button>
        </div>
      </form>
      {isLoading ? (
        <div>Loading</div>
      ) : profiles ? (
        profiles.map((element: Profile, index: number) => (
          <div
            key={index}
            className="border-solid border-2 border-black p-4 m-auto w-1/3 rounded-md cursor-pointer"
            onClick={() => {
              setSelectedUser(element.profileId);
              setSelectedUsername(element.memberData_username);
              setProfile(element);
            }}
          >
            <p>
              {element.memberData_profilePicture.includes("base64") && (
                <img
                  src={element.memberData_profilePicture}
                  alt={element.memberData_username}
                />
              )}
              id:
              <span className="font-bold">{element.profileId}</span>
              <br />
              Username:
              <span className="font-bold">{element.memberData_username}</span>
            </p>
          </div>
        ))
      ) : (
        <div>You don't have any profile please create one</div>
      )}
    </div>
  );
};

export { SignUpForm };
