import 'dotenv/config';

import { app, initializeApp } from './app.js';

const port = process.env.PORT || 5000;

initializeApp()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
