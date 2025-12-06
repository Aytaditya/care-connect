const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to Doctor Service database');
    } catch (error) {
        console.log('Error connecting to Doctor Service database',error);
    }
}

module.exports=connectDB;