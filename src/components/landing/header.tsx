
"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/logo";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { CreditCard, LogOut, User as UserIcon, HelpCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const UserMenu = ({ user }: { user: User }) => {
  const supabase = createClient();
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getInitials = (email: string) => {
    if (!email) return "?";
    const parts = email.split("@");
    return parts[0][0].toUpperCase();
  }

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/40x40.png`} alt={user.email || ""} data-ai-hint="person avatar" />
            <AvatarFallback>{user.email ? getInitials(user.email) : <UserIcon />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">My Account</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
         <DropdownMenuItem className="cursor-pointer">
            <div className="w-full flex justify-between items-center">
                <span>Subscription</span>
                <Badge variant="secondary">Free Plan</Badge>
            </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/#pricing">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Pricing</span>
            </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if(event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // You can add a redirect or other logic here if needed
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <Logo />
        <nav className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" asChild>
                <Link href="/#solution"><HelpCircle className="mr-2 h-4 w-4"/> How It Works</Link>
            </Button>
            {loading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                   <Link href="/login">Sign Up</Link>
                </Button>
              </>
            )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
