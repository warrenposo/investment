import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, TrendingUp, DollarSign, BarChart3, Phone, Mail, MapPin } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Bitcoin ETF Approval: What It Means for Crypto Investors",
    excerpt: "The recent approval of Bitcoin ETFs by major financial institutions marks a significant milestone for cryptocurrency adoption. Here's how this development impacts your investment strategy.",
    content: "The approval of Bitcoin Exchange-Traded Funds (ETFs) represents a watershed moment for cryptocurrency adoption in traditional finance. Major institutions like BlackRock, Fidelity, and Grayscale have successfully launched Bitcoin ETFs, providing investors with regulated exposure to Bitcoin without the complexities of direct ownership. This development has several key implications for crypto investors: increased institutional adoption, improved liquidity, and enhanced price stability. The ETF approval also signals growing regulatory acceptance of cryptocurrencies, potentially paving the way for broader crypto integration in traditional investment portfolios.",
    author: "Sarah Johnson",
    date: "2025-10-10",
    readTime: "8 min read",
    category: "Crypto News",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=80",
    link: "https://www.google.com/search?q=Bitcoin+ETF+approval+crypto+investors+2024",
    featured: true
  },
  {
    id: 2,
    title: "Forex Trading Strategies: Mastering the Art of Currency Pairs",
    excerpt: "Discover proven forex trading strategies that professional traders use to navigate the volatile currency markets and maximize their profit potential.",
    content: "Successful forex trading requires a deep understanding of currency pair dynamics and proven strategies. The most effective approaches include trend following, where traders identify and ride established market trends using technical indicators like moving averages and momentum oscillators. Range trading is another popular strategy, particularly effective in sideways markets where currencies trade within predictable boundaries. Breakout trading focuses on identifying key support and resistance levels, entering positions when prices break through these critical points. Risk management is crucial across all strategies, with professional traders typically risking no more than 1-2% of their account balance per trade. Understanding fundamental analysis, including economic indicators, central bank policies, and geopolitical events, is equally important for long-term success in forex markets.",
    author: "Michael Chen",
    date: "2025-10-08",
    readTime: "12 min read",
    category: "Trading Strategies",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
    link: "https://www.google.com/search?q=forex+trading+strategies+currency+pairs+professional+traders",
    featured: false
  },
  {
    id: 3,
    title: "Ethereum 2.0: The Future of Decentralized Finance",
    excerpt: "Ethereum's transition to Proof-of-Stake consensus mechanism has revolutionized the DeFi ecosystem. Explore the implications for investors and developers.",
    content: "Ethereum's transition to Ethereum 2.0, now called the Ethereum Merge, represents one of the most significant upgrades in blockchain history. The shift from Proof-of-Work to Proof-of-Stake consensus mechanism has dramatically reduced energy consumption by 99.9%, making Ethereum more environmentally sustainable. This upgrade has also improved transaction processing capabilities and reduced fees through various scaling solutions like layer 2 protocols. For investors, Ethereum 2.0 introduces staking opportunities, allowing ETH holders to earn rewards by participating in network validation. The upgrade has strengthened Ethereum's position as the leading platform for decentralized applications (dApps), smart contracts, and DeFi protocols. As the ecosystem continues to evolve, Ethereum remains at the forefront of blockchain innovation, driving the future of decentralized finance.",
    author: "Emma Rodriguez",
    date: "2025-10-05",
    readTime: "10 min read",
    category: "Blockchain Technology",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
    link: "https://www.google.com/search?q=Ethereum+2.0+proof+of+stake+DeFi+future",
    featured: false
  },
  {
    id: 4,
    title: "Central Bank Digital Currencies (CBDCs): Reshaping Global Finance",
    excerpt: "Central banks worldwide are developing their own digital currencies. Understand how CBDCs will impact traditional banking and cryptocurrency markets.",
    content: "Central Bank Digital Currencies (CBDCs) represent a new form of digital money issued directly by central banks, combining the benefits of digital payments with the stability of traditional fiat currencies. Over 100 countries are currently exploring or developing CBDCs, with China's digital yuan, the European Central Bank's digital euro project, and the Federal Reserve's research into a digital dollar leading the way. CBDCs offer several advantages: instant settlement, reduced transaction costs, enhanced financial inclusion, and improved monetary policy transmission. However, they also raise concerns about privacy, financial stability, and the future of commercial banking. The implementation of CBDCs will likely coexist with cryptocurrencies rather than replace them, creating a more diverse digital financial ecosystem. Investors should monitor CBDC developments as they could significantly impact traditional banking, payment systems, and cryptocurrency adoption.",
    author: "David Thompson",
    date: "2025-10-03",
    readTime: "9 min read",
    category: "Financial Innovation",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&auto=format&fit=crop&q=80",
    link: "https://www.google.com/search?q=Central+Bank+Digital+Currencies+CBDC+global+finance",
    featured: false
  },
  {
    id: 5,
    title: "Risk Management in Cryptocurrency Trading: Essential Strategies",
    excerpt: "Learn how to protect your capital while trading cryptocurrencies with proven risk management techniques used by professional traders.",
    content: "Effective risk management is the cornerstone of successful cryptocurrency trading, given the market's inherent volatility and 24/7 nature. The most critical principle is position sizing, where traders should never risk more than 1-2% of their total portfolio on a single trade. Diversification across different cryptocurrencies, sectors, and timeframes helps spread risk and reduce correlation exposure. Stop-loss orders are essential for limiting downside risk, while take-profit orders help secure profits at predetermined levels. Technical analysis tools like support and resistance levels, trend lines, and momentum indicators provide entry and exit signals. Fundamental analysis, including project research, team evaluation, and market adoption metrics, helps identify long-term value. Emotional discipline is crucial; traders must stick to their strategies and avoid FOMO (Fear of Missing Out) or panic selling. Regular portfolio reviews and performance analysis help refine strategies and improve decision-making over time.",
    author: "Lisa Wang",
    date: "2025-10-01",
    readTime: "11 min read",
    category: "Risk Management",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    link: "https://www.google.com/search?q=cryptocurrency+trading+risk+management+strategies",
    featured: false
  },
  {
    id: 6,
    title: "The Rise of Decentralized Exchanges (DEXs): Trading Without Intermediaries",
    excerpt: "Decentralized exchanges are revolutionizing how we trade cryptocurrencies. Discover the benefits and challenges of peer-to-peer trading platforms.",
    content: "Decentralized exchanges (DEXs) have emerged as a revolutionary alternative to traditional centralized exchanges, enabling peer-to-peer cryptocurrency trading without intermediaries. Platforms like Uniswap, SushiSwap, and PancakeSwap have gained significant traction, offering users complete control over their funds and trading activities. DEXs operate on blockchain networks, primarily Ethereum, using smart contracts to facilitate trades automatically. Key advantages include enhanced security (no single point of failure), privacy (no KYC requirements), and censorship resistance. However, DEXs also face challenges such as higher transaction fees, slower execution speeds, and limited trading pairs compared to centralized alternatives. The emergence of Automated Market Makers (AMMs) has simplified liquidity provision, allowing users to earn fees by providing liquidity to trading pools. As blockchain technology advances and scaling solutions improve, DEXs are expected to play an increasingly important role in the future of cryptocurrency trading.",
    author: "James Wilson",
    date: "2025-09-28",
    readTime: "7 min read",
    category: "DeFi",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&auto=format&q=80",
    link: "https://www.google.com/search?q=decentralized+exchanges+DEX+Uniswap+cryptocurrency",
    featured: false
  }
];

const categories = [
  { name: "All", count: 6 },
  { name: "Crypto News", count: 1 },
  { name: "Trading Strategies", count: 1 },
  { name: "Blockchain Technology", count: 1 },
  { name: "Financial Innovation", count: 1 },
  { name: "Risk Management", count: 1 },
  { name: "DeFi", count: 1 }
];

const Blog = () => {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-primary text-sm font-semibold mb-4 tracking-wider">LATEST POSTS</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Read Our Blogs</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Valora Capital is a platform that funds skilled traders. Here's how it works in 3 simple steps
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Categories */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors">
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                  <CardDescription>
                    Get the latest trading insights delivered to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    />
                    <Button className="w-full">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && (
              <Card className="mb-12 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full overflow-hidden">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      <Badge variant="outline">{featuredPost.category}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <a href={featuredPost.link} target="_blank" rel="noopener noreferrer">
                      <Button className="flex items-center gap-2">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {/* Regular Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            We're here to help
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            If there's anything you need, please don't hesitate to contact us.
          </p>
          <Button 
            size="lg" 
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-lg font-semibold"
          >
            Contact Us
          </Button>
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
                  <a href="/about" className="block text-muted-foreground hover:text-primary transition-colors">About Us</a>
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

export default Blog;
