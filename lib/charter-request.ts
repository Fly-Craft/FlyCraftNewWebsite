export type LegPayload = {
  from: string;
  to: string;
  date: string;
  time: string;
  distanceNm: number;
  speedKts: number;
  flightTime: string;
  arrivalLocal: string;
  /** Per-leg amenity requests (multi-leg/round trips with "All Trips" off). */
  requests?: string;
  /** Per-leg passenger count (multi-leg/round trips with "All Trips" off). */
  passengers?: string | number;
};

export type CharterRequestPayload = {
  tripType: string;
  legs: LegPayload[];
  passengers: string | number;
  under18?: number;
  under2?: number;
  options: string[];
  pets?: number | null;
  slidingHours?: number | null;
  catering: string[];
  allergyDetails?: string;
  notes?: string;
  /** "Individual" or "Broker". */
  clientType?: string;
  /** Brokerage name — required when clientType is "Broker". */
  brokerage?: string;
  name: string;
  email?: string;
  phone?: string;
};
