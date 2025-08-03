import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/logo";

const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 max-w-7xl items-center">
      <Logo />
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center space-x-2">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </nav>
      </div>
    </div>
  </header>
);

export default Header;
