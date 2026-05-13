export function getValidIcon(iconName: string | undefined | null): string {
  if (!iconName) return 'medical_services';
  
  const iconLower = iconName.toLowerCase().trim();
  
  // Mapping of common medical terms that aren't valid material symbols
  // to their closest valid material symbols outlined equivalents.
  const map: Record<string, string> = {
    'kidney': 'water_drop', // or 'science' or 'medical_services'
    'heart': 'favorite',
    'brain': 'psychology',
    'lungs': 'air',
    'lung': 'air',
    'stomach': 'restaurant',
    'liver': 'science',
    'eye': 'visibility',
    'eyes': 'visibility',
    'tooth': 'dentistry',
    'teeth': 'dentistry',
    'dental': 'dentistry',
    'bone': 'orthopedics',
    'ortho': 'orthopedics',
    'cancer': 'coronavirus', // or oncology
    'oncology': 'coronavirus',
    'hair': 'content_cut',
    'fertility': 'child_care',
    'ivf': 'child_care',
    'baby': 'child_friendly',
    'spine': 'accessibility_new',
    'surgery': 'healing',
    'plastic': 'face_retouching_natural',
    'cosmetic': 'face_retouching_natural',
    'skin': 'spa',
    'weight': 'monitor_weight',
    'bariatric': 'monitor_weight',
    'blood': 'bloodtype',
    'neurology': 'psychology',
    'cardiology': 'favorite'
  };

  return map[iconLower] || iconLower;
}
