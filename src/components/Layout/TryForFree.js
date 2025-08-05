import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation

function TryForFree() {
  return (
    <section className="try-for-free">
      <h2>Ready to get started?</h2>
      <p>Sign up for a free trial and see how we can help you.</p>
      <Link to="/signup" className="btn-primary">
        Try for Free
      </Link>
    </section>
  );
}

export default TryForFree;