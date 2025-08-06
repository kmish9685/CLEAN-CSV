
"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/logo";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, Fragment } from "react";
import type { User } from "@supabase/supabase-js";
import { Menu, Transition } from '@headlessui/react'
import { CreditCardIcon, ArrowRightOnRectangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import HowItWorksModal from "./how-it-works-modal";

const UserMenu = ({ user }: { user: User }) => {
  const supabase = createClient();
  const signOut = async () => {
    await supabase.auth.signOut();
    // Redirect will be handled by auth listener
  };

  const getInitials = (email: string) => {
    if (!email) return "?";
    const parts = email.split("@");
    return parts[0][0].toUpperCase();
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-full text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/40x40.png`} alt={user.email || ""} data-ai-hint="person avatar" />
            <AvatarFallback>{user.email ? getInitials(user.email) : '?'}</AvatarFallback>
          </Avatar>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none">
          <div className="py-1">
             <div className="px-4 py-3">
                <p className="text-sm font-medium leading-none text-card-foreground">My Account</p>
                <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                {user.email}
                </p>
            </div>
             <Menu.Item>
                {({ active }) => (
                    <Link
                    href="/app"
                    className={`group flex w-full items-center px-4 py-2 text-sm ${active ? 'bg-secondary text-card-foreground' : 'text-card-foreground'}`}
                    >
                    <CreditCardIcon className="mr-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    Dashboard
                    </Link>
                )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                 <div className={`flex justify-between items-center px-4 py-2 text-sm ${active ? 'bg-secondary' : ''}`}>
                    <span className="text-card-foreground">Subscription</span>
                    <Badge variant="secondary">Free Plan</Badge>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/#pricing"
                  className={`group flex w-full items-center px-4 py-2 text-sm ${active ? 'bg-secondary text-card-foreground' : 'text-card-foreground'}`}
                >
                  <CreditCardIcon className="mr-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  Pricing
                </Link>
              )}
            </Menu.Item>
            <div className="py-1">
                 <Menu.Item>
                    {({ active }) => (
                        <button
                        onClick={signOut}
                        className={`group flex w-full items-center px-4 py-2 text-sm ${active ? 'bg-secondary text-card-foreground' : 'text-card-foreground'}`}
                        >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        Sign out
                        </button>
                    )}
                 </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
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
      if (event === 'SIGNED_OUT') {
        // hard reload to clear all state
        window.location.href = '/';
      }
      if (event === 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center">
          <Logo />
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" onClick={() => setIsHowItWorksOpen(true)}>
                <QuestionMarkCircleIcon className="mr-2 h-5 w-5"/> How It Works
            </Button>
              {loading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                     <Link href="/login?tab=signup">Sign Up</Link>
                  </Button>
                </>
              )}
          </nav>
        </div>
      </header>
      <HowItWorksModal isOpen={isHowItWorksOpen} setIsOpen={setIsHowItWorksOpen} />
    </>
  );
};

export default Header;
