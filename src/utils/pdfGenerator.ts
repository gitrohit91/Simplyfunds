import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Currency formatting utility for PDFs (uses INR / Rs. for universal PDF font compatibility)
const formatINR = (val: number): string => {
  if (isNaN(val) || val === undefined || val === null) return 'INR 0';
  return `INR ${Math.round(val).toLocaleString('en-IN')}`;
};

const formatInWords = (num: number): string => {
  if (!num || num <= 0) return '';
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${cr} Crore${Number(cr) > 1 ? 's' : ''}`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `${lakh} Lakh${Number(lakh) > 1 ? 's' : ''}`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')} Thousand`;
  }
  return `${num.toLocaleString('en-IN')}`;
};

/**
 * Draws the official Simply Funds 3D geometric polygon logo directly in jsPDF vector paths.
 * Renders completely crisp at any print resolution/zoom without raster pixelation.
 */
export const drawLogo = (doc: jsPDF, x: number, y: number, size: number = 22) => {
  const p = (u: number, v: number) => ({
    x: x + (u / 100) * size,
    y: y + (v / 100) * size,
  });

  // Base background hexagon silhouette
  doc.setFillColor(15, 23, 42); // slate-900
  const hexA = p(50, 18);
  const hexB = p(82, 36.5);
  const hexC = p(82, 63.5);
  const hexD = p(50, 82);
  const hexE = p(18, 63.5);
  const hexF = p(18, 36.5);
  const hexCenter = p(50, 50);
  
  doc.triangle(hexA.x, hexA.y, hexB.x, hexB.y, hexCenter.x, hexCenter.y, 'F');
  doc.triangle(hexB.x, hexB.y, hexC.x, hexC.y, hexCenter.x, hexCenter.y, 'F');
  doc.triangle(hexC.x, hexC.y, hexD.x, hexD.y, hexCenter.x, hexCenter.y, 'F');
  doc.triangle(hexD.x, hexD.y, hexE.x, hexE.y, hexCenter.x, hexCenter.y, 'F');
  doc.triangle(hexE.x, hexE.y, hexF.x, hexF.y, hexCenter.x, hexCenter.y, 'F');
  doc.triangle(hexF.x, hexF.y, hexA.x, hexA.y, hexCenter.x, hexCenter.y, 'F');

  // 1. Top Facet (Golden Amber: #f59e0b)
  // Coordinates in 0..100: (50, 20), (80, 37.5), (50, 55), (20, 37.5)
  const top1 = p(50, 20);
  const top2 = p(80, 37.5);
  const top3 = p(50, 55);
  const top4 = p(20, 37.5);
  doc.setFillColor(245, 158, 11);
  doc.triangle(top1.x, top1.y, top2.x, top2.y, top3.x, top3.y, 'F');
  doc.triangle(top1.x, top1.y, top3.x, top3.y, top4.x, top4.y, 'F');

  // 2. Left Facet (Royal Blue: #3b82f6)
  // Coordinates in 0..100: (20, 37.5), (50, 55), (50, 80), (20, 62.5)
  const left1 = p(20, 37.5);
  const left2 = p(50, 55);
  const left3 = p(50, 80);
  const left4 = p(20, 62.5);
  doc.setFillColor(59, 130, 246);
  doc.triangle(left1.x, left1.y, left2.x, left2.y, left3.x, left3.y, 'F');
  doc.triangle(left1.x, left1.y, left3.x, left3.y, left4.x, left4.y, 'F');

  // 3. Right Facet (Crimson Red: #ef4444)
  // Coordinates in 0..100: (50, 55), (80, 37.5), (80, 62.5), (50, 80)
  const right1 = p(50, 55);
  const right2 = p(80, 37.5);
  const right3 = p(80, 62.5);
  const right4 = p(50, 80);
  doc.setFillColor(239, 68, 68);
  doc.triangle(right1.x, right1.y, right2.x, right2.y, right3.x, right3.y, 'F');
  doc.triangle(right1.x, right1.y, right3.x, right3.y, right4.x, right4.y, 'F');

  // 4. Magenta / Fuchsia lower right facet (#d946ef)
  // Coordinates in 0..100: (50, 67.5), (80, 50), (80, 62.5), (50, 80)
  const mag1 = p(50, 67.5);
  const mag2 = p(80, 50);
  const mag3 = p(80, 62.5);
  const mag4 = p(50, 80);
  doc.setFillColor(217, 70, 239);
  doc.triangle(mag1.x, mag1.y, mag2.x, mag2.y, mag3.x, mag3.y, 'F');
  doc.triangle(mag1.x, mag1.y, mag3.x, mag3.y, mag4.x, mag4.y, 'F');

  // 5. Central Diamond Highlight (Translucent Light Gold: #fef08a)
  // Coordinates in 0..100: (50, 55), (65, 46.25), (50, 37.5), (35, 46.25)
  const hl1 = p(50, 55);
  const hl2 = p(65, 46.25);
  const hl3 = p(50, 37.5);
  const hl4 = p(35, 46.25);
  doc.setFillColor(254, 240, 138);
  doc.triangle(hl1.x, hl1.y, hl2.x, hl2.y, hl3.x, hl3.y, 'F');
  doc.triangle(hl1.x, hl1.y, hl3.x, hl3.y, hl4.x, hl4.y, 'F');
};

const drawHeader = (doc: jsPDF, title: string, subtitle: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Dark Accent Header Bar
  doc.setFillColor(15, 23, 42); // Slate-900 (Rich dark luxury blue)
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Brand Accent Bottom Border (Vibrant Blue stripe)
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 32, pageWidth, 2.5, 'F');

  // Draw the Simply Funds Website Logo Symbol
  drawLogo(doc, 12, 5, 22);

  // Brand Text next to the Logo
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('SIMPLY FUNDS', 38, 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(251, 191, 36); // Amber-400
  doc.text('YOUR DREAMS, OUR LOANS!', 38, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text('Authorized Multi-Bank Direct Selling Partner (DSA)', 38, 23);
  doc.setTextColor(147, 197, 253); // Blue-300
  doc.text('Contact: +91 8100617164 | support@simplyfunds.in | www.simplyfunds.in', 38, 28);

  // Report Title Badge on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), pageWidth - 14, 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  const dateStr = `Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  doc.text(dateStr, pageWidth - 14, 18.5, { align: 'right' });
  doc.text(`Ref: SF-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - 14, 23.5, { align: 'right' });
  doc.setTextColor(253, 224, 71); // Yellow-300
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('OFFICIAL ASSESSMENT', pageWidth - 14, 28, { align: 'right' });

  // Subtitle banner below header
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 38, pageWidth - 28, 11, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 38, pageWidth - 28, 11, 'S');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(subtitle, 18, 45);
};

const drawFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Bottom divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

  // Mini footer logo
  drawLogo(doc, pageWidth - 32, pageHeight - 14, 8);

  // Footer Disclaimer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Disclaimer: This report is an indicative financial calculation. Final loan sanction, interest rate, and eligibility are subject to credit bureau score, lender underwriting norms, and document verification.',
    14,
    pageHeight - 11,
    { maxWidth: pageWidth - 50 }
  );
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Simplyfunds.in | Dedicated Loan Advisory', 14, pageHeight - 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Authorized Partner Across 40+ Top Banks & NBFCs', 72, pageHeight - 6);
};

// ==========================================
// 1. EMI CALCULATOR PDF REPORT
// ==========================================
export interface EMIReportParams {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureUnit: 'years' | 'months';
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  borrowerName?: string;
}

export const generateEMIReportPDF = (params: EMIReportParams) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  drawHeader(doc, 'Loan Repayment & EMI Schedule', 'Official Loan Amortization & Repayment Assessment');

  let currentY = 54;

  // Borrower / Request Details if available
  if (params.borrowerName && params.borrowerName.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`Applicant Name: ${params.borrowerName.trim()}`, 14, currentY);
    currentY += 6;
  }

  // Key Summary Metric Cards Grid (3 Columns)
  const cardWidth = (pageWidth - 28 - 8) / 3;
  const cardHeight = 22;

  // Box 1: Monthly EMI
  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(79, 70, 229);
  doc.text('MONTHLY EMI', 18, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text(formatINR(params.monthlyEMI), 18, currentY + 14);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('per month installment', 18, currentY + 19);

  // Box 2: Total Interest
  doc.setFillColor(254, 243, 199); // Amber-50
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(14 + cardWidth + 4, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text('TOTAL INTEREST PAYABLE', 18 + cardWidth + 4, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(120, 53, 15);
  doc.text(formatINR(params.totalInterest), 18 + cardWidth + 4, currentY + 14);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const intPct = params.totalPayment > 0 ? ((params.totalInterest / params.totalPayment) * 100).toFixed(1) : '0';
  doc.text(`${intPct}% of total repayment`, 18 + cardWidth + 4, currentY + 19);

  // Box 3: Total Payable (P + I)
  doc.setFillColor(240, 253, 244); // Emerald-50
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14 + (cardWidth + 4) * 2, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61);
  doc.text('TOTAL REPAYMENT AMOUNT', 18 + (cardWidth + 4) * 2, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(6, 78, 59);
  doc.text(formatINR(params.totalPayment), 18 + (cardWidth + 4) * 2, currentY + 14);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Principal + Cumulative Interest', 18 + (cardWidth + 4) * 2, currentY + 19);

  currentY += cardHeight + 8;

  // Loan Configuration Table
  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Parameter', 'Evaluated Value', 'Remarks & Insights']],
    body: [
      ['Requested Principal Loan Amount', `${formatINR(params.loanAmount)} (${formatInWords(params.loanAmount)})`, 'Sanction base principal sum'],
      ['Annual Interest Rate (ROI)', `${params.interestRate}% p.a.`, 'Calculated on monthly reducing balance method'],
      ['Repayment Tenure', `${params.tenure} ${params.tenureUnit} (${params.tenureUnit === 'years' ? params.tenure * 12 : params.tenure} EMIs)`, 'Total repayment period in equated installments'],
      ['Calculated Monthly EMI', formatINR(params.monthlyEMI), 'Equated Monthly Installment to be debited'],
      ['Overall Interest Outflow', formatINR(params.totalInterest), `Total interest cost over full loan tenure`],
      ['Total Repayment Commitment', formatINR(params.totalPayment), 'Net amount paid to lender across tenure'],
    ],
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 58 },
      1: { fontStyle: 'bold', cellWidth: 60, textColor: [37, 99, 235] },
      2: { cellWidth: 'auto', textColor: [71, 85, 105] },
    },
    margin: { left: 14, right: 14 },
  });

  // Calculate Amortization Schedule Table (Year-by-Year)
  const totalMonths = params.tenureUnit === 'years' ? params.tenure * 12 : params.tenure;
  const monthlyRate = params.interestRate / 12 / 100;
  let balance = params.loanAmount;
  const yearlyRows: Array<[string, string, string, string, string]> = [];

  const totalYears = Math.ceil(totalMonths / 12);
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let year = 1; year <= totalYears; year++) {
    const monthsInThisYear = year === totalYears ? (totalMonths % 12 || 12) : 12;
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= monthsInThisYear; m++) {
      if (balance <= 0) break;
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(balance, params.monthlyEMI - interestPayment);
      yearInterest += interestPayment;
      yearPrincipal += principalPayment;
      balance = Math.max(0, balance - principalPayment);
    }

    cumulativePrincipal += yearPrincipal;
    cumulativeInterest += yearInterest;

    yearlyRows.push([
      `Year ${year}`,
      formatINR(yearPrincipal),
      formatINR(yearInterest),
      formatINR(yearPrincipal + yearInterest),
      formatINR(balance),
    ]);

    if (balance <= 0) break;
  }

  // Next Table: Amortization Schedule
  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Annual Amortization & Balance Schedule', 14, finalY);

  autoTable(doc, {
    startY: finalY + 3,
    theme: 'striped',
    head: [['Year / Period', 'Principal Paid', 'Interest Paid', 'Total EMI Paid', 'Ending Balance']],
    body: yearlyRows,
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 28 },
      1: { cellWidth: 38 },
      2: { cellWidth: 38 },
      3: { cellWidth: 38, fontStyle: 'bold' },
      4: { cellWidth: 'auto', fontStyle: 'bold', textColor: [15, 23, 42] },
    },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);

  // Save the document
  const fileName = `SimplyFunds_EMI_Report_${Math.round(params.loanAmount / 1000)}k_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

// ==========================================
// 2. ELIGIBILITY FINDINGS PDF REPORT
// ==========================================
export interface EligibilityReportParams {
  grossIncome: number;
  existingEmis: number;
  payslipDeductions: number;
  tenure: number;
  tenureType: 'years' | 'months';
  expectedRate: number;
  foir: string;
  maxEligibleLoan: number;
  maxAffordableEMI: number;
  borrowerName?: string;
  loanType?: string;
}

export const generateEligibilityReportPDF = (params: EligibilityReportParams) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  drawHeader(doc, 'Loan Eligibility Assessment', 'Multi-Bank FOIR & Capacity Underwriting Report');

  let currentY = 54;

  if (params.borrowerName && params.borrowerName.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`Candidate / Applicant: ${params.borrowerName.trim()}`, 14, currentY);
    currentY += 6;
  }

  // Key Summary Metric Cards Grid (2 Highlight Banners)
  const bannerWidth = (pageWidth - 28 - 6) / 2;
  const bannerHeight = 26;

  // Box 1: Estimated Sanction Potential
  doc.setFillColor(254, 243, 199); // Amber-50
  doc.setDrawColor(245, 158, 11); // Amber-500
  doc.roundedRect(14, currentY, bannerWidth, bannerHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text('MAXIMUM ELIGIBLE LOAN CAPACITY', 18, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(120, 53, 15);
  doc.text(formatINR(params.maxEligibleLoan), 18, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(146, 64, 14);
  doc.text(`Estimated Sanction: approx. ${formatInWords(params.maxEligibleLoan)}`, 18, currentY + 22);

  // Box 2: Max Affordable Monthly EMI
  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(99, 102, 241);
  doc.roundedRect(14 + bannerWidth + 6, currentY, bannerWidth, bannerHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(67, 56, 202);
  doc.text('MAX AFFORDABLE MONTHLY EMI', 18 + bannerWidth + 6, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 27, 75);
  doc.text(`${formatINR(params.maxAffordableEMI)} / mo`, 18 + bannerWidth + 6, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Derived after ${params.foir}% FOIR & existing deductions`, 18 + bannerWidth + 6, currentY + 22);

  currentY += bannerHeight + 8;

  // Income & Obligation Breakdown
  const netIncome = Math.max(0, params.grossIncome - params.payslipDeductions);
  const foirAmount = (params.grossIncome * Number(params.foir)) / 100;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Underwriting Parameter', 'Applicant Figure', 'Regulatory & Banking Impact']],
    body: [
      ['Gross Monthly Income', formatINR(params.grossIncome), `Primary base income (${formatInWords(params.grossIncome)}/month)`],
      ['Existing Monthly EMIs', formatINR(params.existingEmis), params.existingEmis > 0 ? 'Current active bank loan repayments' : 'Nil active loan obligations'],
      ['Salary Deductions (PF / PTax)', formatINR(params.payslipDeductions), 'Statutory / office deductions on payslip'],
      ['Net In-Hand / Take-Home', formatINR(netIncome), 'Estimated disposable monthly liquidity'],
      ['Bank FOIR Norm Applied', `${params.foir}% of Gross Income`, `Allowable debt obligation budget: ${formatINR(foirAmount)}/mo`],
      ['Maximum Affordable Fresh EMI', formatINR(params.maxAffordableEMI), 'Residual EMI servicing headroom available'],
      ['Assumed Interest Rate (ROI)', `${params.expectedRate}% p.a.`, 'Benchmark floating interest rate'],
      ['Proposed Tenure', `${params.tenure} ${params.tenureType}`, `${params.tenureType === 'years' ? params.tenure * 12 : params.tenure} Monthly installment cycles`],
    ],
    headStyles: {
      fillColor: [217, 119, 6], // Amber-600
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 56 },
      1: { fontStyle: 'bold', cellWidth: 50, textColor: [180, 83, 9] },
      2: { cellWidth: 'auto', textColor: [71, 85, 105] },
    },
    margin: { left: 14, right: 14 },
  });

  // Actionable Advice / Enhancement Matrix
  const afterTableY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Ways to Maximize Your Sanction Amount with SimplyFunds', 14, afterTableY);

  autoTable(doc, {
    startY: afterTableY + 3,
    theme: 'striped',
    head: [['Enhancement Lever', 'Actionable Recommendation', 'Potential Eligibility Boost']],
    body: [
      ['Co-Applicant Addition', 'Add spouse or earning parents as co-borrowers to pool household income.', '+30% to +80% higher loan eligibility'],
      ['Debt Consolidation', 'Foreclose high-rate personal loans/credit cards to free up monthly FOIR headroom.', 'Immediate boost to disposable EMI headroom'],
      ['Tenure Extension', 'Opt for maximum tenure (up to 30 years for Home Loans) to lower monthly EMI.', 'Lowers EMI burden and increases sanctioned sum'],
      ['Banking Surrogate Programs', 'Leverage GST returns, banking turnover, or liquid investments as surrogate income.', 'Enables bespoke approvals without strict ITR caps'],
    ],
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [254, 252, 232],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 46 },
      1: { cellWidth: 80 },
      2: { cellWidth: 'auto', fontStyle: 'bold', textColor: [22, 101, 52] },
    },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);

  // Save the document
  const fileName = `SimplyFunds_Eligibility_Report_${Math.round(params.maxEligibleLoan / 100000)}Lakh_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

// ==========================================
// 3. LOAN FORECLOSURE & SETTLEMENT PDF REPORT
// ==========================================
export interface ForeclosureReportParams {
  outstandingPrincipal: number;
  interestRate: number;
  dailyInterest: number;
  daysPassed: number;
  accruedInterest: number;
  foreclosureFeePct: number;
  foreclosureFee: number;
  gstOnFee: number;
  totalFeeWithGst: number;
  otherCharges: number;
  totalPayable: number;
}

export const generateForeclosureReportPDF = (params: ForeclosureReportParams) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  drawHeader(doc, 'Loan Foreclosure Assessment', 'Full Pre-Closure Settlement & Accrual Estimate');

  let currentY = 54;

  // Box: Total Foreclosure Payable
  const bannerWidth = pageWidth - 28;
  const bannerHeight = 24;

  doc.setFillColor(250, 245, 255); // Purple-50
  doc.setDrawColor(168, 85, 247); // Purple-500
  doc.roundedRect(14, currentY, bannerWidth, bannerHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(126, 34, 206);
  doc.text('TOTAL NET PAYABLE FOR COMPLETE CLOSURE', 18, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(88, 28, 135);
  doc.text(formatINR(params.totalPayable), 18, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Includes principal + ${params.daysPassed} days accrued interest + closure charges & 18% GST`, 18, currentY + 21);

  currentY += bannerHeight + 8;

  // Detailed Table
  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Settlement Component', 'Calculated Amount', 'Regulatory & Ledger Remarks']],
    body: [
      ['Outstanding Principal Balance', formatINR(params.outstandingPrincipal), 'Base loan principal balance remaining in loan account'],
      ['Applicable Annual Interest Rate', `${params.interestRate}% p.a.`, 'Current contractual rate of interest'],
      ['Daily Accrued Interest Run-Rate', `${formatINR(params.dailyInterest)} / day`, `Based on 365-day simple accrual formula`],
      [`Accrued Interest (${params.daysPassed} Days)`, formatINR(params.accruedInterest), `Broken period interest from last EMI to settlement date`],
      [`Foreclosure Penalty Fee (${params.foreclosureFeePct}%)`, formatINR(params.foreclosureFee), params.foreclosureFeePct === 0 ? 'Nil fee (RBI floating-rate individual norm)' : `Contractual foreclosure fee on balance`],
      ['GST on Foreclosure Charges (18%)', formatINR(params.gstOnFee), 'Applicable government tax on banking service charges'],
      ['Other Incidental Charges / Dues', formatINR(params.otherCharges), 'Document retrieval / administrative processing'],
      ['Total Loan Closure Settlement Amount', formatINR(params.totalPayable), 'Final net payable to issue No Objection Certificate (NOC)'],
    ],
    headStyles: {
      fillColor: [147, 51, 234], // Purple-600
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 62 },
      1: { fontStyle: 'bold', cellWidth: 48, textColor: [126, 34, 206] },
      2: { cellWidth: 'auto', textColor: [71, 85, 105] },
    },
    margin: { left: 14, right: 14 },
  });

  // Regulatory Guidance Box
  const afterTableY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, afterTableY, pageWidth - 28, 28, 2, 2, 'FD');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, afterTableY, pageWidth - 28, 28, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Important RBI Guidelines on Foreclosure Charges:', 18, afterTableY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('1. As per Reserve Bank of India (RBI) circulars, banks and NBFCs cannot charge foreclosure penalties or prepayment charges on floating rate term loans sanctioned to individual borrowers.', 18, afterTableY + 13, { maxWidth: pageWidth - 36 });
  doc.text('2. For fixed-rate loans, commercial/business loans, or loans in entity names, 2% to 4% + 18% GST standard foreclosure charges may apply.', 18, afterTableY + 20, { maxWidth: pageWidth - 36 });

  drawFooter(doc);

  const fileName = `SimplyFunds_Foreclosure_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
