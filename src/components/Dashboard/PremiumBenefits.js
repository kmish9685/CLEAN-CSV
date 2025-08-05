// src/components/Dashboard/PremiumBenefits.js
import React from 'react';

const PremiumBenefits = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-xl mb-6">
      <h3 className="text-2xl font-bold mb-4">Unlock Premium Benefits</h3>
      <p className="text-purple-100 mb-6">Upgrade to a premium plan to access exclusive features and enhance your workflow.</p>

      {/* Placeholder for Premium Benefits List or Feature Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-20 p-4 rounded-md">
          <h4 className="text-xl font-semibold mb-2">Unlimited Tool Usage</h4>
          <p className="text-purple-100">Process as many CSV files as you need without any restrictions on usage count.</p>
        </div>
        <div className="bg-white bg-opacity-20 p-4 rounded-md">
           <h4 className="text-xl font-semibold mb-2">Premium Templates</h4>
           <p className="text-purple-100">Gain access to a wider range of specialized templates for various industries and use cases.</p>
        </div>
         <div className="bg-white bg-opacity-20 p-4 rounded-md">
           <h4 className="text-xl font-semibold mb-2">Advanced Cleaning Features</h4>
           <p className="text-purple-100">Unlock sophisticated cleaning algorithms and customization options for complex data issues.</p>
         </div>
         <div className="bg-white bg-opacity-20 p-4 rounded-md">
            <h4 className="text-xl font-semibold mb-2">Priority Support</h4>
            <p className="text-purple-100">Get faster responses and dedicated assistance from our support team for any questions or issues.</p>
         </div>
         <div className="bg-white bg-opacity-20 p-4 rounded-md">
            <h4 className="text-xl font-semibold mb-2">Export Options</h4>
            <p className="text-purple-100">Export your cleaned data in multiple formats beyond just CSV.</p>
         </div>
         <div className="bg-white bg-opacity-20 p-4 rounded-md">
           <h4 className="text-xl font-semibold mb-2">Collaboration Tools</h4>
           <p className="text-purple-100">Share your cleaning projects and collaborate with team members (coming soon).</p>
         </div>

      </div>

      {/* Placeholder for Upgrade Button */}
      <div className="mt-8 text-center">
        <button className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105">Upgrade to Premium</button>
      </div>
    </div>
  );
};

export default PremiumBenefits;


        </ul>
      </div>

      {/* Placeholder for Upgrade Button */}
      <div style={{ marginTop: '20px' }}>
        <button>Upgrade to Premium</button>
      </div>
    </div>
  );
};

export default PremiumBenefits;
