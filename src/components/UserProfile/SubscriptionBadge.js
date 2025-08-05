import React from 'react';

const SubscriptionBadge = ({ subscription }) => {
  if (!subscription) {
    return null;
  }

  const { plan_name, status, current_period_end } = subscription;

  const getPlanBadgeClass = (plan) => {
    switch(plan?.toLowerCase()) {
      case 'free': return 'bg-gray-200 text-gray-800';
      case 'pro': return 'bg-blue-500 text-white';
      case 'premium': return 'bg-purple-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusTextClass = (status) => {
      switch(status?.toLowerCase()) {
          case 'active': return 'text-green-600';
          case 'cancelled': return 'text-red-600';
          case 'expired': return 'text-yellow-600';
          default: return 'text-gray-500';
      }
  }

  return (
    <span className={`px-2 py-1 rounded text-sm ${getPlanBadgeClass(plan_name)}`}>
      <span className="font-medium">{plan_name || 'N/A'}</span>
      {status && (
        <span className={`ml-1 text-xs ${getStatusTextClass(status)}`}>
          ({status})
        </span>
      )}
      {/* Add renewal date display if applicable */}
      {status === 'active' && current_period_end && (
        <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">
          Ends: {new Date(current_period_end).toLocaleDateString()}
        </span>
      )}
    </span>
  );
};

export default SubscriptionBadge;
