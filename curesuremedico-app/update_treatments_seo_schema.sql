-- Update Treatments Schema for SEO Enhancements

ALTER TABLE public.treatments
ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faqs_fr jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faqs_ar jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cost_comparison jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS featured_doctors jsonb DEFAULT '[]'::jsonb;

-- Update the Cardiology treatment with some sample data to verify the UI
UPDATE public.treatments
SET 
  faqs = '[
    {"question": "Is Cardiology surgery safe in India for foreign patients?", "answer": "Yes, India has JCI and NABH accredited hospitals with top-tier international standards for Cardiology, ensuring safety and high success rates for foreign patients."},
    {"question": "How much does Cardiology treatment cost in India?", "answer": "The cost is significantly lower, offering up to 60-80% savings compared to Western countries, without compromising on healthcare quality."}
  ]'::jsonb,
  cost_comparison = '[
    {"destination": "India (CureSureMedico)", "flag": "🇮🇳", "cost": "$3,500 - $6,500", "quality": "JCI / NABH Accredited", "wait_time": "Zero Wait Time", "highlight": true},
    {"destination": "Turkey", "flag": "🇹🇷", "cost": "$6,000 - $9,500", "quality": "JCI Accredited", "wait_time": "Zero Wait Time", "highlight": false},
    {"destination": "USA / UK", "flag": "🇺🇸", "cost": "$25,000 - $45,000+", "quality": "JCI / Local", "wait_time": "3-6 Months", "highlight": false, "strikethrough": true}
  ]'::jsonb,
  featured_doctors = '[
    {"name": "Dr. Sarah Johnson", "specialty": "Senior Consultant, Cardiology", "experience": "20+ Years Exp.", "languages": ["English", "French"], "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80"},
    {"name": "Dr. Amit Patel", "specialty": "Chief Cardiothoracic Surgeon", "experience": "25+ Years Exp.", "languages": ["English", "Hindi"], "image": "https://images.unsplash.com/photo-1537368910025-702800a422eb?auto=format&fit=crop&w=200&q=80"}
  ]'::jsonb
WHERE slug = 'cardiology';
