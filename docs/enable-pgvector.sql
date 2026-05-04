-- Run this in Supabase SQL Editor to enable pgvector semantic search
-- Prerequisites: Supabase project with the articles table populated

-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Update the embedding column type from float[] to vector(1536)
ALTER TABLE articles ALTER COLUMN embedding TYPE vector(1536) USING embedding::text::vector(1536);

-- 3. Create an IVFFlat index for fast similarity search
-- Note: lists = 100 is a good default; adjust based on row count (sqrt of total rows)
CREATE INDEX IF NOT EXISTS articles_embedding_idx ON articles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
