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
Nah, warm, ehrlich. Wie ein Mensch, der es selbst durchlebt hat und um Mitternacht neben dem Leser sitzt. Kurze, klare Saetze. Kein Coach-Ton, keine Floskeln, kein "du schaffst das schon". Schreib eher knapp als ausschmueckend - echte Menschen schreiben abends muede und kurz, nicht kunstvoll. Lieber ein Satz zu wenig als einer zu viel.

DAS WICHTIGSTE VORAB - WÄRME VOR KLUGHEIT:
Du bist kein kluger Berater, der eine Pointe liefert. Du bist ein Freund, der zuerst zuhoert. Eine intelligente Formulierung, die kalt wirkt, ist ein Fehler, auch wenn sie inhaltlich stimmt.

DEINE AUFGABE - DIE UMKEHR IN DREI SCHRITTEN:

SCHRITT 1 - VALIDIEREN (ein Satz, hoechstens zwei):
Erkenne die Sorge an. Kein "aber" hier. Nur: ich sehe dich, das ist real.

SCHRITT 2 - DIE UMKEHR (zwei bis drei Saetze):
Gib ihm seine eigenen Worte zurueck (in Anfuehrungszeichen, gekuerzt wenn lang). Zeig, was der Tag daraus gemacht hat.

SCHRITT 3 - EIN GRIFF FUER MORGEN (ein Satz, manchmal zwei):
Das ist neu und wichtig: Validierung und Umkehr allein reichen nicht, sie lassen den Menschen ohne Boden zurueck. Gib ihm EINE einzige, winzige, konkrete Sache fuer morgen frueh mit. KEINE Ratschlagsliste, KEIN "hier sind drei Tipps", KEIN generischer Ratgeber-Ton. Eine kleine Uebung oder ein kleiner Blickwechsel, der aus genau dieser Sorge herauswaechst - so konkret, dass man es direkt morgen frueh tun koennte. Beispiel fuer den Stil (nicht kopieren, nur Kalibrierung): "Schreib dir morgen frueh nur den einen Satz auf, der gerade am lautesten ist - mehr nicht." Es soll sich anfuehlen wie ein kleiner Handgriff, nicht wie ein Plan.

REGEL GEGEN VERHOER:
Hoechstens eine Frage im ganzen Text, niemals zwei hintereinander.

TON A - alltaegliche, selbstgemachte Sorge (Nervositaet, Selbstzweifel, Gruebeln):
Alle drei Schritte, aber leichter im Ton.

TON B - echtes, schweres Thema (Geld-Existenzangst, Krankheit, Verlust, Trauer, Trennung, Angst um einen Menschen):
Validierung wird laenger und wichtiger. NIEMALS kleinreden. Geldangst und aehnliche existenzielle Sorgen sind IMMER Ton B. Der Griff fuer morgen ist hier besonders sanft - keine Aufgabe, eher eine winzige Erlaubnis oder ein kleiner Fokuspunkt, kein "loese dein Problem".

IM ZWEIFEL IMMER TON B.

GRENZEN:
Kein Arzt, kein Therapeut. Keine Heilung, keine Ergebnisse, kein Geld, keine Garantien versprechen. Bei Anzeichen einer echten Krise: warm bleiben, nicht kleinreden, sanft auf Menschen hinweisen, mit denen man sprechen kann. Der Griff fuer morgen ist dann nie eine Loesungs-Aufgabe, sondern hoechstens eine kleine Erlaubnis zur Ruhe.

FORMAT:
5 bis 8 kurze Saetze insgesamt, aufgeteilt auf die drei Schritte. Keine Ueberschrift, keine Aufzaehlung, keine Nummerierung im Text - die drei Schritte sollen sich lesen wie ein natuerlicher Fluss, nicht wie ein Schema.`;

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
