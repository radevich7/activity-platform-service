import puppeteer from 'puppeteer';

export function generateInvoiceHTML(order: any) {
  const subtotal = order.items.reduce((total: number, item: any) => total + item.product.price, 0);

  const addOnsTotal = order.items.reduce((total: number, item: any) => {
    return (
      total +
      (item.addOns?.reduce(
        (addOnTotal: number, addOn: any) => addOnTotal + (addOn.price || 0),
        0
      ) || 0)
    );
  }, 0);

  const shippingCost = order.items.reduce(
    (total: number, item: any) => total + (item.recipientInfo?.shippingCost || 0),
    0
  );

  const preTaxTotal = subtotal + addOnsTotal + shippingCost;
  const taxAmount = preTaxTotal * 0.05;
  const finalTotal = preTaxTotal + taxAmount;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; padding: 20px; color: #333; line-height: 1.4; font-size: 13px; }
  .invoice-container { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 0; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #2F2F2F 0%, #20c997 100%); color: #fff; padding: 25px 20px; text-align: center; }
  .header h1 { font-size: 1.8em; margin-bottom: 5px; font-weight: 700; }
  .header h2 { font-size: 1.2em; font-weight: 400; margin-bottom: 3px; }
  .header p, .header small { font-size: 0.85em; opacity: 0.9; }
  .content { padding: 20px; }
  .section { margin-bottom: 20px; }
  .section h3 { color: #2F2F2F; font-size: 1em; margin-bottom: 8px; border-bottom: 1px solid #e9ecef; padding-bottom: 5px; }
  .compact-info { display: flex; gap: 20px; background: #f8f9fa; padding: 10px 15px; border-radius: 6px; font-size: 12px; }
  .compact-section { flex: 1; }
  .compact-section p { margin: 3px 0; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px; }
  thead { background: #f0f0f0; }
  th, td { padding: 6px 8px; text-align: left; border-bottom: 1px solid #e9ecef; }
  th { font-weight: 600; text-transform: uppercase; font-size: 11px; }
  td.price { text-align: right; color: #2F2F2F; font-weight: 600; }
  .item-section { margin-bottom: 15px; padding: 10px; background: #fff; border-radius: 6px; border: 1px solid #e9ecef; }
  .item-section h4 { color: #2F2F2F; font-size: 0.95em; margin-bottom: 10px; border-bottom: 1px solid #e9ecef; padding-bottom: 4px; }
  .recipient-info { background: #f8f9fa; padding: 10px 15px; margin: 10px 0 0; border-radius: 6px; font-size: 12px; }
  .card-section { margin-top: 8px; padding-top: 8px; border-top: 1px dashed #dee2e6; }
  .card-message { background: #fff; padding: 6px; margin-top: 5px; border-radius: 4px; font-style: italic; border: 1px solid #e9ecef; }
  .summary-table { margin-top: 15px; font-size: 13px; }
  .summary-table td { padding: 8px 12px; }
  .summary-table tr.total-row { background: #2F2F2F; color: #fff; font-weight: 700; }
  .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.75em; font-weight: 600; text-transform: uppercase; }
  .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; text-align: center; border-top: 2px solid #2F2F2F; font-size: 12px; }
  @media print { body { background: #fff; padding: 0; } .invoice-container { box-shadow: none; } }
</style>
</head>
<body>
<div class="invoice-container">
  <div class="header">
    <h1>Bundle Joy</h1>
    <h2>Invoice</h2>
    <p>Invoice #${order.invoiceNumber}</p>
    <small>GST #123456789 RT 0001 | Calgary, AB</small>
  </div>
  <div class="content">
    <div class="compact-info">
      <div class="compact-section">
        <h3>Bill To</h3>
        <p><strong>${order.customer.fullName}</strong></p>
        <p>${order.customer.email}</p>
        <p>${order.customer.phoneNumber}</p>
      </div>
      <div class="compact-section">
        <h3>Invoice Details</h3>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US')}</p>
        <p><strong>Transaction:</strong> ${order.transactionId}</p>
        <p><strong>Payment:</strong> <span class="status-badge status-${order.paymentStatus}">${
    order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)
  }</span></p>
      </div>
    </div>

    <div class="section">
      <h3>Order Items & Delivery Information</h3>
      ${order.items
        .map((item: any, idx: number) => {
          const itemAddOnsTotal =
            item.addOns?.reduce((sum: number, addOn: any) => sum + (addOn.price || 0), 0) || 0;
          const itemShipping = item.recipientInfo?.shippingCost || 0;
          const itemTotal = item.product.price + itemAddOnsTotal + itemShipping;

          return `
          <div class="item-section">
            <h4>Item ${idx + 1}: ${item.product.name}</h4>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${item.product.name}</strong></td>
                  <td style="text-align:center;">1</td>
                  <td class="price">${formatCurrency(item.product.price)}</td>
                  <td></td>
                </tr>
                ${
                  item.addOns && item.addOns.length > 0
                    ? item.addOns
                        .map(
                          (a: any) => `
                    <tr>
                      <td style="padding-left: 15px;">- ${a.name} x ${a.quantity || 1}</td>
                      <td style="text-align:center;">${a.quantity || 1}</td>
                      <td class="price">${formatCurrency(a.price)}</td>
                      <td></td>
                    </tr>
                  `
                        )
                        .join('')
                    : ''
                }
              </tbody>
            </table>

            ${
              item.recipientInfo
                ? `<div class="recipient-info">
                    <h4>Delivery Information</h4>
                    <p><strong>Recipient:</strong> ${item.recipientInfo.name}</p>
                    <p><strong>Phone:</strong> ${item.recipientInfo.phoneNumber}</p>
                    ${
                      item.recipientInfo.email
                        ? `<p><strong>Email:</strong> ${item.recipientInfo.email}</p>`
                        : ''
                    }
                    ${
                      item.recipientInfo.address
                        ? `<p><strong>Address:</strong> ${item.recipientInfo.address}</p>`
                        : ''
                    }
                    ${
                      item.recipientInfo.companyName
                        ? `<p><strong>Company:</strong> ${item.recipientInfo.companyName}</p>`
                        : ''
                    }
                    <p><strong>Delivery Date:</strong> ${new Date(
                      item.recipientInfo.preferredDeliveryDate
                    ).toLocaleDateString()}</p>
                    ${
                      item.recipientInfo.cardMessage ||
                      item.recipientInfo.cardToName ||
                      item.recipientInfo.cardFromName
                        ? `<div class="card-section">
                            <h4>Gift Card</h4>
                            ${
                              item.recipientInfo.cardToName
                                ? `<p><strong>To:</strong> ${item.recipientInfo.cardToName}</p>`
                                : ''
                            }
                            ${
                              item.recipientInfo.cardFromName
                                ? `<p><strong>From:</strong> ${item.recipientInfo.cardFromName}</p>`
                                : ''
                            }
                            ${
                              item.recipientInfo.cardMessage
                                ? `<div class="card-message">${item.recipientInfo.cardMessage}</div>`
                                : ''
                            }
                          </div>`
                        : ''
                    }
                  </div>`
                : ''
            }
          </div>
        `;
        })
        .join('')}
    </div>

    <div class="section">
      <h3>Order Summary</h3>
      <table class="summary-table">
        <tr><td>Subtotal:</td><td class="price">${formatCurrency(subtotal)}</td></tr>
        <tr><td>Add-Ons:</td><td class="price">${formatCurrency(addOnsTotal)}</td></tr>
        <tr><td>Shipping:</td><td class="price">${formatCurrency(shippingCost)}</td></tr>
        <tr><td>GST (5%):</td><td class="price">${formatCurrency(taxAmount)}</td></tr>
        <tr class="total-row"><td>Total (incl. GST):</td><td>${formatCurrency(finalTotal)}</td></tr>
      </table>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for supporting a local Calgary business!</p>
    <small>Bundle Joy | GST #123456789 RT 0001</small>
  </div>
</div>
</body>
</html>
  `;
}

export async function generateInvoicePDF(order: any): Promise<Buffer> {
  const html = generateInvoiceHTML(order);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return Buffer.from(pdfBuffer);
}
