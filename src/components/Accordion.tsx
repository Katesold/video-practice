import { useState } from "react";

type AccordionProps = {
  id: number;
  title: string;
  content: string;
};

export const Accordion = ({ data }: { data: AccordionProps[] }) => {
  const [isOpen, setIsOpen] = useState<{ [id: number]: boolean }>({});

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <h1>{item.title}</h1>
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
            }}
          >
            {isOpen[item.id] ? "Close" : "Open"}
          </button>
          {isOpen[item.id] && <p>{item.content}</p>}
        </div>
      ))}
    </div>
  );
};
