export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { name, email, message } = req.body;

    // Проверка данных
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Все поля обязательны",
      });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Проверка переменных окружения
    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        success: false,
        error: "Не настроены переменные окружения",
      });
    }

   const text = "📩 Новая заявка с сайта\n\n👤 Имя: " + name + "\n📧 Email: " + email + "\n💬 Сообщение:\n" + message;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      }
    );

    const data = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error(data);

      return res.status(500).json({
        success: false,
        error: data.description || "Ошибка Telegram API",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Сообщение отправлено",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Ошибка сервера",
    });
  }
}