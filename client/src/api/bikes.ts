import { request } from './http';

export type Bike = {
  _id: string;
  brand: string;
  type: 'city' | 'mountainbike' | 'e-bike';
  frameSize: string;
  batteryLevel: number | null;
  status: 'available' | 'rented';
  rowNumber: number | null;
};

export type BikeFilters = { search: string; type: string; status: string };

async function getBikeList(path: string): Promise<Bike[]> {
  const data = await request<unknown>(path);
  if (!Array.isArray(data)) throw new Error('Backend hat keine gültige Fahrradliste geliefert.');
  return data as Bike[];
}

export function getBikes(): Promise<Bike[]> {
  return getBikeList('/bikes');
}

export function searchBikes(filters: BikeFilters) {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.type) params.set('type', filters.type);
  if (filters.status) params.set('status', filters.status);
  return getBikeList(`/bikes?${params}`);
}
