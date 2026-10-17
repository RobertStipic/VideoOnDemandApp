export const paymentReceiptTemplate = ({ payment, subscription }) => {
  return `
    <h2>Payment Successful!!! VodApp</h2>
    <p>Thank you for your payment!</p>

    <h3>Payment Details</h3>
    <ul>
      <li><strong>Amount:</strong> €${payment.amount}</li>
      <li><strong>Currency:</strong> ${payment.currency.toUpperCase()}</li>
      <li><strong>Status:</strong> ${payment.status}</li>
      <li><strong>Description:</strong> ${payment.description}</li>
    </ul>

    <h3>Subscription</h3>
    <ul>
      <li><strong>Subscription ID:</strong> ${subscription.subscriptionId}</li>
      <li><strong>Valid until:</strong> ${new Date(subscription.expiresAt).toLocaleDateString()}</li>
    </ul>

    <p>
      <a href="${payment.receiptUrl}" target="_blank">View Receipt</a>
    </p>
  `;
};
