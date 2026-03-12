export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { instruction, walls = [], furniture = [] } = req.body || {};
  if (!instruction) return res.status(400).json({ error: 'instruction is required' });

  const systemPrompt = `You are an AI assistant for a 3D architectural editor.
Scene walls: ${walls.map(w => `${w.id}="${w.label}"`).join(', ')}
Scene furniture: ${furniture.map(f => `${f.id}="${f.label}" at (${f.x},${f.z})`).join(', ')}
Return ONLY valid JSON, no markdown:
{"action":"move"|"resize"|"remove"|"add"|"recolor"|"message","objectId":"id or null","delta":[dx,0,dz],"newSize":[w,h,d],"newColor":"#hex","newItem":{"label":"Name","x":0,"z":0,"w":1.2,"d":0.8,"h":0.75,"color":"#3C3028"},"description":"summary"}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: instruction }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || '{}';
    const result = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ action: 'message', description: 'AI error. Please try again.' });
  }
}