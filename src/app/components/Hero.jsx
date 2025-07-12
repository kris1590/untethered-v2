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
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-8xl">
              Empower Your Team, Achieve Your Goals
            </h1>
            <p className="md:text-md">
              Welcome to our platform, where collaboration meets productivity.
              Join us in transforming how your team connects and grows together.
            </p>
            {!user ? (
              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                <button onClick={() => setIsLoginOpen(true)} className="btn btn-primary">Sign In</button>
                <button onClick={() => setIsSignUpOpen(true)} className="btn btn-primary">Sign Up</button>
              </div>
            ) : null}
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full rounded-image object-cover"
              alt="Relume placeholder image"
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
