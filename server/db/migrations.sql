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