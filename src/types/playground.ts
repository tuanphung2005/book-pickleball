export interface Playground {
    id: number;
    name: string;
    type: 'football' | 'pickleball' | 'badminton' | 'basketball';
    address: string;
    rating: number;
    imageUrl: string;
    ownerPhone: string;
    description: string;
}