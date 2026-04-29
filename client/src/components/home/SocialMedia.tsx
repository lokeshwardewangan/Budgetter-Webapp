import React from 'react';

const SocialMedia: React.FC = () => {
  return (
    <div className="auth_footer_container mt-3 flex h-20 w-full flex-col items-center justify-center">
      <div className="mb-4 flex space-x-6">
        <a
          href="https://www.instagram.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-orange-400 opacity-80"
        >
          <i
            className="ri-instagram-fill text-xl text-white"
            aria-hidden="true"
          ></i>
        </a>
        <a
          href="https://www.facebook.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 opacity-80"
        >
          <i
            className="ri-facebook-fill text-xl text-white"
            aria-hidden="true"
          ></i>
        </a>
        <a
          href="https://twitter.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 opacity-80"
        >
          <i
            className="ri-twitter-fill text-xl text-white"
            aria-hidden="true"
          ></i>
        </a>
      </div>
    </div>
  );
};

export default SocialMedia;
