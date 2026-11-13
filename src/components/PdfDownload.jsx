import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/** Resolución de la captura: 1.5 equilibra nitidez y tamaño del archivo. */
const CAPTURE_SCALE = 1.5;
/** Calidad JPEG (0-1) usada al incrustar la captura en el PDF. */
const JPEG_QUALITY = 0.7;

/**
 * Añade la imagen al PDF repartiéndola en tantas páginas carta como haga falta.
 * @param {jsPDF} pdf
 * @param {string} imgData Imagen en formato data URL (JPEG).
 */
function addImagePaginated(pdf, imgData) {
	const pageWidth = pdf.internal.pageSize.getWidth();
	const pageHeight = pdf.internal.pageSize.getHeight();
	const imgProps = pdf.getImageProperties(imgData);
	const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

	let heightLeft = imgHeight;
	let position = 0;

	pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight, "", "FAST");
	heightLeft -= pageHeight;

	while (heightLeft > 0) {
		position = heightLeft - imgHeight;
		pdf.addPage();
		pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight, "", "FAST");
		heightLeft -= pageHeight;
	}
}

/**
 * Botón que captura el elemento indicado por `selector` y lo descarga como PDF.
 * @param {{ filename?: string, selector?: string }} props
 */
export default function PdfDownload({
	filename = "orden-cobro.pdf",
	selector = "#orden-cobro",
}) {
	const [isGenerating, setIsGenerating] = useState(false);

	const handleDownload = async () => {
		const element = document.querySelector(selector);
		if (!element) {
			alert(`No se encontró el elemento a exportar: ${selector}`);
			return;
		}

		setIsGenerating(true);
		try {
			const canvas = await html2canvas(element, {
				scale: CAPTURE_SCALE,
				useCORS: true,
				allowTaint: true,
			});
			const imgData = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

			const pdf = new jsPDF({
				unit: "mm",
				format: "letter",
				orientation: "portrait",
			});
			addImagePaginated(pdf, imgData);
			pdf.save(filename);
		} catch (error) {
			console.error("Error al generar el PDF:", error);
			alert("No se pudo generar el PDF. Inténtalo de nuevo.");
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<button
			type="button"
			className="boton"
			onClick={handleDownload}
			disabled={isGenerating}
		>
			{isGenerating ? "Generando PDF..." : "Descargar PDF"}
		</button>
	);
}
