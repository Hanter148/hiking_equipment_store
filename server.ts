import express, { Request, Response } from 'express';
import path from 'path';

const app = express();

app.use(express.static("public"));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is starting...`);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Open your browser and visit http://localhost:${PORT}`);
});