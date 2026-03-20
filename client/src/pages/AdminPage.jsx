import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import SiteContentEditor from '../components/SiteContentEditor';
import { api, clearAdminToken, getAdminToken, setAdminToken } from '../lib/api';
import { cloneSiteContent, defaultSiteContent, mergeSiteContent } from '../lib/defaultSiteContent';

const initialForm = {
  title: '',
  category: 'Solar Projects',
  summary: '',
  content: '',
  imageUrl: '',
  published: true,
  featured: false,
};

const initialCredentials = {
  email: '',
  password: '',
};

const initialDashboard = {
  stats: {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    featuredPosts: 0,
  },
  recentPosts: [],
};

const initialUserForm = {
  name: '',
  email: '',
  password: '',
  role: 'editor',
  isActive: true,
};

const initialPasswordResetForm = {
  userId: '',
  password: '',
};

const roleLabels = {
  admin: 'Administrator',
  editor: 'Editor',
  support: 'Support',
};

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'support', label: 'Support' },
];

const canEditContent = (role) => ['admin', 'editor'].includes(role);
const canManageInquiries = (role) => ['admin', 'support'].includes(role);
const canManageUsers = (role) => role === 'admin';

const getAvailableTabs = (role) => {
  const tabs = [];

  if (canEditContent(role)) {
    tabs.push({ id: 'page-edit', label: 'Page edit' });
    tabs.push({ id: 'recent-updates', label: 'Recent updates' });
  }

  if (canManageInquiries(role)) {
    tabs.push({ id: 'enquiries', label: 'Enquiries' });
  }

  if (canManageUsers(role)) {
    tabs.push({ id: 'users', label: 'Users' });
  }

  return tabs;
};

const getDefaultTab = (role) => getAvailableTabs(role)[0]?.id || 'recent-updates';

const getDownloadFilename = (headerValue) => {
  const match = headerValue?.match(/filename="?([^\"]+)"?/i);
  return match?.[1] || `contact-inquiries-${new Date().toISOString().slice(0, 10)}.xlsx`;
};

export function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [inquiryStatusSavingId, setInquiryStatusSavingId] = useState('');
  const [activeTab, setActiveTab] = useState('page-edit');
  const [form, setForm] = useState(initialForm);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [passwordResetForm, setPasswordResetForm] = useState(initialPasswordResetForm);
  const [siteContent, setSiteContent] = useState(() => cloneSiteContent(defaultSiteContent));
  const [credentials, setCredentials] = useState(initialCredentials);
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [admin, setAdmin] = useState(null);
  const [editingId, setEditingId] = useState('');
  const [editingUserId, setEditingUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSaving, setAuthSaving] = useState(false);
  const [siteSaving, setSiteSaving] = useState(false);
  const [userSaving, setUserSaving] = useState(false);
  const [exportSaving, setExportSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState('');
  const [resettingPasswordUserId, setResettingPasswordUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState('');
  const [siteStatus, setSiteStatus] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [inquiryStatusMessage, setInquiryStatusMessage] = useState('');
  const [userStatus, setUserStatus] = useState('');

  const availableTabs = getAvailableTabs(admin?.role);

  const loadAdminData = async (role) => {
    const requests = {
      dashboard: api.get('/admin/dashboard'),
    };

    if (canEditContent(role)) {
      requests.posts = api.get('/admin/posts');
      requests.siteContent = api.get('/admin/site-content');
    }

    if (canManageInquiries(role)) {
      requests.inquiries = api.get('/admin/contact-inquiries');
    }

    if (canManageUsers(role)) {
      requests.users = api.get('/admin/users');
    }

    const requestEntries = Object.entries(requests);
    const responses = await Promise.all(requestEntries.map(([, request]) => request));
    const data = Object.fromEntries(requestEntries.map(([key], index) => [key, responses[index].data]));

    setDashboard(data.dashboard || initialDashboard);
    setPosts(data.posts || []);
    setSiteContent(
      data.siteContent
        ? mergeSiteContent(defaultSiteContent, data.siteContent)
        : cloneSiteContent(defaultSiteContent)
    );
    setInquiries(data.inquiries || []);
    setUsers(data.users || []);
  };

  const bootstrapAdmin = async () => {
    const token = getAdminToken();

    if (!token) {
      setAuthLoading(false);
      setLoading(false);
      return;
    }

    try {
      const meResponse = await api.get('/admin/me');
      const nextAdmin = meResponse.data.admin;

      setAdmin(nextAdmin);
      setIsAuthenticated(true);
      setActiveTab(getDefaultTab(nextAdmin.role));
      setLoading(true);
      await loadAdminData(nextAdmin.role);
    } catch (error) {
      console.error('Unable to restore admin session', error);
      clearAdminToken();
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAdmin();
  }, []);

  useEffect(() => {
    if (!admin) {
      return;
    }

    if (!availableTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(getDefaultTab(admin.role));
    }
  }, [activeTab, admin, availableTabs]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCredentialsChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUserFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUserForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordResetFormChange = (event) => {
    const { value } = event.target;

    setPasswordResetForm((current) => ({
      ...current,
      password: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthSaving(true);
    setAuthMessage('');

    try {
      const response = await api.post('/admin/login', credentials);
      const nextAdmin = response.data.admin;

      setAdminToken(response.data.token);
      setAdmin(nextAdmin);
      setIsAuthenticated(true);
      setActiveTab(getDefaultTab(nextAdmin.role));
      setLoading(true);
      await loadAdminData(nextAdmin.role);
      setAuthMessage('Admin login successful.');
    } catch (error) {
      console.error('Unable to login admin', error);
      setAuthMessage(error.response?.data?.message || 'Unable to login. Check your credentials.');
    } finally {
      setAuthSaving(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAdmin(null);
    setIsAuthenticated(false);
    setPosts([]);
    setInquiries([]);
    setUsers([]);
    setSiteContent(cloneSiteContent(defaultSiteContent));
    setDashboard(initialDashboard);
    setEditingId('');
    setEditingUserId('');
    setActiveTab('page-edit');
    setForm(initialForm);
    setUserForm(initialUserForm);
    setPasswordResetForm(initialPasswordResetForm);
    setStatus('');
    setSiteStatus('');
    setUserStatus('');
    setInquiryStatusMessage('');
    setAuthMessage('Logged out successfully.');
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setForm({
      title: post.title,
      category: post.category,
      summary: post.summary,
      content: post.content,
      imageUrl: post.imageUrl || '',
      published: post.published,
      featured: post.featured,
    });
    setStatus(`Editing "${post.title}"`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId('');
    setForm(initialForm);
  };

  const resetUserForm = () => {
    setEditingUserId('');
    setUserForm(initialUserForm);
  };

  const openPasswordResetForm = (userId) => {
    setPasswordResetForm({ userId, password: '' });
    setUserStatus('');
  };

  const closePasswordResetForm = () => {
    setPasswordResetForm(initialPasswordResetForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus('');

    try {
      if (editingId) {
        await api.put(`/admin/posts/${editingId}`, form);
        setStatus('Post updated successfully.');
      } else {
        await api.post('/admin/posts', form);
        setStatus('Post created successfully.');
      }

      resetForm();
      await loadAdminData(admin.role);
    } catch (error) {
      console.error('Unable to save post', error);
      setStatus(error.response?.data?.message || 'Unable to save the post. Review the form and API connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('Delete this post permanently?');

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/posts/${postId}`);
      setStatus('Post deleted successfully.');
      if (editingId === postId) {
        resetForm();
      }
      await loadAdminData(admin.role);
    } catch (error) {
      console.error('Unable to delete post', error);
      setStatus(error.response?.data?.message || 'Unable to delete the post.');
    }
  };

  const handleSaveSiteContent = async (event) => {
    event.preventDefault();
    setSiteSaving(true);
    setSiteStatus('');

    try {
      const response = await api.put('/admin/site-content', siteContent);
      setSiteContent(mergeSiteContent(defaultSiteContent, response.data));
      setSiteStatus('Homepage sections updated successfully.');
    } catch (error) {
      console.error('Unable to save site content', error);
      setSiteStatus(error.response?.data?.message || 'Unable to save site content.');
    } finally {
      setSiteSaving(false);
    }
  };

  const handleInquiryStatusUpdate = async (inquiryId, nextStatus) => {
    setInquiryStatusSavingId(inquiryId);
    setInquiryStatusMessage('');

    try {
      const response = await api.put(`/admin/contact-inquiries/${inquiryId}/status`, {
        status: nextStatus,
      });

      setInquiries((current) => current.map((inquiry) => (
        inquiry._id === inquiryId ? response.data : inquiry
      )));
      setInquiryStatusMessage('Inquiry status updated.');
    } catch (error) {
      console.error('Unable to update inquiry status', error);
      setInquiryStatusMessage(error.response?.data?.message || 'Unable to update inquiry status.');
    } finally {
      setInquiryStatusSavingId('');
    }
  };

  const handleExportInquiries = async () => {
    setExportSaving(true);
    setInquiryStatusMessage('');

    try {
      const response = await api.get('/admin/contact-inquiries/export', {
        responseType: 'blob',
      });

      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = getDownloadFilename(response.headers['content-disposition']);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setInquiryStatusMessage('Inquiry export downloaded.');
    } catch (error) {
      console.error('Unable to export inquiries', error);
      setInquiryStatusMessage(error.response?.data?.message || 'Unable to export inquiries.');
    } finally {
      setExportSaving(false);
    }
  };

  const handleUserEdit = (user) => {
    setEditingUserId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
    setUserStatus(`Editing ${user.name}`);
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    setUserSaving(true);
    setUserStatus('');

    const payload = {
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      isActive: userForm.isActive,
    };

    if (userForm.password) {
      payload.password = userForm.password;
    }

    try {
      if (editingUserId) {
        await api.put(`/admin/users/${editingUserId}`, payload);
        setUserStatus('User updated successfully.');
      } else {
        await api.post('/admin/users', payload);
        setUserStatus('User created successfully.');
      }

      resetUserForm();
      await loadAdminData(admin.role);
    } catch (error) {
      console.error('Unable to save user', error);
      setUserStatus(error.response?.data?.message || 'Unable to save the user.');
    } finally {
      setUserSaving(false);
    }
  };

  const handleUserActivationToggle = async (user) => {
    if (user.id === admin?.id) {
      setUserStatus('Sign in with another administrator to change your own active status.');
      return;
    }

    setUserSaving(true);
    setUserStatus('');

    try {
      await api.put(`/admin/users/${user.id}`, {
        isActive: !user.isActive,
      });
      setUserStatus(`User ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
      await loadAdminData(admin.role);
    } catch (error) {
      console.error('Unable to update user status', error);
      setUserStatus(error.response?.data?.message || 'Unable to update the user status.');
    } finally {
      setUserSaving(false);
    }
  };

  const handlePasswordReset = async (user) => {
    if (!passwordResetForm.password || passwordResetForm.password.trim().length < 8) {
      setUserStatus('Enter a new password with at least 8 characters.');
      return;
    }

    setResettingPasswordUserId(user.id);
    setUserStatus('');

    try {
      await api.post(`/admin/users/${user.id}/reset-password`, {
        password: passwordResetForm.password,
      });
      setUserStatus(`Password reset for ${user.name}.`);
      closePasswordResetForm();
      await loadAdminData(admin.role);
    } catch (error) {
      console.error('Unable to reset user password', error);
      setUserStatus(error.response?.data?.message || 'Unable to reset the user password.');
    } finally {
      setResettingPasswordUserId('');
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(`Delete ${user.name}'s account permanently?`);

    if (!confirmed) {
      return;
    }

    setDeletingUserId(user.id);
    setUserStatus('');

    try {
      await api.delete(`/admin/users/${user.id}`);
      setUserStatus(`${user.name} was deleted.`);
      if (editingUserId === user.id) {
        resetUserForm();
      }
      if (passwordResetForm.userId === user.id) {
        closePasswordResetForm();
      }
      await loadAdminData(admin.role);
    } catch (error) {
      console.error('Unable to delete user', error);
      setUserStatus(error.response?.data?.message || 'Unable to delete the user account.');
    } finally {
      setDeletingUserId('');
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => (
    inquiryFilter === 'all' ? true : inquiry.status === inquiryFilter
  ));

  if (authLoading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="glass-panel w-full p-8 text-center text-slate-600">Checking admin session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="glass-panel w-full p-8 sm:p-10">
          <span className="eyebrow-chip">Admin access</span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Login to the dashboard
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Use an admin account stored in the database to manage site content.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Email</span>
              <input
                className="field-input"
                name="email"
                type="email"
                placeholder="admin@yksolarworks.com"
                value={credentials.email}
                onChange={handleCredentialsChange}
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Password</span>
              <input
                className="field-input"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleCredentialsChange}
                required
              />
            </label>

            <button type="submit" className="primary-btn w-full" disabled={authSaving}>
              {authSaving ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {authMessage ? <p className="mt-4 text-sm text-slate-600">{authMessage}</p> : null}

          <Link to="/" className="secondary-btn mt-6 w-full">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 rounded-[32px] border border-white/60 bg-white/75 p-6 shadow-glow backdrop-blur-xl lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <span className="eyebrow-chip">Admin section</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
            Manage site content
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Signed in as {admin?.name || 'Admin'} ({roleLabels[admin?.role] || 'Team member'}). Use the tools below
            to manage content, inquiries, and staff access based on your role.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="secondary-btn">
            Back to site
          </Link>
          <button type="button" className="ghost-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="glass-panel p-6">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Total posts</span>
          <strong className="mt-3 block font-display text-5xl font-bold text-slate-950">
            {dashboard.stats.totalPosts}
          </strong>
        </article>
        <article className="glass-panel p-6">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Published</span>
          <strong className="mt-3 block font-display text-5xl font-bold text-slate-950">
            {dashboard.stats.publishedPosts}
          </strong>
        </article>
        <article className="glass-panel p-6">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Drafts</span>
          <strong className="mt-3 block font-display text-5xl font-bold text-slate-950">
            {dashboard.stats.draftPosts}
          </strong>
        </article>
        <article className="glass-panel p-6">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Featured</span>
          <strong className="mt-3 block font-display text-5xl font-bold text-slate-950">
            {dashboard.stats.featuredPosts}
          </strong>
        </article>
      </section>

      <section className="mt-6">
        <div className="glass-panel p-4">
          <div className="flex flex-wrap gap-3">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'primary-btn px-5 py-2.5 text-sm' : 'secondary-btn px-5 py-2.5 text-sm'}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeTab === 'recent-updates' ? (
        <section className="mt-6">
          <div className="glass-panel p-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">Recent updates</h2>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {dashboard.recentPosts.length} items
              </span>
            </div>

            {dashboard.recentPosts.length === 0 ? (
              <p className="mt-5 text-base leading-7 text-slate-600">No recent updates yet.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {dashboard.recentPosts.map((post) => (
                  <article key={post._id} className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-950">{post.title}</h3>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-leaf">{post.category}</p>
                    </div>
                    <span className="text-sm text-slate-500">{new Date(post.updatedAt).toLocaleDateString()}</span>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === 'enquiries' ? (
        <section className="mt-6">
          <div className="glass-panel p-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">Contact inquiries</h2>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="secondary-btn px-4 py-2 text-xs" disabled={exportSaving} onClick={handleExportInquiries}>
                  {exportSaving ? 'Exporting...' : 'Export Excel'}
                </button>
                <div className="flex flex-wrap gap-2">
                  {['all', 'new', 'read', 'resolved'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={inquiryFilter === filter ? 'primary-btn px-4 py-2 text-xs' : 'secondary-btn px-4 py-2 text-xs'}
                      onClick={() => setInquiryFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {filteredInquiries.length} chats
                </span>
              </div>
            </div>

            {inquiryStatusMessage ? <p className="mt-4 text-sm text-slate-600">{inquiryStatusMessage}</p> : null}

            {loading ? (
              <p className="mt-5 text-base leading-7 text-slate-600">Loading inquiries...</p>
            ) : filteredInquiries.length === 0 ? (
              <p className="mt-5 text-base leading-7 text-slate-600">No inquiries yet. Submitted chats will appear here.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {filteredInquiries.map((inquiry) => (
                  <article key={inquiry._id} className="rounded-[24px] border border-slate-200 bg-white/70 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-slate-950">{inquiry.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-slate-600">
                          <a className="hover:text-brand-leaf" href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>
                          <a className="hover:text-brand-leaf" href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                          {inquiry.systemSize ? <span>System: {inquiry.systemSize}</span> : null}
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 sm:text-right">
                        <span className="block font-semibold uppercase tracking-[0.14em] text-brand-leaf">{inquiry.status}</span>
                        <span className="mt-1 block">{new Date(inquiry.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {inquiry.location ? (
                      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {inquiry.location}
                      </p>
                    ) : null}

                    <p className="mt-4 text-base leading-7 text-slate-700">{inquiry.message}</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="secondary-btn px-4 py-2 text-xs"
                        disabled={inquiryStatusSavingId === inquiry._id || inquiry.status === 'read'}
                        onClick={() => handleInquiryStatusUpdate(inquiry._id, 'read')}
                      >
                        Mark as read
                      </button>
                      <button
                        type="button"
                        className="ghost-btn px-4 py-2 text-xs"
                        disabled={inquiryStatusSavingId === inquiry._id || inquiry.status === 'resolved'}
                        onClick={() => handleInquiryStatusUpdate(inquiry._id, 'resolved')}
                      >
                        Mark as resolved
                      </button>
                      <button
                        type="button"
                        className="ghost-btn px-4 py-2 text-xs"
                        disabled={inquiryStatusSavingId === inquiry._id || inquiry.status === 'new'}
                        onClick={() => handleInquiryStatusUpdate(inquiry._id, 'new')}
                      >
                        Mark as new
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === 'users' ? (
        <section className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <form className="glass-panel space-y-5 p-6 xl:sticky xl:top-5" onSubmit={handleUserSubmit}>
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">
                {editingUserId ? 'Edit user' : 'New user'}
              </h2>
              {editingUserId ? (
                <button type="button" className="text-sm font-bold text-brand-leaf" onClick={resetUserForm}>
                  Cancel editing
                </button>
              ) : null}
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Name</span>
              <input className="field-input" name="name" value={userForm.name} onChange={handleUserFormChange} required />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Email</span>
              <input
                className="field-input"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Password {editingUserId ? '(leave blank to keep current password)' : ''}</span>
              <input
                className="field-input"
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                required={!editingUserId}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              <span className="mb-2 block">Role</span>
              <select className="field-input" name="role" value={userForm.role} onChange={handleUserFormChange}>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-brand-moss/60 px-4 py-3 text-sm font-semibold text-slate-800">
              <input
                className="h-4 w-4 rounded border-slate-300 text-brand-green focus:ring-brand-green"
                type="checkbox"
                name="isActive"
                checked={userForm.isActive}
                onChange={handleUserFormChange}
                disabled={editingUserId === admin?.id}
              />
              Account active
            </label>

            <button type="submit" className="primary-btn w-full" disabled={userSaving}>
              {userSaving ? 'Saving...' : editingUserId ? 'Update user' : 'Create user'}
            </button>

            {userStatus ? <p className="text-sm text-slate-600">{userStatus}</p> : null}
          </form>

          <section className="glass-panel p-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">Team accounts</h2>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{users.length} users</span>
            </div>

            {loading ? (
              <p className="mt-5 text-base leading-7 text-slate-600">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="mt-5 text-base leading-7 text-slate-600">No team accounts found.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {users.map((user) => (
                  <article key={user.id} className="rounded-[24px] border border-slate-200 bg-white/70 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-slate-950">{user.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-600">{user.email}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                          <span className="rounded-full bg-brand-moss/60 px-3 py-1 text-slate-700">{roleLabels[user.role] || user.role}</span>
                          <span className={user.isActive ? 'rounded-full bg-emerald-100 px-3 py-1 text-emerald-700' : 'rounded-full bg-rose-100 px-3 py-1 text-rose-700'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {user.id === admin?.id ? <span className="rounded-full bg-slate-900 px-3 py-1 text-white">Current session</span> : null}
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-slate-500">
                          <p>Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</p>
                          <p>Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}</p>
                          <p>Updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Unknown'}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button type="button" className="secondary-btn" onClick={() => handleUserEdit(user)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => openPasswordResetForm(user.id)}
                        >
                          Reset password
                        </button>
                        <button
                          type="button"
                          className="ghost-btn"
                          disabled={userSaving || user.id === admin?.id}
                          onClick={() => handleUserActivationToggle(user)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          className="ghost-btn"
                          disabled={deletingUserId === user.id || user.id === admin?.id}
                          onClick={() => handleDeleteUser(user)}
                        >
                          {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>

                    {passwordResetForm.userId === user.id ? (
                      <div className="mt-5 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                          <label className="block flex-1 text-sm font-semibold text-slate-700">
                            <span className="mb-2 block">New password for {user.name}</span>
                            <input
                              className="field-input"
                              type="password"
                              value={passwordResetForm.password}
                              onChange={handlePasswordResetFormChange}
                              placeholder="At least 8 characters"
                            />
                          </label>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              className="primary-btn"
                              disabled={resettingPasswordUserId === user.id}
                              onClick={() => handlePasswordReset(user)}
                            >
                              {resettingPasswordUserId === user.id ? 'Resetting...' : 'Save new password'}
                            </button>
                            <button type="button" className="ghost-btn" onClick={closePasswordResetForm}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      ) : null}

      {activeTab === 'page-edit' ? (
        <>
          <section className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
            <form className="glass-panel space-y-5 p-6 xl:sticky xl:top-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  {editingId ? 'Edit post' : 'New post'}
                </h2>
                {editingId ? (
                  <button type="button" className="text-sm font-bold text-brand-leaf" onClick={resetForm}>
                    Cancel editing
                  </button>
                ) : null}
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                <span className="mb-2 block">Title</span>
                <input className="field-input" name="title" value={form.title} onChange={handleChange} required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                <span className="mb-2 block">Category</span>
                <input className="field-input" name="category" value={form.category} onChange={handleChange} required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                <span className="mb-2 block">Summary</span>
                <textarea
                  className="field-input min-h-[110px] resize-y"
                  name="summary"
                  rows="3"
                  maxLength="240"
                  value={form.summary}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                <span className="mb-2 block">Full content</span>
                <textarea
                  className="field-input min-h-[180px] resize-y"
                  name="content"
                  rows="8"
                  value={form.content}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                <span className="mb-2 block">Image URL</span>
                <input className="field-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl bg-brand-moss/60 px-4 py-3 text-sm font-semibold text-slate-800">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-brand-green focus:ring-brand-green"
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={handleChange}
                  />
                  Published
                </label>
                <label className="flex items-center gap-3 rounded-2xl bg-brand-moss/60 px-4 py-3 text-sm font-semibold text-slate-800">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-brand-green focus:ring-brand-green"
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  Featured
                </label>
              </div>

              <button type="submit" className="primary-btn w-full" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update post' : 'Create post'}
              </button>

              {status ? <p className="text-sm text-slate-600">{status}</p> : null}
            </form>

            <section className="glass-panel p-6">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">Existing posts</h2>
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{posts.length} items</span>
              </div>

              {loading ? (
                <p className="mt-5 text-base leading-7 text-slate-600">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="mt-5 text-base leading-7 text-slate-600">No posts yet. Create one to populate the landing page.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {posts.map((post) => (
                    <article key={post._id} className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/70 p-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-slate-950">{post.title}</h3>
                        <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">{post.summary}</p>
                        <span className="mt-3 inline-block text-xs font-extrabold uppercase tracking-[0.18em] text-brand-leaf">
                          {post.category} | {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button type="button" className="secondary-btn" onClick={() => handleEdit(post)}>
                          Edit
                        </button>
                        <button type="button" className="ghost-btn" onClick={() => handleDelete(post._id)}>
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>

          <SiteContentEditor
            siteContent={siteContent}
            setSiteContent={setSiteContent}
            onSave={handleSaveSiteContent}
            saving={siteSaving}
            status={siteStatus}
          />
        </>
      ) : null}
    </div>
  );
}
