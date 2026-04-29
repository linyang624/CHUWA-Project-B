import mongoose from 'mongoose';
// Connect to MongoDB using the MONGO_URI from environment variables.
// If the connection fails, stop the server process.
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    }
    catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }   
};

export default connectDB;