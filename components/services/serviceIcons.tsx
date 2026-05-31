import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Briefcase,
  Building2,
  CalendarDays,
  Car,
  Edit3,
  Grid3X3,
  Heart,
  Home,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import type { ServiceIconKey } from "@/lib/services";

export const serviceIcons: Record<ServiceIconKey, LucideIcon> = {
  user: User,
  "baby-carriage": Baby,
  car: Car,
  smartphone: Smartphone,
  "edit-3": Edit3,
  "building-2": Building2,
  heart: Heart,
  briefcase: Briefcase,
  home: Home,
  "grid-3x3": Grid3X3,
  "calendar-stats": CalendarDays,
  users: Users,
};
