import React, { Fragment } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from './UserAvatar'; // Import the UserAvatar component
import SubscriptionBadge from './SubscriptionBadge'; // Import the SubscriptionBadge component
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
// Import icons - Remember to install lucide-react: npm install lucide-react
import { User, Settings, DollarSign, LifeBuoy, CreditCard, LogOut } from 'lucide-react';

const UserProfileDropdown = () => {
  const router = useRouter();

  const { user, profile, subscription, signOut, loading } = useAuth();

  // Placeholder navigation functions
  const handlePricingClick = () => {
    router.push('/pricing');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleAccountClick = () => {
    router.push('/settings');
  };

  const handleHelpSupportClick = () => {
    window.open('https://yourdomain.com/help', '_blank');
  };

  const handleBillingHistoryClick = () => {
    router.push('/billing');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out:', error.message);
      // You might want to use react-hot-toast here for user feedback
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  // Fallback for when user data is not yet loaded or missing
  const displayUsername = profile?.display_name || profile?.username || user?.email || 'Guest';
  const displayEmail = profile?.email || user?.email || '';

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      {({ open }) => (
        <>
          <Menu.Button
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-haspopup="true"
            aria-expanded={open}
            tabIndex="0"
          >
            <UserAvatar user={user} />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-gray-900">{displayUsername}</span>
              <span className="text-xs text-gray-500">{displayEmail}</span>
            </div>
            {/* You could add a chevron down icon here */}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all bg-white p-4 ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                    >
                      <User className="mr-2 h-4 w-4" aria-hidden="true" />
                      Current Plan:{' '}
                      <SubscriptionBadge subscription={subscription} />
                    </div>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handlePricingClick}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="menuitem"
                      tabIndex="0"
                    >
                      <DollarSign className="mr-2 h-4 w-4" aria-hidden="true" />
                      Pricing Page
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleProfileClick}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="menuitem"
                      tabIndex="0"
                    >
                      <User className="mr-2 h-4 w-4" aria-hidden="true" />
                      Profile Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleAccountClick}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="menuitem"
                      tabIndex="0"
                    >
                      <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                      Account Settings
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleHelpSupportClick}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="menuitem"
                      tabIndex="0"
                    >
                      <LifeBuoy className="mr-2 h-4 w-4" aria-hidden="true" />
                      Help & Support
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleBillingHistoryClick}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="menuitem"
                      tabIndex="0"
                    >
                      <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
                      Billing History
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      role="menuitem"
                      tabIndex="0"
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default UserProfileDropdown;
