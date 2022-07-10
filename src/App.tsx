import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SignUpForm } from "./pages/SignUpForm/";
import { PostsWall } from "./pages/PostsWall";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PostsWall />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </>
  );
};

export default App;
