// src/components/Landing/LandingPage.js
import React from 'react';
import { useRouter } from 'next/router';
import { useTrial } from '../../contexts/TrialContext'; // Import useTrial hook
import { getSessionId, initializeTrialSession, isTrialExpired } from '../../lib/supabase/client'; // Import trial functions

const LandingPage = () => {
  const router = useRouter();
  const { isModalOpen } = useTrial(); // Get isModalOpen from trial context

  const handleTryForFree = async () => {
    const sessionId = getSessionId();
    const expired = await isTrialExpired(sessionId);

    if (!expired) {
      // Initialize trial session if it's a new session (first time user clicks)
      // We can check if a session already exists in the DB before initializing
      const { count } = await getTrialUsage(sessionId); // Need getTrialUsage here
      if (count === null || count === 0) {
         await initializeTrialSession(sessionId);
      }
      router.push('/app'); // Navigate to the tool access page
    }
    // If expired, the TrialExpiredModal will automatically show due to isModalOpen state
  };


  return (
    <div>
      {/* Hero Section */}
      <section>
        <h1>Your Compelling Headline Here</h1>
        <p>A short, benefit-focused subheadline explaining what your tool does.</p>
        <button onClick={handleTryForFree}>Try for Free - No Account Required</button>
      </section>

      {/* Features Section */}
      <section>
        <h2>Features</h2>
        <div>
          <div>
            {/* Icon */}
            <h3>Feature 1</h3>
            <p>Benefit of feature 1.</p>
          </div>
          <div>
            {/* Icon */}
            <h3>Feature 2</h3>
            <p>Benefit of feature 2.</p>
          </div>
          <div>
            {/* Icon */}
            <h3>Feature 3</h3>
            <p>Benefit of feature 3.</p>
          </div>
          {/* Add more features as needed */}
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <h2>Benefits</h2>
        <p>Explain the key benefits users get from your tool.</p>
        <ul>
          <li>Benefit A</li>
          <li>Benefit B</li>
          <li>Benefit C</li>
        </ul>
      </section>

      {/* Social Proof/Testimonials (Optional) */}
      <section>
        <h2>What Our Users Say</h2>
        {/* Add testimonials here */}
      </section>

      {/* Try for Free CTA Section */}
      <section>
        <h2>Experience the power before you commit</h2>
        <p>Get 2 free uses to see how our tool can help you.</p>
        <button onClick={handleTryForFree}>Try for Free</button>
      </section>

      {/* Note: TrialExpiredModal should be rendered at a higher level,
           controlled by the isModalOpen state from TrialProvider */}
      {/* {isModalOpen && <TrialExpiredModal />} */}
    </div>
  );
};

export default LandingPage;