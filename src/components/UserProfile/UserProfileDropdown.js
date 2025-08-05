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
  const handlePricingClick = () => {;
    router.push('/pricing');
  };

  const handleProfileClick = () => {;
    router.push('/profile');
  };

  const handleAccountClick = () => {;
    router.push('/settings');
  };

  const handleSupportClick = () => {
    console.log('Help and Support clicked. Implement your help/support logic here.'); 
    // Example: window.open('/help', '_blank'); or open a support modal
  };

  const handleBillingClick = () => {;
    router.push('/billing');
  };

  // Headless UI manages dropdown state, no need for local state

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user || !profile) {
    return null; // Or a login/signup button
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center"> {/* Container for the visible profile area */}
        <Menu.Button className="inline-flex justify-center w-full rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 p-1 md:p-2 transition-colors duration-200">
          <div className="flex items-center">
            <UserAvatar user={user} profile={profile} /> {/* Pass the user and profile objects */}
            <div className="ml-2 text-left">
              <div className="text-sm font-medium text-gray-900">
                {profile.display_name || profile.username || 'User'} {/* Use display_name or username */}
              </div>
              <div className="text-xs text-gray-500">{profile.email}</div>
            </div>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"> {/* Increased z-index */}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}>
                  {/* Display SubscriptionBadge component */}
                  {subscription ? (
                    <SubscriptionBadge subscription={subscription} />
                  ) : (
                    <span className="text-gray-500">No Subscription Info</span>
                  )}
                </div>
              )}
            </Menu.Item>
            <div className="border-t border-gray-100"></div> {/* Separator */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handlePricingClick}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                >
                  <DollarSign className="mr-2 h-4 w-4 inline-block" />
                  Pricing Page
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleProfileClick}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                >
                  <User className="mr-2 h-4 w-4 inline-block" />
                  Profile Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleAccountClick}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                >
                  <Settings className="mr-2 h-4 w-4 inline-block" />
                  Account Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSupportClick}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                >
                  <LifeBuoy className="mr-2 h-4 w-4 inline-block" />
                  Help & Support
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleBillingClick}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                >
                  <CreditCard className="mr-2 h-4 w-4 inline-block" />
                  Billing History
                </button>
              )}
            </Menu.Item>
            <div className="border-t border-gray-100"></div> {/* Separator */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={signOut}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                >
                  <LogOut className="mr-2 h-4 w-4 inline-block" />
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>{' '}
    </div>
  );
};

export default UserProfileDropdown;