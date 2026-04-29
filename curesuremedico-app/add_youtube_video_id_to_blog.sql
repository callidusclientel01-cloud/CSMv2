-- Add youtube_video_id column to the blog_posts table
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS youtube_video_id text;
