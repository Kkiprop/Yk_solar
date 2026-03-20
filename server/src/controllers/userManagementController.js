import bcrypt from 'bcryptjs';

import { Admin, ADMIN_ROLES } from '../models/Admin.js';

const sanitizeUser = (user) => ({
  id: user.id || user._id?.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const validateRole = (role) => {
  if (!ADMIN_ROLES.includes(role)) {
    const error = new Error('Invalid role selected.');
    error.statusCode = 400;
    throw error;
  }
};

export const getAdminUsers = async (_request, response) => {
  const users = await Admin.find()
    .sort({ createdAt: -1 })
    .select('name email role isActive lastLoginAt createdAt updatedAt')
    .lean();

  response.json(users.map(sanitizeUser));
};

export const createAdminUser = async (request, response) => {
  const { name, email, password, role, isActive = true } = request.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!name || !normalizedEmail || !password || !role) {
    return response.status(400).json({ message: 'Name, email, password, and role are required.' });
  }

  validateRole(role);

  const existingUser = await Admin.findOne({ email: normalizedEmail });

  if (existingUser) {
    return response.status(409).json({ message: 'A user with that email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await Admin.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    isActive: Boolean(isActive),
  });

  response.status(201).json(sanitizeUser(user));
};

export const updateAdminUser = async (request, response) => {
  const { name, email, password, role, isActive } = request.body;
  const user = await Admin.findById(request.params.id);

  if (!user) {
    return response.status(404).json({ message: 'User not found.' });
  }

  if (role !== undefined) {
    validateRole(role);
  }

  const nextRole = role !== undefined ? role : user.role;
  const nextIsActive = typeof isActive === 'boolean' ? isActive : user.isActive;

  if (user.role === 'admin' && user.isActive && (nextRole !== 'admin' || !nextIsActive)) {
    const activeAdminCount = await Admin.countDocuments({ role: 'admin', isActive: true });

    if (activeAdminCount <= 1) {
      return response.status(400).json({ message: 'At least one active administrator account must remain.' });
    }
  }

  if (role !== undefined) {
    user.role = role;
  }

  if (name !== undefined) {
    user.name = name.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await Admin.findOne({ email: normalizedEmail, _id: { $ne: user._id } });

    if (existingUser) {
      return response.status(409).json({ message: 'A user with that email already exists.' });
    }

    user.email = normalizedEmail;
  }

  if (typeof isActive === 'boolean') {
    user.isActive = isActive;
  }

  if (password) {
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  await user.save();

  response.json(sanitizeUser(user));
};

export const resetAdminUserPassword = async (request, response) => {
  const { password } = request.body;
  const user = await Admin.findById(request.params.id);

  if (!user) {
    return response.status(404).json({ message: 'User not found.' });
  }

  if (!password || password.trim().length < 8) {
    return response.status(400).json({ message: 'A new password with at least 8 characters is required.' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();

  response.json({
    message: 'Password reset successfully.',
    user: sanitizeUser(user),
  });
};

export const deleteAdminUser = async (request, response) => {
  if (request.admin?.id === request.params.id) {
    return response.status(400).json({ message: 'You cannot delete the account you are currently signed in with.' });
  }

  const user = await Admin.findById(request.params.id);

  if (!user) {
    return response.status(404).json({ message: 'User not found.' });
  }

  if (user.role === 'admin' && user.isActive) {
    const activeAdminCount = await Admin.countDocuments({ role: 'admin', isActive: true });

    if (activeAdminCount <= 1) {
      return response.status(400).json({ message: 'At least one active administrator account must remain.' });
    }
  }

  await user.deleteOne();

  response.status(204).send();
};