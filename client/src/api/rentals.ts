import { request } from './http';
import type { Bike } from './bikes';

export type Rental = {
  _id: string;
  bikeId: Bike | null;
  customerName: string;
  rentedAt: string;
};

export function getActiveRentals() {
  return request<unknown>('/rentals').then(data => {
    if (!Array.isArray(data)) throw new Error('Backend hat keine gültige Ausleihliste geliefert.');
    return data as Rental[];
  });
}

export function rentBike(bikeId: string, customerName: string) {
  return request<Rental>('/rentals', {
    method: 'POST',
    body: JSON.stringify({ bikeId, customerName }),
  });
}

export function returnBike(rentalId: string) {
  return request<Rental>(`/rentals/${rentalId}/return`, { method: 'POST' });
}
