import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FloatingPhone from "@/components/FloatingPhone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  DollarSign, 
  BarChart3, 
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <FloatingPhone />
      

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">
              WHY CHOOSE US
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Success is Our Priority
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                <Shield className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure & Regulated</h3>
              <p className="text-muted-foreground">
                Your investments are protected by industry-leading security measures and regulatory compliance.
              </p>
            </div>
            
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                <TrendingUp className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Guaranteed Returns</h3>
              <p className="text-muted-foreground">
                We offer guaranteed returns on all our investment plans with transparent profit sharing.
              </p>
            </div>
            
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                <Clock className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Fast Withdrawals</h3>
              <p className="text-muted-foreground">
                Get your profits quickly with our fast withdrawal system - some plans offer instant withdrawals.
              </p>
            </div>
            
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '1000ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                <Users className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Expert Support</h3>
              <p className="text-muted-foreground">
                Our team of experienced traders and support staff are available 24/7 to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">
              LATEST INSIGHTS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trading Blog & Insights
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Stay ahead of the markets with expert analysis, trading tips, and market insights from our team of professional traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className={`overflow-hidden hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">Market Analysis</Badge>
                <h3 className="text-xl font-bold mb-3">Understanding Forex Market Trends in 2024</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Discover the key trends shaping the forex market this year and how to capitalize on emerging opportunities.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>Sarah Johnson</span>
                  <span>Jan 15, 2024</span>
                  <span>5 min read</span>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                  Read More
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className={`overflow-hidden hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">Trading Tips</Badge>
                <h3 className="text-xl font-bold mb-3">Risk Management Strategies for New Traders</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Learn essential risk management techniques that every trader should implement to protect their capital.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>Michael Chen</span>
                  <span>Jan 12, 2024</span>
                  <span>7 min read</span>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                  Read More
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className={`overflow-hidden hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">Investment Strategy</Badge>
                <h3 className="text-xl font-bold mb-3">Building a Diversified Investment Portfolio</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Strategies for creating a well-balanced investment portfolio that can weather market volatility.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>David Thompson</span>
                  <span>Jan 8, 2024</span>
                  <span>8 min read</span>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                  Read More
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '1000ms' }}>
            <Link to="/blog">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200 hover:shadow-lg">
                Read All Articles
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">
              GET IN TOUCH
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Have questions about our investment plans or need assistance? Our support team is here to help you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                <Phone className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Phone</h3>
              <p className="text-muted-foreground mb-2">+12137274788</p>
              <p className="text-sm text-muted-foreground">24/7 Support Available</p>
            </div>
            
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                <Mail className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Email</h3>
              <p className="text-muted-foreground mb-2">info@valora-capital.com</p>
              <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
            </div>
            
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-300">
                <MapPin className="w-10 h-10 text-primary hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <p className="text-muted-foreground mb-2">London, England</p>
              <p className="text-sm text-muted-foreground">Founded in 2010</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of successful investors who trust Valora Capital with their financial future. 
              Start with as little as $500 and watch your money grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link to="/signin">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
