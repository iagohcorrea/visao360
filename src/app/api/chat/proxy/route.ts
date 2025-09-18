import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const n8nUsername = process.env.N8N_USERNAME;
    const n8nPassword = process.env.N8N_PASSWORD;

    if (!n8nUsername || !n8nPassword) {
      return NextResponse.json(
        { error: 'N8N_USERNAME or N8N_PASSWORD not configured' },
        { status: 500 }
      );
    }

    const authHeader = 'Basic ' + Buffer.from(`${n8nUsername}:${n8nPassword}`).toString('base64');

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(600000), // 10 minutos de timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro do webhook n8n:', response.status, errorText);
      return NextResponse.json(
        { error: `Webhook error: ${response.statusText}`, raw: errorText },
        { status: response.status }
      );
    }

    const n8nResponse = await response.json();

    // Espera que a resposta do n8n tenha um campo 'output' dentro de um array
    if (!Array.isArray(n8nResponse) || !n8nResponse[0] || typeof n8nResponse[0].output !== 'string') {
      console.warn('Resposta inesperada do n8n:', n8nResponse);
      return NextResponse.json(
        { reply: 'Desculpe, não consegui obter uma resposta válida do AI. Formato de resposta inesperado.', raw: n8nResponse },
        { status: 500 }
      );
    }

    const aiReply = n8nResponse[0].output;

    return NextResponse.json({ reply: aiReply, raw: n8nResponse });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Timeout ao chamar o webhook n8n:', error);
      return NextResponse.json(
        { error: 'Timeout ao tentar se conectar com o AI.' },
        { status: 504 }
      );
    }
    console.error('Erro ao processar mensagem do chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao processar sua mensagem.' },
      { status: 500 }
    );
  }
}
