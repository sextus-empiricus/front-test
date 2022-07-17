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
          <div className="border-solid border-2 border-black p-4 m-auto w-1/3 rounded-md">
            <div>
              {profile.memberData_profilePicture.includes("base64") && (
                <img
                  src={profile.memberData_profilePicture}
                  alt={profile.memberData_username}
                />
              )}
              id:
              <span className="font-bold">{profile.profileId}</span>
              <br />
              Username:
              <span className="font-bold">{profile.memberData_username}</span>
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
                className="border-solid border-2 border-black p-4 m-auto mt-4 mb-4 w-1/3 rounded-md"
              >
                <Link to={`../post/${element.postAdded_id}`}>
                  <h4 className="font-bold">{element.postAdded_title}</h4>
                </Link>
                <p>{element.postAdded_content}</p>
                <p>Comments: {element.comments}</p>
                <br />
                Username:
                <Link to={`../profile/${element.postAdded_username}`}>
                  <span className="font-bold m-4">
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
