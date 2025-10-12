import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, TrendingUp, Shield, Clock, Phone, Mail, MapPin } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    minInvestment: "$100",
    maxInvestment: "$499",
    roi: "1.9%",
    frequency: "Every Day",
    duration: "Weekly Trial",
    totalReturn: "3.8%",
    capitalBack: true,
    badge: "Weekly Trial",
    badgeColor: "bg-blue-500",
    popular: false
  },
  {
    id: "new-trader",
    name: "New Trader",
    minInvestment: "$500",
    maxInvestment: "$999",
    roi: "2%",
    frequency: "Every Day",
    duration: "Daily",
    totalReturn: "14%",
    capitalBack: true,
    badge: null,
    badgeColor: null,
    popular: false
  },
  {
    id: "flex",
    name: "Flex",
    minInvestment: "$1000",
    maxInvestment: "$2500",
    roi: "5%",
    frequency: "Every Day",
    duration: "Lifetime",
    totalReturn: "35%",
    capitalBack: true,
    badge: "Popular",
    badgeColor: "bg-green-500",
    popular: true
  },
  {
    id: "professional",
    name: "Professional",
    minInvestment: "$3000",
    maxInvestment: "$4999",
    roi: "8.6%",
    frequency: "Every Day",
    duration: "Daily",
    totalReturn: "60.2%",
    capitalBack: true,
    badge: null,
    badgeColor: null,
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    minInvestment: "$5000",
    maxInvestment: "$9999",
    roi: "12%",
    frequency: "Every Day",
    duration: "Lifetime",
    totalReturn: "Lifetime Earning",
    capitalBack: true,
    badge: null,
    badgeColor: null,
    popular: false
  },
  {
    id: "elite",
    name: "Elite",
    minInvestment: "$10000",
    maxInvestment: "$30000",
    roi: "20%",
    frequency: "Every Day",
    duration: "Daily",
    totalReturn: "140%",
    capitalBack: true,
    badge: "Hot",
    badgeColor: "bg-red-500",
    popular: false
  },
  {
    id: "prime",
    name: "Prime",
    minInvestment: "$40000",
    maxInvestment: "$90000",
    roi: "20%",
    frequency: "Every Hour",
    duration: "Lifetime",
    totalReturn: "Lifetime Earning",
    capitalBack: true,
    badge: "Hourly",
    badgeColor: "bg-purple-500",
    popular: false
  },
  {
    id: "master",
    name: "Master",
    minInvestment: "$100000",
    maxInvestment: "$400000",
    roi: "25%",
    frequency: "Every Hour",
    duration: "Lifetime",
    totalReturn: "Lifetime Earning",
    capitalBack: true,
    badge: "Hourly",
    badgeColor: "bg-purple-500",
    popular: false
  },
  {
    id: "titan",
    name: "Titan",
    minInvestment: "$500000",
    maxInvestment: "$900000",
    roi: "30%",
    frequency: "Every Hour",
    duration: "Lifetime",
    totalReturn: "Lifetime Earning",
    capitalBack: true,
    badge: "Hourly",
    badgeColor: "bg-purple-500",
    popular: false
  },
  {
    id: "legend",
    name: "Legend",
    minInvestment: "$1000000",
    maxInvestment: "$1500000",
    roi: "40%",
    frequency: "Every Hour",
    duration: "Lifetime",
    totalReturn: "Lifetime Earning",
    capitalBack: true,
    badge: "Hourly",
    badgeColor: "bg-purple-500",
    popular: false
  },
  {
    id: "infinite",
    name: "Infinite",
    minInvestment: "$1500000",
    maxInvestment: "$2500000",
    roi: "50%",
    frequency: "Every Hour",
    duration: "Lifetime",
    totalReturn: "0%",
    capitalBack: true,
    badge: "High Return",
    badgeColor: "bg-yellow-500",
    popular: false
  }
];

const Plan = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-primary text-sm font-semibold mb-4 tracking-wider">INVEST OFFER</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Investment Plans</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help investors to define their new business objectives and grow their investments bigger.
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute top-0 left-0 right-0 ${plan.badgeColor} text-white text-center py-2 text-sm font-semibold`}>
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.badge ? 'pt-12' : 'pt-6'}`}>
                  <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Investment Range</div>
                    <div className="text-lg font-bold text-primary">
                      {plan.minInvestment} - {plan.maxInvestment}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">{plan.roi}</span>
                    <span className="text-muted-foreground">{plan.frequency}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Capital will back: {plan.capitalBack ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        Total {plan.totalReturn} + Capital
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full py-4 text-lg font-semibold ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    Invest Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">
              WHY CHOOSE US
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Investment is Safe With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure & Regulated</h3>
              <p className="text-muted-foreground">
                Your investments are protected by industry-leading security measures and regulatory compliance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Guaranteed Returns</h3>
              <p className="text-muted-foreground">
                We offer guaranteed returns on all our investment plans with transparent profit sharing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Fast Withdrawals</h3>
              <p className="text-muted-foreground">
                Get your profits quickly with our fast withdrawal system - some plans offer instant withdrawals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Investing?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            We're here to help. If there's anything you need, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-lg font-semibold"
            >
              Invest Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg font-semibold"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+12137274788</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@valora-capital.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Guildford, Surrey, Guildford, United Kingdom</span>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Useful Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <a href="/" className="block text-muted-foreground hover:text-primary transition-colors">Home</a>
                  <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors">About Us</a>
                  <a href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">Blog</a>
                  <a href="/faq" className="block text-muted-foreground hover:text-primary transition-colors">FAQ</a>
                </div>
                <div className="space-y-2">
                  <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</a>
                  <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Plan;
