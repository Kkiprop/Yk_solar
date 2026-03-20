import bcrypt from 'bcryptjs';

import { Admin } from '../models/Admin.js';

export const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const name = process.env.ADMIN_NAME?.trim() || 'Yk Solarworks Admin';

  if (!email || !password) {
    console.warn('Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env.');
    return;
  }

  const existingAdmin = await Admin.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 10);

  if (!existingAdmin) {
    await Admin.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    console.log(`Seeded admin user for ${email}`);
    return;
  }

  const passwordMatches = await bcrypt.compare(password, existingAdmin.passwordHash);

  if (!passwordMatches || existingAdmin.name !== name || existingAdmin.role !== 'admin' || !existingAdmin.isActive) {
    existingAdmin.name = name;
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.role = 'admin';
    existingAdmin.isActive = true;
    await existingAdmin.save();
  }
};