export type MetaWhatsappResult = {
  error?: string;
  messageId?: string;
  sent: boolean;
};

export async function sendMetaWhatsapp({
  to,
  text,
  templateName,
  templateParams,
}: {
  to: string;
  text?: string;
  templateName?: string;
  templateParams?: string[];
}): Promise<MetaWhatsappResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    return {
      error: "WhatsApp credentials not configured in environment.",
      sent: false,
    };
  }

  // Sanitize phone number (remove all non-digits)
  let cleanTo = to.replace(/\D/g, "");

  // If it's a 10-digit number, assume Indian country code (+91)
  if (cleanTo.length === 10) {
    cleanTo = `91${cleanTo}`;
  }

  if (!cleanTo) {
    return {
      error: "Invalid recipient phone number.",
      sent: false,
    };
  }

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  let bodyData: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: cleanTo,
  };

  if (templateName) {
    // Send structured template message
    bodyData = {
      ...bodyData,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: "en",
        },
        components: templateParams && templateParams.length > 0
          ? [
              {
                type: "body",
                parameters: templateParams.map((param) => ({
                  text: param,
                  type: "text",
                })),
              },
            ]
          : [],
      },
    };
  } else if (text) {
    // Send freeform text message (succeeds only if 24h user-initiated window is active)
    bodyData = {
      ...bodyData,
      text: {
        body: text,
      },
      type: "text",
    };
  } else {
    return {
      error: "Either text message or templateName must be provided.",
      sent: false,
    };
  }

  try {
    const response = await fetch(url, {
      body: JSON.stringify(bodyData),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = (await response.json()) as {
      error?: { message: string; code: number };
      messages?: Array<{ id: string }>;
    };

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || `HTTP ${response.status} ${response.statusText}`;
      return {
        error: errMsg,
        sent: false,
      };
    }

    const messageId = data.messages?.[0]?.id;

    return {
      messageId,
      sent: true,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    return {
      error: errMsg,
      sent: false,
    };
  }
}
