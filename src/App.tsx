import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { OrderProvider, useOrder } from './store';
import { Announce, Header, NavSheet } from './components/Header';
import { Hero, Logos, Steps } from './components/Hero';
import { Drawer, MenuSection, MobileBar, Toast } from './components/Menu';
import { Corporate, DeliveryFaq, Final, Footer, Occasions, Quote, Reviews } from './components/Sections';

function Shell() {
  const { navOpen, setNav, drawerOpen, setDrawer } = useOrder();

  useEffect(() => {
    document.body.classList.toggle('nav-open', navOpen);
  }, [navOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDrawer(false); setNav(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setDrawer, setNav]);

  return (
    <div id="top">
      <Announce />
      <Header />
      <NavSheet />
      <main>
        <Hero />
        <Logos />
        <Steps />
        <MenuSection />
        <Occasions />
        <Quote />
        <Corporate />
        <Reviews />
        <DeliveryFaq />
        <Final />
      </main>
      <Footer />
      <MobileBar />
      <Drawer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </OrderProvider>
  );
}
