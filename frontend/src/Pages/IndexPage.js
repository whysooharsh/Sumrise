import { useEffect, useContext } from "react";
import axios from "axios";
import { PostsContext } from "../PostsContext";

export default function IndexPage() {
  const { posts, setPosts } = useContext(PostsContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs", {
          withCredentials: true,
          headers: {
            "Authorization": `Bearer ${document.cookie.split('=')[1]}`,
          },
        });
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error.response ? error.response.data : error.message);
      }
    };
    fetchPosts();
  }, [setPosts]);

  return (
    <div className="index-page">
      <h1>All Posts</h1>
      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <a href={`/posts/${post._id}`}>Read More</a>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}
