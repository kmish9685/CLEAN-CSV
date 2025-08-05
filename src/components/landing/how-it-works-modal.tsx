
"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UploadCloud, Wand2, Download } from 'lucide-react';
import { Button } from '../ui/button';

const steps = [
  {
    icon: UploadCloud,
    title: "1. Upload Your CSV",
    description: "Drag and drop your messy CSV file into the upload area, or click to select it from your computer. We support files up to 10MB.",
  },
  {
    icon: Wand2,
    title: "2. Choose Cleaning Options",
    description: "Select from our pre-built templates for common tasks, use AI-powered suggestions, or pick from custom cleanup rules like removing duplicates and trimming whitespace.",
  },
  {
    icon: Download,
    title: "3. Process & Download",
    description: "Click 'Process File' to see a preview of the cleaned data. Once you're happy with the result, hit 'Download' to get your perfectly formatted CSV.",
  },
];

type HowItWorksModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function HowItWorksModal({ isOpen, setIsOpen }: HowItWorksModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-card text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="p-6 sm:p-8">
                    <Dialog.Title as="h3" className="font-headline text-2xl font-semibold leading-6 text-foreground text-center">
                        How It Works
                    </Dialog.Title>
                    <p className="mt-2 text-center text-muted-foreground">A simple, three-step process to clean data.</p>
                    <div className="mt-8 grid grid-cols-1 gap-8">
                        {steps.map((step) => (
                        <div key={step.title} className="flex items-start gap-4">
                            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <step.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div>
                                <h4 className="font-headline text-lg font-semibold text-foreground">{step.title}</h4>
                                <p className="mt-1 text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="bg-secondary px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button onClick={() => setIsOpen(false)}>
                    Got it, thanks!
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
