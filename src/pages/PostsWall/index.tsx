import { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { client, getPosts, getPostComments } from "../../queries";
import { RootContext } from "../../context";
import { Post } from "../../types";

const PostsWall = () => {
  const [fetchedPosts, setFetchedPosts] = useState<Post[] | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterPosts, setFilterPosts] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { selectedUser, rootContract, profile } = useContext(RootContext);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    console.log(profile);
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
        setFetchedPosts(postsArray);
        setIsLoading(false);
      } catch (error) {
        console.error({ error });
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!filterPosts) {
      setPosts(fetchedPosts);
    } else {
      const filteredPosts = fetchedPosts?.filter((post: Post) => {
        const followsArray = profile?.follows?.join(" ");
        if (followsArray?.includes(post.postAdded_authorId)) {
          return true;
        }
        return false;
      });

      console.log(filteredPosts);
      if (filteredPosts) {
        setPosts([...filteredPosts]);
      } else {
        setPosts([]);
      }
    }
  }, [fetchedPosts, filterPosts, profile?.follows]);

  return (
    <div className="w-full pt-28">
      {selectedUser && (
        <div>
          <div className="w-1/2 m-auto">
            <h4 className="font-bold">Show Only Followed Authors Posts</h4>
            <input
              type="checkbox"
              onChange={() => setFilterPosts(!filterPosts)}
              checked={filterPosts}
            />
          </div>
          <form
            onSubmit={submitHandler}
            className="flex flex-col m-auto mb-4 g-4 w-1/3 border-solid border-black border-2 rounded-md p-4"
          >
            <h4 className="font-bold m-auto">Add new post: </h4>
            {errorMessage && <p className="text-red-400">{errorMessage}</p>}
            <label>Title:</label>
            <input
              name="title"
              type="text"
              className="border-solid border-2 rounded-md m-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Content:</label>
            <textarea
              name="content"
              value={content}
              className="border-solid border-2 rounded-md m-2"
              onChange={(e) => setContent(e.target.value)}
            />

            <button className="bg-lime-400 m-2 p-1 border-solid border-black border-2 rounded-md">
              submit
            </button>
          </form>
        </div>
      )}
      {isLoading ? (
        <div>Loading</div>
      ) : posts ? (
        posts.map((element: Post, index: number) => (
          <div
            key={index}
            className="border-solid border-black border-2 w-1/3 p-4 m-auto mb-4 rounded-md"
          >
            <Link to={`post/${element.postAdded_id}`}>
              <h4 className="font-bold">{element.postAdded_title}</h4>
            </Link>
            <p>{element.postAdded_content}</p>
            <p>Comments: {element.comments}</p>
            <br />
            Username:
            <Link to={`profile/${element.postAdded_username}`}>
              <span className="font-bold m-4">
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
