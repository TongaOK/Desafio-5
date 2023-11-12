import mongoose from 'mongoose';

export const URI = "mongodb+srv://Tonga:Tonga@cluster0.5aeqq2q.mongodb.net/?retryWrites=true&w=majority" //Por algun motivo crashea si utilizo process.env.MONGODB_URI

export const init = async () => {
  try {
    
    await mongoose.connect(URI);
    console.log('Database connected 🚀');
  } catch (error) {
    console.error('Error to connect to database 😨:', error.message);
  }
} 
