import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use('/api', paymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
