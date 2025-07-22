import React, { useState } from 'react';
import { assets } from '../assets/assets';

function About() {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (index) => {
    setActiveCard(activeCard === index ? null : index);
  };

  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt="About Us"
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p className="text-gray-800">
           Prescripto lets users quickly book appointments with specialized doctors.
           Browse by medical expertise, view doctor profiles, and choose time slots.
           No more long queues or waiting — healthcare is now just a click away.
          </p>
          <p>
            Doctors can log in to access a personalized dashboard showing upcoming appointments.
            They can mark appointments as complete or cancelled and manage their profiles.
            This panel simplifies patient tracking and enhances consultation management.
          </p>
          <b>Our Vision</b>
          <p>
            To revolutionize healthcare access through seamless digital solutions.
            We aim to connect patients and doctors with speed, trust, and simplicity.
            Prescripto envisions a future where healthcare is accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      <div className="text-xl my-10">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20 gap-4">
        {[ 
          {
            title: "Efficiency",
            description: "Streamlined appointment scheduling that fits into your busy lifestyle.",
          },
          {
            title: "Convenience",
            description: "Access to a network of trusted healthcare professionals in your area.",
          },
          {
            title: "Personalization",
            description: "Tailored recommendations and reminders to help you stay on top of your health.",
          }
        ].map((card, index) => (
          <div
            key={index}
            className={`
              border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]
              transition-all duration-300 text-gray-600 cursor-pointer
              hover:bg-[#5f6fff] hover:text-white
              ${activeCard === index ? 'bg-[#5f6fff] text-white' : ''}
            `}
            onClick={() => handleCardClick(index)}
          >
            <b>{card.title}:</b>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
