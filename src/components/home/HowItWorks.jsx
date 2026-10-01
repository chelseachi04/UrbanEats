import React from 'react';
import { Store, UtensilsCrossed, ShoppingBag, Truck } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function HowItWorks() {
  useScrollAnimation();

  const steps = [
    {
      number: '01',
      icon: <Store size={28} />,
      title: 'Choose Restaurant',
      desc: 'Browse through our verified partner restaurants across Abraka.'
    },
    {
      number: '02',
      icon: <UtensilsCrossed size={28} />,
      title: 'Select Your Meals',
      desc: 'Pick your favorite native soups, swallow, breakfasts, or drinks.'
    },
    {
      number: '03',
      icon: <ShoppingBag size={28} />,
      title: 'Place Your Order',
      desc: 'Confirm your delivery details and choose your preferred payment.'
    },
    {
      number: '04',
      icon: <Truck size={28} />,
      title: 'Track Delivery',
      desc: 'Sit back as your dedicated rider brings your hot meal to your location.'
    }
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-subtitle">Simple Process</div>
          <h2 className="section-title">How UrbanEats Works</h2>
          <p className="section-description">
            Getting your favorite meals in Abraka is fast, seamless, and convenient.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="process-card animate-on-scroll"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <span className="process-step-number">{step.number}</span>
              <div className="process-icon">{step.icon}</div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
