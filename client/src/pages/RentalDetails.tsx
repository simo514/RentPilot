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
  <div className="space-y-7 animate-fade-in">
  {/* Top bar */}
  <div className="flex justify-between items-center">
    <button
      onClick={() => navigate('/rentals')}
      className="btn-secondary"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Rentals
    </button>

    {rental.status === 'active' && (
      <button
        className="btn-primary"
        onClick={() => { returnCar(rental._id); navigate('/rentals'); }}
      >
        Return Car
      </button>
    )}
  </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Client Information */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50">
              <User className="h-4 w-4 text-violet-600" />
            </div>
            Client Information
          </h2>
          <dl className="space-y-2.5">
            {[['First Name', rental.client.firstName], ['Last Name', rental.client.lastName], ['Phone', rental.client.phone], ['Email', rental.client.email]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium text-gray-900 text-right">{v || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Vehicle Details */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50">
              <Car className="h-4 w-4 text-blue-600" />
            </div>
            Vehicle Details
          </h2>
          <dl className="space-y-2.5">
            {[['Make & Model', `${rental.car.make} ${rental.car.model}`], ['Year', rental.car.year], ['License Plate', rental.car.matricule]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium text-gray-900 text-right">{v || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Rental Period */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50">
              <Calendar className="h-4 w-4 text-primary-600" />
            </div>
            Rental Period
          </h2>
          <dl className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Start Date</dt>
              <dd className="font-medium text-gray-900">{new Date(rental.startDate).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">End Date</dt>
              <dd className="font-medium text-gray-900">{new Date(rental.endDate).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Daily Rate</dt>
              <dd className="font-medium text-gray-900">${rental.dailyRate}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Total Amount</dt>
              <dd className="font-bold text-gray-900">${rental.totalPrice}</dd>
            </div>
            <div className="flex justify-between text-sm items-center">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <span className={rental.status === 'active' ? 'badge-active' : 'badge-completed'}>
                  <span className={`w-1.5 h-1.5 rounded-full ${rental.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {rental.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Documents */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50">
              <Paperclip className="h-4 w-4 text-amber-600" />
            </div>
            Documents
          </h2>
          {rental.documents && rental.documents.length > 0 ? (
            <div className="space-y-2.5">
              {rental.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-700 font-medium">{doc.name}</p>
                  <button
                    onClick={() => setShowPreview(doc.image)}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No documents uploaded.</p>
          )}
        </div>

        {/* Rental Agreement */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            Rental Agreement
          </h2>
          {rental.rentalAgreement ? (
            <button
              className="btn-secondary text-sm"
              onClick={() => setShowAgreement(true)}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View Agreement
            </button>
          ) : (
            <p className="text-sm text-gray-400">No rental agreement available.</p>
          )}
        </div>

      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Document Preview</h2>
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-auto shadow-2xl">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Rental Agreement</h2>
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