import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs", {
        withCredentials: true,
      });
      console.log("Fetched posts:", response.data);
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err.message, err.response?.data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPosts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
};
