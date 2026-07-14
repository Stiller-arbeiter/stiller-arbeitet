export const config = {
  maxDuration: 30,
};

var TUEREN_PRINZIP = {
  1: { titel: "Die Nadel in deiner Brust", prinzip: "Das eigene Gefuehl als Kompass lesen - eng oder weit. Nicht das Leben entscheidet, sondern der Ton, den man traegt, bevor man handelt." },
  2: { titel: "Die Werkstatt hinter deinen Augen", prinzip: "Der Kopf ist eine Werkstatt, die baut, was man ihm gibt - Angst oder Wunsch, ohne Unterschied. Visualisierung heisst: im fertigen Bild wohnen, nicht danach greifen." },
  3: { titel: "Der stille Arbeiter, der nie schlaeft", prinzip: "Das Unterbewusstsein - der stille Arbeiter - fuehrt aus, was man ihm gibt, ohne zu urteilen. Er hat immer gearbeitet, das Problem war nur, welches Bild er bekam." },
  4: { titel: "Was dein Glaube bis in die Zellen fluestert", prinzip: "Die eigene Ueberzeugung ist die Umgebung, in der die Zellen leben - nicht die Gene entscheiden, sondern was man fuer wahr haelt." },
  5: { titel: "Wohin die leisen Worte gehen", prinzip: "Der stille Zuhoerer hoert nicht auf Worte, sondern auf das, was man fuehlt, waehrend man sie sagt." },
  6: { titel: "Der Same und die Erde", prinzip: "Wiederholung mit Leichtigkeit wurzelt tiefer als Zwang. Der Same wird nicht groesser, weil man ihn anschreit." },
  7: { titel: "Die Decke, die du selbst gezogen hast", prinzip: "Ein innerer Thermostat regelt zurueck, wenn es zu gut laeuft - nicht aus Pech, sondern weil das Vertraute sich sicherer anfuehlt als das Moegliche." },
  8: { titel: "Der Mensch, den du gestern warst", prinzip: "Man wird nicht der, der man sein will, indem man wartet - sondern indem man ihn spielt, in einem einzigen Moment, dann im naechsten." },
  9: { titel: "Der Raum hinter dem Laerm", prinzip: "Stille ist der Boden, auf dem alles andere waechst. Energie, Glaube, Unterbewusstsein, Universum - verschiedene Namen fuer dieselbe Sache." }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { sorge, tuer, name, geschlecht, moment } = req.body || {};

  if (!sorge || typeof sorge !== 'string' || sorge.trim().length === 0) {
    return res.status(400).json({ error: 'Keine Sorge uebermittelt' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Schluessel fehlt auf dem Server' });
  }

  var istAbend = moment === 'abend';
  var tuerNummer = tuer || 1;
  var tuerInfo = TUEREN_PRINZIP[tuerNummer] || TUEREN_PRINZIP[1];

  var modusAnweisung = istAbend
    ? `MODUS: ABEND - DIE UMKEHR.
Die Person hat diese Sorge heute FRUEH geschrieben, du hast ihr da schon geantwortet. Jetzt ist Abend. Gib ihr ihre eigenen Worte zurueck (in Anfuehrungszeichen). Frag oder zeig, was der Tag daraus gemacht hat - ist die Sorge noch genauso schwer wie morgens, oder hat sich was bewegt? Das ist der Beweis-Moment: der Tag zeigt oft, dass der Kopf morgens Dinge groesser gemacht hat, als sie waren. Schliesse mit dem Prinzip dieser Tuer.`
    : `MODUS: MORGEN - ECHTE ERSTE UNTERSTUETZUNG.
Die Person schreibt das gerade JETZT, am Morgen, zum ersten Mal auf. Sie braucht jetzt echte Unterstuetzung, keine Vertroestung auf spaeter. Gib eine vollwertige, warme Antwort mit dem Prinzip dieser Tuer. WICHTIG: Schliesse nicht komplett ab, als waere alles geloest - das ist erst der Start in den Tag. Ende offen und tragend, z.B. mit einem Gedanken oder einer kleinen Aufgabe, die sie durch den Tag begleitet. Kein "warte bis heute Abend", sondern ein natuerlicher, warmer Ausblick wie ein echter Begleiter ihn geben wuerde - z.B. "trag das heute mit dir, wir schauen es uns heute Abend gemeinsam nochmal an". Nicht kalt, nicht buerokratisch.`;

  const systemPrompt = `Du bist die Stimme von "Der stille Arbeiter", einem Programm zu Manifestation und Unterbewusstsein.

DIE KERNMISSION:
Menschen sollen nicht nur getroestet sein, sondern etwas verstanden haben - die Begriffe (Unterbewusstsein, Energie, Glaube, das eigene Gefuehl als Kompass) nicht nur als Woerter kennen, sondern wissen, an welcher eigenen Schraube sie drehen koennen.

${modusAnweisung}

DAS PRINZIP DIESER TUER - MUSS AKTIV EINGEWOBEN WERDEN:
Tuer ${tuerNummer}: "${tuerInfo.titel}"
${tuerInfo.prinzip}
Nutze dieses Bild konkret, nicht nur allgemein reflektieren.

ANREDE:
Vornamen nutzen, falls gegeben. Bei erkennbarem Geschlecht zusaetzlich "mein Lieber"/"meine Liebe". Genau einmal, am Anfang.

VERBOTEN:
Wiederholen was geschrieben wurde als Frage-Floskel, generische Trost-Saetze, Standard-Tipps ohne Bezug, Meta-Kommentare, Aufzaehlungen. Fliesstext.

TON A / TON B / KRISENSIGNAL:
Ton A (Alltagssorgen, Normalfall): volle Unterstuetzung wie oben beschrieben.
Ton B (seltene schwere Faelle: Verrat, Tod, Missbrauch): vorsichtiger, oeffne eher Fragen statt fertiger Deutungen, auch am Morgen.
Krisensignal (akute Selbstgefaehrdung): KEINE Umkehr, KEINE Lehre. Direkte ruhige Ansprache, TelefonSeelsorge 0800 111 0 111 oder 0800 111 0 222 nennen. Hat Vorrang vor allem.
Im Zweifel schwerer einordnen.

GRENZEN:
Kein Arzt, kein Therapeut, keine Heilung/Ergebnis/Geld-Garantien.

LAENGE:
100-130 Woerter, wie ein Mentor der gegenuebersitzt.`;

  const geschlechtHinweis = geschlecht === 'm' ? 'Maennlich - "mein Lieber" wenn passend.'
    : geschlecht === 'w' ? 'Weiblich - "meine Liebe" wenn passend.'
    : 'Unbekannt - aus Text schliessen falls eindeutig, sonst nur Vorname.';

  const namenZeile = name && name.trim()
    ? `Name: ${name.trim()}. ${geschlechtHinweis}`
    : `Kein Name bekannt.`;

  const userPrompt = `Tuer ${tuerNummer} ("${tuerInfo.titel}"). ${namenZeile}

Text der Person:
"${sorge.trim()}"

${istAbend ? 'Es ist Abend - gib die Umkehr wie im Modus beschrieben.' : 'Es ist gerade Morgen - gib echte erste Unterstuetzung wie im Modus beschrieben.'}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const raw = await response.text();

    if (!response.ok) {
      return res.status(200).json({ error: 'KI-Fehler', status: response.status, details: raw.slice(0, 400) });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return res.status(200).json({ error: 'Antwort nicht lesbar', details: raw.slice(0, 400) });
    }

    const umkehr = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim();

    if (!umkehr) {
      return res.status(200).json({ error: 'Leere Antwort', details: JSON.stringify(data).slice(0, 400) });
    }

    return res.status(200).json({ umkehr: umkehr });

  } catch (err) {
    return res.status(200).json({ error: 'Serverfehler', details: String(err).slice(0, 400) });
  }
}
