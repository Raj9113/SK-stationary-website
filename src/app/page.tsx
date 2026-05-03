import Link from "next/link";

// Ek reusable Card component banaiye
const ServiceCard = ({
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
    <div className="bg-slate-800 p-6 flex flex-col rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2 text-green-400">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link href={href} className="text-blue-400 mt-auto hover:underline">
        {linkText}
      </Link>
    </div>
  );
};
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      {/* Hero Section - Gradient Fade */}
      <section className="bg-linear-to-b from-blue-700 via-blue-800 to-slate-900 text-white pt-8 md:pt-6 md:pb-4 pb-8 px-5 text-center md:py-10 md:bg-blue-600 md:bg-none">
        {/* Little welcome badge */}
        <div className="inline-block bg-blue-500/20 text-blue-200 px-6 md:mb-0.5 py-2 rounded-full text-sm font-semibold mb-4 border mt-0px border-blue-500/30">
          Welcome to
        </div>

        {/* Adjusted text sizing and forced a line break on mobile so it fits perfectly */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
          S K Stationary <br className="md:hidden" /> & Janseva Kendr
        </h1>

        <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
          Your one-stop destination for stationery, digital services, commercial
          shuttering, and DJ setups.
        </p>
      </section>

      {/* Services Grid */}
      <section className="md:my-10 md:mx-16">
        <h2 className="text-3xl font-semibold text-center mb-10 text-white">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-16 gap-10 px-8 pb-10 md:pb-10">
          {/* Ab aapka code itna clean aur chota dikhega */}
          <ServiceCard
            title="Stationery"
            description="Complete range of office and school supplies."
            linkText="View Products &rarr;"
            href="/stationery"
          />

          <ServiceCard
            title="Online Services"
            description="Fast assistance with forms, applications, and digital tasks."
            linkText="Learn More &rarr;"
            href="/janseva-kendr"
          />

          <ServiceCard
            title="Commercial Shuttering"
            description="Reliable materials and great deals for your construction needs."
            linkText="Get a Quote &rarr;"
            href="/shuttering"
          />

          <ServiceCard
            title="DJ Services"
            description="Professional sound and music for events and parties."
            linkText="Book Now &rarr;"
            href="/dj-services"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-slate-950 px-4 text-center">
        <h2 className="text-xl md:text-2xl text-white font-bold mb-6">
          Ready to work with us?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="tel:9113703324"
            className="w-90 sm:w-auto bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-500 transition"
          >
            Call us 24x7
          </a>
          <a
            href="https://wa.me/9113703324"
            className="w-90 sm:w-auto bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-500 transition"
          >
            Message us on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
