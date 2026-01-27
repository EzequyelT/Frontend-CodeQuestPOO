import aurelia from "../Assets/Aurelia.png";
import bromm from "../Assets/Bromm.png";
import eldrin from "../Assets/Eldrin.png";
import lyra from "../Assets/Lyra.png";
import tharok from "../Assets/Tharok.png";
import vaelgrim from "../Assets/Vaelgrim.png";

const heroes = [
  {
    id: 1,
    name: "Aurelia",
    image: aurelia,
    title: "A Guardiã da Luz",
    description: "Mestra em encapsulamento, protege dados com barreiras mágicas.",
    stats: { power: 85, wisdom: 90, agility: 75 }
  },
  {
    id: 2,
    name: "Bromm",
    image: bromm,
    title: "O Guerreiro Inabalável",
    description: "Especialista em herança, carrega a força dos ancestrais.",
    stats: { power: 95, wisdom: 70, agility: 60 }
  },
  {
    id: 3,
    name: "Eldrin",
    image: eldrin,
    title: "O Sábio Ancião",
    description: "Mestre do polimorfismo, adapta-se a qualquer desafio.",
    stats: { power: 70, wisdom: 95, agility: 65 }
  },
  {
    id: 4,
    name: "Lyra",
    image: lyra,
    title: "A Arqueira Veloz",
    description: "Especialista em abstração, vê além do código superficial.",
    stats: { power: 75, wisdom: 80, agility: 95 }
  },
  {
    id: 5,
    name: "Tharok",
    image: tharok,
    title: "O Bárbaro Selvagem",
    description: "Domina classes e objetos com força bruta e precisão.",
    stats: { power: 90, wisdom: 65, agility: 70 }
  },
  {
    id: 6,
    name: "Vaelgrim",
    image: vaelgrim,
    title: "O Feiticeiro das Sombras",
    description: "Mestre em interfaces, conecta o mundo visível ao invisível.",
    stats: { power: 80, wisdom: 85, agility: 80 }
  }
];

export default heroes;
