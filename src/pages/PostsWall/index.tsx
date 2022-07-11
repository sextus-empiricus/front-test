import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { client, getPosts, getPostComments } from "../../queries";
import { RootContext } from "../../context";
import { Link } from "react-router-dom";
import { Post, Comment } from "../../types";

const PostsWall = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { selectedUser, rootContract } = useContext(RootContext);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const tx = await rootContract.addPost(
        {
          title,
          content,
          picture: "",
          video: "",
        },
        Number(selectedUser)
      );
      await tx.wait();
    } catch (error) {
      console.error({ error });
      setErrorMessage(JSON.stringify(error));
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await client.query(getPosts).toPromise();
        const postsArray: Post[] = [...response.data.postAddeds];
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
      {selectedUser && (
        <form
          onSubmit={submitHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "4px",
            gap: "4px",
            width: "400px",
          }}
        >
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <label>Title:</label>
          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Content:</label>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button>submit</button>
        </form>
      )}
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
              margin: "4px",
            }}
          >
            <Link to={`post/${element.postAdded_id}`}>
              <h4 style={{ fontWeight: "bold" }}>{element.postAdded_title}</h4>
            </Link>
            <p>{element.postAdded_content}</p>
            <p>Comments: {element.comments}</p>
            <br />
            Username:
            <Link to={`profile/${element.postAdded_username}`}>
              <span style={{ fontWeight: "bold", margin: "4px" }}>
                {element.postAdded_username}
              </span>
            </Link>
            <span>
              {moment.unix(Number(element.postAdded_date)).format("DD/MM/YYYY")}
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
