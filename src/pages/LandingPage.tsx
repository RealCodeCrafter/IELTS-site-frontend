import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('LandingPage render - user:', user);

  // Remove auto-redirect - let user stay on landing page even if logged in
  // User can manually navigate to dashboard via login

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(120% 120% at 20% 20%, rgba(37, 99, 235, 0.2), transparent), radial-gradient(120% 120% at 80% 0%, rgba(14, 165, 233, 0.2), transparent), radial-gradient(60% 60% at 50% 50%, rgba(139, 92, 246, 0.1), transparent), #0b1221',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      {/* Navigation Bar */}
      <nav style={{
        position: 'relative',
        zIndex: 100,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          IELTS Hub
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 1000 }}>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Login clicked, navigating to /login');
              navigate('/login', { replace: false });
            }}
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 16,
              padding: '10px 20px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-block',
              position: 'relative',
              zIndex: 1001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Login
          </div>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Register clicked, navigating to /register');
              navigate('/register', { replace: false });
            }}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 16,
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-block',
              position: 'relative',
              zIndex: 1001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
            }}
          >
            Register
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '72px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #2563eb, #0ea5e9, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 24,
          lineHeight: 1.1,
          letterSpacing: '-2px'
        }}>
          Master IELTS
          <br />
          <span style={{ fontSize: '56px' }}>Online</span>
        </div>
        
        <p style={{
          fontSize: 22,
          color: '#cbd5e1',
          marginBottom: 20,
          maxWidth: 600,
          margin: '0 auto 20px',
          lineHeight: 1.6
        }}>
          Practice and improve your IELTS skills with our comprehensive online testing platform. 
          Take full-length tests, get instant AI-powered feedback, and track your progress.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40, position: 'relative', zIndex: 1000 }}>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Get Started clicked, navigating to /register');
              navigate('/register', { replace: false });
            }}
            style={{
              padding: '16px 32px',
              fontSize: 18,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              position: 'relative',
              zIndex: 1001,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.4)';
            }}
          >
            Get Started
          </div>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Sign In clicked, navigating to /login');
              navigate('/login', { replace: false });
            }}
            style={{
              padding: '16px 32px',
              fontSize: 18,
              fontWeight: 700,
              background: 'transparent',
              color: '#e2e8f0',
              textDecoration: 'none',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              position: 'relative',
              zIndex: 1001,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Sign In
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24
      }}>
        {[
          {
            icon: '🎧',
            title: 'Listening Tests',
            description: 'Practice with authentic audio recordings and improve your listening comprehension skills.'
          },
          {
            icon: '📖',
            title: 'Reading Tests',
            description: 'Enhance your reading skills with comprehensive passages and detailed question analysis.'
          },
          {
            icon: '✍️',
            title: 'Writing Tasks',
            description: 'Get AI-powered feedback on your writing with grammar, coherence, and vocabulary analysis.'
          },
          {
            icon: '🗣️',
            title: 'Speaking Practice',
            description: 'Record and practice your speaking skills with instant AI evaluation and feedback.'
          }
        ].map((feature, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: 16 }}>{feature.icon}</div>
            <h3 style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 12,
              margin: '0 0 12px 0'
            }}>
              {feature.title}
            </h3>
            <p style={{
              color: '#cbd5e1',
              fontSize: 15,
              lineHeight: 1.6,
              margin: 0
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 24px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 40
      }}>
        {[
          { number: 'AI', label: 'Powered Feedback' },
          { number: '24/7', label: 'Available' },
          { number: 'IELTS', label: 'Band 0-9 Scale' }
        ].map((stat, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 8
            }}>
              {stat.number}
            </div>
            <div style={{
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* How It Works Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: 800,
          color: '#fff',
          marginBottom: 16,
          background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          How It Works
        </h2>
        <p style={{
          color: '#94a3b8',
          fontSize: 18,
          marginBottom: 48,
          maxWidth: 600,
          margin: '0 auto 48px'
        }}>
          Get started in three simple steps
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 32,
          maxWidth: 900,
          margin: '0 auto'
        }}>
          {[
            { step: '1', title: 'Create Account', desc: 'Sign up and get instant access to all practice tests' },
            { step: '2', title: 'Take Tests', desc: 'Complete Listening, Reading, Writing, and Speaking sections' },
            { step: '3', title: 'Get AI Feedback', desc: 'Receive instant AI-powered scores and detailed feedback' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 24,
                fontWeight: 800,
                color: '#fff'
              }}>
                {item.step}
              </div>
              <h3 style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 12,
                margin: '0 0 12px 0'
              }}>
                {item.title}
              </h3>
              <p style={{
                color: '#cbd5e1',
                fontSize: 15,
                lineHeight: 1.6,
                margin: 0
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px 80px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '48px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32
        }}>
          {[
            { icon: '⚡', title: 'Instant Results', desc: 'Get scores immediately after submission' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your improvement over time' },
            { icon: '🤖', title: 'AI-Powered', desc: 'Advanced AI analyzes your performance' }
          ].map((benefit, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: 12 }}>{benefit.icon}</div>
              <h4 style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                margin: '0 0 8px 0'
              }}>
                {benefit.title}
              </h4>
              <p style={{
                color: '#94a3b8',
                fontSize: 14,
                margin: 0,
                lineHeight: 1.5
              }}>
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: 14,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ margin: 0, marginBottom: 8 }}>
          © 2024 IELTS Hub. Practice makes perfect.
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>
          Practice platform for self-assessment. Not an official IELTS test.
        </p>
      </footer>
    </div>
  );
}
