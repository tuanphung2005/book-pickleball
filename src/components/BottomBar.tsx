import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faReceipt } from '@fortawesome/free-solid-svg-icons';

interface BottomBarProps {
  onHomeClick: () => void;
  onOrdersClick: () => void;
  activeTab: 'home' | 'orders';
  isLoggedIn: boolean; // Add this prop
}

export const BottomBar = ({ onHomeClick, onOrdersClick, activeTab, isLoggedIn }: BottomBarProps) => {
  const handleOrderClick = () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để xem hóa đơn');
      return;
    }
    onOrdersClick();
  };

  return (
    // Change from fixed bottom to fixed left for larger screens
    <div className="md:fixed md:left-0 md:top-0 md:h-full md:w-16 fixed bottom-0 left-0 right-0 bg-white border-t md:border-t-0 md:border-r shadow-lg">
      <div className="flex md:flex-col justify-around items-center h-16 md:h-full md:mt-20">
        <button 
          onClick={onHomeClick}
          className={`flex flex-col items-center justify-center w-full py-2 ${
            activeTab === 'home' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <FontAwesomeIcon icon={faHome} className="text-xl mb-1" />
          <span className="text-xs">Trang chủ</span>
        </button>
        <button 
          onClick={handleOrderClick}
          className={`flex flex-col items-center justify-center w-full py-2 ${
            !isLoggedIn ? 'text-gray-400 cursor-not-allowed' : 
            activeTab === 'orders' ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <FontAwesomeIcon icon={faReceipt} className="text-xl mb-1" />
          <span className="text-xs">Hóa đơn</span>
        </button>
      </div>
    </div>
  );
};