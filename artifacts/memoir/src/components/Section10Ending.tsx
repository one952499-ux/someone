import React, { useState } from 'react';
import { useCreateMessage, useGetMessageCount } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    question: "Would you like to know who I am?",
    options: ["Yes 😊", "Maybe 🤔", "Not really 😅"]
  },
  {
    id: 2,
    question: "Do you think you've seen me before?",
    options: ["Definitely", "Maybe", "I don't think so"]
  },
  {
    id: 3,
    question: "If you had to choose one:",
    options: [
      "I want to know more",
      "I'm curious who you are",
      "This was sweet",
      "I don't know what to think yet"
    ]
  }
];

export function Section10Ending() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const { data: countData, refetch: refetchCount } = useGetMessageCount();
  const createMessage = useCreateMessage();

  const handleOptionSelect = (option: string) => {
    const questionObj = QUESTIONS[currentStep];
    const formattedContent = `Q${questionObj.id}: ${questionObj.question}\n-> ${option}`;

    // Submit answer instantly in the background
    createMessage.mutate(
      { data: { content: formattedContent, name: null } },
      {
        onSuccess: () => {
          refetchCount();
        },
        onError: () => {
          toast({
            title: "Connection Alert",
            description: "Could not sync your answer to the database, but continuing...",
            variant: "destructive"
          });
        }
      }
    );

    // snappily move to next question/screen
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(QUESTIONS.length); // Transition to success step
    }
  };

  return (
    <section id="section-ending"
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #0f0008, #080005)' }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(244,63,142,0.07) 0%, transparent 100%)' }} />
        {[...Array(16)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${Math.floor(i % 3 + 1) * 1.5}px`,
              height: `${Math.floor(i % 3 + 1) * 1.5}px`,
              left: `${(i * 6.25) % 100}%`,
              top: `${Math.sin(i) * 40 + 50}%`,
              background: 'rgba(253,164,175,0.35)',
              boxShadow: '0 0 4px rgba(244,63,142,0.4)',
              animation: `glow-pulse ${2 + (i % 4) * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.45em] mb-6"
            style={{ color: 'rgba(244,63,142,0.4)' }}>confessions</p>
          <h2 className="font-serif mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fdf2f8' }}>
            If you want to say something,<br />
            <span className="italic" style={{ color: '#fda4af' }}>I'm listening.</span>
          </h2>
          {countData && (
            <p className="font-mono text-xs mt-3" style={{ color: 'rgba(244,63,142,0.4)' }}>
              {countData.count} {countData.count === 1 ? 'thought' : 'thoughts'} left here
            </p>
          )}
        </div>

        <div className="min-h-[340px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {currentStep >= QUESTIONS.length ? (
              <motion.div key="success" className="text-center py-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.1 } }}>
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(244,63,142,0.1)', border: '1px solid rgba(244,63,142,0.3)' }}>
                  <div className="w-2 h-2 rounded-full"
                    style={{ background: '#f43f8e', boxShadow: '0 0 15px rgba(244,63,142,0.9)' }} />
                </div>
                <p className="font-serif text-2xl mb-3" style={{ color: '#fda4af' }}>Answers Received. 🌸</p>
                <p className="font-sans text-xs" style={{ color: 'rgba(253,164,175,0.35)' }}>Thank you for sharing your thoughts.</p>
              </motion.div>
            ) : (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-2">
                  <span className="font-mono text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(244,63,142,0.06)', color: 'rgba(244,63,142,0.6)', border: '1px solid rgba(244,63,142,0.1)' }}>
                    Question {currentStep + 1} of {QUESTIONS.length}
                  </span>
                  <h3 className="font-serif text-xl text-white/90 mt-5 leading-relaxed">
                    {QUESTIONS[currentStep].question}
                  </h3>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  {QUESTIONS[currentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className="w-full text-center py-4 px-6 rounded-2xl font-sans text-sm transition-all duration-300 border focus:outline-none"
                      style={{
                        background: 'rgba(244,63,142,0.03)',
                        borderColor: 'rgba(244,63,142,0.12)',
                        color: '#fda4af',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,142,0.08)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,142,0.4)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(244,63,142,0.1)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,142,0.03)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,142,0.12)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '';
                        (e.currentTarget as HTMLElement).style.transform = '';
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 mt-24 text-center">
        <div className="h-[1px] w-32 mx-auto mb-12"
          style={{ background: 'linear-gradient(to right, transparent, rgba(244,63,142,0.35), transparent)' }} />
        <p className="font-cursive text-lg" style={{ color: 'rgba(253,164,175,0.25)' }}>with love, anonymously.</p>
      </div>
    </section>
  );
}
