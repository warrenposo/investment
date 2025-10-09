import iconExpert from "@/assets/icon-expert.png";
import iconRegistered from "@/assets/icon-registered.png";
import iconSecure from "@/assets/icon-secure.png";
import iconVerified from "@/assets/icon-verified.png";
import iconWithdrawal from "@/assets/icon-withdrawal.png";
import iconSupport from "@/assets/icon-support.png";

const features = [
  {
    icon: iconExpert,
    title: "Expert Management",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: iconRegistered,
    title: "Registered Company",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: iconSecure,
    title: "Secure Investment",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: iconVerified,
    title: "Verified Security",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: iconWithdrawal,
    title: "Instant Withdrawal",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  },
  {
    icon: iconSupport,
    title: "24/7 Support",
    description: "Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create."
  }
];

const Features = () => {
  return (
    <>
      {/* About Us Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold mb-2 tracking-wider">ABOUT US</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Valora Capital</h2>
          </div>
          
          <div className="prose prose-invert max-w-4xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-6">
              At Valora Capital, we know what it's like to trade. With the scale of a global fintech and the agility of a start-up, we're here to arm you with everything you need to take on the global markets with confidence.
            </p>
            <p className="text-lg text-muted-foreground">
              Valora Capital was founded in 2010 in London, England by a team of experienced traders with a shared commitment to improve the world of online trading. Frustrated by delayed executions, expensive prices and poor customer support, we set out to provide traders around the world with superior technology, low-cost spreads and a genuine commitment to helping them master the trade.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">
              CHOOSE INVESTMENT
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why You Should Our Plans
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              At Valora Capital, we don't just offer an opportunity — we offer a pathway 
              to real financial growth, backed by transparency, performance, and community trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-background border border-border rounded-lg p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="w-20 h-20 mb-6 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors">
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
