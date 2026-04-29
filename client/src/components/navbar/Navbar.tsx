import { navListArray } from '@/data/navList';
import {
  ANIMATE_WORDS_VARIENT,
  MENU_EFFECT_VARIENT,
  MENU_ITEM_EFFECT_VARIENT,
} from '@/utils/framer/properties';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  // const MotionLink = motion(Link);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 mx-auto h-[72px] max-w-6xl rounded-xl bg-[#e6faff]/20 font-karla text-gray-800 shadow-sm backdrop-blur-sm sm:shadow-none 2xl:h-24 2xl:max-w-7xl">
        <motion.div
          variants={ANIMATE_WORDS_VARIENT}
          initial="initial"
          animate="animate"
          className="flex h-full items-center justify-between px-4"
        >
          {/* Logo */}
          <a href="/" aria-label="Budgetter home" className="flex items-center">
            <img
              className="h-8 2xl:h-10"
              src="/assets/logo/logo.png"
              alt=""
              width={48}
              height={45}
              decoding="async"
            />
            {/* <img
              className="h-7 pl-4 relative top-1 right-2"
              src="/assets/logo/logo_name.png"
              alt="Budgetter"
            /> */}
            {/* <span className="font-bree relative top-0.5 bg-gradient-to-r from-[#2e7dff] to-[#00b87c] bg-clip-text pl-2 text-2xl font-semibold tracking-wider text-transparent 2xl:text-4xl">
              Budgetter
            </span> */}
            <span className="relative inline-block bg-gradient-to-r from-[#2e7dff] to-[#00b87c] bg-clip-text pb-2 pl-2.5 font-bree text-2xl font-medium text-transparent 2xl:text-3xl">
              Budgetter
              <svg
                className="absolute bottom-0.5 left-1.5 h-2.5 w-full text-emerald-500 opacity-60 2xl:bottom-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                ></path>
              </svg>
            </span>
          </a>

          {/* Navigation - Large Screens */}
          <div className="hidden items-center space-x-5 lg:flex">
            {navListArray.map(({ route, name }, index) => (
              <a
                key={index}
                href={`/${route}`}
                className="top_nav_list relative rounded-lg p-0.5 py-0.5 text-sm font-medium capitalize text-[#1a1a1a] transition-all duration-300 ease-in before:absolute before:bottom-0 before:left-0 before:h-[1.5px] before:w-0 before:bg-[#317c63] before:transition-all before:duration-300 hover:before:w-full 2xl:text-base"
                style={{ textUnderlineOffset: '8px' }}
              >
                <span>{name}</span>
              </a>
            ))}
            <Link
              to="/login"
              className="rounded-full bg-gradient-to-r from-[#065f46]/80 via-[#047857]/80 to-[#059669]/80 px-4 py-1.5 text-xs text-white shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-br 2xl:px-6 2xl:text-sm 2xl:font-semibold"
            >
              Login Today ?
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Nav Icon */}
      <div className="fixed right-4 top-5 z-[50] block lg:right-8 lg:hidden">
        <button
          aria-label="navigation"
          type="button"
          onClick={toggleMenu}
          className="rounded-full px-2 py-1 text-gray-800 transition-all duration-200 ease-in hover:bg-gray-300 focus:outline-none"
        >
          <i className={`text-3xl ri-${!isOpen ? 'menu' : 'close'}-line`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <AnimatePresence>
            <div className="bg_filter_effect absolute inset-0 z-50 bg-[#ffffff50] backdrop-blur-sm md:hidden"></div>
            <motion.div
              ref={modalRef}
              variants={MENU_EFFECT_VARIENT}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`menu_phone_container fixed right-2 top-16 z-50 mt-2 w-full max-w-[16rem] rounded-lg bg-white py-4 text-center font-karla text-black shadow-md lg:hidden`}
            >
              <motion.div className="flex flex-col justify-center">
                {navListArray.map(({ route, name }, index) => (
                  <motion.a
                    variants={MENU_ITEM_EFFECT_VARIENT}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    key={index}
                    href={`/${route}`}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 pl-6 text-left text-base font-bold capitalize transition-all duration-300 ease-in hover:underline focus:underline focus:outline-none"
                    style={{ textUnderlineOffset: '8px' }}
                  >
                    {name}
                  </motion.a>
                ))}
                <hr />
                {/* <motion.div className="switch_theme flex justify-between px-6 py-3 pb-0 text-base font-medium">
                  <motion.div
                    variants={MENU_ITEM_EFFECT_VARIENT}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    Switch theme
                  </motion.div>
                  <i className="ri-moon-line cursor-pointer text-2xl"></i>
                </motion.div> */}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default Navbar;
