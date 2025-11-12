import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const AnimatedCard = ({ title, children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
    >
      <Card className="bg-card/50 border-border/50 hover:border-primary/30 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 h-full backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section 
      className="relative py-12 md:py-20 lg:py-32 w-full overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/85 to-indigo-900/85 z-0" />
      
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-25 z-0" 
        aria-hidden="true"
      />
      
      {/* Subtle grid pattern for texture */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px] z-0" 
        aria-hidden="true"
      />

      {/* Content container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Better <span className="text-primary">Technical</span> Hiring
          </h1>
          
          <p className="text-lg sm:text-xl text-white mb-8">
            SmartHireautomates technical interviews with intelligent assessments,
            helping you identify top talent faster and more accurately.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-border/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              opacity: 0
            }}
            animate={{
              y: [`${Math.random() * 20}%`, `${Math.random() * 80 + 20}%`],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <HeroSection />

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
            className="flex flex-col items-center justify-center text-center mb-16"
          >
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Why Choose SmartHire?
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-muted-foreground max-w-3xl">
              Our platform combines cutting-edge technology with intuitive design to
              streamline your technical recruitment process.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatedCard title="Smart Candidate Matching">
              <ul className="space-y-3 text-muted-foreground list-disc list-inside pl-5">
                <li>AI-based filtering</li>
                <li>Job-fit suggestions</li>
                <li>Real-time candidate tracking</li>
              </ul>
            </AnimatedCard>

            <AnimatedCard title="Comprehensive Analytics">
              <ul className="space-y-3 text-muted-foreground list-disc list-inside pl-5">
                <li>Detailed hiring insights</li>
                <li>Performance metrics</li>
                <li>Data-driven decisions</li>
              </ul>
            </AnimatedCard>

            <AnimatedCard title="Fast & Efficient">
              <ul className="space-y-3 text-muted-foreground list-disc list-inside pl-5">
                <li>Instant platform setup</li>
                <li>Immediate screening</li>
                <li>Accelerated hiring</li>
              </ul>
            </AnimatedCard>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-muted">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Top Companies</h2>
            
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary/10 rounded-full"></div>
              
              <div className="relative bg-card/50 border border-border/50 p-8 sm:p-10 rounded-xl shadow-sm backdrop-blur-sm">
                <blockquote className="text-lg italic mb-6 text-muted-foreground">
                  "SmartHirehas reduced our technical hiring time by 60% while improving candidate quality. The AI assessments are remarkably accurate."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                    <span className="text-primary font-bold">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">CTO at TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-primary/90 to-primary/70">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="container px-4 sm:px-6 lg:px-8 mx-auto text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies hiring smarter with SmartHire.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 bg-white text-primary hover:bg-white/90"
            >
              <Link to="/signup">
                Start Free Trial
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}