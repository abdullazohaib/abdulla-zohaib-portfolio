import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  ArrowUpRight,
  Download,
  Copy,
  Send,
  X,
  Sparkles,
  BrainCircuit,
  Target,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import './styles.css';

/*
  Deployed Cloudflare AI backend
*/
const API_BASE_URL =
  'https://abdulla-zohaib-portfolio-api.abdullazohaib-work.workers.dev';

function GithubMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .7Z" />
    </svg>
  );
}

function LinkedinMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.04 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 5.04 0ZM.36 8h4.36v13.9H.36V8Zm7.1 0h4.18v1.9h.06c.58-1.1 2-2.26 4.1-2.26 4.38 0 5.19 2.88 5.19 6.63v7.63h-4.36v-6.77c0-1.62-.03-3.7-2.25-3.7-2.25 0-2.59 1.76-2.59 3.58v6.89H7.46V8Z" />
    </svg>
  );
}

const projects = [
  {
    name: 'CloudSentinel AI',
    status: 'Completed',
    description:
      'AI-Powered Cloud Incident Response & Observability Platform',
    image: '/projects/cloudsentinel.png',
    tags: ['Python', 'FastAPI', 'Docker'],
    github: 'https://github.com/abdullazohaib/CloudSentinel-AI',
    caseStudy: {
      howItWorks:
        'CloudSentinel AI receives incident and system-health information through a FastAPI backend, evaluates the incident with an AI-assisted workflow, identifies its severity and possible root cause, and produces recovery recommendations. Prometheus, Grafana, and Kubernetes monitoring provide operational context so the analysis is connected to the actual platform health.',
      features: [
        'Incident management',
        'Severity classification',
        'AI-assisted RCA',
        'Recovery recommendations',
        'Prometheus + Grafana monitoring',
        'Kubernetes health monitoring',
      ],
      technologies:
        'Python · FastAPI · LangGraph · Ollama · Prometheus · Grafana · Docker · Kubernetes · SQLite',
    },
  },
  {
    name: 'HealOps AI',
    status: 'Completed',
    description:
      'AI-Powered Incident Response & Observability Platform',
    image: '/projects/healops.png',
    tags: ['Python', 'LangGraph', 'LLM'],
    github: 'https://github.com/abdullazohaib/healops-ai',
    caseStudy: {
      howItWorks:
        'HealOps AI collects system and application incident data, analyzes it using an AI-assisted workflow, identifies possible anomalies and root causes, and generates recovery recommendations to help resolve incidents faster.',
      features: [
        'Log analysis',
        'Anomaly detection',
        'Root-cause analysis',
        'Recovery recommendations',
        'Kubernetes monitoring',
        'LLM-assisted workflows',
      ],
      technologies:
        'Python · FastAPI · LangGraph · Ollama · Prometheus · Grafana · Docker · Kubernetes',
    },
  },
  {
    name: 'TwinMind AI',
    status: 'Completed',
    description:
      'AI-Powered Digital Twin & Decision Simulation Platform',
    image: '/projects/twinmind.png',
    tags: ['Python', 'React', 'FastAPI'],
    github: 'https://github.com/abdullazohaib/twinmind-ai',
    caseStudy: {
      howItWorks:
        'TwinMind AI models a smart warehouse as an interactive digital twin, allowing operational data and what-if scenarios to be represented, simulated, compared, and evaluated. The system then uses optimization and AI-assisted reasoning to generate recommendations, with validation and human approval supporting the final decision.',
      features: [
        '3D warehouse twin',
        'Scenario modeling',
        'What-if simulation',
        'Baseline vs scenario comparison',
        'Optimization',
        'Human-in-the-loop decisions',
      ],
      technologies:
        'Python · React · Three.js · React Three Fiber · FastAPI · PostgreSQL',
    },
  },
  {
    name: 'Multimodal Smart Document QA',
    status: 'In Progress',
    description:
      'Multimodal Smart Document Analysis & Question Answering System',
    image: '/projects/document-qa.png',
    tags: ['RAG', 'LLM', 'NLP'],
    github: null,
    caseStudy: {
      howItWorks:
        'The system is being developed to analyze documents and answer natural-language questions using semantic retrieval, with support for text and voice interaction. The planned pipeline also includes reliability checking, multimodal analysis, and fake image or video detection so users can obtain more trustworthy answers from complex document content.',
      features: [
        'Document QA',
        'Text + voice interaction',
        'Semantic retrieval',
        'Reliability checking',
        'Fake media detection',
        'Customizable pipeline',
      ],
      technologies:
        'RAG · LLM · NLP · Semantic Retrieval · Multimodal Analysis',
    },
  },
  {
    name: 'Apex AI',
    status: 'Completed',
    description:
      'AI Response Comparison Platform (Multi-LLM)',
    image: '/projects/apex.png',
    tags: ['Python', 'LLM', 'FastAPI'],
    github: 'https://github.com/abdullazohaib/ApexAI',
    caseStudy: {
      howItWorks:
        'Apex AI sends a user request to multiple AI models, normalizes the returned responses, compares them using scoring-based evaluation, and presents the results in a single interface. The workflow helps users compare model quality and select a stronger answer instead of reviewing every response independently.',
      features: [
        'Multi-model comparison',
        'Response normalization',
        'Scoring-based evaluation',
        'Synthesis workflow',
        'FastAPI backend',
      ],
      technologies:
        'Python · FastAPI · LLM APIs · Response Evaluation · REST APIs',
    },
  },
];

const skills = [
  'Python',
  'FastAPI',
  'LangGraph',
  'LLMs',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'MongoDB',
  'React',
  'TypeScript',
  'Git',
  'Linux',
];

function App() {
  const [caseProject, setCaseProject] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your AI portfolio assistant. Ask me anything about my projects, skills, or experience.",
    },
  ]);
  const [previousId, setPreviousId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumePreview, setResumePreview] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [chat, busy]);

  const quick = useMemo(
    () => [
      'Tell me about CloudSentinel AI',
      'Which projects use LLMs?',
      'What tech stack do you use?',
      'How can I contact you?',
    ],
    []
  );

  async function ask(q) {
    const text = q.trim();

    if (!text || busy) return;

    setChat((current) => [
      ...current,
      { role: 'user', text },
    ]);

    setMessage('');
    setBusy(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          previous_interaction_id: previousId,
        }),
      });

      const raw = await res.text();

      let data;

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `Server returned invalid JSON (${res.status}).`
        );
      }

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            'Request failed'
        );
      }

      const answer =
        data?.response ||
        data?.answer ||
        data?.message;

      if (!answer) {
        throw new Error(
          'The AI server returned an empty response.'
        );
      }

      setChat((current) => [
        ...current,
        {
          role: 'assistant',
          text: answer,
        },
      ]);

      if (data?.interaction_id) {
        setPreviousId(data.interaction_id);
      }
    } catch (err) {
      setChat((current) => [
        ...current,
        {
          role: 'assistant',
          text: `The AI assistant could not connect right now. ${err.message}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(
        'abdullazohaib.work@gmail.com'
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        1600
      );
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="site">
      <header className="nav-wrap">
        <nav className="container nav">
          <a className="brand" href="#home">
            Abdulla Zohaib
          </a>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#resume">Resume</a>
            <a href="/assistant">AI Assistant</a>
            <a href="#contact">Contact</a>
          </div>

          <a className="gold-btn" href="#contact">
            Let's Connect
            <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>

      <main>
        <section className="container hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              AI ENGINEER
            </div>

            <h1>
              building things
              <br />
              that <em>matter.</em>
            </h1>

            <p>
              I build AI-powered applications, LLM solutions,
              and robust backend systems with a focus on
              performance, reliability, and real-world impact.
            </p>

            <div className="hero-actions">
              <a className="gold-btn" href="#projects">
                View My Projects
                <ArrowUpRight size={16} />
              </a>

              <a
                className="outline-btn"
                href="/resume.pdf"
                download
              >
                Download Resume
                <Download size={16} />
              </a>
            </div>

            <div className="social-row">
              <a
                href="https://github.com/abdullazohaib"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GithubMark />
              </a>

              <a
                href="https://www.linkedin.com/in/abdullazohaib/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinMark />
              </a>

              <a
                href="mailto:abdullazohaib.work@gmail.com"
                aria-label="Email"
              >
                <Mail />
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mesh" />

            <div className="hero-illustration">
              <div className="books">
                <div>LEARN. BUILD.</div>
                <div>REPEAT.</div>
                <div>GROW.</div>
              </div>

              <div className="laptop">
                <div className="screen">
                  <div className="screen-title">
                    AI Systems
                  </div>

                  <div className="screen-orbit" />

                  <div className="screen-list">
                    <span>Data Pipeline</span>
                    <span>Model Training</span>
                    <span>Evaluation</span>
                    <span>Deployment</span>
                    <span>Monitoring</span>
                    <span>Performance</span>
                  </div>
                </div>
              </div>

              <div className="plant">⌁</div>
              <div className="mug">AZ.</div>
              <div className="pen" />
            </div>

            <div className="assistant-card">
              <div className="assistant-head">
                <div>
                  <Sparkles size={16} />
                  AI Project Assistant
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setChatOpen((v) => !v)
                  }
                >
                  {chatOpen ? '—' : '+'}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {chatOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                  >
                    <div className="chat-window">
                      {chat.map((m, i) => (
                        <div
                          key={i}
                          className={
                            m.role === 'user'
                              ? 'bubble user'
                              : 'bubble'
                          }
                        >
                          {m.text}
                        </div>
                      ))}

                      {busy && (
                        <div className="bubble">
                          Thinking…
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>

                    <div className="quick-row">
                      {quick.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => ask(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <form
                      className="chat-input"
                      onSubmit={(e) => {
                        e.preventDefault();
                        ask(message);
                      }}
                    >
                      <input
                        value={message}
                        onChange={(e) =>
                          setMessage(e.target.value)
                        }
                        placeholder="Ask a question..."
                      />

                      <button
                        type="submit"
                        aria-label="Send"
                      >
                        <Send size={15} />
                      </button>
                    </form>

                    <div className="powered">
                      Powered by Gemini
                    </div>

                    <a
                      className="assistant-full-link"
                      href="/assistant"
                    >
                      Open full AI Project Assistant
                      <ArrowUpRight size={12} />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section
          className="container section"
          id="skills"
        >
          <div className="section-label">
            SKILLS &amp; TOOLS
          </div>

          <div className="skill-grid">
            {skills.map((skill) => (
              <div
                key={skill}
                className="skill-pill"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

        <section
          className="container section projects-section"
          id="projects"
        >
          <div className="section-heading">
            <div>
              <div className="section-label">
                SELECTED WORK
              </div>

              <h2>
                Projects built to solve real problems.
              </h2>
            </div>

            <span>5 PROJECTS</span>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <motion.article
                whileHover={{ y: -4 }}
                key={project.name}
                className="project-card"
              >
                <div className="project-visual">
                  <img
                    src={project.image}
                    alt={`${project.name} project visual`}
                    loading="lazy"
                  />
                </div>

                <div className="project-body">
                  <div className="status-row">
                    <span
                      className={
                        project.status === 'In Progress'
                          ? 'status progress'
                          : 'status'
                      }
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3>{project.name}</h3>

                  <p>{project.description}</p>

                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-actions">
                    {project.github && (
                      <a
                        className="small-btn"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                        <ArrowUpRight size={13} />
                      </a>
                    )}

                    <button
                      className="case-btn"
                      type="button"
                      onClick={() =>
                        setCaseProject(project)
                      }
                    >
                      View Case Study
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section
          className="container about-card"
          id="about"
        >
          <div className="about-main">
            <div className="section-label">
              ABOUT ABDULLA ZOHAIB
              <Sparkles size={13} />
            </div>

            <h2>
              Building{' '}
              <span>Intelligent Systems</span>
              <br />
              that Solve Real-World Problems.
            </h2>

            <p>
              I’m a Computer Science and Engineering
              student specializing in AI &amp; ML, focused on
              building practical AI systems, LLM
              applications, backend platforms, and
              production-oriented engineering workflows.
            </p>

            <a
              className="outline-btn"
              href="#contact"
            >
              Read More About Me
              <ArrowUpRight size={15} />
            </a>
          </div>

          <div
            className="about-visual"
            aria-hidden="true"
          >
            <img
              src="/about-workspace.png"
              alt=""
            />
          </div>

          <div className="about-replacement">
            <Feature
              icon={<BrainCircuit />}
              title="What I Do"
              text="I build AI-powered applications, LLM solutions, backend APIs, and intelligent automation systems that solve real-world problems and create value."
            />

            <Feature
              icon={<Lightbulb />}
              title="What I’m Interested In"
              text="AI/ML, LLMs, agentic systems, backend engineering, cloud systems, DevOps, observability, and building scalable software architectures."
            />

            <Feature
              icon={<Target />}
              title="How I Build"
              text="I follow a practical approach: Understand → Plan → Design → Build → Test → Deploy → Improve. Always focusing on quality, performance, and impact."
            />
          </div>

          <div className="about-quote">
            <span className="about-quote-mark">
              “
            </span>

            <p>
              I believe in clean code, continuous
              learning, and building solutions that{' '}
              <strong>create real impact.</strong>
            </p>
          </div>
        </section>

        <section
          className="container section resume-section"
          id="resume"
        >
          <div className="resume-showcase">
            <div className="resume-content">
              <div className="resume-kicker">
                <span>RESUME</span>
              </div>

              <h2>Abdulla Zohaib</h2>

              <div className="resume-role">
                AI/ML &amp; SOFTWARE ENGINEERING
              </div>

              <div className="resume-rule" />

              <p>
                Download my latest resume to explore
                my education, skills, projects, and
                experience in AI/ML and software
                engineering.
              </p>

              <div className="resume-actions">
                <a
                  className="gold-btn"
                  href="/resume.pdf"
                  download
                >
                  Download Resume
                  <Download size={16} />
                </a>

                <button
                  className="outline-btn"
                  type="button"
                  onClick={() =>
                    setResumePreview(true)
                  }
                >
                  Preview Resume
                  <span className="resume-eye">
                    ◉
                  </span>
                </button>
              </div>
            </div>

            <div
              className="resume-visual"
              aria-hidden="true"
            >
              <img
                className="resume-demo-image"
                src="/resume-demo.png"
                alt=""
              />
            </div>

            <div className="resume-bottom-banner">
              <div className="resume-banner-icon">
                ✦
              </div>

              <div>
                <strong>
                  Clean code. Scalable systems. Real
                  impact.
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="container contact-card"
          id="contact"
        >
          <div>
            <div className="section-label">
              LET'S CONNECT
            </div>

            <h2>
              Let's Connect with Abdulla Zohaib
            </h2>
          </div>

          <div className="contact-right">
            <div className="email-line">
              <Mail size={20} />

              <strong>
                abdullazohaib.work@gmail.com
              </strong>

              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email"
              >
                <Copy size={16} />
              </button>

              {copied && (
                <span className="copied">
                  Copied ✓
                </span>
              )}
            </div>

            <div className="contact-links">
              <a href="mailto:abdullazohaib.work@gmail.com">
                Gmail
              </a>

              <a
                href="https://www.linkedin.com/in/abdullazohaib/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/abdullazohaib"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <span>
          Abdulla Zohaib — Building intelligent systems
          for real-world problems.
        </span>

        <span>
          © {new Date().getFullYear()} Abdulla Zohaib
        </span>
      </footer>

      <AnimatePresence>
        {resumePreview && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setResumePreview(false)
            }
          >
            <motion.div
              className="resume-preview-modal"
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 20,
                opacity: 0,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-top">
                <div>
                  <div className="section-label">
                    RESUME PREVIEW
                  </div>

                  <h2>Abdulla Zohaib</h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setResumePreview(false)
                  }
                  aria-label="Close resume preview"
                >
                  <X />
                </button>
              </div>

              <iframe
                className="resume-iframe"
                src="/resume.pdf#toolbar=0"
                title="Abdulla Zohaib resume preview"
              />

              <div className="modal-actions">
                <a
                  className="gold-btn"
                  href="/resume.pdf"
                  download
                >
                  Download Resume
                  <Download size={16} />
                </a>

                <button
                  className="outline-btn"
                  type="button"
                  onClick={() =>
                    setResumePreview(false)
                  }
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {caseProject && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setCaseProject(null)
            }
          >
            <motion.div
              className="case-modal"
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 20,
                opacity: 0,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-top">
                <div>
                  <div className="section-label">
                    PROJECT CASE STUDY
                  </div>

                  <h2>{caseProject.name}</h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCaseProject(null)
                  }
                  aria-label="Close"
                >
                  <X />
                </button>
              </div>

              <div className="case-section">
                <div className="case-heading">
                  How It Works
                </div>

                <p>
                  {caseProject.caseStudy.howItWorks}
                </p>
              </div>

              <div className="case-section">
                <div className="case-heading">
                  Key Features
                </div>

                <div className="feature-list">
                  {caseProject.caseStudy.features.map(
                    (feature) => (
                      <div key={feature}>
                        <CheckCircle2 size={16} />
                        {feature}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="case-section">
                <div className="case-heading">
                  Technologies
                </div>

                <div className="technology-box">
                  {caseProject.caseStudy.technologies}
                </div>
              </div>

              <div className="modal-actions">
                {caseProject.github && (
                  <a
                    className="gold-btn"
                    href={caseProject.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub Repository
                    <ArrowUpRight size={15} />
                  </a>
                )}

                <button
                  className="outline-btn"
                  type="button"
                  onClick={() =>
                    setCaseProject(null)
                  }
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="feature">
      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <span />
    </div>
  );
}

function AssistantPage() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [previousId, setPreviousId] =
    useState(null);

  const [chat, setChat] = useState([
    {
      role: 'assistant',
      text: 'Hi! I’m Abdulla’s AI Project Assistant. Ask me anything about the projects, skills, technologies, or experience shown on this portfolio.',
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [chat, busy]);

  async function ask(q) {
    const text = q.trim();

    if (!text || busy) return;

    setChat((current) => [
      ...current,
      {
        role: 'user',
        text,
      },
    ]);

    setMessage('');
    setBusy(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
            previous_interaction_id:
              previousId,
          }),
        }
      );

      const raw = await res.text();

      let data;

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `Server returned invalid JSON (${res.status}).`
        );
      }

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            'Request failed'
        );
      }

      const answer =
        data?.response ||
        data?.answer ||
        data?.message;

      if (!answer) {
        throw new Error(
          'The AI server returned an empty response.'
        );
      }

      setChat((current) => [
        ...current,
        {
          role: 'assistant',
          text: answer,
        },
      ]);

      if (data?.interaction_id) {
        setPreviousId(
          data.interaction_id
        );
      }
    } catch (err) {
      setChat((current) => [
        ...current,
        {
          role: 'assistant',
          text: `The AI assistant could not connect right now. ${err.message}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="assistant-page">
      <header className="nav-wrap">
        <nav className="container nav">
          <a
            className="brand"
            href="/"
          >
            Abdulla Zohaib
          </a>

          <div className="nav-links">
            <a href="/">Home</a>

            <a href="/#projects">
              Projects
            </a>

            <a href="/#skills">
              Skills
            </a>

            <a
              href="/assistant"
              className="active"
            >
              AI Assistant
            </a>
          </div>

          <a
            className="gold-btn"
            href="/"
          >
            Back to Portfolio
            <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>

      <main className="container assistant-page-main">
        <div className="assistant-page-kicker">
          <Sparkles size={15} />
          AI PROJECT ASSISTANT
        </div>

        <h1>
          Ask anything about the work.
        </h1>

        <p className="assistant-page-intro">
          Explore Abdulla Zohaib’s projects,
          technologies, engineering approach,
          and AI/ML experience through a
          Gemini-powered portfolio assistant.
        </p>

        <div className="assistant-page-shell">
          <div className="assistant-page-chat">
            {chat.map(
              (item, index) => (
                <div
                  key={index}
                  className={
                    item.role === 'user'
                      ? 'bubble user large'
                      : 'bubble large'
                  }
                >
                  {item.text}
                </div>
              )
            )}

            {busy && (
              <div className="bubble large">
                Thinking…
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <form
            className="assistant-page-input"
            onSubmit={(e) => {
              e.preventDefault();
              ask(message);
            }}
          >
            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask about CloudSentinel AI, TwinMind AI, skills, technologies…"
            />

            <button type="submit">
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const root = createRoot(
  document.getElementById('root')
);

root.render(
  window.location.pathname === '/assistant' ? (
    <AssistantPage />
  ) : (
    <App />
  )
);