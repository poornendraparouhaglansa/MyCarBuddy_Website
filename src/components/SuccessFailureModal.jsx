import React from "react";

const SuccessFailureModal = ({ show, onClose, type, message }) => {
    if (!show) return null;

    const isSuccess = type === "success";

    return (
        <div className="modal-overlay">
            <div className="modal-card animate-scale-in">
                <div className={`icon-circle ${isSuccess ? "success" : "failure"}`}>
                    {isSuccess ? "✅" : "❌"}
                </div>
                <h4 className="modal-title">
                    {isSuccess ? "Payment Successful" : "Payment Failed"}
                </h4>
                <p className="modal-message">{message}</p>
                <button className="modal-button" onClick={onClose}>
                    {isSuccess ? "Go to My Bookings" : "Try Again"}
                </button>
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10000;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-card {
          background: #fff;
          padding: 2rem 2.5rem;
          border-radius: 16px;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2rem;
        }

        .icon-circle.success {
          background-color: #d4edda;
          color: #28a745;
        }

        .icon-circle.failure {
          background-color: #f8d7da;
          color: #dc3545;
        }

        .modal-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .modal-message {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1.5rem;
        }

        .modal-button {
          background-color: ${isSuccess ? "#28a745" : "#dc3545"};
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .modal-button:hover {
          background-color: ${isSuccess ? "#218838" : "#c82333"};
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-in-out;
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default SuccessFailureModal;
