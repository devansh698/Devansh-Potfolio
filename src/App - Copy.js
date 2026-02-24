import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';
import { FaReact, FaNodeJs, FaJava, FaPython } from 'react-icons/fa';
import { SiDotnet, SiMongodb, SiMysql, SiFirebase } from 'react-icons/si';
import './styles/global.css';
import './styles/animations.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className="navbar">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="logo"
        >
          Devansh<span className="highlight">.</span>
        </motion.div>
        <div className="nav-links">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hi, I'm <span className="highlight">Devansh Handa</span>
          </motion.h1>
          
          <TypeAnimation
            sequence={[
              'Computer Science Engineer',
              1000,
              'Full-Stack Developer',
              1000,
              'UI/UX Enthusiast',
              1000
            ]}
            wrapper="h2"
            className="subtitle"
            repeat={Infinity}
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="hero-text"
          >
            Building impactful software solutions with modern technologies
          </motion.p>
          
          <div className="hero-buttons">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="btn primary"
            >
              View My Work
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="btn secondary"
            >
              Contact Me
            </motion.a>
          </div>
        </div>

        <motion.div 
          className="tech-icons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <FaReact className="icon" />
          <SiDotnet className="icon" />
          <FaNodeJs className="icon" />
          <SiMongodb className="icon" />
          <SiMysql className="icon" />
          <FaJava className="icon" />
          <FaPython className="icon" />
          <SiFirebase className="icon" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About <span className="highlight">Me</span>
        </motion.h2>
        
        <div className="about-content">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="about-image-container"
          >
            <div className="pulse-circle outer"></div>
            <div className="pulse-circle middle"></div>
            <div className="pulse-circle inner"></div>
            <div className="profile-image">
              {/* Replace with your image */}
              <div className="placeholder-image">👨‍💻</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="about-text"
          >
            <h3>Computer Science and Engineering Student</h3>
            <p>
              Motivated Computer Science and Engineering student with a passion for developing impactful software solutions. 
              Skilled in C# .NET, React.js, and SQL Server, with experience in full-stack development, UI/UX design, and backend optimization.
            </p>
            
            <div className="education">
              <h4>Education</h4>
              <div className="education-list">
                <div className="education-item">
                  <div className="bullet"></div>
                  <span>Bachelor of Engineering (BE) - Chitkara University (2022-2026)</span>
                </div>
                <div className="education-item">
                  <div className="bullet"></div>
                  <span>Senior Secondary School - D.A.V. Public School, Kurukshetra (2021-2022)</span>
                </div>
                <div className="education-item">
                  <div className="bullet"></div>
                  <span>Secondary School - D.A.V. Public School, Kurukshetra (2019-2020)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="highlight">Skills</span>
        </motion.h2>
        
        <div className="skills-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="technical-skills"
          >
            <h3>Technical Skills</h3>
            <div className="skills-list">
              {[
                { name: 'Java', level: 85 },
                { name: 'JavaScript', level: 90 },
                { name: 'Python', level: 80 },
                { name: 'C#/.NET', level: 75 },
                { name: 'React.js', level: 85 },
                { name: 'Node.js', level: 80 },
                { name: 'SQL', level: 85 },
                { name: 'MongoDB', level: 75 },
              ].map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div 
                      className="skill-progress" 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="soft-skills"
          >
            <h3>Soft Skills</h3>
            <div className="soft-skills-list">
              {[
                'Problem-Solving', 'Strong Communication', 'Project Management', 
                'Design Thinking', 'Logical Reasoning', 'Team Collaboration',
                'Time Management', 'Adaptability'
              ].map((skill, index) => (
                <motion.span
                  key={index}
                  className="skill-tag"
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
            
            <h3>Languages</h3>
            <div className="languages-list">
              {['English', 'Hindi'].map((lang, index) => (
                <motion.div
                  key={index}
                  className="language-tag"
                  whileHover={{ scale: 1.05 }}
                >
                  {lang}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="highlight">Projects</span>
        </motion.h2>
        
        <div className="projects-grid">
          {[
            {
              title: "Job Boarding Platform",
              description: "Designed a job portal that managed 5,000+ applications monthly with improved user engagement and database efficiency.",
              tech: ["React", "Node.js", "MongoDB"],
              metrics: "5,000+ monthly applications"
            },
            {
              title: "PayPilot – Smart Billing System",
              description: "Designed an intuitive UI using React.js, improving user experience and reducing effort by 50%.",
              tech: ["React", "Express", "SQL Server"],
              metrics: "50% effort reduction, 20% accuracy improvement"
            },
            {
              title: "Property Rental Platform",
              description: "Boosted booking efficiency by 30% with an intuitive UI and optimized database.",
              tech: ["Angular", "Firebase"],
              metrics: "30% efficiency boost"
            },
            {
              title: "E-Commerce Platform",
              description: "Developed a scalable e-commerce platform that increased customer retention by 30%.",
              tech: ["React", "Node.js", "MongoDB"],
              metrics: "30% retention increase"
            },
            {
              title: "Banking Dashboard",
              description: "Built an interactive banking dashboard that reduced processing time by 40%.",
              tech: ["React", "Spring Boot", "MySQL"],
              metrics: "40% time reduction"
            },
            {
              title: "Weather App",
              description: "Integrated multiple APIs to provide accurate weather data with enhanced UI.",
              tech: ["React", "API Integration"],
              metrics: "Improved performance"
            }
          ].map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="project-image">
                <div className="project-icon">📊</div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-metrics">
                  {project.metrics}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="highlight">Experience</span>
        </motion.h2>
        
        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          <div className="timeline-items">
            <motion.div
              className="timeline-item"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="timeline-content">
                <div className="timeline-dot"></div>
                <h3>Cisco AICTE Virtual Internship Program 2024</h3>
                <div className="timeline-date">Apr 2024 - Jun 2024</div>
                <ul className="timeline-description">
                  <li>Gained hands-on experience in computer networking, network security, and cloud technologies</li>
                  <li>Worked on real-world networking projects, including routing, switching, and network automation</li>
                  <li>Learned to configure and troubleshoot networks using Cisco Packet Tracer</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="certifications-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="highlight">Certifications</span>
        </motion.h2>
        
        <div className="certifications-grid">
          {[
            "Google Analytics for Beginners – Google",
            "Foundations of Cybersecurity – Google (Coursera)",
            "Cybersecurity Essentials – Cisco Networking Academy",
            "Introduction to Artificial Intelligence (AI) – IBM (Coursera)",
            "Generative AI: Introduction and Applications – IBM (Coursera)",
            "Building AI-Powered Chatbots Without Programming – IBM (Coursera)",
            "Health Informatics Specialization – Johns Hopkins University (Coursera)",
            "Foundations of Marketing Analytics – Emory University (Coursera)",
            "Rest API (Intermediate) (HackerRank)",
            "C# (Basic) (HackerRank)",
            "SQL (HackerRank)",
            "React (HackerRank)"
          ].map((cert, index) => (
            <motion.div
              key={index}
              className="certification-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="certification-icon">
                <span>📜</span>
              </div>
              <div className="certification-text">
                <h3>{cert.split('–')[0].trim()}</h3>
                <p>{cert.split('–').slice(1).join('–').trim()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get In <span className="highlight">Touch</span>
        </motion.h2>
        
        <div className="contact-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="contact-info"
          >
            <h3>Contact Information</h3>
            <p>
              Feel free to reach out to me for any questions or opportunities!
            </p>
            
            <div className="contact-methods">
              <div className="contact-item">
                <div className="contact-icon">
                  <FiMail />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>devanshhanda0001@gmail.com</p>
                </div>
              </div>
              
              <div className="social-links">
                <motion.a 
                  href="https://github.com/devansh698/" 
                  target="_blank"
                  whileHover={{ y: -5 }}
                  className="social-icon"
                >
                  <FiGithub />
                </motion.a>
                <motion.a 
                  href="www.linkedin.com/in/devanshhanda" 
                  target="_blank"
                  whileHover={{ y: -5 }}
                  className="social-icon"
                >
                  <FiLinkedin />
                </motion.a>
                <motion.a 
                  href="https://twitter.com" 
                  target="_blank"
                  whileHover={{ y: -5 }}
                  className="social-icon"
                >
                  <FiTwitter />
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="contact-form"
          >
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={4}></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="submit-btn"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Devansh Handa. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;