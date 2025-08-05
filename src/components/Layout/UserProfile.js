import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return null; // Don't render if no user is logged in
  }

  return (
    <div className="user-profile">
      <img src={user.photoURL || 'default-avatar.png'} alt="User Avatar" className="avatar" />
      <span className="username">{user.displayName || user.email}</span>
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
};

export default UserProfile;