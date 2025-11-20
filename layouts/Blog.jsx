import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollUp from '../components/ScrollUp';
import BlogHero from '../components/BlogHero';
import { AiOutlineArrowRight } from 'react-icons/ai';

const Blog = ({ posts }) => {
	window.scrollTo({
		top: '0',
		behavior: 'smooth',
	});
	return (
		<>
			<div className="transition-all duration-300 dark:bg-gray-900">
				<Header />
				<BlogHero />
				<div className=" flex flex-col gap-4 lg:gap-10 justify-center w-full items-center section ">
					<div className="flex items-center justify-center px-5 w-full">
						<div className="w-full sm:max-w-3xl flex-col gap-6 lg:gap-10 flex justify-center items-center lg:max-w-5xl h-fit bg-gray-100 rounded-3xl dark:bg-gray-800 sm:py-10 py-5 px-4 sm:px-8">
							<div className="flex flex-col text-center justify-center items-center gap-2">
								<h1 className=" font-semibold text-base dark:text-gray-100">
									Want to get updates to your Inbox?
								</h1>
								<p className="text-xs sm:max-w-xl w-full dark:text-gray-200">
									Whether you’re curious about our co-working space,
									communities, events, or even the simplest banking operations –
									Get first-hand updates to your inbox.
								</p>
							</div>
							<form
								action=""
								className="hero__from flex flex-col gap-3 md:flex-row xl:max-w-xl w-full"
							>
								<input
									type="email"
									required
									placeholder="Enter email address"
									className="hero__from-input h-[52px] w-full rounded-full border border-gray-300 px-4 text-center font-semibold text-gray-900 outline-none transition-all duration-300 placeholder:text-[15px] placeholder:font-normal placeholder:text-gray-600 dark:border-none dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 md:text-left"
								/>

								<button className="hero__from-button  flex h-[52px] items-center justify-center rounded-full w-full md:w-fit  bg-primary hover:bg-secondary  py-4 px-8 font-sans text-[15px] font-semibold capitalize text-white">
									Subscribe
								</button>
							</form>
						</div>
					</div>
					<div className="flex gap-4 lg:gap-10 sm:flex-row flex-wrap flex-col justify-center items-center w-full font-dm relative transition-all duration-300 dark:bg-gray-900">
						{posts.map((post) => (
							<div
								key={post.id}
								className="relative flex w-full h-fit max-w-lg flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white dark:border-gray-700 dark:text-white dark:bg-gray-900 shadow"
							>
								<Link
									className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
									to={`/blog/${post.id}`}
								>
									<img
										src={post.image}
										alt={post.title}
										className="object-cover bg-slate-100 hover:opacity-70 w-full h-full shadow"
									/>
									<span className="absolute top-0 left-0 m-2 rounded-full bg-primary px-2 py-1 text-center text-xs font-medium text-white">
										OfficeBox
									</span>
								</Link>
								<div className="mt-4 px-5 pb-5">
									<Link to={`/blog/${post.id}`}>
										<h5 className="text-xl tracking-tight font-semibold text-slate-900  dark:text-gray-100">
											{post.title}
										</h5>
									</Link>
									<div className="mt-2 mb-5 flex items-center justify-between">
										<p className="text-sm text-gray-700  dark:text-gray-200 xl:line-clamp-3 line-clamp-2">
											{post.description}
										</p>
									</div>
									<Link
										to={`/blog/${post.id}`}
										className="flex gap-2 items-center justify-center shadow rounded-full bg-slate-100 dark:bg-gray-800 dark:text-gray-200 px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
									>
										Read More{' '}
										<span>
											<AiOutlineArrowRight className="text-md " />
										</span>
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
				<Footer />
				<ScrollUp />
			</div>
		</>
	);
};

export default Blog;
