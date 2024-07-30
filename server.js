import express from 'express';
import webhookRouter from '@/pages/api/webhoock';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', webhookRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
