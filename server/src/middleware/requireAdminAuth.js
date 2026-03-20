import jwt from 'jsonwebtoken';

import { Admin } from '../models/Admin.js';

export const requireAdminAuth = async (request, response, next) => {
  const authHeader = request.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return response.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-change-me');
    const admin = await Admin.findById(payload.sub).select('name email lastLoginAt');

    if (!admin || payload.role !== 'admin' || payload.email !== admin.email) {
      return response.status(401).json({ message: 'Authentication failed.' });
    }

    request.admin = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      lastLoginAt: admin.lastLoginAt,
    };

    return next();
  } catch (_error) {
    return response.status(401).json({ message: 'Authentication failed.' });
  }
};