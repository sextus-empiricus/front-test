import React, { ChangeEvent, useState, useEffect } from "react";
import { client, getProfiles } from "../../queries";

const SignUpForm = () => {
  const [inputNameValue, setInputNameValue] = useState<string>("");
  const [inputImageValue, setInputImageValue] = useState<string>("");

  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "username") {
      setInputNameValue(e.target.value);
    }
    if (e.target.name === "image") {
      setInputImageValue(e.target.value);
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    console.log({ inputNameValue, inputImageValue });
  };

  const fetchProfiles = async () => {
    try {
      const response = await client.query(getProfiles).toPromise();
      console.log(response);
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={inputNameValue}
            onChange={inputOnChangeHandler}
          />
        </label>
        <label>
          Image:
          <input
            name="image"
            type="text"
            value={inputImageValue}
            onChange={inputOnChangeHandler}
          />
        </label>
        <button>submit</button>
      </form>
    </div>
  );
};

export { SignUpForm };
