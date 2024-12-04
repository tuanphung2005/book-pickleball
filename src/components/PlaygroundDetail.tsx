import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faMapMarkerAlt, faStar, faTableTennis, faTimes, faBasketball, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { Playground } from '../types/playground';
import { useState } from 'react';
import BookingForm from './BookingForm';

interface PlaygroundDetailProps {
  playground: Playground;
  onClose: () => void;
  isLoggedIn?: boolean; // Add this prop to check login status
}

export const PlaygroundDetail = ({ playground, onClose, isLoggedIn }: PlaygroundDetailProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  const getTypeIcon = (type: 'football' | 'pickleball' | 'badminton' | 'basketball') => {
    switch(type) {
      case 'football':
        return faFutbol;
      case 'pickleball':
        return faTableTennis;
      case 'badminton':
        return faTableTennis;
      case 'basketball':
        return faBasketball;
    }
  };

  const handleBooking = () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để đặt sân');
      return;
    }
    setShowBookingForm(true);
  };

  return (
    <>
  
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          <div className="p-6">
            <img 
              src={playground.imageUrl} 
              alt={playground.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            <h2 className="text-2xl font-bold mb-4">{playground.name}</h2>
            
            <div className="space-y-2">
              <p className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={getTypeIcon(playground.type)} className="mr-2" />
                {playground.type}
              </p>
              
              <p className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                {playground.address}
              </p>
              
              <p className="flex items-center text-amber-500">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                {playground.rating}
              </p>


              <button
                onClick={handleBooking}
                className="mt-4 w-full bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
                Đặt sân
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm 
          playground={playground} 
          onClose={() => setShowBookingForm(false)} 
        />
      )}
    </>
  );
};