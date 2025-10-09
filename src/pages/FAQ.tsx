import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Shield, DollarSign, Clock, Users, TrendingUp } from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    icon: HelpCircle,
    questions: [
      {
        question: "What is Valora Capital and how does it work?",
        answer: "Valora Capital is a premier investment platform that funds skilled traders and provides guaranteed returns on investments. We operate on a simple 3-step process: 1) You choose an investment plan, 2) Our expert traders manage your funds using advanced algorithms and market analysis, 3) You receive guaranteed returns based on your chosen plan. We've been successfully operating since 2010, serving over 25,000 investors globally with an average investment of $12.5M."
      },
      {
        question: "How do I get started with Valora Capital?",
        answer: "Getting started is simple! First, create your account by clicking the 'LOGIN' button and selecting 'Create Account'. Complete the verification process with your government ID and proof of address. Then, choose from our 11 investment plans ranging from $100 to $2.5M. Once you've selected your plan and made your investment, our expert team begins managing your funds immediately. You'll receive daily updates on your investment performance."
      },
      {
        question: "What makes Valora Capital different from other investment platforms?",
        answer: "Valora Capital stands out through our guaranteed returns, expert management, and transparent operations. Unlike traditional investment platforms, we offer fixed ROI percentages that are guaranteed regardless of market conditions. Our team of professional traders uses advanced algorithms and 14+ years of market experience to ensure consistent returns. We also provide 24/7 customer support, instant withdrawals for premium plans, and complete transparency in all our operations."
      },
      {
        question: "Is my investment safe with Valora Capital?",
        answer: "Absolutely! Your investment is protected by multiple layers of security. We use industry-leading encryption, secure payment processing, and maintain strict regulatory compliance. All investments are backed by our capital guarantee, meaning your initial investment is always protected. We're a registered company operating under international financial regulations, and we maintain full transparency in all our operations. Your funds are never used for any purpose other than trading and generating your guaranteed returns."
      }
    ]
  },
  {
    title: "Investment Plans",
    icon: DollarSign,
    questions: [
      {
        question: "What investment plans does Valora Capital offer?",
        answer: "We offer 11 comprehensive investment plans to suit every investor: Starter ($100-$499, 1.9% daily), New Trader ($500-$999, 2% daily), Flex ($1,000-$2,500, 5% daily - Most Popular), Professional ($3,000-$4,999, 8.6% daily), Pro ($5,000-$9,999, 12% daily), Elite ($10,000-$30,000, 20% daily - Hot), Prime ($40,000-$90,000, 20% hourly), Master ($100,000-$400,000, 25% hourly), Titan ($500,000-$900,000, 30% hourly), Legend ($1M-$1.5M, 40% hourly), and Infinite ($1.5M-$2.5M, 50% hourly - High Return). Each plan includes capital back guarantee and lifetime earning options for higher tiers."
      },
      {
        question: "Are the returns really guaranteed?",
        answer: "Yes, absolutely! All our investment plans come with 100% guaranteed returns. Unlike traditional investments that depend on market performance, our returns are fixed and guaranteed regardless of market conditions. This is possible because we use our own capital to back all investments, ensuring that your returns are always paid on time. We've maintained a 100% payout record since 2010, serving over 25,000 successful investors."
      },
      {
        question: "What's the difference between daily and hourly plans?",
        answer: "Our plans are categorized by payment frequency: Daily plans (Starter to Elite) pay returns every 24 hours, perfect for steady income generation. Hourly plans (Prime to Infinite) pay returns every hour, providing maximum profit potential for high-net-worth investors. Hourly plans also offer lifetime earning opportunities, meaning you can continue earning even after your initial investment period ends. The higher the investment amount, the more frequent the payments and the higher the ROI percentage."
      },
      {
        question: "Can I upgrade or downgrade my investment plan?",
        answer: "Yes, you can upgrade your plan at any time by investing additional funds to reach the next tier. For example, if you start with the New Trader plan ($500-$999), you can upgrade to Flex ($1,000-$2,500) by adding the difference. Downgrading requires waiting for your current plan to complete before starting a new one at a lower tier. We recommend starting with a plan that matches your comfort level and gradually upgrading as you see the consistent returns."
      },
      {
        question: "What happens if I want to withdraw my capital?",
        answer: "Your capital is always protected and can be withdrawn according to your plan's terms. For most plans, capital is returned at the end of the investment period along with your profits. Premium plans (Prime and above) offer instant capital withdrawal options. We maintain a capital back guarantee, meaning your initial investment is always safe and will be returned to you as specified in your chosen plan's terms and conditions."
      }
    ]
  },
  {
    title: "Account & Security",
    icon: Shield,
    questions: [
      {
        question: "How do I create and verify my Valora Capital account?",
        answer: "Creating your account is quick and secure. Click the 'LOGIN' button and select 'Create Account'. You'll need to provide your full name, email address, phone number, and create a strong password. For verification, upload a clear photo of your government-issued ID (passport, driver's license, or national ID) and a recent utility bill or bank statement (not older than 3 months) as proof of address. Our verification process typically takes 24-48 hours, after which you can start investing immediately."
      },
      {
        question: "How secure is my personal and financial information?",
        answer: "Your security is our top priority. We use military-grade 256-bit SSL encryption to protect all data transmissions. Your personal information is stored on secure servers with multiple layers of protection, including firewalls, intrusion detection systems, and regular security audits. We never share your information with third parties without your explicit consent. All financial transactions are processed through secure, PCI-compliant payment gateways. We also offer two-factor authentication (2FA) for additional account security."
      },
      {
        question: "What happens if I forget my password or get locked out?",
        answer: "If you forget your password, click 'Forgot Password' on the login page and enter your registered email address. You'll receive a secure reset link within minutes. If you're locked out due to multiple failed login attempts, contact our 24/7 support team who can verify your identity and unlock your account immediately. For additional security, we recommend enabling two-factor authentication and using a strong, unique password."
      },
      {
        question: "Can I have multiple investment accounts?",
        answer: "Yes, you can have multiple investment accounts under the same verified identity. This is useful for diversifying your investments across different plans or managing separate investment goals. Each account operates independently with its own investment history and returns. However, all accounts must be verified with the same personal information and documents for security and regulatory compliance."
      }
    ]
  },
  {
    title: "Withdrawals & Payments",
    icon: Clock,
    questions: [
      {
        question: "How do I withdraw my profits and what are the processing times?",
        answer: "Withdrawing your profits is simple and fast. Log into your account dashboard, go to the 'Withdrawals' section, enter the amount, and select your preferred method. Processing times vary by plan: Premium plans (Prime and above) enjoy instant withdrawals, Professional plans process within 2-4 hours, while Standard plans process within 24 hours. We support multiple withdrawal methods including bank transfers, Bitcoin, Ethereum, USDT, and major e-wallets like PayPal, Skrill, and Neteller."
      },
      {
        question: "What payment methods can I use to invest?",
        answer: "We accept a wide range of payment methods for your convenience: Bank transfers (SWIFT/SEPA), Credit/Debit cards (Visa, Mastercard, American Express), Cryptocurrencies (Bitcoin, Ethereum, USDT, USDC), E-wallets (PayPal, Skrill, Neteller, Perfect Money), and Wire transfers. All payments are processed through secure, encrypted channels with instant confirmation. There are no hidden fees for deposits, and your investment is credited to your account immediately upon confirmation."
      },
      {
        question: "Are there any fees for withdrawals or deposits?",
        answer: "Deposits are completely free with no hidden charges. Withdrawal fees vary by method and plan: Premium plan holders (Prime and above) enjoy completely fee-free withdrawals on all methods. Standard plans have minimal fees: Bank transfers ($10), Cryptocurrency (0.5%), E-wallets ($5). We believe in transparent pricing, so all fees are clearly displayed before you confirm any transaction. We also cover all processing fees for withdrawals over $1,000."
      },
      {
        question: "What are the minimum and maximum withdrawal limits?",
        answer: "Minimum withdrawal amounts are: $50 for bank transfers, $20 for cryptocurrencies, and $25 for e-wallets. Maximum withdrawal limits depend on your plan: Starter plans can withdraw up to $5,000 per day, Professional plans up to $50,000 per day, and Premium plans have unlimited daily withdrawal limits. For larger withdrawals, we may require additional verification for security purposes. All limits can be increased upon request for verified high-net-worth investors."
      },
      {
        question: "How do I track my investment performance and returns?",
        answer: "You can track your investment performance in real-time through your personal dashboard. You'll receive daily email updates with your account balance, daily returns, and total profits. The dashboard shows detailed analytics including: Current balance, Total invested, Total returns, Daily profit/loss, Investment history, and Withdrawal history. Premium plan holders also receive personalized reports and can schedule calls with their dedicated account manager for detailed performance reviews."
      }
    ]
  },
  {
    title: "Support & Services",
    icon: Users,
    questions: [
      {
        question: "What customer support services does Valora Capital provide?",
        answer: "We provide comprehensive 24/7 customer support through multiple channels: Live chat (instant response), Email support (response within 2 hours), Phone support (+44 7848 179386), WhatsApp support, and Video call consultations for premium clients. Our multilingual support team speaks English, Spanish, French, German, Italian, Portuguese, and Arabic. We also offer dedicated account managers for Professional and Premium plan holders, providing personalized investment guidance and priority support."
      },
      {
        question: "Do you provide educational resources and trading insights?",
        answer: "Yes! We offer extensive educational resources to help you understand investing and market trends. Our resources include: Daily market analysis and insights, Weekly educational webinars, Comprehensive trading guides, Video tutorials, Market news and updates, and Personalized investment consultations. Our blog features expert articles on forex trading, cryptocurrency trends, and investment strategies. Premium clients also receive exclusive market reports and early access to new investment opportunities."
      },
      {
        question: "What additional services do Premium plan holders receive?",
        answer: "Premium plan holders (Prime and above) enjoy exclusive benefits: Dedicated personal account manager, Instant withdrawal processing, Fee-free transactions, Priority customer support, Exclusive investment opportunities, Personalized portfolio management, Weekly performance reviews, Advanced trading tools and analytics, VIP customer events, and Custom investment strategies. Our premium clients also receive invitations to exclusive networking events and early access to new platform features."
      },
      {
        question: "How can I contact Valora Capital for urgent matters?",
        answer: "For urgent matters, we recommend using our priority support channels: Phone: +44 7848 179386 (24/7), WhatsApp: +44 7848 179386 (instant messaging), Live chat on our website (immediate response), or Email: info@valora-capital.com (marked as 'URGENT'). Premium plan holders have access to a dedicated emergency hotline for immediate assistance. Our support team is trained to handle all types of inquiries, from technical issues to investment questions, ensuring you receive the help you need when you need it."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-primary text-sm font-semibold mb-4 tracking-wider">HELP & SUPPORT</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our investment platform, services, and trading opportunities.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {faqCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>
                      {category.questions.length} questions
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-3xl font-bold mb-8 text-center">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border border-border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                        <span className="font-semibold">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Can't find the answer you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-6 text-lg font-semibold">
              Contact Support
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold">
              Live Chat
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-3xl font-bold mb-2">25,000+</p>
              <p className="opacity-90">Happy Investors</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
              <p className="text-3xl font-bold mb-2">$12.5M</p>
              <p className="opacity-90">Average Investment</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
              <p className="text-3xl font-bold mb-2">24/7</p>
              <p className="opacity-90">Support Available</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <p className="text-3xl font-bold mb-2">200+</p>
              <p className="opacity-90">Countries Served</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
