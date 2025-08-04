"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/landing/logo";
import Link from "next/link";

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <Logo />
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p className="text-center sm:text-left">
            {year ? `© ${year} CleanCSV. All rights reserved.` : `© CleanCSV. All rights reserved.`}
            </p>
            <div className="flex gap-4">
                <Link href="https://kickvibe.site/terms-and-condition" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    Terms & Conditions
                </Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
