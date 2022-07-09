import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SignUpForm } from "./components/SignUpForm/SignUpForm";
import { RootProvider } from "./context";

const App = () => {
  return (
    <RootProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Landing page🚀</h1>} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </RootProvider>
  );
};

export default App;
