export interface Profile {
  memberData_profilePicture: string;
  memberData_username: string;
  profileId: string;
  __typename: string;
}

export interface Post {
  postAdded_authorId: string;
  postAdded_username: string;
  postAdded_id: string;
  postAdded_content: string;
  postAdded_date: string;
  postAdded_picture: string;
  postAdded_title: string;
  postAdded_video: string;
  __typename: string;
}