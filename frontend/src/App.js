import './App.css';
import Post from "./Post";
import Header from "./Header";
import {Route, Routes} from "react-router-dom";
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import Layout from "./Layout";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element = {<IndexPage />} />
          <Route path = {'/login'} element = {<LoginPage/>}/>

        </Route>
      </Routes>
  );
}

export default App;