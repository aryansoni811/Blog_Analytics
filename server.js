const express = require("express");
const _ = require("lodash");

const app = express();

app.get("/", async (req, res, next) => {
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
  const blogs = await response.json();
  const blog_list = blogs["blogs"];
  //for maximum length of blog title
  const longestTitleBlog = _.maxBy(blog_list, "title.length");
  //to filter blogs with 'privacy' in title
  const privacyBlogs = blog_list.filter((value) =>
    value.title.toLowerCase().includes("privacy")
  );
  //total blogs with unique title
  const uniqTitles = _.uniqBy(blog_list, "title");

  console.log(blog_list);
  res.json({
    totalBlogs: blog_list.length,
    longestTitle: longestTitleBlog.title,
    privacyBlogs: privacyBlogs.length,
    blogsWithUniqueTitles: uniqTitles.length,
  });
  req.blogs = blogs;
  next();
});

app.get("/api/blog-search", (req, res) => {
  const keyword = req.query.query.toLowerCase();
  const blogs = req.blogs; //this is a different route than the previous route, so it will not load
  console.log(blogs);
  res.send("hello world");
});

app.listen(3000);
