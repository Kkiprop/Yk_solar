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
  getAdminContactInquiries,
  updateAdminContactInquiryStatus,
} from '../controllers/contactInquiryController.js';
import { getCurrentAdmin, loginAdmin } from '../controllers/authController.js';
import { requireAdminAuth } from '../middleware/requireAdminAuth.js';

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
router.get('/admin/posts', requireAdminAuth, asyncHandler(getAdminPosts));
router.get('/admin/site-content', requireAdminAuth, asyncHandler(getAdminSiteContent));
router.get('/admin/contact-inquiries', requireAdminAuth, asyncHandler(getAdminContactInquiries));
router.post('/admin/posts', requireAdminAuth, asyncHandler(createPost));
router.put('/admin/contact-inquiries/:id/status', requireAdminAuth, asyncHandler(updateAdminContactInquiryStatus));
router.put('/admin/posts/:id', requireAdminAuth, asyncHandler(updatePost));
router.put('/admin/site-content', requireAdminAuth, asyncHandler(updateAdminSiteContent));
router.delete('/admin/posts/:id', requireAdminAuth, asyncHandler(deletePost));

export default router;
