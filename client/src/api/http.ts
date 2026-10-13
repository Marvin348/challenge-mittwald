const messages: Record<string, string> = {
  'Bike is already rented': 'Dieses Fahrrad ist bereits ausgeliehen.',
  'E-bike battery must be at least 20%': 'Der Akku muss mindestens 20 % geladen sein.',
  'No free space at station': 'An der Station ist kein Stellplatz frei.',
  'Rental is already returned': 'Diese Ausleihe wurde bereits zurückgegeben.',
  'Bike not found': 'Das Fahrrad wurde nicht gefunden.',
  'Failed to create rental': 'Die Ausleihe konnte nicht gespeichert werden.',
  'Failed to return bike': 'Die Rückgabe konnte nicht gespeichert werden.',
};

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new Error('Server nicht erreichbar. Bitte Verbindung prüfen und erneut versuchen.');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(messages[data?.message] ?? 'Die Anfrage konnte nicht verarbeitet werden.');
  }
  return data as T;
}
