import express from 'express';
const router = express.Router();

// Define your routes here
router.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

export default router;
