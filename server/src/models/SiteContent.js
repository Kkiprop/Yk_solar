import mongoose from 'mongoose';

const { Mixed } = mongoose.Schema.Types;

const siteContentSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: 'homepage',
      trim: true,
    },
    nav: {
      type: Mixed,
      required: true,
    },
    hero: {
      type: Mixed,
      required: true,
    },
    metrics: {
      type: Mixed,
      required: true,
    },
    about: {
      type: Mixed,
      required: true,
    },
    services: {
      type: Mixed,
      required: true,
    },
    projects: {
      type: Mixed,
      required: true,
    },
    whySolar: {
      type: Mixed,
      required: true,
    },
    team: {
      type: Mixed,
      required: true,
    },
    pricing: {
      type: Mixed,
      required: true,
    },
    urgency: {
      type: Mixed,
      required: true,
    },
    contact: {
      type: Mixed,
      required: true,
    },
    footer: {
      type: Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'YK_Solar_site_content',
  }
);

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);