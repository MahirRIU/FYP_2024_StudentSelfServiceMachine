import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './dashboard.css';
import img from '../assets/533ffe74439bc17d00bde0fcf9b371be.jpg';
import { PDFDocument } from 'pdf-lib';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [pageCount, setPageCount] = useState(null);
  const [price, setPrice] = useState(null);
  const [filename, setFilename] = useState('');
  const [selectedPages, setSelectedPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const pricePerPage = 10;

  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef(null); // Reference for iframe to print PDF

  // Retrieve stored values from local storage when the component loads
  useEffect(() => {
    const savedFilename = localStorage.getItem('filename');
    const savedPageCount = localStorage.getItem('pageCount');
    const savedSelectedPages = localStorage.getItem('selectedPages');
    const savedCopies = localStorage.getItem('copies');
    const savedPaymentCompleted = localStorage.getItem('paymentCompleted') === 'true';
    const savedBlobURL = localStorage.getItem('blobURL');

    if (savedFilename && savedPageCount && savedSelectedPages && savedCopies) {
      setFilename(savedFilename);
      setPageCount(Number(savedPageCount));
      setSelectedPages(Number(savedSelectedPages));
      setCopies(Number(savedCopies));
      setPaymentCompleted(savedPaymentCompleted);
      if (iframeRef.current && savedBlobURL) {
        iframeRef.current.src = savedBlobURL; // Reload PDF Blob URL in iframe
      }
    }
  }, []);

  // Check if payment was completed when returning from the payment page
  useEffect(() => {
    if (location.state?.paymentCompleted) {
      setPaymentCompleted(true);
      localStorage.setItem('paymentCompleted', 'true');
    }
  }, [location.state]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const pdfBytes = new Uint8Array(e.target.result);
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const numPages = pdfDoc.getPageCount();
          setPageCount(numPages);
          setSelectedPages(numPages);
          setPrice(numPages * pricePerPage);
          setFilename(file.name);
          setPaymentCompleted(false); // Reset payment status on new file upload

          // Create a Blob URL for the PDF and set it as iframe src
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          iframeRef.current.src = url; // Load PDF in iframe
          localStorage.setItem('blobURL', url); // Store Blob URL in local storage

          // Store file information in local storage
          localStorage.setItem('filename', file.name);
          localStorage.setItem('pageCount', numPages);
          localStorage.setItem('selectedPages', numPages);
          localStorage.setItem('copies', 1);
          localStorage.setItem('paymentCompleted', 'false');
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error reading PDF:', error);
      }
    }
  };

  const handlePageChange = (event) => {
    const pages = event.target.value;
    setSelectedPages(pages);
    localStorage.setItem('selectedPages', pages);
  };

  const handleCopiesChange = (event) => {
    const copyCount = event.target.value;
    setCopies(copyCount);
    localStorage.setItem('copies', copyCount);
  };

  const calculateTotalCost = () => {
    return selectedPages * pricePerPage * copies;
  };

  const gotoPayment = () => {
    const totalCost = calculateTotalCost();
    localStorage.setItem('price', totalCost);
    navigate(`/paymentpage?filename=${encodeURIComponent(filename)}&price=${encodeURIComponent(totalCost)}`);
  };

  const openInPopup = (url) => {
    const popupWidth = 600;
    const popupHeight = 600;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;
    const windowFeatures = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes`;
    const newWindow = window.open(url, '_blank', windowFeatures);
    if (newWindow) newWindow.focus();
  };

  const handlePrint = () => {
    if (paymentCompleted) {
      const blobURL = localStorage.getItem('blobURL');
      if (blobURL && iframeRef.current) {
        iframeRef.current.src = blobURL; // Reload Blob URL in iframe before printing
        iframeRef.current.onload = () => {
          iframeRef.current.contentWindow.print(); // Print the iframe content only (PDF file)
        };
      }

      // Clear local storage and reset state after printing
      localStorage.removeItem('filename');
      localStorage.removeItem('pageCount');
      localStorage.removeItem('selectedPages');
      localStorage.removeItem('copies');
      localStorage.removeItem('paymentCompleted');
      localStorage.removeItem('blobURL');

      setFilename('');
      setPageCount(null);
      setSelectedPages(1);
      setCopies(1);
      setPrice(null);
      setPaymentCompleted(false);
    } else {
      alert('Please complete the payment to enable printing.');
    }
  };

  const handleLogout = () => {
    // Clear user session and navigate to login
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">SSSM</Link>
          <ul className="navbar-menu">
            <li className="navbar-item"><Link to="/Transcript" className="navbar-links">Transcript</Link></li>
            <li className="navbar-item"><Link to="/Clearnessform" className="navbar-links">Clearance Forms</Link></li>
            <li className="navbar-item"><Link to="/Comment" className="navbar-links">Contact</Link></li>
            <li className="navbar-item">
              <Button variant="danger" className="logout-button" onClick={handleLogout}>
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="content-container">
        <div className="image-container">
          <img src={img} alt="Dashboard" className="dashboard-image" />
          <h2 className="image-heading">Download File below portals</h2>
          <div className="buttons">
            <button className="dashboard-button" onClick={() => openInPopup("https://moellim.riphah.edu.pk/login/index.php")}>Moellim</button>
            <button className="dashboard-button" onClick={() => openInPopup("https://web.whatsapp.com/")}>WhatsApp</button>
            <button className="dashboard-button" onClick={() => openInPopup("https://fiori.riphah.edu.pk:8011/sap/bc/ui2/flp?_sap-hash=I1NoZWxsLWhvbWU")}>Fiori</button>
            <button className="dashboard-button" onClick={() => openInPopup("https://mail.google.com/mail")}>Gmail</button>
            <button className="dashboard-button" onClick={() => openInPopup("https://onedrive.live.com/login")}>OneDrive</button>
          </div>
          <div className="upload-container">
            <button className="upload-button" onClick={() => setShowModal(true)}>Upload File</button>
          </div>
        </div>
      </div>

      {/* Modal for file upload and print preview */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload and Print PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={handleFileChange} accept=".pdf" />
          {filename && (
            <>
              <p>File: {filename}</p>
              <p>Total Pages: {pageCount}</p>
              <div>
                <label>Pages to Print: </label>
                <input
                  type="number"
                  value={selectedPages}
                  onChange={handlePageChange}
                  min={1}
                  max={pageCount}
                  style={{ width: '50px', marginRight: '10px' }}
                />
                <label>Copies: </label>
                <input
                  type="number"
                  value={copies}
                  onChange={handleCopiesChange}
                  min={1}
                  style={{ width: '50px' }}
                />
              </div>
              <p>Cost per page: ₹{pricePerPage}</p>
              <p>Total Cost: ₹{calculateTotalCost()}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {filename && (
            <Button variant="primary" onClick={handlePrint} disabled={!paymentCompleted}>
              Print
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="success" onClick={gotoPayment} disabled={!filename}>Pay Now</Button>
        </Modal.Footer>
      </Modal>

      {/* Hidden iframe for PDF printing */}
      <iframe ref={iframeRef} style={{ display: 'none' }} title="PDF Viewer" />
    </div>
  );
};

export default Dashboard;
