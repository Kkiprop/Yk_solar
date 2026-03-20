import jwt from 'jsonwebtoken';

export const requireAdminAuth = async (request, response, next) => {
  const authHeader = request.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return response.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-change-me');
    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!configuredEmail || payload.email !== configuredEmail || payload.role !== 'admin') {
      return response.status(401).json({ message: 'Authentication failed.' });
    }

    request.admin = {
      id: payload.sub,
      name: process.env.ADMIN_NAME?.trim() || 'Yk Solarworks Admin',
      email: configuredEmail,
    };

    return next();
  } catch (_error) {
    return response.status(401).json({ message: 'Authentication failed.' });
  }
};