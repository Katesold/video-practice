import "./App.css";

import { Accordion } from "./components/Accordion";
import { Form } from "./components/Form";
import reactLogo from "./assets/react.svg";
import { useState } from "react";
import viteLogo from "/vite.svg";

const values = [
  {
    id: 1,
    title: "What is React?",
    content: "React is a JavaScript library for building user interfaces.",
  },
  {
    id: 2,
    title: "What is React2?",
    content:
      "21222222 React is a JavaScript library for building user interfaces.",
  },
  {
    id: 3,
    title: "What is React3?",
    content:
      "2333232332 React is a JavaScript library for building user interfaces.",
  },
];

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Accordion data={values} />
        <Form />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
