import { Suspense } from "react";
import { supabase } from "@/utils/supabaseClient";
import HospitalsListClient from "./HospitalsListClient";

interface Hospital {
  id: string;
  slug?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  city: string;
  country?: string;
  rating: number;
  reviews_count: number;
  accreditations: string[];
  specialties?: string[];
  description: string;
  description_fr?: string;
  description_ar?: string;
  image_url: string;
  logo_url: string;
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HospitalsPage(props: Props) {
  const searchParams = await props.searchParams;
  const isPreview = searchParams.preview === 'true';

  let allHospitals: Hospital[] = [];

  try {
    let query = supabase.from("hospitals").select("*").order("id", { ascending: true });
    
    if (!isPreview) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching hospitals:", error);
    }
    
    if (data && data.length > 0) {
      allHospitals = data.map((h: any) => ({
        ...h,
        specialties: typeof h.specialties === 'string' 
          ? h.specialties.split(',').map((s: string) => s.trim()).filter(Boolean) 
          : (Array.isArray(h.specialties) ? h.specialties : []),
        accreditations: typeof h.accreditations === 'string' 
          ? h.accreditations.split(',').map((s: string) => s.trim()).filter(Boolean) 
          : (Array.isArray(h.accreditations) ? h.accreditations : [])
      }));
    } else {
      // STATIC FALLBACK
      allHospitals = [
        {
          id: "1",
          slug: "apollo",
          name: "Apollo Hospitals, Greams Road",
          city: "Chennai, Tamil Nadu",
          country: "India",
          rating: 4.9,
          reviews_count: 1200,
          accreditations: ["JCI", "NABH"],
          specialties: ["Cardiology", "Organ Transplant", "Robotic Surgery"],
          description: "",
          image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhS8wv2mp2q20ScsT9B3h8Re5YosDUpM2tIXUrV7uL7Qbdf2YW3WasMawumIuMYycUQPQsaiO5b-ZD538kBkzzCSuWFcWMNcDlm6TAwxQGrqP0eaCpqfMHpDmxB9P2UxFEe-qrgGzJ5Mgvr904FTF0fGx2V05a2olQp-eYWuOTcwvx6UfYx98rjF8cUPQ7akx58ZTpz0xG3VNGnxCHUrhgs2Taodvb_ESb_TkkZt1Jc-beZ_0fPMc5d3oz41wMS6H_XNp1KGmb8_c",
          logo_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM1TwXGSRsaOT7-_SAM7r6uu7aEA3l4PDMUoXtyNY_61OOoE48eXkBpOKHyNdxCFxQeyJtd1mhAA-INJXhtTfOGGzOG3b_HtuLB4KBZUoWHfulGdEe-opj7al0e_-mdIR54gF8hKAUkTD6uSiYMhRoagXZIYn796GNPZZUalhA0qI0JA1DKCr556_m5XJjNdpfQ7seLKOb8Ze5afcuCsxMgI4XKbCLIKfckZPh68zvXOyLeTunOenTkhjoXG3UcpvFXCuQlC987_8"
        },
        {
          id: "2",
          slug: "fortis",
          name: "Fortis Memorial Research Institute",
          city: "Gurgaon, Delhi NCR",
          country: "India",
          rating: 4.8,
          reviews_count: 850,
          accreditations: ["JCI", "NABH"],
          specialties: ["Oncology", "Neuroscience", "Orthopedics"],
          description: "",
          image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRP9T0WEEMHFoN1jKmyvG2UI3BP0FZWA4B9ApTAFt7UzOU4wKMawG8LyTvngvRciqTFwluL6DnYBPBiDTs4CCyQbn3xp8N_5Lizbzuq2OeSOvJp0PQS4V8LMk3uTA_e0pqyvgxH9l4QRQCtGNDAMKPhcSE8I-x82kz8H6bsYsENk9B66lruJq2N3vT0uDwGYNBosV5ZDVTbp2kQ_32vvBpUXe5hYvK1FYgh812dY6055Kt5JNmVd6rOKdTmaJzxj_jo8rELV9Jlmk",
          logo_url: ""
        },
        {
          id: "3",
          slug: "medanta",
          name: "Medanta - The Medicity",
          city: "Gurugram, Haryana",
          country: "India",
          rating: 4.7,
          reviews_count: 920,
          accreditations: ["NABH"],
          specialties: ["Cardiology", "Transplants", "Gastroenterology"],
          description: "",
          image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFWOdU9YR-5Qy2OQgu66Tfkz9PKOKFDsh0b5i0KPjAx0HDYQBEP0285Va_aYwjVVtMbTYwkMZjWwgLx6riRm08BU06CxVQTpKHVfonH99rydaX7JqHaZ8SXvpbb8wK0TXe1Q0h1_At_4qgTFh5Bg7GCyHW1hrdoI2vGTAD9DH1sTmt-dcfRDRLBSwIobc1XaomevEgp9enDT331oe8JZJg_FwT6iDMO3dzUq4G3Ldoqq0hljZAMcvjVDp1KIZ-xBzJ9HZ5LX1yQ7I",
          logo_url: ""
        }
      ];
    }
  } catch (err) {
    console.error("Error loading hospitals data:", err);
  }

  return (
    <Suspense fallback={<div className="pt-36 text-center min-h-screen">Loading Hospitals...</div>}>
      <HospitalsListClient initialHospitals={allHospitals} />
    </Suspense>
  );
}
