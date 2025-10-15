import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const InvoicesTab = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const ImageURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
  const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BaseURL}Payments?custid=${decryptedCustId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        // Filter only payments that have invoice numbers
        const invoicesWithNumbers = response.data.filter(
          (payment) => payment.InvoiceNumber !== null && payment.InvoiceNumber !== ""
        );

        setInvoices(invoicesWithNumbers);
        setError(null);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchInvoices();
    }
  }, [BaseURL, user?.token]);

  const handleDownload = (folderPath, invoiceNumber) => {
    if (folderPath) {
      // Assuming FolderPath contains the full URL or relative path to the invoice file
      const downloadUrl = folderPath.startsWith('http')
        ? folderPath
        : `${ImageURL}${folderPath}`;

      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Invoice_${invoiceNumber}.pdf`; // Assuming PDF format
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h4 className="mb-4 fw-bold">
        {/* <i className="fas fa-file-invoice-dollar me-2"></i> */}
        My Invoices
      </h4>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="/assets/img/noinvoice.png"
            alt="No Invoices"
            style={{ maxWidth: "500px", marginBottom: "20px" }}
          />
          <h4>No invoices yet</h4>
          <p>
            Looks like you haven't received any invoices yet. Check back after your next service!
          </p>
        </div>
              ) : error ? (
        <div className="text-center py-5">
          <img
            src="/assets/img/noinvoice.png"
            alt="No Invoices"
            style={{ maxWidth: "500px", marginBottom: "20px" }}
          />
          <h4>Failed to load invoices</h4>
          <p>Please try again.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">Invoice Number</th>
                <th scope="col">Invoice Date</th>
                <th scope="col">Booking ID</th>
                <th scope="col">Amount</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.PaymentID}>
                  <td>
                    <strong className="text-primary">{invoice.InvoiceNumber}</strong>
                  </td>
                  <td>{formatDate(invoice.PaymentDate)}</td>
                  <td>
                   {invoice.BookingTrackID}
                  </td>
                  <td>
                    <strong>₹{invoice.AmountPaid.toFixed(2)}</strong>
                  </td>
                  <td>
                    {invoice.FolderPath ? (
                      <button
                        className="btn btn-outline-primary px-2 py-1"
                        onClick={() => handleDownload(invoice.FolderPath, invoice.InvoiceNumber)}
                        title="Download Invoice"
                      >
                        <i className="fas fa-download me-1"></i>
                        Download
                      </button>
                    ) : (
                      <span className="text-muted small">Not available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invoices.length > 0 && (
        <div className="mt-3 text-muted small">
          <i className="fas fa-info-circle me-1"></i>
          Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} with invoice numbers
        </div>
      )}
    </div>
  );
};

export default InvoicesTab;
