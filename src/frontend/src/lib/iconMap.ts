import {
  Brain,
  Compass,
  Eye,
  Footprints,
  Heart,
  Leaf,
  type LucideIcon,
  MessageCircle,
  Smile,
  Star,
  Sun,
  Waves,
  Wind,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  consultation: MessageCircle,
  message: MessageCircle,
  talk: MessageCircle,
  walk: Footprints,
  walking: Footprints,
  stroll: Footprints,
  mindfulness: Brain,
  meditation: Brain,
  mind: Brain,
  beach: Waves,
  waves: Waves,
  sea: Waves,
  water: Waves,
  nature: Leaf,
  leaf: Leaf,
  green: Leaf,
  sun: Sun,
  light: Sun,
  warmth: Sun,
  heart: Heart,
  care: Heart,
  love: Heart,
  breath: Wind,
  breathing: Wind,
  wind: Wind,
  air: Wind,
  explore: Compass,
  compass: Compass,
  guide: Compass,
  star: Star,
  smile: Smile,
  happiness: Smile,
  vision: Eye,
  eye: Eye,
};

export function getIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  for (const key of Object.keys(iconMap)) {
    if (lower.includes(key)) return iconMap[key];
  }
  return Waves;
}
