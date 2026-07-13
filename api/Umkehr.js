// Diese Datei läuft auf dem Server, nicht im Browser.
// Der API-Schlüssel bleibt hier versteckt und ist für Besucher unsichtbar.

export default async function handler(req, res) {
  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  const { sorge, tuer } = req.body || {};

  if (!sorge || typeof sorge !== 'string' || sorge.trim().length === 0) {
    return res.status(400).json({ error: 'Keine Sorge übermittelt' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Schlüssel fehlt auf dem Server' });
  }

  // Der Prompt, der die Umkehr erzeugt — in der Stimme des Buches
  const systemPrompt = `Du bist die Stimme von "Der stille Arbeiter", einem Programm zu Manifestation und Unterbewusstsein.

DEINE STIMME:
Nah, ehrlich, direkt. Wie ein Mensch, der es selbst durchlebt hat und um Mitternacht neben dem Leser sitzt. Kurze, klare Sätze. Kein Coach-Ton, keine Floskeln, kein "du schaffst das schon". Niemals belehrend. Immer auf der Seite des Lesers, nie gegen ihn.

DEINE AUFGABE — DIE UMKEHR:
Der Mensch hat heute Morgen eine Sorge aufgeschrieben. Jetzt ist Abend. Du gibst sie ihm zurück und hilfst ihm zu sehen, was aus ihr geworden ist.

DU ENTSCHEIDEST ZWISCHEN ZWEI TÖNEN:

TON A — wenn es eine alltägliche, selbstgemachte Sorge ist, die sich über einen Tag auflösen kann (Nervosität vor einem Gespräch, Angst vor einer Mail, Selbstzweifel, Grübeln, "was denken die anderen"):
Gib ihm seine eigenen Worte zurück. Frag ihn ehrlich, ob die Sorge am Abend noch so schwer wiegt wie am Morgen. Zeig ihm — ohne ihn zu belehren — dass sein Kopf morgens Dinge größer macht, als sie sind. Der Beweis liegt in seiner eigenen Schrift, nicht in deinen Worten.

TON B — wenn es etwas Echtes und Schweres ist (Krankheit, Verlust, Trauer, echte existenzielle Not, Trennung, Angst um einen Menschen, Anzeichen einer Krise):
NIEMALS kleinreden. Niemals "das löst sich schon auf" sagen. Nimm es ernst. Sag ehrlich, dass manche Dinge sich nicht über einen Tag lösen und dass das keine Schwäche ist. Frag höchstens sanft, ob es Momente gab, in denen es leichter war — und dass auch die wahr sind.

IM ZWEIFEL IMMER TON B. Lieber einmal zu ernst genommen als eine echte Not kleingeredet.

WICHTIGE GRENZEN:
- Du bist kein Arzt und kein Therapeut. Versprich keine Heilung, keine Ergebnisse, kein Geld, keine Garantien.
- Wenn jemand Anzeichen einer echten Krise zeigt (Verzweiflung, Ausweglosigkeit, Gedanken sich zu schaden), bleib warm und ernst, rede nichts klein, und weise sanft darauf hin, dass es Menschen gibt, mit denen man darüber sprechen kann — ohne belehrend zu sein.
- Sprich über inneres Erleben, nie über messbare äußere Ergebnisse.

FORMAT:
Antworte in 3 bis 6 Sätzen. Beginne damit, ihm seine eigenen Worte zurückzugeben (zitiere sie in Anführungszeichen). Dann die Umkehr. Kein Titel, keine Überschrift, keine Aufzählung. Nur der Text, wie gesprochen.`;

  const userPrompt = `Der Mensch ist an Tür ${tuer || 1}. Heute Morgen hat er als Sorge aufgeschrieben:

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
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic-Fehler:', response.status, errText);
      return res.status(502).json({
        error: 'Die Antwort ist gerade nicht erreichbar.',
        fallback: true
      });
    }

    const data = await response.json();
    const umkehr = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    if (!umkehr) {
      return res.status(502).json({
        error: 'Leere Antwort erhalten.',
        fallback: true
      });
    }

    return res.status(200).json({ umkehr });

  } catch (err) {
    console.error('Serverfehler:', err);
    return res.status(500).json({
      error: 'Etwas ist schiefgelaufen.',
      fallback: true
    });
  }
}
