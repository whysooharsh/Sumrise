import { useEffect, useState } from "react";
import axios from "axios"; 
import Post from "../Post";

export default function IndexPage(){
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async() => {
            try{
                const res = await axios.get('/posts', {
                    withCredentials: true,
                    headers: {
                        "Authorization": `Bearer ${document.cookie.split('=')[1]}` 
                    }
                });
                setPosts(res.data);
            }
            catch(error){
                console.log('Error fetching posts:', error);
            }
        };
        fetchPosts(); 
    }, []); 
    return (
       <div className="index-page">
        <h1>All Posts</h1>
        <div className="post-list">
            {posts.map((post)=> {
                return (
                    <div key={post._id} className="post-card">
                        <h2>{post.title}</h2>
                        <p>{post.summary}</p>
                        <a href={`/posts/${post._id}`}>Read More</a>
                    </div>
                );
            })}
        </div>
       </div>
    );
}

