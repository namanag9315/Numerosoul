const defaultMessage =
  "Hi! I found your website and would like to book a consultation.";

const serviceMessages: Record<string, string> = {
  "baby-name-numerology": "Hi! I need baby name numerology consultation.",
  "vehicle-number": "Hi! I want to check my vehicle number.",
};

export function getWhatsAppLink(message = defaultMessage) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX").replace(/\D/g, "");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getServiceWhatsAppLink(serviceId: string) {
  return getWhatsAppLink(serviceMessages[serviceId] ?? defaultMessage);
}
