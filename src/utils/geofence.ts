/**
 * Faculty of Public Health, Khon Kaen University (KKU)
 * Geofencing & Boundary Verification Utilities
 */

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

// Center of Faculty of Public Health, Khon Kaen University
export const FACULTY_PH_CENTER: GeoCoordinate = {
  lat: 16.4690,
  lng: 102.8272,
};

// Maximum allowed radius in meters from Faculty of Public Health center (covers all buildings, labs, car park, gardens)
export const FACULTY_PH_MAX_RADIUS_METERS = 300;

// Bounding box for Faculty of Public Health KKU
export const FACULTY_PH_BOUNDS = {
  minLat: 16.4668,
  maxLat: 16.4712,
  minLng: 102.8252,
  maxLng: 102.8292,
};

// Polygon boundary coordinates for Leaflet display
export const FACULTY_PH_POLYGON: [number, number][] = [
  [16.4705, 102.8258],
  [16.4706, 102.8286],
  [16.4674, 102.8288],
  [16.4673, 102.8260],
];

// Calculate Haversine distance in meters between two lat/lng points
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Validates if the given coordinates fall within the Faculty of Public Health, KKU area.
 */
export function isInsideFacultyOfPublicHealth(lat: number, lng: number): boolean {
  // Check bounding box
  const inBoundingBox =
    lat >= FACULTY_PH_BOUNDS.minLat &&
    lat <= FACULTY_PH_BOUNDS.maxLat &&
    lng >= FACULTY_PH_BOUNDS.minLng &&
    lng <= FACULTY_PH_BOUNDS.maxLng;

  if (!inBoundingBox) {
    return false;
  }

  // Check radius from central point
  const distance = calculateDistanceMeters(
    lat,
    lng,
    FACULTY_PH_CENTER.lat,
    FACULTY_PH_CENTER.lng
  );

  return distance <= FACULTY_PH_MAX_RADIUS_METERS;
}

export const GEOFENCE_ERROR_MESSAGE = {
  th: 'ตำแหน่งที่เลือกอยู่นอกพื้นที่คณะสาธารณสุขศาสตร์ มหาวิทยาลัยขอนแก่น กรุณาเลือกตำแหน่งภายในพื้นที่ที่กำหนด',
  en: 'The selected location is outside the Faculty of Public Health, Khon Kaen University area. Please select a location within the designated area.',
};

export interface PublicHealthSpot {
  id: string;
  nameTh: string;
  nameEn: string;
  lat: number;
  lng: number;
  locationType: 'building' | 'parking_lot' | 'courtyard' | 'library' | 'student_club' | 'central_laboratory' | string;
  zone?: string;
}

export const FACULTY_PH_SPOTS: PublicHealthSpot[] = [
  {
    id: 'ph-b1',
    nameTh: 'อาคาร 1 (อรุณ จิรวัฒน์กุล)',
    nameEn: 'Building 1 (Arun Jirawongkul)',
    lat: 16.4691,
    lng: 102.8272,
    locationType: 'building',
  },
  {
    id: 'ph-b2',
    nameTh: 'อาคาร 2 (เลื่อน สุริหาร)',
    nameEn: 'Building 2 (Luean Suriharn)',
    lat: 16.4694,
    lng: 102.8268,
    locationType: 'building',
  },
  {
    id: 'ph-parking',
    nameTh: 'ลานจอดรถ คณะสาธารณสุขศาสตร์',
    nameEn: 'Faculty of Public Health Parking Lot',
    lat: 16.4696,
    lng: 102.8275,
    locationType: 'parking_lot',
  },
  {
    id: 'ph-kasalong',
    nameTh: 'ลานกาสะลอง',
    nameEn: 'Kasalong Courtyard',
    lat: 16.4689,
    lng: 102.8270,
    locationType: 'courtyard',
  },
  {
    id: 'ph-library',
    nameTh: 'ห้องสมุดคณะสาธารณสุขศาสตร์',
    nameEn: 'Faculty of Public Health Library',
    lat: 16.4692,
    lng: 102.8276,
    locationType: 'library',
  },
  {
    id: 'ph-student-club',
    nameTh: 'สโมสรนักศึกษาคณะสาธารณสุขศาสตร์',
    nameEn: 'Faculty of Public Health Student Club',
    lat: 16.4687,
    lng: 102.8273,
    locationType: 'student_club',
  },
  {
    id: 'ph-central-lab',
    nameTh: 'ห้องปฏิบัติการกลาง คณะสาธารณสุขศาสตร์',
    nameEn: 'Faculty of Public Health Central Laboratory',
    lat: 16.4693,
    lng: 102.8265,
    locationType: 'central_laboratory',
  },
];

export function findNearestPublicHealthSpot(
  lat: number,
  lng: number
): { spot: PublicHealthSpot; distanceMeters: number } {
  let nearestSpot = FACULTY_PH_SPOTS[0];
  let minDistance = Infinity;

  for (const spot of FACULTY_PH_SPOTS) {
    const dist = calculateDistanceMeters(lat, lng, spot.lat, spot.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestSpot = spot;
    }
  }

  return { spot: nearestSpot, distanceMeters: Math.round(minDistance) };
}
