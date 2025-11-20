import React from "react";
import Header from "../components/Header";
import ErrorMessage from "../components/ErrorMessage";

const NotFound = () => {
  window.scrollTo({
    top: "0",
    behavior: "smooth",
  });
  return (
    <>
      <Header />
      <ErrorMessage />
    </>
  );
};

export default NotFound;
