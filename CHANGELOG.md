# Changelog

## feature_dg_v2 – 22.09.2026

### Branding und Inhalte

- Polizei-NRW-Wappen als Logo integriert.
- Nutzerseitiges Branding auf „Polizei NRW“ und „POLIZEI-ONLINE · Polizei NRW“ korrigiert.
- „LZPD NRW“ bleibt nur als technischer Dienstleister genannt.
- Meta-Description und Manifest angepasst.
- Zeitabhängige Begrüßungen vereinheitlicht auf „Guten Tag, Maria.“.
- „Über diesen Entwurf“ aus dem Footer entfernt.

### Mein iBMS

- Kennzahlenkarten vollständig klick- und tastaturbedienbar gemacht.
- Karten öffnen direkt das jeweils passende Mein-iBMS-Tab.
- Deeplinks wie `#dashboard/Nachweise` setzen den korrekten Tab.
- Mobile Tab-Wechsel behalten vertikale Scrollposition und horizontale Chip-Position.
- Nachweise um statische PDF-Downloads mit Polizei-NRW-Wappen ergänzt.

### Startseite und mobile Darstellung

- Angebotskarten einschließlich Bild als vollständige Navigationsfläche umgesetzt.
- Mobile Startseite erhält Begrüßung, persönlichen Überblick, Hauptaktion und Karten weiterhin vollständig.
- Layout für iPhone-Breiten 375px und 390px geprüft.
- Mobile Hauptnavigation an die Desktop-Reihenfolge angeglichen.

### Leichte Sprache und Barrierefreiheit

- Sichtbarer Einstieg „Leichte Sprache“ in der Topbar ergänzt.
- Redaktionell vereinfachter Dialog für „Meine Fortbildungen“, „Angebote suchen“, „Nachweise“ und „Hilfe“.
- Keine automatische Übersetzung vorgetäuscht.
- Escape, Fokusmanagement, sichtbare Fokuszustände und Tastaturbedienung umgesetzt.
- Touch-Flächen auf mindestens 44px erweitert.

### Admin-Planung

- Admin-Planung ergänzt und als Clickdummy abgebildet.
- Ressourcen- und Fortbildungsfilter funktional gemacht.
- Kalenderkonflikt öffnet ein Detail-Overlay mit Lösungsvorschlägen.
- Veranstaltungskarten per Drag & Drop verschiebbar.
- Tastaturalternative zum Verschieben: Leertaste, Zielfeld fokussieren, Enter.
- Drop-Ziele, belegte Zeiträume und Drag-Zustände visuell gekennzeichnet.
- Rasterbreiten, Umbruch und Schriftgrößen für Ressourcen und Veranstaltungen verbessert.

### Haptisches Feedback (nur mobile Ansicht)

- Kurzer Auswahl-Impuls beim Antippen von Tab-Leiste, Mein-iBMS-Tabs und Filter-Chips.
- Kurzer Druck-Impuls auf Buttons, Merken-Markierung sowie den Glas- und Profilschaltflächen.
- Bestätigungen, Exporte und erfolgreich abgeschickte Formulare quittieren mit einem Erfolgsmuster.
- Vom Browser abgelehnte Formulareingaben quittieren mit einem Warnmuster, einmal pro Versuch.
- Desktop-Ansicht, Geräte ohne Vibration und `prefers-reduced-motion` bleiben ohne Feedback.
- Android nutzt die Vibration API; unter iOS wird ersatzweise die System-Haptik eines verborgenen Schalters ausgelöst.
- Neue Datei `js/08-haptics.js`; `js/08-actions.js` heißt jetzt `js/09-actions.js`, damit der Bootstrap zuletzt lädt.

### Tests

- JavaScript-Syntaxprüfung erfolgreich.
- Python-Kompilierungsprüfung erfolgreich.
- `git diff --check` erfolgreich.
- Browserprüfungen für Deeplinks, PDF-Downloads, Planung, Konflikt-Overlay und mobile Tab-Navigation durchgeführt.
