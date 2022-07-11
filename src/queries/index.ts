import { createClient } from "urql";

const APIURL =
  "https://api.thegraph.com/subgraphs/name/kowalewskipawel/root-protocol-tes1";

export const client = createClient({
  url: APIURL,
});

export const getProfiles = `query ProfileNFTMinted {
    profileNFTMinteds (first: 5) {
        profileId
        memberData_username
        memberData_profilePicture
    }
}`;

export const getUserProfiles = `query ProfileNFTMinted($address: String! ) {
  profileNFTMinteds (where: { sender: $address }) {
    profileId
    memberData_username
    memberData_profilePicture
  }
}`;

export const checkUsername = `query ProfileNFTMinted($username: String! ) {
  profileNFTMinteds (where: { memberData_username: $username }) {
    profileId
    memberData_username
    memberData_username
    memberData_profilePicture
  }
}`;

export const getPosts = `query PostAdded {
  postAddeds {
    postAdded_id
    postAdded_username
    postAdded_title
    postAdded_content
    postAdded_authorId
    postAdded_picture
    postAdded_video
    postAdded_date
  }
}`;

export const getPost = `query PostAdded ($postId: String! ) {
  postAddeds (where: { postAdded_id: $postId }) {
    postAdded_id
    postAdded_username
    postAdded_title
    postAdded_content
    postAdded_authorId
    postAdded_picture
    postAdded_video
    postAdded_date
  }
}`;

export const getAuthorPosts = `query PostAdded ($authorId: String! ) {
  postAddeds (where: { postAdded_authorId: $authorId }) {
    postAdded_id
    postAdded_username
    postAdded_title
    postAdded_content
    postAdded_authorId
    postAdded_picture
    postAdded_video
    postAdded_date
  }
}`;

export const getFollowers = `query ProfileFollowed ($authorId: String! ){
  profileFolloweds (where: { followed: $authorId }) {
    follower
  }
}`;

export const getFollowed = `query ProfileFollowed ($authorId: String! ){
  profileFolloweds (where: { follower: $authorId }) {
    followed
  }
}`;

export const getPostComments = `query commentAdded ($postId: String! ) {
  commentAddeds (where: { commentAdded_idOfPost: $postId }) {
    commentAdded_idOfPost
    commentAdded_content
    commentAdded_username
    commentAdded_authorId
    commentAdded_date
  }
}`;
