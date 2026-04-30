import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      {/* Hero Section - Gradient Fade */}
<section className="bg-linear-to-b from-blue-700 via-blue-800 to-slate-900 text-white pt-16 pb-8 px-5 text-center md:py-20 md:bg-blue-600 md:bg-none">
  
  {/* Little welcome badge */}
  <div className="inline-block bg-blue-500/20 text-blue-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-500/30">
    Welcome to
  </div>

  {/* Adjusted text sizing and forced a line break on mobile so it fits perfectly */}
  <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
    S K Stationary <br className="md:hidden" /> & Janseva Kendr
  </h1>
  
  <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
    Your one-stop destination for stationery, digital services, commercial shuttering, and DJ setups.
  </p>
</section>

      {/* Services Grid */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10 text-white">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1: Stationery */}
          <div className="bg-slate-800 p-6 flex flex-col rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2 text-green-600">Stationery</h3>
            <p className="text-gray-400 mb-4">Complete range of office and school supplies.</p>
            <Link href="/stationery" className="text-blue-400 mt-auto hover:underline">View Products &rarr;</Link>
          </div>

          {/* Card 2: Janseva Kendr */}
          <div className="bg-slate-800 p-6 rounded-lg flex flex-col shadow-md">
            <h3 className="text-xl font-bold mb-2 text-green-600 flex flex-col">Online Services</h3>
            <p className="text-gray-400 mb-4">Fast assistance with forms, applications, and digital tasks.</p>
            <Link href="/janseva-kendr" className="text-blue-400 mt-auto hover:underline">Learn More &rarr;</Link>
          </div>

          {/* Card 3: Shuttering */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold mb-2 flex flex-col text-green-600">Commercial Shuttering</h3>
            <p className="text-gray-400 mb-4">Reliable materials and great deals for your construction needs.</p>
            <Link href="/shuttering" className="text-blue-400 mt-auto hover:underline">Get a Quote &rarr;</Link>
          </div>

          {/* Card 4: DJ Services */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold flex flex-col mb-2 text-green-600">DJ Services</h3>
            <p className="text-gray-400 mb-4">Professional sound and music for events and parties.</p>
            <Link href="/dj-services" className="text-blue-400 mt-auto hover:underline">Book Now &rarr;</Link>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-slate-950 px-4 text-center">
        <h2 className="text-xl md:text-2xl text-white font-bold mb-6">Ready to work with us?</h2>
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <a 
          href="tel:9113703324" 
          className="w-full sm:w-auto bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-500 transition"
        >
          Call us 24x7
        </a>
         <a 
          href="https://wa.me/9113703324" 
          className="w-full sm:w-auto bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-500 transition"
        >
          Message us on WhatsApp
        </a>
        </div>
      </section>
    </main>
  );
}