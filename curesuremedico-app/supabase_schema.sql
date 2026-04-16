-- SQL Script to copy-paste into Supabase SQL Editor
-- This will create the required tables and insert the exact base data

-- 1. Treatments Table
DROP TABLE IF EXISTS treatments CASCADE;
CREATE TABLE IF NOT EXISTS treatments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT,
    short_description TEXT,
    starting_price TEXT,
    hero_image_url TEXT,
    overview_title TEXT,
    overview_description TEXT,
    success_rate TEXT,
    quick_response_time TEXT,
    cost_saving TEXT,
    procedures JSONB DEFAULT '[]'::jsonb
);

INSERT INTO treatments (name, slug, icon_name, short_description, starting_price, hero_image_url, overview_title, overview_description, success_rate, quick_response_time, cost_saving, procedures) VALUES
('Cardiology', 'cardiology', 'favorite', 'Heart valve replacement, Bypass surgery, and minimally invasive cardiac procedures.', 'Ask for quote', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeea0EfBbDmganpqH8RHuVbEVZusOsGw9NN5St2B3x39fLu396UapPEs5FK25iuqJdnkZa5LyyBtzTtF8KSfSF8VRrlLao4g8IwvLXM7bRxucbpRZjwh7Amh0aK2WatMvjhbgTqutbAOQrc1ZAz3B46k42P5X1mxjsNF0Jn4km-LbHidY2_i-o9e4fb-IskGtFNQnWuOY0ywyizDicgAFQHj27DJfg4nxl2dwjgFyjf1ijkMeb4FYjIpn6zL_nGNAYRjgW2KU9qLQ', 'Specialized Heart Surgery & Global Care', 'CureSureMedico connects patients with world-renowned cardiology hubs in India and Turkey. These destinations offer a unique blend of highly skilled surgeons—many trained in the UK and USA—and state-of-the-art infrastructure that rivals Western institutions. Our partner hospitals consistently report success rates above 98% for complex bypass and valve surgeries, providing a sanctuary of precision and recovery for African patients seeking the very best for their hearts.', '15k+', '24h', '80%', '[{"name":"Coronary Artery Bypass (CABG)","description":"Advanced open-heart or minimally invasive surgery to improve blood flow to the heart muscle.","price":"$5,500","icon":"monitor_heart"}, {"name":"Valve Replacement","description":"Replacement of diseased heart valves with high-grade biological or mechanical prosthetics.","price":"$7,200","icon":"settings_heart"}, {"name":"Angioplasty","description":"Minimally invasive procedure to open narrowed arteries using stents and balloons.","price":"$3,800","icon":"healing"}]'::jsonb),
('Orthopedics', 'orthopedics', 'orthopedics', 'Precision robotic knee and hip replacements using the latest biocompatible materials.', 'Ask for quote', '', '', '', '', '', '', '[]'::jsonb),
('Oncology', 'oncology', 'oncology', 'Comprehensive cancer care including CyberKnife, Proton therapy, and advanced immunotherapy.', 'Ask for quote', '', '', '', '', '', '', '[]'::jsonb),
('Fertility/IVF', 'fertility-ivf', 'child_care', 'High-success rate IVF, ICSI, and egg donation programs in world-class clinics.', 'Ask for quote', '', '', '', '', '', '', '[]'::jsonb),
('Neurology', 'neurology', 'neurology', 'Expert neurosurgery for brain and spine conditions using navigation-guided systems.', 'Ask for quote', '', '', '', '', '', '', '[]'::jsonb),
('Bariatric Surgery', 'bariatric-surgery', 'monitor_weight', 'Advanced metabolic surgeries and gastric sleeve procedures for long-term health.', 'Ask for quote', '', '', '', '', '', '', '[]'::jsonb);

-- 2. Packages Table
DROP TABLE IF EXISTS packages CASCADE;
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    badge_text TEXT,
    description TEXT,
    price TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    image_url TEXT
);

INSERT INTO packages (title, badge_text, description, price, image_url) VALUES
('Full Executive Check-up', 'Most Popular', 'Comprehensive 2-day screening including advanced cardiac imaging, metabolic profile, and cancer marker screening at a premium facility.', '$1,200', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt-M-PbLDQArKrmT1S0nDrS-OCfB_pnSE3Y94_yvvtwXe2C5zWPrlzs7ifj6wniyO-QeETc79lfDIwi3qBrZVKmvbddznWVVwEncjMNIkQvLNH1dSWU6c_w91ICsI9ARvCtz12brJPPAdOoo_iQM8PMqsC4Hn0TdirOIpn5FnirbkJOsEJBwzwC7w6W7ICJffWxxKDbWwJv02aocAyYCJIX-6_sj19PxJEnPKWi4wfJnsTfAcvvrwP2LTrD4ILuo3Fve0WIeyzDKM'),
('Cardiac Excellence Suite', 'Exclusive Suite', 'All-inclusive cardiac intervention package including premium hospital stay, specialist fees, and dedicated recovery concierge.', '$8,500', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9GvupbFXOLPnff-BWCeW_OTFSuf2uOdLE7ro803jro7tDl_J3-F7Tgb6N2jr11gxntIZJu-2xLJAmhLy69kSp3MB5AYbBnQK0ZbU4uM668WgoyquazwmI30gMlNQp99ckEgInsg6js6a2X6WaLU_otEyaKoTwrmsC6zdVjJUf0HGaDuYmXjCTbJcxEanSTv7aJ87khZQXkb-CBmKTyboY8yX9wL6grlGuVfB7Tez4uiiFAaT45MPNqCmtKWDJYjb9KWA2nYXcOGA'),
('IVF Foundation Package', 'Family Path', 'One full cycle of IVF including medications, egg retrieval, and embryo transfer at a top fertility center in South Africa or India.', '$4,500', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsx_x_IJNt7zANd24MQ22fGxxSI0SnjLd5Wl8K4HoDdjscIO2GZCEEMbyW0MbhDvP25y_xnPFq17Sgo-bGbedObDIxUeszS74EEwi-rXYqe0zPR1V5q9hBShlabQ2sucQxud2SAmFyzlMHo7VO3-pnj9l1Qgeb9UEnvkxjR-rDYeK1l_epxxiq_jWqGYq9iR5P5fHNQoiV7c2SAJElbbXJukpWlJ0Kbnke8pDJRqhJNToFo7AdWQHT6QpbHr48t1Hn0fQOHlaKneM');

-- 3. Blog Posts Table
DROP TABLE IF EXISTS blog_posts CASCADE;
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    author TEXT,
    author_role TEXT,
    author_image TEXT,
    published_date DATE,
    read_time TEXT,
    is_featured BOOLEAN DEFAULT false
);

INSERT INTO blog_posts (title, slug, category, excerpt, content, image_url, author, author_role, author_image, published_date, read_time, is_featured) VALUES
('Navigating Precision Oncology: New Hope for Patients in Nairobi and Beyond', 'navigating-precision-oncology', 'Featured', 'How genomic testing is revolutionizing personalized cancer care and making international treatments more accessible than ever.', 'Full content goes here...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbINngkspDFP3sh8jnV33cN0tC0RpN5ZmrD9-RWRjiOSMgeltBK4Qm1ogJPArcgOEsQUsqgbM8C4EZhncps9SkbDJWGMJWPbKB1YmvbEdf_sj7pJwsa-aq6YK20GHcxJRWnAoe32WFOTJfPqopP8ZFNSnEuupJDX6c-3qspQm8KZ9-4nLqfkCZyJmtIykSOQ8wFfXCIpbW20NUQ53zrQ5CKTgTha_Hz8vzsg-JbpXuOh9SXpRrhv4AxmN21pggbpjJKe1EwbjD1J0', 'Dr. Amara Okoro', 'Chief Medical Officer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhFa8nvePBdVukk-9mtqC1HODM0ZDIHY2hP9z5oln0dZS0l-gtIDCyQTpS6yJuW7m_nBhYpbTQ-N4CYSYxQmWy0hA8c_0RZBDUbVHwkaWuV8FRUYjP71WFr03W6sS3UYnSNDw5NgHLgEE_xP9l65Q3EM0aFU151Jm6tQvCjQ3GfOmx08OvwNj6OiA-ZnbBcwgIPCeN6SezzNZcQ_ReqqEvXH0DOYqc0YJ284B99Fg7cSY8RxdDQ5dqYGd0T0OP32TfX0I5QPFnIU', '2024-11-15', '10 min', true),
('The Ultimate Checklist for Medical Visa Applications', 'ultimate-checklist-medical-visa', 'Medical Travel Tips', 'Ensure your journey is smooth. From medical documentation to financial proof, here''s everything you need for India and UAE travel.', 'Full content...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjwhBievID-Dmqe_gorOw2Iv0on9lW5gZe12o8Ua7kHxqmTIDf8ti-SNtrJj2hCA3TIUg_P5hPRxNff5qDW8dQBZId1mKsSEhu8_iUAZlEnTuSafuRLPqHz-lbKHQSVkVkmy0qCYDgXhhTGwd0HJaZ5zggbUARiFazqbb7laFNxdO5ecB8z0vpEqRkPk6s4HmiwTfwQo4RJpfwMCrz4SlWgQ45pk1RAUX04M3BcW5F-WDbDsFzYyUFodAS-MXKVfYNq9VjwSvwyY0', 'CSM Editorial', 'Editor', '', '2024-11-12', '6 min', false),
('Robotic-Assisted Cardiac Surgery: Minimizing Recovery Time', 'robotic-assisted-cardiac-surgery', 'Treatment Breakthroughs', 'Discover how minimally invasive robotics are helping patients return home in half the time compared to traditional methods.', 'Full content...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcvHgrQaOpVb6-0W8ayeYgOXdnXXV0Rz_E9eXR04tCjOn_hK6-wAGeP3WL8fkm69fCvoyBoChqpRQIJGkeQJ3694g31h3foqakqRdAydsDDNCFjlJCullDlOz7souXaOKAI-GnkkgmNC8Dc5omNfVEiOnFfzFBZSMAh3BDlF-F430-MGwXzUjKPJlOFva4iICwOc3OyPr5RoOpimRgZ_mmebV7MhMw-oU5SODcsMygC2wEndHX7lBR0AmYeFIJZVqhFuLIB4UpPtU', 'CSM Editorial', 'Editor', '', '2024-11-08', '8 min', false),
('From Lagos to Recovery: Kofi''s Hip Replacement Journey', 'kofis-hip-replacement-journey', 'Patient Success Stories', '"I can play with my grandchildren again." A personal look into the emotional and physical journey of medical travel.', 'Full content...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwnFA8T6MsUc7bnPWGey9XrV1iTcy2rl0oa80rfiRXx4XdsV7khUqlaoHOjC4R7Vx5_n24PGHDG1kFHJxvFU8AusoxnIgonnCwoq1MuX6Lkw_Fa9c2ZyeJKoImG_AoD6-3sACj97NHo346mwcBu84j_vVOZh7JeK9iJqlMoqCBguC_L6kJOE0ac4XvMV5teeM1ku_ZToN1RzBzwsGOvLRlJgSl52Z54tMjUG4p6m0yVOKWTyKBm7pzdJHwLsanrTumY8vFOc7E0Ic', 'CSM Editorial', 'Editor', '', '2024-11-05', '5 min', false),
('Clinic Royale: Luxury Meets World-Class Medical Care', 'clinic-royale-luxury-medical', 'Hospital Spotlights', 'A tour inside the Middle East''s most technologically advanced facility, specialized in neurosurgery and rehab.', 'Full content...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC1T1blxW2lIcPBs9qi1jse-x0aazUPMpiHXoJ7QHkMGhgSpn0n8VvSlMFymjJBP61kvOwdyDgwudZSzbj1yk1h1d8Q1ckoag_7YPSAsBhkqZtv3jlNEHuNoiAA_Ww_iwxzrwg1S_E6tltqq8mHSCnCWVYcNFRBakJeQuqxFAihvpoo8yI8d9suYv4o93YuONHnQu5DBYAxb4R5tPt7RbV-ydOc90tuDXX6CErmQuqq4Yj_pVXAerukCXMZhUpOtV_z4aqtPRFTSE', 'CSM Editorial', 'Editor', '', '2024-10-29', '7 min', false),
('Telemedicine: The Bridge to Post-Surgery Care', 'telemedicine-post-surgery', 'Treatment Breakthroughs', 'How CureSureMedico uses remote monitoring to ensure patient safety long after they return home from treatment.', 'Full content...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW8RYXOGdPgmtTZ4_ekScfzqpi1R_q4UMSOLeVEI2jvV6l37lLPWx3c00bivPkXrFlA0GWFgjYiyMs4VzxpCr5sliCM_MNXD_ysclQDrSeXhQ4fYapn4VnxGheFP_clpTBaQFH3-icX-gkIkZIn1HLUyY0EOPHqQG_AJhvhpTKqpCgjOGMLKSQUzrtswJbVl761t4e272JEilRylZlxBcqvzB_cBqRWJ8DhF7ni-J6A6CnDwvXpF20BUHOiHRjaDJIKo27knPLxTk', 'CSM Editorial', 'Editor', '', '2024-10-25', '4 min', false),
('Preparing Your Body for Long-Haul Travel Post-Surgery', 'preparing-body-long-haul-travel', 'Medical Travel Tips', 'Nutrition and exercise tips to manage inflammation and fatigue when traveling back to Africa after your procedure.', 'Full content...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjNMzfwMT01PQQkBQcKcJpxgiU0VPyDB3MGxN9dbJ4bWlUpbG8sjZ5i1Fe9JfFBUBbmO1nzGCpSYRF9KZCOZsBULXy6KX837yS_dGJ_pYzR6Hso_5d5qV2Sx1XLOwswwlYTlpwXo076khaieY7SJt3aL76Xpfy0dvya3GuVbmrOrwoYXnP2iLWUevc3MF4DfSenik8M9n_e4IV7qpXuGBeiGpIaBpPPL-2KlsbeSJpl9KJXKla6ktw8nnD02hZesC_h9UhGWgKvM', 'CSM Editorial', 'Editor', '', '2024-10-21', '9 min', false);

-- 4. Destinations Table
DROP TABLE IF EXISTS destinations CASCADE;
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    country_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    image_url TEXT,
    key_specialists JSONB DEFAULT '[]'::jsonb,
    why_choose_us JSONB DEFAULT '[]'::jsonb,
    success_rate_text TEXT
);

INSERT INTO destinations (country_name, slug, tagline, description, image_url, key_specialists, why_choose_us, success_rate_text) VALUES
('India', 'india', 'World-Class Destination', 'Advanced clinical care meeting compassionate hospitality. Discover why thousands of patients trust India for complex medical journeys.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIlAlvUilvA1fRCjrHLxGOqtmamNiXSsSwa3ZQgIcaJ3oezsOccuwGahCbApDQglpr5TG9DARSmSbUiWpXhF0-yWthZv4Z9pbiwWtv74jW3reAfLj_J1yUM5p9A0S4BAd6qWytido1GTy1fZb2C5hXW79dwFQolBpD1wzU_xozZoXSJyiyfeh-Hxp2bvcyDsjbM1FvTg7OCcEHEgUwO6JJcEQeB4g6vCGU9UZfb8xYZHVImC6uN0MkrfepqCDhUEM1A46acjRq5tw', '["Cardiac", "Oncology", "Orthopedics"]', '[{"title":"JCI Accredited Facilities","description":"Access over 35 JCI-accredited hospitals offering Western-standard medical protocols and sterilization.","icon":"verified_user"}, {"title":"Affordable Precision","description":"Save 60-80% compared to US or UK healthcare costs without compromising on technology or outcomes.","icon":"payments"}, {"title":"Expert Specialists","description":"Consult with world-renowned surgeons, many of whom are trained and board-certified in Europe or the US.","icon":"clinical_notes"}]'::jsonb, '98% Success Rate across cardiac and orthopedic procedures performed last year.'),
('Turkey', 'turkey', 'Aesthetic Specialists', 'A major destination for advanced aesthetics, dental and ophthalmology care.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKZueMGbI54FydD-Tcbmb0AyrODH71vR6TOq6TcwVY4q1kU0E6R2G0OHObQ8aZYjw0id-TS7yjSj852mk2YWnV1rrUMpY0-kbk9VKlckuEJKCDvprxEL0jcxDeI4HH6trbL_lEzsiOGQg0jMiQEDk24mEAkZagrtn3IG3FIATDfHNP41i2QcLc7PAEQQtiTuE4KY9sroKZ8T7e7ioMl_kQfULSsYoHMWCC0NqOvz-FzZzp-5yPefy9YPDN1J50iiNyZJlaWWGJbt0', '["Dental", "Eye Care", "Cosmetic"]', '[]'::jsonb, ''),
('UAE', 'uae', 'Luxury Care', 'Premium patient experience with cutting-edge infrastructure and technology.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpB0kdV3Z9TqZWwdLRizK6sunDdMWj2b_D70hhNL0gIU6AsvFBeJgY8FafzyHqtyF2nVUrx7zZrbOLCu1BHcKJvWsxvw2PTrzuICbj75M9n8-hIIx60HXtAyVWoP5FAK1OkGLPU2PSqY7_9YeXanseng0s9bVSsAzNTZhPmHgs7PI5F5i_SM3hZ51xC3ZbT889UhcLSpbRhWg_62CJpoRgStaF9Lo2NQ4tmD2YXpbfDpNoYmJoXjNWPSEhvtscl0YJg9KbIHl4xgM', '["Genomics", "Sports Med", "VIP Care"]', '[]'::jsonb, ''),
('Thailand', 'thailand', 'Wellness & Surgery', 'Integrated wellness and high-volume surgical expertise in top medical hubs.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdKOjbPACtvdM2SV-MJWCZPaHSvRnjf_puRnHxhXXlNVwgreD4AH7MUmb7Fl5DGdgWoF3IrV0IiGhs3bqlyzuCA5GVirS8zfYMVuALYf0EZvE9fXlofT8oR3EJQZvefrfni9ed6CNFa-slmiw_RHQloCtehEI2mEu6we2wAZ5zQ73NF-SLXxWenAHTUxbmFJI4BV5FxvYzEpdm1rh9G9F97LJi4YwerlILoaLgKyPuDxY0TDqlmw6g8A521D8wxWEDZs7ndK9saNo', '["Fertility", "Wellness", "Joints"]', '[]'::jsonb, '');

-- 5. Hospitals Table
DROP TABLE IF EXISTS hospitals CASCADE;
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    city TEXT,
    country TEXT,
    rating NUMERIC(3,1),
    reviews_count INTEGER,
    accreditations JSONB DEFAULT '[]'::jsonb,
    specialties JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    image_url TEXT,
    logo_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    doctor_count TEXT
);

INSERT INTO hospitals (name, slug, city, country, rating, reviews_count, accreditations, specialties, description, image_url, logo_url, features, doctor_count) VALUES
('Apollo Health City', 'apollo-health-city', 'Hyderabad', 'India', 4.9, 1200, '["JCI", "NABH"]', '["Cardiology", "Organ Transplant", "Robotic Surgery"]', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcmnlZ-j2hY2uuMvjvZ8ON0HIr_gwiHH3-YFvllHFxHlM7hAOpSvZqb8-WBD-O3qgrwvY-pWLCP_Ja3uSD1y7G37p8iAm5LX-IbGp3CSFv95ctE8Tzaq0D43F18lc-ndoLwerv3GyL4D-1Jm1MmGcPa-7sa4rFJr18i1oOtE23koZxf00he2VixOmsgOwP78hU73S5s6qfIv5w-WwEpVxy5DTY4O74emBq8GkeoWXPTKaXjwLsXGIzcEd2EQCUIScHEQTf5MmhsFE', '', '["International Patient Wing", "24/7 Virtual Support"]'::jsonb, '200+ Specialists'),
('Fortis Memorial Research Institute', 'fortis-memorial-research-institute', 'Gurgaon', 'India', 4.8, 850, '["JCI", "NABH"]', '["Oncology", "Neuroscience", "Orthopedics"]', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPd7A8weS9DetbnnOnv1ZMdGYR7uWa5K5htYEoiHec0glW601DqC8v_AeD6FL2O3-Org-dNoCn7WGMwF_5zqNIhzp8nC67JlSAxJZFZXBmJInomI5cqJe6VSIUAUKshQ1N2TeFnj4FaE3KnvBEgtymZYeOUFIJEIwrMFBJS_xSMA8SeGMsPkV12zwP2pfv5q145lr8A1y-To_HPLmki_VLsZNJ-qhArT2JvAxnpVY8fvaJ8LJKspDP_QqNKANBLGk8AlqnNr671ao', '', '["Advanced Robotic Center", "Concierge Travel Desk"]'::jsonb, '150+ Specialists'),
('Medanta - The Medicity', 'medanta-the-medicity', 'Delhi NCR', 'India', 4.7, 920, '["JCI", "NABH"]', '["Cardiology", "Transplants", "Gastroenterology"]', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxeI3OnnB3GTDffjkcWoh8UzerfWQQB01l0r_5yS6pZQxlEkXSmjGWbIzuodi3MJz8uQtpea3b7cB7SUQroEuLXzT73JS4EEXkm9bKPNZxjgmepwYxvjp6DWInoS3X6LoD1Z2c7Dff23u9lx4t-nrtvYEtCHaoavKsZl2Hr3uzowt8-cH6ePkR36xy8f30g_2Ecw2ywTzGZ85QBiLqnNISP5HjalqgOT_jnaFymRfhHtGuur1W3StA35BGnButzKWKD8VW1gWopAE', '', '["Integrated Wellness Suites", "Multilingual Translation Support"]'::jsonb, '300+ Specialists');

-- 6. Patient Stories (Videos) Table
DROP TABLE IF EXISTS patient_stories CASCADE;
CREATE TABLE IF NOT EXISTS patient_stories (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    country TEXT,
    youtube_id TEXT NOT NULL,
    thumbnail_url TEXT
);

INSERT INTO patient_stories (title, country, youtube_id, thumbnail_url) VALUES
('Nigeria | Cardiac Surgery', 'Nigeria', 'zpOULjyy-n8', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLH1TsXo777siMCGhqY88b_R8RWsAMexGU5tTezMcsPCOqBz0wRLwydKNFhU_crbeH9m0OLv-QqAzbBHEUn8izYLO-0T1CxdFXqJeHKiT_zW-yvd-gC2TxmHx0n5-NaBmWxT0HKS5tyehDr1N3TcEp_gNJio13HqphblIGv4FMEBqVVLGG0zLYdXnQ07qL_wOwYoSDqZQV0_rQwsj-a6kfXhMxIMKT9u9h3i7-1fAAbo8xP5pQKBWO18FYOFUrhfbkTXxa8ZF9CrY'),
('Virtual Facility Tour', 'Global', 'M_v3aO7gJ_U', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebJ8wQ_zCwYl8zd_DZW9MVoLnE1xAA36MOERssA2I6BYa2ggzStbScync7_P7A5KJYbSeko8sVxAOyQA53rYsm0ig_uaC3R0akvNKgSxnM0l763r20bZ-A-YqZZlSBwFmgdu3J6e96BlAw4iD4_Ykbg-dPa2kWNA7B-sVdko2NiqR5D-yfgciBBpynbCm_GMeE2TWxLvcv1svm6LLmd1fl2x3nNRkx80rfDguY2c2SBXbzvplv0x0cqRr1w4VfHFYLw0MVLTRJl0'),
('Kenya | Orthopedics', 'Kenya', 'bYy2vI2eGkQ', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQZaDpfpFFF3DOO2smjkpcs7r0C6tdDF2Vcphyaq6G58zXtczDhuoGkMPl6yyinartPyId8RQXQSr4TcRXeYB7b70wrNt1qC9MOAnTkJAW_lv66lIytC7o77UXxyKBMeodqZh52b0-mC5HI_riy-NCJfZQAuqIDDCc90rSe_poSmx96fGkVL9cMxygfaT3r4i03kF5y09p_gfV2pEJd1NE47wSvGWB0ygovD6PEWrQjrQhXB6WfCSvl-e59_bAKWmzUydVMM45kgc'),
('Premium Recovery Suite', 'Global', 'lUjXntJ1G9k', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW_95pC0t2W78L7khno0jUu0QLDdJ4IIAPUZqBZMqtfZrUuPbdnDDOsDmM6INuajOyEL-IJTKVCmQCCDrRsvokHS0_DtWAf2McGu64V5h95g8QSifB6gz0AB76_q5UCOSeY95aJ7xxtwRjGqxFEcxgqMy8kGaENjdI_TuV-_Yr_M-2__w_TK7LQw4PyWqLHAU7BxpFJwJrW4qmVw70ZmVBAecGb_BDW0vJ2WhQX9yNHzzxwMsEY5dlUc918Tzk-fQqjmP_Tv7TgSg');

-- 7. Leads Table (used by /quote form)
DROP TABLE IF EXISTS leads CASCADE;
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    condition TEXT,
    preferred_destination TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO leads (name, email, phone, condition, preferred_destination, notes) VALUES
('Jean Dupont', 'jean.dupont@example.com', '+33 612 34 56 78', 'Cardiology', 'India', 'Needs an urgent second opinion.'),
('Aisha Kone', 'aisha.kone@example.com', '+225 01 23 45 67', 'Fertility / IVF', 'Turkey', 'Requested package details and timelines.');

-- 8. Enquiries Table (Dashboard Panel tracking)
DROP TABLE IF EXISTS enquiries CASCADE;
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    inquiry_id TEXT,
    inquiry_type TEXT NOT NULL,
    status TEXT DEFAULT 'Awaiting Quote',
    hospital_name TEXT,
    case_manager TEXT,
    case_manager_avatar TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Patient Documents (records logic)
DROP TABLE IF EXISTS patient_documents CASCADE;
CREATE TABLE IF NOT EXISTS patient_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    category TEXT DEFAULT 'Medical Record',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on the new tables
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;

-- Enquiries Policies
DROP POLICY IF EXISTS "Users can view their own enquiries" ON enquiries;
CREATE POLICY "Users can view their own enquiries" ON enquiries 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own enquiries" ON enquiries;
CREATE POLICY "Users can insert their own enquiries" ON enquiries 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Patient Documents Policies
DROP POLICY IF EXISTS "Users can view their own documents" ON patient_documents;
CREATE POLICY "Users can view their own documents" ON patient_documents 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own documents" ON patient_documents;
CREATE POLICY "Users can insert their own documents" ON patient_documents 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 11. STORAGE BUCKET CONFIGURATION
-- ==========================================

-- Insert the bucket explicitly
INSERT INTO storage.buckets (id, name, public) 
VALUES ('patient-documents', 'patient-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access and uploads for authenticated users to the patient-documents bucket
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON storage.objects;
CREATE POLICY "Enable insert for authenticated users" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'patient-documents');

DROP POLICY IF EXISTS "Enable select for public/authenticated" ON storage.objects;
CREATE POLICY "Enable select for public/authenticated" ON storage.objects
    FOR SELECT USING (bucket_id = 'patient-documents');

