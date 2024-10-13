const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/register',(req,res)=>{
    const {username,password} = req.body;
    res.json({requestData:{username,password}});
})


app.listen(4000,()=>{
    console.log(`Server is running on port ${4000}`);
});