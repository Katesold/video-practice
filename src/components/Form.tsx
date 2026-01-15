import { useState } from "react";

export const Form = () => {
  const [edit, setEdit] = useState();

  const submitAction = (data: FormData) => {
    const test = data.get("test");
    console.log(data, "test", test);
  };

  return (
    <form action={submitAction} method="post">
      <label>
        <input name="test" type="text" placeholder="Type" />
        <button type="submit">Submit</button>
      </label>
    </form>
  );
};
