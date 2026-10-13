import type { Bike } from '../api/bikes';
import BikeCard from './BikeCard';

type Props = { bikes: Bike[]; loading: boolean; onRent: (bike: Bike) => void };

export default function BikeList({ bikes, loading, onRent }: Props) {
  if (!bikes.length) return <div className="empty"><span>↗</span><h3>{loading ? 'Fahrräder werden geladen …' : 'Keine passenden Fahrräder'}</h3><p>Ändere deine Suche oder setze die Filter zurück.</p></div>;
  return <div className="grid" aria-live="polite">{bikes.map(bike => <BikeCard key={bike._id} bike={bike} onRent={onRent} />)}</div>;
}
