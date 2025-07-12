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
    <div
      className="
        hero min-h-screen
        bg-contain bg-center
        md:bg-contain md:bg-center
        relative
      "
      style={{
        backgroundImage: "url(/logo.png)", // Use your generated image filename
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="hero-content text-neutral-content text-center relative z-10 flex flex-col items-center">
        <div className="">
          <h1 className="mb-5 text-5xl font-bold">
            Empower Your Team,<br />
            <span className="text-blue-400">Elevate Your Brotherhood</span>
          </h1>
          <p className="mb-5 max-w-xl">
            Welcome to Untethered, a place where connection meets growth.
            Join a community built on trust, honesty, and purpose—where every
            member helps shape the culture.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsSignUpOpen(true)}
                className="btn btn-primary"
              >
                Get Started
              </button>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn btn-outline"
              >
                Sign In
              </button>
            </div>
          )}
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
    </div>
  );
}
