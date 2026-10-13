import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getBikes, searchBikes, type Bike, type BikeFilters } from './api/bikes';
import { getActiveRentals, rentBike, returnBike, type Rental } from './api/rentals';
import ActionDialog from './components/ActionDialog';
import BikeFiltersPanel from './components/BikeFilters';
import BikeList from './components/BikeList';
import RentalList from './components/RentalList';

type View = 'bikes' | 'rentals';
type Action = { kind: 'rent' | 'return'; id: string };

export default function App() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filters, setFilters] = useState<BikeFilters>({ search: '', type: '', status: '' });
  const [view, setView] = useState<View>('bikes');
  const [action, setAction] = useState<Action | null>(null);
  const [connection, setConnection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ message: string; error?: boolean } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const [allBikes, matchingBikes, activeRentals] = await Promise.all([
          getBikes(),
          searchBikes(filters),
          getActiveRentals(),
        ]);
        if (!active) return;
        setBikes(allBikes);
        setFilteredBikes(matchingBikes);
        setRentals(activeRentals);
        setConnection(true);
      } catch (cause) {
        if (active) {
          setConnection(false);
          setNotice({ message: cause instanceof Error ? cause.message : 'Daten konnten nicht geladen werden.', error: true });
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [filters, refreshKey]);

  const selectedBike = useMemo(() => {
    if (!action) return null;
    return action.kind === 'rent'
      ? bikes.find(bike => bike._id === action.id) ?? null
      : rentals.find(rental => rental._id === action.id)?.bikeId ?? null;
  }, [action, bikes, rentals]);

  async function submitAction(customerName: string) {
    if (!action) return;
    setLoading(true);
    setError('');
    try {
      if (action.kind === 'rent') await rentBike(action.id, customerName);
      else await returnBike(action.id);

      setAction(null);
      setNotice({ message: action.kind === 'rent' ? 'Ausleihe gespeichert. Gute Fahrt!' : 'Fahrrad zurückgegeben. Willkommen zurück!' });
      setRefreshKey(key => key + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Die Anfrage ist fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  }

  function updateFilters(next: BikeFilters) {
    setFilters(next);
    setNotice(null);
  }

  const bikeList = Array.isArray(bikes) ? bikes : [];
  const rentalList = Array.isArray(rentals) ? rentals : [];
  const visibleBikes = Array.isArray(filteredBikes) ? filteredBikes : [];
  const available = bikeList.filter(bike => bike.status === 'available').length;

  return <>
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="Radraum Startseite"><span className="brand-icon">↗</span> radraum<span className="brand-dot">.</span></a>
      <div className="workspace">MARVIN PRINZ · FAHRRADVERLEIH</div>
      <nav aria-label="Hauptnavigation">
        <button className={`nav ${view === 'bikes' ? 'active' : ''}`} onClick={() => setView('bikes')}><span>◉</span> Fahrräder <span className="nav-arrow">↗</span></button>
        <button className={`nav ${view === 'rentals' ? 'active' : ''}`} onClick={() => setView('rentals')}><span>⇄</span> Ausleihen <span className="count">{rentalList.length}</span></button>
      </nav>
      <div className="sidebar-bottom"><span className="avatar">MP</span><div>Marvin Prinz<small>Verleihverwaltung</small></div></div>
    </aside>

    <main>
      <header><span>Verwaltung <span className="breadcrumb">/ <span>{view === 'bikes' ? 'Fahrräder' : 'Ausleihen'}</span></span></span><span className={`connection ${connection ? 'online' : ''}`}>{connection ? 'Mit Verleih verbunden' : 'Verbindung unterbrochen'}</span></header>
      <section className="content">
        <div className="page-heading"><div><div className="eyebrow">DEIN VERLEIH. ALLES IM BLICK.</div><h1>{view === 'bikes' ? 'Bereit für die nächste Tour.' : 'Unterwegs. Und bald zurück.'}</h1><p>{view === 'bikes' ? 'Das passende Fahrrad finden und direkt auf den Weg bringen.' : 'Aktive Ausleihen im Blick behalten und Fahrräder zurücknehmen.'}</p></div><button className="secondary" disabled={loading} onClick={() => { setNotice(null); setRefreshKey(key => key + 1); }}>↻ <span>Aktualisieren</span></button></div>

        <div className="stats"><div><span>Fahrräder gesamt</span><strong>{bikeList.length}</strong><small>Deine Flotte</small></div><div><span>Verfügbar</span><strong>{available}</strong><small><i /> Bereit zur Ausleihe</small></div><div><span>Unterwegs</span><strong>{bikeList.length - available}</strong><small>Aktuell ausgeliehen</small></div></div>

        {notice && <div className={`notice ${notice.error ? 'error' : ''}`} role="status">{notice.message}</div>}

        <section className="inventory">
          <div className="section-heading"><h2>{view === 'bikes' ? 'Deine Fahrräder' : 'Aktive Ausleihen'} <span id="results-count">{view === 'bikes' ? visibleBikes.length : rentalList.length}</span></h2><span className="muted">{view === 'bikes' ? 'Eine gute Fahrt beginnt hier.' : ''}</span></div>
          {view === 'bikes' && <BikeFiltersPanel filters={filters} onChange={updateFilters} />}
          {view === 'bikes'
            ? <BikeList bikes={visibleBikes} loading={loading} onRent={bike => { setError(''); setAction({ kind: 'rent', id: bike._id }); }} />
            : <RentalList rentals={rentalList} onReturn={rental => { setError(''); setAction({ kind: 'return', id: rental._id }); }} />}
        </section>

        <footer><span>radraum. <span className="muted">Mehr Bewegung. Weniger Aufwand.</span></span><span>Fahrradverleih · Verwaltung</span></footer>
      </section>
    </main>

    <ActionDialog key={`${action?.kind ?? 'closed'}:${action?.id ?? ''}`} action={action?.kind ?? null} bike={selectedBike} loading={loading} error={error} onClose={() => setAction(null)} onSubmit={(name: string) => void submitAction(name)} />
  </>;
}
