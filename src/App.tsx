import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimate } from "motion/react";
import { 
  ArrowUpRight, 
  Linkedin, 
  Github, 
  Mail, 
  Code, 
  BarChart3, 
  BrainCircuit, 
  LineChart, 
  Cpu, 
  Globe, 
  Bot, 
  Database, 
  Zap,
  CheckCircle2,
  ExternalLink,
  Menu,
  X
} from "lucide-react";

// --- Components ---

const StatusPill = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="inline-flex items-center gap-2 px-3 pb-[6px] sm:pb-1.5 pt-1.5 rounded-full bg-white/40 backdrop-blur-md border border-charcoal/5 shadow-sm mr-0 mb-[500px] sm:mb-0"
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-charcoal/80">Available for hire</span>
  </motion.div>
);

  const NavLink = ({ item }: { item: string }) => {
  return (
    <a
      href={`#${item.toLowerCase()}`}
      data-item={item}
      className="nav-link text-sm font-normal text-charcoal/80 hover:text-charcoal transition-colors relative block leading-[0.8] whitespace-nowrap px-2 py-1"
    >
      {item}
    </a>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scope, animate] = useAnimate();
  const [deliveredItems, setDeliveredItems] = useState<string[]>([]);
  const [carrierCargo, setCarrierCargo] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ["Home", "Work", "About", "Service", "Testimonial"];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const runSequence = async () => {
      // PHYSICS CONFIGS
      const carrySpring = { type: "spring" as const, stiffness: 60, damping: 20 };
      const jumpSpring = { type: "spring" as const, stiffness: 150, damping: 15 };
      const returnSpring = { type: "spring" as const, stiffness: 200, damping: 25 };

      // 1. Initial Setup
      await animate(".static-nav-item", { opacity: 0 }, { duration: 0 });
      await animate("#contact-btn", { opacity: 0, scale: 0 }, { duration: 0 });
      
      const brandSlot = document.querySelector("#brand-slot");
      const brandSlotRect = brandSlot?.getBoundingClientRect();

      for (let i = 0; i < navItems.length; i++) {
        const item = navItems[i];
        
        // STEP 1: THE FETCH
        // Start off-screen left and update cargo
        await animate("#carrier-unit", { x: "-180vw", opacity: 1 }, { duration: 0 });
        setCarrierCargo(item);
        // Run into Start Line
        await animate("#carrier-unit", { x: 0 }, returnSpring);

        const targetEl = document.querySelector(`[data-target="${item}"]`);
        const targetRect = targetEl?.getBoundingClientRect();

        if (targetRect && brandSlotRect) {
          const finalX = targetRect.left - brandSlotRect.left;
          
          // STEP 2: THE RUN & JUMP (Obstacles)
          for (let j = 0; j < i; j++) {
            const obstacle = navItems[j];
            const obsEl = document.querySelector(`[data-target="${obstacle}"]`);
            const obsRect = obsEl?.getBoundingClientRect();
            
            if (obsRect) {
              const obsX = obsRect.left - brandSlotRect.left;
              const obsWidth = obsRect.width;

              // Move to just before the obstacle
              await animate("#carrier-unit", { x: obsX - 50 }, carrySpring);
              
              // EXECUTE JUMP while obstacle SLIDES briefly
              await Promise.all([
                (async () => {
                  // High parabolic jump
                  await animate("#carrier-unit", { y: -75, x: obsX + (obsWidth / 2) }, jumpSpring);
                  await animate("#carrier-unit", { y: 0, x: obsX + obsWidth + 50 }, jumpSpring);
                })(),
                (async () => {
                  await animate(`[data-target="${obstacle}"]`, { x: -20 }, { duration: 0.2 });
                  await animate(`[data-target="${obstacle}"]`, { x: 0 }, { duration: 0.2 });
                })()
              ]);
            }
          }

          // Final approach stretch
          await animate("#carrier-unit", { x: finalX }, carrySpring);

          // STEP 3: THE DROP-OFF
          setDeliveredItems(prev => [...prev, item]);
          await animate(`[data-target="${item}"]`, { opacity: 1, scale: [0.8, 1.1, 1], y: [10, 0] }, { duration: 0.4 });
          setCarrierCargo(""); // Transfer cargo

          // STEP 4: THE EMPTY RETURN
          await Promise.all([
            animate("#carrier-unit", { x: 0 }, returnSpring),
            (async () => {
              // Placed items execute a vertical jump as character runs back left
              for (let k = 0; k <= i; k++) {
                const placedItem = navItems[k];
                setTimeout(() => {
                  animate(`[data-target="${placedItem}"]`, { y: [-25, 0] }, jumpSpring);
                }, (i - k) * 70);
              }
            })()
          ]);
        }
      }

      // Conclusion reveal
      await animate("#contact-btn", { opacity: 1, scale: 1 }, { type: "spring", stiffness: 300, damping: 15 });
      setIsDone(true);
    };

    if (window.innerWidth >= 768) {
      const timer = setTimeout(runSequence, 1500);
      return () => clearTimeout(timer);
    } else {
      setDeliveredItems(navItems);
      setIsDone(true);
    }
  }, [animate]);

  return (
    <nav 
      ref={scope}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-warm-bg/90 backdrop-blur-md py-4 border-b border-charcoal/5 shadow-sm' 
          : 'bg-warm-bg/60 backdrop-blur-sm md:bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        
        {/* The "Track" - Carrier handles the Brand Text "sachin." */}
        <div id="brand-slot" className="relative h-12 w-28 md:w-32 flex items-end">
          <div 
            id="carrier-unit" 
            className="absolute flex flex-col items-center pointer-events-none"
            style={{ 
              bottom: "4px", // Align with baseline
              left: "0",
              zIndex: 50,
              opacity: 0
            }}
          >
            <div id="cargo-text" className="text-sm font-bold uppercase tracking-widest text-charcoal/80 mb-[-12px] min-h-[0.75rem]">
              {carrierCargo}
            </div>
            <div className="text-3xl">
              <span className="animated-text" data-text="sachin.">sachin.</span>
            </div>
          </div>
          
          {/* Logo link is visible when sequence is done or on mobile */}
          {isDone && (
            <a 
              href="#" 
              className="text-3xl block hover:text-gold transition-colors"
            >
              <span className="animated-text" data-text="sachin.">sachin.</span>
            </a>
          )}
        </div>
        
        <div className="nav-items-container hidden md:flex items-center gap-6 lg:gap-10">
          {navItems.map((item) => (
            <div key={item} data-target={item} className="static-nav-item inline-block">
              <NavLink item={item} />
            </div>
          ))}
        </div>

        <div id="contact-btn" className="hidden md:block">
          <a 
            href="#contact" 
            className="bg-charcoal text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all block"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <a 
            href="#contact" 
            className="bg-charcoal text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-charcoal/90 transition-all"
          >
            Contact
          </a>
          <button 
            className="p-1.5 text-charcoal hover:text-gold transition-colors z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-warm-bg/95 backdrop-blur-xl border-b border-charcoal/5 overflow-hidden md:hidden shadow-xl"
            >
              <div className="flex flex-col p-8 gap-6">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-2xl font-serif italic text-charcoal/80 hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const ProjectCard = ({ project, index }: { project: any, index: number, key?: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col bg-white border border-charcoal/5 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-charcoal/5 transition-all duration-500"
    >
      <div className="p-8 md:p-10 flex flex-col h-full">
        <div className="mb-6">
          <span className="text-xs font-mono text-gold uppercase tracking-widest mb-2 block">{project.category}</span>
          <h3 className="text-2xl md:text-3xl font-display font-bold leading-tight mb-3">
            {project.title}
          </h3>
          <p className="text-charcoal/60 text-sm leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        <div className="space-y-6 flex-grow">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">The Build</h4>
            <p className="text-sm text-charcoal/80 leading-relaxed font-medium">{project.build}</p>
          </div>

          {"features" in project && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Key Features</h4>
              <p className="text-sm text-charcoal/80 leading-relaxed">{project.features}</p>
            </div>
          )}

          {"applications" in project && (
             <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">The Applications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.applications.map((app: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-warm-accent rounded-xl border border-charcoal/5">
                    <CheckCircle2 className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold opacity-80">{app.name}</span>
                      <span className="text-[10px] opacity-60 leading-tight">{app.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
             </div>
          )}

          {"strategy" in project && (
             <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">The Strategy</h4>
              <p className="text-sm text-charcoal/80 leading-relaxed">{project.strategy}</p>
            </div>
          )}

          {"solution" in project && (
             <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">The Solution</h4>
              <p className="text-sm text-charcoal/80 leading-relaxed">{project.solution}</p>
            </div>
          )}

          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 mt-auto">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-700/60 mb-1">The Impact</h4>
            <p className="text-sm text-green-900 leading-relaxed font-medium">{project.impact}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-charcoal/5 flex flex-wrap gap-2 items-center">
          {project.tags.map((tag: string) => (
             <span key={tag} className="text-[10px] font-medium bg-warm-accent px-2.5 py-1 rounded-md text-charcoal/60 uppercase tracking-wider">
               {tag}
             </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3">
          {project.links.map((link: any, i: number) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold hover:text-gold transition-colors whitespace-nowrap"
            >
              {link.label}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SkillPill = ({ label, category }: { label: string, category: string }) => (
  <div className="flex items-center gap-2 group cursor-default">
    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-150 ${
      category === 'Core' ? 'bg-gold' : 
      category === 'AI' ? 'bg-blue-400' : 
      category === 'Viz' ? 'bg-green-400' : 'bg-charcoal/20'
    }`} />
    <span className="text-sm font-medium text-charcoal/70 transition-colors group-hover:text-charcoal">{label}</span>
  </div>
);

// --- Main App ---

const RunawayButton = () => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [isFleeing, setIsFleeing] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only active on desktop (lg breakpoint and up)
      if (window.innerWidth < 1024 || !btnRef.current) {
        if (isFleeing) setIsFleeing(false);
        return;
      }

      const rect = btnRef.current.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - btnX, e.clientY - btnY);
      const escapeRadius = 150; // Increased radius slightly for better effect

      if (distance < escapeRadius) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const maxX = window.innerWidth - rect.width - 20;
        const maxY = window.innerHeight - rect.height - 20;

        const randomX = Math.max(20, Math.floor(Math.random() * maxX));
        const randomY = Math.max(20, Math.floor(Math.random() * maxY));

        setPos({ left: randomX, top: randomY });
        setIsFleeing(true);

        timeoutRef.current = setTimeout(() => {
          setIsFleeing(false);
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isFleeing]);

  return (
    <div className="relative">
      {/* Placeholder to keep layout stable on desktop */}
      <div className="w-[190px] h-[58px] hidden lg:block" />
      <a
        ref={btnRef}
        href="#works"
        style={isFleeing ? {
          position: 'fixed',
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          zIndex: 1000,
        } : {
          position: 'relative',
        }}
        className="bg-charcoal text-white px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-charcoal/20 runaway-btn w-full sm:w-[190px] h-[54px] lg:absolute lg:top-0 lg:left-0"
      >
        View My Work
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
};

export default function App() {
  const projects = [
    {
      category: "Personal Finance & AI",
      title: "ExpenseIQ: AI-Powered Personal Finance",
      subtitle: "Making budgeting intuitive through automation and predictive data.",
      build: "An end-to-end, no-code personal finance dashboard designed to give users real-time clarity over their money.",
      features: "Integrated GPT-driven automatic categorization, dynamic color-coded budgets, and a predictive 'future balance' line to forecast the impact of daily choices.",
      impact: "🚀 Early beta testers successfully reduced their overspending by an average of 12% in their very first month.",
      tags: ["AI API Integrations", "Prompt Engineering", "Web App Workflows"],
      links: [
        { label: "App Link", url: "https://newexpenseiq.netlify.app/" },
        { label: "LinkedIn Post", url: "https://www.linkedin.com/posts/sachinrathodpm_expense-iq-project-activity-7435949549371699200-Gd-_" }
      ]
    },
    {
      category: "Enterprise Data Science",
      title: "4 Enterprise Analytics Suite",
      subtitle: "Bringing data stories to life across multiple industries using Streamlit and ML.",
      build: "Designed and deployed four distinct, interactive web applications to solve complex business challenges with custom predictive models.",
      applications: [
        { name: "Palo Alto Networks", desc: "Employee engagement & burnout diagnostics." },
        { name: "Global Supply Chain", desc: "ML-based late delivery risk prediction." },
        { name: "Healthcare Logistics", desc: "Care transition efficiency analytics." },
        { name: "Smart Manufacturing", desc: "Predictive maintenance for 6G systems." }
      ],
      impact: "📊 Bridged the gap between raw data models and executive decision-making with highly visual, interactive dashboards.",
      tags: ["Python", "Streamlit", "Machine Learning", "Predictive Analytics"],
      links: [
        { label: "Dashboard 1", url: "https://employee-engagement-satisfaction-burnout-diagnosticsachinrathod.streamlit.app/" },
        { label: "Dashboard 2", url: "https://machine-learning-based-late-deliverysachinrathod.streamlit.app/" },
        { label: "Dashboard 3", url: "https://care-transition-efficiency-placement-outcome-sachinrathod.streamlit.app/" },
        { label: "Dashboard 4", url: "https://6g-predictive-maintenance-sachinrathod.streamlit.app/" }
      ]
    },
    {
      category: "Business Strategy",
      title: "CarbonEdge: Turnaround Simulation",
      subtitle: "From a massive deficit to #1 market leader in a highly competitive MBA capstone.",
      challenge: "As Capstone Lead, team hit a critical $323K net loss in Q3 due to excess capacity costs.",
      strategy: "Executed a mid-term turnaround plan focusing on aggressive manufacturing efficiency and treating human resources as a profit driver.",
      impact: "📈 Captured #1 Market Share (36.39%), swung to $598K Net Income, and slashed costs by 70%.",
      tags: ["Technical Project Management", "Financial Strategy", "Leadership"],
      links: [
        { label: "Link to Case", url: "https://www.linkedin.com/posts/sachinrathodpm_carbonedge-international-stockholder-report-activity-7420330181359427585-eMct?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFFq5vQBgCeDRdO2_Nu6LBiOfqA7n5x6OBg" }
      ]
    },
    {
      category: "Market Expansion",
      title: "Global Entry: US EdTech Expansion",
      subtitle: "Advisory consulting for a high-stakes entry into the $80B US EdTech market.",
      challenge: "Evaluated a Joint Venture (JV) opportunity for a leading Indian EdTech player aiming to penetrate a saturated US market.",
      solution: "Developed a 'Hardware-Led' strategy focused on AI Smart Boards to create physical ecosystem lock-in for Charter Schools.",
      impact: "🗺️ Delivered a risk-aware, phased roadmap outlining a path to $80.4M in US revenue by Year 5.",
      tags: ["Business Intelligence", "Market Research", "Strategic Advisory"],
      links: [
        { label: "Link to Post", url: "https://www.linkedin.com/posts/sachinrathodpm_jv-with-teachmint-us-market-entry-activity-7458884674405343232-0nWs" }
      ]
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-gold/30">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-12 sm:pt-32 pb-12 bg-warm-bg min-h-[100dvh] lg:min-h-screen flex items-start sm:items-center justify-center overflow-hidden">
        {/* Central Radial Glow (matching reference) */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-square radial-gradient-hero pointer-events-none opacity-80 z-0 scale-125 md:scale-150" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full h-full flex flex-col justify-start sm:justify-center pt-8 sm:pt-20 pb-24 sm:py-12 lg:ml-[212.333px] lg:mb-[1px] lg:pt-[7px]">
          <div className="relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[450px]">
            
            {/* Top Typography: Hey, there */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute top-[18%] sm:top-[20%] w-full flex flex-row justify-between items-start z-0 px-[5%] sm:px-[15%] md:px-[20%] lg:px-[24%] xl:px-[26%]"
            >
              <h2 className="font-serif italic font-normal text-4xl sm:text-6xl md:text-[90px] lg:text-[130px] text-charcoal/90 leading-none tracking-tight select-none">
                Hey,
              </h2>
              <h2 className="font-serif italic font-normal text-4xl sm:text-6xl md:text-[90px] lg:text-[130px] text-charcoal/90 leading-none tracking-tight select-none pb-[10px]">
                there
              </h2>
            </motion.div>

            {/* Middle Right: Specialization Accent */}
            <div className="absolute top-[50%] right-0 -translate-y-1/2 max-w-[90px] xs:max-w-[100px] sm:max-w-[150px] md:max-w-[200px] text-right z-30 pr-2 sm:pr-4">
              <p className="text-[6px] xs:text-[7px] sm:text-[9px] md:text-[11px] font-bold text-charcoal/80 leading-relaxed uppercase tracking-tight">
                Specialized in AI Strategy, <br /> RAG Pipelines, and Technical <br /> Product Management.
              </p>
            </div>

            {/* Status Pill */}
            <div className="absolute top-[50%] left-0 -translate-y-1/2 pl-2 sm:pl-4 z-30">
              <div className="scale-[0.5] xs:scale-[0.6] sm:scale-90 md:scale-100 lg:scale-110 origin-left">
                <StatusPill />
              </div>
            </div>

            {/* Portrait Image (Refined size and blending) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[80vw] sm:max-w-[420px] md:max-w-[550px] lg:max-w-[650px] max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] lg:max-h-[85vh] aspect-[4/5] md:aspect-[3.6/4] flex items-end justify-center z-10 mx-auto"
            >
              <img 
                src="https://i.postimg.cc/rpZgYw6D/photoppp-1-1.png" 
                alt="Sachin Rathod"
                className="w-full h-full object-contain object-bottom pointer-events-none"
                referrerPolicy="no-referrer"
              />
              {/* Bottom blending blur */}
              <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-warm-bg via-warm-bg/70 to-transparent z-20 mb-[-4px]" />
            </motion.div>

            {/* Lower Hero Typography */}
            <div className="absolute bottom-[-5px] sm:bottom-[15px] lg:bottom-[35px] w-full flex flex-row justify-between items-end z-30 pointer-events-none px-4 md:px-8">
              {/* Bottom Left: I AM SACHIN */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-left"
              >
                <h1 className="font-sans text-[14vw] sm:text-[10vw] md:text-[90px] lg:text-[130px] font-black leading-[0.8] tracking-[calc(-0.03em)] uppercase text-charcoal">
                  I AM <br /> SACHIN
                </h1>
              </motion.div>

              {/* Bottom Right: Title (Stacked & Bold) */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-right translate-y-[5px] md:translate-y-[10px] lg:translate-y-[15px]"
              >
                <h3 className="font-sans text-[5vw] sm:text-[4vw] md:text-[40px] lg:text-[55px] font-black leading-[0.85] uppercase text-charcoal tracking-tighter">
                  AI <br /> PRODUCT <br /> STRATEGIST 
                </h3>
              </motion.div>
            </div>
          </div>

          {/* Scrolling Invitation */}
          <div className="mt-12 md:mt-20 flex flex-col md:flex-row items-center justify-between border-t border-charcoal/5 pt-12 md:pt-16 gap-8">
            <p className="text-xl md:text-2xl font-medium max-w-2xl text-balance">
              "I speak <span className="font-serif italic text-gold">math</span>, think <span className="underline decoration-gold/50 underline-offset-4">business</span>, and build AI tools that work in the real world."
            </p>
            <div className="flex items-center gap-6">
              <RunawayButton />
            </div>
          </div>
        </div>
      </section>


      {/* About Me */}
      <section id="about" className="py-24 bg-warm-accent/50 border-y border-charcoal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <h2 className="font-display text-4xl font-bold tracking-tight mb-4">Numbers, Ideas, <br /> & People</h2>
              <div className="flex gap-6 mt-8 flex-wrap items-center">
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-gold">MBA</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-charcoal">AI Specialization</span>
                </div>
                <div className="w-px h-12 bg-charcoal/10 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold text-gold">MATH</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-charcoal">Foundation</span>
                </div>
                <div className="w-px h-12 bg-charcoal/10 hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-display font-bold text-gold leading-tight">PRODUCT MANAGEMENT</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-charcoal mt-0.5">Authorized by Google / Coursera</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-charcoal/80">
                <p>
                  Numbers, ideas, and people—that’s my sweet spot. With a foundation in Mathematics and an MBA in Artificial Intelligence, <span className="text-charcoal font-bold">I bridge the gap</span> between complex technical models and actionable business strategies.
                </p>
                <p>
                  Whether I'm designing <span className="italic">Retrieval-Augmented Generation (RAG)</span> pipelines, building no-code apps with tools like n8n and Supabase, or crafting data stories in Tableau, my philosophy remains the same: <span className="text-charcoal underline decoration-gold/30 underline-offset-4 font-medium">ask the right questions before writing a single line of spec.</span>
                </p>
                <p>
                  I focus on workflow design, system supervision, and translating between human needs and machine capabilities to drive practical, real-world impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="work" className="py-32 bg-warm-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-24">
            <h2 className="font-display text-6xl md:text-8xl font-bold tracking-tighter uppercase text-charcoal">Recent Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Toolkit / Services */}
      <section id="service" className="py-32 bg-warm-accent/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Toolkit & Services</h2>
            <p className="text-charcoal/60 max-w-lg">The systems and languages I use to build business-ready solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-charcoal/40 mb-6">Core Disciplines</h3>
              <div className="space-y-4">
                <SkillPill label="Technical Project Management" category="Core" />
                <SkillPill label="AI Strategy & Governance" category="Core" />
                <SkillPill label="Business Analytics" category="Core" />
              </div>
            </div>
            
            <div>
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-charcoal/40 mb-6">AI & Data</h3>
              <div className="space-y-4">
                <SkillPill label="Prompt Engineering" category="AI" />
                <SkillPill label="RAG Systems" category="AI" />
                <SkillPill label="Agentic Workflows" category="AI" />
                <SkillPill label="Machine Learning" category="AI" />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-charcoal/40 mb-6">Visualization</h3>
              <div className="space-y-4">
                <SkillPill label="Power BI" category="Viz" />
                <SkillPill label="Tableau" category="Viz" />
                <SkillPill label="Streamlit" category="Viz" />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-charcoal/40 mb-6">Dev & Automation</h3>
              <div className="space-y-4">
                <SkillPill label="n8n / Automation" category="Dev" />
                <SkillPill label="Supabase / Firebase" category="Dev" />
                <SkillPill label="Git / GitHub" category="Dev" />
                <SkillPill label="Voice Agents (Vapi)" category="Dev" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-32 bg-charcoal text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gold/10 blur-[100px] mask-radial" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              Let's Build Something <br /> <span className="text-gold">Strategic.</span>
            </motion.h2>
            
            <p className="text-xl md:text-2xl text-white/60 mb-16 leading-relaxed max-w-2xl mx-auto">
              Looking for someone to lead an AI initiative, streamline complex workflows, or turn your raw data into a strategic advantage? Let's connect.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Mail, label: "Email", text: "sachin.rathod.pm@gmail.com", url: "mailto:sachin.rathod.pm@gmail.com" },
                { icon: Linkedin, label: "LinkedIn", text: "sachinrathodpm", url: "https://www.linkedin.com/in/sachinrathodpm" },
                { icon: Github, label: "GitHub", text: "knightdevilrider", url: "https://github.com/knightdevilrider" }
              ].map((contact, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -5 }}
                  href={contact.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center gap-3"
                >
                  <contact.icon className="w-6 h-6 text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{contact.label}</span>
                  <span className="text-sm font-medium">{contact.text}</span>
                </motion.a>
              ))}
            </div>

            <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 text-xs font-mono tracking-widest">
              <p>© 2026 SACHIN RATHOD. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                <span>BUILT WITH PRECISION</span>
                <span>// 2026_SACHIN_PORTFOLIO</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
