import { ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartInvestment = () => {
    navigate('/signin');
  };

  return (
    <section 
      className="relative w-full min-h-[500px] flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-background/80" />
      
      <div className={`relative z-10 text-center px-6 max-w-4xl transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <p className="text-primary text-sm font-semibold mb-4 tracking-wider animate-pulse">Crypto INVESTMENTS</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-6"> BIG PROFITS</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A Profitable platform for high-margin investment. We accumulate traders like you to leverage investment and make big profits.
        </p>
        <Button 
          onClick={handleStartInvestment}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-full text-lg hover:scale-105 transition-transform duration-200 hover:shadow-lg"
        >
          Start Your Investment
        </Button>
      </div>

      {/* Stats Section */}
      <div className={`relative z-10 mt-16 w-full max-w-6xl px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '500ms' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center hover:scale-105 transition-transform duration-300">
            <p className="text-4xl md:text-5xl font-bold text-primary mb-2">25000+</p>
            <p className="text-muted-foreground">All Members</p>
          </div>
          <div className="text-center hover:scale-105 transition-transform duration-300">
            <p className="text-4xl md:text-5xl font-bold text-primary mb-2">12.5M</p>
            <p className="text-muted-foreground">Average Investment</p>
          </div>
          <div className="text-center hover:scale-105 transition-transform duration-300">
            <p className="text-4xl md:text-5xl font-bold text-primary mb-2">200</p>
            <p className="text-muted-foreground">Countries Supported</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
