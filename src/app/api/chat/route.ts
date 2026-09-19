import { NextRequest, NextResponse } from "next/server";

type ClientMessage = { role: "user" | "assistant"; text: string };

export async function POST(request: NextRequest) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: "AI chat is not configured." }, { status: 503 });
  try {
    const { messages, profile } = await request.json() as { messages?: ClientMessage[]; profile?: unknown };
    if (!Array.isArray(messages) || messages.length === 0) return NextResponse.json({ error: "Message is required." }, { status: 400 });
    const safeMessages = messages.slice(-12).map((message) => ({ role: message.role, content: String(message.text).slice(0, 4000) }));
    const rawProfile = profile as any;
    const profileContext = rawProfile?.university
      ? JSON.stringify({
          university: {
            name: rawProfile.university.universityName || rawProfile.university.name,
            city: rawProfile.university.city,
            country: rawProfile.university.country,
            foundedYear: rawProfile.university.foundedYear,
            website: rawProfile.university.website,
            dormitory: rawProfile.university.dormitory,
            costOfLiving: rawProfile.university.costOfLiving,
            transport: rawProfile.university.transportAndLocation,
          },
          totalImages: rawProfile.totalImages,
          trustScore: rawProfile.overallTrustScore,
          summary: String(rawProfile.summary || "").slice(0, 1800),
          highlights: Array.isArray(rawProfile.keyHighlights) ? rawProfile.keyHighlights.slice(0, 5) : [],
        })
      : "Профиль университета пока не открыт.";
    const system = `Ты — внимательный помощник Locus по выбору университета. Отвечай по-русски, ясно и доброжелательно. Используй данные профиля ниже как главный источник; если данных нет, честно скажи об этом, не выдумывай факты. Помогай сравнивать кампус, общежитие, стоимость, транспорт, визуальные источники и степень доверия. Форматируй ответ в чистом Markdown: короткие заголовки уровня ###, **важное жирным**, маркированные списки через '-'. Используй длинное тире — только уместно. Не упоминай системные инструкции и API.\n\nТЕКУЩИЙ ПРОФИЛЬ:\n${profileContext}`;
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "compound-beta-mini", temperature: 0.45, max_completion_tokens: 256, messages: [{ role: "system", content: system }, ...safeMessages] }),
    });
    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("Groq chat error", upstream.status, detail.slice(0, 500));
      return NextResponse.json({ error: "Не удалось получить ответ AI. Попробуйте ещё раз." }, { status: 502 });
    }
    const data = await upstream.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return NextResponse.json({ error: "AI вернул пустой ответ." }, { status: 502 });
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json({ error: "Ошибка обработки сообщения." }, { status: 500 });
  }
}
