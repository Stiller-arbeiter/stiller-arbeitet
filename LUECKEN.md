LUECKEN.md — Der stille Arbeiter

Offene, erkannte Luecken, die noch nicht umgesetzt sind. Vor jeder neuen Aufgabe kurz reinschauen, ob etwas davon jetzt relevant wird. Wird laufend ergaenzt und abgehakt, nicht geloescht (erledigte Punkte mit [x] markieren, damit die Historie bleibt).

Architektur


 tueren_content-Tabelle fehlt. Die neun Prinzipien stehen aktuell hart im Code (api/Umkehr.js, Objekt TUEREN_PRINZIP). Fuer Tuer 1 unproblematisch, aber vor dem Verkabeln von Tuer 2-9 sollte das in eine echte Tabelle (neun Kernzeilen + vier Journal-Frage-Varianten pro Tuer) ausgelagert werden. Sonst muss bei jeder Textaenderung der Server-Code anfasst werden statt nur Daten.
 Kein generisches Tueren-Template. Aktuell ist tuer-eins.html eine eigene Datei nur fuer Tuer 1. Bei neun Tueren im selben Muster sollte es ein Template geben, das sich Inhalt aus der Datenbank zieht, statt neun fast identische HTML-Dateien zu pflegen.
 Keine Tueren-Uebersichtsseite. Man kommt nur ueber die feste Adresse tuer-eins.html rein. Es fehlt eine Landkarte, von der aus man zwischen den neun Tueren waehlt und den eigenen Fortschritt sieht.


Kontinuitaet zwischen den Tueren


 Saat-Ernte-Mechanik (Tuer 3 -> Tuer 7) nicht gebaut. Braucht ein gezielt markiertes Feld (z.B. saat_tuer3 in journal oder eigene Tabelle), damit Tuer 7 den Satz aus Tuer 3 wortwoertlich abrufen und zitieren kann. Aktuell nirgends vorbereitet.
 Tag-9-Zusammenfuehrung der Begriffe (Tuer 3/4/5) braucht benannte Variablen. Muss beim Bau von Tuer 9 mitgedacht werden, nicht als vager Rueckblick ueber alte Texte.


Fortschritts-Tracking


 Keine 1-10-Bewertung, morgens/abends. fortschritt-Tabelle hat aktuell nur abgeschlossen_am. Muss um Bewertungsfelder erweitert werden oder eigene Tabelle bekommen.
 Keine Ergebnis-Darstellung ueber die neun Tage. Wenn die Bewertungen existieren, braucht es eine kurze, persoenliche KI-Zusammenfassung, die die Zahlen einordnet — nicht nur ein Chart.


Tag 9 — Abschluss


 Kompletter Baustein fehlt noch. Personalisierte KI-Rueckschau ueber alle neun Tage (Sorgen, Bewertungen, eigene Formulierungen) + das "verdiente Buch" als eigenstaendiges Artefakt. Gilt als eigener Arbeitsschritt, nicht als Fussnote von Tuer 9 selbst.


Landingpage / erster Eindruck


 "Was drueckt gerade?" mit echter kostenloser Umkehr-Antwort ist noch nicht auf der Landingpage. Aktuell nur ueber Testseiten/Tuer 1 nach Login erreichbar. Sollte laut Kern-Dokument prominent auf die erste Seite, nicht versteckt — vermutlich das staerkste Verkaufsargument, das schon existiert.
 Kein Vorgeschmack des Wissenschafts-Ankers (Tuer 4) auf der Landingpage.
 Neun-Tueren-Fahrplan (nur Titel/Kurzbeschreibung) nicht auf der Landingpage sichtbar.


Rechtliches / Betrieb (vor Live-Gang)


 E-Mail-Bestaetigung wieder aktivieren (aktuell zu Testzwecken deaktiviert).
 Impressum, Datenschutz, AGB, Widerruf.
 Druck-/Versandkosten-Hinweis fuers Buch in den Kaufprozess einbauen.
 Kostenkalkulation fuer Skalierung (API-Kosten pro Nutzer, Guthaben-Planung).


Erledigt (zur Historie, nicht loeschen)


 Homepage live, alle sieben Abschnitte
 Alle neun Tueren inhaltlich vollstaendig getextet
 Supabase + vier Tabellen mit Row Level Security
 Geschuetzter KI-Aufruf, dreistufig (Ton A/B/Krisensignal)
 Registrierung + Login funktionieren, Profil wird geladen
 Tuer 1 komplett verkabelt: Morgen-Unterstuetzung sofort, Abend-Rueckmeldung mit eigenen Worten der Person, Lehr-Ebene mit Variation
