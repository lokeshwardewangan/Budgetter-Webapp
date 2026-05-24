import { app } from './app.js';
import { env } from './shared/config/env.js';
import connectToDb from './shared/db/conn.js';

connectToDb()
  .then(() => {
    app.on('error', (err) => {
      console.error('Express app error:', err);
      throw err;
    });
    app.listen(env.PORT, () => {
      console.log(`Server listening on PORT ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
