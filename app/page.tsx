import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "NumeroSoul — Numerologist | Personal Readings, Baby Names, Vehicle Numbers",
  },
  description:
    "Professional numerology consultations in India. Life path, baby name, vehicle number, phone number, and business numerology by NumeroSoul. Book online. Free tools available.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePage />;
}
