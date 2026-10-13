import type { Bike } from '../api/bikes';
import type { Rental } from '../api/rentals';

const labels: Record<Bike['type'], string> = { city: 'Citybike', mountainbike: 'Mountainbike', 'e-bike': 'E-Bike' };

type Props = { rentals: Rental[]; onReturn: (rental: Rental) => void };

export default function RentalList({ rentals, onReturn }: Props) {
  if (!rentals.length) return <div className="empty"><span>↗</span><h3>Alle wieder da.</h3><p>Aktuell gibt es keine offenen Ausleihen.</p></div>;
  return <div className="rental-list" aria-live="polite">{rentals.map(rental => <article className="rental-row" key={rental._id}>
    <span className="rental-symbol">⇄</span><div><h3>{rental.bikeId?.brand ?? 'Fahrrad nicht vorhanden'}</h3><p>{rental.customerName} · {rental.bikeId ? labels[rental.bikeId.type] : ''}</p></div>
    <div className="rental-date"><small>Ausgeliehen am</small><span>{new Date(rental.rentedAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
    <button className="secondary" disabled={!rental.bikeId} onClick={() => onReturn(rental)}>Zurückgeben ↙</button>
  </article>)}</div>;
}
