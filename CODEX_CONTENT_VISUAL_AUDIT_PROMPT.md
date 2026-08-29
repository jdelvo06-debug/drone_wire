# DroneWire Track 2 Audit: Content, Information Quality, and Visual Product

Perform a **read-only audit** of DroneWire. Do not edit files, database records, images, configuration, or production. Do not commit, push, deploy, restart services, run migrations/seeds, send email, or perform external writes.

## Project

- Repo: `/Users/jeremydelvaux/projects/drone_wire/app`
- Continuity: `/Users/jeremydelvaux/projects/drone_wire/NEXTSESSION.md`
- Live site: `https://dronewire.org`
- Product: public Counter-UAS intelligence hub covering systems, articles, explainers, contracts, images, and related sources.

Read `AGENTS.md`, project docs, and `NEXTSESSION.md` first. Check `git status` and preserve all existing dirty work. Audit both the current local tree and the live site, clearly separating local behavior, deployed behavior, database state, and anything unverified. Never print secrets or full environment-variable values.

## Mission

Determine whether DroneWire is:

- Factually accurate and responsibly sourced
- Useful to C-UAS professionals and informed public readers
- Current and transparent about freshness
- Easy to search and navigate
- Visually credible as a professional intelligence product
- Usable on desktop, tablet, and mobile

This is primarily a **content, data-quality, editorial, image, visual, UX, accessibility, and discoverability audit**. Review code only when it affects those areas.

## Audit scope

### 1. Public product and information architecture

Review the homepage, navigation, About page, and major landing surfaces. Determine whether visitors can quickly understand what DroneWire is, who it serves, what information is available, how current it is, and what to do next. Flag stale, vague, misleading, unfinished, or unsupported claims.

### 2. Articles

Run read-only corpus-wide checks for:

- Current counts and category/tag distribution
- Duplicate and near-duplicate articles
- Missing titles, summaries, dates, source names, or source URLs
- Invalid/future dates and broken URLs
- Missing provenance
- Inconsistent source naming or taxonomy
- Unusually short/long or boilerplate content
- Suspiciously generic summaries
- Stale or abandoned records
- Articles that cannot render safely

Then review a defensible representative sample across recent/old articles, major topics, sources, categories, system-related stories, contract-related stories, and high-visibility records. Verify whether headlines and summaries match the source, dates and organizations are correct, qualifiers are preserved, claims are overstated, and source links work. Do not claim the entire corpus is factually verified from a sample.

### 3. Systems catalog

Audit the full catalog where practical. Check system names, manufacturers, variants, categories, detection/tracking/identification claims, electronic-warfare and kinetic claims, ranges/performance claims, descriptions, sources, related articles/contracts, duplicates, missing fields, naming consistency, and unsupported or ambiguous claims.

Pay special attention to the difference between detection, tracking, identification, targeting, electronic warfare, kinetic defeat, vendor claims, and independently verified capability. Flag unsupported claims rather than correcting them from memory.

### 4. Images

Review system and explainer images as factual information, not decoration. Check whether each image depicts the correct system/topic and variant, whether it is misleading or merely generic, whether the source/provenance is known, whether the URL works, whether it is hotlink-blocked or unstable, whether quality/cropping is acceptable, and whether alt text/captions are accurate. Review all images where practical or document the sampling method. Do not replace images.

Produce a ranked image list containing the record, current problem, correct visual target, preferred source type, and verification needed.

### 5. Explainers

Review every explainer for factual accuracy, source quality and recency, technical clarity, completeness, correct C-UAS terminology, distinction between facts/analysis/vendor claims, missing limitations, internal consistency, broken links, related content, image fit, SEO, mobile readability, and whether it answers the question implied by its title.

Flag legal, policy, authority, or rules-of-engagement claims that require direct official-source verification. Do not provide legal or operational authorization.

### 6. Contracts

Review titles, vendor/manufacturer names, agencies/offices, values, dates, status, descriptions, source URLs, duplicates, missing fields, and system relationships. Check whether records clearly distinguish awards, contract vehicles, task orders, modifications, announcements, and vendor claims. Verify sorting/filtering and whether the public presentation gives enough source context.

### 7. Search and discovery

Test realistic searches for known systems, manufacturers, radars, jammers, kinetic interceptors, broad topics, spelling variants, and terms with multiple results. Review search relevance, filters, sorting, pagination, empty states, related content, manufacturer navigation, and system/article/contract/explainer relationships. Identify information that exists but is hard for visitors to discover.

### 8. Visual and responsive UX

Use real browser rendering against production and local preview if available. Inspect at approximately 1440px, 768px, and 390px widths. Review homepage, article list/detail, systems list/detail, explainers list/detail, contracts, search, About/contact, and error/empty/loading states.

Evaluate visual hierarchy, brand identity, typography, spacing, contrast, information density, navigation, cards, tables, images, long titles, source/date visibility, related content, focus states, mobile navigation, horizontal overflow, clipping, broken images, layout shift, and whether the site feels maintained and credible for a professional C-UAS audience. Use screenshots or browser evidence where possible.

### 9. Accessibility, trust, and provenance presentation

Check heading structure, labels, buttons/links, alt text, keyboard access, focus visibility, contrast, tables, forms, mobile readability, touch targets, and error messaging. Verify that visitors can distinguish news from analysis, DroneWire commentary from source material, current from historical information, vendor claims from verified facts, and confirmed facts from estimates or incomplete data.

### 10. SEO and freshness

Review titles, descriptions, canonicals, Open Graph, article structured data, breadcrumbs, sitemap, robots, RSS, internal links, related content, image metadata, indexability, duplicate-content controls, redirects, 404 behavior, stale records, broken sources, outdated terminology, missing review/freshness signals, and whether users can judge when information was last updated.

## Evidence standard

For every meaningful finding include:

- ID and severity: P1/P2/P3/P4
- Area and affected record/page/route
- Exact evidence: file/line, database result, URL, screenshot, or browser observation
- Why it matters
- Recommended correction
- Verification method
- Confidence

Classify each item as a confirmed factual/content error, confirmed data-quality defect, confirmed visual/accessibility defect, confirmed discoverability problem, plausible concern requiring source verification, editorial recommendation, design recommendation, or unverified limitation. Do not inflate a sampled finding into a corpus-wide claim.

## Required report

Return:

1. Executive verdict on trustworthiness, usefulness, currency, discoverability, and visual credibility, with confidence and limitations.
2. Verified current inventory for articles, systems, explainers, contracts, images, feeds, taxonomy, and incomplete/broken records, including verification method.
3. Highest-priority content, factual, provenance, data-quality, image, visual, accessibility, and UX findings.
4. Separate summaries for articles, systems, explainers, contracts, images, search/discovery, freshness, and visual routes.
5. Route-by-route desktop/tablet/mobile status.
6. A phased remediation roadmap:
   - Trust blockers
   - Data-quality cleanup
   - Editorial/content improvement
   - Images and visual UX
   - Accessibility, discovery, and SEO
7. Bounded implementation packets for the roadmap. Each packet needs a goal, scope, affected records/routes/files, acceptance criteria, non-goals, verification method, risk, and whether database or production approval is required.
8. What is already working and should be preserved.
9. Unverified items and the access/tooling needed.
10. One recommended first remediation packet and why it comes first.

Remain read-only throughout. Do not edit, correct, delete, replace, publish, or deploy anything.
