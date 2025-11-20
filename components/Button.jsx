"use client"

const Button = ({ children, className }) => {
  return (
    <button
      className={
        `flex h-[52px] items-center justify-center rounded-lg   bg-primary hover:bg-secondary  py-4 px-8 font-sans text-[15px] font-semibold capitalize text-white`.concat(
          " "
        ) + className
      }
    >
      {children}
    </button>
  );
};

export default Button;
