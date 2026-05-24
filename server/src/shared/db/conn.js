import mongoose from 'mongoose';

const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb Connected!! HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('MongoDB Connection Failed!', error);
    process.exit(1);
  }
};

export default connectToDb;
