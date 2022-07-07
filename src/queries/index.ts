import { createClient } from "urql";

const APIURL =
  "https://api.thegraph.com/subgraphs/id/QmbUrgfZtUB2xdjZV34HXhM19i9hQZcbSnVXppErTfbLh3";

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
