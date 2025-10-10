import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full relative z-40">
      {/* Top bar */}
      <div className="bg-secondary py-2 px-6 border-b border-border">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <a href="mailto:info@valora-capital.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" />
              <span>info@valora-capital.com</span>
            </a>
            <a href="tel:+12137274788" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span>+12137274788</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">English</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-background py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold">
              VC
            </div>
            <span className="text-xl font-bold">
              Valora <span className="text-primary">Capital</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`transition-colors font-medium ${
                isActive("/") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              HOME
            </Link>
            <Link 
              to="/plan" 
              className={`transition-colors font-medium ${
                isActive("/plan") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              PLAN
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors font-medium ${
                isActive("/about") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              ABOUT US
            </Link>
            <Link 
              to="/blog" 
              className={`transition-colors font-medium ${
                isActive("/blog") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              BLOG
            </Link>
            <Link 
              to="/faq" 
              className={`transition-colors font-medium ${
                isActive("/faq") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors font-medium ${
                isActive("/contact") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              CONTACT
            </Link>
          </div>

              <Link to="/signin">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-full">
                  LOGIN
                </Button>
              </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
