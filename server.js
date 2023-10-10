const express = require("express");
const _ = require("lodash");

const app = express();
let blogsData = null;

async function fetchData() {
  try {
    if (!blogsData) {
      const response = await fetch(
        "https://intent-kit-16.hasura.app/api/rest/blogs",
        {
          method: "GET",
          headers: {
            "x-hasura-admin-secret":
              "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Can't fetch api data");
      }

      blogsData = await response.json();
    }
    return blogsData;
  } catch (err) {
    console.log(err);
  }
}

async function memoizedFetchData() {
  if (!memoizedFetchData.cache) {
    console.log("Data fetch check"); //flag to check if data is being fetched or not
    memoizedFetchData.cache = await fetchData();
  }
  return memoizedFetchData.cache;
}

app.use(async (req, res, next) => {
  let x = await memoizedFetchData();
  req.blogs = x["blogs"];
  next();
});

app.use("/api/blog-stats", async (req, res, next) => {
  const blog_list = req.blogs;

  //for maximum length of blog title
  const longestTitleBlog = _.maxBy(blog_list, "title.length");

  //to filter blogs with 'privacy' in title
  const privacyBlogs = blog_list.filter((value) =>
    value.title.toLowerCase().includes("privacy")
  );

  //total blogs with unique title
  const uniqTitles = _.uniqBy(blog_list, "title");

  res.json({
    totalBlogs: blog_list.length,
    longestTitle: longestTitleBlog.title,
    privacyBlogs: privacyBlogs.length,
    blogsWithUniqueTitles: uniqTitles,
  });
});

app.get("/api/blog-search", (req, res) => {
  const keyword = req.query.query.toLowerCase();
  const blog_list = req.blogs;

  const search = blog_list.filter((value) =>
    value.title.toLowerCase().includes(keyword)
  );

  if (search.length === 0) {
    res.send("NO Blogs found!");
  } else {
    res.send({ results: search });
  }
});

app.listen(4000);
