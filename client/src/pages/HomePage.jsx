import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaTwitter,
} from 'react-icons/fa';

import brandMark from '../assets/YK_Solarworks_Logo_flat.png';
import SectionHeading from '../components/SectionHeading';
import { api } from '../lib/api';
import { defaultSiteContent, mergeSiteContent } from '../lib/defaultSiteContent';

const socialIconMap = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

const getSocialIcon = (platform = '') => socialIconMap[platform.toLowerCase()] || null;

const formatAmount = (value) => (/^[\d,]+$/.test(value) ? `Rs. ${value}` : value);

const metrics = [
  { value: '120+', label: 'Projects delivered' },
  { value: '92%', label: 'Avg. bill reduction' },
  { value: '25 years', label: 'Performance life' },
];

const aboutHighlights = [
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
];

const challengeStages = [
  {
    phase: 'Scroll 01',
    title: 'Tariff pressure keeps stacking',
    disadvantage: 'Grid-only power leaves you exposed to rising tariffs and unstable daytime supply when usage is highest.',
    statValue: '8-15%',
    statLabel: 'Annual tariff pressure many businesses face',
  },
  {
    phase: 'Scroll 02',
    title: 'Backup power keeps burning cash',
    disadvantage: 'Generators reduce outage pain with noise, fuel logistics, and recurring maintenance that compounds monthly.',
    statValue: 'Fuel + service',
    statLabel: 'Ongoing operating burden of conventional backup power',
  },
];

const advantageStages = [
  {
    phase: 'Scroll 03',
    title: 'Solar begins offsetting peak demand',
    advantage: 'Solar converts your roof into a productive asset that cuts the most expensive daytime consumption first.',
    statValue: '50%',
    statLabel: 'Battery charge after the first solar gain stage',
  },
  {
    phase: 'Scroll 04',
    title: 'Storage turns savings into resilience',
    advantage: 'Battery-backed solar delivers silent reserve power, stronger savings, and long-term operational control.',
    statValue: '100%',
    statLabel: 'Battery charge when the solar story fully lands',
  },
];

const solarTimeline = [
  {
    phase: 'Scroll 01',
    title: challengeStages[0].title,
    summary: challengeStages[0].disadvantage,
    statValue: challengeStages[0].statValue,
    statLabel: challengeStages[0].statLabel,
    chargePercent: 0,
  },
  {
    phase: 'Scroll 02',
    title: challengeStages[1].title,
    summary: challengeStages[1].disadvantage,
    statValue: challengeStages[1].statValue,
    statLabel: challengeStages[1].statLabel,
    chargePercent: 0,
  },
  {
    phase: 'Scroll 03',
    title: advantageStages[0].title,
    summary: advantageStages[0].advantage,
    statValue: advantageStages[0].statValue,
    statLabel: advantageStages[0].statLabel,
    chargePercent: 50,
  },
  {
    phase: 'Scroll 04',
    title: advantageStages[1].title,
    summary: advantageStages[1].advantage,
    statValue: advantageStages[1].statValue,
    statLabel: advantageStages[1].statLabel,
    chargePercent: 100,
  },
];

const urgencySignals = [
  'Electricity tariffs are still trending upward, so every delayed month is another high bill absorbed in full.',
  'Installation calendars fill fastest before peak summer demand, especially for larger commercial sites.',
  'Early consultations give more room for better panel placement, battery sizing, and phased expansion planning.',
];

const pricingPlans = [
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
];

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Why Solar', href: '#why-solar' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const team = [
  { name: 'Lead Engineer', role: 'System Design', img: 'https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=600' },
  { name: 'Project Manager', role: 'Operations', img: 'https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?q=80' },
  { name: 'Technical Lead', role: 'Installation', img: 'https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?q=80' },
];

export function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [solarProgress, setSolarProgress] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    systemSize: '',
    location: '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState('');
  const [contactSaving, setContactSaving] = useState(false);
  const solarStoryRef = useRef(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      const [postsResponse, siteContentResponse] = await Promise.allSettled([
        api.get('/posts'),
        api.get('/site-content'),
      ]);

      if (postsResponse.status === 'fulfilled') {
        setPosts(postsResponse.value.data);
      } else {
        console.error('Unable to load posts', postsResponse.reason);
      }

      if (siteContentResponse.status === 'fulfilled') {
        setSiteContent(mergeSiteContent(defaultSiteContent, siteContentResponse.value.data));
      } else {
        console.error('Unable to load site content', siteContentResponse.reason);
      }

      setLoading(false);
    };

    fetchHomepageData();
  }, []);

  useEffect(() => {
    const updateSolarProgress = () => {
      if (!solarStoryRef.current) {
        return;
      }

      const rect = solarStoryRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travel = rect.height + viewportHeight * 0.25;
      const progress = (viewportHeight - rect.top) / travel;
      const nextProgress = Math.min(Math.max(progress, 0), 1);

      setSolarProgress((current) => (Math.abs(current - nextProgress) > 0.01 ? nextProgress : current));
    };

    updateSolarProgress();
    window.addEventListener('scroll', updateSolarProgress, { passive: true });
    window.addEventListener('resize', updateSolarProgress);

    return () => {
      window.removeEventListener('scroll', updateSolarProgress);
      window.removeEventListener('resize', updateSolarProgress);
    };
  }, []);

  const navLinks = siteContent.nav.links;
  const heroContent = siteContent.hero;
  const metricItems = siteContent.metrics;
  const aboutContent = siteContent.about;
  const servicesContent = siteContent.services;
  const whySolarContent = siteContent.whySolar;
  const teamContent = siteContent.team;
  const pricingContent = siteContent.pricing;
  const urgencyContent = siteContent.urgency;
  const contactContent = siteContent.contact;
  const footerContent = siteContent.footer;
  const challengeItems = whySolarContent.challengeStages;
  const advantageItems = whySolarContent.advantageStages;
  const solarTimelineItems = [
    ...challengeItems.map((item) => ({
      phase: item.phase,
      title: item.title,
      summary: item.description,
      statValue: item.statValue,
      statLabel: item.statLabel,
      chargePercent: 0,
    })),
    ...advantageItems.map((item, index) => ({
      phase: item.phase,
      title: item.title,
      summary: item.description,
      statValue: item.statValue,
      statLabel: item.statLabel,
      chargePercent: Math.round(((index + 1) / Math.max(advantageItems.length, 1)) * 100),
    })),
  ];
  const activeStoryIndex = Math.min(
    solarTimelineItems.length - 1,
    Math.floor(solarProgress * solarTimelineItems.length),
  );
  const activeStory = solarTimelineItems[activeStoryIndex];
  const batterySegments = 6;
  const batteryCharge = activeStory.chargePercent;
  const filledSegments = Math.round((batteryCharge / 100) * batterySegments);
  const revealedChallenges = Math.min(activeStoryIndex + 1, challengeItems.length);
  const revealedAdvantages = Math.max(activeStoryIndex - challengeItems.length + 1, 0);

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContactSaving(true);
    setContactStatus('');

    try {
      await api.post('/contact-inquiries', contactForm);
      setContactForm({
        name: '',
        phone: '',
        email: '',
        systemSize: '',
        location: '',
        message: '',
      });
      setContactStatus('Inquiry sent successfully. The team will reach out shortly.');
    } catch (error) {
      console.error('Unable to submit contact inquiry', error);
      setContactStatus(error.response?.data?.message || 'Unable to send inquiry right now. Please try again.');
    } finally {
      setContactSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header>
        <nav className="glass-panel relative z-20 flex flex-col gap-5 rounded-[28px] px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <img src={brandMark} alt="YK Solarworks brand" className="h-16 w-auto object-contain sm:h-[72px]" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 sm:gap-6">
            {navLinks.map((link) => (
              <a key={`${link.label}-${link.href}`} className="transition hover:text-slate-950" href={link.href}>
                {link.label}
              </a>
            ))}
            <Link to="/admin" className="ghost-btn px-4 py-2 text-sm">
              {siteContent.nav.adminLabel}
            </Link>
          </div>
        </nav>

        <div className="relative mt-6 overflow-hidden rounded-[36px] border border-white/60 bg-white/65 px-5 py-6 shadow-glow backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-brand-moss/70 via-white/10 to-transparent" />

          <div className="relative z-10 grid gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
            <div className="max-w-2xl">
              <span className="eyebrow-chip">{heroContent.eyebrow}</span>
              <h1 className="mt-5 max-w-[11ch] font-display text-5xl font-bold leading-[0.92] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
                {heroContent.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                {heroContent.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a className="primary-btn" href={heroContent.primaryCtaHref}>
                  {heroContent.primaryCtaLabel} <FaArrowRight />
                </a>
                <a className="secondary-btn" href={heroContent.secondaryCtaHref}>
                  {heroContent.secondaryCtaLabel}
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="glass-panel overflow-hidden rounded-[32px] p-3">
                <img
                  src={heroContent.imageUrl}
                  alt="Solar installation"
                  className="h-[420px] w-full rounded-[24px] object-cover md:h-[520px]"
                />
              </div>
              <div className="absolute -bottom-4 left-4 glass-panel rounded-[24px] px-5 py-4">
                <strong className="block font-display text-4xl font-bold text-slate-950">{heroContent.highlightValue}</strong>
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-leaf">
                  {heroContent.highlightLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="mt-8 grid gap-4 rounded-[32px] border border-white/60 bg-slate-950 px-5 py-6 shadow-glow sm:grid-cols-3 sm:px-8">
          {metricItems.map((m) => (
            <div key={m.label} className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-5">
              <span className="block font-display text-4xl font-bold text-white">{m.value}</span>
              <span className="mt-2 block text-sm uppercase tracking-[0.18em] text-white/70">
                {m.label}
              </span>
            </div>
          ))}
        </section>

        <section id="about" className="py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] lg:items-start">
            <div className="glass-panel rounded-[32px] p-8">
              <SectionHeading
                eyebrow={aboutContent.eyebrow}
                title={aboutContent.title}
                description={aboutContent.description}
              />
              <p className="mt-6 text-base leading-8 text-slate-600">
                {aboutContent.body}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {aboutContent.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className={`rounded-[24px] px-5 py-5 ${index === 0 ? 'bg-brand-moss/65' : 'bg-white shadow-sm'}`}>
                    <strong className="block font-display text-3xl font-bold text-slate-950">{stat.value}</strong>
                    <span className="mt-2 block text-sm font-semibold uppercase tracking-[0.16em] text-brand-leaf">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              {aboutContent.highlights.map((item) => (
                <article key={item.title} className="glass-panel rounded-[28px] p-6">
                  <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-leaf">
                    YK standard
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="py-20">
          <SectionHeading
            eyebrow={servicesContent.eyebrow}
            title={servicesContent.title}
            description={servicesContent.description}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {servicesContent.items.map((item) => (
              <div key={item.title} className="glass-panel overflow-hidden rounded-[30px]">
                <img src={item.imageUrl} alt={item.title} className="h-72 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="why-solar" ref={solarStoryRef} className="relative mt-2 min-h-[260vh]">
          <div className="sticky top-5 rounded-[36px] border border-white/60 bg-white/75 px-5 py-12 shadow-glow backdrop-blur-xl sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow={whySolarContent.eyebrow}
              title={whySolarContent.title}
              description={whySolarContent.description}
              align="center"
            />

            <div className="mt-6 flex justify-center">
              <div className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
                {activeStory.phase} of {solarTimelineItems.length.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)_minmax(0,1fr)] lg:items-center">
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-slate-950">{whySolarContent.challengeHeading}</h3>
                <div className="space-y-3">
                  {challengeItems.map((item, index) => {
                    const isVisible = index < revealedChallenges;
                    const isActive = activeStoryIndex < challengeItems.length && index === activeStoryIndex;

                    return (
                      <div
                        key={item.phase}
                        className={`rounded-[24px] border px-4 py-4 transition duration-300 ${
                          isActive
                            ? 'border-rose-200 bg-rose-50 shadow-sm'
                            : isVisible
                              ? 'border-slate-200/80 bg-white/85 opacity-100'
                              : 'border-slate-200/50 bg-white/40 opacity-30'
                        }`}
                      >
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-500">
                          {item.phase}
                        </span>
                        <h4 className="mt-2 font-display text-lg font-bold text-slate-950">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative mx-auto flex w-full max-w-[320px] flex-col items-center">
                <div className="absolute inset-x-8 top-12 -z-10 h-44 rounded-full bg-brand-green/15 blur-3xl" />
                <div className="mb-5 rounded-full bg-brand-moss px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-brand-leaf">
                  {activeStory.phase}
                </div>
                <div className="relative w-full rounded-[36px] border-[10px] border-slate-950 bg-slate-950/95 px-5 pb-5 pt-8 shadow-[0_32px_80px_rgba(15,23,42,0.28)]">
                  <div className="absolute left-1/2 top-[-18px] h-4 w-20 -translate-x-1/2 rounded-t-2xl bg-slate-950" />
                  <div className="relative flex h-[420px] items-end overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4">
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-b-[20px] bg-gradient-to-t from-brand-green via-lime-300 to-emerald-100 transition-all duration-500"
                      style={{ height: `${batteryCharge}%` }}
                    />
                    <div className="relative z-10 grid w-full gap-3">
                      {Array.from({ length: batterySegments }).map((_, index) => {
                        const isFilled = index < filledSegments;

                        return (
                          <div
                            key={`segment-${index + 1}`}
                            className={`h-12 rounded-2xl border transition duration-300 ${
                              isFilled
                                ? 'border-white/70 bg-white/25 shadow-[0_0_24px_rgba(226,255,184,0.55)]'
                                : 'border-white/10 bg-white/5'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-5 w-full rounded-[28px] border border-brand-moss/70 bg-brand-moss/70 px-5 py-5 text-center shadow-sm">
                  <strong className="block font-display text-4xl font-bold text-slate-950">{activeStory.statValue}</strong>
                  <span className="mt-2 block text-sm font-semibold leading-6 text-slate-700">
                    {activeStory.statLabel}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-slate-950">{whySolarContent.advantageHeading}</h3>
                <div className="space-y-3">
                  {advantageItems.map((item, index) => {
                    const isVisible = index < revealedAdvantages;
                    const isActive = activeStoryIndex >= challengeItems.length && index === activeStoryIndex - challengeItems.length;

                    return (
                      <div
                        key={`${item.phase}-advantage`}
                        className={`rounded-[24px] border px-4 py-4 transition duration-300 ${
                          isActive
                            ? 'border-brand-moss bg-brand-moss/70 shadow-sm'
                            : isVisible
                              ? 'border-slate-200/80 bg-white/85 opacity-100'
                              : 'border-slate-200/50 bg-white/40 opacity-30'
                        }`}
                      >
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-leaf">
                          {item.phase}
                        </span>
                        <h4 className="mt-2 font-display text-lg font-bold text-slate-950">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-moss">
                    {whySolarContent.liveTakeawayLabel}
                  </span>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-white/80">
                    {activeStory.summary}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80">
                  Battery charge: {batteryCharge}%
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[36px] border border-brand-moss/60 bg-gradient-to-br from-brand-moss/50 via-white/65 to-white/40 px-5 py-16 shadow-glow sm:px-8">
          <SectionHeading eyebrow={teamContent.eyebrow} title={teamContent.title} align="center" />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {teamContent.members.map((member) => (
              <div key={member.name} className="glass-panel flex flex-col items-center p-6 text-center">
                <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-white/80">
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <h4 className="mt-5 font-display text-xl font-bold text-slate-950">{member.name}</h4>
                <span className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-leaf">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="projects"
          className="mt-10 rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-16 shadow-glow sm:px-8"
        >
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent Installations"
            description="Real results from our latest deployments across the region."
          />

          {loading ? (
            <p className="mt-8 text-base text-white/70">Loading projects...</p>
          ) : posts.length === 0 ? (
            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 text-white/75">
              No published projects yet. Use the admin dashboard to add the first one.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post._id} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-xl backdrop-blur-lg">
                  <div className="overflow-hidden">
                    <img
                      src={
                        post.imageUrl ||
                        'https://media.istockphoto.com/id/1405880267/photo/two-engineers-installing-solar-panels-on-roof.webp?a=1&b=1&s=612x612'
                      }
                      alt={post.title}
                      className="h-60 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-moss">
                      {post.category}
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-white">{post.title}</h3>
                    <p className="mt-3 text-base leading-7 text-white/70">{post.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="pricing" className="mt-10 rounded-[36px] border border-white/60 bg-white/75 px-5 py-16 shadow-glow backdrop-blur-xl sm:px-8">
          <SectionHeading
            eyebrow={pricingContent.eyebrow}
            title={pricingContent.title}
            description={pricingContent.description}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricingContent.plans.map((plan) => (
              <article key={plan.capacity} className="glass-panel rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-leaf">
                      Solar package
                    </span>
                    <h3 className="mt-3 font-display text-3xl font-bold text-slate-950">{plan.capacity}</h3>
                  </div>
                  <span className="rounded-full bg-brand-moss px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-leaf">
                    Subsidy ready
                  </span>
                </div>

                <div className="mt-6 rounded-[24px] bg-slate-950 px-5 py-5 text-white">
                  <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-moss">System price</span>
                  <strong className="mt-3 block font-display text-4xl font-bold">{formatAmount(plan.price)}</strong>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
                    <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Total subsidy</span>
                    <strong className="mt-2 block text-2xl font-bold text-brand-leaf">{formatAmount(plan.subsidy)}</strong>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] bg-brand-moss/55 px-4 py-4">
                      <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-leaf">Center</span>
                      <p className="mt-2 text-base font-semibold text-slate-800">{formatAmount(plan.centerSubsidy)}</p>
                    </div>
                    <div className="rounded-[20px] bg-slate-100 px-4 py-4">
                      <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">State</span>
                      <p className="mt-2 text-base font-semibold text-slate-800">{formatAmount(plan.stateSubsidy)}</p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">{plan.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[36px] border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-brand-moss/40 px-5 py-14 shadow-glow sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <span className="eyebrow-chip bg-amber-100 text-amber-700">{urgencyContent.eyebrow}</span>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-[-0.05em] text-slate-950 md:text-5xl">
                {urgencyContent.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {urgencyContent.description}
              </p>
              <div className="mt-8 grid gap-3">
                {urgencyContent.signals.map((signal) => (
                  <div key={signal} className="rounded-[22px] border border-white/80 bg-white/85 px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm">
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[32px] p-7">
              <div className="rounded-[26px] bg-slate-950 px-5 py-5 text-white">
                <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-moss">
                  {urgencyContent.slotsTitle}
                </span>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
                    <strong className="block font-display text-3xl font-bold">{urgencyContent.residentialSlots}</strong>
                    <span className="text-sm text-white/70">{urgencyContent.residentialLabel}</span>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
                    <strong className="block font-display text-3xl font-bold">{urgencyContent.commercialSlots}</strong>
                    <span className="text-sm text-white/70">{urgencyContent.commercialLabel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <a className="primary-btn w-full" href={urgencyContent.primaryCtaHref}>
                  {urgencyContent.primaryCtaLabel} <FaArrowRight />
                </a>
                <a className="secondary-btn w-full" href={urgencyContent.secondaryCtaHref}>
                  {urgencyContent.secondaryCtaLabel}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="mt-10 rounded-[36px] border border-white/60 bg-white/75 px-5 py-12 shadow-glow backdrop-blur-xl sm:px-8"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)] lg:items-start">
            <div className="glass-panel rounded-[30px] p-6 sm:p-8">
              <SectionHeading
                eyebrow={contactContent.eyebrow}
                title={contactContent.title}
                description={contactContent.description}
              />

              <form className="mt-8 grid gap-4" onSubmit={handleContactSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Full name
                    <input className="field-input" type="text" name="name" placeholder="Your name" value={contactForm.name} onChange={handleContactChange} required />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Phone number
                    <input className="field-input" type="tel" name="phone" placeholder="+91 00000 00000" value={contactForm.phone} onChange={handleContactChange} required />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Email address
                    <input className="field-input" type="email" name="email" placeholder="you@example.com" value={contactForm.email} onChange={handleContactChange} required />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    System size
                    <select className="field-input" name="systemSize" value={contactForm.systemSize} onChange={handleContactChange}>
                      <option value="">
                        Select capacity
                      </option>
                      <option value="2kwh">2 kWh</option>
                      <option value="3kwh">3 kWh</option>
                      <option value="5kwh">5 kWh</option>
                      <option value="custom">Need custom sizing</option>
                    </select>
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Address / installation location
                  <input className="field-input" type="text" name="location" placeholder="City, area, or full site address" value={contactForm.location} onChange={handleContactChange} />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Project details
                  <textarea
                    className="field-input min-h-36 resize-y"
                    name="message"
                    placeholder="Tell us about your roof type, average bill, backup needs, or timeline."
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                  />
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button className="primary-btn" type="submit" disabled={contactSaving}>
                    {contactSaving ? 'Sending inquiry...' : <><span>Send Inquiry</span> <FaArrowRight /></>}
                  </button>
                  <a className="secondary-btn" href={`tel:${contactContent.phone}`}>
                    Call Directly
                  </a>
                </div>

                {contactStatus ? <p className="text-sm text-slate-600">{contactStatus}</p> : null}
              </form>
            </div>

            <div className="grid gap-5">
              <div className="glass-panel rounded-[30px] p-6">
                <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-leaf">
                  Contact details
                </span>
                <div className="mt-5 space-y-4 text-base text-slate-700">
                  <a className="flex items-center gap-3 font-semibold hover:text-brand-leaf" href={`tel:${contactContent.phone}`}>
                    <FaPhoneAlt className="text-brand-leaf" /> {contactContent.phone}
                  </a>
                  <a className="flex items-center gap-3 font-semibold hover:text-brand-leaf" href={`mailto:${contactContent.email}`}>
                    <FaEnvelope className="text-brand-leaf" /> {contactContent.email}
                  </a>
                  <p className="text-sm leading-7 text-slate-600">
                    {contactContent.hours}
                  </p>
                  <p className="text-sm leading-7 text-slate-600">
                    {contactContent.coverage}
                  </p>
                </div>
              </div>

              <div className="rounded-[30px] bg-slate-950 px-6 py-6 text-white shadow-glow">
                <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-moss">
                  Fastest response when you share
                </span>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-white/80">
                  {contactContent.responseTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 text-lg text-slate-600">
                {contactContent.socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);

                  return (
                    <a key={`${link.platform}-${link.url}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:text-brand-leaf" href={link.url} aria-label={link.platform}>
                      {Icon ? <Icon /> : <span className="text-xs font-bold uppercase">{link.platform.slice(0, 1)}</span>}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </section>

        <footer className="mt-10 rounded-[36px] border border-white/60 bg-white/75 px-5 py-10 shadow-glow backdrop-blur-xl sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h3 className="font-display text-3xl font-bold text-slate-950">YK Solarworks</h3>
              <p className="mt-3 max-w-lg text-base leading-7 text-slate-600">
                {footerContent.description}
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
              {footerContent.links.map((link) => (
                <a key={link.href} className="transition hover:text-slate-950" href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} YK Solarworks Pvt. Ltd. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}