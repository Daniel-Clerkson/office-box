"use client"
import { AiOutlineArrowLeft } from "react-icons/ai";

const ButtonGroup = () => {
  return (
    <>
      <div className="flex items-center gap-4 mt-2 mx-auto">
        <button
          aria-label="play_icon"
          className="hover:text-primary dark:hover:text-primary border-2 border-primary text-primary dark:text-neutral-200 hover:bg-gray-100 rounded-full p-3"
            
        >
          <AiOutlineArrowLeft className="text-xl " />
        </button>
        <button
          aria-label="play_icon"
          className="hover:text-primary dark:hover:text-primary border-2 border-primary text-primary dark:text-neutral-200 rotate-180  hover:bg-gray-100 rounded-full p-3"
            
        >
          <AiOutlineArrowLeft className="text-xl " />
        </button>
      </div>
    </>
  );
};

export default ButtonGroup;
