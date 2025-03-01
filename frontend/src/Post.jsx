import { Link } from "react-router-dom";
import { formatISO9075 } from 'date-fns';
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export default function Post({ _id, cover, title, author, createdAt, summary }) {
    return (
        
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={`${API_BASE_URL}/uploads/${cover}`} alt={title} />
                </Link>
            </div>

            <div className="text">
                <Link to={`/post/${_id}`}>
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
