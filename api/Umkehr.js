export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { sorge, abendText, tuer, name, geschlecht, moment, themenpfad } = req.body || {};

  if (!sorge || typeof sorge !== 'string' || sorge.trim().length === 0) {
    return res.status(400).json({ error: 'Keine Sorge uebermittelt' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Schluessel fehlt auf dem Server' });
  }

  var tuerNummer = tuer || 1;

  var SUPABASE_URL = 'https://kkgpsjlchcfrkcfhbgtp.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_L2hwq-MPg-2ZdCd6Dw2RUA_Hw_oT0vp';

  var tuerInfo;
  var themenpfadFrage = null;
  try {
    var spalte = 'titel,prinzip';
    if (themenpfad === 'geld') spalte += ',journal_frage_geld';
    else if (themenpfad === 'liebe') spalte += ',journal_frage_liebe';
    else if (themenpfad === 'gesundheit') spalte += ',journal_frage_gesundheit';
    else if (themenpfad === 'identitaet') spalte += ',journal_frage_identitaet';

    var dbResponse = await fetch(
      SUPABASE_URL + '/rest/v1/tueren_content?tuer=eq.' + tuerNummer + '&select=' + spalte,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY
        }
      }
    );
    var dbData = await dbResponse.json();
    if (dbData && dbData.length > 0) {
      tuerInfo = { titel: dbData[0].titel, prinzip: dbData[0].prinzip };
      if (themenpfad === 'geld') themenpfadFrage = dbData[0].journal_frage_geld;
      else if (themenpfad === 'liebe') themenpfadFrage = dbData[0].journal_frage_liebe;
      else if (themenpfad === 'gesundheit') themenpfadFrage = dbData[0].journal_frage_gesundheit;
      else if (themenpfad === 'identitaet') themenpfadFrage = dbData[0].journal_frage_identitaet;
    } else {
      tuerInfo = { titel: 'Die Nadel in deiner Brust', prinzip: 'Das eigene Gefuehl als Kompass lesen - eng oder weit.' };
    }
  } catch (e) {
    tuerInfo = { titel: 'Die Nadel in deiner Brust', prinzip: 'Das eigene Gefuehl als Kompass lesen - eng oder weit.' };
  }

  var istAbend = moment === 'abend';
  var hatAbendText = istAbend && abendText && abendText.trim().length > 0;

  var themenpfadZeile = themenpfadFrage
    ? `\n\nTHEMENPFAD DIESER PERSON: ${themenpfad}. Die zu ihrem Pfad passende Zuspitzung, die du im Hinterkopf behalten kannst (nicht wortwoertlich abfragen, nur als Farbe fuer deine Antwort nutzen): "${themenpfadFrage}"`
    : '';

  var modusAnweisung;
  if (!istAbend) {
    modusAnweisung = `MODUS: MORGEN - ECHTE ERSTE UNTERSTUETZUNG.
Die Person schreibt das gerade JETZT, am Morgen, zum ersten Mal auf. Sie braucht jetzt echte Unterstuetzung, keine Vertroestung auf spaeter. Gib eine vollwertige, warme Antwort mit dem Prinzip dieser Tuer.

WICHTIG - DER GRIFF FUER DEN TAG MUSS KONKRET SEIN, NICHT PHILOSOPHISCH:
Am Ende brauchst du EINE einzige, wirklich greifbare Handlung fuer heute - keine vage Aufforderung wie "spuer, wo es eng ist" oder "lass Raum". Die Handlung muss so klar sein, dass die Person genau weiss, was sie um 14 Uhr im Buero tun soll. Die Handlung soll aus der KONKRETEN Sorge der Person geboren sein, nicht generisch sein.

Schliesse nicht komplett ab - das ist erst der Start in den Tag. Der letzte Satz ist ein warmer, offener Ausblick, z.B. "trag das heute mit dir, wir schauen es uns heute Abend gemeinsam nochmal an". Nicht kalt, nicht buerokratisch.`;
  } else if (hatAbendText) {
    modusAnweisung = `MODUS: ABEND - MIT ECHTER RUECKMELDUNG DER PERSON.
Die Person hat morgens diese Sorge geschrieben (unten als SORGE MORGENS). Jetzt ist Abend, und sie hat SELBST aufgeschrieben, wie es ihr jetzt geht (unten als RUECKMELDUNG ABENDS). Das ist keine Vermutung von dir - nutze genau das, was sie geschrieben hat. Wenn sie sagt, es ist besser geworden: bestaetige das ehrlich und zeig, warum das zum Prinzip dieser Tuer passt. Wenn sie sagt, es ist immer noch schwer: nimm das ernst, rede es nicht klein, aber biete trotzdem die Tuer-Lehre als neuen Blickwinkel an. Gib ihre eigenen Worte aus beiden Texten zurueck (kurz, in Anfuehrungszeichen). Schliesse mit dem Prinzip dieser Tuer und mit EINEM konkreten, greifbaren Gedanken fuer morgen - nicht philosophisch-vage.`;
  } else {
    modusAnweisung = `MODUS: ABEND - OHNE EIGENE RUECKMELDUNG.
Die Person hat morgens diese Sorge geschrieben, aber abends keine eigene Rueckmeldung dazugeschrieben. Gib ihr ihre Morgen-Worte zurueck (in Anfuehrungszeichen) und frag sanft, ob es sich seitdem veraendert hat - ohne es zu behaupten, da du es nicht sicher weisst. Schliesse mit dem Prinzip dieser Tuer.`;
  }

  const systemPrompt = `Du bist die Stimme von "Der stille Arbeiter", einem Programm zu Manifestation und Unterbewusstsein.

DIE KERNMISSION:
Menschen sollen nicht nur getroestet sein, sondern etwas verstanden haben - die Begriffe (Unterbewusstsein, Energie, Glaube, das eigene Gefuehl als Kompass) nicht nur als Woerter kennen, sondern wissen, an welcher eigenen Schraube sie drehen koennen.

${modusAnweisung}

DAS PRINZIP DIESER TUER - MUSS SPUERBAR EINFLIESSEN:
Tuer ${tuerNummer}: "${tuerInfo.titel}"
${tuerInfo.prinzip}
Nutze dieses Bild, aber VARIIERE, wie du es einbaust - mal explizit benennen, mal nur anklingen lassen, nie wortgleich wiederholen.${themenpfadZeile}

ANREDE:
Vornamen nutzen, falls gegeben. Bei erkennbarem Geschlecht zusaetzlich "mein Lieber"/"meine Liebe". Genau einmal, am Anfang.

VERBOTEN:
Generische Trost-Saetze, Standard-Tipps ohne Bezug, Meta-Kommentare, Aufzaehlungen. Fliesstext.

TON A / TON B / KRISENSIGNAL:
Ton A (Alltagssorgen, Normalfall): volle Unterstuetzung wie oben beschrieben.
Ton B (seltene schwere Faelle: Verrat, Tod, Missbrauch): vorsichtiger, oeffne eher Fragen statt fertiger Deutungen.
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

  var userPrompt = `Tuer ${tuerNummer} ("${tuerInfo.titel}"). ${namenZeile}

SORGE MORGENS:
"${sorge.trim()}"`;

  if (hatAbendText) {
    userPrompt += `

RUECKMELDUNG ABENDS (von der Person selbst geschrieben):
"${abendText.trim()}"`;
  }

  userPrompt += `

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
