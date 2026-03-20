import { ContactInquiry } from '../models/ContactInquiry.js';
import { sendContactInquiryNotification } from '../utils/contactInquiryMailer.js';
import xlsx from 'xlsx';

const allowedStatuses = new Set(['new', 'read', 'resolved']);

export const createContactInquiry = async (request, response) => {
  const inquiry = await ContactInquiry.create({
    name: request.body.name,
    phone: request.body.phone,
    email: request.body.email,
    systemSize: request.body.systemSize,
    location: request.body.location,
    message: request.body.message,
  });

  let notificationSent = false;

  try {
    const result = await sendContactInquiryNotification(inquiry);
    notificationSent = result.sent;
  } catch (error) {
    console.error('Unable to send contact inquiry notification email', error);
  }

  response.status(201).json({
    message: 'Inquiry submitted successfully.',
    inquiry,
    notificationSent,
  });
};

export const getAdminContactInquiries = async (_request, response) => {
  const inquiries = await ContactInquiry.find()
    .sort({ createdAt: -1 })
    .lean();

  response.json(inquiries);
};

export const exportAdminContactInquiries = async (_request, response) => {
  const inquiries = await ContactInquiry.find()
    .sort({ createdAt: -1 })
    .lean();

  const rows = inquiries.map((inquiry) => ({
    Name: inquiry.name,
    Phone: inquiry.phone,
    Email: inquiry.email,
    'System Size': inquiry.systemSize || '',
    Location: inquiry.location || '',
    Message: inquiry.message,
    Status: inquiry.status,
    'Created At': new Date(inquiry.createdAt).toISOString(),
    'Updated At': new Date(inquiry.updatedAt).toISOString(),
  }));

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(rows);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Inquiries');

  const fileBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  response.setHeader('Content-Disposition', `attachment; filename="contact-inquiries-${new Date().toISOString().slice(0, 10)}.xlsx"`);
  response.send(fileBuffer);
};

export const updateAdminContactInquiryStatus = async (request, response) => {
  const { status } = request.body;

  if (!allowedStatuses.has(status)) {
    return response.status(400).json({ message: 'Invalid inquiry status.' });
  }

  const inquiry = await ContactInquiry.findByIdAndUpdate(
    request.params.id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!inquiry) {
    return response.status(404).json({ message: 'Inquiry not found.' });
  }

  return response.json(inquiry);
};