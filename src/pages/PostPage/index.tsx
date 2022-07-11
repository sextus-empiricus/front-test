import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { client, getPost } from "../../queries";
import { Post } from "../../types";

const PostPage = () => {
  const [post, setPost] = useState<Post>();
  const [isLoading, setIsLoading] = useState(false);
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await client.query(getPost, { postId }).toPromise();
        setPost(response.data.postAddeds[0]);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div>
      {isLoading ? (
        <div>Loading</div>
      ) : post ? (
        <>
          {post && (
            <div
              style={{
                border: "solid black 2px",
                width: "400px",
                padding: "4px",
                margin: "4px",
              }}
            >
              <h4 style={{ fontWeight: "bold" }}>{post.postAdded_title}</h4>
              <p>{post.postAdded_content}</p>
              <br />
              username:
              <span style={{ fontWeight: "bold", margin: "4px" }}>
                {post.postAdded_username}
              </span>
              <span>
                {moment.unix(Number(post.postAdded_date)).format("DD/MM/YYYY")}
              </span>
            </div>
          )}
        </>
      ) : (
        <p>No post found</p>
      )}
    </div>
  );
};

export { PostPage };
