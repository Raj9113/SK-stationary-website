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
    <div className="bg-yellow-500 ">
      <h3 className="text-xl font-bold mb-2 text-green-400">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <button className="border bg-amber-100 rounded-md text-gray-600 mt-auto hover:underline">
        {linkText}
      </button>
    </div>
  );
};

const Product = () => {
  // 1. Ek variable jisse sabhi buttons ka naam ek saath change hoga
  const BUTTON_TEXT = "Buy Now";

  // 2. Aapke products ka data (Future mein yeh MongoDB se aayega)
  const productsData = [
    {
      id: 1,
      title: "Books",
      description: "Complete range of office and school supplies.",
      href: "/stationery",
    },
    {
      id: 2,
      title: "Pens",
      description: "Fast assistance with forms, applications...",
      href: "/janseva-kendr",
    },
    {
      id: 3,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 4,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 5,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 6,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 7,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 8,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 9,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 10,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 11,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 12,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 13,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 14,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 15,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 16,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 17,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 18,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 19,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 20,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 21,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 22,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 23,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 24,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 25,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 26,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 27,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 28,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 29,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 30,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 31,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 32,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 33,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 34,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 35,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 36,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 37,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 38,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 39,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 40,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 41,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 42,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 43,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },
    {
      id: 44,
      title: "Natraj Pencils",
      description: "Reliable materials and great deals...",
      href: "/shuttering",
    },

    // Bas yahan naye products add karte jaiye, HTML mein kuch change nahi karna padega
  ];
  return (
    <div className="min-h-screen bg-linear-to-r from-violet-200 to-pink-200 text-gray-800 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Stationery</h1>
        <p className="text-lg text-gray-300 mb-8">
          Complete range of office and school supplies.
        </p>
        <div className="grid md:grid-cols-6 gap-2 grid-cols-2">
          <div className="grid md:grid-cols-6 gap-2 grid-cols-2">
            {/* Yeh code array mein jitne products honge, utne Card apne aap bana dega */}
            {productsData.map((product) => (
              <Card
                key={product.id}
                title={product.title}
                description={product.description}
                linkText={BUTTON_TEXT} // Yahan aapka variable use ho raha hai
                href={product.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
