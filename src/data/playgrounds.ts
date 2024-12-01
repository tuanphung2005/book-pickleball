import { Playground } from '../types/playground';

export const playgrounds: Playground[] = [
  { 
    name: 'Sân trường HV PTIT', 
    type: 'football',
    address: '96 Trần Phú, Mộ Lao, Hà Đông, Hà Nội',
    rating: 4.5,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrZSQCntYB7FbT3ddfCQ2Idpia0YQF1SPe7g&s'
  },
  { 
    name: 'Pickleball no1', 
    type: 'pickleball',
    address: 'Ngõ 124 Vĩnh Tuy, Hai Bà Trưng, Hà Nội',
    rating: 4.0,
    imageUrl: 'https://example.com/pickleball1.jpg'
  },
  { 
    name: 'Football Center', 
    type: 'football',
    address: '22 Lê Văn Lương, Thanh Xuân, Hà Nội',
    rating: 3.8,
    imageUrl: 'https://example.com/football-center.jpg'
  },
  { 
    name: 'Pickleball Court 2', 
    type: 'pickleball',
    address: '15 Trần Hữu Dực, Nam Từ Liêm, Hà Nội',
    rating: 4.2,
    imageUrl: 'https://example.com/pickleball2.jpg'
  }
];