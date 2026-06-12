import api from "../api/axios";

export async function gerarRelatorioPDF(alunoId) {
    try {
        const response = await api.get(`/pdf/${alunoId}`, {
            responseType: "blob",
        });

        const blob = new Blob
            ([response.data],
                {
                    type: "application/pdf"
                }
            );
        const fileURL = window.URL.createObjectURL(blob)

        const link = document.createElement("a");

        link.href = fileURL;

        link.setAttribute("download", "relatorio.pdf");

        document.body.appendChild(link);

        link.click();
        link.remove(); 
        window.URL.revokeObjectURL(fileURL);

    } catch (error) {
        console.error("Erro ao gerar relatório PDF", error);
        throw new Error("Erro ao gerar relatório PDF");
    }
}