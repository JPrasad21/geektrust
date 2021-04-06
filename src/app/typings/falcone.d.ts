export interface Planets {
  name: string;
  distance: number;
}
export interface PlanetsViewModel extends Planets {
  selectedVehicle: Vehicles;
  timeTaken: number;
  isSelected: boolean;
}
export interface Vehicles {
  name: string;
  total_no: number;
  max_distance: number;
  speed: number;

}
export interface TokenResponse {
  token: string;
}

export interface FindFalconeRequest {
  token: string;
  planet_names: string[];
  vehicle_names: string[];
}

export interface FindFalconeResponse {
  planet_name: string;
  status?: string;
  error? : string;
}
