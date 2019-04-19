import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const exportToPDF = (fileName, divName, orientation) => {
    document.getElementById(divName).style.letterSpacing = '0.1px';
    const input = document.getElementById(divName);
    html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: orientation,
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true
            });
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'JPEG', 10, 10, width * 0.9, height * 0.9);
            // pdf.output('dataurlnewwindow');
            pdf.save(`${fileName}.pdf`);
        })
    ;
}

export default {exportToPDF};
