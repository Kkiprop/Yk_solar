export const defaultSiteContent = {
  nav: {
    links: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Why Solar', href: '#why-solar' },
      { label: 'Work', href: '#projects' },
    ],
    adminLabel: 'Staff Portal',
  },
  hero: {
    eyebrow: 'Future-ready energy',
    title: 'Cleaner power for a modern lifestyle.',
    description: 'Practical engineering meets high-efficiency solar technology to drive down your utility costs permanently.',
    primaryCtaLabel: 'Book Consultation',
    primaryCtaHref: '#contact',
    secondaryCtaLabel: 'View Gallery',
    secondaryCtaHref: '#projects',
    highlightValue: '92%',
    highlightLabel: 'Avg. savings',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
  },
  metrics: [
    { value: '120+', label: 'Projects delivered' },
    { value: '92%', label: 'Avg. bill reduction' },
    { value: '25 years', label: 'Performance life' },
  ],
  about: {
    eyebrow: 'About Us',
    title: 'Built for clients who want solar done properly',
    description: 'YK Solarworks combines engineering discipline, practical installation experience, and long-view support so clients get systems that perform beyond handover day.',
    body: 'We work with homeowners, businesses, and institutions that need dependable solar systems, not oversold estimates. Our process is grounded in actual site conditions, future energy demand, and installation quality that holds up over time.',
    stats: [
      { value: '2019', label: 'Operational since' },
      { value: '24/7', label: 'System visibility' },
      { value: '1 team', label: 'From survey to switch-on' },
    ],
    highlights: [
      {
        title: 'Site-first design',
        description: 'Every project starts with a structural review, load analysis, and real consumption mapping.',
      },
      {
        title: 'Execution discipline',
        description: 'In-house coordination keeps approvals, mounting, cabling, and commissioning aligned.',
      },
      {
        title: 'Long-term support',
        description: 'We stay involved after installation with monitoring, maintenance guidance, and system upgrades.',
      },
    ],
  },
  services: {
    eyebrow: 'Expertise',
    title: 'Engineered for Performance',
    description: 'We move beyond standard fits to design systems that match your specific structural and energy profile.',
    items: [
      {
        title: 'Residential',
        description: 'Hybrid systems designed for reliable daytime power and night-time battery usage.',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1682148196781-8bbcdfd7f537?w=600',
      },
      {
        title: 'Commercial',
        description: 'Scalable PV installations for retail, industrial, and institutional sites.',
        imageUrl: 'https://images.unsplash.com/photo-1660330589505-9a433a742a7b?w=600',
      },
      {
        title: 'Industrial',
        description: 'High-capacity solar infrastructure for factories, plants, warehouses, and heavy-load operations.',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
      },
    ],
  },
  projects: {
    eyebrow: 'Portfolio',
    title: 'Recent Installations',
    description: 'Real results from our latest deployments across the region.',
    emptyState: 'No published projects yet. Use the admin dashboard to add the first one.',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
  },
  whySolar: {
    eyebrow: 'Why Solar Now',
    title: 'Four scrolls from energy risk to energy control',
    description: 'The first two scroll stages expose the hidden cost of conventional power. The third and fourth stages begin charging the battery as solar advantages take over.',
    challengeHeading: 'What traditional power keeps costing',
    advantageHeading: 'What solar starts improving',
    liveTakeawayLabel: 'Live takeaway',
    challengeStages: [
      {
        phase: 'Scroll 01',
        title: 'Tariff pressure keeps stacking',
        description: 'Grid-only power leaves you exposed to rising tariffs and unstable daytime supply when usage is highest.',
        statValue: '8-15%',
        statLabel: 'Annual tariff pressure many businesses face',
      },
      {
        phase: 'Scroll 02',
        title: 'Backup power keeps burning cash',
        description: 'Generators reduce outage pain with noise, fuel logistics, and recurring maintenance that compounds monthly.',
        statValue: 'Fuel + service',
        statLabel: 'Ongoing operating burden of conventional backup power',
      },
    ],
    advantageStages: [
      {
        phase: 'Scroll 03',
        title: 'Solar begins offsetting peak demand',
        description: 'Solar converts your roof into a productive asset that cuts the most expensive daytime consumption first.',
        statValue: '50%',
        statLabel: 'Battery charge after the first solar gain stage',
      },
      {
        phase: 'Scroll 04',
        title: 'Storage turns savings into resilience',
        description: 'Battery-backed solar delivers silent reserve power, stronger savings, and long-term operational control.',
        statValue: '100%',
        statLabel: 'Battery charge when the solar story fully lands',
      },
    ],
  },
  team: {
    eyebrow: 'Our Team',
    title: 'Meet the Experts',
    members: [
      { name: 'Lead Engineer', role: 'System Design', img: 'https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=600' },
      { name: 'Project Manager', role: 'Operations', img: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?q=80' },
      { name: 'Technical Lead', role: 'Installation', img: 'https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?q=80' },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Transparent system pricing with subsidy visibility',
    description: 'Indicative package pricing for common residential capacities. Final estimates depend on site conditions, panel layout, and battery scope.',
    plans: [
      {
        capacity: '2 kWh',
        price: '125,000',
        subsidy: '110,000',
        centerSubsidy: '60,000',
        stateSubsidy: '50,000',
        note: 'Best for compact homes starting their solar transition.',
      },
      {
        capacity: '3 kWh',
        price: '180,000',
        subsidy: '78,000',
        centerSubsidy: 'Included',
        stateSubsidy: 'Included',
        note: 'Balanced sizing for small families with daytime appliance usage.',
      },
      {
        capacity: '5 kWh',
        price: '260,000',
        subsidy: '78,000',
        centerSubsidy: 'Included',
        stateSubsidy: 'Included',
        note: 'Stronger output for larger homes and businesses with higher loads.',
      },
    ],
  },
  urgency: {
    eyebrow: 'Limited install windows',
    title: 'Every billing cycle you delay is another month your roof does nothing for you.',
    description: 'Solar economics improve when you move early. Secure a consultation now and make room for better planning, better placement, and earlier savings before seasonal demand compresses installation schedules.',
    signals: [
      'Electricity tariffs are still trending upward, so every delayed month is another high bill absorbed in full.',
      'Installation calendars fill fastest before peak summer demand, especially for larger commercial sites.',
      'Early consultations give more room for better panel placement, battery sizing, and phased expansion planning.',
    ],
    slotsTitle: 'Next available review slots',
    residentialSlots: '07',
    residentialLabel: 'Residential consultations this month',
    commercialSlots: '03',
    commercialLabel: 'Commercial audit windows remaining',
    primaryCtaLabel: 'Claim a Consultation Slot',
    primaryCtaHref: '#contact',
    secondaryCtaLabel: 'Call the Team Now',
    secondaryCtaHref: 'tel:+910000000000',
  },
  contact: {
    eyebrow: 'Contact Us',
    title: 'Tell us about your property and energy needs',
    description: 'Share your location, average electricity usage, and whether you need battery backup. We will come back with the right next step.',
    phone: '+91 00000 00000',
    email: 'hello@yksolarworks.com',
    hours: 'Office hours: Mon-Sat, 09:00 - 18:00',
    coverage: 'Service coverage for residential, commercial, and institutional solar installations.',
    responseTips: [
      'Your latest electricity bill range',
      'Roof type and available installation area',
      'Whether you want battery backup included',
    ],
    socialLinks: [
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Twitter', url: '#' },
      { platform: 'Instagram', url: '#' },
      { platform: 'Facebook', url: '#' },
    ],
  },
  footer: {
    description: 'Reliable energy, professional engineering, and systems built to last.',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Why Solar', href: '#why-solar' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ],
  },
};

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export const cloneSiteContent = (value = defaultSiteContent) => JSON.parse(JSON.stringify(value));

export const mergeSiteContent = (defaults, overrides) => {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(overrides) || overrides.length === 0) {
      return cloneSiteContent(defaults);
    }

    return Array.from({ length: Math.max(defaults.length, overrides.length) }, (_, index) => {
      const defaultItem = defaults[index];
      const item = overrides[index];

      if (item === undefined) {
        return cloneSiteContent(defaultItem);
      }

      if (defaultItem === undefined) {
        return cloneSiteContent(item);
      }

      if (isObject(defaultItem) && isObject(item)) {
        return mergeSiteContent(defaultItem, item);
      }

      return item;
    });
  }

  if (!isObject(defaults)) {
    return overrides ?? defaults;
  }

  const merged = { ...defaults };

  Object.keys(overrides || {}).forEach((key) => {
    if (!(key in defaults)) {
      return;
    }

    const defaultValue = defaults[key];
    const overrideValue = overrides[key];

    if (Array.isArray(defaultValue)) {
      merged[key] = mergeSiteContent(defaultValue, overrideValue);
      return;
    }

    if (isObject(defaultValue)) {
      merged[key] = mergeSiteContent(defaultValue, overrideValue || {});
      return;
    }

    merged[key] = overrideValue ?? defaultValue;
  });

  return merged;
};