import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext.jsx";
import {Link} from 'react-router-dom';
import {api} from '../api';
import {backendUrl} from "../api";

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
    <article className="max-w-none">
      
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {postInfo.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="font-medium">by {postInfo.author.username}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <time className="font-light">
            {formatISO9075(new Date(postInfo.createdAt))}
          </time>
        </div>
        {userInfo && userInfo.id === postInfo.author._id && (
          <div className="mb-6">
            <Link 
              to={`/edit/${postInfo._id}`} 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit post
            </Link>
          </div>
        )}
      </header>

      {postInfo.cover && (
        <div className="mb-12">
          <img 
            src={`${backendUrl}/${postInfo.cover}`} 
            alt={postInfo.title}
            className="w-full h-auto rounded-xl shadow-sm object-cover max-h-[500px]"
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div 
        className="prose prose-lg prose-gray max-w-none
                   prose-headings:text-gray-900 prose-headings:font-semibold
                   prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
                   prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                   prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-600
                   prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                   prose-pre:bg-gray-50 prose-pre:border
                   prose-img:rounded-lg prose-img:shadow-sm" 
        dangerouslySetInnerHTML={{__html:postInfo.content}} 
      />

      {/* Footer with social links */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 sm:mb-0">
            Written by <span className="font-medium">{postInfo.author.username}</span>
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/whysooharsh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com/in/harsharma45" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </article>
  );
}