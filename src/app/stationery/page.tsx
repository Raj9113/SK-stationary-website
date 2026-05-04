const Card = ({
  title,
  description,
  linkText,
  linkText2,
  href,
}: {
  title: string;
  description: string;
  linkText: string;
  linkText2: string;
  href: string;
}) => {
  return (
    // Agar aap yahan color change karenge, toh sabhi cards ka color badal jayega
    <div className="bg-green-800/30 backdrop-blur-md p-4 md:rounded-4xl rounded-3xl shadow-md border border-slate-700/50 md:h-70 flex flex-col justify-between">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-400">{description}</p>
      <div className="flex flex-row gap-2">
        <button className="bg-[#07553b] rounded-2xl w-45 h-8 text-xs text-[#ced46a] hover:bg-black hover:text-gray-100">
          {linkText}
        </button>
        <button className="bg-green-700 rounded-2xl w-45 h-8 text-xs text-[#ea1591] hover:bg-black hover:text-gray-100">
          {linkText2}
        </button>
      </div>
    </div>
  );
};

const Product = () => {
  // 1. Ek variable jisse sabhi buttons ka naam ek saath change hoga
  const BUTTON1_TEXT = "Add to Cart";
  const BUTTON2_TEXT = "Buy Now";

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
    <div className="bg-[url('/Img/bg-1.jpg')] bg-cover bg-fixed bg-center bg-no-repeat py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Stationery</h1>
        <p className="text-lg text-gray-300 mb-8">
          Complete range of office and school supplies.
        </p>
        <div className="">
          <div className="grid md:grid-cols-4 md:gap-16 gap-6 grid-cols-2 p-6 md:px-30">
            {/* Yeh code array mein jitne products honge, utne Card apne aap bana dega */}
            {productsData.map((product) => (
              <Card
                key={product.id}
                title={product.title}
                description={product.description}
                linkText={BUTTON1_TEXT}
                linkText2={BUTTON2_TEXT}
                // Yahan aapka variable use ho raha hai
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
