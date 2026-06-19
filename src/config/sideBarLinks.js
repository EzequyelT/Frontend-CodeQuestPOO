import { 
  GamepadIcon , 
  Trophy, 
  FolderCode, 
  CheckSquare,
  VenetianMask 
} from "lucide-react";

export const sidebarLinks = [
  {
    id: "Mapas",
    icon: GamepadIcon,
    path: "/maps",
  },
  {
    id: "Desempenhos de código",
    icon: FolderCode,
    path: "/Erros",
  },
  {
    id: "Placar de Líderes",
    icon: Trophy, 
    path: "/leaderBoard",
  },
  {
    id: "Desafios",
    icon: CheckSquare, 
    path: "/challenges",
  },
   {
    id: "Mentores",
    icon: VenetianMask,
    path: "/mentores",
  },
];