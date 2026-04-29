// Critical Imports
import HeroSection from '@/components/home/HeroSection';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/navbar/Navbar';
import React, { useEffect, Suspense, lazy } from 'react';
import ScrollToTopButton from '@/components/home/ScrollTopTop';
import { Tooltip } from 'react-tooltip';
// HelmetProvider removed

// Lazy Imports for Performance
const Features = lazy(() => import('@/components/home/Features'));
const ContactSection = lazy(
  () => import('@/components/home/GetInTouchSection')
);
const InsightsPreview = lazy(() => import('@/components/home/InsightsPreview'));

// Handle Named Exports for Lazy Loading
const WhyItIsUseful = lazy(() =>
  import('@/components/home/UsefulForStudents').then((module) => ({
    default: module.WhyItIsUseful,
  }))
);
const Testimonials = lazy(() =>
  import('@/components/home/Testimonials').then((module) => ({
    default: module.Testimonials,
  }))
);
const CallToAction = lazy(() =>
  import('@/components/home/CallToAction').then((module) => ({
    default: module.CallToAction,
  }))
);

import SEO from '@/components/seo/SEO';

const HomePage: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem('isDarkMode');
  }, []);

  const seoData = {
    title: 'Budgetter - Smart Finance Tracker for Students',
    description:
      'Take control of your student finances with Budgetter. Track expenses, analytics habits, and save money with our easy-to-use budget planner.',
    image:
      'https://budgetter.lokeshwardewangan.in/assets/dashboard/hero-min.svg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Budgetter',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      description: 'Take control of your student finances with Budgetter.',
      image:
        'https://budgetter.lokeshwardewangan.in/assets/dashboard/hero-min.svg',
      author: {
        '@type': 'Person',
        name: 'Lokeshwar Prasad Dewangan',
        url: 'https://lokeshwardewangan.in/',
      },
    },
  };

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        image={seoData.image}
        structuredData={seoData.structuredData}
      />
      <Navbar />
      <main id="main-content">
        <section
          id="hero_section"
          aria-label="Hero"
          className="hero_section bg-[#eefbff]"
        >
          <HeroSection />
        </section>

        {/* Lazy Loaded Sections */}
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse bg-slate-50"></div>
          }
        >
          <Features />
          <WhyItIsUseful />
          <InsightsPreview />
          <Testimonials />
          <CallToAction />
          <ContactSection />
        </Suspense>
      </main>

      <Footer />
      <ScrollToTopButton />
      <Tooltip
        id="footerTooltip"
        className="custom-react-tooltip"
        place="top"
      />
    </>
  );
};

export default HomePage;
