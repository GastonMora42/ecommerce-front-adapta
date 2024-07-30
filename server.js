import express from 'express';
import webhookRouter from '@/pages/api/webhoock';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define the webhook route
app.use('/api', webhookRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
