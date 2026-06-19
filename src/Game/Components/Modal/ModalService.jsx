import { useNavigate } from "react-router-dom";
import ModalChallenge from "./ChallengeBegins"

export default function ModalService({ challenge, isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate("/FlorestaDosAlgoritmos");
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

