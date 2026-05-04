import Link from "next/link";
"use client";

const Card = ({
  title,
  description,
  linkText,
  href,
}: {
  title: string;
  description: string;
  linkText: string;
  href: string;
}) => {
  return (
    // Agar aap yahan color change karenge, toh sabhi cards ka color badal jayega
    <div className="bg-slate-800 p-6 flex flex-wrap rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2 text-green-400">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <button  className="border bg-amber-100 rounded-md text-gray-600 mt-auto hover:underline">
        {linkText}
      </button>
    </div>
  );
};

import React, { useState, useEffect } from 'react';

// Define the shape of our slide data
interface Slide {
  id: number;
  title: string;
  bgColor: string;
}

const slides: Slide[] = [
  { id: 1, title: 'Slide 1: Welcome', bgColor: 'bg-blue-500' },
  { id: 2, title: 'Slide 2: Features', bgColor: 'bg-red-500' },
  { id: 3, title: 'Slide 3: Analytics', bgColor: 'bg-emerald-500' },
  { id: 4, title: 'Slide 4: Testimonials', bgColor: 'bg-amber-500' },
  { id: 5, title: 'Slide 5: Get Started', bgColor: 'bg-purple-500' },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Handle the 2-second automatic timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000); // 2000ms = 2 seconds

    // Cleanup interval on component unmount to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-xl shadow-2xl h-80">
        
        {/* Slides Track */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`w-full h-full flex-shrink-0 flex items-center justify-center ${slide.bgColor}`}
            >
              <h2 className="text-white text-4xl font-bold tracking-wider">
                {slide.title}
              </h2>
            </div>
          ))}
        </div>

        {/* Progress Indicators (Dots) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
const Product = () => {
  return (
    <div className="min-h-screen bg-yellow-100 text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Stationery</h1>
        <p className="text-lg text-gray-300 mb-8">
          Complete range of office and school supplies.
        </p>
        <Card
          title="Books"
          description="Complete range of office and school supplies."
          linkText="View Products &rarr;"
          href="/stationery"
        />

        <Card
          title="Pens"
          description="Fast assistance with forms, applications, and digital tasks."
          linkText="Learn More &rarr;"
          href="/janseva-kendr"
        />

        <Card
          title="Natraj Pencils"
          description="Reliable materials and great deals for your construction needs."
          linkText="Get a Quote &rarr;"
          href="/shuttering"
        />

        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
        <Card
          title="Cardboard"
          description="Professional sound and music for events and parties."
          linkText="Book Now &rarr;"
          href="/dj-services"
        />
      </div>
    </div>
  );
};

export default Product;
