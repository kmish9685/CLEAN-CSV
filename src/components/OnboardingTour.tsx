"use client";

import Joyride, { Step } from "react-joyride";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function OnboardingTour() {
  const [run, setRun] = useState(false);
  const { resolvedTheme } = useTheme();

  // Start the tour automatically on component mount for demonstration
  useEffect(() => {
    // In a real app, you'd check a user property from Supabase
    // to see if they've completed the tour before setting run to true.
    const hasCompletedTour = localStorage.getItem('onboarding_complete');
    if (!hasCompletedTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: "#upload-area",
      content: "Start here! Drag and drop your CSV file or click to upload.",
      disableBeacon: true,
    },
    {
      target: "#process-button",
      content: "After choosing your cleaning options, click here to process the file.",
    },
    {
      target: "#download-button",
      content: "Your cleaned file will be ready to download from here.",
    },
    {
      target: "#faq",
      content: "Have questions? Check out our FAQ section for answers.",
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'hsl(var(--primary))',
          arrowColor: resolvedTheme === 'dark' ? '#333' : '#fff',
          backgroundColor: resolvedTheme === 'dark' ? '#333' : '#fff',
          textColor: resolvedTheme === 'dark' ? '#fff' : '#333',
        },
      }}
      callback={({ status }) => {
        const finishedStatuses: string[] = ['finished', 'skipped'];
        if (finishedStatuses.includes(status)) {
          setRun(false);
          // Mark tour as complete in local storage
          localStorage.setItem('onboarding_complete', 'true');
        }
      }}
    />
  );
}
