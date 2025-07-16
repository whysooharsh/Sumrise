import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor.jsx";
import {api} from '../api';

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(response => {
        const postInfo = response.data;
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    try {
      await api.put(`/posts/${id}`, data);
      setRedirect(true);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Edit Post</h1>
      <form onSubmit={updatePost} className="space-y-6">
        <input 
          type="text"
          placeholder="Title"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-lg"
        />
        <input 
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={ev => setSummary(ev.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
        />
        <input 
          type="file"
          onChange={ev => setFiles(ev.target.files)}
          className="block w-full text-sm text-gray-500"
        />
        <Editor onChange={setContent} value={content} />
        <button 
          type="submit"
          className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
