import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  Users,
  Shield,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import emailService from "@/services/emailService";
import type { ContactFormData } from "@/services/emailService";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const contactData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      };

      const success = await emailService.sendContactEmail(contactData);
      
      if (success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "24/7 Professional Support",
      contact: "+44 7848 179386",
      availability: "Available 24/7",
      color: "text-green-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed responses",
      contact: "info@valora-capital.com",
      availability: "Response within 2 hours",
      color: "text-blue-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant assistance",
      contact: "Available on website",
      availability: "24/7 Instant response",
      color: "text-purple-500"
    },
    {
      icon: MapPin,
      title: "Office Location",
      description: "Visit our headquarters",
      contact: "London, England",
      availability: "Founded in 2010",
      color: "text-red-500"
    }
  ];

  const supportFeatures = [
    {
      icon: Users,
      title: "Expert Team",
      description: "14+ years of market experience"
    },
    {
      icon: Shield,
      title: "Secure Communication",
      description: "256-bit SSL encrypted channels"
    },
    {
      icon: TrendingUp,
      title: "Investment Guidance",
      description: "Personalized portfolio advice"
    },
    {
      icon: CheckCircle,
      title: "Quick Response",
      description: "Average response time: 2 hours"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-primary text-sm font-semibold mb-4 tracking-wider">GET IN TOUCH</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Valora Capital</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're here to help you succeed in your investment journey. Reach out to our expert team for personalized guidance and support.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={index} 
                  className={`text-center hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className={`w-8 h-8 ${method.color}`} />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg mb-2">{method.contact}</p>
                    <p className="text-sm text-muted-foreground">{method.availability}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 2 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+44 123 456 7890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Investment inquiry"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                      <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span>Message sent successfully! We'll get back to you within 2 hours.</span>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <span>Failed to send message. Please try again or contact us directly.</span>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Why Choose Valora Capital?</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    With over 14 years of experience and 25,000+ successful investors, we're committed to helping you achieve your financial goals through expert guidance and proven investment strategies.
                  </p>
                </div>

                <div className="space-y-6">
                  {supportFeatures.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Clock className="w-8 h-8" />
                      <div>
                        <h3 className="text-xl font-bold mb-2">24/7 Support Available</h3>
                        <p className="opacity-90">
                          Our expert team is always ready to assist you with any questions or concerns about your investments.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours & Additional Info */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Clock className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Monday - Friday:</strong></p>
                  <p>9:00 AM - 6:00 PM GMT</p>
                  <p className="mt-4"><strong>Saturday:</strong></p>
                  <p>10:00 AM - 4:00 PM GMT</p>
                  <p className="mt-4"><strong>Sunday:</strong></p>
                  <p>Emergency Support Only</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle>Support Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>English</p>
                  <p>Spanish</p>
                  <p>French</p>
                  <p>German</p>
                  <p>Italian</p>
                  <p>Portuguese</p>
                  <p>Arabic</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>256-bit SSL Encryption</p>
                  <p>PCI Compliant Processing</p>
                  <p>GDPR Compliant</p>
                  <p>Secure Data Storage</p>
                  <p>Two-Factor Authentication</p>
                  <p>Regular Security Audits</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of successful investors who trust Valora Capital with their financial future. 
            Get started with as little as $100 and watch your money grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-lg font-semibold"
            >
              View Investment Plans
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg font-semibold"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
