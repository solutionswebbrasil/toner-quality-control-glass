
import express from 'express';
import { setupRoutes } from './routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Setup API routes
setupRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
