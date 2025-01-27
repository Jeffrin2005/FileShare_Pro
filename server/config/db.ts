import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
         console.log("Database connected");
            
    } catch (error) {
        console.log("Connection Error ", error);
    }
    const connection = mongoose.connection;
    if(connection.readyState>=1){
        console.log("connected to database");
        return;
    }
    connection.on("error", () => console.log("connection failed"));
};

export default connectDB;