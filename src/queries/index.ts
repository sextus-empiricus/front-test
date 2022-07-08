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
