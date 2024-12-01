import { Playground } from '../types/playground';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faLocationDot, faStar, faTableTennis, faBasketball } from '@fortawesome/free-solid-svg-icons';

interface PlaygroundListProps {
  playgrounds: Playground[];
  onPlaygroundClick: (playground: Playground) => void;
}

export const PlaygroundList = ({ playgrounds, onPlaygroundClick }: PlaygroundListProps) => {
  const getTypeIcon = (type: 'football' | 'pickleball' | 'badminton' | 'basketball') => {
    switch(type) {
      case 'football':
        return faFutbol;
      case 'pickleball':
        return faTableTennis;
      case 'badminton':
        return faTableTennis; // Using table tennis icon as fallback
      case 'basketball':
        return faBasketball;
      default:
        return faTableTennis;
    }
  };

  return (
    <ul className="space-y-4">
      {playgrounds.map((playground) => (
        <li 
          key={playground.name} 
          className="border rounded-lg overflow-hidden flex h-32 cursor-pointer hover:border-blue-500"
          onClick={() => onPlaygroundClick(playground)}
        >
          <img 
            src={playground.imageUrl} 
            alt={playground.name}
            className="w-32 h-32 object-cover"
          />
          <div className="p-4 flex-1">
            <h3 className="font-bold text-lg">{playground.name}</h3>
            <p className="text-gray-600 capitalize">
              <FontAwesomeIcon icon={getTypeIcon(playground.type)} className="mr-2" />
              {playground.type}
            </p>
            <p className="text-sm text-gray-500">
              <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
              {playground.address}
            </p>
            <p className="text-amber-500">
              <FontAwesomeIcon icon={faStar} className="mr-2" />
              {playground.rating}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};