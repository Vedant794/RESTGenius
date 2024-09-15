import express from 'express';
import router from './routes/restRoutes.js'
import path from 'path'
import ejs from 'ejs'
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname,'public'));

app.use('/nodeorm/customCode/',router);

app.listen(3000, () => console.log('Server running on port 3000'));
