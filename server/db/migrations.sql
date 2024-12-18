CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playgrounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('football', 'pickleball') NOT NULL,
  address VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0,
  imageUrl VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  playgroundId INT NOT NULL,
  userId INT NOT NULL,
  date DATE NOT NULL,
  timeStart VARCHAR(5) NOT NULL,
  timeEnd VARCHAR(5) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playgroundId) REFERENCES playgrounds(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

ALTER TABLE playgrounds 
MODIFY COLUMN imageUrl VARCHAR(500) NOT NULL 
CHECK (LENGTH(imageUrl) <= 500);

ALTER TABLE bookings 
ADD COLUMN rated BOOLEAN DEFAULT FALSE;

ALTER TABLE playgrounds 
ADD COLUMN reports INT DEFAULT 0;

CREATE TABLE playground_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  playgroundId INT NOT NULL,
  userId INT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playgroundId) REFERENCES playgrounds(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE KEY unique_report (playgroundId, userId)
);

ALTER TABLE users 
ADD COLUMN phone VARCHAR(10) NOT NULL;