export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-brand-primary text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Latest Phones. <br className="md:hidden" />
            <span className="text-brand-accent">Genuine Accessories.</span> <br />
            Great Deals.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Mbarara's premium destination for top-tier electronics, smartphones, and trusted accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/shop" className="bg-brand-accent hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg">
              Shop Now
            </a>
            <a href="#contact" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-full transition-all">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES PLACEHOLDER */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold text-brand-charcoal mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* We will map over database categories here later */}
          {['Phones', 'Accessories', 'Audio', 'Power'].map((cat) => (
            <div key={cat} className="bg-white rounded-2xl shadow-card p-6 text-center hover:shadow-card-hover transition-shadow cursor-pointer border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-brand-surface rounded-full mb-4 flex items-center justify-center">
                <span className="text-brand-primary text-2xl font-bold">{cat[0]}</span>
              </div>
              <h3 className="font-semibold text-brand-charcoal">{cat}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
