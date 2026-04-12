export interface Plant {
  id: string;
  name: string;
  species: string;
  stage: 'seed' | 'sprout' | 'vegetative' | 'flowering' | 'fruiting' | 'mature';
  plantedDate: string;
  lastWatered: string;
  lastFertilized: string;
  waterFrequency: number; // days
  fertilizerFrequency: number; // days
  notes: string;
  photos: string[];
  health: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface CareLog {
  id: string;
  plantId: string;
  type: 'water' | 'fertilize' | 'prune' | 'harvest' | 'note';
  date: string;
  notes: string;
  photo?: string;
}

export interface DashboardStats {
  totalPlants: number;
  needsWater: number;
  needsFertilizer: number;
  averageHealth: number;
}

export const PLANT_STAGES = [
  { value: 'seed', label: 'Seed', color: '#8B4513' },
  { value: 'sprout', label: 'Sprout', color: '#90EE90' },
  { value: 'vegetative', label: 'Vegetative', color: '#228B22' },
  { value: 'flowering', label: 'Flowering', color: '#FF69B4' },
  { value: 'fruiting', label: 'Fruiting', color: '#FF6347' },
  { value: 'mature', label: 'Mature', color: '#2E8B57' },
] as const;

export const HEALTH_STATUSES = [
  { value: 'excellent', label: 'Excellent', color: '#22c55e' },
  { value: 'good', label: 'Good', color: '#84cc16' },
  { value: 'fair', label: 'Fair', color: '#eab308' },
  { value: 'poor', label: 'Poor', color: '#ef4444' },
] as const;
