# Projektbeschreibung

Eine Fullstack-Anwendung zur Verwaltung eines Fahrradverleihs mit Node.js, TypeScript, Express, MongoDB und React.

Die Anwendung ermöglicht die Suche, Ausleihe und Rückgabe von Fahrrädern. Eine Verleihstation besitzt mehrere Stellplatzreihen mit begrenzter Kapazität.

## Einmalig einrichten

MongoDB zunächst starten:

```bash
docker compose up -d mongodb
```

Warten, bis MongoDB Verbindungen annimmt. Danach das Replica Set einmalig initialisieren:

```bash
docker compose exec mongodb mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"mongodb:27017"}]})'
```

Anschließend Backend starten, Beispieldaten anlegen und Frontend-Abhängigkeiten installieren:

```bash
docker compose up --build -d
docker compose exec server npm run seed
npm ci --prefix client
```

Hinweise:

Das Replica Set wird für MongoDB-Transaktionen benötigt und muss nur bei der erstmaligen Einrichtung initialisiert werden.

Der Seed ersetzt vorhandene Beispieldaten und sollte nur in der Entwicklungsumgebung ausgeführt werden.

`npm ci --prefix client` installiert die Frontend-Abhängigkeiten.

## App starten

Im Projektordner ausführen. Das Frontend im Terminal weiterlaufen lassen:

```bash
docker compose up -d
npm run dev --prefix client
```

- Backend-Status: http://localhost:3000/health

#### Umsetzung

- REST-API mit Node.js, TypeScript, Express und MongoDB
- Fahrradsuche mit Filtermöglichkeiten
- Ausleihe und Rückgabe mit Validierung der Geschäftsregeln
- Stellplatzverwaltung mit begrenzter Kapazität
- MongoDB-Transaktionen und atomare Updates für Datenkonsistenz

#### Entscheidungen

Der Schwerpunkt lag bewusst auf der Backend-Logik, der Datenkonsistenz und der korrekten Umsetzung der Geschäftsregeln.

Die Verwaltung von Fahrrädern, Stationen und Ausleihen wurde in getrennte Datenmodelle aufgeteilt, um die jeweiligen Verantwortlichkeiten nachvollziehbar zu halten.

Auf zusätzliche Infrastruktur wie eine Message Queue wurde verzichtet, da die aktuellen Ausleih- und Rückgabeprozesse synchron verarbeitet werden können.

#### Mit mehr Zeit

- Zentralen Error-Handler implementieren
- Unit- und Integrationstests ergänzen
- Geschäftslogik konsequent in Services auslagern und die Ordnerstruktur verbessern
- React-Frontend funktional und visuell weiter ausbauen (Komplette Katastrophe aktuell)
- Ordnerstruktur überarbeiten und Geschäftslogik konsequent in Services auslagern
- Optional asynchrone Prozesse wie E-Mail-Benachrichtigungen über eine Queue und Worker ergänzen
