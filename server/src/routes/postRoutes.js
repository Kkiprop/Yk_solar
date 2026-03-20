import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAdminDashboard,
  getAdminPosts,
  getPublishedPosts,
  updatePost,
} from '../controllers/postController.js';
import {
  getAdminSiteContent,
  getSiteContent,
  updateAdminSiteContent,
} from '../controllers/siteContentController.js';
import {
  createContactInquiry,
  exportAdminContactInquiries,
  getAdminContactInquiries,
  updateAdminContactInquiryStatus,
} from '../controllers/contactInquiryController.js';
import { getCurrentAdmin, loginAdmin } from '../controllers/authController.js';
import { requireAdminAuth, requireRoles } from '../middleware/requireAdminAuth.js';
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  resetAdminUserPassword,
  updateAdminUser,
} from '../controllers/userManagementController.js';

const router = Router();
const asyncHandler = (handler) => (request, response, next) => {
  Promise.resolve(handler(request, response, next)).catch(next);
};

router.get('/posts', asyncHandler(getPublishedPosts));
router.get('/site-content', asyncHandler(getSiteContent));
router.post('/contact-inquiries', asyncHandler(createContactInquiry));
router.post('/auth/login', asyncHandler(loginAdmin));
router.get('/auth/me', requireAdminAuth, asyncHandler(getCurrentAdmin));
router.post('/admin/login', asyncHandler(loginAdmin));
router.get('/admin/me', requireAdminAuth, asyncHandler(getCurrentAdmin));

router.get('/admin/dashboard', requireAdminAuth, asyncHandler(getAdminDashboard));
router.get('/admin/posts', requireAdminAuth, requireRoles('admin', 'editor'), asyncHandler(getAdminPosts));
router.get('/admin/site-content', requireAdminAuth, requireRoles('admin', 'editor'), asyncHandler(getAdminSiteContent));
router.get('/admin/contact-inquiries', requireAdminAuth, requireRoles('admin', 'support'), asyncHandler(getAdminContactInquiries));
router.get('/admin/contact-inquiries/export', requireAdminAuth, requireRoles('admin', 'support'), asyncHandler(exportAdminContactInquiries));
router.get('/admin/users', requireAdminAuth, requireRoles('admin'), asyncHandler(getAdminUsers));
router.post('/admin/posts', requireAdminAuth, requireRoles('admin', 'editor'), asyncHandler(createPost));
router.post('/admin/users', requireAdminAuth, requireRoles('admin'), asyncHandler(createAdminUser));
router.post('/admin/users/:id/reset-password', requireAdminAuth, requireRoles('admin'), asyncHandler(resetAdminUserPassword));
router.put('/admin/contact-inquiries/:id/status', requireAdminAuth, requireRoles('admin', 'support'), asyncHandler(updateAdminContactInquiryStatus));
router.put('/admin/posts/:id', requireAdminAuth, requireRoles('admin', 'editor'), asyncHandler(updatePost));
router.put('/admin/site-content', requireAdminAuth, requireRoles('admin', 'editor'), asyncHandler(updateAdminSiteContent));
router.put('/admin/users/:id', requireAdminAuth, requireRoles('admin'), asyncHandler(updateAdminUser));
router.delete('/admin/users/:id', requireAdminAuth, requireRoles('admin'), asyncHandler(deleteAdminUser));
router.delete('/admin/posts/:id', requireAdminAuth, requireRoles('admin', 'editor'), asyncHandler(deletePost));

export default router;
