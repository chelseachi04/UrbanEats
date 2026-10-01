import React from 'react';
import HeroSection from '../components/home/HeroSection';
import RestaurantDiscovery from '../components/home/RestaurantDiscovery';
import PopularDishes from '../components/home/PopularDishes';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseSection from '../components/home/WhyChooseSection';
import FoodHealthPreview from '../components/home/FoodHealthPreview';
import AbrakaMapSection from '../components/home/AbrakaMapSection';
import RoleJoinSection from '../components/home/RoleJoinSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <RestaurantDiscovery />
      <PopularDishes />
      <HowItWorks />
      <WhyChooseSection />
      <FoodHealthPreview />
      <AbrakaMapSection />
      <RoleJoinSection />
    </div>
  );
}

