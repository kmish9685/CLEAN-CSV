"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/landing/logo";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {year} CleanCSV. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
