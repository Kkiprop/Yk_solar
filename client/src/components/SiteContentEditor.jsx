const cloneValue = (value) => JSON.parse(JSON.stringify(value));

const updatePath = (source, path, value) => {
  const next = cloneValue(source);
  const keys = path.split('.');
  let current = next;

  keys.slice(0, -1).forEach((key) => {
    current = current[key];
  });

  current[keys[keys.length - 1]] = value;
  return next;
};

const updateArrayItem = (source, path, index, field, value) => {
  const next = cloneValue(source);
  const keys = path.split('.');
  let current = next;

  keys.forEach((key) => {
    current = current[key];
  });

  current[index][field] = value;
  return next;
};

const updateStringArrayItem = (source, path, index, value) => {
  const next = cloneValue(source);
  const keys = path.split('.');
  let current = next;

  keys.forEach((key) => {
    current = current[key];
  });

  current[index] = value;
  return next;
};

function EditorCard({ title, description, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-sm sm:p-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-slate-950">{title}</h3>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}

export function SiteContentEditor({ siteContent, setSiteContent, onSave, saving, status }) {
  const handleFieldChange = (path) => (event) => {
    setSiteContent((current) => updatePath(current, path, event.target.value));
  };

  const handleArrayFieldChange = (path, index, field) => (event) => {
    setSiteContent((current) => updateArrayItem(current, path, index, field, event.target.value));
  };

  const handleStringArrayChange = (path, index) => (event) => {
    setSiteContent((current) => updateStringArrayItem(current, path, index, event.target.value));
  };

  return (
    <section className="mt-6">
      <form className="glass-panel p-6" onSubmit={onSave}>
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow-chip">Section editor</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Edit homepage sections
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Update the copy, cards, links, pricing, team, and contact details that appear across the landing page.
            </p>
          </div>
          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? 'Saving sections...' : 'Save section content'}
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <EditorCard title="Navigation & Hero" description="Top navigation links and the main hero banner.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Navbar CTA label">
                <input className="field-input" value={siteContent.nav.ctaLabel} onChange={handleFieldChange('nav.ctaLabel')} />
              </Field>
              <Field label="Navbar CTA target">
                <input className="field-input" value={siteContent.nav.ctaHref} onChange={handleFieldChange('nav.ctaHref')} />
              </Field>
              <div className="rounded-[22px] bg-brand-moss/45 px-4 py-4 text-sm leading-6 text-slate-700">
                Navbar links, the send inquiry CTA, hero CTAs, hero image, and hero highlight all update live from this form after save.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {siteContent.nav.links.map((link, index) => (
                <div key={`${link.label}-${index}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label={`Nav label ${index + 1}`}>
                    <input className="field-input" value={link.label} onChange={handleArrayFieldChange('nav.links', index, 'label')} />
                  </Field>
                  <Field label={`Nav target ${index + 1}`}>
                    <input className="field-input" value={link.href} onChange={handleArrayFieldChange('nav.links', index, 'href')} />
                  </Field>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero eyebrow">
                <input className="field-input" value={siteContent.hero.eyebrow} onChange={handleFieldChange('hero.eyebrow')} />
              </Field>
              <Field label="Hero image URL">
                <input className="field-input" value={siteContent.hero.imageUrl} onChange={handleFieldChange('hero.imageUrl')} />
              </Field>
            </div>

            <Field label="Hero title">
              <textarea className="field-input min-h-[110px] resize-y" value={siteContent.hero.title} onChange={handleFieldChange('hero.title')} />
            </Field>

            <Field label="Hero description">
              <textarea className="field-input min-h-[120px] resize-y" value={siteContent.hero.description} onChange={handleFieldChange('hero.description')} />
            </Field>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Primary CTA label">
                <input className="field-input" value={siteContent.hero.primaryCtaLabel} onChange={handleFieldChange('hero.primaryCtaLabel')} />
              </Field>
              <Field label="Primary CTA target">
                <input className="field-input" value={siteContent.hero.primaryCtaHref} onChange={handleFieldChange('hero.primaryCtaHref')} />
              </Field>
              <Field label="Secondary CTA label">
                <input className="field-input" value={siteContent.hero.secondaryCtaLabel} onChange={handleFieldChange('hero.secondaryCtaLabel')} />
              </Field>
              <Field label="Secondary CTA target">
                <input className="field-input" value={siteContent.hero.secondaryCtaHref} onChange={handleFieldChange('hero.secondaryCtaHref')} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero highlight value">
                <input className="field-input" value={siteContent.hero.highlightValue} onChange={handleFieldChange('hero.highlightValue')} />
              </Field>
              <Field label="Hero highlight label">
                <input className="field-input" value={siteContent.hero.highlightLabel} onChange={handleFieldChange('hero.highlightLabel')} />
              </Field>
            </div>
          </EditorCard>

          <EditorCard title="Metrics & About" description="Homepage stat cards and About section details.">
            <div className="grid gap-4 md:grid-cols-3">
              {siteContent.metrics.map((metric, index) => (
                <div key={`metric-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label={`Metric ${index + 1} value`}>
                    <input className="field-input" value={metric.value} onChange={handleArrayFieldChange('metrics', index, 'value')} />
                  </Field>
                  <Field label={`Metric ${index + 1} label`}>
                    <input className="field-input" value={metric.label} onChange={handleArrayFieldChange('metrics', index, 'label')} />
                  </Field>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="About eyebrow">
                <input className="field-input" value={siteContent.about.eyebrow} onChange={handleFieldChange('about.eyebrow')} />
              </Field>
              <Field label="About title">
                <input className="field-input" value={siteContent.about.title} onChange={handleFieldChange('about.title')} />
              </Field>
            </div>

            <Field label="About description">
              <textarea className="field-input min-h-[120px] resize-y" value={siteContent.about.description} onChange={handleFieldChange('about.description')} />
            </Field>

            <Field label="About body text">
              <textarea className="field-input min-h-[140px] resize-y" value={siteContent.about.body} onChange={handleFieldChange('about.body')} />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              {siteContent.about.stats.map((stat, index) => (
                <div key={`about-stat-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label={`About stat ${index + 1} value`}>
                    <input className="field-input" value={stat.value} onChange={handleArrayFieldChange('about.stats', index, 'value')} />
                  </Field>
                  <Field label={`About stat ${index + 1} label`}>
                    <input className="field-input" value={stat.label} onChange={handleArrayFieldChange('about.stats', index, 'label')} />
                  </Field>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {siteContent.about.highlights.map((highlight, index) => (
                <div key={`about-highlight-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label={`Highlight ${index + 1} title`}>
                    <input className="field-input" value={highlight.title} onChange={handleArrayFieldChange('about.highlights', index, 'title')} />
                  </Field>
                  <Field label={`Highlight ${index + 1} description`}>
                    <textarea className="field-input min-h-[120px] resize-y" value={highlight.description} onChange={handleArrayFieldChange('about.highlights', index, 'description')} />
                  </Field>
                </div>
              ))}
            </div>
          </EditorCard>

          <EditorCard title="Services" description="Heading copy and service cards shown on the landing page.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Services eyebrow">
                <input className="field-input" value={siteContent.services.eyebrow} onChange={handleFieldChange('services.eyebrow')} />
              </Field>
              <Field label="Services title">
                <input className="field-input" value={siteContent.services.title} onChange={handleFieldChange('services.title')} />
              </Field>
            </div>

            <Field label="Services description">
              <textarea className="field-input min-h-[110px] resize-y" value={siteContent.services.description} onChange={handleFieldChange('services.description')} />
            </Field>

            <div className="grid gap-4 lg:grid-cols-2">
              {siteContent.services.items.map((item, index) => (
                <div key={`service-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label={`Service ${index + 1} title`}>
                    <input className="field-input" value={item.title} onChange={handleArrayFieldChange('services.items', index, 'title')} />
                  </Field>
                  <Field label={`Service ${index + 1} image URL`}>
                    <input className="field-input" value={item.imageUrl} onChange={handleArrayFieldChange('services.items', index, 'imageUrl')} />
                  </Field>
                  <Field label={`Service ${index + 1} description`}>
                    <textarea className="field-input min-h-[120px] resize-y" value={item.description} onChange={handleArrayFieldChange('services.items', index, 'description')} />
                  </Field>
                </div>
              ))}
            </div>
          </EditorCard>

          <EditorCard title="Projects" description="Portfolio section copy and fallback image used for project cards without a custom image.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Projects eyebrow">
                <input className="field-input" value={siteContent.projects.eyebrow} onChange={handleFieldChange('projects.eyebrow')} />
              </Field>
              <Field label="Projects title">
                <input className="field-input" value={siteContent.projects.title} onChange={handleFieldChange('projects.title')} />
              </Field>
            </div>

            <Field label="Projects description">
              <textarea className="field-input min-h-[110px] resize-y" value={siteContent.projects.description} onChange={handleFieldChange('projects.description')} />
            </Field>

            <Field label="Empty state message">
              <textarea className="field-input min-h-[110px] resize-y" value={siteContent.projects.emptyState} onChange={handleFieldChange('projects.emptyState')} />
            </Field>

            <Field label="Fallback image URL">
              <input className="field-input" value={siteContent.projects.fallbackImageUrl} onChange={handleFieldChange('projects.fallbackImageUrl')} />
            </Field>
          </EditorCard>

          <EditorCard title="Why Solar" description="Scroll sequence, battery section headings, and stage copy.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Why Solar eyebrow">
                <input className="field-input" value={siteContent.whySolar.eyebrow} onChange={handleFieldChange('whySolar.eyebrow')} />
              </Field>
              <Field label="Why Solar title">
                <input className="field-input" value={siteContent.whySolar.title} onChange={handleFieldChange('whySolar.title')} />
              </Field>
            </div>

            <Field label="Why Solar description">
              <textarea className="field-input min-h-[120px] resize-y" value={siteContent.whySolar.description} onChange={handleFieldChange('whySolar.description')} />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Challenges heading">
                <input className="field-input" value={siteContent.whySolar.challengeHeading} onChange={handleFieldChange('whySolar.challengeHeading')} />
              </Field>
              <Field label="Advantages heading">
                <input className="field-input" value={siteContent.whySolar.advantageHeading} onChange={handleFieldChange('whySolar.advantageHeading')} />
              </Field>
              <Field label="Live takeaway label">
                <input className="field-input" value={siteContent.whySolar.liveTakeawayLabel} onChange={handleFieldChange('whySolar.liveTakeawayLabel')} />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {siteContent.whySolar.challengeStages.map((item, index) => (
                <div key={`challenge-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <h4 className="font-display text-xl font-bold text-slate-950">Challenge stage {index + 1}</h4>
                  <div className="mt-4 grid gap-4">
                    <Field label="Phase label">
                      <input className="field-input" value={item.phase} onChange={handleArrayFieldChange('whySolar.challengeStages', index, 'phase')} />
                    </Field>
                    <Field label="Title">
                      <input className="field-input" value={item.title} onChange={handleArrayFieldChange('whySolar.challengeStages', index, 'title')} />
                    </Field>
                    <Field label="Description">
                      <textarea className="field-input min-h-[120px] resize-y" value={item.description} onChange={handleArrayFieldChange('whySolar.challengeStages', index, 'description')} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Stat value">
                        <input className="field-input" value={item.statValue} onChange={handleArrayFieldChange('whySolar.challengeStages', index, 'statValue')} />
                      </Field>
                      <Field label="Stat label">
                        <input className="field-input" value={item.statLabel} onChange={handleArrayFieldChange('whySolar.challengeStages', index, 'statLabel')} />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {siteContent.whySolar.advantageStages.map((item, index) => (
                <div key={`advantage-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <h4 className="font-display text-xl font-bold text-slate-950">Advantage stage {index + 1}</h4>
                  <div className="mt-4 grid gap-4">
                    <Field label="Phase label">
                      <input className="field-input" value={item.phase} onChange={handleArrayFieldChange('whySolar.advantageStages', index, 'phase')} />
                    </Field>
                    <Field label="Title">
                      <input className="field-input" value={item.title} onChange={handleArrayFieldChange('whySolar.advantageStages', index, 'title')} />
                    </Field>
                    <Field label="Description">
                      <textarea className="field-input min-h-[120px] resize-y" value={item.description} onChange={handleArrayFieldChange('whySolar.advantageStages', index, 'description')} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Stat value">
                        <input className="field-input" value={item.statValue} onChange={handleArrayFieldChange('whySolar.advantageStages', index, 'statValue')} />
                      </Field>
                      <Field label="Stat label">
                        <input className="field-input" value={item.statLabel} onChange={handleArrayFieldChange('whySolar.advantageStages', index, 'statLabel')} />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </EditorCard>

          <EditorCard title="Team & Pricing" description="Team member cards and pricing packages.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Team eyebrow">
                <input className="field-input" value={siteContent.team.eyebrow} onChange={handleFieldChange('team.eyebrow')} />
              </Field>
              <Field label="Team title">
                <input className="field-input" value={siteContent.team.title} onChange={handleFieldChange('team.title')} />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {siteContent.team.members.map((member, index) => (
                <div key={`team-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label="Name">
                    <input className="field-input" value={member.name} onChange={handleArrayFieldChange('team.members', index, 'name')} />
                  </Field>
                  <Field label="Role">
                    <input className="field-input" value={member.role} onChange={handleArrayFieldChange('team.members', index, 'role')} />
                  </Field>
                  <Field label="Image URL">
                    <input className="field-input" value={member.img} onChange={handleArrayFieldChange('team.members', index, 'img')} />
                  </Field>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Pricing eyebrow">
                <input className="field-input" value={siteContent.pricing.eyebrow} onChange={handleFieldChange('pricing.eyebrow')} />
              </Field>
              <Field label="Pricing title">
                <input className="field-input" value={siteContent.pricing.title} onChange={handleFieldChange('pricing.title')} />
              </Field>
            </div>

            <Field label="Pricing description">
              <textarea className="field-input min-h-[110px] resize-y" value={siteContent.pricing.description} onChange={handleFieldChange('pricing.description')} />
            </Field>

            <div className="grid gap-4 lg:grid-cols-3">
              {siteContent.pricing.plans.map((plan, index) => (
                <div key={`plan-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label="Capacity">
                    <input className="field-input" value={plan.capacity} onChange={handleArrayFieldChange('pricing.plans', index, 'capacity')} />
                  </Field>
                  <Field label="Price">
                    <input className="field-input" value={plan.price} onChange={handleArrayFieldChange('pricing.plans', index, 'price')} />
                  </Field>
                  <Field label="Total subsidy">
                    <input className="field-input" value={plan.subsidy} onChange={handleArrayFieldChange('pricing.plans', index, 'subsidy')} />
                  </Field>
                  <Field label="Center subsidy">
                    <input className="field-input" value={plan.centerSubsidy} onChange={handleArrayFieldChange('pricing.plans', index, 'centerSubsidy')} />
                  </Field>
                  <Field label="State subsidy">
                    <input className="field-input" value={plan.stateSubsidy} onChange={handleArrayFieldChange('pricing.plans', index, 'stateSubsidy')} />
                  </Field>
                  <Field label="Note">
                    <textarea className="field-input min-h-[110px] resize-y" value={plan.note} onChange={handleArrayFieldChange('pricing.plans', index, 'note')} />
                  </Field>
                </div>
              ))}
            </div>
          </EditorCard>

          <EditorCard title="Urgency" description="The urgency CTA, signals, and slot counters.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Urgency eyebrow">
                <input className="field-input" value={siteContent.urgency.eyebrow} onChange={handleFieldChange('urgency.eyebrow')} />
              </Field>
              <Field label="Urgency title">
                <input className="field-input" value={siteContent.urgency.title} onChange={handleFieldChange('urgency.title')} />
              </Field>
            </div>

            <Field label="Urgency description">
              <textarea className="field-input min-h-[120px] resize-y" value={siteContent.urgency.description} onChange={handleFieldChange('urgency.description')} />
            </Field>

            <div className="grid gap-4 lg:grid-cols-3">
              {siteContent.urgency.signals.map((signal, index) => (
                <Field key={`signal-${index + 1}`} label={`Signal ${index + 1}`}>
                  <textarea className="field-input min-h-[110px] resize-y" value={signal} onChange={handleStringArrayChange('urgency.signals', index)} />
                </Field>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Field label="Slots title">
                <input className="field-input" value={siteContent.urgency.slotsTitle} onChange={handleFieldChange('urgency.slotsTitle')} />
              </Field>
              <Field label="Residential slots">
                <input className="field-input" value={siteContent.urgency.residentialSlots} onChange={handleFieldChange('urgency.residentialSlots')} />
              </Field>
              <Field label="Residential label">
                <input className="field-input" value={siteContent.urgency.residentialLabel} onChange={handleFieldChange('urgency.residentialLabel')} />
              </Field>
              <Field label="Commercial slots">
                <input className="field-input" value={siteContent.urgency.commercialSlots} onChange={handleFieldChange('urgency.commercialSlots')} />
              </Field>
              <Field label="Commercial label">
                <input className="field-input" value={siteContent.urgency.commercialLabel} onChange={handleFieldChange('urgency.commercialLabel')} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Primary CTA label">
                <input className="field-input" value={siteContent.urgency.primaryCtaLabel} onChange={handleFieldChange('urgency.primaryCtaLabel')} />
              </Field>
              <Field label="Primary CTA target">
                <input className="field-input" value={siteContent.urgency.primaryCtaHref} onChange={handleFieldChange('urgency.primaryCtaHref')} />
              </Field>
              <Field label="Secondary CTA label">
                <input className="field-input" value={siteContent.urgency.secondaryCtaLabel} onChange={handleFieldChange('urgency.secondaryCtaLabel')} />
              </Field>
              <Field label="Secondary CTA target">
                <input className="field-input" value={siteContent.urgency.secondaryCtaHref} onChange={handleFieldChange('urgency.secondaryCtaHref')} />
              </Field>
            </div>
          </EditorCard>

          <EditorCard title="Contact & Footer" description="Contact block details, response tips, social links, and footer navigation.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Contact eyebrow">
                <input className="field-input" value={siteContent.contact.eyebrow} onChange={handleFieldChange('contact.eyebrow')} />
              </Field>
              <Field label="Contact title">
                <input className="field-input" value={siteContent.contact.title} onChange={handleFieldChange('contact.title')} />
              </Field>
            </div>

            <Field label="Contact description">
              <textarea className="field-input min-h-[120px] resize-y" value={siteContent.contact.description} onChange={handleFieldChange('contact.description')} />
            </Field>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Phone">
                <input className="field-input" value={siteContent.contact.phone} onChange={handleFieldChange('contact.phone')} />
              </Field>
              <Field label="Email">
                <input className="field-input" value={siteContent.contact.email} onChange={handleFieldChange('contact.email')} />
              </Field>
              <Field label="Hours">
                <input className="field-input" value={siteContent.contact.hours} onChange={handleFieldChange('contact.hours')} />
              </Field>
              <Field label="Coverage">
                <input className="field-input" value={siteContent.contact.coverage} onChange={handleFieldChange('contact.coverage')} />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {siteContent.contact.responseTips.map((tip, index) => (
                <Field key={`tip-${index + 1}`} label={`Response tip ${index + 1}`}>
                  <textarea className="field-input min-h-[110px] resize-y" value={tip} onChange={handleStringArrayChange('contact.responseTips', index)} />
                </Field>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {siteContent.contact.socialLinks.map((link, index) => (
                <div key={`social-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label="Platform">
                    <input className="field-input" value={link.platform} onChange={handleArrayFieldChange('contact.socialLinks', index, 'platform')} />
                  </Field>
                  <Field label="URL">
                    <input className="field-input" value={link.url} onChange={handleArrayFieldChange('contact.socialLinks', index, 'url')} />
                  </Field>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Footer description">
                <textarea className="field-input min-h-[120px] resize-y" value={siteContent.footer.description} onChange={handleFieldChange('footer.description')} />
              </Field>
              <Field label="Footer staff portal label">
                <input className="field-input" value={siteContent.footer.adminLinkLabel} onChange={handleFieldChange('footer.adminLinkLabel')} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Footer staff portal target">
                <input className="field-input" value={siteContent.footer.adminLinkHref} onChange={handleFieldChange('footer.adminLinkHref')} />
              </Field>
              <div className="rounded-[22px] bg-brand-moss/45 px-4 py-4 text-sm leading-6 text-slate-700">
                Footer links, the staff portal link, and contact details will update the public site after you save section content.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {siteContent.footer.links.map((link, index) => (
                <div key={`footer-link-${index + 1}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <Field label={`Footer link ${index + 1} label`}>
                    <input className="field-input" value={link.label} onChange={handleArrayFieldChange('footer.links', index, 'label')} />
                  </Field>
                  <Field label={`Footer link ${index + 1} target`}>
                    <input className="field-input" value={link.href} onChange={handleArrayFieldChange('footer.links', index, 'href')} />
                  </Field>
                </div>
              ))}
            </div>
          </EditorCard>
        </div>

        {status ? <p className="mt-5 text-sm text-slate-600">{status}</p> : null}
      </form>
    </section>
  );
}

export default SiteContentEditor;