import { signAdminToken } from '../utils/auth.js';

const getEnvAdmin = () => ({
  id: 'env-admin',
  name: process.env.ADMIN_NAME?.trim() || 'Yk Solarworks Admin',
  email: process.env.ADMIN_EMAIL?.trim().toLowerCase() || '',
  password: process.env.ADMIN_PASSWORD?.trim() || '',
});

const sanitizeAdmin = (admin) => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
});

export const loginAdmin = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required.' });
  }

  const admin = getEnvAdmin();

  if (!admin.email || !admin.password) {
    return response.status(500).json({ message: 'Admin credentials are not configured on the server.' });
  }

  if (admin.email !== email.toLowerCase().trim() || admin.password !== password) {
    return response.status(401).json({ message: 'Invalid email or password.' });
  }

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