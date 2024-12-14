import { useState, useRef, useEffect } from 'react'
import { PlaygroundFilter } from './components/PlaygroundFilter'
import { PlaygroundList } from './components/PlaygroundList'
import { PlaygroundDetail } from './components/PlaygroundDetail'
import { BottomBar } from './components/BottomBar'
import { AuthModal } from './components/AuthModal'
import { OrderHistory } from './components/OrderHistory'
import { PlaygroundForm } from './components/PlaygroundForm'
import { PlaygroundManager } from './components/PlaygroundManager'
import { IncomingOrders } from './components/IncomingOrders' // Add this import

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRightFromBracket, 
  faPlus, 
  faCog,
  faCaretDown,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'

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

  // Add new state
  const [showOrders, setShowOrders] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showPlaygroundForm, setShowPlaygroundForm] = useState(false);
  const [showPlaygroundManager, setShowPlaygroundManager] = useState(false);
  const [showIncomingOrders, setShowIncomingOrders] = useState(false);

  // fetch playgrounds
  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/playgrounds');
        const data = await response.json();
        setPlaygrounds(data);
      } catch (err) {
        console.error(err);
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="pb-16 md:pb-0 md:pl-16 max-w-7xl mx-auto"> {/* Add max-width and center */}
      <div className="p-4 md:p-8"> {/* Add responsive padding */}
        <div className='flex m-2 items-center'>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Tìm sân hoặc quận</h1>
          {isLoggedIn ? (
            <div className="ml-auto flex items-center gap-2 relative" ref={menuRef}>
              <div 
                className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="text-gray-600">{userName}</span>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>

              {/* dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowPlaygroundForm(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Thêm sân mới</span>
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowPlaygroundManager(true)}
                  >
                    <FontAwesomeIcon icon={faCog} />
                    <span>Quản lý sân</span>
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowIncomingOrders(true)}
                  >
                    <FontAwesomeIcon icon={faClipboardList} />
                    <span>Đơn đặt sân</span>
                  </button>
                  <hr className="my-2" />
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
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

        <div className="mb-4 md:max-w-2xl mx-auto"> {/* Center search on larger screens */}
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
            <div className="md:max-w-2xl mx-auto"> {/* Center filters */}
              <PlaygroundFilter 
                filterType={filterType} 
                setFilterType={setFilterType}
                rating={rating}
                onRatingChange={handleRatingChange}
                activeFilter={activeFilter}
              />
            </div>
            <div className="md:max-w-3xl mx-auto"> {/* Center and limit width of playground list */}
              <PlaygroundList 
                playgrounds={sortedPlaygrounds} 
                onPlaygroundClick={setSelectedPlayground}
              />
            </div>
          </>
        ) : (
          <div className="md:max-w-3xl mx-auto"> {/* Center order history */}
            <OrderHistory />
          </div>
        )}
        
        <BottomBar 
          onHomeClick={() => setShowOrders(false)}
          onOrdersClick={() => setShowOrders(true)}
          activeTab={showOrders ? 'orders' : 'home'}
          isLoggedIn={isLoggedIn}
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
        {showPlaygroundForm && (
          <PlaygroundForm onClose={() => setShowPlaygroundForm(false)} />
        )}
        {showPlaygroundManager && (
          <PlaygroundManager onClose={() => setShowPlaygroundManager(false)} />
        )}
        {showIncomingOrders && (
          <IncomingOrders onClose={() => setShowIncomingOrders(false)} />
        )}
      </div>
    </div>
  )
}

export default App