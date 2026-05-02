import Link from 'next/link';
import { google } from 'googleapis';

// Cache the data for 60 seconds so your site stays incredibly fast
export const revalidate = 60; 

// 1. The function to grab your live data from Google Sheets
async function getInventoryData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Make sure 'Sheet1!A1:D' matches your actual Google Sheet tab name and columns
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A1:D', 
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return [];
  }
}

// 2. The Main Page Component
export default async function ProductGallery() {
  // Fetch the data
  const rows = await getInventoryData();
  
  // Separate headers from the actual products, with a fallback just in case it's empty
  const products = rows.length > 1 ? rows.slice(1) : [];

  return (
    <main className="min-h-screen bg-[#0a0510] text-white relative overflow-hidden pb-20">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-16 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider mb-2">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-500">Products</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Live inventory from our store.</p>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white mb-2 hidden md:block">
            &larr; Back to Home
          </Link>
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {products.length === 0 ? (
            <p className="text-gray-400 col-span-full">No products found or still loading...</p>
          ) : (
            products.map((row, index) => (
              // The Glassmorphism Card mapped to your data
              <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col hover:border-fuchsia-500/50 transition-all duration-300 group">
                
                {/* Image Placeholder */}
                <div className="bg-black/40 rounded-xl h-48 w-full mb-4 flex items-center justify-center overflow-hidden relative border border-white/5">
                   <span className="text-gray-600 text-xs uppercase tracking-widest">{row[1] || 'Image'}</span>
                   <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Dynamic Product Info (A=Name, B=Category, C=Price, D=Stock) */}
                <h3 className="text-lg font-semibold mb-1 text-gray-100 line-clamp-1">{row[0]}</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">{row[1]}</p>
                  {/* Stock Indicator */}
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-gray-300">
                    Stock: {row[3]}
                  </span>
                </div>
                
                {/* Price & Action button */}
                <div className="mt-auto flex items-center justify-between gap-3">
                  <p className="text-indigo-400 font-bold text-lg">₹{row[2]}</p>
                  
                  {/* Neon Outline Button linking to your WhatsApp */}
                  <a 
                    href={`https://wa.me/YOUR_NUMBER_HERE?text=I%20am%20interested%20in%20buying%20the%20${encodeURIComponent(row[0])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all text-sm font-semibold tracking-wide whitespace-nowrap"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </main>
  );
}