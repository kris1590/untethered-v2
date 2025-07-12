"use client";


import React from "react";

export function Hero() {
  const openLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.showModal();
    }
  };

  const openSignUpModal = () => {
    const modal = document.getElementById('signup-modal');
    if (modal) {
      modal.showModal();
    }
  };

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
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <button onClick={openLoginModal} className="btn btn-primary">Sign In</button>
              <button onClick={openSignUpModal} className="btn btn-primary">Sign Up</button>
            </div>
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
    </section>
  );
}
