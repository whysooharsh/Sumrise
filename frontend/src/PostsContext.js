import { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs`, {
        withCredentials: true,
      });
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
