import React, { useState, useEffect } from "react";
import moment from "moment";
import { client, getPosts } from "../../queries";

interface Post {
  postAdded_authorId: string;
  postAdded_content: string;
  postAdded_date: string;
  postAdded_picture: string;
  postAdded_title: string;
  postAdded_video: string;
  __typename: string;
}

const PostsWall = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await client.query(getPosts).toPromise();
        setPosts(response.data.postAddeds);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ width: "50vw", margin: "auto" }}>
      {isLoading ? (
        <div>Loading</div>
      ) : posts ? (
        posts.map((element: Post, index: number) => (
          <div
            key={index}
            style={{
              border: "solid black 2px",
              width: "400px",
              padding: "4px",
            }}
          >
            <h4 style={{ fontWeight: "bold" }}>{element.postAdded_title}</h4>
            <p>{element.postAdded_content}</p>
            <br />
            username:
            <span style={{ fontWeight: "bold", margin: "4px" }}>
              {element.postAdded_authorId}
            </span>
            <span>
              {moment.unix(Number(element.postAdded_date)).format("MM/DD/YYYY")}
            </span>
          </div>
        ))
      ) : (
        <div>There are no posts to show</div>
      )}
    </div>
  );
};

export { PostsWall };
