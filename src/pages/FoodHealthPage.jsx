import React, { useState, useEffect, useMemo } from 'react';
import {
  HeartPulse,
  ShieldCheck,
  Apple,
  Flame,
  Droplets,
  Utensils,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  ChevronRight,
  Activity,
  Award,
  Zap,
  Leaf,
  Filter,
  BookOpen
} from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SubPageHeader from '../components/common/SubPageHeader';
import { NIGERIAN_FOODS, FOOD_CATEGORIES } from '../data/foodHealthData';

export default function FoodHealthPage() {
  useScrollAnimation();

  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedFood(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (selectedFood) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedFood]);

  const healthTips = [
    {
      icon: <Apple size={24} />,
      title: 'Balanced Local Diets',
      desc: "Pair traditional soups like Banga and Egusi with fresh leafy greens (Efo Riro, Ugwu, Bitterleaf) to boost essential vitamins and dietary fiber."
    },
    {
      icon: <Flame size={24} />,
      title: 'Freshly Prepared Meals',
      desc: 'Our partner kitchens cook meals fresh daily to guarantee optimal nutrient retention, rich authentic taste, and top hygiene safety.'
    },
    {
      icon: <Droplets size={24} />,
      title: 'Hydration Matters',
      desc: "Delta State's warm climate demands frequent hydration. Complement your meals with clean water, citrus, or natural fruit juices."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Hygiene & Packaging',
      desc: 'All UrbanEats delivery packages are sealed in food-grade insulated containers to preserve temperature and eliminate contamination.'
    }
  ];

  // Filter foods by category and search query
  const filteredFoods = useMemo(() => {
    return NIGERIAN_FOODS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.nativeAlias.toLowerCase().includes(query) ||
        item.nutritionSummary.toLowerCase().includes(query) ||
        item.benefit.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts = { All: NIGERIAN_FOODS.length };
    FOOD_CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = NIGERIAN_FOODS.filter((f) => f.category === cat).length;
      }
    });
    return counts;
  }, []);

  return (
    <div style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Sticky sub-page header */}
      <SubPageHeader title="Food & Health" />

      <div className="section page-header-tight sub-page-content">
        <div className="container">

          {/* Desktop header */}
          <div className="section-header animate-on-scroll sub-page-desktop-header">
            <div className="section-subtitle">Wellness & Local Nutrition</div>
            <h1 className="section-title">Nigerian Food & Health Guide</h1>
            <p className="section-description">
              Explore the rich nutritional profiles, health benefits, and cooking secrets behind authentic Nigerian and Delta delicacies. Click any food card to unlock the full health talk!
            </p>
          </div>

          {/* Hero Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#ffffff',
              padding: '2.5rem 2rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ flex: '1', minWidth: '280px', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  background: 'rgba(255, 90, 31, 0.2)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}
              >
                <HeartPulse size={16} />
                <span>Nourishing Delta & Beyond</span>
              </div>
              <h2 style={{ fontSize: '1.9rem', color: '#ffffff', marginBottom: '0.85rem', fontWeight: 800 }}>
                Eat Healthy, Live Strong with Native Meals
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.025rem', lineHeight: '1.6', maxWidth: '680px' }}>
                At UrbanEats, we believe good food is the foundation of energy, focus, and longevity.
                Discover the nutritional secrets behind Swallows, Native Soups, Rice, Yam, Plantains, Proteins, and Beans.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minWidth: '220px',
                zIndex: 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Interactive Health Talks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{NIGERIAN_FOODS.length}+ Native Foods Documented</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Utensils size={18} style={{ color: '#38BDF8' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>6 Distinct Food Categories</span>
              </div>
            </div>
          </div>

          {/* Interactive Native Foods Section */}
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Nigerian Native Foods & Health Directory
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                Click on any food card below to view its complete health talk, nutritional benefits, preparation secrets, and smart pairings.
              </p>
            </div>

            {/* Search & Category Filter Bar */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                marginBottom: '2.5rem',
                background: 'var(--bg-surface)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Search input */}
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search foods (e.g. Egusi, Banga, Pounded Yam, Amala, Suya, Pepper Soup, Nkwobi, Moi Moi...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginRight: '0.5rem'
                  }}
                >
                  <Filter size={15} /> Filter:
                </span>
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border:
                        selectedCategory === cat
                          ? '1px solid var(--primary)'
                          : '1px solid var(--border-color)',
                      background:
                        selectedCategory === cat
                          ? 'var(--primary)'
                          : 'var(--bg-alt)',
                      color: selectedCategory === cat ? '#ffffff' : 'var(--text-main)',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-full)',
                        background:
                          selectedCategory === cat
                            ? 'rgba(255, 255, 255, 0.25)'
                            : 'var(--bg-surface)',
                        color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)'
                      }}
                    >
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Cards Grid */}
            {filteredFoods.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3.5rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-color)'
                }}
              >
                <Utensils size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No foods match your search</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  Try searching for another native food like "Egusi", "Amala", "Pepper Soup", "Asun", "Banga", or "Moi Moi".
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                {filteredFoods.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFood(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedFood(item);
                      }
                    }}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '1.75rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.25s ease',
                      boxShadow: 'var(--shadow-sm)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <div>
                      {/* Top Row: Category badge & Tag */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.85rem',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)'
                          }}
                        >
                          {item.category}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Activity size={13} style={{ color: item.badgeColor }} />
                          {item.tag}
                        </span>
                      </div>

                      {/* Food Name & Native Alias */}
                      <h3
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          marginBottom: '0.25rem',
                          color: 'var(--text-main)'
                        }}
                      >
                        {item.name}
                      </h3>
                      <div
                        style={{
                          fontSize: '0.825rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.85rem',
                          fontStyle: 'italic'
                        }}
                      >
                        {item.nativeAlias}
                      </div>

                      {/* Nutrition Highlight */}
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          marginBottom: '0.65rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.4rem'
                        }}
                      >
                        <Sparkles size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item.nutritionSummary}</span>
                      </div>

                      {/* Benefit snippet */}
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--text-muted)',
                          lineHeight: '1.55',
                          marginBottom: '1.25rem'
                        }}
                      >
                        {item.benefit}
                      </p>
                    </div>

                    {/* Bottom CTA to open Health Talk */}
                    <div
                      style={{
                        paddingTop: '0.85rem',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          fontWeight: 500
                        }}
                      >
                        {item.calories}
                      </span>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        Food Health Talk <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Healthy Eating Tips Section */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2.5rem', fontWeight: 800 }}>
              Healthy Eating & Daily Wellness Tips
            </h2>
            <div className="grid grid-cols-4">
              {healthTips.map((tip, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto'
                    }}
                  >
                    {tip.icon}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>{tip.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Food Safety & Hygiene Standards */}
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '3rem 2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 800 }}>
              UrbanEats Partner Kitchen Safety Standards
            </h2>
            <div className="grid grid-cols-3">
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', fontWeight: 700 }}>Clean Kitchen Audits</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    All vendor kitchens undergo routine hygiene checks for ingredient freshness, oil quality, and hygienic storage.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', fontWeight: 700 }}>Sealed Thermal Transport</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Riders utilize insulated thermal bags to lock in heat and prevent exposure during fast delivery.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', fontWeight: 700 }}>Nutritional Transparency</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Continuous feedback ensures native Nigerian meals maintain nutritional integrity and authentic seasoning.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>{/* /container */}
      </div>{/* /section */}

      {/* FULL DETAILS MODAL FOR FOOD HEALTH TALK */}
      {selectedFood && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="food-modal-title"
          onClick={() => setSelectedFood(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl, 16px)',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              animation: 'zoomIn 0.25s ease-out'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                position: 'sticky',
                top: 0,
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-color)',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Utensils size={22} />
                </div>
                <div>
                  <h3
                    id="food-modal-title"
                    style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}
                  >
                    {selectedFood.name}
                  </h3>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {selectedFood.category} &bull; {selectedFood.nativeAlias}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                style={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  transition: 'background 0.2s'
                }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div style={{ padding: '1.75rem' }}>

              {/* Tagline / Sub-banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 90, 31, 0.08) 0%, rgba(255, 90, 31, 0.02) 100%)',
                  border: '1px solid rgba(255, 90, 31, 0.25)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Sparkles size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
                  {selectedFood.fullDetails.tagline}
                </p>
              </div>

              {/* Macronutrient Pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1.75rem'
                }}
              >
                {selectedFood.fullDetails.macronutrients.map((macro, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-alt)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      {macro.label}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {macro.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* The Food Health Talk Section */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <HeartPulse size={18} style={{ color: 'var(--primary)' }} />
                  The Food Health Talk & Wellness Profile
                </h4>
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.7',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-main)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    margin: 0
                  }}
                >
                  {selectedFood.fullDetails.healthTalk}
                </p>
              </div>

              {/* Key Health Benefits */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <Award size={18} style={{ color: 'var(--success)' }} />
                  Key Physiological Benefits
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {selectedFood.fullDetails.benefits.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        background: 'var(--bg-alt)',
                        padding: '0.9rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '3px' }} />
                      <div>
                        <strong style={{ fontSize: '0.925rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                          {b.title}
                        </strong>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {b.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Healthy Preparation Secret */}
              <div
                style={{
                  background: 'var(--bg-alt)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.5rem'
                }}
              >
                <h5
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <Leaf size={16} style={{ color: 'var(--success)' }} />
                  Healthy Preparation & Cooking Tips:
                </h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.55' }}>
                  {selectedFood.fullDetails.preparationTips}
                </p>
              </div>

              {/* Best Pairings */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--primary-light)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Recommended Pairings:
                  </span>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {selectedFood.fullDetails.bestPairings}
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div
              style={{
                position: 'sticky',
                bottom: 0,
                background: 'var(--bg-surface)',
                borderTop: '1px solid var(--border-color)',
                padding: '1rem 1.75rem',
                display: 'flex',
                justifyContent: 'flex-end',
                zIndex: 10
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedFood(null)}
                style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem' }}
              >
                Close Health Talk
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
