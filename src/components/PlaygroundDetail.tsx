import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faMapMarkerAlt, faStar, faTableTennis, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Playground } from '../types/playground';

interface PlaygroundDetailProps {
  playground: Playground;
  onClose: () => void;
}

export const PlaygroundDetail = ({ playground, onClose }: PlaygroundDetailProps) => {
  const getTypeIcon = (type: 'football' | 'pickleball') => {
    return type === 'football' ? faFutbol : faTableTennis;
  };

  return (
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
          </div>
        </div>
      </div>
    </div>
  );
};