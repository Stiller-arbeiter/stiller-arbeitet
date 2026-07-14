# LUECKEN.md - Der stille Arbeiter

Offene, erkannte Luecken, die noch nicht umgesetzt sind. Vor jeder neuen Aufgabe kurz reinschauen, ob etwas davon jetzt relevant wird. Wird laufend ergaenzt und abgehakt, nicht geloescht (erledigte Punkte mit [x] markieren, damit die Historie bleibt).

## Architektur

- [x] tueren_content-Tabelle - angelegt, alle neun Kernzeilen (Titel + Prinzip) drin.
- [x] Themenpfad-Varianten (Geld/Liebe/Gesundheit/Identitaet) - fuer alle neun Tueren in tueren_content ergaenzt.
- [x] api/Umkehr.js holt das Tuer-Prinzip aus der Datenbank statt es fest im Code zu haben.
- [ ] Kein generisches Tueren-Template. tuer-eins.html ist noch eine eigene Datei nur fuer Tuer 1. Bei neun Tueren im selben Muster sollte es ein Template geben, das sich Inhalt (inkl. Themenpfad-Frage) aus der Datenbank zieht, statt neun fast identische HTML-Dateien zu pflegen.
- [ ] Keine Tueren-Uebersichtsseite. Man kommt nur ueber die feste Adresse tuer-eins.html rein. Es fehlt eine Landkarte, von der aus man zwischen den neun Tueren waehlt und den eigenen Fortschritt sieht.
- [ ] Themenpfad wird in api/Umkehr.js noch nicht genutzt. Die Fragen liegen jetzt in der Datenbank, aber der Server-Code fragt sie noch nicht ab und nutzt sie nicht in der Journal-Frage. Muss beim Bau des Tueren-Templates mit rein.

## Kontinuitaet zwischen den Tueren

- [ ] Saat-Ernte-Mechanik (Tuer 3 -> Tuer 7) nicht gebaut. Braucht ein gezielt markiertes Feld (z.B. saat_tuer3 in journal oder eigene Tabelle), damit Tuer 7 den Satz aus Tuer 3 wortwoertlich abrufen und zitieren kann.
- [ ] Tag-9-Zusammenfuehrung der Begriffe (Tuer 3/4/5) braucht benannte Variablen. Muss beim Bau von Tuer 9 mitgedacht werden.

## KI-Antwort / Umkehr - Feinschliff

- [x] Morgen-Antwort ist jetzt echte, sofortige Unterstuetzung statt kalter "warte bis heute Abend"-Vertroestung.
- [x] Abend-Rueckmeldung ist jetzt zweiseitig - Person kann selbst schreiben, wie der Tag war, KI geht darauf ein statt nur zu raten.
- [x] Lehr-Ebene eingebaut - jede Antwort muss das Tuer-Prinzip spuerbar einweben, mit Variations-Pflicht (nicht wortgleich wiederholen).
- [x] Griff-fuer-den-Tag im Morgen-Modus konkretisiert - keine vagen philosophischen Saetze ("spuer, wo es eng ist") mehr erlaubt, muss eine wirklich greifbare Handlung sein.
- [ ] Dieselbe "konkret statt philosophisch"-Regel fehlt noch im Abend-Modus. Aktuell nur fuer den Morgen-Griff geschaerft, der Abend-Teil koennte denselben Fehler machen (zu weich, keine greifbare naechste Handlung).
- [ ] Keine Zitate/Philosophen-Verweise - bewusste Entscheidung, nicht einbauen (Risiko falscher Zuschreibungen, wuerde die eigene Stimme verwaessern). Hier dokumentiert, damit die Frage nicht nochmal von vorne aufgerollt wird.

## Fortschritts-Tracking

- [ ] Keine 1-10-Bewertung, morgens/abends. fortschritt-Tabelle hat aktuell nur abgeschlossen_am. Muss um Bewertungsfelder erweitert werden oder eigene Tabelle bekommen.
- [ ] Keine Ergebnis-Darstellung ueber die neun Tage. Wenn die Bewertungen existieren, braucht es eine kurze, persoenliche KI-Zusammenfassung, die die Zahlen einordnet.

## Tag 9 - Abschluss

- [ ] Kompletter Baustein fehlt noch. Personalisierte KI-Rueckschau ueber alle neun Tage plus das "verdiente Buch" als eigenstaendiges Artefakt. Eigener Arbeitsschritt.

## Landingpage / erster Eindruck

- [ ] "Was drueckt gerade?" mit echter kostenloser Umkehr-Antwort ist noch nicht auf der Landingpage. Sollte laut Kern-Dokument prominent auf die erste Seite, nicht versteckt.
- [ ] Kein Vorgeschmack des Wissenschafts-Ankers (Tuer 4) auf der Landingpage.
- [ ] Neun-Tueren-Fahrplan (nur Titel/Kurzbeschreibung) nicht auf der Landingpage sichtbar.

## Rechtliches / Betrieb (vor Live-Gang)

- [ ] E-Mail-Bestaetigung wieder aktivieren (aktuell zu Testzwecken deaktiviert).
- [ ] Impressum, Datenschutz, AGB, Widerruf.
- [ ] Druck-/Versandkosten-Hinweis fuers Buch in den Kaufprozess einbauen.
- [ ] Kostenkalkulation fuer Skalierung (API-Kosten pro Nutzer, Guthaben-Planung).

## Erledigt (zur Historie, nicht loeschen)

- [x] Homepage live, alle sieben Abschnitte
- [x] Alle neun Tueren inhaltlich vollstaendig getextet
- [x] Supabase + vier Tabellen mit Row Level Security
- [x] Geschuetzter KI-Aufruf, dreistufig (Ton A/B/Krisensignal)
- [x] Registrierung + Login funktionieren, Profil wird geladen
- [x] Tuer 1 komplett verkabelt: Morgen-Unterstuetzung sofort, Abend-Rueckmeldung mit eigenen Worten der Person, Lehr-Ebene mit Variation
- [x] tueren_content-Tabelle inkl. Themenpfad-Varianten fuer alle neun Tueren
- [x] api/Umkehr.js holt Tuer-Prinzip live aus der Datenbank
- [x] Griff-fuer-den-Tag im Morgen-Modus auf "konkret, nicht philosophisch" geschaerft
