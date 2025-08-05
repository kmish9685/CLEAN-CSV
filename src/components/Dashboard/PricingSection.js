// src/components/Dashboard/PricingSection.js
import React from 'react';

const PricingSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Pricing Plans</h3>
      <p className="text-gray-600 mb-6 text-center">Choose the plan that best fits your needs.</p>

      {/* Monthly/Annual Toggle Placeholder */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-800 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-800">
            Monthly
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
            Annual (Save X%)
          </button>
        </div>
      </div>

      {/* Pricing Plans Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Free Plan Card */}
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">Free Plan</h4>
          <p className="text-gray-600 mb-4">Perfect for trying out the basic features.</p>
          <div className="text-3xl font-bold text-blue-600 mb-4">$0<span className="text-sm font-normal text-gray-500">/month</span></div>
          <ul className="text-left text-gray-700 mb-6 space-y-2">
            <li>✓ Limited tool usage (e.g., 2 uses)</li>
            <li>✓ Basic CSV cleaning</li>
            <li>✓ Standard templates</li>
          </ul>
          <button className="w-full bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-semibold cursor-not-allowed opacity-50">Current Plan</button>
        </div>

        {/* Premium Plan Card */}
        <div className="border border-blue-500 rounded-lg p-6 flex flex-col items-center text-center shadow-md">
          <h4 className="text-xl font-semibold text-blue-600 mb-3">Premium Plan</h4>
          <p className="text-gray-600 mb-4">Unlock unlimited power and premium features.</p>
          <div className="text-3xl font-bold text-blue-600 mb-4">$XX<span className="text-sm font-normal text-gray-500">/month</span></div>
           <ul className="text-left text-gray-700 mb-6 space-y-2">
            <li>✓ Unlimited tool usage</li>
            <li>✓ Advanced cleaning options</li>
            <li>✓ Premium templates</li>
            <li>✓ Priority support</li>
            <li>✓ Data export</li>
          </ul>
          <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition-colors">Choose Premium</button>
        </div>
      </div> {/* End Pricing Plans Container */}

    </div>
  );
};

export default PricingSection;
