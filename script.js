const express = require("express");
const axios = require("axios");
const _ = require("lodash");

const app = express();
const port = process.env.PORT || 3000;

let blogsData = null; // Initialize the variable to store blog data

// Fetch blog data when the server starts
async function fetchBlogData() {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    blogsData = response.data.blogs; // Store the fetched data in the variable
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }
}

// Call the fetchBlogData function to fetch data when the server starts
fetchBlogData();

// Middleware for making the API data available to routes
app.use((req, res, next) => {
  req.blogs = blogsData; // Make the blog data accessible to routes
  next();
});

// Data analysis middleware
app.use("/api/blog-stats", (req, res, next) => {
  const blogs = req.blogs;

  // Calculate the total number of blogs
  const totalBlogs = blogs.length;

  // Find the blog with the longest title
  const longestTitleBlog = _.maxBy(blogs, "title.length");

  // Determine the number of blogs with titles containing the word "privacy"
  const privacyBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes("privacy")
  );

  // Create an array of unique blog titles (no duplicates)
  const uniqueTitles = _.uniqBy(blogs, "title");

  // Respond with the statistics
  res.json({
    totalBlogs,
    longestTitle: longestTitleBlog.title,
    privacyBlogs: privacyBlogs.length,
    uniqueTitles: uniqueTitles.length,
  });
});

// Blog search endpoint
app.get("/api/blog-search", (req, res) => {
  const query = req.query.query.toLowerCase();
  const blogs = req.blogs;

  // Implement a case-insensitive search
  const searchResults = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(query)
  );

  res.json({ results: searchResults });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
