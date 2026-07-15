-- Create blogs table
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes int DEFAULT 0
);

-- Insert two dummies into db
INSERT INTO blogs (
  author, url, title
) VALUES
  ('Dan Abramov', 'https://overreacted.io/writing-resilient-components/', 'Writing Resilient Components'),
  ('Maria Santos', 'https://www.notion.so/example', 'The Clean Code Blog');