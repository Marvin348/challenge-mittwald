import type { Bike } from '../api/bikes';

const labels: Record<Bike['type'], string> = { city: 'Citybike', mountainbike: 'Mountainbike', 'e-bike': 'E-Bike' };

function BikeIllustration({ type }: { type: Bike['type'] }) {
  const color = type === 'e-bike' ? '#b77a41' : type === 'mountainbike' ? '#526e85' : '#447661';
  return <svg viewBox="0 0 320 180" aria-hidden="true" className="bike-art">
    <ellipse cx="162" cy="155" rx="125" ry="7" fill="#000" opacity=".05" />
    <g fill="none" stroke="#283c35" strokeWidth="5"><circle cx="73" cy="112" r="39" /><circle cx="249" cy="112" r="39" /></g>
    <g fill="none" stroke="#84948b" strokeWidth="1"><circle cx="73" cy="112" r="32" /><circle cx="249" cy="112" r="32" /><path d="M73 80v64m-32-32h64m144-32v64m-32-32h64" /></g>
    <g fill="none" stroke={color} strokeWidth="7" strokeLinejoin="round"><path d={`M73 112l43-63 41 63H73l${type === 'city' ? '140-25' : '135-62'} 41 62M116 49l92 1m-51 62-38-72m89 10-7-24h23`} /></g>
    <path d="M103 38h29m22 74 15 13h13" fill="none" stroke="#283c35" strokeWidth="6" strokeLinecap="round" />
    {type === 'e-bike' && <path d="m179 62-17 30" stroke="#283c35" strokeWidth="10" strokeLinecap="round" />}
  </svg>;
}

type Props = { bike: Bike; onRent: (bike: Bike) => void };

export default function BikeCard({ bike, onRent }: Props) {
  const rented = bike.status === 'rented';
  const lowBattery = bike.type === 'e-bike' && (bike.batteryLevel ?? 0) < 20;
  return <article className="bike-card">
    <div className={`bike-visual ${bike.type}`}><span className={`badge ${rented ? 'out' : lowBattery ? 'low' : ''}`}><i />{rented ? 'Unterwegs' : lowBattery ? 'Akku laden' : 'Verfügbar'}</span><span className="bike-number">#{bike._id.slice(-4).toUpperCase()}</span><BikeIllustration type={bike.type} /></div>
    <div className="card-body"><div className="card-title"><div><span className="type-label">{labels[bike.type]}</span><h3>{bike.brand}</h3></div><span className="size">{bike.frameSize}</span></div>
      <div className="details"><span>↳ {bike.rowNumber == null ? 'Auf Tour' : `Reihe ${bike.rowNumber}`}</span><span>{bike.type === 'e-bike' ? `ϟ ${bike.batteryLevel ?? 0} % Akku` : 'Ohne Motor'}</span></div>
      <button className={rented || lowBattery ? 'unavailable' : 'primary'} disabled={rented || lowBattery} onClick={() => onRent(bike)}>{rented ? 'Aktuell ausgeliehen' : lowBattery ? 'Nicht ausleihbar' : <>Fahrrad ausleihen <span>↗</span></>}</button>
    </div>
  </article>;
}
