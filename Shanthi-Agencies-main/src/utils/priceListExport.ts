import { Product, Category } from '../types';

export function downloadPriceListCSV(products: Product[], categories: Category[]): void {
  const categoryMap = new Map<string, string>();
  categories.forEach((c) => {
    categoryMap.set(c.id, `${c.name} (${c.tamilName})`);
  });

  const headers = [
    'S.No',
    'Category',
    'Product Name',
    'Tamil Name',
    'Packing / Unit',
    'MRP (Rs.)',
    'Wholesale Price (Rs.)',
    'Discount (%)',
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [];

  // Showroom metadata header in CSV
  rows.push('"PREMA FIREWORKS - EXCLUSIVE WHOLESALE SHOWROOM CUDDALORE"');
  rows.push('"Address: No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam Post, Cuddalore"');
  rows.push('"Phone / WhatsApp: +91 9600830112"');
  rows.push('"Festival Wholesale & Retail Price List 2025 - Direct Sivakasi Factory Rates"');
  rows.push('""');
  rows.push(headers.map(escapeCSV).join(','));

  products.forEach((product, idx) => {
    const catName = categoryMap.get(product.category) || product.category;
    const row = [
      idx + 1,
      catName,
      product.name,
      product.tamilName,
      product.unit,
      product.mrp,
      product.price,
      `${product.discountPercent}%`,
    ];
    rows.push(row.map(escapeCSV).join(','));
  });

  // Include UTF-8 BOM so Excel and mobile spreadsheet viewers properly decode Tamil Unicode fonts
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Prema_Fireworks_Wholesale_Price_List_2025.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
