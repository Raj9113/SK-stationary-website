import Link from "next/link";

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
