import { useEffect, useState } from 'react'
import { playgrounds } from './data/playgrounds'
import { PlaygroundFilter } from './components/PlaygroundFilter'
import { PlaygroundList } from './components/PlaygroundList'
import { PlaygroundDetail } from './components/PlaygroundDetail'
import { BottomBar } from './components/BottomBar'
import { AuthModal } from './components/AuthModal'
import { OrderHistory } from './components/OrderHistory' // Add this import

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import { Playground } from './types/playground'

function App() {
  const [search, setSearch] = useState('')

  const [filterType, setFilterType] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<'rating' | null>(null)
  
  const [selectedPlayground, setSelectedPlayground] = useState<Playground | null>(null)
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);

  // Add new state
  const [showOrders, setShowOrders] = useState(false);

  // fetch playgrounds
  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/playgrounds');
        const data = await response.json();
        setPlaygrounds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaygrounds();
  }, []);

  // login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const name = localStorage.getItem('userName');
      if (name) setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
  }

  const handleRatingChange = (newRating: number | null) => {
    setRating(newRating);
    setActiveFilter(newRating ? 'rating' : null);
  };

  const filteredPlaygrounds = playgrounds
    .filter((playground) =>
      playground.name.toLowerCase().includes(search.toLowerCase()) ||
      playground.address.toLowerCase().includes(search.toLowerCase())
    )
    .filter((playground) =>
      filterType ? playground.type === filterType : true
    );

  const sortedPlaygrounds = [...filteredPlaygrounds].sort((a, b) => {
    if (activeFilter === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className="pb-16"> {/* Add padding bottom to prevent content from being hidden */}
      <div className="p-4">
        <div className='flex m-2 items-center'>
          <h1 className="text-2xl font-bold mb-4">Tìm sân hoặc quận</h1>
          {isLoggedIn ? (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-gray-600">{userName}</span>
              <button 
                onClick={handleLogout}
                className="border rounded-lg p-2 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="ml-auto border rounded-lg p-2"
            >
              Đăng nhập
            </button>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm sân"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full rounded-lg"
          />
        </div>
        
        {!showOrders ? (
          <>
            <PlaygroundFilter 
              filterType={filterType} 
              setFilterType={setFilterType}
              rating={rating}
              onRatingChange={handleRatingChange}
              activeFilter={activeFilter}
            />
            <PlaygroundList 
              playgrounds={sortedPlaygrounds} 
              onPlaygroundClick={setSelectedPlayground}
            />
          </>
        ) : (
          <OrderHistory />
        )}
        
        <BottomBar 
          onHomeClick={() => setShowOrders(false)}
          onOrdersClick={() => setShowOrders(true)}
          activeTab={showOrders ? 'orders' : 'home'}
        />

        {selectedPlayground && (
          <PlaygroundDetail 
            playground={selectedPlayground} 
            onClose={() => setSelectedPlayground(null)}
            isLoggedIn={isLoggedIn}
          />
        )}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </div>
  )
}

export default App