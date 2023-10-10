const express = require("express");
const _ = require("lodash");

const app = express();
let blogsData = null;

async function fetchData() {
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
  blogsData = await response.json();
}

fetchData = _.memoize(fetchData);
fetchData();

app.use((req, res, next) => {
  x = blogsData;
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
