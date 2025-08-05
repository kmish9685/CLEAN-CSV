// src/components/Dashboard/Dashboard.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router'; // Assuming Next.js router
import ToolAccess from './ToolAccess';
import TemplateGuide from './TemplateGuide';
import PremiumBenefits from './PremiumBenefits';
import PricingSection from './PricingSection';


const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Although AuthWrapper handles redirects, this provides a fallback
  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  // Should not be reached if AuthWrapper is used, but as a safeguard
  if (!user) {
    router.push('/login'); // Redirect to login if no user
    return null; // Or a loading state/message
  }

  return (
    <div>
      <h1>Welcome to your Dashboard, {user.email || 'User'}!</h1>
      {/* You can display username if available in user metadata or profile */}
      {/* <h1>Welcome back, {user.user_metadata?.username || user.email || 'User'}!</h1> */}

      <section>
        <h2>Your Tool</h2>
        <ToolAccess />
      </section>

      <section>
        <h2>Template Guide</h2>
        <TemplateGuide />
      </section>

      <section>
        <h2>Premium Features</h2>
        <PremiumBenefits />
      </section>

      <section>
        <h2>Pricing Plans</h2>
        <PricingSection />
      </section>

      {/* Optional: Sign out button */}
      {/* <button onClick={() => auth.signOut()}>Sign Out</button> */}
    </div>
  );
};

export default Dashboard;