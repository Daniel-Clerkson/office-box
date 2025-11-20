import React from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ScrollUp from "../components/ScrollUp";

const BlogPost = ({ data }) => {
  window.scrollTo({
    top: "0",
    behavior: "smooth",
  });
  const { id } = useParams(); // Extract the 'id' parameter using useParams

  const post = data.find((post) => post.id === parseInt(id));

  if (!post) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Header />
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow min-h-screen">
        <div className="w-full flex flex-col gap-6 justify-center items-center sm:px-10 section">
          <img
            src={post.image}
            alt={post.title}
            className="w-full  md:max-w-6xl rounded-3xl object-cover bg-center sm:h-120 h-80"
          />
          <div className="w-full  md:max-w-6xl">
            <h2 className="text-2xl w-full text-gray-700 dark:text-gray-100 text-center font-semibold my-3 underline">
              {post.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mt-2 w-full">
              {post.description}
            </p>
            <div className="mt-4 flex items-center">
              <img
                src={post.socialIcon}
                alt="Social Icon"
                className="w-6 h-6 mr-2"
              />
              <span className="text-gray-600">Share on social media</span>
            </div>
          </div>
          <Link
            to="/blog"
            className="flex gap-2 items-center justify-center shadow rounded-full bg-slate-100 dark:bg-gray-800 dark:text-gray-200 px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 mt-4"
          >
            <span>
              <AiOutlineArrowLeft className="text-md " />
            </span>
            Back to Blog{" "}
          </Link>
        </div>
      </div>
      <Footer />
      <ScrollUp />
    </>
  );
};

export default BlogPost;
