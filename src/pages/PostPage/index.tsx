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
            <div className="border-solid border-2 border-black w-1/3 p-4 m-auto mb-4 mt-4 rounded-md">
              <h4 className="font-bold">{post.postAdded_title}</h4>
              <p>{post.postAdded_content}</p>
              <div>Comments: {comments.length}</div>
              <br />
              Username:
              <Link to={`../profile/${post.postAdded_username}`}>
                <span className="font-bold m-4">{post.postAdded_username}</span>
              </Link>
              <span>
                {moment.unix(Number(post.postAdded_date)).format("DD/MM/YYYY")}
              </span>
              {rootContract && selectedUser && (
                <form
                  onSubmit={submitHandler}
                  className="flex m-auto mt-4 mb-4 g-4 w-3/4 border-solid border-black border-2 rounded-md p-4"
                >
                  <label>
                    Comment:
                    <input
                      name="comment"
                      type="text"
                      placeholder="Enter your comment"
                      className="border-solid border-2 rounded-md m-2"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                  </label>
                  <button className="bg-lime-400 m-2 p-1 border-solid border-black border-2 rounded-md">
                    Add
                  </button>
                </form>
              )}
              {comments && (
                <div>
                  {comments.map((comment: Comment, index: number) => (
                    <div key={index} className="text-xs">
                      <p>{comment.commentAdded_content}</p>
                      <p className="font-bold">
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
