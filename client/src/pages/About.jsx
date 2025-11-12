import React, { useState, useEffect, useRef } from "react";
import { Star, Briefcase, Target, Users, Zap, ArrowRight, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "./Footer";

// Animation on scroll
const AnimatedOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const testimonialsData = [
  {
    id: 1,
    name: "Amina Juma",
    title: "HR Director",
    company: "Safaricom PLC",
    quote:
      "SmartHirereduced our hiring time by 60% while improving candidate quality. The platform's AI assessments are unmatched in our market.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "David Kimani",
    title: "Tech Lead",
    company: "Cellulant",
    quote:
      "The technical assessments accurately reflect real-world skills. We've seen a 40% reduction in early attrition since using SmartHire.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "Fatima Ali",
    title: "Talent Acquisition",
    company: "Equity Bank",
    quote:
      "Transformed our graduate recruitment. We're finding exceptional candidates from diverse backgrounds we previously overlooked.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop",
    rating: 5,
  },
];

const features = [
  {
    title: "AI-Powered Assessments",
    description: "Our algorithms evaluate 120+ data points to predict candidate success with 89% accuracy.",
    icon: <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    benefits: [
      "Evaluates technical and soft skills simultaneously",
      "Eliminates guesswork in screening candidates",
      "Matches talent to job requirements in real time",
    ],
  },
  {
    title: "Bias-Free Hiring",
    description: "Patented technology removes demographic identifiers while preserving skill signals.",
    icon: <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&auto=format&fit=crop",
    benefits: [
      "Ensures fairness across gender and ethnicity",
      "Promotes diversity by focusing on potential",
      "Complies with global and local hiring regulations",
    ],
  },
  {
    title: "Real-Time Analytics",
    description: "Track pipeline metrics and optimize your hiring process with actionable insights.",
    icon: <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    benefits: [
      "Visual dashboards for decision-making",
      "Live status tracking of candidate progress",
      "Custom reports to improve hiring outcomes",
    ],
  },
];

const About = () => {
  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <AnimatedOnScroll>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Smarter Hiring
                  </span>{" "}
                  for Africa's Growing Businesses
                </h1>
              </AnimatedOnScroll>
              <AnimatedOnScroll delay={100}>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                  We combine cutting-edge technology with deep market expertise to transform how companies find and hire top talent across Africa.
                </p>
              </AnimatedOnScroll>
              <AnimatedOnScroll delay={200}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="gap-2">
                    <Link to="/signup">Get Started</Link>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Learn More
                  </Button>
                </div>
              </AnimatedOnScroll>
            </div>
            <div className="lg:w-1/2">
              <AnimatedOnScroll delay={300}>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                  alt="Team working"
                  className="rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
                />
              </AnimatedOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <AnimatedOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Trusted by Africa's Top Employers</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our platform powers hiring for leading organizations across the continent
              </p>
            </div>
          </AnimatedOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: "85%", label: "Reduction in hiring bias" },
              { stat: "3.5x", label: "Faster hiring cycles" },
              { stat: "92%", label: "Candidate satisfaction" },
              { stat: "250+", label: "Enterprise clients" },
            ].map((item, idx) => (
              <AnimatedOnScroll key={idx} delay={idx * 100}>
                <Card className="text-center p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{item.stat}</div>
                  <p className="text-gray-600 dark:text-gray-300">{item.label}</p>
                </Card>
              </AnimatedOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How We Transform Hiring</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our platform combines advanced technology with deep HR expertise
              </p>
            </div>
          </AnimatedOnScroll>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <AnimatedOnScroll key={index} delay={index * 100}>
                <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}>
                  <div className="md:w-1/2">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 w-full"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900">{feature.icon}</div>
                      <h3 className="text-2xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.benefits.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <AnimatedOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Trusted by HR leaders across East Africa</p>
            </div>
          </AnimatedOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <AnimatedOnScroll key={testimonial.id} delay={index * 150}>
                <Card className="h-full hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.title}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedOnScroll>
            <Card className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  Join hundreds of companies already benefiting from our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button className="gap-2">
                  Request Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </AnimatedOnScroll>
        </div>
      </section>
            <Footer />
          
    </div>
  );
};

export default About;
