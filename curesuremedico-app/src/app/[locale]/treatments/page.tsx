import { Suspense } from "react";
import { supabase } from "@/utils/supabaseClient";
import TreatmentsContentClient from "./TreatmentsContentClient";

interface Treatment {
  id: string;
  slug?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  icon_name: string;
  short_description: string;
  short_description_fr?: string;
  short_description_ar?: string;
  starting_price: string;
}

interface Package {
  id: string;
  slug?: string;
  title: string;
  title_fr?: string;
  title_ar?: string;
  badge_text: string;
  description: string;
  description_fr?: string;
  description_ar?: string;
  price: string;
  features: string[];
  image_url: string;
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TreatmentsPage(props: Props) {
  const searchParams = await props.searchParams;
  const isPreview = searchParams.preview === 'true';

  let finalTreatments: Treatment[] = [];
  let finalPackages: Package[] = [];

  try {
    // Fetch Treatments
    let treatmentQuery = supabase.from("treatments").select("*").order("id", { ascending: true });
    if (!isPreview) {
      treatmentQuery = treatmentQuery.eq('status', 'published');
    }
    const { data: treatmentData, error: treatmentErr } = await treatmentQuery;

    if (treatmentErr) {
      console.error("Error fetching treatments:", treatmentErr);
    }

    if (treatmentData && treatmentData.length > 0) {
      finalTreatments = treatmentData;
    } else {
      // STATIC FALLBACK
      finalTreatments = [
        { id: "1", slug: "cardiology", name: "Cardiology", icon_name: "favorite", short_description: "Heart valve replacement, Bypass surgery, and minimally invasive cardiac procedures.", starting_price: "Ask for quote" },
        { id: "2", slug: "orthopedics", name: "Orthopedics", icon_name: "check_circle", short_description: "Precision robotic knee and hip replacements using the latest biocompatible materials.", starting_price: "Ask for quote" },
        { id: "3", slug: "oncology", name: "Oncology", icon_name: "healing", short_description: "Comprehensive cancer care including CyberKnife, Proton therapy, and advanced immunotherapy.", starting_price: "Ask for quote" },
        { id: "4", slug: "fertility-ivf", name: "Fertility/IVF", icon_name: "child_care", short_description: "High-success rate IVF, ICSI, and egg donation programs in world-class clinics.", starting_price: "Ask for quote" },
        { id: "5", slug: "neurology", name: "Neurology", icon_name: "psychology", short_description: "Expert neurosurgery for brain and spine conditions using navigation-guided systems.", starting_price: "Ask for quote" },
        { id: "6", slug: "bariatric-surgery", name: "Bariatric Surgery", icon_name: "monitor_weight", short_description: "Advanced metabolic surgeries and gastric sleeve procedures for long-term health.", starting_price: "Ask for quote" },
        { id: "7", slug: "gastroenterology", name: "Gastroenterology", icon_name: "check_circle", short_description: "Advanced endoscopic procedures and digestive tract treatments.", starting_price: "Ask for quote" },
        { id: "8", slug: "urology", name: "Urology", icon_name: "check_circle", short_description: "Prostate treatments, kidney stone removal, and robotic urologic surgeries.", starting_price: "Ask for quote" },
        { id: "9", slug: "cosmetic-surgery", name: "Cosmetic Surgery", icon_name: "face", short_description: "High-end aesthetic and reconstructive procedures by international board-certified surgeons.", starting_price: "Ask for quote" },
        { id: "10", slug: "dentistry", name: "Dentistry", icon_name: "check_circle", short_description: "Full mouth restorations, dental implants, and premium aesthetic dentistry.", starting_price: "Ask for quote" },
        { id: "11", slug: "ophthalmology", name: "Ophthalmology", icon_name: "visibility", short_description: "Advanced LASIK, cataract surgery, and retinal treatments.", starting_price: "Ask for quote" },
        { id: "12", slug: "pediatrics", name: "Pediatrics", icon_name: "check_circle", short_description: "Specialized pediatric cardiology, oncology, and general pediatric surgery.", starting_price: "Ask for quote" },
        { id: "13", slug: "pulmonology", name: "Pulmonology", icon_name: "check_circle", short_description: "Asthma, COPD, and advanced respiratory disorder treatments.", starting_price: "Ask for quote" },
        { id: "14", slug: "general-surgery", name: "General Surgery", icon_name: "medical_services", short_description: "Wide range of minimally invasive laparoscopic and general surgical procedures.", starting_price: "Ask for quote" },
        { id: "15", slug: "gynecology", name: "Gynecology", icon_name: "pregnant_woman", short_description: "Comprehensive women's health screening and specialized gynecological surgeries.", starting_price: "Ask for quote" }
      ];
    }

    // Fetch Packages
    let packageQuery = supabase.from("packages").select("*").order("id", { ascending: true }).limit(3);
    if (!isPreview) {
      packageQuery = packageQuery.eq('status', 'published');
    }
    const { data: packageData, error: packageErr } = await packageQuery;

    if (packageErr) {
      console.error("Error fetching packages:", packageErr);
    }

    if (packageData && packageData.length > 0) {
      finalPackages = packageData;
    } else {
      // STATIC FALLBACK
      finalPackages = [
        { id: "1", title: "Full Executive Check-up", badge_text: "Most Popular", description: "Comprehensive 2-day screening including advanced cardiac imaging, metabolic profile, and cancer marker screening at a premium facility.", price: "$1,200", features: [], image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt-M-PbLDQArKrmT1S0nDrS-OCfB_pnSE3Y94_yvvtwXe2C5zWPrlzs7ifj6wniyO-QeETc79lfDIwi3qBrZVKmvbddznWVVwEncjMNIkQvLNH1dSWU6c_w91ICsI9ARvCtz12brJPPAdOoo_iQM8PMqsC4Hn0TdirOIpn5FnirbkJOsEJBwzwC7w6W7ICJffWxxKDbWwJv02aocAyYCJIX-6_sj19PxJEnPKWi4wfJnsTfAcvvrwP2LTrD4ILuo3Fve0WIeyzDKM" },
        { id: "2", title: "Cardiac Excellence Suite", badge_text: "Exclusive Suite", description: "All-inclusive cardiac intervention package including premium hospital stay, specialist fees, and dedicated recovery concierge.", price: "$8,500", features: [], image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9GvupbFXOLPnff-BWCeW_OTFSuf2uOdLE7ro803jro7tDl_J3-F7Tgb6N2jr11gxntIZJu-2xLJAmhLy69kSp3MB5AYbBnQK0ZbU4uM668WgoyquazwmI30gMlNQp99ckEgInsg6js6a2X6WaLU_otEyaKoTwrmsC6zdVjJUf0HGaDuYmXjCTbJcxEanSTv7aJ87khZQXkb-CBmKTyboY8yX9wL6grlGuVfB7Tez4uiiFAaT45MPNqCmtKWDJYjb9KWA2nYXcOGA" },
        { id: "3", title: "IVF Foundation Package", badge_text: "Family Path", description: "One full cycle of IVF including medications, egg retrieval, and embryo transfer at a top fertility center in South Africa or India.", price: "$4,500", features: [], image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsx_x_IJNt7zANd24MQ22fGxxSI0SnjLd5Wl8K4HoDdjscIO2GZCEEMbyW0MbhDvP25y_xnPFq17Sgo-bGbedObDIxUeszS74EEwi-rXYqe0zPR1V5q9hBShlabQ2sucQxud2SAmFyzlMHo7VO3-pnj9l1Qgeb9UEnvkxjR-rDYeK1l_epxxiq_jWqGYq9iR5P5fHNQoiV7c2SAJElbbXJukpWlJ0Kbnke8pDJRqhJNToFo7AdWQHT6QpbHr48t1Hn0fQOHlaKneM" }
      ];
    }
  } catch (err) {
    console.error("Error loading treatments data:", err);
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-36 pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <TreatmentsContentClient initialTreatments={finalTreatments} initialPackages={finalPackages} />
    </Suspense>
  );
}
