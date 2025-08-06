import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import { 
  selectAllNotifications, 
  selectNotificationsLoading, 
  selectUnreadCount,
  selectHasUnseenNotifications,
  resetUnseenFlag
} from '@/app/Redux/Notification/Notification';
import { 
  fetchAllNotifications, 
  markNotificationAsRead,
  addNewNotification 
} from '@/app/Redux/Notification/NotificationsThunk';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { Notification } from '@/app/Redux/Notification/Notification'; 
// import { subscribeToNotifications } from '@/app/Redux/Notification/pusher';
import MessageDetailModal from './NOtificationMessage';
import AnimatedLoader, { AnimatedLoader2 } from '../animation';
import { subscribeToNotifications } from '@/app/Redux/pusher/pusherService';

const App = ({ isNotificationsModalOpen, setIsNotificationsModalOpen }: { 
  isNotificationsModalOpen: boolean, 
  setIsNotificationsModalOpen: (isOpen: boolean) => void 
}) => {
  const [activeTab, setActiveTab] = useState('View All');
  const [isMessageDetailModalOpen, setIsMessageDetailModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
const unsubscribeRef = useRef<(() => void) | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const notifications = useSelector(selectAllNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectNotificationsLoading);
  const hasUnseenNotifications = useSelector(selectHasUnseenNotifications);
  const { loading, error, data } = useSelector(
    (state: RootState) => state.user
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const user = data?.data;
  useEffect(() => {
    const userId = user?.uuid
    if (!userId) return;

    const handleNewNotification = (data: any) => {
      dispatch(addNewNotification(data));
      dispatch(fetchAllNotifications());
      if (!isNotificationsModalOpen) {
        toast.success('You have a new notification');
      }
    };

    // Subscribe to notifications
    unsubscribeRef.current = subscribeToNotifications(userId, handleNewNotification);

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [dispatch, isNotificationsModalOpen]);

  // Reset unseen flag when modal opens
  useEffect(() => {
    if (isNotificationsModalOpen && hasUnseenNotifications) {
      dispatch(resetUnseenFlag());
    }
  }, [isNotificationsModalOpen, hasUnseenNotifications, dispatch]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isMessageDetailModalOpen) {
        setIsNotificationsModalOpen(false);
      }
    };

    if (isNotificationsModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      dispatch(fetchAllNotifications());
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isNotificationsModalOpen, setIsNotificationsModalOpen, isMessageDetailModalOpen, dispatch]); 

  const filteredNotifications = notifications?.filter((notification: Notification) => {
    switch (activeTab) {
      case 'View All': return true;
      case 'Request': return notification.type === 'request';
      case 'Transactions': return notification.type === 'transactions';
      case 'Accounts': return notification.type === 'accounts';
      case 'Others': return notification.type === 'others';
      default: return false;
    }
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      dispatch(markNotificationAsRead(notification.id));
    }
    setSelectedNotification(notification);
    setIsMessageDetailModalOpen(true);
  };

  const handleCloseMessageDetailModal = () => {
    setIsMessageDetailModalOpen(false);
    setSelectedNotification(null);
  };

  if (!isNotificationsModalOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 flex justify-end items-start p-4 pt-14 font-sans z-50 pointer-events-none">
        <div ref={modalRef} className="bg-white rounded-lg w-full max-w-[480px] overflow-hidden flex flex-col h-[90vh] md:h-[80vh] shadow-lg pointer-events-auto mt-4 mr-4">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4">
            <h2 className="text-base font-semibold text-[#333333]">
              Notification {unreadCount > 0 && `(${unreadCount})`}
              {hasUnseenNotifications && !isNotificationsModalOpen && (
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </h2>
            <button
              onClick={() => setIsNotificationsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto whitespace-nowrap space-x-[41px] px-4">
            {['View All', 'Request', 'Transactions', 'Accounts', 'Others'].map(tab => (
              <button
                key={tab}
                className={`pt-3 pb-[30px] text-xs font-semibold focus:outline-none transition-colors duration-200 ease-in-out
                  ${activeTab === tab
                    ? 'text-[#156064]'
                    : 'text-[#8A8B9F]'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notification List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div><AnimatedLoader2 isLoading={isLoading}/></div>
            ) : filteredNotifications && filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-6 p-3 cursor-pointer rounded-lg transition-colors duration-200
                    ${!notification.read_at ? 'bg-[#F7F7F7]' : 'bg-white'}
                    hover:bg-[#F0F0F0]`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {notification.type === 'accounts' ? (
                      <Image src="/notificationTwo.svg" width={30} height={30} alt="Accounts Notification" />
                    ) : (
                      <Image src="/NotificationOne.svg" width={30} height={30} alt="General Notification" />
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 overflow-hidden">
                    <div className={`text-xs leading-relaxed ${!notification.read_at ? 'font-medium' : 'font-normal'} truncate`}>
                      <span dangerouslySetInnerHTML={{ __html: notification.data.message }} />
                    </div>
                    <p className="text-[10px] font-bold text-[#8A8B9F] mt-2">
                      {new Date(notification.created_at).toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read_at && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#156064] mt-1"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 p-8">
                No notifications for this category.
              </div>
            )}
          </div>
        </div>
      </div>
      <MessageDetailModal
        isOpen={isMessageDetailModalOpen}
        notification={selectedNotification}
        onClose={handleCloseMessageDetailModal}
      />
    </>
  );
};

export default App;