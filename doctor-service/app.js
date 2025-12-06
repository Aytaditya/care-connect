const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const doctorRoutes = require('./routes/doctor.route');
const connectDB=require('./db/db')
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

const PORT = 8002;

app.use('/', doctorRoutes);
app.listen(PORT,()=>{
    connectDB()
    console.log(`Doctor Service is running on port ${PORT}`);
})