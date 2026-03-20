import jwt from 'jsonwebtoken';

export const signAdminToken = (admin) =>
  jwt.sign(
    {
      sub: admin.id || admin._id?.toString(),
      role: admin.role,
      email: admin.email,
    },
    process.env.JWT_SECRET || 'development-secret-change-me',
    {
      expiresIn: '7d',
    }
  );