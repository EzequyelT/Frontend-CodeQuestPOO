import HeaderLandPage from "../Components/Header/HeaderLandPage";
import logo from "../Assets/Section1.jpg";
import videoAbertura from "../Assets/Abertura.mp4";

export default function Landpage() {
    return (
        <>
            <div className="bg-black w-full overflow-x-hidden">
                <HeaderLandPage />
            </div>
            <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={logo} 
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={videoAbertura} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-black/15"></div>

                <div className="relative z-10">
                </div>
            </section>

            <section className="relative w-full py-24 px-6 flex items-center justify-center">
                <div className="max-w-4xl mx-auto text-center">

                    <div className="flex items-center justify-center mb-8 gap-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
                                Sobre
                            </h2>
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                    </div>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                        Immerse yourself in Chumbi Valley, an enchanting and mystical play-and-earn blockchain
                        game with intriguing and adorable NFT creatures known as Chumbi. Explore the uncharted
                        forest, start a farm, grow crops and craft special items with your Chumbi companions
                        by your side, while earning crypto rewards.
                    </p>

                </div>
            </section>
        </>

    );
}