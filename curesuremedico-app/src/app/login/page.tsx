"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        // Register new user
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: `${firstName} ${lastName}`.trim(),
              first_name: firstName,
              last_name: lastName,
              phone: phone,
            }
          }
        });
        if (error) throw error;
        alert("Registration successful! Proceeding to your Sanctuary.");
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-stretch w-full min-h-screen bg-surface text-on-surface pt-24">
      {/* Left Side: Visual Anchor (Medical Imagery) */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-80 mix-blend-overlay" 
            alt="Compassionate healthcare" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7SqwWuCNxD_FrtArBSrTbJGMcZqNSAEM7SlPljHvzFK9crJjTKV-Iamy_3jfityfm1s8iITtSNqXe3Y57N12cgiuZrCXqUap8gs5GlHVLHV6Q9oIBuCYPqel1iES5yX21qjQHKsx8b19oc28sd4gZwsSHIqiDvVNWGNQ5z2GNSr2mqaOX8URQnnT9AfCheJTkgbeVVUHfjy9v9kjf9-I3CZQCx-3vjEiQCTA8uhrdK9mZn6t5AzQBVAvqEB-gIDgpZ4BBmcgQx4A" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 via-transparent to-transparent z-10"></div>
        <div className="relative z-20 flex flex-col justify-end p-16 w-full text-on-primary">
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-on-secondary font-semibold text-xs tracking-wider uppercase mb-6">
              Luminous Precision
            </span>
            <h1 className="text-5xl font-extrabold tracking-tighter leading-tight mb-4">Welcome to <br /> CureSureMedico.</h1>
            <p className="text-lg opacity-90 max-w-md font-light leading-relaxed">A unified platform for compassionate healthcare management and personalized patient wellness, powered by clinical precision.</p>
          </div>
        </div>
      </section>

      {/* Right Side: Authentication Forms */}
      <section className="w-full lg:w-1/2 bg-surface flex flex-col px-6 md:px-12 pb-8 overflow-y-auto pt-12">
        <div className="max-w-md mx-auto w-full">
          {errorMsg && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Get Started</h2>
            <p className="text-on-surface-variant">Access your clinical dashboard or manage your health journey seamlessly.</p>
          </div>

          {/* Tabs Logic */}
          <div className="flex border-b border-outline-variant/30 mb-8">
            <button 
              onClick={() => { setIsLogin(true); setErrorMsg(null); }}
              className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setErrorMsg(null); }}
              className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Prénom (First Name)</label>
                    <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline/60 transition-all" placeholder="John" type="text" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Nom (Last Name)</label>
                    <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline/60 transition-all" placeholder="Doe" type="text" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">WhatsApp/Phone</label>
                  <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline/60 transition-all" placeholder="+1234567890" type="tel" />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline/60 transition-all" placeholder="dr.smith@curesure.com" type="email" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                {isLogin && <button type="button" className="text-xs font-semibold text-primary hover:underline">Forgot Password?</button>}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                <input required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline/60 transition-all" placeholder="••••••••" type="password" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-on-primary rounded-full font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Processing..." : isLogin ? "Login to Portal" : "Create My Account"}
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>


        </div>
      </section>
    </main>
  );
}
