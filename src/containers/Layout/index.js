import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { animateScroll as scroll } from 'react-scroll';

const Layout = (props) => {
  const [scrollLeft, setSCrollLeft] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = winScroll / height;
      setSCrollLeft(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Header {...props} />
      <div className="layout-container">{props.children}</div>
      <Footer
        scrollLeft={scrollLeft}
        scrollToTop={() => {
          scroll.scrollToTop();
        }}
      />
    </>
  );
};

export default Layout;
