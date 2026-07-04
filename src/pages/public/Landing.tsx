import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Clock, Smartphone, CreditCard, Bell, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const Landing = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const features = [
    { title: 'Pre-Order Meals', desc: 'Browse and order before arriving.', icon: Clock },
    { title: 'Pay via M-Pesa', desc: 'Fast, secure mobile payments.', icon: CreditCard },
    { title: 'Live Tracking', desc: 'Know exactly when food is ready.', icon: Smartphone },
    { title: 'Instant Alerts', desc: 'Get notified for collection.', icon: Bell },
  ];

  const steps = [
    { title: 'Browse Menu', desc: 'Find your favorite meals online.' },
    { title: 'Place Order', desc: 'Add items to cart and checkout.' },
    { title: 'Pay Online', desc: 'Complete payment using M-Pesa.' },
    { title: 'Get Notified', desc: 'Receive alert when ready.' },
    { title: 'Collect Food', desc: 'Skip the queue and enjoy!' },
  ];

  const faqs = [
    { q: 'How do I pay?', a: 'You can pay securely via M-Pesa during checkout.' },
    { q: 'Can I cancel an order?', a: 'Yes, but only before it enters the preparing stage.' },
    { q: 'Is it available for all cafeterias?', a: 'Currently available at the Main Cafeteria.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 lg:py-32">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
            <motion.h1 variants={fadeInUp} className="text-4xl lg:text-6xl font-bold leading-tight">
              Skip the Queue. <br/>Order Before You Arrive.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-primary-foreground/80 max-w-lg">
              Pre-order meals, pay online with M-Pesa, and collect your food when it is ready. Experience the modern way to dine at Strathmore.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <Link to="/menu"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Order Food</Button></Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative hidden lg:block">
            {/* Abstract illustration representation */}
            <div className="w-full aspect-square bg-gradient-to-tr from-secondary to-primary rounded-full opacity-20 absolute top-0 blur-3xl"></div>
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students eating" className="rounded-2xl shadow-2xl relative z-10 object-cover aspect-[4/3] border-4 border-white/10" />
            
            <div className="absolute -bottom-6 -left-6 bg-card text-card-foreground p-4 rounded-xl shadow-xl z-20 flex items-center gap-4">
              <div className="bg-success/20 p-3 rounded-full text-success">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">Average Queue Time</p>
                <p className="text-2xl font-bold text-success">Reduced by 85%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Use StrathCaf?</h2>
            <p className="text-muted-foreground mt-4">Designed to make your campus dining seamless.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="h-full border-none shadow-soft hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">How It Works</h2>
          <div className="flex flex-col md:flex-row items-start justify-center gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center relative z-10 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4 shadow-lg border-4 border-background">
                  {idx + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {/* Connector line for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-[2px] bg-border -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-primary-foreground/10 rounded-lg overflow-hidden">
                <button 
                  className="w-full px-6 py-4 flex items-center justify-between font-semibold"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {faq.q}
                  <ChevronDown className={cn("transition-transform", openFaq === idx ? "rotate-180" : "")} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-primary-foreground/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
