
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import cors from "cors";
const app = express()
dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port `);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
app.use(cors())
app.use(morgan('dev'))
app.use(express.json()) 
app.use('/api/v1/auth',authRoutes);



