import { cloneDefaultSiteContent, mergeSiteContent } from '../config/siteContentDefaults.js';
import { SiteContent } from '../models/SiteContent.js';

const HOMEPAGE_KEY = 'homepage';

const getSiteContentPayload = (body = {}) => ({
  nav: body.nav,
  hero: body.hero,
  metrics: body.metrics,
  about: body.about,
  services: body.services,
  projects: body.projects,
  whySolar: body.whySolar,
  team: body.team,
  pricing: body.pricing,
  urgency: body.urgency,
  contact: body.contact,
  footer: body.footer,
});

const ensureSiteContent = async () => {
  const defaults = cloneDefaultSiteContent();
  const existingDocument = await SiteContent.findOne({ singletonKey: HOMEPAGE_KEY }).lean();

  if (!existingDocument) {
    return SiteContent.create({
      singletonKey: HOMEPAGE_KEY,
      ...defaults,
    });
  }

  const currentContent = getSiteContentPayload(existingDocument);
  const mergedDocument = mergeSiteContent(defaults, currentContent);
  const hasChanges = JSON.stringify(mergedDocument) !== JSON.stringify(currentContent);

  if (!hasChanges) {
    return existingDocument;
  }

  return SiteContent.findOneAndUpdate(
    { singletonKey: HOMEPAGE_KEY },
    {
      $set: mergedDocument,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();
};

export const getSiteContent = async (_request, response) => {
  const siteContent = await ensureSiteContent();
  response.json(siteContent);
};

export const getAdminSiteContent = async (_request, response) => {
  const siteContent = await ensureSiteContent();
  response.json(siteContent);
};

export const updateAdminSiteContent = async (request, response) => {
  const payload = mergeSiteContent(cloneDefaultSiteContent(), getSiteContentPayload(request.body));

  const siteContent = await SiteContent.findOneAndUpdate(
    { singletonKey: HOMEPAGE_KEY },
    {
      $set: payload,
      $setOnInsert: {
        singletonKey: HOMEPAGE_KEY,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  response.json(siteContent);
};