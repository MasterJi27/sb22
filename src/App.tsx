import React, { useState, useEffect, Suspense, FormEvent, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Github, Linkedin, Mail, ArrowUpRight, Terminal, Server, Database, Code, Cpu, Network, FileText, Menu, X, Phone, ChevronUp, Award, GraduationCap, ExternalLink, Home, User, Briefcase, Wrench, FolderGit2, Headphones, MessageSquare, MapPin, Send, MessageCircle, Bot, Sparkles } from 'lucide-react';
import { FloatingShapes } from './components/FloatingShapes';
import { SpiralAnimation } from './components/ui/spiral-animation';
import { InteractiveRobotSpline } from './components/ui/interactive-3d-robot';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

// Typing Animation Hook
const useTypingAnimation = (texts: string[], typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
};

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Chatbot State - Whobee AI
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: "👋 Hi! I'm Whobee, Raghav's AI assistant! Ask me anything about his skills, certifications, projects, or experience!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Chatbot Knowledge Base
  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Greetings
    if (lowerInput.match(/^(hi|hello|hey|hola|namaste)/)) {
      return "Hello! 👋 I'm Whobee, Raghav's AI assistant! I'm here to help you learn about him. Ask about his skills, certifications, projects, or how to contact him!";
    }
    
    // Who is Whobee
    if (lowerInput.match(/who are you|your name|whobee/)) {
      return "I'm Whobee! 🤖 Raghav's friendly AI assistant built to help visitors learn about his skills, projects, and experience. How can I help you today?";
    }
    
    // About/Who
    if (lowerInput.match(/who (is|are)|about|tell me about|introduce/)) {
      return "Raghav Kathuria is a Cloud & DevOps Engineer from New Delhi, India. He's currently pursuing BCA (2024-2027) while working as a Research Contributor in AI Ethics & Governance. He holds 31+ certifications from Microsoft, AWS, Oracle, IBM, and Cisco, and is a member of the NVIDIA Developer Program! 🚀";
    }
    
    // Skills
    if (lowerInput.match(/skill|tech|stack|know|expertise|good at/)) {
      return "Raghav's technical skills include:\n\n☁️ **Cloud:** AWS, Azure, GCP, Oracle Cloud\n🔧 **DevOps:** Docker, Kubernetes, Terraform, Ansible, Jenkins\n💻 **Languages:** Python, JavaScript, TypeScript, Bash\n🗃️ **Databases:** PostgreSQL, MongoDB, Redis\n🤖 **MLOps:** ML pipelines, model deployment\n\nHe specializes in cloud architecture, CI/CD pipelines, and infrastructure automation!";
    }
    
    // Certifications
    if (lowerInput.match(/certif|credential|badge|qualified/)) {
      return "🏆 Raghav's 31+ Certifications:\n\n🔷 MICROSOFT (11):\n• Azure Fundamentals (AZ-900)\n• Azure AI Fundamentals (AI-900)\n• Azure Data Fundamentals (DP-900)\n• Security & Compliance (SC-900)\n• Power Platform & more\n\n🟠 AWS (3):\n• Cloud Practitioner\n• Solutions Architect Concepts\n• Cloud Essentials\n\n🔴 ORACLE (5):\n• OCI Foundations\n• OCI AI Foundations\n• Generative AI Professional\n• Cloud Data Management\n• Autonomous Database\n\n🔵 IBM (8):\n• AI Foundations\n• Cloud Computing\n• Data Science\n• Cybersecurity Fundamentals\n• DevOps Essentials & more\n\n🟢 CISCO (4):\n• Networking Basics\n• Cybersecurity Essentials\n• Network Defense\n• Endpoint Security\n\n🟣 NVIDIA:\n• Developer Program Member\n\n✅ All verifiable on Credly!";
    }
    
    // Projects
    if (lowerInput.match(/project|built|created|work|portfolio/)) {
      return "Key projects by Raghav:\n\n🏗️ **Enterprise Kubernetes Platform** - Multi-cluster orchestration with 99.9% uptime\n🔄 **Multi-Cloud IaC Framework** - Terraform modules for AWS/Azure/GCP\n🚀 **GitOps CI/CD Pipeline** - ArgoCD + Tekton automation\n🤖 **ML Model Serving Platform** - Kubernetes-based ML deployment\n📊 **Cloud Cost Optimizer** - FinOps dashboard saving 40% costs\n📈 **Observability Stack** - Prometheus + Grafana monitoring";
    }
    
    // Experience
    if (lowerInput.match(/experience|job|work history|career|research/)) {
      return "Raghav's experience:\n\n🔬 **Research Contributor** - AI Ethics & Governance under Dr. Malini\n🤖 **MLOps Intern** - ML pipelines & model deployment\n☁️ **DevOps Practice** - Infrastructure automation & cloud architecture\n\nDr. Malini says: 'Raghav demonstrates exceptional analytical abilities and genuine passion for ethical AI development.'";
    }
    
    // Education
    if (lowerInput.match(/education|study|college|university|degree|bca/)) {
      return "📚 **Education:**\n\nBCA (Bachelor of Computer Applications)\n🏫 Currently pursuing (2024-2027)\n\nRaghav combines formal education with extensive self-learning and 31+ industry certifications!";
    }
    
    // Contact
    if (lowerInput.match(/contact|email|phone|reach|hire|connect|talk/)) {
      return "📬 **Contact Raghav:**\n\n📧 Email: Raghavkathuria69@outlook.com\n📱 Phone: +91 7011933060\n💼 LinkedIn: linkedin.com/in/raghavkathuria0\n🐙 GitHub: github.com/MasterJi27\n📍 Location: New Delhi, India\n\n🟢 Currently available for opportunities!";
    }
    
    // Services
    if (lowerInput.match(/service|offer|help|do for|hire for/)) {
      return "💼 **Services Raghav offers:**\n\n☁️ Cloud Architecture & Design\n🔧 Infrastructure Automation\n🔄 CI/CD Pipeline Development\n🐳 Container Orchestration\n📊 Cloud Cost Optimization\n🔒 Security & Compliance\n\nFeel free to reach out for collaborations!";
    }
    
    // Resume
    if (lowerInput.match(/resume|cv|download/)) {
      return "📄 You can download Raghav's resume from the sidebar or click the 'Resume' button on the homepage. It contains detailed information about his skills, certifications, and experience!";
    }
    
    // Location
    if (lowerInput.match(/where|location|city|country|based/)) {
      return "📍 Raghav is based in **New Delhi, India**. He's open to remote opportunities worldwide and on-site roles in India!";
    }
    
    // Availability
    if (lowerInput.match(/available|hire|freelance|open to|looking for/)) {
      return "🟢 Yes! Raghav is currently **available for opportunities** including:\n\n• Full-time DevOps/Cloud roles\n• Internships\n• Freelance projects\n• Collaborations\n\nReach out via email or LinkedIn!";
    }

    // NVIDIA
    if (lowerInput.match(/nvidia|gpu|cuda|deep learning/)) {
      return "🟢 Raghav is a member of the **NVIDIA Developer Program**, with access to:\n\n• NVIDIA Deep Learning Institute courses\n• GPU Cloud credits\n• Developer tools & SDKs\n• Early access to new technologies\n\nThis enables him to work on cutting-edge AI/ML projects!";
    }
    
    // Thanks
    if (lowerInput.match(/thank|thanks|thx|appreciate/)) {
      return "You're welcome! 😊 Feel free to ask more questions or reach out to Raghav directly. Have a great day!";
    }
    
    // Bye
    if (lowerInput.match(/bye|goodbye|see you|later/)) {
      return "Goodbye! 👋 Thanks for visiting Raghav's portfolio. Feel free to come back anytime or reach out via the contact form!";
    }
    
    // Default
    return "I'm not sure about that specific question. Try asking about:\n\n• Skills & technologies\n• Certifications (31+)\n• Projects\n• Experience\n• How to contact Raghav\n• Services offered\n\nOr feel free to use the Contact form to reach Raghav directly!";
  };

  const handleChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    
    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setChatMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    }, 500);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Typing animation for hero
  const typingText = useTypingAnimation([
    'Cloud Infrastructure',
    'CI/CD Pipelines',
    'Kubernetes Clusters',
    'Serverless Apps',
    'DevOps Solutions'
  ], 100, 50, 2000);
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
    whatsapp: "+91 7011933060",
    email: "Raghavkathuria69@outlook.com",
    linkedin: "https://www.linkedin.com/in/raghavkathuria0/"
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Auto-dismiss loading screen after 5 seconds with fade-out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 5000);
    
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5800); // 5s + 0.8s fade animation
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    { label: 'Home', page: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'About', page: 'about', icon: <User className="w-4 h-4" /> },
    { label: 'Education', page: 'education', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Certifications', page: 'certifications', icon: <Award className="w-4 h-4" /> },
    { label: 'Experience', page: 'experience', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Skills', page: 'skills', icon: <Wrench className="w-4 h-4" /> },
    { label: 'Projects', page: 'projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Services', page: 'services', icon: <Headphones className="w-4 h-4" /> },
    { label: 'Contact', page: 'contact', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const renderNavigation = (isMobile = false) => (
    <nav className={`${isMobile ? 'mt-8' : 'mt-4'}`}>
      <ul className="space-y-0.5">
        {navigationItems.map((item) => (
          <li key={item.label}>
            <button 
              onClick={() => {
                setCurrentPage(item.page);
                if (isMobile) setIsMobileMenuOpen(false);
              }}
              className={`group flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-300 ${
                currentPage === item.page 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className={`transition-colors ${currentPage === item.page ? 'text-blue-400' : 'text-zinc-500 group-hover:text-blue-400'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">
                {item.label}
              </span>
              {currentPage === item.page && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  const socialLinks = (
    <ul className="ml-1 mt-8 flex items-center gap-6" aria-label="Social media">
      <li className="flex">
        <a 
          href="https://github.com/MasterJi27" 
          className="group flex text-sm font-medium p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          aria-label="GitHub Profile"
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
          title="LinkedIn"
          aria-label="LinkedIn Profile"
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
          title="Email"
          aria-label="Send Email"
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
          title="Phone"
          aria-label="Call Phone"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Phone className="h-5 w-5 text-zinc-500 transition group-hover:text-blue-400" />
        </a>
      </li>
    </ul>
  );

  // Loading Screen with Spiral Animation
  if (isLoading) {
    return (
      <div 
        className={`fixed inset-0 w-full h-full overflow-hidden bg-black z-[200] transition-opacity duration-800 ease-out ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
        role="status"
        aria-label="Loading"
        aria-busy="true"
      >
        {/* Spiral Animation Background */}
        <div className="absolute inset-0" aria-hidden="true">
          <SpiralAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-zinc-200">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-zinc-800/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Toaster position="top-right" />
      {/* 3D Background Canvas - Hidden on desktop for better performance */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 lg:opacity-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FloatingShapes />
          </Suspense>
        </Canvas>
      </div>

      {/* Custom cursor - Hidden on touch devices */}
      <div 
        className={`hidden md:block fixed w-4 h-4 rounded-full pointer-events-none z-50 transition-transform duration-200 mix-blend-difference ${
          isHovered ? 'scale-[4] bg-blue-400' : 'scale-1 bg-blue-400'
        }`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Mobile/Tablet Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-zinc-800/90 backdrop-blur-sm rounded-xl border border-zinc-700/50 lg:hidden shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-blue-400" />
        ) : (
          <Menu className="h-5 w-5 text-blue-400" />
        )}
      </button>

      {/* Mobile/Tablet Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-900/98 backdrop-blur-xl lg:hidden overflow-y-auto">
          <div className="flex flex-col min-h-full p-6 pt-20 pb-8">
            {/* Mobile Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Raghav Kathuria
              </h1>
              <p className="text-zinc-400 text-sm mt-1">Cloud & DevOps Engineer</p>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex-1">
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    <button 
                      onClick={() => {
                        setCurrentPage(item.page);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`group flex flex-col items-center gap-2 w-full p-4 rounded-xl transition-all duration-300 ${
                        currentPage === item.page 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <span className={`transition-colors ${currentPage === item.page ? 'text-blue-400' : 'text-zinc-500'}`}>
                        {item.icon}
                      </span>
                      <span className="text-xs font-medium">
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Mobile Footer */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <a
                href="https://drive.google.com/file/d/1t322vaWqSnYHE8hyYPs-30jS2W_9YH2s/view?usp=sharing"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors mb-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4" />
                Download Resume
              </a>
              {socialLinks}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 md:px-8 md:py-12 lg:px-12 lg:py-0 relative z-20">
        <div className="lg:flex lg:justify-between lg:gap-12">
          {/* Left column - Sidebar (Hidden on mobile/tablet, shown on desktop) */}
          <header className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[280px] xl:w-[320px] lg:flex-shrink-0 lg:flex-col lg:justify-between lg:py-8 xl:py-12 lg:overflow-y-auto sidebar-scroll">
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-zinc-100 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {profileData.title}
              </h1>
              <div className="mt-4 xl:mt-6 flex items-center gap-3">
                <div className="h-0.5 w-10 bg-blue-500/50"></div>
                <h2 className="text-sm xl:text-base font-medium tracking-tight text-zinc-400">
                  Cloud & DevOps Engineer
                </h2>
              </div>
              <p className="mt-4 xl:mt-6 max-w-xs text-sm text-zinc-400 leading-relaxed">
                Specializing in cloud infrastructure, DevOps automation, and MLOps practices.
              </p>
              
              <div className="mt-4 xl:mt-6">
                <a
                  href="https://drive.google.com/file/d/1t322vaWqSnYHE8hyYPs-30jS2W_9YH2s/view?usp=sharing"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <FileText className="h-4 w-4" />
                  Resume
                </a>
              </div>

              <nav className="nav mt-4 xl:mt-6" aria-label="In-page navigation">
                {renderNavigation()}
              </nav>
            </div>
            
            <div className="mt-4">
              {socialLinks}
            </div>
          </header>

          {/* Right column - Content */}
          <main className="pt-16 pb-8 lg:flex-1 lg:py-8 xl:py-12 lg:max-w-2xl xl:max-w-3xl">
            {/* Home Page */}
            {currentPage === 'home' && (
              <section id="home" className="mb-8 sm:mb-12 md:mb-16 scroll-mt-16 animate-fade-in">
                {/* Hero Section - Redesigned */}
                <div className="relative mb-8 sm:mb-12">
                  {/* Background Effects */}
                  <div className="absolute -top-20 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6 sm:mb-8">
                      <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-400 text-xs sm:text-sm font-medium">Open to Work</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                      Hi, I'm{' '}
                      <span className="relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                          Raghav
                        </span>
                        <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-50"></span>
                      </span>
                    </h1>

                    {/* Subtitle with Typing */}
                    <div className="mb-6 sm:mb-8">
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-zinc-200 font-medium mb-2">
                        Cloud & DevOps Engineer
                      </p>
                      <div className="flex items-center gap-2 text-base sm:text-lg md:text-xl text-zinc-400">
                        <span>Crafting</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                          {typingText}
                        </span>
                        <span className="w-0.5 h-5 sm:h-6 bg-blue-400 animate-pulse"></span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl mb-8 sm:mb-10">
                      I architect <span className="text-blue-400">scalable cloud solutions</span> and build 
                      <span className="text-purple-400"> automated pipelines</span> that power modern applications. 
                      Passionate about AWS, Kubernetes, and making infrastructure invisible.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
                      <button
                        onClick={() => setCurrentPage('contact')}
                        className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm sm:text-base font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Let's Connect
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </button>
                      <button
                        onClick={() => setCurrentPage('projects')}
                        className="group px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-zinc-800/80 text-zinc-200 text-sm sm:text-base font-semibold border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700/80 transition-all duration-300 hover:scale-105"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <span className="flex items-center gap-2">
                          View My Work
                          <FolderGit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </span>
                      </button>
                      <a
                        href="/Raghav_Resume.pdf"
                        download
                        className="group px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-transparent text-zinc-300 text-sm sm:text-base font-semibold border border-zinc-700 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Resume
                        </span>
                      </a>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">Find me on</span>
                      <div className="flex gap-3">
                        <a href="https://github.com/MasterJi27" target="_blank" rel="noopener noreferrer" 
                          className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-700 transition-all duration-300 group"
                          title="GitHub">
                          <Github className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                        </a>
                        <a href="https://www.linkedin.com/in/raghavkathuria0/" target="_blank" rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group"
                          title="LinkedIn">
                          <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                        </a>
                        <a href="mailto:Raghavkathuria69@outlook.com"
                          className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 group"
                          title="Email">
                          <Mail className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive 3D Robot - Whobee */}
                <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] lg:h-[480px] mb-8 sm:mb-12 rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-700/50 bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-black shadow-xl shadow-black/20">
                  <InteractiveRobotSpline
                    scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
                    className="w-full h-full"
                  />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
                  {[
                    { value: "3+", label: "Years Learning", icon: "📚", color: "from-blue-500/20 to-blue-600/10" },
                    { value: "10+", label: "Projects Built", icon: "🚀", color: "from-purple-500/20 to-purple-600/10" },
                    { value: "3", label: "Cloud Platforms", icon: "☁️", color: "from-cyan-500/20 to-cyan-600/10" },
                    { value: "∞", label: "Curiosity", icon: "💡", color: "from-yellow-500/20 to-yellow-600/10" }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className={`group relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-zinc-700/50 hover:border-zinc-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden`}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="absolute top-0 right-0 text-6xl sm:text-7xl opacity-10 -translate-y-2 translate-x-2 group-hover:scale-110 transition-transform duration-500">
                        {stat.icon}
                      </div>
                      <div className="relative z-10">
                        <span className="text-2xl sm:text-3xl mb-2 block">{stat.icon}</span>
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Section */}
                <div className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 mb-8 sm:mb-12 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-200 flex items-center gap-2">
                        <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        Tech Stack
                      </h3>
                      <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider">What I use daily</span>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                      {[
                        { name: "AWS", emoji: "☁️" },
                        { name: "Azure", emoji: "🔷" },
                        { name: "GCP", emoji: "🌐" },
                        { name: "Kubernetes", emoji: "⚙️" },
                        { name: "Docker", emoji: "🐳" },
                        { name: "Terraform", emoji: "🏗️" },
                        { name: "Jenkins", emoji: "🔧" },
                        { name: "Python", emoji: "🐍" },
                        { name: "Linux", emoji: "🐧" },
                        { name: "Git", emoji: "📦" }
                      ].map((tech, index) => (
                        <div
                          key={index}
                          className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 cursor-default"
                        >
                          <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">{tech.emoji}</span>
                          <span className="text-[10px] sm:text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors text-center">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Links / What I Do */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <div 
                    onClick={() => setCurrentPage('projects')}
                    className="group cursor-pointer p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-zinc-700/50 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                        <FolderGit2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1 group-hover:text-blue-400 transition-colors">
                          My Projects
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          Multi-cloud platforms, CI/CD pipelines, Kubernetes automation & more
                        </p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setCurrentPage('skills')}
                    className="group cursor-pointer p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-zinc-700/50 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1 group-hover:text-purple-400 transition-colors">
                          My Skills
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          Cloud architecture, DevOps, Infrastructure as Code & automation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GitHub Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-zinc-700/50">
                        <Github className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-zinc-100">@MasterJi27</h4>
                        <p className="text-xs sm:text-sm text-zinc-400">Check out my open source work</p>
                      </div>
                    </div>
                    <a 
                      href="https://github.com/MasterJi27" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-all duration-300 hover:scale-105"
                    >
                      View GitHub
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* Education Section */}
            {currentPage === 'education' && (
              <section id="education" className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 animate-fade-in">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 sm:mb-6 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">Education</h2>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* BCA */}
                  <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500/20 shrink-0">
                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                          <h3 className="text-base sm:text-xl font-semibold text-zinc-100">Bachelor of Computer Applications (BCA)</h3>
                          <span className="text-xs sm:text-sm text-blue-400 bg-blue-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full w-fit">2024 - Present</span>
                        </div>
                        <p className="text-sm sm:text-base text-zinc-400 mb-2 sm:mb-3">Specializing in Cloud Computing & DevOps</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {["Cloud Computing", "Database Management", "Web Development", "Networking", "Linux Administration"].map((course, i) => (
                            <span key={i} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-zinc-700/50 text-zinc-400">{course}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* High School */}
                  <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-500/20 shrink-0">
                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                          <h3 className="text-base sm:text-xl font-semibold text-zinc-100">Higher Secondary (12th)</h3>
                          <span className="text-xs sm:text-sm text-purple-400 bg-purple-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full w-fit">Completed</span>
                        </div>
                        <p className="text-sm sm:text-base text-zinc-400">Science Stream with Computer Science</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Journey */}
                <div className="mt-6 sm:mt-10 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-3 sm:mb-4 flex items-center gap-2">
                    📚 Continuous Learning
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                    Beyond formal education, I'm constantly learning through online platforms like AWS Training, Udemy, Coursera, and hands-on projects. I believe in learning by doing!
                  </p>
                </div>
              </section>
            )}

            {/* Certifications Section */}
            {currentPage === 'certifications' && (
              <section id="certifications" className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 animate-fade-in">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 sm:mb-6 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">Certifications</h2>
                </div>
                
                {/* Intro */}
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-2 sm:mb-3">
                    31 Certifications Earned (2024-2025)
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                    For me, certifications aren't just credentials — they're part of how I build structured knowledge and stay current with industry standards. What matters more is applying that knowledge through projects, internships, and research work.
                  </p>
                </div>

                {/* 2025 Certifications */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-200 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-blue-400">2025</span>
                    <span className="text-xs sm:text-sm text-zinc-500">(Latest)</span>
                  </h3>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { name: "Microsoft Certified: Azure Administrator Associate", issuer: "Microsoft", icon: "🔷" },
                      { name: "Microsoft Certified: DevOps Engineer Expert", issuer: "Microsoft", icon: "🔷" },
                      { name: "Oracle Cloud Infrastructure DevOps Professional 2025", issuer: "Oracle", icon: "🟠" },
                      { name: "GitHub Foundations", issuer: "GitHub", icon: "🐙" },
                      { name: "AWS Educate Introduction to Generative AI", issuer: "AWS", icon: "☁️" },
                      { name: "ISC2 Candidate", issuer: "ISC2", icon: "🔐" },
                      { name: "ISRO Geodata Processing using Python & ML", issuer: "ISRO", icon: "🛰️" },
                      { name: "Linux Foundation LFS101", issuer: "Linux Foundation", icon: "🐧" },
                      { name: "Microsoft Fabric Analytics Engineer Associate", issuer: "Microsoft", icon: "🔷" },
                      { name: "Salesforce AI Specialist", issuer: "Salesforce", icon: "☁️" },
                      { name: "Salesforce AI Associate", issuer: "Salesforce", icon: "☁️" },
                      { name: "IBM CSX Cybersecurity Fundamentals", issuer: "IBM", icon: "🔒" },
                      { name: "IBM SkillsBuild Data Analytics", issuer: "IBM", icon: "📊" }
                    ].map((cert, index) => (
                      <div 
                        key={index}
                        className="group relative p-3 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all duration-300"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl">{cert.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-medium text-zinc-200 leading-tight">{cert.name}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">{cert.issuer}</p>
                          </div>
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 group-hover:text-blue-400 transition-colors shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Late 2024 Certifications */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-200 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-purple-400">Late 2024</span>
                  </h3>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { name: "IBM Data Fundamentals", issuer: "IBM", icon: "📊" },
                      { name: "IBM Data Analysis with Python", issuer: "IBM", icon: "🐍" },
                      { name: "Infosys Springboard Information Security", issuer: "Infosys", icon: "🔒" },
                      { name: "Oracle Cloud Infrastructure Certification", issuer: "Oracle", icon: "🟠" },
                      { name: "Postman API Fundamentals Student Expert", issuer: "Postman", icon: "📮" }
                    ].map((cert, index) => (
                      <div 
                        key={index}
                        className="group relative p-3 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-purple-500/50 hover:bg-zinc-800/80 transition-all duration-300"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl">{cert.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-medium text-zinc-200 leading-tight">{cert.name}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">{cert.issuer}</p>
                          </div>
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 group-hover:text-purple-400 transition-colors shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2024 Simulations & Certifications */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-200 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-green-400">2024 Simulations & Certifications</span>
                  </h3>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { name: "AWS APAC Solutions Architecture", issuer: "AWS", icon: "☁️" },
                      { name: "Accenture Data Analytics", issuer: "Accenture", icon: "📊" },
                      { name: "Accenture Project Management", issuer: "Accenture", icon: "📋" },
                      { name: "Accenture Engineering Simulation", issuer: "Accenture", icon: "⚙️" },
                      { name: "Google Data Analytics", issuer: "Google", icon: "📈" },
                      { name: "Cisco Intro to Cybersecurity", issuer: "Cisco", icon: "🔐" },
                      { name: "Microsoft SC-900 Prep", issuer: "Microsoft", icon: "🔷" },
                      { name: "Infosys Network Management Systems", issuer: "Infosys", icon: "🌐" },
                      { name: "SAP Technical Consulting", issuer: "SAP", icon: "🔷" },
                      { name: "TCS Cybersecurity Simulation", issuer: "TCS", icon: "🛡️" },
                      { name: "Google Sheets Analytics Badge", issuer: "Google", icon: "📊" },
                      { name: "Walmart Software Engineering Simulation", issuer: "Walmart", icon: "💻" },
                      { name: "IBM Web Development Fundamentals", issuer: "IBM", icon: "🌐" }
                    ].map((cert, index) => (
                      <div 
                        key={index}
                        className="group relative p-3 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-green-500/50 hover:bg-zinc-800/80 transition-all duration-300"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl">{cert.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-medium text-zinc-200 leading-tight">{cert.name}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">{cert.issuer}</p>
                          </div>
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 group-hover:text-green-400 transition-colors shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certification Summary */}
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 mb-6 sm:mb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { label: "Microsoft", count: "5", icon: "🔷" },
                      { label: "AWS", count: "2", icon: "☁️" },
                      { label: "IBM", count: "5", icon: "📊" },
                      { label: "Oracle", count: "2", icon: "🟠" }
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-400">{stat.count}</div>
                        <div className="text-xs text-zinc-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Credly Badges */}
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 bg-zinc-800/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base sm:text-lg font-bold text-zinc-100">Verified Credentials</h3>
                    <span className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Credly Verified</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: "Azure Administrator", color: "from-blue-500 to-blue-600", badge: "AZ-104" },
                      { name: "DevOps Engineer Expert", color: "from-purple-500 to-purple-600", badge: "AZ-400" },
                      { name: "GitHub Foundations", color: "from-zinc-600 to-zinc-700", badge: "GH" },
                      { name: "Oracle Cloud DevOps", color: "from-red-500 to-orange-500", badge: "OCI" }
                    ].map((cert, i) => (
                      <a 
                        key={i}
                        href="https://www.credly.com/users/raghavkathuria"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-4 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-300 text-center"
                      >
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-white font-bold text-xs sm:text-sm badge-shine`}>
                          {cert.badge}
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-tight">{cert.name}</p>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3 h-3 text-blue-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <a 
                      href="https://www.credly.com/users/raghavkathuria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View all verified badges on Credly
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </section>
            )}

            {currentPage === 'about' && (
              <section id="about" className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 animate-fade-in">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 sm:mb-6 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">About</h2>
                </div>
                
                {/* Hero Introduction Card */}
                <div className="relative mb-6 sm:mb-10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 overflow-hidden">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs sm:text-sm text-zinc-400">Available for opportunities</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-100 mb-3 sm:mb-4">
                      Hey there! 👋
                    </h1>
                    <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed mb-3 sm:mb-4">
                      I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">Raghav Kathuria</span>, a DevOps and Cloud Engineer who builds reliable, scalable systems that solve real-world problems.
                    </p>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-3">
                      I work in DevOps and cloud technologies with a strong interest in building systems that are reliable, scalable, and practical in real-world use. I enjoy working on automation, deployment pipelines, and cloud-based solutions that solve real problems rather than just staying theoretical.
                    </p>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                      Over the past year, I've completed <span className="px-1.5 sm:px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs sm:text-sm font-semibold">31 certifications</span> across Microsoft, AWS, Oracle, IBM, and Cisco. For me, certifications aren't just credentials — they're part of how I build structured knowledge and stay current with industry standards. What matters more is applying that knowledge through projects, internships, and research work.
                    </p>
                  </div>
                </div>

                {/* Stats/Highlights - Improved */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-10">
                  {[
                    { value: "31", label: "Certifications", icon: "🏆" },
                    { value: "10+", label: "Projects Built", icon: "🚀" },
                    { value: "4", label: "Cloud Platforms", icon: "☁️" },
                    { value: "MLOps", label: "AI & Deployment", icon: "🤖" }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className="group relative rounded-xl sm:rounded-2xl border border-zinc-700/50 p-3 sm:p-5 text-center hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{stat.icon}</div>
                      <div className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-1">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* What I Do - Grid Layout */}
                <div className="mb-6 sm:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
                      <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-100">What I Do</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      {
                        icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
                        title: "DevOps Pipelines",
                        description: "Build end-to-end CI/CD pipelines with GitHub Actions, Jenkins, and deployment automation for reliable software delivery.",
                        gradient: "from-blue-500/20 to-cyan-500/20"
                      },
                      {
                        icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />,
                        title: "Cloud Infrastructure",
                        description: "Design and deploy infrastructure on Azure, AWS, GCP, and OCI using IaC tools like Terraform and Docker/Kubernetes.",
                        gradient: "from-purple-500/20 to-pink-500/20"
                      },
                      {
                        icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
                        title: "MLOps & AI Deployment",
                        description: "Deploy ML models with tracking, scalability, and model drift management following MLOps best practices.",
                        gradient: "from-orange-500/20 to-yellow-500/20"
                      },
                      {
                        icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
                        title: "Research & Writing",
                        description: "Write technical research papers and reports on AI systems, GPU computing, and present at international conferences.",
                        gradient: "from-green-500/20 to-emerald-500/20"
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 bg-gradient-to-br ${item.gradient} hover:border-zinc-600/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-zinc-800/80 text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg text-zinc-100 font-semibold mb-1 sm:mb-2">{item.title}</h4>
                            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="mb-6 sm:mb-10">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3 sm:mb-4">Core Tech Stack</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {["Azure", "AWS", "GCP", "OCI", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "Python", "Linux", "Shell Scripting", "SQL", "Power BI", "Scikit-Learn", "CUDA"].map((tech, index) => (
                      <span 
                        key={index}
                        className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* NVIDIA Developer Program Badge */}
                <div className="mb-6 sm:mb-10 p-5 sm:p-6 rounded-2xl border-2 border-[#76b900]/50 bg-gradient-to-br from-[#76b900]/10 to-zinc-900/50 nvidia-glow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#76b900]/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10" fill="#76b900">
                          <path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.44 0-.86-.054-1.167-.124v-4.53a2.212 2.212 0 0 1 1.615.932l1.348-1.59s-1.124-1.019-2.963-.865v-.045l-.045.022a.56.56 0 0 0 .045.423zm0-4.595v2.197l.424-.036c5.136-.393 8.468 4.01 8.468 4.01s-3.883 4.588-7.681 4.588c-.44 0-.847-.037-1.211-.1v1.544c.318.032.654.05 1 .05 4.654 0 8.03-2.37 10.857-4.67.333.276 1.637 1.218 1.9 1.594-2.47 2.136-8.29 4.832-12.7 4.832-.36 0-.707-.017-1.048-.05v2.015h14.7V4.203H8.948zm0 10.098v1.124c-3.506-.545-4.418-4.023-4.418-4.023s1.476-1.631 4.418-1.82v1.177c-1.6.098-2.5 1.078-2.5 1.078s.617 1.825 2.5 2.464zm-5.29-2.92s1.476-2.8 5.29-3.215V6.762c-4.79.435-7.59 4.088-7.59 4.088s1.546 5.103 7.59 5.737v-1.404c-4.093-.547-5.29-3.802-5.29-3.802z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-1">NVIDIA Developer Program Member</h3>
                        <p className="text-sm text-zinc-400">GPU Computing • CUDA • Deep Learning Frameworks</p>
                        <p className="text-xs text-[#76b900] mt-1">RTX 4060 - AI Research & Deployment</p>
                      </div>
                    </div>
                    <a 
                      href="https://developer.nvidia.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#76b900]/20 text-[#76b900] text-sm font-medium hover:bg-[#76b900]/30 transition-colors border border-[#76b900]/50"
                    >
                      View Program →
                    </a>
                  </div>
                </div>

                {/* Personal Touch - Improved */}
                <div className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
                  <div className="absolute inset-0 backdrop-blur-sm" />
                  <div className="absolute inset-[1px] rounded-2xl sm:rounded-3xl bg-zinc-900/90" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl">🚀</span>
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-100">What I Bring</h3>
                    </div>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-3">
                      I like understanding how systems connect end-to-end — from infrastructure and deployment to performance and optimization. I'm especially interested in DevOps pipelines, MLOps workflows, and AI systems running on cloud infrastructure.
                    </p>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-3">
                      I try to focus on real skills, not just tool familiarity. I like understanding systems deeply, improving them, and making them more reliable. I take ownership of my work and prefer building things that are actually usable.
                    </p>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                      I value clear thinking, good documentation, and practical execution. I'm always learning, but I also value execution — shipping, testing, improving. I'm looking for opportunities where I can work on real systems, contribute meaningfully, and keep improving as an engineer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <a 
                        href="#contact" 
                        onClick={() => setCurrentPage('contact')}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm sm:text-base font-medium hover:opacity-90 transition-opacity cursor-pointer text-center"
                      >
                        Let's Connect
                      </a>
                      <a 
                        href="#projects" 
                        onClick={() => setCurrentPage('projects')}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm sm:text-base font-medium border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-700/50 transition-all cursor-pointer text-center"
                      >
                        View Projects
                      </a>
                    </div>
                  </div>
                </div>

                {/* Work Availability Section */}
                <div className="mb-6 sm:mb-10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-400 animate-pulse mt-1 shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-3">Currently Available For</h3>
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {[
                          { title: "Full-Time Roles", desc: "DevOps, Cloud, MLOps positions", icon: "💼" },
                          { title: "Internships", desc: "Cloud engineering & DevOps", icon: "🎓" },
                          { title: "Research Projects", desc: "AI systems, GPU optimization", icon: "🔬" },
                          { title: "Remote Work", desc: "Open to remote opportunities", icon: "🌐" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <h4 className="text-sm sm:text-base font-semibold text-zinc-200">{item.title}</h4>
                              <p className="text-xs sm:text-sm text-zinc-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-zinc-400">
                        📍 Based in India • Open to relocation • Can start immediately
                      </p>
                    </div>
                  </div>
                </div>

                {/* Featured Achievements */}
                <div className="mb-6 sm:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-yellow-500/20">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-100">Featured Achievements</h3>
                  </div>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      {
                        title: "International Conference Presentation",
                        desc: "Presented research on Stable Diffusion GPU optimization and performance evaluation on RTX 4060 at international conference",
                        icon: "🎤",
                        color: "from-purple-500/20 to-pink-500/20"
                      },
                      {
                        title: "31 Professional Certifications",
                        desc: "Completed certifications across Microsoft (Azure, DevOps), AWS, Oracle Cloud, IBM, Cisco, and GitHub in 2024-2025",
                        icon: "🏆",
                        color: "from-blue-500/20 to-cyan-500/20"
                      },
                      {
                        title: "Research Contribution - AI Systems",
                        desc: "Published technical research papers on AI systems, GPU computing, and system optimization under academic supervision",
                        icon: "📚",
                        color: "from-green-500/20 to-emerald-500/20"
                      },
                      {
                        title: "End-to-End MLOps Implementation",
                        desc: "Built production-ready ML systems with deployment pipelines, model tracking, and drift detection following industry best practices",
                        icon: "🤖",
                        color: "from-orange-500/20 to-yellow-500/20"
                      }
                    ].map((achievement, i) => (
                      <div 
                        key={i}
                        className={`group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${achievement.color} border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:-translate-y-1`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <span className="text-3xl sm:text-4xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1 sm:mb-2">{achievement.title}</h4>
                            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{achievement.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Links */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-10">
                  <a 
                    href="https://github.com/MasterJi27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-zinc-700/50 group-hover:bg-zinc-700 transition-colors">
                        <Github className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-zinc-100">GitHub</h4>
                        <p className="text-xs text-zinc-500">@MasterJi27</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  </a>
                  
                  <a 
                    href="https://www.linkedin.com/in/raghavkathuria0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/50 hover:border-blue-600/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors">
                        <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-zinc-100">LinkedIn</h4>
                        <p className="text-xs text-zinc-500">raghavkathuria0</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  </a>
                </div>
              </section>
            )}

            {currentPage === 'skills' && (
              <section className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">Skills</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2">
                  {[
                    {
                      category: "Cloud & Infrastructure",
                      skills: ["Azure", "AWS", "GCP", "Oracle Cloud (OCI)", "Docker", "Kubernetes", "Terraform"]
                    },
                    {
                      category: "DevOps & CI/CD",
                      skills: ["GitHub Actions", "Jenkins", "CI/CD Pipelines", "GitOps", "MLOps", "Shell Scripting"]
                    },
                    {
                      category: "Data & AI",
                      skills: ["SQL", "Power BI", "Python", "Scikit-Learn", "ML Model Deployment", "GenAI"]
                    },
                    {
                      category: "Security & Systems",
                      skills: ["Linux", "Cybersecurity Fundamentals", "Cloud Security", "Network Management", "System Optimization"]
                    }
                  ].map((skillGroup, index) => (
                    <div 
                      key={index}
                      className="group relative rounded-xl sm:rounded-2xl border border-zinc-700/50 p-4 sm:p-6 hover:bg-blue-500/5 transition-colors"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-zinc-200 mb-3 sm:mb-4">{skillGroup.category}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {skillGroup.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="text-xs sm:text-sm bg-blue-500/10 text-blue-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
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
              <section id="experience" className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">Experience</h2>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  {/* Research Experience */}
                  <div className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 hover:border-purple-500/30 bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium leading-snug text-zinc-200">
                          <span className="text-sm sm:text-base">AI Research Contributor · IITM College of Engineering</span>
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-normal text-zinc-400">
                          Written technical research papers and reports on AI systems, GPU computing, and system optimization. Presented research findings at international conferences. Work on Stable Diffusion deployment and GPU optimization under Dr. R. Malini's guidance.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                          {["Research Writing", "AI Systems", "GPU Computing", "Conference Presentations"].map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MLOps Internship */}
                  <div className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 hover:border-blue-500/30 bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium leading-snug text-zinc-200">
                          <span className="text-sm sm:text-base">MLOps & Cloud Engineering Projects</span>
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-normal text-zinc-400">
                          Built end-to-end ML systems including Real Estate Valuation with MLOps practices, IBM Watson ML Research Agent with RAG, and cloud-based AI deployments. Focus on practical deployment, model tracking, and scalability.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                          {["MLOps", "Azure", "Python", "Streamlit", "Model Deployment"].map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DevOps Experience */}
                  <div className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 hover:border-green-500/30 bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium leading-snug text-zinc-200">
                          <span className="text-sm sm:text-base">DevOps & Cloud Infrastructure</span>
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-normal text-zinc-400">
                          Implemented CI/CD pipelines with GitHub Actions and Jenkins. Deployed containerized applications using Docker and Kubernetes. Managed multi-cloud infrastructure across Azure, AWS, GCP, and OCI using Terraform and IaC practices.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                          {["CI/CD", "Docker", "Kubernetes", "Terraform", "Multi-Cloud"].map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-green-500/10 text-green-300 border border-green-500/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-zinc-900/50 overflow-hidden">
                    <div className="absolute top-0 right-0 text-6xl sm:text-8xl opacity-10">💡</div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-100">Academic Recommendation</h3>
                      </div>
                      <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-3 italic">
                        "Raghav consistently showed a strong learning attitude and real curiosity in AI. He applied theory to practical problems and contributed meaningfully to research work. He demonstrated analytical thinking, teamwork, and initiative. I'm confident he will continue to do well and make meaningful contributions in technology and research."
                      </p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-yellow-400">
                        <span className="font-semibold">— Dr. R. Malini</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">Associate Professor, IITM College of Engineering</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {currentPage === 'projects' && (
              <section id="projects" className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">Projects</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      title: "AI-Powered Real Estate Valuation System",
                      description: "Built an end-to-end ML system to estimate property values with data pipelines, feature engineering, and evaluation pipelines designed to handle model drift.",
                      link: "https://github.com/MasterJi27",
                      demo: "",
                      tech: ["Python", "Scikit-Learn", "Streamlit", "MLOps", "Data Pipelines"],
                      image: "🏘️",
                      metrics: ["94% Model Accuracy", "70% Faster Valuations", "10K+ Predictions"]
                    },
                    {
                      title: "IBM Watson ML Research Agent",
                      description: "A conceptual AI assistant to support academic research with document ingestion, RAG-based literature support, and automated summarization workflows.",
                      link: "https://github.com/MasterJi27",
                      demo: "",
                      tech: ["GenAI", "RAG", "Python", "NLP", "IBM Watson"],
                      image: "🤖",
                      metrics: ["60% Research Time Saved", "RAG Pipeline", "Auto-Citations"]
                    },
                    {
                      title: "Stable Diffusion + ComfyUI Research",
                      description: "Researched GPU-based deployment of Stable Diffusion on RTX 4060 with focus on performance optimization. Presented findings at an international conference.",
                      link: "https://github.com/MasterJi27",
                      demo: "",
                      tech: ["Stable Diffusion", "ComfyUI", "CUDA", "RTX 4060", "NVIDIA"],
                      image: "🎨",
                      metrics: ["40% GPU Efficiency Gain", "Conference Paper", "RTX Optimized"]
                    },
                    {
                      title: "DevOps Pipeline Automation",
                      description: "Implemented comprehensive CI/CD pipelines with automated testing, deployment, and monitoring. Includes GitHub Actions workflows and Kubernetes orchestration.",
                      link: "https://github.com/MasterJi27",
                      demo: "",
                      tech: ["GitHub Actions", "Docker", "Kubernetes", "CI/CD", "Azure"],
                      image: "🚀",
                      metrics: ["75% Deploy Time Reduced", "Zero Downtime", "Auto-Rollback"]
                    },
                    {
                      title: "Cloud Infrastructure as Code",
                      description: "Collection of production-ready Terraform templates for deploying scalable infrastructure on Azure, AWS, GCP, and OCI following best practices.",
                      link: "https://github.com/MasterJi27",
                      demo: "",
                      tech: ["Terraform", "Azure", "AWS", "GCP", "OCI"],
                      image: "☁️",
                      metrics: ["Multi-Cloud", "IaC Templates", "Security Hardened"]
                    },
                    {
                      title: "MLOps Model Deployment Platform",
                      description: "Platform for deploying and monitoring ML models in production with automated tracking, version control, and model drift detection.",
                      link: "https://github.com/MasterJi27",
                      demo: "",
                      tech: ["MLOps", "Docker", "Kubernetes", "Python", "Cloud Services"],
                      image: "📊",
                      metrics: ["Model Versioning", "Drift Detection", "Auto-Scaling"]
                    }
                  ].map((project, index) => (
                    <div 
                      key={index}
                      className="project-card group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-zinc-700/50 hover:border-blue-500/30 bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-300 hover:-translate-y-1"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="text-2xl sm:text-4xl shrink-0">{project.image}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-zinc-100">{project.title}</h3>
                            <div className="flex gap-2 shrink-0">
                              <a 
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 sm:p-2 rounded-lg bg-zinc-700/50 hover:bg-blue-500/20 transition-colors"
                                title="View Code"
                              >
                                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 hover:text-blue-400" />
                              </a>
                              {project.demo && (
                                <a 
                                  href={project.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 sm:p-2 rounded-lg bg-zinc-700/50 hover:bg-blue-500/20 transition-colors"
                                  title="Live Demo"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 hover:text-blue-400" />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 mb-2 sm:mb-3">{project.description}</p>
                          
                          {/* Project Metrics */}
                          {project.metrics && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                              {project.metrics.map((metric, metricIndex) => (
                                <span key={metricIndex} className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                  ✓ {metric}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {project.tech.map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentPage === 'services' && (
              <section className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">Services</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2">
                  {[
                    {
                      icon: <Code className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />,
                      title: "Cloud Architecture & Design",
                      description: "Expert design and implementation of scalable cloud solutions on major platforms including AWS, Azure, and GCP, with a focus on cost optimization and performance."
                    },
                    {
                      icon: <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />,
                      title: "Infrastructure Automation",
                      description: "Development of infrastructure as code solutions using Terraform, CloudFormation, and modern automation tools for multi-cloud environments."
                    },
                    {
                      icon: <Network className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />,
                      title: "Cloud Migration",
                      description: "End-to-end cloud migration services with minimal downtime, including assessment, planning, and execution using industry best practices."
                    },
                    {
                      icon: <Server className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />,
                      title: "DevOps Implementation",
                      description: "Setup of robust CI/CD pipelines and DevOps practices, integrating with cloud-native tools and services for seamless deployment."
                    }
                  ].map((service, index) => (
                    <div 
                      key={index}
                      className="group relative rounded-xl sm:rounded-2xl border border-zinc-700/50 p-4 sm:p-6 hover:bg-blue-500/5 transition-colors"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="mb-3 sm:mb-4">{service.icon}</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-zinc-200 mb-2">{service.title}</h3>
                      <p className="text-sm sm:text-base text-zinc-400">{service.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentPage === 'blog' && (
              <section className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 mb-4 w-screen bg-zinc-900/75 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400">Blog</h2>
                </div>
                <div className="space-y-6 sm:space-y-8">
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
                      className="group relative border-b border-zinc-700/50 pb-6 sm:pb-8"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                        <span className="text-xs sm:text-sm text-blue-400">{post.date}</span>
                        <span className="text-xs sm:text-sm text-zinc-500">·</span>
                        <span className="text-xs sm:text-sm text-zinc-500">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-zinc-200 mb-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400 mb-3 sm:mb-4">{post.summary}</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {post.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-[10px] sm:text-xs bg-blue-500/10 text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
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
              <section className="mb-12 sm:mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100">Get In Touch</h2>
                      <p className="text-sm sm:text-base text-zinc-400">Let's discuss your next project</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
                    I'm always excited to collaborate on innovative cloud architecture and DevOps projects. 
                    Whether you need infrastructure optimization, CI/CD pipelines, or cloud migration – let's connect!
                  </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
                  {/* Contact Info Cards - Left Side */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Email Card */}
                    <a 
                      href={`mailto:${profileData.email}`}
                      className="group block p-4 sm:p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-zinc-800/60 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all">
                          <Mail className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Email</p>
                          <p className="text-sm sm:text-base text-zinc-200 truncate group-hover:text-blue-400 transition-colors">{profileData.email}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </div>
                    </a>

                    {/* Phone Card */}
                    <a 
                      href={`tel:${profileData.phone}`}
                      className="group block p-4 sm:p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 hover:border-green-500/50 hover:bg-zinc-800/60 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all">
                          <Phone className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Phone</p>
                          <p className="text-sm sm:text-base text-zinc-200 group-hover:text-green-400 transition-colors">{profileData.phone}</p>
                        </div>
                        <Phone className="w-4 h-4 text-zinc-600 group-hover:text-green-400 transition-colors flex-shrink-0" />
                      </div>
                    </a>

                    {/* WhatsApp Card */}
                    <a 
                      href={`https://wa.me/${profileData.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 sm:p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 hover:border-emerald-500/50 hover:bg-zinc-800/60 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-all">
                          <MessageCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">WhatsApp</p>
                          <p className="text-sm sm:text-base text-zinc-200 group-hover:text-emerald-400 transition-colors">Message on WhatsApp</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                      </div>
                    </a>

                    {/* LinkedIn Card */}
                    <a 
                      href={profileData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 sm:p-5 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 hover:border-sky-500/50 hover:bg-zinc-800/60 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 flex items-center justify-center group-hover:from-sky-500/30 group-hover:to-sky-600/30 transition-all">
                          <Linkedin className="w-5 h-5 text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">LinkedIn</p>
                          <p className="text-sm sm:text-base text-zinc-200 group-hover:text-sky-400 transition-colors">Connect with me</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-sky-400 transition-colors flex-shrink-0" />
                      </div>
                    </a>

                    {/* Location Info */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 border border-zinc-700/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Location</p>
                          <p className="text-sm sm:text-base text-zinc-200">New Delhi, India</p>
                          <p className="text-xs text-zinc-500 mt-1">Available for remote work worldwide</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form - Right Side */}
                  <div className="lg:col-span-3">
                    <div className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <Send className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-zinc-100">Send a Message</h3>
                          <p className="text-xs sm:text-sm text-zinc-500">I'll get back to you within 24 hours</p>
                        </div>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                          <div>
                            <label htmlFor="name" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 mb-2">
                              <User className="w-4 h-4" />
                              Your Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 mb-2">
                              <Mail className="w-4 h-4" />
                              Your Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 mb-2">
                            <FileText className="w-4 h-4" />
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            placeholder="Project Inquiry"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 mb-2">
                            <MessageCircle className="w-4 h-4" />
                            Your Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                            placeholder="Tell me about your project, goals, and how I can help..."
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm sm:text-base font-medium px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                    
                    {/* Social Links */}
                    <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-zinc-800/30 border border-zinc-700/30">
                      <p className="text-xs sm:text-sm text-zinc-500 text-center mb-4">Or find me on social platforms</p>
                      <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <a 
                          href="https://github.com/MasterJi27" 
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 hover:border-zinc-600 transition-all"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                        <a 
                          href={profileData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/50 transition-all"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a 
                          href={`mailto:${profileData.email}`}
                          aria-label="Email"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                        <a 
                          href={`https://wa.me/${profileData.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="WhatsApp"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Chatbot */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        {/* Chat Window */}
        {isChatOpen && (
          <div className="fixed inset-4 sm:inset-auto sm:absolute sm:bottom-16 md:bottom-20 sm:right-0 w-auto sm:w-[340px] md:w-[380px] h-auto sm:h-[450px] md:h-[500px] bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-fade-in">
            {/* Chat Header */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm sm:text-base">Whobee AI</h3>
                <p className="text-[10px] sm:text-xs text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Raghav's Assistant • Online
                </p>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
                title="Close chat"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-sm' 
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700/50'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-zinc-800 flex gap-2 overflow-x-auto scrollbar-none">
              {[{label: '🛠️ Skills', query: 'Skills'}, {label: '🚀 Projects', query: 'Projects'}, {label: '📧 Contact', query: 'Contact'}, {label: '📜 Certs', query: 'Certifications'}].map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setChatMessages(prev => [...prev, { role: 'user', content: action.query }]);
                    setTimeout(() => {
                      const botResponse = getBotResponse(action.query);
                      setChatMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
                    }, 500);
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded-full whitespace-nowrap transition-colors border border-zinc-700/50"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-3 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit(e)}
                  placeholder="Ask Whobee anything..."
                  className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 ${
            isChatOpen 
              ? 'bg-zinc-700 hover:bg-zinc-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-110'
          }`}
          aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        >
          {isChatOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          )}
        </button>
        
        {/* Chat Notification Dot */}
        {!isChatOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-zinc-900"></span>
        )}
      </div>
    </div>
  );
}

export default App;