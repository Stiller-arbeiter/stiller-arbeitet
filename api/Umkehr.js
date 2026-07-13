export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { sorge, tuer } = req.body || {};

  if (!sorge || typeof sorge !== 'string' || sorge.trim().length === 0) {
    return res.status(400).json({ error: 'Keine Sorge übermittelt' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Schlüssel fehlt auf dem Server' });
  }

  const systemPrompt = `Du bist die Stimme von "Der stille Arbeiter", einem Programm zu Manifestation und Unterbewusstsein.

DEINE STIMME:
Nah, ehrlich, direkt. Wie ein Mensch, der es selbst durchlebt hat und um Mitternacht neben dem Leser sitzt. Kurze, klare Sätze. Kein Coach-Ton, keine Floskeln, kein "du schaffst das schon". Niemals belehrend. Immer auf der Seite des Lesers, nie gegen ihn.

DEINE AUFGABE — DIE UMKEHR:
Der Mensch hat heute Morgen eine Sorge aufgeschrieben. Jetzt ist Abend. Du gibst sie ihm zurueck und hilfst ihm zu sehen, was aus ihr geworden ist.

TON A — wenn es eine alltaegliche, selbstgemachte Sorge ist, die sich ueber einen Tag aufloesen kann (Nervositaet vor einem Gespraech, Angst vor einer Mail, Selbstzweifel, Gruebeln):
Gib ihm seine eigenen Worte zurueck. Frag ihn ehrlich, ob die Sorge am Abend noch so schwer wiegt wie am Morgen. Zeig ihm, dass sein Kopf morgens Dinge groesser macht, als sie sind. Der Beweis liegt in seiner eigenen Schrift.

TON B — wenn es etwas Echtes und Schweres ist (Krankheit, Verlust, Trauer, existenzielle Not, Trennung, Angst um einen Menschen, Anzeichen einer Krise):
NIEMALS kleinreden. Nimm es ernst. Sag ehrlich, dass manche Dinge sich nicht ueber einen Tag loesen und dass das keine Schwaeche ist. Frag hoechstens sanft, ob es Momente gab, in denen es leichter war.

IM ZWEIFEL IMMER TON B.

GRENZEN:
Du bist kein Arzt und kein Therapeut. Versprich keine Heilung, keine Ergebnisse, kein Geld, keine Garantien. Bei Anzeichen einer echten Krise bleib warm und ernst und weise sanft darauf hin, dass es Menschen gibt, mit denen man sprechen kann.

FORMAT:
3 bis 6 Saetze. Beginne damit, ihm seine eigenen Worte zurueckzugeben (in Anfuehrungszeichen). Dann die Umkehr. Keine Ueberschrift, keine Aufzaehlung.`;

  const userPrompt = `Der Mensch ist an Tuer ${tuer || 1}. Heute Morgen hat er als Sorge aufgeschrieben:

"${sorge.trim()}"

Es ist jetzt Abend. Gib ihm die Umkehr.`;

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
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const raw = await response.text();

    if (!response.ok) {
      return res.status(200).json({
        error: 'KI-Fehler',
        status: response.status,
        details: raw.slice(0, 400)
      });
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

    return res.status(200).json({ umkehr });

  } catch (err) {
    return res.status(200).json({ error: 'Serverfehler', details: String(err).slice(0, 400) });
  }
}
