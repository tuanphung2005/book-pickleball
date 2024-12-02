import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faReceipt, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

interface BottomBarProps {
  onHomeClick: () => void;
  onOrdersClick: () => void;
  activeTab: 'home' | 'orders';
}

export const BottomBar = ({ onHomeClick, onOrdersClick, activeTab }: BottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="flex justify-around items-center h-16">
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
          onClick={onOrdersClick}
          className={`flex flex-col items-center justify-center w-full py-2 ${
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