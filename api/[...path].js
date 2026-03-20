import app from '../server/src/app.js';
import { connectDatabase } from '../server/src/config/db.js';

export default async function handler(request, response) {
  try {
    const requestUrl = request.url || '/';

    if (!requestUrl.startsWith('/api')) {
      request.url = `/api${requestUrl.startsWith('/') ? requestUrl : `/${requestUrl}`}`;
    }

    await connectDatabase();
    return app(request, response);
  } catch (error) {
    console.error('Failed to initialize API request', error);
    return response.status(500).json({
      message: 'Unable to initialize the API.',
    });
  }
}