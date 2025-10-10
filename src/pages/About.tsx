import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle, 
  Star,
  Mail,
  Phone,
  MapPin,
  Award,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";

// Candlestick Chart Component
interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
}

const CandlestickChart = () => {
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.2345);
  const [priceChange, setPriceChange] = useState(0.0012);

  useEffect(() => {
    // Generate initial candlestick data
    const generateCandlestickData = () => {
      const data: CandlestickData[] = [];
      let basePrice = 1.2345;
      
      for (let i = 0; i < 50; i++) {
        const open = basePrice;
        const volatility = 0.01;
        const high = open + Math.random() * volatility;
        const low = open - Math.random() * volatility;
        const close = low + Math.random() * (high - low);
        const volume = Math.random() * 1000000;
        
        data.push({
          open,
          high,
          low,
          close,
          volume,
          time: `${9 + Math.floor(i / 10)}:${(i % 10) * 6}`.padStart(2, '0')
        });
        
        basePrice = close;
      }
      
      return data;
    };

    setCandlestickData(generateCandlestickData());

    // Animate the chart
    const interval = setInterval(() => {
      setCandlestickData(prev => {
        const newData = [...prev.slice(1)];
        const lastCandle = prev[prev.length - 1];
        
        if (lastCandle) {
          const open = lastCandle.close;
          const volatility = 0.005;
          const high = open + Math.random() * volatility;
          const low = open - Math.random() * volatility;
          const close = low + Math.random() * (high - low);
          const volume = Math.random() * 1000000;
          
          newData.push({
            open,
            high,
            low,
            close,
            volume,
            time: new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })
          });
          
          setCurrentPrice(close);
          setPriceChange(close - open);
        }
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMinPrice = () => Math.min(...candlestickData.map(d => d.low));
  const getMaxPrice = () => Math.max(...candlestickData.map(d => d.high));
  const minPrice = getMinPrice();
  const maxPrice = getMaxPrice();
  const priceRange = maxPrice - minPrice || 0.01;

  const getMaxVolume = () => Math.max(...candlestickData.map(d => d.volume));
  const maxVolume = getMaxVolume();

  return (
    <div className="relative">
      {/* Main Chart Container */}
      <div className="w-full h-96 bg-gray-900 rounded-lg border-2 border-primary/30 overflow-hidden relative">
        {/* Chart Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#6b7280" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Price Scale */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-800/50 flex flex-col justify-between py-4 text-xs text-gray-300 font-mono">
          <div className="text-right pr-2">{maxPrice.toFixed(4)}</div>
          <div className="text-right pr-2">{((maxPrice + minPrice) / 2).toFixed(4)}</div>
          <div className="text-right pr-2">{minPrice.toFixed(4)}</div>
        </div>

        {/* Volume Scale */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gray-800/50 flex flex-col justify-between py-4 text-xs text-gray-300 font-mono">
          <div className="text-left pl-2">{(maxVolume / 1000000).toFixed(1)}M</div>
          <div className="text-left pl-2">{(maxVolume / 2000000).toFixed(1)}M</div>
          <div className="text-left pl-2">0</div>
        </div>

        {/* Candlestick Chart */}
        <div className="absolute inset-0 pl-16 pr-16 pt-4 pb-4">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {candlestickData.map((candle, index) => {
              const x = (index / (candlestickData.length - 1)) * 400;
              const isBullish = candle.close > candle.open;
              const bodyHeight = Math.abs(candle.close - candle.open) / priceRange * 180;
              const bodyY = 200 - ((candle.close - minPrice) / priceRange * 180) - (isBullish ? 0 : bodyHeight);
              const wickTop = 200 - ((candle.high - minPrice) / priceRange * 180);
              const wickBottom = 200 - ((candle.low - minPrice) / priceRange * 180);
              const volumeHeight = (candle.volume / maxVolume) * 50;
              const volumeY = 200 - volumeHeight;

              return (
                <g key={index}>
                  {/* Volume Bars */}
                  <rect
                    x={x - 2}
                    y={volumeY}
                    width="4"
                    height={volumeHeight}
                    fill={isBullish ? "#10b981" : "#ef4444"}
                    opacity="0.3"
                  />
                  
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={wickTop}
                    x2={x}
                    y2={wickBottom}
                    stroke="#6b7280"
                    strokeWidth="1"
                  />
                  
                  {/* Body */}
                  <rect
                    x={x - 3}
                    y={bodyY}
                    width="6"
                    height={Math.max(bodyHeight, 1)}
                    fill={isBullish ? "#10b981" : "#ef4444"}
                    stroke={isBullish ? "#10b981" : "#ef4444"}
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chart Labels */}
        <div className="absolute top-4 left-20 text-green-400 text-sm font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>
        
        <div className="absolute top-4 right-20 text-white text-sm font-mono">
          <div className="flex items-center gap-2">
            <span>EUR/USD</span>
            <span className={priceChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 left-20 text-blue-400 text-xs font-mono">
          VALORA CAPITAL
        </div>
        
        <div className="absolute bottom-4 right-20 text-gray-400 text-xs font-mono">
          {currentPrice.toFixed(4)}
        </div>

        {/* Time Scale */}
        <div className="absolute bottom-0 left-16 right-16 h-6 bg-gray-800/30 flex justify-between items-center text-xs text-gray-400 font-mono px-2">
          <span>09:00</span>
          <span>12:00</span>
          <span>15:00</span>
          <span>18:00</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-900 rounded-lg border-2 border-primary/30 overflow-hidden">
        <div className="w-full h-full p-2">
          <svg className="w-full h-full" viewBox="0 0 60 40">
            {candlestickData.slice(-10).map((candle, index) => {
              const x = (index / 9) * 60;
              const isBullish = candle.close > candle.open;
              const bodyHeight = Math.abs(candle.close - candle.open) / priceRange * 30;
              const bodyY = 40 - ((candle.close - minPrice) / priceRange * 30) - (isBullish ? 0 : bodyHeight);
              
              return (
                <rect
                  key={index}
                  x={x - 1}
                  y={bodyY}
                  width="2"
                  height={Math.max(bodyHeight, 0.5)}
                  fill={isBullish ? "#10b981" : "#ef4444"}
                />
              );
            })}
          </svg>
        </div>
        <div className="absolute top-1 left-1 text-green-400 text-xs">●</div>
      </div>

      {/* Pulsing Effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-primary/20 animate-pulse"></div>
    </div>
  );
};

const features = [
  {
    icon: Users,
    title: "Expert Management",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: Award,
    title: "Registered Company",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: Shield,
    title: "Secure Investment",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: CheckCircle,
    title: "Verified Security",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: Zap,
    title: "Instant Withdrawal",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: Award,
    title: "Registered Company",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  }
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-primary text-sm font-semibold mb-4 tracking-wider">CHOOSE INVESTMENT</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Why You Should Our Plans</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            At Valora Capital, we don't just offer an opportunity — we offer a pathway to real financial growth, 
            backed by transparency, performance, and community trust.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`group bg-background border border-border rounded-lg p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-20 h-20 mb-6 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <p className="text-primary text-sm font-semibold mb-2 tracking-wider">ABOUT US</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Valora Capital</h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  At Valora Capital, we know what it's like to trade. With the scale of a global fintech and the agility of a start-up, 
                  we're here to arm you with everything you need to take on the global markets with confidence.
                </p>
                <p className="text-lg text-muted-foreground">
                  Valora Capital was founded in 2010 in London, England by a team of experienced traders with a shared commitment to improve 
                  the world of online trading. Frustrated by delayed executions, expensive prices and poor customer support, we set out 
                  to provide traders around the world with superior technology, low-cost spreads and a genuine commitment to helping them master the trade.
                </p>
              </div>
            </div>

            {/* Candlestick Chart Animation */}
            <div className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`} style={{ transitionDelay: '300ms' }}>
              <CandlestickChart />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className={`transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-2">25,000+</p>
              <p className="text-muted-foreground">Happy Traders</p>
            </div>
            
            <div className={`transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-2">$12.5M</p>
              <p className="text-muted-foreground">Trading Volume</p>
            </div>
            
            <div className={`transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-2">14+</p>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
            
            <div className={`transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-2">200+</p>
              <p className="text-muted-foreground">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Subscribe to Newsletter
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              TO GET EXCLUSIVE BENEFITS
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-primary-foreground text-primary border-primary-foreground placeholder:text-primary/60"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 font-semibold"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Phone</h3>
              <p className="text-muted-foreground mb-2">+12137274788</p>
              <p className="text-sm text-muted-foreground">24/7 Support Available</p>
            </div>
            
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Email</h3>
              <p className="text-muted-foreground mb-2">info@valora-capital.com</p>
              <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
            </div>
            
            <div className={`text-center transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <p className="text-muted-foreground mb-2">London, England</p>
              <p className="text-sm text-muted-foreground">Founded in 2010</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
