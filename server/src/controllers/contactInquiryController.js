import { ContactInquiry } from '../models/ContactInquiry.js';
import { sendContactInquiryNotification } from '../utils/contactInquiryMailer.js';

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