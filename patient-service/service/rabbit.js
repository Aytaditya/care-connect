const amqp=require('amqplib');
const dotenv=require('dotenv');
dotenv.config();
const RABBITMQ_URL=process.env.RABBIT_URL;

let connection,channel;

async function connect(){
    try {
        connection=await amqp.connect(RABBITMQ_URL);
        channel=await connection.createChannel();
        //console.log(RABBITMQ_URL)
        console.log("Connected to RabbitMQ successfully");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:",error); 
    }
}

async function subscribeToQueue(queueName,callback){
    if(!channel){
        await connect();
    }
    await channel.assertQueue(queueName,{durable:true});
    channel.consume(queueName,async(msg)=>{
        if(msg!==null){
            const content=msg.content.toString();
            await callback(content);
            channel.ack(msg);
        }
    });
}

async function publishToQueue(queueName,message){
    if(!channel){
        await connect();
    }
    await channel.assertQueue(queueName,{durable:true});
    channel.sendToQueue(queueName,Buffer.from(message));
}

module.exports={subscribeToQueue,publishToQueue,connect};