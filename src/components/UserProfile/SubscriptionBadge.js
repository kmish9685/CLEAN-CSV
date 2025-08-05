import React from 'react';

const SubscriptionBadge = ({ subscription }) => {
  if (!subscription) {
    return null;
 }

  const { plan_name, status, current_period_end } = subscription;

 const getBadgeClass = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      case 'expired': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
 };

  return (
    <span className={`px-2 py-1 rounded text-sm ${getBadgeClass(status)}`}>
      <span className="font-medium">{plan_name}</span> ({status})
      {/* Add renewal date display if applicable */}
      {status === 'active' && current_period_end && (
        <span>Ends: {new Date(current_period_end).toLocaleDateString()}</span>
      )}
    </span>
  );
};

export default SubscriptionBadge;