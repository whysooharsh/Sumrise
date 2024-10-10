import Landing from "./Pages/Landing";
import Homepage from "./Pages/Homepage";

import { BrowserRouter, Route,Routes } from "react-router-dom";
import './App.css';

const App=()=>{
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/Homepage" element={<Homepage/>}/>
        </Routes>
    </BrowserRouter>
  )


}
export default App
