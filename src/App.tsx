import { Route, Routes } from "react-router-dom";
import { PostsWall } from "./pages/PostsWall";
import { SignUpForm } from "./pages/SignUpForm/";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PostsWall />} />
      <Route path="/signup" element={<SignUpForm />} />
    </Routes>
  );
};

export default App;
