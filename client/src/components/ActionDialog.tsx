import { useState, type FormEvent } from 'react';
import type { Bike } from '../api/bikes';

type Props = { bike: Bike | null; action: 'rent' | 'return' | null; loading: boolean; error: string; onClose: () => void; onSubmit: (customerName: string) => void };

export default function ActionDialog({ bike, action, loading, error, onClose, onSubmit }: Props) {
  const [customerName, setCustomerName] = useState('');
  if (!action) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(customerName.trim());
  }

  return <dialog open onClick={event => { if (event.target === event.currentTarget && !loading) onClose(); }}>
    <form onSubmit={submit}>
      <button type="button" className="close" aria-label="Schließen" disabled={loading} onClick={onClose}>×</button>
      <div className="eyebrow">{action === 'rent' ? 'AUF GEHT’S' : 'WILLKOMMEN ZURÜCK'}</div>
      <h2>{bike?.brand ?? 'Fahrrad'} {action === 'rent' ? 'ausleihen' : 'zurückgeben'}</h2>
      <p>{action === 'rent' ? 'Für wen beginnt die nächste Tour?' : 'Das Fahrrad wird an seiner bisherigen Station auf einem freien Stellplatz eingeparkt.'}</p>
      {action === 'rent' && <label className="customer-label">Name der Person<input autoFocus required maxLength={150} value={customerName} onChange={event => setCustomerName(event.target.value)} placeholder="Vor- und Nachname" autoComplete="name" /></label>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions"><button type="button" className="secondary cancel" disabled={loading} onClick={onClose}>Abbrechen</button><button className="primary" disabled={loading}>{loading ? 'Wird gespeichert …' : action === 'rent' ? 'Ausleihe bestätigen ↗' : 'Rückgabe bestätigen ↙'}</button></div>
    </form>
  </dialog>;
}
