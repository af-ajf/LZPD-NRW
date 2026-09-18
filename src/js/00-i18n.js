// 00-i18n.js - Translation table.
// German is the source language and stays canonical: every state value, form
// value, data-attribute and comparison in the app is German. Only text that is
// rendered to the screen passes through t(). English is a flat lookup table.
// The interface no longer carries a language switch; the English table is kept
// and is reached by setting "ibms-lang" to "en" in localStorage before load.

"use strict";

const EN = {
  // --- chrome / navigation ---
  "Zum Hauptinhalt springen": "Skip to main content",
  Hauptnavigation: "Main navigation",
  "Mobile Navigation": "Mobile navigation",
  // --- phone tab bar (short labels, node 3059:205) ---
  Start: "Home",
  Angebote: "Catalog",
  Lernpfad: "Learning",
  "Neue Perspektiven": "New perspectives",
  "Aus- und Fortbildung": "Training & Development",
  Startseite: "Home",
  "Mein iBMS": "My iBMS",
  Gesamtangebot: "Course Catalog",
  "Last Minute": "Last Minute",
  "Mein Lernpfad": "My Learning Path",
  "Anwender verwalten": "User Management",
  "Berichte & Statistiken": "Reports & Statistics",
  "Hilfe & Kontakt": "Help & Contact",
  Abmelden: "Sign out",
  Menü: "Menu",
  "Menü öffnen": "Open menu",
  "Dialog schließen": "Close dialog",
  Schließen: "Close",
  Abbrechen: "Cancel",
  "Zurück zu iBMS": "Back to iBMS",
  Zurück: "Back",
  "Nordrhein-Westfalen": "North Rhine-Westphalia",
  "Interaktiver Entwurf · Beispieldaten": "Interactive draft · Sample data",
  "Angebote suchen": "Search courses",
  Benachrichtigungen: "Notifications",
  "Benachrichtigungen, 2 neue Hinweise": "Notifications, 2 new alerts",
  "Profil von Maria Beispiel": "Profile of Maria Beispiel",
  "Ihr Profil": "Your profile",
  "POLIZEI-ONLINE · LZPD Nordrhein-Westfalen":
    "POLIZEI-ONLINE · LZPD North Rhine-Westphalia",
  Barrierefreiheit: "Accessibility",
  Datenschutz: "Privacy",
  "Über diesen Entwurf": "About this draft",
  Sprache: "Language",
  Deutsch: "German",
  Englisch: "English",

  // --- roles ---
  "Ansicht im Clickdummy": "Click dummy view",
  Anwenderin: "End User",
  "BMS-Administrator": "BMS Administrator",
  "ET-Fachaufsicht": "OT Supervisor",
  "Ansicht wechseln": "Switch view",
  "Wählen Sie für die Demonstration die passende Rolle. Der Wechsel simuliert eine andere Sicht und vergibt keine echten Berechtigungen.":
    "Pick the matching role for the demonstration. Switching simulates a different view and grants no real permissions.",
  ansehen: "view",
  "Die Anwenderverwaltung gehört zur Ansicht BMS-Administrator.":
    "User management belongs to the BMS Administrator view.",
  "Berichte stehen nur freigegebenen Funktionsrollen zur Verfügung.":
    "Reports are only available to authorised function roles.",
  "Demoansicht gewechselt: ": "Demo view switched to: ",

  // --- login ---
  "Gemeinsam lernen.": "Learning together.",
  "Sicher handeln.": "Acting safely.",
  "Ihre Plattform für polizeiliche Aus- und Fortbildung.":
    "Your platform for police training and development.",
  Willkommen: "Welcome",
  "Melden Sie sich mit Ihrem Behördenkonto bei iBMS 3.0 an.":
    "Sign in to iBMS 3.0 with your official account.",
  Organisation: "Organization",
  "Polizei Nordrhein-Westfalen": "Police of North Rhine-Westphalia",
  "Mit Behördenkonto anmelden": "Sign in with official account",
  "Für den Entwurf öffnet dieser Button die Beispielansicht. Es werden keine Zugangsdaten abgefragt.":
    "In this draft the button opens the sample view. No credentials are requested.",
  "Hilfe zur Anmeldung": "Sign-in help",
  "Interaktiver Gestaltungsentwurf für LZPD NRW. Kein Produktivsystem.":
    "Interactive design draft for LZPD NRW. Not a production system.",
  "Für den Entwurf benötigen Sie kein Passwort. „Mit Behördenkonto anmelden“ öffnet die Beispielansicht.":
    "No password is needed for this draft. “Sign in with official account” opens the sample view.",
  "Im Produktivsystem richtet sich die Anmeldung nach der Konfiguration des Kooperationspartners. SSO und Mehrfaktor-Authentisierung werden dort angebunden.":
    "In the production system, sign-in follows the cooperation partner's configuration. SSO and multi-factor authentication are connected there.",

  // --- home ---
  "Nationale Kooperation POLIZEI-ONLINE": "POLIZEI-ONLINE national cooperation",
  "Willkommen bei": "Welcome to",
  "Finden Sie passende Angebote und behalten Sie Ihre nächsten Schritte im Blick.":
    "Find the right courses and keep track of your next steps.",
  "Was möchten Sie lernen?": "What would you like to learn?",
  "Fortbildung im Fokus": "Training in focus",
  "Kompetenz entwickeln.": "Build competence.",
  "Wissen im Dienst anwenden.": "Apply knowledge on duty.",
  "Gesamtangebot entdecken": "Explore the catalog",
  Schnelleinstiege: "Quick links",
  "Termine und Nachweise": "Appointments and certificates",
  "Bildung, ET und Sport": "Education, OT and Sport",
  "Kurzfristig freie Plätze": "Short-notice openings",
  "Die nächsten Schritte": "Your next steps",
  "Neue Perspektiven für Ihren Alltag": "New perspectives for your work",
  "Alle Angebote": "All courses",
  "Aktuelles aus der Fortbildung": "Training news",
  "Fortbildungsplanung gemeinsam gestalten":
    "Shaping training planning together",
  "Melden Sie Ihren Bedarf für das kommende Fortbildungsjahr.":
    "Report your needs for the coming training year.",
  "Gut ankommen in iBMS 3.0": "Getting started with iBMS 3.0",
  "Antworten zu Registrierung, Nachweisen und persönlicher Übersicht.":
    "Answers on registration, certificates and your personal overview.",
  "Für Sie persönlich": "For you",
  "Ihr nächster Termin": "Your next appointment",
  "15. Oktober · 09:00 Uhr": "15 October · 09:00",
  "Fortbildungszentrum NRW": "NRW Training Centre",
  "Meine Registrierungen": "My registrations",

  // --- dashboard ---
  "Guten Morgen, Maria. Hier finden Sie Ihre persönliche Fortbildungsübersicht.":
    "Good morning, Maria. Here is your personal training overview.",
  "Gebuchte Veranstaltungen": "Booked events",
  "Ihre bestätigten Termine": "Your confirmed appointments",
  "Offene Rückmeldungen": "Open responses",
  "Von Ihnen zu ergänzen": "Awaiting your input",
  Nachweise: "Certificates",
  "Für absolvierte Fortbildungen": "For completed training",
  Fertigkeiten: "Skills",
  "Aktuell gültig": "Currently valid",
  "Mein iBMS Bereiche": "My iBMS sections",
  Registrierungen: "Registrations",
  Bedarfsmeldungen: "Requirement Reports",
  Fortbildungswünsche: "Training Requests",
  "Meine nächsten Veranstaltungen": "My upcoming events",
  Einträge: "entries",
  "Noch keine Registrierungen vorhanden.": "No registrations yet.",
  "Nächster Schritt": "Next step",
  "Vielen Dank für Ihre Rückmeldung": "Thank you for your response",
  "Ihr Fortbildungswunsch": "Your training request",
  "Gesprächsführung und Konfliktklärung":
    "Conversation Skills and Conflict Resolution",
  "Ihre Ergänzung steht in diesem Entwurf zur fachlichen Prüfung bereit.":
    "In this draft your addition is ready for professional review.",
  "Bitte ergänzen Sie die Begründung für Ihren Fortbildungswunsch.":
    "Please add the justification for your training request.",
  "Begründung ergänzen": "Add justification",
  "Ihre persönliche Entwicklung": "Your personal development",
  "Registrierungen, Lernangebote und Nachweise in einer Übersicht.":
    "Registrations, courses and certificates in one overview.",
  "Lernpfad öffnen": "Open learning path",
  "Meine Nachweise": "My certificates",
  Fortbildung: "Training",
  Datum: "Date",
  Modul: "Module",
  Aktion: "Action",
  "Nachweis ansehen": "View certificate",
  "Grundlagen der Kommunikation": "Communication Fundamentals",
  "Funktionelles Training": "Functional Training",
  "Meine Fertigkeiten": "My skills",
  "Kommunikation und Gesprächsführung": "Communication and Conversation Skills",
  "Modul Bildung · Gültig bis 08.09.2027":
    "Education module · Valid until 08/09/2027",
  "Gültigkeitszeiträume und Zuweisungen folgen den Regeln des jeweiligen Moduls.":
    "Validity periods and assignments follow the rules of the respective module.",
  Meine: "My",
  "Neu erfassen": "Add new",
  "Bildung · Für das Fortbildungsjahr 2027":
    "Education · For the 2027 training year",
  "Neue Bedarfsmeldung": "New requirement report",
  "Den Bearbeitungsstand und Rückmeldungen Ihrer zuständigen Stelle sehen Sie hier.":
    "You will see the processing status and responses from your responsible office here.",

  // --- catalog ---
  "Fortbildungen finden, Details prüfen und die Teilnahme organisieren.":
    "Find training, check details and organise your participation.",
  "Kurzfristig verfügbare Plätze in Bildung, Einsatztraining und Sport.":
    "Short-notice places in Education, Operational Training and Sport.",
  "Angebot oder Thema": "Course or topic",
  "z. B. Kommunikation": "e.g. communication",
  "z. B. Deeskalation": "e.g. de-escalation",
  Format: "Format",
  Suchen: "Search",
  "passende Angebote": "matching courses",
  "Suche merken": "Save this search",
  "Keine passenden Angebote": "No matching courses",
  "Ändern Sie den Suchbegriff oder setzen Sie die Filter zurück.":
    "Change the search term or reset the filters.",
  "Filter zurücksetzen": "Reset filters",
  "Angebot ansehen": "View course",
  "freie Plätze": "places available",
  Ausgebucht: "Fully booked",
  Ab: "From",
  "Abstraktes blaues Bildmotiv aus der Designvorlage":
    "Abstract blue image motif from the design template",

  // --- course detail ---
  "Angebot nicht gefunden": "Course not found",
  "Zum Gesamtangebot": "To the course catalog",
  "Worum es geht": "What it covers",
  Zielgruppe: "Target audience",
  "Mitarbeitende mit einem entsprechenden Fortbildungsbedarf im jeweiligen Zuständigkeitsbereich.":
    "Staff with a corresponding training need in their area of responsibility.",
  "Inhalte und Lernziele": "Content and learning objectives",
  "Fachliche Grundlagen auffrischen und einordnen":
    "Refresh and contextualise professional fundamentals",
  "Typische Situationen aus dem Arbeitsalltag bearbeiten":
    "Work through typical everyday situations",
  "Das Gelernte auf die eigene Aufgabe übertragen":
    "Transfer what you learn to your own role",
  "Dies ist ein Beispielangebot. Inhalte, Voraussetzungen und Genehmigungsregeln werden durch die verantwortliche Stelle gepflegt.":
    "This is a sample course. Content, prerequisites and approval rules are maintained by the responsible office.",
  "Ihre Teilnahme": "Your participation",
  Beginn: "Start",
  Uhrzeit: "Time",
  Ort: "Location",
  Umfang: "Duration",
  Verfügbarkeit: "Availability",
  "Für dieses Angebot liegt bereits eine Registrierung vor.":
    "A registration already exists for this course.",
  "Registrierung ansehen": "View registration",
  "Ihre Anmeldung benötigt eine Freigabe durch die zuständige Stelle.":
    "Your registration requires approval by the responsible office.",
  "Für dieses Beispielangebot ist keine Genehmigung erforderlich.":
    "No approval is required for this sample course.",
  "Teilnahme anfragen": "Request participation",
  "Verbindlich buchen": "Book bindingly",
  "Zurzeit sind keine Plätze verfügbar.": "No places are currently available.",
  "Bedarf melden": "Report a need",

  // --- user management ---
  "Konten und fachliche Berechtigungen für Nordrhein-Westfalen.":
    "Accounts and professional permissions for North Rhine-Westphalia.",
  "Anwender anlegen": "Create user",
  "Anwender gesamt": "Total users",
  "Im Beispielbestand": "In the sample data",
  "Aktive Konten": "Active accounts",
  "Zur Nutzung freigegeben": "Approved for use",
  "Gesperrte Konten": "Blocked accounts",
  "Zugang aktuell eingeschränkt": "Access currently restricted",
  Fachmodule: "Subject modules",
  "Bildung, Einsatztraining, Sport": "Education, Operational Training, Sport",
  "Anwender suchen": "Search users",
  "Name eingeben": "Enter a name",
  Status: "Status",
  Filtern: "Filter",
  "Anwender im Zuständigkeitsbereich": "Users in your area of responsibility",
  Name: "Name",
  Organisationseinheit: "Organizational unit",
  "Rolle / Modul": "Role / Module",
  Bearbeiten: "Edit",
  "Keine Anwender für diese Filter gefunden.":
    "No users found for these filters.",
  von: "of",
  Anwendern: "users",
  "Seite 1 von 1": "Page 1 of 1",
  "Anwender bearbeiten": "Edit user",
  "Nordrhein-Westfalen / Fachliche Berechtigung":
    "North Rhine-Westphalia / Professional permission",
  Funktionsrolle: "Function role",
  "Zuständige Organisationseinheit": "Responsible organizational unit",
  Kontostatus: "Account status",
  "Änderungen gelten nur für den Beispielbestand dieses Clickdummys.":
    "Changes apply only to the sample data of this click dummy.",
  "Änderungen prüfen": "Review changes",
  "Änderung prüfen": "Review change",
  "Bitte prüfen Sie die neue Zuordnung für":
    "Please review the new assignment for",
  Rolle: "Role",
  Zuständigkeit: "Responsibility",
  "Änderung bestätigen": "Confirm change",
  "Berechtigungen im Beispielbestand aktualisiert.":
    "Permissions updated in the sample data.",
  "Manuelle Anlage ist in diesem Demonstrationsszenario freigegeben.":
    "Manual creation is enabled in this demonstration scenario.",
  "Vor- und Nachname": "First and last name",
  "Das neue Beispielkonto erhält zunächst die Rolle Anwender im Modul Bildung.":
    "The new sample account initially gets the User role in the Education module.",
  "Beispielkonto anlegen": "Create sample account",
  "Beispielkonto angelegt.": "Sample account created.",
  "Anwenderliste gefiltert.": "User list filtered.",

  // --- reports ---
  "Auswertungen für Ihren fachlichen Zuständigkeitsbereich.":
    "Analyses for your professional area of responsibility.",
  Berichte: "Reports",
  "Fachaufsichtsreport ET": "OT Supervision Report",
  "Nachweise exportieren": "Export certificates",
  Auswertejahr: "Reporting year",
  Auswerten: "Run analysis",
  "Alle zugewiesenen OE": "All assigned units",
  "Direktion Verkehr": "Traffic Directorate",
  "Nachweisexporte werden als Auftrag angelegt und später zum Download bereitgestellt.":
    "Certificate exports are created as a job and made available for download later.",
  "Diese Fachaufsichtssicht zeigt statistische Daten. Personenbezogene Detailansichten sind hier nicht verfügbar.":
    "This supervision view shows statistical data. Personal detail views are not available here.",
  "Meine Exportaufträge": "My export jobs",
  Zeitraum: "Period",
  "Nachweisexport anfordern": "Request certificate export",
  Nachweisexport: "Certificate export",
  "Noch keine Exportaufträge vorhanden.": "No export jobs yet.",
  "Noch keine Trainingsdaten": "No training data yet",
  "Für 2027 liegen in diesem Beispielbestand keine erfassten Trainingsstunden vor.":
    "No training hours are recorded for 2027 in this sample data.",
  "Trainingsstunden im Überblick": "Training hours at a glance",
  "Soll und statistisch gekapptes Ist":
    "Target and statistically capped actual",
  "Trainingsstunden. Die vollständigen Werte stehen in der anschließenden Datentabelle.":
    "Training hours. The full values are in the data table below.",
  "Trainingsstunden als Datentabelle": "Training hours as a data table",
  Fachbereich: "Subject area",
  Soll: "Target",
  Ist: "Actual",
  Erfüllung: "Completion",
  Einsatztaktik: "Operational Tactics",
  Eingriffstechniken: "Intervention Techniques",
  Schießen: "Firearms",
  "Beispieldaten als CSV": "Sample data as CSV",
  "Beispieldaten iBMS 3.0": "iBMS 3.0 sample data",
  "CSV mit Beispieldaten erstellt.": "CSV with sample data created.",
  "Auswertung aktualisiert.": "Analysis updated.",
  "Exportauftrag eingeplant. Die Bereitstellung über Nacht wird im Dummy nicht ausgeführt.":
    "Export job scheduled. Overnight provision is not executed in this dummy.",

  // --- learning path ---
  "Ihre Fortbildung Schritt für Schritt.": "Your training, step by step.",
  "Kommunikation & Handlungskompetenz": "Communication & Practical Competence",
  "Deeskalation im Einsatz": "De-escalation on Duty",
  "Persönliche Übersicht zu Ihren Fortbildungsangeboten":
    "Personal overview of your training courses",
  "Schritte im Lernpfad": "Steps in the learning path",
  "Ihr Weg im Überblick": "Your path at a glance",
  "1 von 3 Schritten abgeschlossen": "1 of 3 steps completed",
  "Abgeschlossene Schritte": "Completed steps",
  Grundlagen: "Fundamentals",
  "Nachweis vorhanden": "Certificate available",
  "Wissen vertiefen": "Deepen knowledge",
  "E-Learning gebucht": "E-learning booked",
  "In der Praxis anwenden": "Apply in practice",
  "Präsenztermin gebucht": "In-person session booked",
  Schritt: "Step",
  "Ihre Teilnahme ist abgeschlossen. Der Nachweis ist in Mein iBMS hinterlegt.":
    "Your participation is complete. The certificate is stored in My iBMS.",
  "Öffnen Sie die zugehörige Lernmaßnahme im angebundenen Lernmanagementsystem.":
    "Open the associated learning module in the connected learning management system.",
  "E-Learning starten": "Start e-learning",
  "Deeskalation in der Praxis": "De-escalation in Practice",
  "Ihre Präsenzveranstaltung ist gebucht. Prüfen Sie die Veranstaltungsdetails und organisatorischen Hinweise.":
    "Your in-person event is booked. Check the event details and organisational notes.",
  Veranstaltungsdetails: "Event details",
  "Ihr Nachweis": "Your certificate",
  "Lernen im angeschlossenen LMS": "Learning in the connected LMS",
  "Ihr Präsenztermin": "Your in-person session",
  "Abgeschlossen am 08.09.2026 · Modul Bildung":
    "Completed on 08/09/2026 · Education module",
  "90 Minuten · Zeitlich flexibel · Registrierung bestätigt":
    "90 minutes · Flexible timing · Registration confirmed",
  "15.10.2026 · 09:00–16:00 Uhr · Fortbildungszentrum NRW":
    "15/10/2026 · 09:00–16:00 · NRW Training Centre",
  "Ihre Unterlagen": "Your documents",
  "Organisatorische Hinweise": "Organisational notes",
  "Gestaltungsvorschlag: Der Lernpfad bündelt Registrierungen, LMS-Einstiege und Nachweise. Er ist kein zusätzlich zugesagtes LMS-Modul.":
    "Design proposal: the learning path bundles registrations, LMS entry points and certificates. It is not an additionally promised LMS module.",

  // --- article ---
  Aktuelles: "News",
  "Abstraktes Bildmotiv der Wissensplattform":
    "Abstract image motif of the knowledge platform",
  "Fortbildungsplanung · Beispielbeitrag": "Training planning · Sample article",
  "16. September 2026 · Fortbildungsorganisation":
    "16 September 2026 · Training organisation",
  "Welche Kompetenzen möchten Sie vertiefen? Ihre Bedarfsmeldungen helfen der zuständigen Stelle, das Fortbildungsangebot zu planen.":
    "Which competences would you like to deepen? Your requirement reports help the responsible office plan the training offer.",
  "Bedarf melden ": "Report a need ",
  "In Mein iBMS können Sie einen Bedarf zu einem bestehenden Angebot erfassen und dessen Bearbeitungsstand verfolgen. Nutzen Sie für einen individuellen Wunsch den Bereich Fortbildungswünsche.":
    "In My iBMS you can record a need for an existing course and track its processing status. For an individual request, use the Training Requests section.",
  "Was danach passiert": "What happens next",
  "Ihre zuständige Stelle prüft die Meldung. Rückmeldungen und Statusänderungen erscheinen in Ihrer persönlichen Übersicht.":
    "Your responsible office reviews the report. Responses and status changes appear in your personal overview.",
  "Zu Mein iBMS": "To My iBMS",

  // --- help ---
  "Antworten für Ihren nächsten Schritt.": "Answers for your next step.",
  "Häufige Fragen": "Frequently asked questions",
  "Wie melde ich mich zu einer Veranstaltung an?":
    "How do I register for an event?",
  "Öffnen Sie das Gesamtangebot, wählen Sie eine Veranstaltung und prüfen Sie die Details. Je nach Regelung können Sie direkt buchen oder eine Teilnahme anfragen.":
    "Open the course catalog, choose an event and check the details. Depending on the rules you can book directly or request participation.",
  "Wo finde ich meine Nachweise?": "Where do I find my certificates?",
  "Öffnen Sie Mein iBMS und wählen Sie Nachweise. Dort finden Sie Ihre dokumentierten Teilnahmen.":
    "Open My iBMS and select Certificates. There you will find your documented participations.",
  "Warum sehe ich nicht alle Verwaltungsfunktionen?":
    "Why can't I see all administration functions?",
  "Die Oberfläche richtet sich nach Ihrer fachlichen Rolle und Ihrem Zuständigkeitsbereich. In diesem Entwurf können Sie über „Ansicht im Clickdummy“ weitere Rollen demonstrieren.":
    "The interface follows your professional role and area of responsibility. In this draft you can demonstrate other roles via “Click dummy view”.",
  "Wo bearbeite ich meine E-Learning-Inhalte?":
    "Where do I work on my e-learning content?",
  "iBMS öffnet die zugehörige Lernmaßnahme im angebundenen LMS. Die Bearbeitung der Lerninhalte erfolgt dort.":
    "iBMS opens the associated learning module in the connected LMS. Learning content is worked on there.",
  "Ihre Ansprechstelle": "Your contact point",
  "Bei fachlichen Fragen wenden Sie sich an Ihre zuständige Fortbildungsstelle. Für technische Anliegen steht Ihnen der lokale Support zur Verfügung.":
    "For professional questions, contact your responsible training office. For technical matters, local support is available.",
  "Kontaktanfrage vorbereiten": "Prepare a contact request",
  Anliegen: "Subject",
  "Fachliche Frage": "Professional question",
  "Technisches Problem": "Technical problem",
  "Barriere melden": "Report an accessibility barrier",
  "Ihre Nachricht": "Your message",
  "Es erfolgt kein Versand. Bitte keine echten personenbezogenen Daten eingeben.":
    "Nothing is sent. Please do not enter real personal data.",
  "Vorschau anzeigen": "Show preview",
  "Vorschau Ihrer Anfrage": "Preview of your request",
  "Im Clickdummy werden keine Nachrichten versendet.":
    "No messages are sent in the click dummy.",
  "Die Nachricht wurde nicht versendet.": "The message was not sent.",

  // --- dialogs: notifications, registration, booking ---
  "Teilnahme bestätigt": "Participation confirmed",
  "Nachweis verfügbar": "Certificate available",
  "Meine Registrierungen öffnen": "Open my registrations",
  "Ihre Registrierung": "Your registration",
  "Teilnehmende Person": "Participant",
  Historie: "History",
  "Registrierung erfasst.": "Registration recorded.",
  "Freigabe durch zuständige Stelle ausstehend.":
    "Approval by the responsible office pending.",
  "Anmeldung widerrufen": "Withdraw registration",
  "Anmeldung widerrufen?": "Withdraw registration?",
  "Sie können diese noch unbearbeitete Anmeldung zurücknehmen.":
    "You can withdraw this registration while it is still unprocessed.",
  "Widerruf bestätigen": "Confirm withdrawal",
  "Anmeldung im Beispielbestand widerrufen.":
    "Registration withdrawn in the sample data.",
  "Teilnahme buchen": "Book participation",
  "Bemerkung an die zuständige Stelle (optional)":
    "Note to the responsible office (optional)",
  "Ich habe die Veranstaltungsdetails und Teilnahmevoraussetzungen gelesen.":
    "I have read the event details and participation requirements.",
  "Die Anfrage wartet anschließend auf fachliche Freigabe.":
    "The request then awaits professional approval.",
  "Ihre Teilnahme wird im Beispielbestand direkt gebucht.":
    "Your participation is booked directly in the sample data.",
  "Anfrage absenden": "Send request",
  "Buchung bestätigen": "Confirm booking",
  "Teilnahme angefragt. Freigabe steht aus.":
    "Participation requested. Approval pending.",
  "Teilnahme im Beispielbestand gebucht.":
    "Participation booked in the sample data.",
  "Suchergebnisse aktualisiert.": "Search results updated.",
  "Ihre Suchauswahl wurde für diese Demonstration gemerkt.":
    "Your search selection was saved for this demonstration.",
  "Gesamtangebot durchsuchen": "Search the catalog",

  // --- dialogs: certificate, LMS, wishes, needs ---
  "Übergang zur Lernplattform": "Transition to the learning platform",
  "In der Anwendung öffnet sich hier die zugehörige Lernmaßnahme im angebundenen LMS.":
    "In the application, the associated learning module opens here in the connected LMS.",
  "Externe Lernmaßnahme": "External learning module",
  "Der Clickdummy ist mit keinem LMS verbunden und übermittelt keine Daten. Lerninhalte und Bearbeitungsfortschritt entstehen im LMS.":
    "The click dummy is not connected to any LMS and transmits no data. Learning content and progress are created in the LMS.",
  Fortbildungsnachweis: "Training certificate",
  Beispielnachweis: "Sample certificate",
  Teilnahmedatum: "Participation date",
  "Fiktiver Nachweis zur Demonstration. Kein gültiger Fortbildungsnachweis.":
    "Fictitious certificate for demonstration. Not a valid training certificate.",
  "Bitte prüfen Sie vor dem Termin die Veranstaltungsdetails und die Hinweise Ihrer Fortbildungsstelle.":
    "Before the session, please check the event details and the notes from your training office.",
  "Beispieltermin: 15.10.2026, 09:00–16:00 Uhr.":
    "Sample session: 15/10/2026, 09:00–16:00.",
  "Begründung Ihres Fortbildungswunsches":
    "Justification for your training request",
  "Welche Kenntnisse möchten Sie vertiefen?":
    "Which knowledge would you like to deepen?",
  "Bitte mindestens 10 Zeichen eingeben.":
    "Please enter at least 10 characters.",
  "Ergänzung speichern": "Save addition",
  "Ihre Ergänzung wurde im Entwurf gespeichert.":
    "Your addition was saved in the draft.",
  "Fortbildungsbedarf erfassen": "Record a training need",
  "Thema oder Angebot": "Topic or course",
  "Fachliche Begründung": "Professional justification",
  "Die Meldung wird ausschließlich in dieser Demonstration erfasst.":
    "The report is recorded solely in this demonstration.",
  "Bedarf erfassen": "Record need",
  Beispielbedarf: "Sample need",
  "erfasst.": "recorded.",

  // --- dialogs: footer info ---
  "Der Entwurf berücksichtigt semantische Bereiche, sichtbaren Tastaturfokus, beschriftete Formulare, Statusangaben in Textform und responsive Ansichten.":
    "The draft accounts for semantic regions, visible keyboard focus, labelled forms, status information in text form and responsive views.",
  "Mit Tabulator zwischen Bedienelementen wechseln":
    "Move between controls with Tab",
  "Mit Escape Dialoge und das mobile Menü schließen":
    "Close dialogs and the mobile menu with Escape",
  "Diagrammwerte auch als Tabelle lesen": "Read chart values as a table too",
  "Vergrößerung und reduzierte Bewegung berücksichtigen":
    "Support for zoom and reduced motion",
  "Dies ist ein Gestaltungskonzept. Eine verbindliche BITV-NRW-Prüfung und Prüfung mit assistiven Technologien erfolgt an der implementierten Anwendung.":
    "This is a design concept. A binding BITV-NRW audit and testing with assistive technology is carried out on the implemented application.",
  "Datenschutz im Entwurf": "Privacy in this draft",
  "Alle Personen, Termine und Kennzahlen sind Beispieldaten. Es gibt keine echte Anmeldung, keine Backend-Anbindung und keinen Versand von Nachrichten.":
    "All people, appointments and figures are sample data. There is no real sign-in, no backend connection and no sending of messages.",
  "Änderungen bestehen nur während der aktuellen Sitzung im Arbeitsspeicher des Browsers. Beim Neuladen wird der Beispielbestand zurückgesetzt.":
    "Changes exist only during the current session in the browser's memory. Reloading resets the sample data.",
  "Diese Information ist keine Datenschutzerklärung für das spätere Produktivsystem.":
    "This information is not a privacy policy for the later production system.",
  "Über diesen Gestaltungsentwurf": "About this design draft",
  "Fachliche Grundlage:": "Professional basis:",
  "Leistungsbeschreibung und Funktionsbeschreibung iBMS 3.0, Vergabenummer ZA 4.2/1002001550/LS.":
    "iBMS 3.0 statement of work and functional specification, tender number ZA 4.2/1002001550/LS.",
  "Designbasis:": "Design basis:",
  "die gelieferten VITA- und Wissensplattform-SVGs sowie Distart-Beispiele. Das originale abstrakte Bildmotiv, der Rahmen, die Serif-/Sans-Kombination und die mobilen Kompositionen werden auf LZPD NRW übertragen.":
    "the supplied VITA and knowledge-platform SVGs plus Distart examples. The original abstract image motif, the frame, the serif/sans combination and the mobile compositions are transferred to LZPD NRW.",
  "Login: FB S. 20–21. Mein iBMS: S. 21–30. Anwenderverwaltung: S. 45–49. Reports: S. 61–65. Responsivität und Barrierefreiheit: LB S. 6–8.":
    "Login: FB pp. 20–21. My iBMS: pp. 21–30. User management: pp. 45–49. Reports: pp. 61–65. Responsiveness and accessibility: LB pp. 6–8.",
  "Der Lernpfad ist ein Gestaltungsvorschlag zur Zusammenführung vorhandener Fachobjekte. Kein zusätzlicher Leistungsumfang oder Produktivbetrieb.":
    "The learning path is a design proposal for bringing together existing domain objects. Not an additional scope of work or production operation.",

  // --- status badges ---
  "Diese Seite ist nicht verfügbar": "This page is not available",
  "Zur Startseite": "To the home page",
  "Teilnahme bestätigt.": "Participation confirmed.",
  "Polizei NRW": "Police NRW",
  Demoansicht: "Demo view",
  Gebucht: "Booked",
  Angemeldet: "Registered",
  "Rückmeldung offen": "Response open",
  Abgeschlossen: "Completed",
  Gültig: "Valid",
  Aktiv: "Active",
  Gesperrt: "Blocked",
  Ergänzt: "Completed",
  "In Prüfung": "Under review",
  Erfasst: "Recorded",
  Eingeplant: "Scheduled",

  // --- domain vocabulary ---
  "Alle Module": "All modules",
  "Alle Formate": "All formats",
  "Alle Status": "All statuses",
  Bildung: "Education",
  Einsatztraining: "Operational Training",
  Sport: "Sport",
  Präsenz: "In-person",
  "E-Learning": "E-Learning",
  Anwender: "User",
  SbDA: "SbDA",
  SbAuF: "SbAuF",
  "ET-Trainer": "OT Trainer",
  "ET-Administrator": "OT Administrator",
  "Sport-Beauftragter": "Sport Officer",
  "Sport-Koordinator": "Sport Coordinator",
  "Direktion Zentrale Aufgaben": "Central Tasks Directorate",
  "Direktion Kriminalität": "Criminal Investigation Directorate",
  "Direktion Gefahrenabwehr": "Public Safety Directorate",
  Kommunikation: "Communication",
  "Recht und Datenschutz": "Law and Data Protection",
  Einsatz: "Operations",
  Gesundheit: "Health",
  "Digitales Arbeiten": "Digital Work",
  "Online-Modul": "Online module",
  "Landesweit online": "Online, statewide",
  "Trainingszentrum Süd": "Training Centre South",
  "Sportzentrum der Polizei": "Police Sports Centre",
  "Bildungszentrum Mitte": "Education Centre Central",
  Tage: "days",
  Tag: "day",
  Minuten: "minutes",
  Stunden: "hours",
  Uhr: "",
  OKT: "OCT",
  h: "h",

  // --- course titles and descriptions ---
  "Datenschutz im Polizeialltag": "Data Protection in Daily Police Work",
  "Einsatztraining: Sicher im Team": "Operational Training: Safe as a Team",
  "Digitale Zusammenarbeit": "Digital Collaboration",
  "Gesprächsführung in herausfordernden Situationen. Praktische Übungen, Reflexion und kollegialer Austausch.":
    "Conversation management in challenging situations. Practical exercises, reflection and peer exchange.",
  // --- data fixtures ---
  "Digitale Kompetenz": "Digital Competence",
  Einsatzkompetenz: "Operational Competence",
  "Gesundheit & Fitness": "Health & Fitness",
  "Recht & Verwaltung": "Law & Administration",
  "Abgestimmtes Handeln und sichere Abl\u00e4ufe im Team. Vertiefung der Grundlagen in angeleiteten \u00dcbungen.":
    "Coordinated action and safe procedures as a team. Deepening the fundamentals through guided exercises.",
  "Beweglichkeit, Kraft und Stabilit\u00e4t f\u00fcr den Dienstalltag. Individuell angepasste \u00dcbungsintensit\u00e4t.":
    "Mobility, strength and stability for daily duty. Individually adjusted exercise intensity.",
  "Schwierige Gespr\u00e4che strukturieren und Konflikte fr\u00fchzeitig erkennen.":
    "Structure difficult conversations and recognise conflicts early.",
  "Sicherer Umgang mit personenbezogenen Daten. Fachliche Grundlagen und anwendungsbezogene Fallbeispiele.":
    "Safe handling of personal data. Professional fundamentals and applied case studies.",
  "Werkzeuge und Methoden f\u00fcr die Zusammenarbeit in verteilten Teams.":
    "Tools and methods for collaboration in distributed teams.",
  "1 Tag": "1 day",
  "2 Tage": "2 days",
  "2 Stunden": "2 hours",
  "4 Stunden": "4 hours",
  "90 Minuten": "90 minutes",
  "Angeschlossenes LMS": "Connected LMS",
  "Sportzentrum NRW": "NRW Sports Centre",
  "Trainingszentrum NRW": "NRW Training Centre",
  "08:30\u201312:30 Uhr": "08:30\u201312:30",
  "09:00\u201315:00 Uhr": "09:00\u201315:00",
  "09:00\u201316:00 Uhr": "09:00\u201316:00",
  "10:00\u201311:30 Uhr": "10:00\u201311:30",
  "Zeitlich flexibel": "Flexible timing",

  // --- home screen (design-system layout) ---
  "Guten Morgen, Maria": "Good morning, Maria",
  "Guten Tag, Maria": "Good afternoon, Maria",
  "Guten Abend, Maria": "Good evening, Maria",
  Fortbildungsjahr: "Training year",
  "Durchsuchen Sie das Gesamtangebot \u2013 Bildung, Einsatztraining und Sport.":
    "Search the full catalogue \u2013 Education, Operational Training and Sport.",
  "Ihre Fortbildung auf einen Blick": "Your training at a glance",
  "Mein iBMS \u00f6ffnen": "Open My iBMS",
  Aktuelles: "Updates",
  Fortbildungsnews: "Training news",
  Erledigt: "Done",
  "Ihre Erg\u00e4nzung steht zur fachlichen Pr\u00fcfung bereit.":
    "Your addition is ready for review.",
  Filtern: "Filter",

  // --- watchlist / favourites ---
  Merkliste: "Saved",
  Merken: "Save",
  Gemerkt: "Saved",
  "Angebote, die Sie sich f\u00fcr sp\u00e4ter gemerkt haben.":
    "Courses you have saved for later.",
  "gemerkte Angebote": "saved courses",
  "gemerktes Angebot": "saved course",
  "Noch nichts gemerkt": "Nothing saved yet",
  "Mit dem Herz auf einem Angebot merken Sie es sich f\u00fcr sp\u00e4ter. Die Merkliste bleibt auf diesem Ger\u00e4t erhalten.":
    "Use the heart on a course to save it for later. Your saved list stays on this device.",
  "Angebot auf Ihrer Merkliste gespeichert.": "Course saved to your list.",
  "Angebot von Ihrer Merkliste entfernt.": "Course removed from your list.",
  "Merkliste leeren": "Clear saved list",
  "Merkliste leeren?": "Clear your saved list?",
  "Alle gemerkten Angebote werden von Ihrer Merkliste entfernt. Ihre Registrierungen bleiben davon unber\u00fchrt.":
    "Every saved course is removed from your list. Your registrations are not affected.",
  "Merkliste geleert.": "Saved list cleared.",
};

function t(s) {
  if (state.lang === "de") return s;
  return Object.prototype.hasOwnProperty.call(EN, s) ? EN[s] : s;
}
