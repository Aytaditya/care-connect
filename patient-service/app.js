const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const patientRoutes = require('./routes/patients.routes');
const connectDB=require('./db/db')
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
}));
app.use(cookieParser());

const PORT = 8001;

app.use('/',patientRoutes)

app.listen(PORT,"0.0.0.0",()=>{
    connectDB();
    console.log(`Patient Service is running on port ${PORT}`);
})