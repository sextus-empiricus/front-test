import { useState, useEffect } from "react";
import {
  client,
  checkUsername,
  getAuthorPosts,
  getPostComments,
  getFollowers,
  getFollowed,
} from "../queries";
import { Post, Profile } from "../types";

const useFetchProfile = (username = "") => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [followers, setFollowers] = useState<string[]>([]);
  const [follows, setFollows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setIsLoading(true);
      try {
        const response = await client
          .query(checkUsername, { username })
          .toPromise();
        if (response.data.profileNFTMinteds.length) {
          setProfile(response.data.profileNFTMinteds[0]);
          const responsePosts = await client
            .query(getAuthorPosts, {
              authorId: response.data.profileNFTMinteds[0].profileId,
            })
            .toPromise();
          const postsArray: Post[] = [...responsePosts.data.postAddeds];
          postsArray.forEach((post, index) => {
            client
              .query(getPostComments, { postId: post.postAdded_id })
              .toPromise()
              .then(
                (data) =>
                  (postsArray[index].comments = data.data.commentAddeds?.length)
              );
          });
          setPosts(postsArray);

          const responseFollowers = await client
            .query(getFollowers, {
              authorId: response.data.profileNFTMinteds[0].profileId,
            })
            .toPromise();

          setFollowers(
            responseFollowers.data.profileFolloweds.map(
              (follower: any) => follower.follower
            )
          );

          const responseFollowed = await client
            .query(getFollowed, {
              authorId: response.data.profileNFTMinteds[0].profileId,
            })
            .toPromise();

          setFollows(
            responseFollowed.data.profileFolloweds.map(
              (followed: any) => followed.followed
            )
          );
        }
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setIsLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [username]);

  return { profile, posts, followers, follows, isLoading };
};

export { useFetchProfile };
