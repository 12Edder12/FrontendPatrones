declare module 'jspdf' {
    interface jsPDF {
      autoTable: (columns: any[], rows: any[], options?: any) => void;
      lastAutoTable: { finalY: number };
    }
  }
  