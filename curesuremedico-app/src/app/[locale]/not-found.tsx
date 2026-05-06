import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex-grow pt-24 min-h-screen flex flex-col bg-surface text-on-surface">
      <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Content Column */}
        <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4">
              Status Code 404
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-primary leading-none mb-6">
              Page Not Found
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-lg">
              It looks like we've lost our way, but your health journey continues. Let's find your destination together.
            </p>
          </div>
          
          {/* Quick Links - Bento Style Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link href="/" className="group p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:bg-primary hover:text-on-primary transition-all duration-300 flex flex-col justify-between h-40">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary transition-colors">home</span>
              <div>
                <h3 className="font-bold text-lg leading-tight">Home</h3>
                <p className="text-sm opacity-80 font-medium">Return to the homepage</p>
              </div>
            </Link>
            <Link href="/treatments" className="group p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:bg-secondary hover:text-on-secondary transition-all duration-300 flex flex-col justify-between h-40">
              <span className="material-symbols-outlined text-secondary group-hover:text-on-secondary transition-colors">medical_services</span>
              <div>
                <h3 className="font-bold text-lg leading-tight">Treatments</h3>
                <p className="text-sm opacity-80 font-medium">Explore clinical procedures</p>
              </div>
            </Link>
            <Link href="/hospitals" className="group p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:bg-tertiary hover:text-on-tertiary transition-all duration-300 flex flex-col justify-between h-40">
              <span className="material-symbols-outlined text-tertiary group-hover:text-on-tertiary transition-colors">local_hospital</span>
              <div>
                <h3 className="font-bold text-lg leading-tight">Hospitals</h3>
                <p className="text-sm opacity-80 font-medium">Find world-class facilities</p>
              </div>
            </Link>
            <Link href="/quote" className="group p-6 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container-high transition-all duration-300 flex flex-col justify-between h-40">
              <span className="material-symbols-outlined text-on-surface-variant">support_agent</span>
              <div>
                <h3 className="font-bold text-lg leading-tight text-on-surface">Get Help</h3>
                <p className="text-sm text-on-surface-variant font-medium">Talk to our care team</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Visual Column - Luminous Precision */}
        <div className="lg:col-span-6 relative order-1 lg:order-2">
          <div className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 bg-slate-100 mix-blend-multiply">
            <img 
              alt="Clinical Sanctuary Interior" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWo3k-7BPv_S7Id540ccP5eshx2YJbhvcvr94HS7bJSHYoY2jKzjqMPAqWvyWqNMXirAvZAYLLSuhyFGjUPxMblN98kLmD-0FgBdspAt4uQeQeaMNLKNpHOSVW_gCV67ZOAzyciAEyDdBTb0-7JLOYjZDlZhmoscyj8DG1PsJUt_HoYNZ6tcHQkP6hHpuf_8hKT5ui3gQu7CY9GohZKwT9IGY7BKiBDdQ2DvxlH9G33FMpCk0cykX76p7z4oMgTlqxIYinI9BD7TI" 
            />
            {/* Glass Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 text-slate-800">
              <p className="text-sm font-semibold tracking-tight">"Our focus remains on your well-being, even when the path shifts."</p>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl z-0"></div>
        </div>
      </section>
    </main>
  );
}
