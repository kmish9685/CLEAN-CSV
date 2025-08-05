// src/components/Dashboard/PremiumBenefits.js
import React from 'react';

const PremiumBenefits = () => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Unlock Premium Benefits</h3>
      <p>Upgrade to a premium plan to access exclusive features and enhance your workflow.</p>

      {/* Placeholder for Premium Benefits List or Feature Comparison */}
      <div style={{ marginTop: '20px' }}>
        <h4>Premium Features Include:</h4>
        <ul>
          <li>Unlimited tool usage</li>
          <li>Premium templates</li>
          <li>Advanced features</li>
          <li>Priority support</li>
          <li>Export options</li>
          <li>Collaboration tools</li>
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
