-- =====================================================
-- DroneWire RLS (Row Level Security) Policies
-- =====================================================
-- Applied: January 2026
-- Purpose: Protect database tables from unauthorized direct Supabase API access
-- Note: Prisma uses postgres service role which bypasses RLS
-- =====================================================

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE explainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE explainer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ARTICLES: Public read (published only), anon can update views
-- =====================================================
CREATE POLICY "articles_anon_select" ON articles
  FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "articles_anon_update_views" ON articles
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "articles_service_all" ON articles
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- TAGS: Public read only
-- =====================================================
CREATE POLICY "tags_anon_select" ON tags
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "tags_service_all" ON tags
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- ARTICLE_TAGS: Public read only (junction table)
-- =====================================================
CREATE POLICY "article_tags_anon_select" ON article_tags
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "article_tags_service_all" ON article_tags
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- ARTICLE_RELATIONS: Public read only (junction table)
-- =====================================================
CREATE POLICY "article_relations_anon_select" ON article_relations
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "article_relations_service_all" ON article_relations
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- EXPLAINERS: Public read only
-- =====================================================
CREATE POLICY "explainers_anon_select" ON explainers
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "explainers_service_all" ON explainers
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- EXPLAINER_TAGS: Public read only (junction table)
-- =====================================================
CREATE POLICY "explainer_tags_anon_select" ON explainer_tags
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "explainer_tags_service_all" ON explainer_tags
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- SYSTEMS: Public read, anon can update views
-- =====================================================
CREATE POLICY "systems_anon_select" ON systems
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "systems_anon_update_views" ON systems
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "systems_service_all" ON systems
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- SYSTEM_TAGS: Public read only (junction table)
-- =====================================================
CREATE POLICY "system_tags_anon_select" ON system_tags
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "system_tags_service_all" ON system_tags
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- CONTRACTS: Public read only
-- =====================================================
CREATE POLICY "contracts_anon_select" ON contracts
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "contracts_service_all" ON contracts
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- RSS_FEEDS: No public access (internal only)
-- =====================================================
CREATE POLICY "rss_feeds_service_all" ON rss_feeds
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- NEWSLETTER_SUBSCRIBERS: Anon can insert only
-- =====================================================
CREATE POLICY "newsletter_anon_insert" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "newsletter_service_all" ON newsletter_subscribers
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- =====================================================
-- CONTACT_SUBMISSIONS: Anon can insert only
-- =====================================================
CREATE POLICY "contact_anon_insert" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "contact_service_all" ON contact_submissions
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);
