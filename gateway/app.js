const express = require('express');
const httpProxy = require('express-http-proxy');
const cors=require('cors');
const cookieParser = require('cookie-parser');

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

app.use('/patient',httpProxy('http://patient-service:8001'));
app.use('/doctor',httpProxy('http://doctor-service:8002'));

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`API Gateway is running on port ${PORT}`);
})
