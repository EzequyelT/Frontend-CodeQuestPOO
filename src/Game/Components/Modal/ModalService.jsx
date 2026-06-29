import { useNavigate } from "react-router-dom";
import ModalChallenge from "./ChallengeBegins";

export default function ModalService({ challenge, isOpen, setIsOpen, mapaId = 1 }) {
  const navigate = useNavigate();

  const mapRoutes = {
    1: "/FlorestaDosAlgoritmos",
    2: "/VilaDaLogica",
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate(mapRoutes[mapaId] || "/FlorestaDosAlgoritmos");
  };

  const handlePlay = () => {
    console.log("Começar o Desafio");
    setIsOpen(false);
  };

  return (
    <ModalChallenge
      isOpen={isOpen}
      onClose={handleClose}
      onPlay={handlePlay}
      challenge={challenge}
    />
  );
}