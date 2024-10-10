import { useNavigate } from "react-router-dom";
import './Landing.css';
function Landing(){
    const navigate = useNavigate();
    return(
        <div>
            <div className="head">
            <h1 className = "heading">
            <span className="highlight">SUR</span>MISE</h1>
            </div>
            
        </div>
    )
};

export default Landing;