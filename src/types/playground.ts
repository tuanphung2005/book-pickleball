export interface Playground {
    id: number;       // Add this line
    name: string;
    type: 'football' | 'pickleball' | 'badminton' | 'basketball';
    address: string;
    rating: number;
    imageUrl: string;
}