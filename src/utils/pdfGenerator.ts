import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { Invoice, DRIVER_DETAILS } from '../types/Invoice';

export const generateInvoiceHTML = (invoice: Invoice): string => {
    const {
        invoiceNumber, date, touristName, route, distance, amount, currency, notes, paymentMethod
    } = invoice;

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            @page { margin: 0; size: A4; }
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f8fafc; -webkit-print-color-adjust: exact; }
            
            .page-container {
                width: 210mm;
                min-height: 296mm;
                margin: 0 auto;
                background: white;
                position: relative;
                overflow: hidden; /* Strictly enforce one page */
            }

            .content-wrapper {
                padding: 40px 50px 80px 50px;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }
            
            /* ... (keep other styles) ... */

            .slanted-stamp {
                position: absolute;
                top: 45%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-15deg);
                z-index: 0;
                pointer-events: none;
                border: 10px solid #16a34a; /* Thicker border */
                padding: 10px 40px;
                border-radius: 12px;
                opacity: 0.25; /* More visible */
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #1e293b;
            }

            .company-branding h1 {
                font-family: 'Playfair Display', serif;
                margin: 0;
                color: #0f172a;
                font-size: 32px;
                letter-spacing: -0.5px;
            }

            .company-branding h2 {
                margin: 5px 0 0;
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .company-contact {
                margin-top: 15px;
                font-size: 12px;
                color: #475569;
                line-height: 1.6;
            }

            .invoice-info {
                text-align: right;
            }

            .invoice-label {
                font-size: 48px;
                font-weight: 800;
                color: #cbd5e1;
                letter-spacing: 4px;
                line-height: 1;
                margin-bottom: 10px;
                opacity: 0.5;
            }

            .meta-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .meta-row {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 15px;
            }

            .meta-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #64748b;
                font-weight: 600;
            }

            .meta-value {
                font-size: 14px;
                color: #0f172a;
                font-weight: 600;
                min-width: 100px;
                text-align: right;
            }

            /* Client Section */
            .client-section {
                margin-bottom: 30px;
                background: #f1f5f9;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #0f172a;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .bill-to-label {
                font-size: 11px;
                text-transform: uppercase;
                color: #64748b;
                font-weight: 700;
                margin-bottom: 5px;
            }

            .bill-to-name {
                font-size: 18px;
                font-weight: 700;
                color: #0f172a;
            }
            
            .payment-info {
                text-align: right;
            }

            /* Table */
            .table-container {
                flex: 1;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            th {
                text-align: left;
                padding: 12px 0;
                border-bottom: 2px solid #e2e8f0;
                font-size: 11px;
                text-transform: uppercase;
                color: #64748b;
                font-weight: 700;
                letter-spacing: 0.5px;
            }

            td {
                padding: 20px 0;
                border-bottom: 1px solid #f1f5f9;
                vertical-align: top;
            }

            .col-desc { width: 60%; }
            .col-amount { text-align: right; width: 40%; }

            .item-title {
                font-size: 15px;
                font-weight: 600;
                color: #0f172a;
                margin-bottom: 4px;
            }

            .item-subtitle {
                font-size: 13px;
                color: #64748b;
            }

            .item-price {
                font-size: 15px;
                font-weight: 600;
                color: #0f172a;
            }

            /* Summary */
            .summary-section {
                margin-top: 40px; /* Push to bottom of flex container */
                margin-bottom: 40px; /* Space for footer */
                display: flex;
                justify-content: flex-end;
            }

            .total-card {
                background: #0f172a;
                color: white;
                padding: 25px 40px;
                border-radius: 12px;
                text-align: right;
                min-width: 280px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }

            .total-label {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                opacity: 0.8;
                margin-bottom: 5px;
            }

            .total-amount {
                font-size: 32px;
                font-weight: 700;
                font-family: 'Playfair Display', serif;
            }

            /* Footer */
            .footer {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 30px 50px;
                border-top: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
            }

            .footer-text {
                font-size: 11px;
                color: #94a3b8;
                font-weight: 500;
            }

            /* Stamp */
            .slanted-stamp {
                position: absolute;
                top: 45%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-15deg);
                z-index: 0;
                pointer-events: none;
                border: 8px solid #16a34a;
                padding: 10px 40px;
                border-radius: 12px;
                opacity: 0.15;
            }

            .stamp-text {
                font-size: 80px;
                font-weight: 900;
                color: #16a34a;
                text-transform: uppercase;
                letter-spacing: 10px;
                line-height: 1;
                font-family: 'Courier New', Courier, monospace;
            }

        </style>
      </head>
      <body>
        <div class="page-container">
            <div class="content-wrapper">
                
                <div class="slanted-stamp">
                    <div class="stamp-text">PAID</div>
                </div>

                <div class="header">
                    <div class="company-branding">
                        <h1>Herath Tours</h1>
                        <h2>${DRIVER_DETAILS.name}</h2>
                        <div class="company-contact">
                            ${DRIVER_DETAILS.vehicleModel} • ${DRIVER_DETAILS.vehicleNo}<br>
                            ${DRIVER_DETAILS.phone1}<br>
                            ${DRIVER_DETAILS.phone2}
                        </div>
                    </div>
                    <div class="invoice-info">
                        <div class="invoice-label">INVOICE</div>
                        <div class="meta-group">
                            <div class="meta-row">
                                <span class="meta-label">Invoice No</span>
                                <span class="meta-value">${invoiceNumber}</span>
                            </div>
                            <div class="meta-row">
                                <span class="meta-label">Date</span>
                                <span class="meta-value">${date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="client-section">
                    <div>
                        <div class="bill-to-label">Billed To</div>
                        <div class="bill-to-name">${touristName}</div>
                    </div>
                    <div class="payment-info">
                        <div class="bill-to-label">Payment Method</div>
                        <div class="bill-to-name" style="font-size: 14px;">${paymentMethod || 'Cash'}</div>
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th class="col-desc">Description</th>
                                <th class="col-amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="item-title">Travel Service: ${route}</div>
                                    ${distance ? `<div class="item-subtitle">Distance covered: ${distance} km</div>` : ''}
                                    ${notes ? `<div class="item-subtitle" style="margin-top: 5px;">${notes}</div>` : ''}
                                </td>
                                <td class="col-amount">
                                    <div class="item-price">${currency} ${amount}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="summary-section">
                    <div class="total-card">
                        <div class="total-label">Total Paid</div>
                        <div class="total-amount">${currency} ${amount}</div>
                    </div>
                </div>

                <div class="footer-text">
                    Thank you for choosing Herath Tours.
                </div>
                <div class="footer-text">
                    Safe Travels in Sri Lanka 🇱🇰
                </div>
            </div>  

        </div>
      </body>
    </html>
  `;
};



export const createAndSharePDF = async (invoice: Invoice): Promise<void> => {
    try {
        const html = generateInvoiceHTML(invoice);
        if (Platform.OS === 'web') {
            await Print.printAsync({ html });
        } else {
            const { uri } = await Print.printToFileAsync({ html });

            try {
                // Generate custom filename
                const sanitizedInvNo = (invoice.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9-_]/g, '-');
                const filename = `${sanitizedInvNo}_${invoice.date || 'unknown'}.pdf`;

                // Use cacheDirectory
                const newUri = `${(FileSystem as any).cacheDirectory}${filename}`;

                // Copy file - check if newUri is the same to avoid crash
                if (uri !== newUri) {
                    await (FileSystem as any).copyAsync({
                        from: uri,
                        to: newUri
                    });
                }

                // Share the new file
                await Sharing.shareAsync(newUri, {
                    UTI: '.pdf',
                    mimeType: 'application/pdf',
                    dialogTitle: `Share Invoice ${invoice.invoiceNumber}`
                });
            } catch (renameError: any) {
                console.warn('Renaming failed, falling back to original file:', renameError);
                // Fallback: Share the original file if renaming failed
                await Sharing.shareAsync(uri, {
                    UTI: '.pdf',
                    mimeType: 'application/pdf',
                    dialogTitle: `Share Invoice ${invoice.invoiceNumber}`
                });
            }
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
