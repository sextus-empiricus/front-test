import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SignUpForm } from "./pages/SignUpForm/";
import { PostsWall } from "./pages/PostsWall";
import { ProfilePage } from "./pages/ProfilePage";
import { PostPage } from "./pages/PostPage";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PostsWall />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="profile/:username" element={<ProfilePage />} />
        <Route path="post/:postId" element={<PostPage />} />
      </Routes>
    </>
  );
};

export default App;
