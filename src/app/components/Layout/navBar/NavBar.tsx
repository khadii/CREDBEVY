"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, LucideSearch } from "lucide-react";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { fetchUserData } from "@/app/Redux/auth/userdata";
import { TbLogout2 } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { useDashboard } from "@/app/Context/DahboardContext";
import { useRouter } from "next/navigation";
import { selectUnreadCount } from "@/app/Redux/Notification/Notification";
import {
  fetchAllNotifications,
  addNewNotification,
} from "@/app/Redux/Notification/NotificationsThunk";
// import { subscribeToNotifications } from "@/app/Redux/Notification/pusher";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { subscribeToNotifications } from "@/app/Redux/pusher/pusherService";

export default function TopBar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, data } = useSelector(
    (state: RootState) => state.user
  );

  const unreadCount = useSelector(selectUnreadCount);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (error === "Unauthorized") {
      router.push("/");
    }
  }, [error, router]);

  const {
    isNotificationsModalOpen,
    setIsNotificationsModalOpen,
    logout,
    setLogout,
    pinIsSet,
    setPinIsSet,
  } = useDashboard();
  const user = data?.data;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // // Set up Pusher subscription for real-time notifications
  // useEffect(() => {
  //   const userId = user?.uuid
  //   if (!userId) return;

  //   const handleNewNotification = (data: any) => {
  //     dispatch(addNewNotification(data));
  //     dispatch(fetchAllNotifications());
  //     // Show toast only if notifications modal is closed
  //     if (!isNotificationsModalOpen) {
  //       toast.success("You have a new notification");
  //     }
  //   };

  //   // Subscribe to notifications
  //   unsubscribeRef.current = subscribeToNotifications(
  //     userId,
  //     handleNewNotification
  //   );

  //   // Cleanup function
  //   return () => {
  //     if (unsubscribeRef.current) {
  //       unsubscribeRef.current();
  //     }
  //   };
  // }, [dispatch, isNotificationsModalOpen]);

  // Fetch user data and notifications when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserData());
    }
    if (user) {
      setPinIsSet(user.is_pin_set === true ? false : true);
    }
    dispatch(fetchAllNotifications());
  }, [dispatch, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.getElementById("dropdown-menu");
      const profileButton = event.target as HTMLElement;

      if (
        isDropdownOpen &&
        dropdownElement &&
        !dropdownElement.contains(event.target as Node)
      ) {
        if (!profileButton.closest(".profile-button")) {
          setIsDropdownOpen(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  // Memoize user avatar URL
  const userAvatarUrl = useMemo(() => {
    const firstName = user?.first_name || "U";
    const lastName = user?.last_name || "s";
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
  }, [user]);

  if (loading && !user) {
    return (
      <div className="flex justify-center p-4">Getting Information...</div>
    );
  }

  return (
    <div className="flex relative items-center justify-between h-full min-h-[72px] w-full bg-white px-4 sm:px-6 md:pr-[76px] md:pl-[41px]">
      {/* Search Bar */}
      <div className="hidden sm:flex items-center p-2 rounded-md bg-white w-full max-w-xs">
        <LucideSearch size={16} color="#8A8B9F" />
        <input
          type="search"
          placeholder="What are you looking for?"
          className="ml-2 flex-1 bg-transparent outline-none text-[#A1A6B0] font-semibold text-xs"
          aria-label="Search input"
        />
      </div>

      {/* Mobile Search Icon */}
      <div className="sm:hidden">
        <LucideSearch size={20} color="#8A8B9F" aria-label="Mobile search" />
      </div>

      {/* Notification & Profile */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notification Icon */}
        <button
          className="relative focus:outline-none"
          aria-label="Notifications"
          onClick={() => setIsNotificationsModalOpen(true)}
        >
          <Bell className="text-gray-500" size={20} />
          {/* Conditional Red Badge with Count */}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center p-1">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div
          className="hidden md:block border-l border-[#A1A6B0] h-8"
          aria-hidden="true"
        ></div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="flex items-center space-x-2 focus:outline-none profile-button"
          >
            <img
              src={userAvatarUrl}
              alt={
                user ? `${user.first_name} ${user.last_name}` : "User avatar"
              }
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-[#333333]">
                {user
                  ? `${user.first_name
                      .charAt(0)
                      .toUpperCase()}${user.first_name.slice(
                      1
                    )} ${user.last_name
                      .charAt(0)
                      .toUpperCase()}${user.last_name.slice(1)}`
                  : "User Name"}
              </p>
              <p className="text-[8px] text-[#A1A6B0]">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              id="dropdown-menu"
              className="absolute right-2 top-20 w-[240px] bg-white rounded-md shadow-lg py-[35px] z-50"
            >
              {/* User Info */}
              <div className="px-6 mb-[32px] flex items-center">
                <img
                  src={userAvatarUrl}
                  alt={
                    user
                      ? `${user.first_name} ${user.last_name}`
                      : "User avatar"
                  }
                  className="w-8 h-8 rounded-full mr-2"
                  width={32}
                  height={32}
                />
                <div>
                  <p className="text-[10px] font-bold text-[#333333]">
                    {user
                      ? `${user.first_name
                          .charAt(0)
                          .toUpperCase()}${user.first_name.slice(
                          1
                        )} ${user.last_name
                          .charAt(0)
                          .toUpperCase()}${user.last_name.slice(1)}`
                      : "User Name"}
                  </p>
                  <p className="text-[8px] font-semibold text-[#A1A6B0] truncate mt-[8px]">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-[16px]">
                <div
                  onClick={() => {
                    setIsNotificationsModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="block px-6 py-3 text-sm font-semibold text-[#8A8B9F] hover:bg-[#F5F5F5] hover:text-[#333333] transition-colors duration-200 flex items-center cursor-pointer"
                >
                  <Bell size={20} className="mr-3" /> Notification
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <a
                  href="/dashboard/settings"
                  className="block px-6 py-3 text-sm font-semibold text-[#8A8B9F] hover:bg-[#F5F5F5] hover:text-[#333333] transition-colors duration-200 flex items-center"
                >
                  <LuSettings size={20} className="mr-3" /> Settings
                </a>
                <a
                  onClick={() => setLogout(true)}
                  className="block px-6 py-3 text-sm font-semibold text-[#FA4D56] hover:bg-[#F5F5F5] hover:text-[#FA4D56] transition-colors duration-200 flex items-center cursor-pointer"
                >
                  <TbLogout2 size={20} className="mr-3" /> Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
