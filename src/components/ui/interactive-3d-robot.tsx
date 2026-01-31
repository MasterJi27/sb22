'use client';

import { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{text: string, isBot: boolean}[]>([
    { text: "Hi! I'm Whobee, Raghav's AI assistant! 👋 Ask me anything about his skills, projects, or experience!", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
      return "Raghav's skills include:\n\n☁️ Cloud: AWS, Azure, GCP, Oracle Cloud\n🔧 DevOps: Docker, Kubernetes, Terraform, Ansible, Jenkins\n💻 Languages: Python, JavaScript, TypeScript, Bash\n🗃️ Databases: PostgreSQL, MongoDB, Redis\n🤖 MLOps: ML pipelines, model deployment";
    }
    if (lowerMessage.includes('project')) {
      return "Raghav's key projects:\n\n🏗️ Enterprise Kubernetes Platform (99.9% uptime)\n🔄 Multi-Cloud IaC Framework\n🚀 GitOps CI/CD Pipeline\n🤖 ML Model Serving Platform\n📊 Cloud Cost Optimizer (40% savings)\n📈 Observability Stack";
    }
    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
      return "Raghav's experience:\n\n🔬 Research Contributor - AI Ethics & Governance under Dr. Malini\n🤖 MLOps Intern - ML pipelines & model deployment\n☁️ DevOps Practice - Infrastructure automation\n\n🟢 Currently available for opportunities!";
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('reach')) {
      return "📬 Contact Raghav:\n\n📧 Raghavkathuria69@outlook.com\n📱 +91 7011933060\n💼 linkedin.com/in/raghavkathuria0\n🐙 github.com/MasterJi27\n📍 New Delhi, India";
    }
    if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('college')) {
      return "📚 Education:\n\nBCA (Bachelor of Computer Applications)\n🏫 Currently pursuing (2024-2027)\n\nCombining formal education with 31+ industry certifications!";
    }
    if (lowerMessage.includes('certification') || lowerMessage.includes('certificate') || lowerMessage.includes('cert')) {
      return "🏆 31+ Certifications:\n\n🔷 Microsoft (11): Azure AZ-900, AI-900, DP-900, SC-900, Power Platform\n🟠 AWS (3): Cloud Practitioner, Solutions Architect\n🔴 Oracle (5): OCI, Gen AI Professional\n🔵 IBM (8): AI, Cloud, Data Science, DevOps\n🟢 Cisco (4): Networking, Cybersecurity\n🟣 NVIDIA: Developer Program\n\n✅ All on Credly!";
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm Whobee, Raghav's AI assistant! Ask about his skills, projects, 31+ certifications, or how to contact him!";
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! 😊 Feel free to explore Raghav's portfolio or reach out via the Contact form!";
    }
    if (lowerMessage.includes('who are you') || lowerMessage.includes('your name') || lowerMessage.includes('whobee')) {
      return "I'm Whobee! 🤖 Raghav's friendly AI assistant built to help visitors learn about his skills, projects, and experience. How can I help?";
    }
    if (lowerMessage.includes('devops') || lowerMessage.includes('cloud')) {
      return "Raghav specializes in Cloud & DevOps!\n\n☁️ AWS, Azure, GCP, Oracle Cloud\n🐳 Docker, Kubernetes, Helm\n🔧 Terraform, Ansible, Jenkins\n🔄 GitOps, ArgoCD, CI/CD\n\nHe makes infrastructure invisible! 🚀";
    }
    if (lowerMessage.includes('github') || lowerMessage.includes('code')) {
      return "🐙 GitHub: github.com/MasterJi27\n\nCheck out Raghav's open-source projects including Kubernetes automation, CI/CD pipelines, and more!";
    }
    if (lowerMessage.includes('nvidia')) {
      return "🟢 Raghav is a NVIDIA Developer Program member with access to:\n\n• Deep Learning Institute\n• GPU Cloud credits\n• Developer tools & SDKs\n\nEnabling cutting-edge AI/ML work!";
    }
    if (lowerMessage.includes('available') || lowerMessage.includes('open') || lowerMessage.includes('hiring')) {
      return "🟢 Yes! Raghav is available for:\n\n• Full-time DevOps/Cloud roles\n• Internships\n• Freelance projects\n• Collaborations\n\nReach out via email or LinkedIn!";
    }
    
    return "Great question! Try asking about:\n\n• Skills & technologies\n• 31+ Certifications\n• Projects\n• Experience\n• Contact info\n\nI'm here to help! 🤖";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
    const userMsg = inputMessage;
    setInputMessage('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: getBotResponse(userMsg), isBot: true }]);
    }, 600);
  };

  const quickActions = [
    { label: "🛠️ Skills", query: "What are Raghav's skills?" },
    { label: "🚀 Projects", query: "Tell me about projects" },
    { label: "📧 Contact", query: "How can I contact Raghav?" },
    { label: "📜 Certs", query: "What certifications does Raghav have?" },
  ];

  return (
    <div className={`relative ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-zinc-400">Loading Whobee...</p>
          </div>
        }
      >
        <div className="w-full h-full relative overflow-hidden">
          <Spline scene={scene} className="w-full h-full" />
          {/* Hide Spline watermark at bottom-right */}
          <div className="absolute bottom-0 right-0 w-[180px] h-[60px] bg-zinc-900 pointer-events-none z-10" />
          {/* Gradient blend from right edge */}
          <div className="absolute bottom-0 right-[160px] w-[80px] h-[60px] bg-gradient-to-l from-zinc-900 to-transparent pointer-events-none z-10" />
          {/* Bottom edge gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900/90 to-transparent pointer-events-none z-10" />
        </div>
      </Suspense>

      {/* Chat Toggle Button */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-2.5 sm:p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 ${
            isChatOpen 
              ? 'bg-red-500 hover:bg-red-600 scale-90' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-110'
          }`}
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
        >
          {isChatOpen ? (
            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          )}
        </button>
        {!isChatOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-zinc-900" />
        )}
      </div>

      {/* Info Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-zinc-700/50">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          <span className="text-[10px] sm:text-xs text-white font-medium">3D Interactive</span>
        </div>
      </div>

      {/* Drag Hint */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-zinc-700/50">
          <span className="text-[10px] sm:text-xs text-zinc-300">👆 Drag to rotate</span>
        </div>
      </div>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="absolute bottom-14 sm:bottom-16 md:bottom-20 right-2 sm:right-4 w-[260px] sm:w-[300px] md:w-[340px] bg-zinc-900/98 backdrop-blur-md rounded-xl sm:rounded-2xl border border-zinc-700/50 shadow-2xl z-30 overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2.5 sm:p-3 md:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base">Whobee AI</h3>
                <p className="text-white/70 text-[10px] sm:text-xs">Raghav's Assistant • Online</p>
              </div>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-1.5 sm:p-2 border-b border-zinc-700/50 flex gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setChatMessages(prev => [...prev, { text: action.query, isBot: false }]);
                  setTimeout(() => {
                    setChatMessages(prev => [...prev, { text: getBotResponse(action.query), isBot: true }]);
                  }, 600);
                }}
                className="px-2 sm:px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] sm:text-xs text-zinc-300 rounded-full whitespace-nowrap transition-colors border border-zinc-700/50 hover:border-zinc-600"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="h-[150px] sm:h-[180px] md:h-[220px] overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-2.5">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm leading-relaxed ${
                  msg.isBot
                    ? 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 sm:p-2.5 md:p-3 border-t border-zinc-700/50 bg-zinc-800/50">
            <div className="flex gap-1.5 sm:gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Raghav..."
                className="flex-1 bg-zinc-900 text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-zinc-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                aria-label="Send message"
                className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
