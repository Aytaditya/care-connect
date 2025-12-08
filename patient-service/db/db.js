const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const conectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to Patient Service database');
    } catch (error) {
        console.log('Error connecting to database',error);
    }
}

module.exports=conectDB;