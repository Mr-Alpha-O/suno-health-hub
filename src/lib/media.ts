import oxygen from "@/assets/p-oxygen.jpg";
import bed from "@/assets/p-bed.jpg";
import wheelchair from "@/assets/p-wheelchair.jpg";
import monitor from "@/assets/p-monitor.jpg";
import suction from "@/assets/p-suction.jpg";
import nebulizer from "@/assets/p-nebulizer.jpg";
import cpap from "@/assets/p-cpap.jpg";
import mattress from "@/assets/p-mattress.jpg";
import heroImg from "@/assets/hero-care.jpg";
import ambulanceImg from "@/assets/ambulance.jpg";
import equipmentImg from "@/assets/equipment.jpg";

export const productImageFallbacks: Record<string, string> = {
  oxygen, bed, wheelchair, monitor, suction, nebulizer, cpap, mattress,
};

export const heroImageFallback = heroImg;
export const ambulanceImage = ambulanceImg;
export const equipmentImage = equipmentImg;

export function productImage(slug: string, url?: string | null): string {
  if (url && url.trim().length > 0) return url;
  return productImageFallbacks[slug] ?? "";
}

export function waLinkFor(whatsapp: string, msg = "مرحباً، أرغب في الاستفسار عن خدماتكم.") {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
}
