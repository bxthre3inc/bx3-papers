import type { Plant, CareLog } from './types';

class GrowBroStore {
  private plants: Plant[] = [];
  private careLogs: CareLog[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const plants = localStorage.getItem('growbro_plants');
      const logs = localStorage.getItem('growbro_logs');
      if (plants) this.plants = JSON.parse(plants);
      if (logs) this.careLogs = JSON.parse(logs);
    }
  }

  private save() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('growbro_plants', JSON.stringify(this.plants));
      localStorage.setItem('growbro_logs', JSON.stringify(this.careLogs));
    }
  }

  getPlants(): Plant[] {
    return [...this.plants];
  }

  getPlant(id: string): Plant | undefined {
    return this.plants.find(p => p.id === id);
  }

  addPlant(plant: Omit<Plant, 'id'>): Plant {
    const newPlant: Plant = {
      ...plant,
      id: `plant_${Date.now()}`,
    };
    this.plants.push(newPlant);
    this.save();
    return newPlant;
  }

  updatePlant(id: string, updates: Partial<Plant>): Plant | null {
    const index = this.plants.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.plants[index] = { ...this.plants[index], ...updates };
    this.save();
    return this.plants[index];
  }

  deletePlant(id: string): boolean {
    const index = this.plants.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.plants.splice(index, 1);
    this.careLogs = this.careLogs.filter(l => l.plantId !== id);
    this.save();
    return true;
  }

  getCareLogs(plantId?: string): CareLog[] {
    if (plantId) {
      return this.careLogs.filter(l => l.plantId === plantId).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return [...this.careLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  addCareLog(log: Omit<CareLog, 'id'>): CareLog {
    const newLog: CareLog = {
      ...log,
      id: `log_${Date.now()}`,
    };
    this.careLogs.push(newLog);
    
    if (log.type === 'water') {
      this.updatePlant(log.plantId, { lastWatered: log.date });
    }
    if (log.type === 'fertilize') {
      this.updatePlant(log.plantId, { lastFertilized: log.date });
    }
    
    this.save();
    return newLog;
  }

  deleteCareLog(id: string): boolean {
    const index = this.careLogs.findIndex(l => l.id === id);
    if (index === -1) return false;
    this.careLogs.splice(index, 1);
    this.save();
    return true;
  }

  getStats() {
    const now = new Date();
    const needsWater = this.plants.filter(p => {
      if (!p.lastWatered) return true;
      const lastWatered = new Date(p.lastWatered);
      const daysSince = (now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince >= p.waterFrequency;
    }).length;

    const needsFertilizer = this.plants.filter(p => {
      if (!p.lastFertilized) return true;
      const lastFertilized = new Date(p.lastFertilized);
      const daysSince = (now.getTime() - lastFertilized.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince >= p.fertilizerFrequency;
    }).length;

    const healthMap: Record<string, number> = { excellent: 4, good: 3, fair: 2, poor: 1 };
    const healthSum = this.plants.reduce((sum, p) => sum + (healthMap[p.health] || 3), 0);
    const avgHealth = this.plants.length ? healthSum / this.plants.length : 0;

    return {
      totalPlants: this.plants.length,
      needsWater,
      needsFertilizer,
      avgHealth: Math.round(avgHealth * 10) / 10,
    };
  }

  seedDemo() {
    if (this.plants.length > 0) return;
    
    this.plants = [
      {
        id: 'plant_1',
        name: 'Cherry Tomato',
        species: 'Solanum lycopersicum',
        stage: 'flowering',
        plantedDate: '2026-02-15',
        lastWatered: '2026-04-01',
        lastFertilized: '2026-03-15',
        waterFrequency: 3,
        fertilizerFrequency: 14,
        notes: 'Doing great! Lots of flowers developing.',
        photos: [],
        health: 'excellent',
      },
      {
        id: 'plant_2',
        name: 'Genovese Basil',
        species: 'Ocimum basilicum',
        stage: 'vegetative',
        plantedDate: '2026-03-01',
        lastWatered: '2026-04-02',
        lastFertilized: '2026-03-25',
        waterFrequency: 2,
        fertilizerFrequency: 21,
        notes: 'Harvest soon for pesto.',
        photos: [],
        health: 'good',
      },
      {
        id: 'plant_3',
        name: 'Strawberry Everbearing',
        species: 'Fragaria x ananassa',
        stage: 'fruiting',
        plantedDate: '2026-01-20',
        lastWatered: '2026-03-28',
        lastFertilized: '2026-03-10',
        waterFrequency: 2,
        fertilizerFrequency: 30,
        notes: 'First fruits appearing!',
        photos: [],
        health: 'fair',
      },
    ];

    this.careLogs = [
      { id: 'log_1', plantId: 'plant_1', type: 'water', date: '2026-04-01', notes: 'Regular watering' },
      { id: 'log_2', plantId: 'plant_2', type: 'water', date: '2026-04-02', notes: 'Soil was dry, top 2 inches' },
      { id: 'log_3', plantId: 'plant_1', type: 'fertilize', date: '2026-03-15', notes: 'Organic tomato fertilizer applied' },
      { id: 'log_4', plantId: 'plant_3', type: 'note', date: '2026-03-30', notes: 'Noticed some nutrient deficiency signs' },
    ];

    this.save();
  }
}

export const store = new GrowBroStore();
