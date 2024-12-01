CREATE TABLE playgrounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('football', 'pickleball') NOT NULL,
  address VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0,
  imageUrl VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);