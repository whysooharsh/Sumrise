import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";
import {backendUrl} from './api';

export default function Post({_id,title,summary,cover,content,createdAt,author}) {
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Link to={`/post/${_id}`}>
            <h2 className="text-xl font-medium text-black hover:text-gray-600 mb-2">
              {title}
            </h2>
          </Link>
          <p className="text-gray-600 mb-3">{summary}</p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>by {author.username}</span>
            <span>•</span>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </div>
        </div>
        {cover && (
          <div className="w-20 h-20 flex-shrink-0">
            <Link to={`/post/${_id}`}>
              <img 
                src={`${backendUrl}/${cover}`} 
                alt={title}
                className="w-full h-full object-cover rounded"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
