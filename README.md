
# Blog Analytics with Express and Lodash

This is a simple application that serves as an API for a collection of blogs. The application provides endpoints to search for blogs by title, and retrieve statistics about the blogs. The data is fetched from an external source and is memoized for improved performance.


## Features

- **Fetching and Caching Data:** The application fetches blog data from an external API endpoint and caches it to minimize the number of external requests.

- **Blog Statistics:** The **'/api/blog-stats'** endpoint provides statistics about the blogs, including the total number of blogs, the title of the blog with the longest title, the number of blogs with "privacy" in their titles, and the number of blogs with unique titles.

- **Blog Search:** The **'/api/blog-search'** endpoint allows users to search for blogs by providing a query keyword. The API returns a list of blogs that include the query keyword in their titles.


## Installation

Install required dependencies 

```bash
  npm  install lodash express
```
start the express server
```bash
  node server.js
```

### Access the API endpoints:

- To fetch blog statistics, make a GET request to http://localhost:3000/api/blog-stats.
    
- To search for blogs, make a GET request to http://localhost:3000/api/blog-search?query=(yourQuery)
    
replace "yourQuery" with whatever you want to search with.
## Screenshots

![Blog stats](https://github.com/aryansoni811/Impulse_assignment/blob/master/public/screenshots/Screenshot%202023-10-11%20172906.png?raw=true)

![search_privacy](https://github.com/aryansoni811/Impulse_assignment/blob/master/public/screenshots/Screenshot%202023-10-11%20172920.png?raw=true)

![search_money](https://github.com/aryansoni811/Impulse_assignment/blob/master/public/screenshots/Screenshot%202023-10-11%20172938.png?raw=true)
