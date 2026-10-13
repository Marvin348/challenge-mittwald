import type { BikeFilters as Filters } from '../api/bikes';

type Props = { filters: Filters; onChange: (filters: Filters) => void };

export default function BikeFilters({ filters, onChange }: Props) {
  const update = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <form className="filters" role="search" onSubmit={event => event.preventDefault()}>
      <label className="search"><span>⌕</span><input type="search" placeholder="Nach Marke suchen …" aria-label="Nach Marke suchen" value={filters.search} onChange={event => update('search', event.target.value)} /></label>
      <select aria-label="Fahrradtyp" value={filters.type} onChange={event => update('type', event.target.value)}><option value="">Alle Fahrradtypen</option><option value="city">Citybike</option><option value="mountainbike">Mountainbike</option><option value="e-bike">E-Bike</option></select>
      <select aria-label="Verfügbarkeit" value={filters.status} onChange={event => update('status', event.target.value)}><option value="">Alle Status</option><option value="available">Verfügbar</option><option value="rented">Ausgeliehen</option></select>
      <button type="button" className="reset" onClick={() => onChange({ search: '', type: '', status: '' })}>Zurücksetzen</button>
    </form>
  );
}
