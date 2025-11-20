"use client"

const BlogCard = () => {
  return (
    <div>
      <div className="relative m-10 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow">
        <a
          className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
          href="/"
        >
          <img
            src=""
            className="object-cover bg-slate-100 hover:opacity-70 w-full h-full shadow"
            alt=""
          />
          <span className="absolute top-0 left-0 m-2 rounded-full bg-primary px-2 py-1 text-center text-xs font-medium text-white">
            OfficeBox
          </span>
        </a>
        <div className="mt-4 px-5 pb-5">
          <a href="/">
            <h5 className="text-xl tracking-tight text-slate-900">
              Nike Air MX Super 2500 - Red
            </h5>
          </a>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-700 xl:line-clamp-3 line-clamp-2">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi
              quo quam voluptate exercitationem delectus sunt assumenda qui
              quaerat eaque reprehenderit, accusamus quibusdam alias omnis odit
              hic unde deleniti sit repellat!
            </p>
          </div>
          <a
            href="/"
            className="flex gap-1 items-center justify-center shadow rounded-full bg-slate-100 px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
