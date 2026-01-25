import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { paymentsApi } from '../api/payments';

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
          BandMaster
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

        {/* Practice mode label */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 18px',
          borderRadius: 999,
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.6)',
          color: '#e2e8f0',
          fontSize: 13,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginTop: 24
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '999px',
            background: '#22c55e',
            boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.35)'
          }} />
          <span>Practice mode · Self‑assessment only · Not an official IELTS test</span>
        </div>

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

      {/* Practice Modes Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px 40px'
      }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          color: '#fff',
          marginBottom: 24,
          textAlign: 'center',
          letterSpacing: '-0.5px'
        }}>
          Practice the Way You Will Be Tested
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24
        }}>
          {[
            {
              title: 'Full IELTS Mock Test',
              desc: 'Simulate the full exam under timed conditions with Listening, Reading, Writing, and Speaking in one session.',
              items: ['Realistic timing and structure', 'Section-by-section navigation', 'Automatic submission when time is up']
            },
            {
              title: 'Section Practice Mode',
              desc: 'Focus on one skill at a time when you want targeted practice.',
              items: ['Individual Listening, Reading, Writing, Speaking modules', 'Repeat attempts allowed', 'See how each skill improves']
            },
            {
              title: 'Progress & Analytics',
              desc: 'Understand where you are strong and where you need more practice.',
              items: ['History of your attempts', 'Per‑skill performance overview', 'Trend of your estimated band over time']
            }
          ].map((mode, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                borderRadius: 20,
                padding: 28,
                border: '1px solid rgba(148, 163, 184, 0.45)',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.7)'
              }}
            >
              <h3 style={{
                color: '#e5e7eb',
                fontSize: 20,
                fontWeight: 700,
                margin: '0 0 10px 0'
              }}>
                {mode.title}
              </h3>
              <p style={{
                color: '#9ca3af',
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 12px 0'
              }}>
                {mode.desc}
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: '#cbd5e1',
                fontSize: 13,
                lineHeight: 1.7
              }}>
                {mode.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#22c55e', marginTop: 2 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* What This Platform Is / Is Not */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px 40px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24
        }}>
          <div style={{
            background: 'rgba(22, 163, 74, 0.08)',
            borderRadius: 18,
            padding: 24,
            border: '1px solid rgba(34, 197, 94, 0.4)'
          }}>
            <h3 style={{
              color: '#bbf7d0',
              fontSize: 18,
              fontWeight: 700,
              margin: '0 0 10px 0'
            }}>
              This platform is for:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#dcfce7',
              fontSize: 14,
              lineHeight: 1.7
            }}>
              <li>• Practicing IELTS‑style tasks in a realistic environment</li>
              <li>• Testing your skills before booking the real exam</li>
              <li>• Getting AI‑powered feedback on your performance</li>
              <li>• Tracking your progress over time</li>
            </ul>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            borderRadius: 18,
            padding: 24,
            border: '1px solid rgba(248, 113, 113, 0.5)'
          }}>
            <h3 style={{
              color: '#fecaca',
              fontSize: 18,
              fontWeight: 700,
              margin: '0 0 10px 0'
            }}>
              This platform is not:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#fee2e2',
              fontSize: 14,
              lineHeight: 1.7
            }}>
              <li>• An official IELTS test provider</li>
              <li>• Affiliated with IELTS, IDP, British Council, or Cambridge</li>
              <li>• A replacement for taking the real IELTS exam</li>
              <li>• A guarantee of any specific band score</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ / Help Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1000,
        margin: '0 auto',
        padding: '0 24px 80px'
      }}>
        <h2 style={{
          fontSize: 30,
          fontWeight: 800,
          color: '#fff',
          marginBottom: 24,
          textAlign: 'center'
        }}>
          Frequently Asked Questions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20
        }}>
          {[
            {
              q: 'Are these official IELTS exams?',
              a: 'No. This is a practice platform designed to simulate IELTS‑style tasks. It is not affiliated with any official IELTS organization.'
            },
            {
              q: 'How accurate are the AI scores?',
              a: 'Scores are estimates based on your answers and are intended for self‑assessment only. They help you understand your level but do not replace an official IELTS score.'
            },
            {
              q: 'Can I use this platform to prepare for both Academic and General Training?',
              a: 'Yes. You can practice skills that are relevant for both IELTS Academic and General Training, especially Reading, Writing, and Speaking.'
            },
            {
              q: 'Do I need a teacher to use this platform?',
              a: 'No. You can use it independently, but teachers can also use it to track students’ practice and guide them based on the AI feedback.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                borderRadius: 16,
                padding: 20,
                border: '1px solid rgba(148, 163, 184, 0.4)'
              }}
            >
              <h4 style={{
                color: '#e5e7eb',
                fontSize: 16,
                fontWeight: 700,
                margin: '0 0 8px 0'
              }}>
                {item.q}
              </h4>
              <p style={{
                color: '#9ca3af',
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0
              }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px 80px'
      }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          color: '#fff',
          marginBottom: 8,
          textAlign: 'center',
          letterSpacing: '-0.5px'
        }}>
          Simple pricing for every learner
        </h2>
        <p style={{
          color: '#9ca3af',
          fontSize: 15,
          textAlign: 'center',
          margin: '0 0 32px 0'
        }}>
          Affordable options in UZS – choose per‑exam access or monthly subscription.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24
        }}>
          {/* Single exam plan */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            borderRadius: 20,
            padding: 28,
            border: '1px solid rgba(148, 163, 184, 0.6)',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.8)'
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a5b4fc',
              marginBottom: 8
            }}>
              Single Exam
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#e5e7eb' }}>10 000</span>
              <span style={{ fontSize: 14, color: '#9ca3af' }}>UZS</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 16px 0' }}>
              Pay once and access one full IELTS‑style mock exam.
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 20px 0',
              color: '#cbd5e1',
              fontSize: 13,
              lineHeight: 1.7
            }}>
              <li>• 1 complete attempt (all 4 sections)</li>
              <li>• AI‑powered scoring and feedback</li>
              <li>• Results saved to your history</li>
            </ul>
            <button
              onClick={async () => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                try {
                  // For single attempt, we need examId - redirect to exam selection or show modal
                  // For now, we'll show a message that user needs to select an exam first
                  alert('Please select an exam from the dashboard first, then purchase access.');
                  navigate('/dashboard');
                } catch (err: any) {
                  console.error('Payment error:', err);
                  alert('Error creating payment. Please try again.');
                }
              }}
              style={{
                marginTop: 16,
                width: '100%',
                padding: '12px 18px',
                borderRadius: 999,
                border: 'none',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#f9fafb',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(22, 163, 74, 0.6)'
              }}
            >
              Buy 1 exam
            </button>
          </div>

          {/* Monthly plan */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            borderRadius: 20,
            padding: 28,
            border: '1px solid rgba(34, 197, 94, 0.7)',
            boxShadow: '0 24px 60px rgba(22, 163, 74, 0.9)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.6)',
              color: '#bbf7d0',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Recommended
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#bbf7d0',
              marginBottom: 8
            }}>
              Monthly Access
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: '#e5e7eb' }}>50 000</span>
              <span style={{ fontSize: 14, color: '#9ca3af' }}>UZS / month</span>
            </div>
            <p style={{ color: '#d1fae5', fontSize: 14, margin: '0 0 16px 0' }}>
              Access multiple mock exams for one month and track all attempts.
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 20px 0',
              color: '#a7f3d0',
              fontSize: 13,
              lineHeight: 1.7
            }}>
              <li>• Unlimited practice attempts (fair‑use)</li>
              <li>• All future exams added during your month</li>
              <li>• Full history and analytics</li>
            </ul>
            <button
              onClick={async () => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                try {
                  const payment = await paymentsApi.createPayment({
                    type: 'subscription',
                    planCode: 'MONTHLY',
                  });
                  // Redirect to Click payment page
                  window.location.href = payment.clickUrl;
                } catch (err: any) {
                  console.error('Payment error:', err);
                  alert('Error creating payment. Please try again.');
                }
              }}
              style={{
                marginTop: 16,
                width: '100%',
                padding: '12px 18px',
                borderRadius: 999,
                border: 'none',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#f9fafb',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(22, 163, 74, 0.9)'
              }}
            >
              Start monthly plan
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px 32px',
        color: '#94a3b8',
        fontSize: 13,
        borderTop: '1px solid rgba(148, 163, 184, 0.4)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: 24,
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: '-0.4px',
              color: '#e5e7eb',
              marginBottom: 8
            }}>
              BandMaster
            </div>
            <p style={{ margin: 0, maxWidth: 420, lineHeight: 1.7 }}>
              BandMaster is an independent practice platform that helps you prepare for IELTS‑style exams with realistic tests, instant feedback, and clear insights into your performance.
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#e5e7eb', fontSize: 14, fontWeight: 700 }}>
              For learners
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.7 }}>
              <li>Practice full mock exams</li>
              <li>Focus on individual skills</li>
              <li>Review your attempt history</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#e5e7eb', fontSize: 14, fontWeight: 700 }}>
              Important
            </h4>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              This website is for practice and self‑assessment only. It is not an official IELTS website and is not endorsed by IELTS, IDP, British Council, or Cambridge.
            </p>
          </div>
        </div>
        <div style={{
          marginTop: 24,
          borderTop: '1px solid rgba(51, 65, 85, 0.7)',
          paddingTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12
        }}>
          <span>© {new Date().getFullYear()} BandMaster. All rights reserved.</span>
          <span>Practice platform · Not an official test provider.</span>
        </div>
      </footer>
    </div>
  );
}
