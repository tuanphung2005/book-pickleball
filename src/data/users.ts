import { User } from '../types/user';

export const users: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'john',
    password: 'password123', // In real app, this would be hashed
    favoritePlaygrounds: [],
    bookings: [
      {
        id: 'b1',
        playgroundId: 'Sân trường HV PTIT',
        date: '2024-03-20',
        timeSlot: '18:00-19:00',
        status: 'confirmed'
      }
    ]
  },
  {
    id: '2',
    email: 'sarah@example.com',
    username: 'sarah',
    password: 'password456',
    favoritePlaygrounds: [],
    bookings: []
  }
];