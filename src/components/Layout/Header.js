import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserProfile from './UserProfile';
import TryForFree from './TryForFree';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header>
      {/* Your logo or site title here */}
      <h1>My App</h1>
      <nav>
        {user ? <UserProfile /> : <TryForFree />}
      </nav>
    </header>
  );
};

export default Header;