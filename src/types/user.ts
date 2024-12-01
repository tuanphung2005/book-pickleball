export interface User {
    id: string;
    email: string;
    username: string;
    password: string; // In real production, never store plain text passwords
    favoritePlaygrounds: string[]; // Array of playground IDs
    bookings: Booking[];
  }
  
  export interface Booking {
    id: string;
    playgroundId: string;
    date: string;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }