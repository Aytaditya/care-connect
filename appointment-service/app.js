const express=require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const appointmentRoute=require('./routes/appointment.route');
const connectDB=require('./db/db')
const {connect}=require('./service/rabbit');

const app=express();
const PORT=8003;

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use('/',appointmentRoute);

app.listen(PORT,'0.0.0.0',()=>{
    connectDB();
    connect();
    console.log(`Appointment Service is running on port ${PORT}`);
});