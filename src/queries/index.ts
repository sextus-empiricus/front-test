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
    memberData_username
  }
}`;

export const getPosts = `query PostAdded {
  postAddeds {
    postAdded_title
    postAdded_content
    postAdded_authorId
    postAdded_picture
    postAdded_video
    postAdded_date
  }
}`;
