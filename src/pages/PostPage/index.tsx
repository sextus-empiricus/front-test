import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { client, getPost, getPostComments } from "../../queries";
import { RootContext } from "../../context";
import { Post, Comment } from "../../types";

const PostPage = () => {
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { postId } = useParams();
  const { rootContract, selectedUser } = useContext(RootContext);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      const tx = await rootContract.addComment(
        commentInput,
        postId,
        selectedUser
      );
      await tx.wait();
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await client.query(getPost, { postId }).toPromise();
        setPost(response.data.postAddeds[0]);
        if (response.data.postAddeds.length) {
          const responseComments = await client
            .query(getPostComments, { postId })
            .toPromise();
          setComments(responseComments.data.commentAddeds);
        }
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
              <div>Comments: {comments.length}</div>
              <br />
              Username:
              <Link to={`../profile/${post.postAdded_username}`}>
                <span style={{ fontWeight: "bold", margin: "4px" }}>
                  {post.postAdded_username}
                </span>
              </Link>
              <span>
                {moment.unix(Number(post.postAdded_date)).format("DD/MM/YYYY")}
              </span>
              {rootContract && selectedUser && (
                <form onSubmit={submitHandler} style={{ margin: "10px" }}>
                  <label>
                    Comment:
                    <input
                      name="comment"
                      type="text"
                      placeholder="Enter your comment"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                  </label>
                  <button>submit</button>
                </form>
              )}
              {comments && (
                <div>
                  {comments.map((comment: Comment, index: number) => (
                    <div key={index} style={{ fontSize: "12px" }}>
                      <p>{comment.commentAdded_content}</p>
                      <p style={{ fontWeight: "bold" }}>
                        <Link
                          to={`../profile/${comment.commentAdded_username}`}
                        >
                          {comment.commentAdded_username}{" "}
                        </Link>
                        <span>
                          {moment
                            .unix(Number(comment.commentAdded_date))
                            .format("DD/MM/YYYY")}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
