const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to Appointment service database');
    }catch(error){
        console.error('MongoDB connection failed:',error.message);
    }
}
module.exports=connectDB;