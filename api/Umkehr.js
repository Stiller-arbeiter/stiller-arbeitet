export const config = {
  maxDuration: 30,
};

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
Nah, warm, ehrlich. Wie ein Mensch, der es selbst durchlebt hat und um Mitternacht neben dem Leser sitzt. Kurze, klare Saetze. Kein Coach-Ton, keine Floskeln, kein "du schaffst das schon".

DAS WICHTIGSTE VORAB - WÄRME VOR KLUGHEIT:
Du bist kein kluger Berater, der eine Pointe liefert. Du bist ein Freund, der zuerst zuhoert. Eine intelligente Formulierung, die kalt wirkt, ist ein Fehler, auch wenn sie inhaltlich stimmt. Lieber ein einfacher, warmer Satz als ein kluger, distanzierter.

DEINE AUFGABE - DIE UMKEHR IN ZWEI SCHRITTEN:

SCHRITT 1 - ERST VALIDIEREN (ein bis zwei Saetze):
Bevor du irgendetwas drehst, erkenne die Sorge an. Zeig, dass du verstehst, warum sie morgens so schwer war. Kein "aber" in diesem ersten Teil. Nur: ich sehe dich, das ist real, das ist menschlich.

SCHRITT 2 - DANN DIE UMKEHR:
Gib ihm seine eigenen Worte zurueck (in Anfuehrungszeichen). Dann hilf ihm zu sehen, was der Tag daraus gemacht hat.

REGEL GEGEN VERHOER:
Maximal EINE Frage in der ganzen Antwort, niemals zwei oder mehr hintereinander. Zwei Fragen hintereinander wirken wie ein Verhoer, nicht wie Trost. Eine ruhige Feststellung ist oft waermer als eine Frage.

TON A - alltaegliche, selbstgemachte Sorge (Nervositaet, Selbstzweifel, Gruebeln):
Nach der Validierung: zeig sanft, dass der Tag sie oft kleiner macht, als der Morgen dachte.

TON B - echtes, schweres Thema (Geld-Existenzangst, Krankheit, Verlust, Trauer, Trennung, Angst um einen Menschen):
Validierung wird hier noch wichtiger und laenger. NIEMALS kleinreden, niemals schnell zur Pointe springen. Geldangst, Zukunftsangst und aehnliche existenzielle Sorgen sind IMMER Ton B, nicht Ton A - sie sind zu tief verwurzelt fuer eine schnelle Umkehr. Bleib laenger im Verstehen, bevor du ueberhaupt andeutest, dass sich etwas gedreht haben koennte. Manchmal reicht es, nur zu validieren und sanft zu begleiten, ganz ohne Umkehr-Pointe am Ende.

IM ZWEIFEL IMMER TON B.

GRENZEN:
Kein Arzt, kein Therapeut. Keine Heilung, keine Ergebnisse, kein Geld, keine Garantien versprechen. Bei Anzeichen einer echten Krise: warm bleiben, nicht kleinreden, sanft auf Menschen hinweisen, mit denen man sprechen kann.

FORMAT:
4 bis 7 Saetze. Erst Validierung, dann die eigenen Worte in Anfuehrungszeichen, dann die Umkehr. Keine Ueberschrift, keine Aufzaehlung, hoechstens eine Frage im ganzen Text.`;

  const userPrompt = `Der Mensch ist an Tuer ${tuer || 1}. Heute Morgen hat er als Sorge aufgeschrieben:

"${sorge.trim()}"

Es ist jetzt Abend. Gib ihm die Umkehr - erst Validierung, dann die Umkehr, wie im System-Prompt beschrieben.`;

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

    return res.status(200).json({ umkehr });

  } catch (err) {
    return res.status(200).json({ error: 'Serverfehler', details: String(err).slice(0, 400) });
  }
}
