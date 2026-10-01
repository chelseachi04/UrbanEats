import React from 'react';
import { Truck, Utensils, Store, ShieldCheck, MapPin, HeartHandshake } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function WhyChooseSection() {
  useScrollAnimation();

  const advantages = [
    {
      icon: <Truck size={28} />,
      title: 'Fast & Reliable Delivery',
      desc: 'Get your meals delivered to your hostel, campus gate, workplace, or home.'
    },
    {
      icon: <Utensils size={28} />,
      title: 'Fresh Local Meals',
      desc: 'Discover freshly prepared meals from restaurants, bukas, and food vendors around Abraka.'
    },
    {
      icon: <Store size={28} />,
      title: 'Local Restaurants',
      desc: 'Support local food businesses while discovering new places to eat.'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Secure Ordering',
      desc: 'Enjoy transparent pricing and a simple, secure ordering experience.'
    },
    {
      icon: <MapPin size={28} />,
      title: 'Track Your Order',
      desc: 'Know where your order is from the moment it is accepted until it reaches you.'
    },
    {
      icon: <HeartHandshake size={28} />,
      title: 'Built for Abraka',
      desc: "UrbanEats connects Abraka's restaurants, students, workers, residents, and delivery riders in one platform."
    }
  ];

  return (
    <section className="section" id="why-choose">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-subtitle">The UrbanEats Advantage</div>
          <h2 className="section-title">Why Choose UrbanEats?</h2>
          <p className="section-description">
            Built for the people who live, study, and work in Abraka.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {advantages.map((item, index) => (
            <div
              key={index}
              className="advantage-card animate-on-scroll"
              style={{
                transitionDelay: `${(index % 3) * 0.1}s`,
                background: 'var(--bg-surface)',
                padding: '2rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                transition: 'all var(--transition-normal)'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
