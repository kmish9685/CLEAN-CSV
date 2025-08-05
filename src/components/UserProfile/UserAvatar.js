import React from 'react';

const UserAvatar = ({ user }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const getRandomColor = () => {
    // This should ideally be deterministic based on user ID for consistent color
    // For simplicity, keeping it random for now
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#9e9e9e', '#607d8b',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderAvatarContent = () => {
    if (!user) {
      // Fallback to a generic icon if no user object
      return (
        <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }

    const profilePicture = user.user_metadata?.avatar_url;
    const displayName = user.user_metadata?.display_name || user.user_metadata?.username;
    const email = user.email;

    if (profilePicture) {
      return <img src={profilePicture} alt="User Avatar" className="w-full h-full object-cover" />;
    } else if (displayName) {
      const initials = getInitials(displayName);
      const backgroundColor = getRandomColor();
      return (
      );
    } else if (user && user.email) {
        const initials = getInitials(user.email);
        const backgroundColor = getRandomColor();
        return (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor }}
          >
            {initials}
          </div>
        );
    } else {
      // Fallback to a generic icon (you'll need to provide an icon component or SVG)
      return (
        <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
  };

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
      {renderAvatarContent()}
    </div>
  );
};

export default UserAvatar;