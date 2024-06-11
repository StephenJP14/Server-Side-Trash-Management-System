import express from 'express';
import cors from "cors";
import Route from './routes/route.js'

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(Route);

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at port: ${port}`);
});

