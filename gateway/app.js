const express = require('express');
const httpProxy = require('express-http-proxy');
const dotenv = require('dotenv');
const cors=require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use(cookieParser());

const PORT = 8000;

app.get('/',(req,res)=>{
    res.send('API Gateway is running')
})

app.use('/patient',httpProxy('http://localhost:8001'));

app.listen(PORT,()=>{
    console.log(`API Gateway is running on port ${PORT}`);
})
