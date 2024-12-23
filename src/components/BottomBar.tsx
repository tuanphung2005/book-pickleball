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
    <div className="fixed md:w-20 md:left-0 md:top-0 md:h-full md:border-r md:shadow-lg bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex md:flex-col justify-around items-center h-16 md:h-full md:pt-20">
        <button 
          onClick={onHomeClick}
          className={`flex flex-col items-center justify-center w-full p-4 transition-colors hover:bg-gray-50 ${
            activeTab === 'home' ? 'text-blue-500 md:border-l-4 md:border-blue-500' : 'text-gray-500'
          }`}
        >
          <FontAwesomeIcon icon={faHome} className="text-xl md:text-2xl mb-1" />
          <span className="text-xs md:text-sm">Trang chủ</span>
        </button>
        <button 
          onClick={handleOrderClick}
          className={`flex flex-col items-center justify-center w-full p-4 transition-colors hover:bg-gray-50 ${
            !isLoggedIn ? 'text-gray-400 cursor-not-allowed' : 
            activeTab === 'orders' ? 'text-blue-500 md:border-l-4 md:border-blue-500' : 'text-gray-500'
          }`}
        >
          <FontAwesomeIcon icon={faReceipt} className="text-xl md:text-2xl mb-1" />
          <span className="text-xs md:text-sm">Hóa đơn</span>
        </button>
      </div>
    </div>
  );
};