import bcrypt from 'bcryptjs';

import { Admin } from '../models/Admin.js';
import { signAdminToken } from '../utils/auth.js';

const sanitizeAdmin = (admin) => ({
  id: admin.id || admin._id?.toString(),
  name: admin.name,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  lastLoginAt: admin.lastLoginAt || null,
});

export const loginAdmin = async (request, response) => {
  const { email, password } = request.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required.' });
  }

  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    return response.status(401).json({ message: 'Invalid email or password.' });
  }

  if (!admin.isActive) {
    return response.status(403).json({ message: 'This account has been disabled.' });
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    return response.status(401).json({ message: 'Invalid email or password.' });
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  return response.json({
    token: signAdminToken(admin),
    admin: sanitizeAdmin(admin),
  });
};

export const getCurrentAdmin = async (request, response) => {
  response.json({
    admin: sanitizeAdmin(request.admin),
  });
};