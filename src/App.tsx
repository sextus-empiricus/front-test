import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SignUpForm } from "./pages/SignUpForm/";
import { RootProvider } from "./context";
import { PostsWall } from "./pages/PostsWall";

const App = () => {
  return (
    <RootProvider>
      <Navbar />
      <Routes>
      <Route path="/" element={<PostsWall />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </RootProvider>
  );
};

export default App;
