const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://khwfdbyrphkjgmkfeqbb.supabase.co',
  'sb_publishable_f6C_Pz0A-l0kgre16RQDAw_nStic0R_'
);

async function seedDatabase() {
  console.log("Starting data seed for Supabase...");

  // 1. Destinations
  const destinations = [
    { country_name: "India", tagline: "The Value Hub", description: "Top-tier healthcare at incredibly affordable rates.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQZaDpfpFFF3DOO2smjkpcs7r0C6tdDF2Vcphyaq6G58zXtczDhuoGkMPl6yyinartPyId8RQXQSr4TcRXeYB7b70wrNt1qC9MOAnTkJAW_lv66lIytC7o77UXxyKBMeodqZh52b0-mC5HI_riy-NCJfZQAuqIDDCc90rSe_poSmx96fGkVL9cMxygfaT3r4i03kF5y09p_gfV2pEJd1NE47wSvGWB0ygovD6PEWrQjrQhXB6WfCSvl-e59_bAKWmzUydVMM45kgc" },
    { country_name: "Thailand", tagline: "Wellness Oasis", description: "World-renowned for luxury recovery and excellent clinical outcomes.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLH1TsXo777siMCGhqY88b_R8RWsAMexGU5tTezMcsPCOqBz0wRLwydKNFhU_crbeH9m0OLv-QqAzbBHEUn8izYLO-0T1CxdFXqJeHKiT_zW-yvd-gC2TxmHx0n5-NaBmWxT0HKS5tyehDr1N3TcEp_gNJio13HqphblIGv4FMEBqVVLGG0zLYdXnQ07qL_wOwYoSDqZQV0_rQwsj-a6kfXhMxIMKT9u9h3i7-1fAAbo8xP5pQKBWO18FYOFUrhfbkTXxa8ZF9CrY" },
    { country_name: "Turkey", tagline: "Bridge of Specialties", description: "Leading the way in aesthetics, dentistry, and complex surgeries.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBebJ8wQ_zCwYl8zd_DZW9MVoLnE1xAA36MOERssA2I6BYa2ggzStbScync7_P7A5KJYbSeko8sVxAOyQA53rYsm0ig_uaC3R0akvNKgSxnM0l763r20bZ-A-YqZZlSBwFmgdu3J6e96BlAw4iD4_Ykbg-dPa2kWNA7B-sVdko2NiqR5D-yfgciBBpynbCm_GMeE2TWxLvcv1svm6LLmd1fl2x3nNRkx80rfDguY2c2SBXbzvplv0x0cqRr1w4VfHFYLw0MVLTRJl0" },
    { country_name: "UAE", tagline: "Luxury Care", description: "Ultra-modern JCI facilities with premium guest services.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCazZPlsryPdTGpIYuXl0RSiJOuL-M1oExo4KHRCzn9AfTwqgM0ciDiOvT-MV4vXPybHro4tQbjfLE1cimFq6iNeU9YZVr0CubHFIQcZLQ8HtGBFEcHQwHFDkLREjZf9vQI8X_EMufQzDwkqakCJl_wPinUDiLpNj_DFPtu1VHJ5HQmd3L-j9i0ULR8wyNxLeYBUudKnjNUv9t7RCZgNkxUeIM8LwnyKERM-PhaXvvSx3GbOHQheG95KDJhWFjP39u4ribsWC6ImAE" },
    { country_name: "Singapore", tagline: "Medical Excellence", description: "Advanced medical technologies and strict safety frameworks.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzRtXmG33DUZf7afdSGwX1356SeuEmX35vKULFsYkr-Wv_V056A6JbqgYj1WyqbVpTS5qVRKN0YW3jtVcRLQfIWIVWETcX1_f4nCWZ8hzJWpuj6r3DP1Gf_xJBVur4M84XZg0kmcbljwOvolJWbFbmrVrtL5SFnkTkXiuW5p0hp29p4GR64Kmqc7wb7EhSnITXKsmvAlGDUcf_HVEcYUdgJv-1hvoAZywrU_XBJ5GVSfj9NrRSJMDwcQW_lzqf-B3wJv9ZYLs1ruc" },
    ...Array.from({ length: 15 }).map((_, i) => ({
      country_name: `Exotic Destination ${i + 6}`,
      tagline: `Global Specialty ${i + 6}`,
      description: "Modern medical infrastructure combining international tourism and advanced healthcare.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjaHlh-SqC03deGKOP3O7I7t5qQbhMVv2eVmLBpJxE-RtdlF9tgl57tYmnh3iU0FJBo6qwIMSg9H-IjErV3QGBNyW7FULZNmyzh72UqJPSSMgeSS_vhZanqYyQPwWPrXzebOM89PFnPe7Z4fS6a9JXYDWX7e8I4tFq-XCkOW8Li-YCPBZnMLHJA4i5BOxvBxZ-fSCMK3oYPyuMQdiWqpj5j1FzEVdQdcitW6FcDptMPgxk7Le5zMtDNICvwI8MVFPQiZld8ZvYlCo"
    }))
  ];

  // 2. Treatments
  const treatments = [
    { name: "Cardiology", icon_name: "cardiology", short_description: "Advanced heart surgeries and minimally invasive procedures.", starting_price: "$3,500" },
    { name: "Orthopedics", icon_name: "orthopedics", short_description: "Joint replacements and spine surgeries using robotic precision.", starting_price: "$4,200" },
    { name: "Oncology", icon_name: "oncology", short_description: "Comprehensive cancer care with latest immunotherapy protocols.", starting_price: "$5,000" },
    { name: "Neurology", icon_name: "neurology", short_description: "Expert treatment for complex brain and spinal cord disorders.", starting_price: "$4,800" },
    { name: "Fertility / IVF", icon_name: "pregnant_woman", short_description: "High success rate fertility treatments with compassionate care.", starting_price: "$3,800" },
    ...Array.from({ length: 15 }).map((_, i) => ({
      name: `Specialized Treatment ${i + 6}`,
      icon_name: "medical_services",
      short_description: "Comprehensive care utilizing advanced robotic technologies.",
      starting_price: `$${2500 + i * 200}`
    }))
  ];

  // 3. Hospitals
  const hospitals = [
    { name: "Apollo Hospitals", city: "Chennai", country: "India", rating: 4.9, reviews_count: 5200, accreditations: ['JCI', 'NABH'], description: "Pioneer of integrated healthcare in Asia.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjaHlh-SqC03deGKOP3O7I7t5qQbhMVv2eVmLBpJxE-RtdlF9tgl57tYmnh3iU0FJBo6qwIMSg9H-IjErV3QGBNyW7FULZNmyzh72UqJPSSMgeSS_vhZanqYyQPwWPrXzebOM89PFnPe7Z4fS6a9JXYDWX7e8I4tFq-XCkOW8Li-YCPBZnMLHJA4i5BOxvBxZ-fSCMK3oYPyuMQdiWqpj5j1FzEVdQdcitW6FcDptMPgxk7Le5zMtDNICvwI8MVFPQiZld8ZvYlCo" },
    { name: "Bumrungrad International", city: "Bangkok", country: "Thailand", rating: 4.8, reviews_count: 8500, accreditations: ['JCI'], description: "Southeast Asia's premium medical destination.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBebJ8wQ_zCwYl8zd_DZW9MVoLnE1xAA36MOERssA2I6BYa2ggzStbScync7_P7A5KJYbSeko8sVxAOyQA53rYsm0ig_uaC3R0akvNKgSxnM0l763r20bZ-A-YqZZlSBwFmgdu3J6e96BlAw4iD4_Ykbg-dPa2kWNA7B-sVdko2NiqR5D-yfgciBBpynbCm_GMeE2TWxLvcv1svm6LLmd1fl2x3nNRkx80rfDguY2c2SBXbzvplv0x0cqRr1w4VfHFYLw0MVLTRJl0" },
    { name: "Cleveland Clinic", city: "Abu Dhabi", country: "UAE", rating: 4.9, reviews_count: 3100, accreditations: ['JCI', 'ISO'], description: "Bringing US standard medical excellence to the Middle East.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCazZPlsryPdTGpIYuXl0RSiJOuL-M1oExo4KHRCzn9AfTwqgM0ciDiOvT-MV4vXPybHro4tQbjfLE1cimFq6iNeU9YZVr0CubHFIQcZLQ8HtGBFEcHQwHFDkLREjZf9vQI8X_EMufQzDwkqakCJl_wPinUDiLpNj_DFPtu1VHJ5HQmd3L-j9i0ULR8wyNxLeYBUudKnjNUv9t7RCZgNkxUeIM8LwnyKERM-PhaXvvSx3GbOHQheG95KDJhWFjP39u4ribsWC6ImAE" },
    { name: "Fortis Memorial", city: "Gurugram", country: "India", rating: 4.7, reviews_count: 4100, accreditations: ['JCI', 'NABH'], description: "Multi-specialty quarternary care hospital.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLH1TsXo777siMCGhqY88b_R8RWsAMexGU5tTezMcsPCOqBz0wRLwydKNFhU_crbeH9m0OLv-QqAzbBHEUn8izYLO-0T1CxdFXqJeHKiT_zW-yvd-gC2TxmHx0n5-NaBmWxT0HKS5tyehDr1N3TcEp_gNJio13HqphblIGv4FMEBqVVLGG0zLYdXnQ07qL_wOwYoSDqZQV0_rQwsj-a6kfXhMxIMKT9u9h3i7-1fAAbo8xP5pQKBWO18FYOFUrhfbkTXxa8ZF9CrY" },
    { name: "Medanta - The Medicity", city: "Delhi NCR", country: "India", rating: 4.8, reviews_count: 6500, accreditations: ['JCI', 'NABH'], description: "One of India's largest multi-super specialty institutes.", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzRtXmG33DUZf7afdSGwX1356SeuEmX35vKULFsYkr-Wv_V056A6JbqgYj1WyqbVpTS5qVRKN0YW3jtVcRLQfIWIVWETcX1_f4nCWZ8hzJWpuj6r3DP1Gf_xJBVur4M84XZg0kmcbljwOvolJWbFbmrVrtL5SFnkTkXiuW5p0hp29p4GR64Kmqc7wb7EhSnITXKsmvAlGDUcf_HVEcYUdgJv-1hvoAZywrU_XBJ5GVSfj9NrRSJMDwcQW_lzqf-B3wJv9ZYLs1ruc" },
    ...Array.from({ length: 15 }).map((_, i) => ({
      name: `Partner Excellence Hospital ${i + 6}`,
      city: "Metropolitan City",
      country: "Popular Destination",
      rating: 4.5 + (Math.random() * 0.5),
      reviews_count: 1000 + (Math.random() * 2000),
      accreditations: ['JCI'],
      description: "State-of-the-art center recognized for the safety of its surgical protocols.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW_95pC0t2W78L7khno0jUu0QLDdJ4IIAPUZqBZMqtfZrUuPbdnDDOsDmM6INuajOyEL-IJTKVCmQCCDrRsvokHS0_DtWAf2McGu64V5h95g8QSifB6gz0AB76_q5UCOSeY95aJ7xxtwRjGqxFEcxgqMy8kGaENjdI_TuV-_Yr_M-2__w_TK7LQw4PyWqLHAU7BxpFJwJrW4qmVw70ZmVBAecGb_BDW0vJ2WhQX9yNHzzxwMsEY5dlUc918Tzk-fQqjmP_Tv7TgSg"
    }))
  ];

  // 4. Packages
  const packages = [
    { title: "Full Executive Check-up", badge_text: "Limited Time", description: "Comprehensive head-to-toe screening including cardiac, renal, and advanced imaging for international patients.", price: "$850", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZX0dhQiKJbTeKabBthrd87utqo-oFW8MR4bwbe-3Kl_4qZLauHS2NiZ9-5in5jE70lsFQwYcfCzXBEIoZUG-vYzaqoWu-wRCqBjy9CvURYwdj8nOvKP4ZgC8wsbKmFZ7-yODlxCtovxDDH8roPP40fxhORONYuA7Sn_TFqnwsbNpfODxHUVKo6Au8-0QxneoMYc_lVWWnTkBoUjBmgBs26BK5N2VKdhtIBkyansHEm13ejAfePom8FLA4UjLwVXd0FL7eFOfY188" },
    { title: "Cardiac Excellence Suite", badge_text: "Special Offer", description: "Premium screening by top cardiologists, including Angiography and detailed cardiac consultations.", price: "$1,200", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLH1TsXo777siMCGhqY88b_R8RWsAMexGU5tTezMcsPCOqBz0wRLwydKNFhU_crbeH9m0OLv-QqAzbBHEUn8izYLO-0T1CxdFXqJeHKiT_zW-yvd-gC2TxmHx0n5-NaBmWxT0HKS5tyehDr1N3TcEp_gNJio13HqphblIGv4FMEBqVVLGG0zLYdXnQ07qL_wOwYoSDqZQV0_rQwsj-a6kfXhMxIMKT9u9h3i7-1fAAbo8xP5pQKBWO18FYOFUrhfbkTXxa8ZF9CrY" },
    { title: "IVF Foundation Package", badge_text: "Special Offer", description: "Start your journey with expert fertility guidance. Includes initial tests, consultation, and accommodation support.", price: "$3,900", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCazZPlsryPdTGpIYuXl0RSiJOuL-M1oExo4KHRCzn9AfTwqgM0ciDiOvT-MV4vXPybHro4tQbjfLE1cimFq6iNeU9YZVr0CubHFIQcZLQ8HtGBFEcHQwHFDkLREjZf9vQI8X_EMufQzDwkqakCJl_wPinUDiLpNj_DFPtu1VHJ5HQmd3L-j9i0ULR8wyNxLeYBUudKnjNUv9t7RCZgNkxUeIM8LwnyKERM-PhaXvvSx3GbOHQheG95KDJhWFjP39u4ribsWC6ImAE" },
    ...Array.from({ length: 17 }).map((_, i) => ({
      title: `Exclusive Health Package #${i + 4}`,
      badge_text: i % 3 === 0 ? "POPULAR" : "ALL INCLUSIVE",
      description: "Comprehensive care including airport transfers, clinical tests, and private consultations.",
      price: `$${800 + i * 350}`,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQZaDpfpFFF3DOO2smjkpcs7r0C6tdDF2Vcphyaq6G58zXtczDhuoGkMPl6yyinartPyId8RQXQSr4TcRXeYB7b70wrNt1qC9MOAnTkJAW_lv66lIytC7o77UXxyKBMeodqZh52b0-mC5HI_riy-NCJfZQAuqIDDCc90rSe_poSmx96fGkVL9cMxygfaT3r4i03kF5y09p_gfV2pEJd1NE47wSvGWB0ygovD6PEWrQjrQhXB6WfCSvl-e59_bAKWmzUydVMM45kgc"
    }))
  ];

  // 5. Leads (aligned with /quote insertion payload)
  const leads = [
    { name: "Jean Dupont", email: "jean.dupont@example.com", phone: "+33 612345678", condition: "Cardiology", preferred_destination: "India", notes: "Urgent second opinion request." },
    { name: "Aisha Kone", email: "aisha.kone@example.com", phone: "+225 01234567", condition: "Fertility / IVF", preferred_destination: "Turkey", notes: "Wants package details and travel support." },
    { name: "Kwame Mensah", email: "kwame.mensah@example.com", phone: "+233 241234567", condition: "Orthopedics", preferred_destination: "India", notes: "Knee replacement quote needed." },
    ...Array.from({ length: 17 }).map((_, i) => ({
      name: `Patient Prospect ${i + 4}`,
      email: `patient${i + 4}@example.com`,
      phone: `+00112233${i}`,
      condition: "Second opinion for specialized surgery.",
      preferred_destination: i % 2 === 0 ? "India" : "UAE",
      notes: "Imported seed lead."
    }))
  ];

  // 6. Blog Posts
  const blogHtmlContent = `
<p class="text-xl font-medium text-primary mb-8 leading-relaxed">
  The landscape of medical treatments is undergoing a profound transformation. As we move away from 'one-size-fits-all' therapies, precision care is emerging as a beacon of hope, providing tailored treatments based on specific profiles.
</p>
<p class="mb-6">
  For decades, treatments focused on general protocols. Today, we look at the unique signature of the patient. At CureSureMedico, we are seeing how precision medicine bridges the gap between global innovations and local patient care, ensuring that every individual receives the most effective therapy with the fewest side effects.
</p>

<div class="my-12 p-8 bg-surface-container-low rounded-xl border-l-4 border-secondary relative">
  <span class="material-symbols-outlined absolute top-4 left-4 text-secondary/20 text-5xl" style="font-variation-settings: 'FILL' 1">format_quote</span>
  <blockquote class="text-2xl italic font-medium text-on-surface leading-snug relative z-10 pl-6">
    "Precision medicine is not just about the science; it's about giving a father his strength back to play with his children, and a teacher the clarity to return to her classroom."
  </blockquote>
  <p class="mt-4 text-secondary font-bold text-right">— Dr. Amara Okoro, Medical Director</p>
</div>

<h2 class="text-3xl font-bold text-blue-800 mt-10 mb-6">Breakthroughs in Advanced Care</h2>
<p class="mb-6">
  Recent partnerships with international labs have enabled us to perform advanced sequencing right here. This process involves analyzing specific markers to identify what is driving the condition.
</p>

<div class="grid grid-cols-2 gap-4 my-10">
  <div class="rounded-xl overflow-hidden h-64">
    <img alt="Laboratory Research" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTj5UO77sVknla96B9LJ-OorRzG9UmHunAuOOdhVh6VKGtnr36NYz8v_Ggg0tdcLrvq9BXBIyIb4EDoi2g15EfA_6z4VU23uQk_zbsDY7_4s_s-IMrvorhGJW0sfQLD_V3HsXXywdYefVPVIskhOibC3D7gFZSnaYDm8uqZJeuLxGYr7n_efnKfw7py_MjLrdBDTReuJ_rGDUsielG1NfJpWKGrse68qc2ASqjfIGIdyTCPPFiB58ojdvyTNuEaZwFmIXgbsSxYGE" />
  </div>
  <div class="rounded-xl overflow-hidden h-64">
    <img alt="Medical Technology" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIJ8YPbS_hzSkKNR5f_is4jklWW6O_9syKMMLd0K9tW6eNhGUWJQcyQth7pD6JRkWmkyHQYBC_Pkr-a8Ps--1GF54LdSWFPh62wHKzFADAewYpL7FAdE2Yqz94nfnSaB028UWk-S2JJgcbksE7WsMF0ERNtyNB3W2bMQu_gU3njuytxQ6T396e2_HWs2Zv_NoiHOMkVemA8mN0WPsjmsm_6tFfzC4z3vzZm2Uyjlo5BAf3yBodNJwPgkeoL3nEf_lIyHvr2-T9RA0" />
  </div>
</div>

<p class="mb-6">
  Once identified, we can often match these markers with "targeted therapies"—drugs specifically designed to attack those vulnerabilities. This approach has drastically improved recovery rates.
</p>
`;

  const blogPosts = [
    {
      title: "Navigating Precision Oncology in 2026",
      slug: "navigating-precision-oncology-2026",
      category: "Treatment Breakthroughs",
      excerpt: "How genomic testing is revolutionizing personalized cancer care.",
      content: blogHtmlContent,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbINngkspDFP3sh8jnV33cN0tC0RpN5ZmrD9-RWRjiOSMgeltBK4Qm1ogJPArcgOEsQUsqgbM8C4EZhncps9SkbDJWGMJWPbKB1YmvbEdf_sj7pJwsa-aq6YK20GHcxJRWnAoe32WFOTJfPqopP8ZFNSnEuupJDX6c-3qspQm8KZ9-4nLqfkCZyJmtIykSOQ8wFfXCIpbW20NUQ53zrQ5CKTgTha_Hz8vzsg-JbpXuOh9SXpRrhv4AxmN21pggbpjJKe1EwbjD1J0",
      author: "Dr. Amara Okoro",
      youtube_video_id: "zpOULjyy-n8",
      read_time: "5 min",
      is_featured: true,
      published_date: "2026-04-10"
    },
    {
      title: "The Future of Orthopedics & Joint Care",
      slug: "future-of-orthopedics-joint-care",
      category: "Treatment Breakthroughs",
      excerpt: "Robotic precision is changing the way we approach knee and hip replacements.",
      content: blogHtmlContent,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLH1TsXo777siMCGhqY88b_R8RWsAMexGU5tTezMcsPCOqBz0wRLwydKNFhU_crbeH9m0OLv-QqAzbBHEUn8izYLO-0T1CxdFXqJeHKiT_zW-yvd-gC2TxmHx0n5-NaBmWxT0HKS5tyehDr1N3TcEp_gNJio13HqphblIGv4FMEBqVVLGG0zLYdXnQ07qL_wOwYoSDqZQV0_rQwsj-a6kfXhMxIMKT9u9h3i7-1fAAbo8xP5pQKBWO18FYOFUrhfbkTXxa8ZF9CrY",
      author: "Dr. Rajesh Kumar",
      youtube_video_id: "bYy2vI2eGkQ",
      read_time: "6 min",
      is_featured: false,
      published_date: "2026-04-15"
    },
    {
      title: "What to Expect During Your Medical Trip",
      slug: "what-to-expect-medical-trip",
      category: "Medical Travel Tips",
      excerpt: "A comprehensive guide on preparing for your overseas medical journey.",
      content: blogHtmlContent,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBebJ8wQ_zCwYl8zd_DZW9MVoLnE1xAA36MOERssA2I6BYa2ggzStbScync7_P7A5KJYbSeko8sVxAOyQA53rYsm0ig_uaC3R0akvNKgSxnM0l763r20bZ-A-YqZZlSBwFmgdu3J6e96BlAw4iD4_Ykbg-dPa2kWNA7B-sVdko2NiqR5D-yfgciBBpynbCm_GMeE2TWxLvcv1svm6LLmd1fl2x3nNRkx80rfDguY2c2SBXbzvplv0x0cqRr1w4VfHFYLw0MVLTRJl0",
      author: "CSM Editorial",
      youtube_video_id: "M_v3aO7gJ_U",
      read_time: "4 min",
      is_featured: false,
      published_date: "2026-04-20"
    },
    {
      title: "Patient Spotlight: Beating Heart Disease",
      slug: "patient-spotlight-beating-heart-disease",
      category: "Patient Success Stories",
      excerpt: "How a dedicated team helped John overcome severe cardiac complications.",
      content: blogHtmlContent,
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCazZPlsryPdTGpIYuXl0RSiJOuL-M1oExo4KHRCzn9AfTwqgM0ciDiOvT-MV4vXPybHro4tQbjfLE1cimFq6iNeU9YZVr0CubHFIQcZLQ8HtGBFEcHQwHFDkLREjZf9vQI8X_EMufQzDwkqakCJl_wPinUDiLpNj_DFPtu1VHJ5HQmd3L-j9i0ULR8wyNxLeYBUudKnjNUv9t7RCZgNkxUeIM8LwnyKERM-PhaXvvSx3GbOHQheG95KDJhWFjP39u4ribsWC6ImAE",
      author: "CSM Editorial",
      youtube_video_id: "lUjXntJ1G9k",
      read_time: "7 min",
      is_featured: true,
      published_date: "2026-04-25"
    }
  ];

  const tasks = [
    { table: 'destinations', data: destinations },
    { table: 'treatments', data: treatments },
    { table: 'hospitals', data: hospitals },
    { table: 'packages', data: packages },
    { table: 'leads', data: leads },
    { table: 'blog_posts', data: blogPosts }
  ];

  for (const task of tasks) {
    const { error } = await supabase.from(task.table).insert(task.data);
    if (error) {
      console.error(`Error inserting into ${task.table}:`, error.message);
    } else {
      console.log(`Successfully seeded 20 rows into ${task.table}`);
    }
  }

  console.log("Seeding complete!");
}

seedDatabase();
