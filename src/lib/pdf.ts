import type { WorksheetData } from '@/types';

export async function generateWorksheetPdf(data: WorksheetData): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const line = (dy = 6) => { y += dy; };

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Lembaran Kerja Add Math — Nombor Indeks / Linear Programming', margin, y, { maxWidth: contentW });
  line(8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Kelas: ${data.className}`, margin, y);
  doc.text(`Tarikh: ${data.date}`, pageW - margin, y, { align: 'right' });
  line(5);

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  line(8);

  // Steps
  data.steps.forEach((step, si) => {
    const stepVariants = data.variants.filter(v => v.kp_step_id === step.id).slice(0, 2);

    // Step header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const stepHeader = `Kemahiran ${si + 1}: ${step.step_description_bm}`;
    const headerLines = doc.splitTextToSize(stepHeader, contentW);
    doc.text(headerLines, margin, y);
    y += headerLines.length * 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`(${step.mark_value} markah)`, margin, y);
    doc.setTextColor(0, 0, 0);
    line(7);

    // Variants as questions
    stepVariants.forEach((v, vi) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const qLabel = `${si + 1}${String.fromCharCode(97 + vi)}) `;
      const qText = v.prompt_bm || v.prompt_en;
      const fullText = qLabel + qText;
      const lines = doc.splitTextToSize(fullText, contentW);
      doc.text(lines, margin, y);
      y += lines.length * 5.5;

      // Answer blank
      line(5);
      doc.setDrawColor(180, 180, 180);
      doc.line(margin + 10, y, margin + 100, y);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Jawapan:', margin, y - 1);
      doc.setTextColor(0, 0, 0);
      line(10);
    });

    // Page break check
    if (y > 260 && si < data.steps.length - 1) {
      doc.addPage();
      y = margin;
    }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Dijana oleh Tacly — tacly.vercel.app', margin, 285);
  doc.text(`${new Date().toLocaleDateString('ms-MY')}`, pageW - margin, 285, { align: 'right' });

  doc.save(`lembaran-kerja-${data.className.replace(/\s+/g, '-')}.pdf`);
}
