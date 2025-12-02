import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Car, User, FileText, Eye, Paperclip } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import useRentalHistoryStore from '../store/rentalHistoryStore';
// @ts-ignore
import html2pdf from 'html2pdf.js';

function RentalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [rotate, setRotate] = useState(0); // Only rotate state
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const { currentRental: rental, loading, error, fetchRentalById, returnCar } = useRentalHistoryStore();

  useEffect(() => {
    if (id) {
        console.log(rental);
      fetchRentalById(id);
    }
  }, [id, fetchRentalById]);

  // Use the modal content for PDF download
  const handleDownloadAgreementPdf = () => {
    const element = document.getElementById('rental-agreement-html-content');
    if (element && rental && rental.rentalAgreement) {
      // Add client last name to filename if available
      const clientLastName = rental?.client?.lastName
        ? rental.client.lastName.replace(/[^a-z0-9]/gi, '_')
        : 'client';
      html2pdf().from(element).set({
        margin: 10,
        filename: `rental-agreement-${clientLastName}.pdf`,
        html2canvas: { scale: 2, useCORS: true }, // Added useCORS: true for external images
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!rental) return <p className="text-center mt-10">Rental not found.</p>;

  return (
  <div className="p-6">
  {/* Top bar with two buttons */}
  <div className="mb-6 flex justify-between items-center">
    <button
      onClick={() => navigate('/rentals')}
      className="flex items-center text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Back to Rental History
    </button>

    {rental.status === 'active' && (
      <button
        className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        onClick={() => {returnCar(rental._id); navigate('/rentals');}}
      >
        Return the car
      </button>
    )}
  </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary-500" />
            Client Information
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">First Name: <span className="text-gray-900">{rental.client.firstName}</span></p>
            <p className="text-gray-600">Last Name: <span className="text-gray-900">{rental.client.lastName}</span></p>
            <p className="text-gray-600">Phone: <span className="text-gray-900">{rental.client.phone}</span></p>
            <p className="text-gray-600">Email: <span className="text-gray-900">{rental.client.email}</span></p>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Car className="h-5 w-5 mr-2 text-primary-500" />
            Vehicle Details
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">Make & Model: <span className="text-gray-900">{rental.car.make} {rental.car.model}</span></p>
            <p className="text-gray-600">Year: <span className="text-gray-900">{rental.car.year}</span></p>
            <p className="text-gray-600">License Plate: <span className="text-gray-900">{rental.car.matricule}</span></p>
          </div>
        </div>

        {/* Rental Period */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-500" />
            Rental Period
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              Start Date:{" "}
              <span className="text-gray-900">
                {new Date(rental.startDate).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </p>
            <p className="text-gray-600">
              End Date:{" "}
              <span className="text-gray-900">
                {new Date(rental.endDate).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </p>
            <p className="text-gray-600">Daily Rate: <span className="text-gray-900">${rental.dailyRate}</span></p>
            <p className="text-gray-600">Total Amount: <span className="text-gray-900">${rental.totalPrice}</span></p>
            <p className="text-gray-600">Status: 
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                rental.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-gray-800'
              }`}>
                {rental.status}
              </span>
            </p>
          </div>
        </div>

        {/* View Documents */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">

          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Paperclip className="h-5 w-5 mr-2 text-primary-500" />
            Documents
          </h2>
          {rental.documents && rental.documents.length > 0 ? (
            <div className="space-y-4">
              {rental.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-gray-600">{doc.name}</p>
                  <button
                    onClick={() => setShowPreview(doc.image)} // Set the preview image
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No documents uploaded.</p>
          )}
        </div>

        {/* Rental Agreement View */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary-500" />
            Rental Agreement
          </h2>
          {rental.rentalAgreement ? (
            <div className="flex gap-2">
              <button
                className="text-primary-600 hover:text-primary-700 flex items-center"
                onClick={() => setShowAgreement(true)}
              >
                <Eye className="h-5 w-5 mr-1" />
                View
              </button>
              {/* Download button removed from here */}
            </div>
          ) : (
            <p className="text-gray-600">No rental agreement available.</p>
          )}
        </div>

      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Document Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => {
                    setZoom(z => Math.max(0.2, z - 0.2));
                    setImgOffset({ x: 0, y: 0 });
                  }}
                  title="Zoom Out"
                >−</button>
                <span className="w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setZoom(z => Math.min(5, z + 0.2))}
                  title="Zoom In"
                >+</button>
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 ml-2"
                  onClick={() => { setZoom(1); setImgOffset({ x: 0, y: 0 }); setRotate(0); }}
                  title="Reset Zoom"
                >Reset</button>
                {/* Flip button removed */}
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 ml-2"
                  onClick={() => setRotate(r => (r + 90) % 360)}
                  title="Rotate 90°"
                >Rotate</button>
                <button
                  onClick={() => { setShowPreview(null); setZoom(1); setImgOffset({ x: 0, y: 0 }); setRotate(0); }}
                  className="text-gray-500 hover:text-gray-700 ml-4 text-2xl"
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 flex justify-center items-center select-none">
              <div
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  overflow: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onMouseDown={e => {
                  if (zoom <= 1) return;
                  setIsDragging(true);
                  dragStart.current = {
                    x: e.clientX,
                    y: e.clientY,
                    offsetX: imgOffset.x,
                    offsetY: imgOffset.y
                  };
                }}
                onMouseMove={e => {
                  if (!isDragging || zoom <= 1 || !dragStart.current) return;
                  const dx = e.clientX - dragStart.current.x;
                  const dy = e.clientY - dragStart.current.y;
                  setImgOffset({
                    x: dragStart.current.offsetX + dx,
                    y: dragStart.current.offsetY + dy
                  });
                }}
                onMouseUp={() => {
                  setIsDragging(false);
                  dragStart.current = null;
                }}
                onMouseLeave={() => {
                  setIsDragging(false);
                  dragStart.current = null;
                }}
                onTouchStart={e => {
                  if (zoom <= 1) return;
                  setIsDragging(true);
                  const touch = e.touches[0];
                  dragStart.current = {
                    x: touch.clientX,
                    y: touch.clientY,
                    offsetX: imgOffset.x,
                    offsetY: imgOffset.y
                  };
                }}
                onTouchMove={e => {
                  if (!isDragging || zoom <= 1 || !dragStart.current) return;
                  const touch = e.touches[0];
                  const dx = touch.clientX - dragStart.current.x;
                  const dy = touch.clientY - dragStart.current.y;
                  setImgOffset({
                    x: dragStart.current.offsetX + dx,
                    y: dragStart.current.offsetY + dy
                  });
                }}
                onTouchEnd={() => {
                  setIsDragging(false);
                  dragStart.current = null;
                }}
              >
                <img
                  src={showPreview}
                  alt="Document Preview"
                  style={{
                    maxHeight: '67vh',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: '#f9f9f9',
                    transform: `
                      scale(${zoom}) 
                      translate(${imgOffset.x / zoom}px, ${imgOffset.y / zoom}px)
                      rotate(${rotate}deg)
                    `,
                    transition: isDragging ? 'none' : 'transform 0.2s'
                  }}
                  className="shadow-md"
                  draggable={false}
                  onDragStart={e => e.preventDefault()}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rental Agreement Modal */}
      {showAgreement && rental.rentalAgreement && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Rental Agreement</h2>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                onClick={handleDownloadAgreementPdf}
              >
                Download
              </button>
              <button
                onClick={() => setShowAgreement(false)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                ×
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <div
              id="rental-agreement-html-content"
              dangerouslySetInnerHTML={{ __html: rental.rentalAgreement }}
              className="prose max-w-none"
            />
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default RentalDetails;