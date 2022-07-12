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
          <div
            key={index}
            style={{
              border: "solid 2px black",
              cursor: "pointer",
              margin: "10px 0",
              width: "400px",
              padding: "1em",
            }}
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
              <span style={{ fontWeight: "bold" }}>{element.profileId}</span>
              <br />
              Username:
              <span style={{ fontWeight: "bold" }}>
                {element.memberData_username}
              </span>
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
