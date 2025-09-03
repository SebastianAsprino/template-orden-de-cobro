import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function PdfDownload({
	filename = "orden-cobro.pdf",
	selector = "#orden-cobro",
}) {
	const handleDownload = async () => {
		const element = document.querySelector(selector);
		if (!element) {
			alert("No se encontró el elemento a exportar: " + selector);
			return;
		}

		const canvas = await html2canvas(element, {
			scale: 1.5, // antes estaba en 2
			useCORS: true,
			allowTaint: true,
		});

		const imgData = canvas.toDataURL("image/jpeg", 0.7);

		const pdf = new jsPDF({
			unit: "mm",
			format: "letter",
			orientation: "portrait",
		});

		const pdfWidth = pdf.internal.pageSize.getWidth();
		const imgProps = pdf.getImageProperties(imgData);
		const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

		let heightLeft = imgHeight;
		let position = 0;

		pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight, "", "FAST");
		heightLeft -= pdf.internal.pageSize.getHeight();

		while (heightLeft > 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(
				imgData,
				"JPEG",
				0,
				position,
				pdfWidth,
				imgHeight,
				"",
				"FAST"
			);
			heightLeft -= pdf.internal.pageSize.getHeight();
		}

		pdf.save(filename);
	};

	return (
		<button className="boton" onClick={handleDownload}>
			Descargar PDF
		</button>
	);
}

