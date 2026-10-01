import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function FoodHealthPreview() {
  const navigate = useNavigate();
  useScrollAnimation();

  const articles = [
    {
      id: 1,
      title: 'Smart Brain Foods for DELSU Exam Prep & Study Stamina',
      category: 'Student Nutrition',
      readTime: '5 min read',
      description: 'Discover affordable local foods in Abraka that can support sustained energy and help you stay focused during long study sessions.'
    },
    {
      id: 2,
      title: 'Understanding Local Abraka Soups: Banga vs Egusi vs Ogbono',
      category: 'Healthy Eating',
      readTime: '6 min read',
      description: "Explore the nutritional characteristics and traditional importance of Delta State's popular soup delicacies."
    },
    {
      id: 3,
      title: 'High-Protein Local Meals for Fitness & Muscle Recovery',
      category: 'Fitness & Bodybuilding',
      readTime: '4 min read',
      description: 'Explore affordable local sources of protein, including chicken, fish, eggs, and beans, that can fit into an active lifestyle.'
    }
  ];

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-subtitle">Nutritional Wellness</div>
          <h2 className="section-title">Food Health & Student Wellbeing</h2>
          <p className="section-description">
            Discover practical advice on balanced diets, exam study snacks, and energy-boosting local foods for DELSU students and Abraka residents.
          </p>
        </div>

        <div className="grid grid-cols-3" style={{ marginBottom: '3rem' }}>
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="article-card animate-on-scroll"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      background: 'var(--primary-light)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {article.category}
                  </span>

                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Clock size={14} />
                    {article.readTime}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.2rem',
                    marginBottom: '0.75rem',
                    lineHeight: '1.4'
                  }}
                >
                  {article.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}
                >
                  {article.description}
                </p>
              </div>

              <button
                className="btn btn-outline btn-sm btn-full"
                onClick={() => navigate('/food-health')}
                style={{ justifyContent: 'space-between', marginTop: 'auto' }}
                aria-label={`Read full article: ${article.title}`}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={15} />
                  Read Full Article
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/food-health')}
            style={{ padding: '0.85rem 2.25rem' }}
          >
            Explore Food & Health Guide
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
