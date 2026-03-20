import app, { initializeApp } from '../server/src/app.js';

export default async function handler(request, response) {
  await initializeApp();
  return app(request, response);
}