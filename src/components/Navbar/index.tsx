import React, { useContext } from "react";
import { RootContext } from "../../context";

const Navbar = () => {
  const { selectedUser } = useContext(RootContext);

  return (
    <div>
      <p>Selected User: {selectedUser}</p>
    </div>
  );
};

export { Navbar };
