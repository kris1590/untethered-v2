"use client";

import React, { useState } from "react";
import LoginModal from "./auth/LoginModal";
import SignUpModal from "./auth/SignUpModal";
import { useAuth } from "../../lib/auth-context";

export function Hero() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-12 md:py-20 h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
          {/* Left - Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary dark:text-accent leading-tight tracking-tight">
              Empower Your Team,<br /> Elevate Your Brotherhood
            </h1>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              Welcome to Untethered, a place where connection meets growth.<br />
              Join a community built on trust, honesty, and purpose—where every member helps shape the culture.
            </p>
            {!user && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-8 py-3 rounded-full bg-accent text-primary font-semibold shadow hover:shadow-md transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUpOpen(true)}
                  className="px-8 py-3 rounded-full border border-accent text-accent font-semibold bg-white dark:bg-slate-800 hover:bg-accent/10 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          {/* Right - Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              alt="Untethered community"
              className="w-full max-w-md rounded-2xl shadow-lg object-cover bg-slate-100 dark:bg-slate-800"
            />
          </div>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </section>
  );
}
