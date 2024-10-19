import express from 'express';
import router from './routes/restRoutes.js'
import routerMain from './routes/mainRouting.js';
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import connectionSetUp from './db/connectionDb.js';
import cors from 'cors'

dotenv.config()

const PORT=process.env.PORT|3000
const URI="mongodb://localhost:27017/eazeApi"


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'client/')))

app.set('views', path.join(__dirname,'public'));

app.use('/nodeorm/customCode/',router);

app.use('/backend',routerMain)


const start=async()=>{
    try {
        await connectionSetUp(URI).then(()=>app.listen(PORT,()=>console.log(`Server Started at Port:${PORT}`))).catch((err)=>console.log(err))
    } catch (error) {
        console.log(error)
    }
}

start()
