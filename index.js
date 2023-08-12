const express = require('express');
const dbConnect = require('./dbConnect')
const authRouter = require('./routes/authRouter');
const postsRouter = require('./routes/postsRouter');
const userRouter = require('./routes/userRouter');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require('cloudinary').v2;

dotenv.config('./.env');
const app = express();

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan('common'))
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin:'http://localhost:3000'
}));

app.use('/auth',authRouter);
app.use('/posts',postsRouter); 
app.use('/user',userRouter); 
app.get('/',(req, res)=>{
    res.status(200).send()
})

const PORT = process.env.PORT || 4001;
dbConnect();
app.listen(PORT,()=>{
    console.log(`Server is listening on PORT: ${PORT}`);
})