import express from 'express';
import cors from "cors";
import UserRoute from './routes/UserRoute.js'

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

