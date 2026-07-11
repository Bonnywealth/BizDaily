import { formatMoney, dateLabel } from "./date";

export function buildReminderMessage(
  debtorName: string,
  amount: number,
  businessName: string,
  dueDate?: string
): string {
  const dueLine = dueDate ? ` due ${dateLabel(dueDate)}` : "";
  return (
    `Hi ${debtorName}, this is a friendly reminder from ${businessName}. ` +
    `You have an outstanding balance of ${formatMoney(amount)}${dueLine}. ` +
    `Kindly make payment at your earliest convenience. Thank you!`
  );
}

export function whatsappReminderLink(message: string, phone?: string): string {
  const encoded = encodeURIComponent(message);
  // No phone number stored yet — omitting it lets WhatsApp prompt the user
  // to pick a contact themselves, so this still works without collecting numbers.
  const base = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "https://wa.me/";
  return `${base}?text=${encoded}`;
}
