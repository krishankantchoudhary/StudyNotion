const express=require("express")
const app=express();

const profileRoutes=require("./routes/Profile");
const userRoutes=require("./routes/User");
const paymentsRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const dbConnect=require("./config/database");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const fileUpload=require("express-fileupload");
const {cloudinaryConnect}=require("./config/cloudinary");
const dotenv=require("dotenv");


dotenv.config();
const PORT=process.env.PORT || 4000;

//db connect
dbConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

//cloudinar connect
cloudinaryConnect();

//routes mount
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/payment",paymentsRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/reach", contactUsRoute);

//default routes

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is Up and running"
    })
})

//activate server
app.listen(PORT,()=>{
    console.log(`server activated on PORT no ${PORT}`)
})