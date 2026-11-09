-- Initialize database schema and sample data for the demo

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial sample records if the table is empty
INSERT INTO items (title, description)
SELECT 'Docker Setup Verified', 'All containers (Nginx, Node.js, PostgreSQL) are successfully deployed and communicating.'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE title = 'Docker Setup Verified');

INSERT INTO items (title, description)
SELECT 'Database Persistence Ready', 'Data stored in PostgreSQL is persisted using a dedicated Docker volume.'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE title = 'Database Persistence Ready');

INSERT INTO items (title, description)
SELECT 'Nginx Reverse Proxy Active', 'Nginx serves frontend static assets and seamlessly routes /api requests to Express.'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE title = 'Nginx Reverse Proxy Active');
