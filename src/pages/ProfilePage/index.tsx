import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useFetchProfile } from "../../hooks/useFetchProfile";
import { Post } from "../../types";
import { RootContext } from "../../context";

const ProfilePage = () => {
  const { username } = useParams();
  const { profile, posts, followers, follows, isLoading } =
    useFetchProfile(username);
  const { selectedUser, rootContract } = useContext(RootContext);

  const followUser = async () => {
    try {
      const tx = await rootContract.followProfile(
        Number(selectedUser),
        Number(profile?.profileId)
      );
      await tx.wait();
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading</div>
      ) : profile ? (
        <>
          <div
            style={{
              border: "solid 2px black",
              margin: "10px 0",
              width: "400px",
              padding: "1em",
            }}
          >
            <div>
              {profile.memberData_profilePicture.includes("base64") && (
                <img
                  src={profile.memberData_profilePicture}
                  alt={profile.memberData_username}
                />
              )}
              id:
              <span style={{ fontWeight: "bold" }}>{profile.profileId}</span>
              <br />
              Username:
              <span style={{ fontWeight: "bold" }}>
                {profile.memberData_username}
              </span>
              <div>Posts: {posts?.length}</div>
              <div>Followers: {followers?.length}</div>
              <div>Follows: {follows?.length}</div>
              {selectedUser &&
                selectedUser !== profile.profileId &&
                rootContract && (
                  <button
                    onClick={followUser}
                    disabled={followers.includes(selectedUser)}
                  >
                    {followers.includes(selectedUser)
                      ? "You Follow this Profile"
                      : "Follow"}
                  </button>
                )}
            </div>
          </div>
          {posts &&
            posts.map((element: Post, index: number) => (
              <div
                key={index}
                style={{
                  border: "solid black 2px",
                  width: "400px",
                  padding: "4px",
                  margin: "4px",
                }}
              >
                <Link to={`../post/${element.postAdded_id}`}>
                  <h4 style={{ fontWeight: "bold" }}>
                    {element.postAdded_title}
                  </h4>
                </Link>
                <p>{element.postAdded_content}</p>
                <p>Comments: {element.comments}</p>
                <br />
                Username:
                <Link to={`../profile/${element.postAdded_username}`}>
                  <span style={{ fontWeight: "bold", margin: "4px" }}>
                    {element.postAdded_username}
                  </span>
                </Link>
                <span>
                  {moment
                    .unix(Number(element.postAdded_date))
                    .format("DD/MM/YYYY")}
                </span>
              </div>
            ))}
        </>
      ) : (
        <p>No profile found</p>
      )}
    </div>
  );
};

export { ProfilePage };
