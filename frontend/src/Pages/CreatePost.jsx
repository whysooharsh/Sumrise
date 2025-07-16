import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor.jsx";
import {api} from '../api';

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    try {
      await api.post('/posts', data);
      setRedirect(true);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  
  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Write a new post</h1>
      <form onSubmit={createNewPost} className="space-y-6">
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
        <Editor value={content} onChange={setContent} />
        <button 
          type="submit"
          className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
