import React, { useState, useEffect, Suspense, FormEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { Github, Linkedin, Mail, ArrowUpRight, Terminal, Server, Database, Code, Cpu, Network, FileText, Menu, X, Phone } from 'lucide-react';
import { FloatingShapes } from './components/FloatingShapes';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Fetch LinkedIn profile data
  const [profileData, setProfileData] = useState({
    name: "Raghav Kathuria",
    title: "Cloud & DevOps Engineer",
    location: "India",
    phone: "+91 7011933060",
    whatsapp: "+91 7011933060"
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_lgba6rh',
        'template_mezf2a9',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'Raghavkathuria69@outlook.com'
        },
        'vBw_4CiOoJDdGlAVD'
      );

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Email error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigationItems = [
    ['About', 'about'],
    ['Experience', 'experience'],
    ['Skills', 'skills'],
    ['Projects', 'projects'],
    ['Services', 'services'],
    ['Blog', 'blog'],
    ['Contact', 'contact'],
  ];

  const renderNavigation = (isMobile = false) => (
    <ul className={`${isMobile ? 'mt-8' : 'mt-16'} w-max`}>
      {navigationItems.map(([label, page]) => (
        <li key={label}>
          <button 
            onClick={() => {
              setCurrentPage(page);
              if (isMobile) setIsMobileMenuOpen(false);
            }}
            className={`group flex items-center py-3 ${currentPage === page ? 'text-blue-400' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="nav-indicator mr-4 h-px w-8 transition-all" />
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors">
              {label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  const renderContactForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Your name"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="your.email@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Your message..."
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );

  const socialLinks = (
    <ul className="ml-1 mt-8 flex items-center gap-6" aria-label="Social media">
      <li className="flex">
        <a 
          href="https://github.com" 
          className="group flex text-sm font-medium p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Github className="h-5 w-5 text-zinc-500 transition group-hover:text-blue-400" />
        </a>
      </li>
      <li className="flex">
        <a 
          href="https://www.linkedin.com/in/raghavkathuria0/" 
          className="group flex text-sm font-medium p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Linkedin className="h-5 w-5 text-zinc-500 transition group-hover:text-blue-400" />
        </a>
      </li>
      <li className="flex">
        <a 
          href="mailto:Raghavkathuria69@outlook.com" 
          className="group flex text-sm font-medium p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Mail className="h-5 w-5 text-zinc-500 transition group-hover:text-blue-400" />
        </a>
      </li>
      <li className="flex">
        <a 
          href={`tel:${profileData.phone}`}
          className="group flex text-sm font-medium p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Phone className="h-5 w-5 text-zinc-500 transition group-hover:text-blue-400" />
        </a>
      </li>
    </ul>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-zinc-200">
      <Toaster position="top-right" />
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FloatingShapes />
          </Suspense>
        </Canvas>
      </div>

      {/* Custom cursor */}
      <div 
        className={`fixed w-4 h-4 rounded-full pointer-events-none z-50 transition-transform duration-200 mix-blend-difference ${
          isHovered ? 'scale-[4] bg-blue-400' : 'scale-1 bg-blue-400'
        }`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-zinc-800/90 rounded-lg lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-blue-400" />
        ) : (
          <Menu className="h-6 w-6 text-blue-400" />
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-900/95 lg:hidden">
          <div className="flex flex-col h-full p-8">
            <nav className="mt-16">
              {renderNavigation(true)}
            </nav>
            {socialLinks}
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 relative z-10">
        <div className="lg:flex lg:justify-between lg:gap-4">
          {/* Left column */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-zinc-100 sm:text-6xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {profileData.title}
              </h1>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-0.5 w-12 bg-blue-500/50"></div>
                <h2 className="text-lg font-medium tracking-tight text-zinc-400 sm:text-xl">
                  BCA Student & Cloud Solutions Architect
                </h2>
              </div>
              <p className="mt-8 max-w-xs text-base text-zinc-400 leading-relaxed">
                Specializing in cloud architecture, infrastructure automation, and DevOps practices to deliver scalable and efficient solutions.
              </p>
              
              <div className="mt-8">
                <a
                  href="https://drive.google.com/file/d/1t322vaWqSnYHE8hyYPs-30jS2W_9YH2s/view?usp=sharing"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <FileText className="h-5 w-5" />
                  Download Resume
                </a>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Terminal className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-zinc-400 group-hover:text-blue-400 transition-colors">DevOps</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Server className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-zinc-400 group-hover:text-blue-400 transition-colors">Cloud</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Database className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-zinc-400 group-hover:text-blue-400 transition-colors">Infrastructure</span>
                </div>
              </div>

              <nav className="nav hidden lg:block" aria-label="In-page navigation">
                {renderNavigation()}
              </nav>
            </div>
            
            {socialLinks}
          </header>

          {/* Right column */}
          <main className="pt-24 lg:w-1/2 lg:py-24">
            {currentPage === 'about' && (
              <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-zinc-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">About</h2>
                </div>
                <div>
                  <p className="mb-4 text-zinc-400 leading-relaxed">
                    As a dedicated BCA student specializing in Cloud Engineering and DevOps, I bring a comprehensive approach to cloud architecture and infrastructure automation. My expertise spans across major cloud platforms including AWS, Azure, and GCP, focusing on designing and implementing scalable, secure, and cost-effective solutions.
                  </p>
                  <p className="mb-4 text-zinc-400 leading-relaxed">
                    With a strong foundation in cloud technologies and infrastructure automation, I excel in creating robust cloud architectures, implementing CI/CD pipelines, and ensuring system reliability through automated processes. My approach combines technical expertise with a deep understanding of business needs to deliver optimal cloud solutions.
                  </p>
                </div>
              </section>
            )}

            {currentPage === 'skills' && (
              <section className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-zinc-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Skills</h2>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {[
                    {
                      category: "Cloud Platforms",
                      skills: ["AWS", "Azure", "Google Cloud Platform", "Multi-cloud Architecture"]
                    },
                    {
                      category: "Infrastructure & DevOps",
                      skills: ["Terraform", "CloudFormation", "Kubernetes", "Docker", "Jenkins", "GitHub Actions"]
                    },
                    {
                      category: "Monitoring & Security",
                      skills: ["Prometheus", "Grafana", "ELK Stack", "Cloud Security", "Compliance"]
                    },
                    {
                      category: "Programming & Tools",
                      skills: ["Python", "JavaScript/TypeScript", "Bash", "Git", "CI/CD"]
                    }
                  ].map((skillGroup, index) => (
                    <div 
                      key={index}
                      className="group relative rounded-2xl border border-zinc-700/50 p-6 hover:bg-blue-500/5 transition-colors"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <h3 className="text-xl font-semibold text-zinc-200 mb-4">{skillGroup.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentPage === 'experience' && (
              <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-zinc-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Experience</h2>
                </div>
                <div>
                  {[
                    {
                      title: "Cloud Solutions Architect",
                      company: "Tech Solutions Ltd",
                      date: "2023 - Present",
                      description: "Designed and implemented cloud-native architectures on AWS and Azure, reducing operational costs by 40%. Led infrastructure automation initiatives using Terraform and CloudFormation. Implemented robust monitoring and logging solutions using cloud-native services."
                    },
                    {
                      title: "DevOps & Cloud Engineer",
                      company: "University Tech Club",
                      date: "2022 - 2023",
                      description: "Managed multi-cloud environments and implemented infrastructure as code practices. Developed automated deployment pipelines and established cloud security best practices. Reduced deployment time by 75% through efficient CI/CD implementation."
                    }
                  ].map((job, index) => (
                    <div 
                      key={index} 
                      className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-blue-500 sm:col-span-2">
                        {job.date}
                      </header>
                      <div className="z-10 sm:col-span-6">
                        <h3 className="font-medium leading-snug text-zinc-200">
                          <div>
                            <a 
                              href="#" 
                              className="inline-flex items-center font-medium leading-tight text-zinc-200 hover:text-blue-400 focus-visible:text-blue-400 group/link text-base"
                            >
                              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                              <span>{job.title} · {job.company}</span>
                            </a>
                          </div>
                        </h3>
                        <p className="mt-2 text-sm leading-normal text-zinc-400">{job.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentPage === 'projects' && (
              <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-zinc-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Projects</h2>
                </div>
                <div>
                  {[
                    {
                      title: "Multi-Cloud Management Platform",
                      description: "Developed a comprehensive platform for managing resources across AWS, Azure, and GCP. Implemented automated cost optimization, security compliance checking, and resource provisioning features.",
                      link: "#",
                      tech: ["AWS", "Azure", "Terraform", "Python"]
                    },
                    {
                      title: "Cloud-Native CI/CD Platform",
                      description: "Built a scalable CI/CD platform using cloud-native services. Implemented advanced features including automated testing, security scanning, and deployment rollbacks across multiple cloud providers.",
                      link: "#",
                      tech: ["Kubernetes", "GitHub Actions", "ArgoCD", "Docker"]
                    },
                    {
                      title: "Cloud Infrastructure Monitoring",
                      description: "Architected a cloud-native monitoring solution providing real-time insights into multi-cloud infrastructure. Implemented predictive alerting using machine learning algorithms.",
                      link: "#",
                      tech: ["Prometheus", "Grafana", "ELK Stack", "ML"]
                    }
                  ].map((project, index) => (
                    <div 
                      key={index}
                      className="project-card group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-blue-500/5"></div>
                      <div className="z-10 sm:col-span-8">
                        <h3>
                          <a 
                            href={project.link}
                            className="inline-flex items-center font-medium leading-tight text-zinc-200 hover:text-blue-400 focus-visible:text-blue-400 group/link text-base"
                          >
                            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                            {project.title}
                            <ArrowUpRight className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 text-blue-400" />
                          </a>
                        </h3>
                        <p className="mt-2 text-sm leading-normal text-zinc-400">{project.description}</p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <li key={techIndex} className="flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-xs font-medium leading-5 text-blue-300">
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentPage === 'services' && (
              <section className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-zinc-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Services</h2>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {[
                    {
                      icon: <Code className="h-8 w-8 text-blue-400" />,
                      title: "Cloud Architecture & Design",
                      description: "Expert design and implementation of scalable cloud solutions on major platforms including AWS, Azure, and GCP, with a focus on cost optimization and performance."
                    },
                    {
                      icon: <Cpu className="h-8 w-8 text-blue-400" />,
                      title: "Infrastructure Automation",
                      description: "Development of infrastructure as code solutions using Terraform, CloudFormation, and modern automation tools for multi-cloud environments."
                    },
                    {
                      icon: <Network className="h-8 w-8 text-blue-400" />,
                      title: "Cloud Migration",
                      description: "End-to-end cloud migration services with minimal downtime, including assessment, planning, and execution using industry best practices."
                    },
                    {
                      icon: <Server className="h-8 w-8 text-blue-400" />,
                      title: "DevOps Implementation",
                      description: "Setup of robust CI/CD pipelines and DevOps practices, integrating with cloud-native tools and services for seamless deployment."
                    }
                  ].map((service, index) => (
                    <div 
                      key={index}
                      className="group relative rounded-2xl border border-zinc-700/50 p-6 hover:bg-blue-500/5 transition-colors"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold text-zinc-200 mb-2">{service.title}</h3>
                      <p className="text-zinc-400">{service.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentPage === 'blog' && (
              <section className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-zinc-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Blog</h2>
                </div>
                <div className="space-y-8">
                  {[
                    {
                      title: "Multi-Cloud Architecture Best Practices",
                      date: "March 15, 2024",
                      summary: "A deep dive into designing resilient multi-cloud architectures and managing cloud resources effectively across different providers.",
                      readTime: "7 min read",
                      tags: ["Cloud", "Architecture", "AWS", "Azure"]
                    },
                    {
                      title: "Cloud Cost Optimization Strategies",
                      date: "March 10, 2024",
                      summary: "Essential strategies for optimizing cloud costs while maintaining performance and reliability in large-scale deployments.",
                      readTime: "8 min read",
                      tags: ["Cloud", "Cost", "Optimization"]
                    },
                    {
                      title: "Securing Cloud Infrastructure",
                      date: "March 5, 2024",
                      summary: "Comprehensive guide to implementing security best practices in cloud environments and maintaining compliance standards.",
                      readTime: "6 min read",
                      tags: ["Security", "Cloud", "Compliance"]
                    }
                  ].map((post, index) => (
                    <div 
                      key={index}
                      className="group relative border-b border-zinc-700/50 pb-8"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="flex items-center gap-4  mb-2">
                        <span className="text-sm text-blue-400">{post.date}</span>
                        <span className="text-sm text-zinc-500">·</span>
                        <span className="text-sm text-zinc-500">{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-zinc-200 mb-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-zinc-400 mb-4">{post.summary}</p>
                      <div className="flex gap-2">
                        {post.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentPage === 'contact' && (
              <section className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-zinc-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Contact</h2>
                </div>
                <div className="max-w-lg">
                  <div className="mb-8 space-y-4">
                    <p className="text-zinc-400">
                      I'm always interested in hearing about new cloud architecture and DevOps opportunities. Feel free to reach out if you'd like to discuss your infrastructure needs or potential collaboration.
                    </p>
                    <div className="flex flex-col space-y-2">
                      <a 
                        href={`tel:${profileData.phone}`}
                        className="flex items-center text-zinc-400 hover:text-blue-400 transition-colors"
                      >
                        <Phone className="h-5 w-5 mr-2" />
                        <span>{profileData.phone}</span>
                      </a>
                      <a 
                        href={`https://wa.me/${profileData.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-zinc-400 hover:text-blue-400 transition-colors"
                      >
                        <span className="mr-2">📱</span>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                  {renderContactForm()}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
