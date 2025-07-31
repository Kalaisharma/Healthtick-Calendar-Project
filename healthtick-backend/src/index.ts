import express from "express";
const app = express();
import router from './Router/Router';
import cors from 'cors';
app.use(express.json());
app.use(
  cors({
    origin: "https://healthtick-app.netlify.app/",
  })
);
app.use("/api",router );
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
