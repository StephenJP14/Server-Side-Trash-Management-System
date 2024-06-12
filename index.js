import express from 'express';
import cors from "cors";
import Route from './routes/route.js';

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views')
app.use(cors());
app.use(express.json());
app.use(Route);

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at port: ${port}`);
});

