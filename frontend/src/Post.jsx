import { Link } from "react-router-dom";
import { formatISO9075 } from 'date-fns';

export default function Post({ _id, cover, title, author, createdAt, summary }) {
    return (
        
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={`http://localhost:5000/uploads/${cover}`} alt={title} />
                </Link>
            </div>

            <div className="text">
                <Link to={`/posts/${_id}`}>
                    <h2>{title}</h2>
                </Link>

                <p className="detail">
                    <a className="author">{author.username}</a>
                    <time>{formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
