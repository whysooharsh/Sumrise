import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext.jsx";
import {Link} from 'react-router-dom';
import {api} from '../api';
import {backendUrl} from "../config";

export default function PostPage() {
  const [postInfo,setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();
  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(response => {
        setPostInfo(response.data);
      });
  }, [id]);

  if (!postInfo) return <div className="text-center py-20">
    <div className="text-gray-500">Loading...</div>
  </div>;

  return (
    <div>
      <h1 className="text-2xl font-medium text-black mb-4">{postInfo.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <span>by {postInfo.author.username}</span>
        <span>•</span>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      </div>
      {userInfo && userInfo.id === postInfo.author._id && (
        <div className="mb-6">
          <Link to={`/edit/${postInfo._id}`} className="text-gray-600 hover:text-black">
            Edit
          </Link>
        </div>
      )}
      {postInfo.cover && (
        <div className="mb-8">
          <img 
            src={`${backendUrl}/${postInfo.cover}`} 
            alt={postInfo.title}
            className="w-full rounded"
          />
        </div>
      )}
      <div 
        className="prose max-w-none" 
        dangerouslySetInnerHTML={{__html:postInfo.content}} 
      />
    </div>
  );
}