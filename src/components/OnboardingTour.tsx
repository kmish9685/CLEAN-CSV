"use client";

import Joyride, { Step } from "react-joyride";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function OnboardingTour() {
  const [run, setRun] = useState(false);
  const { theme } = useTheme();

  // Start the tour automatically on component mount for demonstration
  useEffect(() => {
    setRun(true);
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
          primaryColor: '#29ABE2',
          // Adapt tooltip colors to the current theme
          arrowColor: theme === 'dark' ? '#333' : '#fff',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          textColor: theme === 'dark' ? '#fff' : '#333',
        },
      }}
      // This callback allows you to handle tour events, e.g. hiding it on finish/skip
      callback={({ status }) => {
        const finishedStatuses: string[] = ['finished', 'skipped'];
        if (finishedStatuses.includes(status)) {
          setRun(false);
        }
      }}
    />
  );
}
