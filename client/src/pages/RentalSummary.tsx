import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Check, Eye, Upload } from 'lucide-react';
import { PDFViewer} from '@react-pdf/renderer';
import useRentalHistoryStore from '../store/rentalHistoryStore'; // Import the store
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

// Helper to format date as dd-mm-yyyy hh:mm for any ISO string
function formatDateTime(val: any) {
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) {
    const date = new Date(val);
    const pad = (n: number) => n.toString().padStart(2, '0');
    // Use local time to match the time entered in the form
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  return val;
}

function RentalSummary() {
  const navigate = useNavigate();
  const { createRental, getTemplate } = useRentalHistoryStore(); 
  const [showPDF, setShowPDF] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [rentalData, setRentalData] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<{ driverLicense?: File; idCard?: File }>({});

  useEffect(() => {
    const storedData = localStorage.getItem('rentalSummary');
    if (storedData) {
      setRentalData(JSON.parse(storedData));
    }
    const cars = localStorage.getItem('car');
    if (cars) {
      setCar(JSON.parse(cars));
    }
  }, []);

  if (!rentalData) {
    return <p>No rental data found.</p>;
  }

  const handleFileUpload = (type: 'driverLicense' | 'idCard', file: File) => {
    setDocumentFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handlePreview = (type: 'driverLicense' | 'idCard') => {
    const file = documentFiles[type];
    if (file) {
      const url = URL.createObjectURL(file);
      setShowPreview(url);
    }
  };
  const handleCreateRental = async () => {
    if (!documentFiles.driverLicense || !documentFiles.idCard) {
      toast.warn("Please upload both Driver's License and ID Card before proceeding.", { position: 'top-right' });
      return;
    }

    setLoading(true); // Start loading
    try {
      // Always generate the latest populated HTML template before sending
      let agreement = '';
      const template = await getTemplate();
      if (template && template.html) {
        agreement = populateTemplate(template.html, rentalData, car);
        setRentalData((prev: any) => ({
          ...prev,
          rentalAgreement: agreement,
        }));
      }
      await createRental(
        { ...rentalData, rentalAgreement: agreement },
        documentFiles
      );
      navigate('/rentals');
    } catch (error) {
      console.error('Error creating rental:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Utility to replace {{field}} in template with value from data objects
  function populateTemplate(template: string, rentalData: any, car: any) {
    if (!template) return '';
    return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
      // Support nested keys like client.firstName
      let value = key.split('.').reduce((obj: any, k: string) => (obj ? obj[k] : ''), { ...rentalData, car });
      // Format any ISO date string
      value = formatDateTime(value);
      // Sanitize ONLY the individual values, not the whole template
      if (typeof value === 'string') {
        // Limit length to prevent excessive content
        if (value.length > 500) {
          console.warn(`Value for ${key} is too long, truncating`);
          value = value.substring(0, 500) + '...';
        }
        // Strip any HTML tags from user input values to prevent XSS
        value = DOMPurify.sanitize(value, { 
          ALLOWED_TAGS: [], 
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true 
        });
      }
      return value !== undefined && value !== null ? value : '';
    });
  }

  const handleViewAgreement = async () => {
    const template = await getTemplate();
    if (template && template.html) {
      // Optional: Basic template validation to ensure it's from your backend
      if (!template.html.includes('SABADAM CAR') || !template.html.includes('<style>')) {
        console.warn('Template appears to be modified or invalid');
        setTemplateHtml('<p>Invalid template received.</p>');
        return;
      }
      
      const populatedHtml = populateTemplate(template.html, rentalData, car);
      setTemplateHtml(populatedHtml);
      setShowPDF(false); // Hide PDF if open

      // Add the populated agreement to rentalData
      setRentalData((prev: any) => ({
        ...prev,
        rentalAgreement: populatedHtml, // Save the populated HTML as rentalAgreement
      }));
    } else {
      setTemplateHtml('<p>No template found.</p>');
    }
  };

  const handleDownloadTemplatePdf = () => {
    const element = document.getElementById('template-html-content');
    if (element && templateHtml) {
      // templateHtml is already populated with values
      const clientLastName = rentalData?.client?.lastName
        ? rentalData.client.lastName.replace(/[^a-z0-9]/gi, '_')
        : 'client';
      html2pdf().from(element).set({
        margin: 10,
        filename: `rental-agreement-${clientLastName}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Rental Summary</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Client Information</h2>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">{rentalData.client.firstName} {rentalData.client.lastName}</dd></div>
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Phone</dt><dd className="font-medium text-gray-900">{rentalData.client.phone}</dd></div>
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-900">{rentalData.client.email}</dd></div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Vehicle Details</h2>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Car</dt><dd className="font-medium text-gray-900">{car.make} {car.model}</dd></div>
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Matricule</dt><dd className="font-medium text-gray-900">{car.matricule}</dd></div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Rental Period</h2>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Start Date</dt><dd className="font-medium text-gray-900">{formatDateTime(rentalData.startDate)}</dd></div>
            <div className="flex justify-between text-sm"><dt className="text-gray-500">End Date</dt><dd className="font-medium text-gray-900">{formatDateTime(rentalData.endDate)}</dd></div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Documents</h2>
          <button onClick={handleViewAgreement} className="btn-secondary text-sm">
            <FileText className="h-4 w-4 mr-2 text-primary-500" />
            View Rental Agreement
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Required Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['driverLicense', 'idCard'] as const).map((type) => {
            const docName = type === 'driverLicense' ? 'Driver License' : 'ID Card';
            const label = type === 'driverLicense' ? "Driver's License" : 'ID Card';
            const uploaded = documentFiles[type === 'driverLicense' ? 'driverLicense' : 'idCard'];
            return (
              <div key={type} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(type, file); }} />
                    <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${
                      uploaded ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-primary-300 hover:bg-primary-50/30'
                    }`}>
                      <Upload className="h-4 w-4" />
                      <span className="text-sm font-medium">{uploaded ? `${docName} Uploaded ✓` : `Upload ${label}`}</span>
                    </div>
                  </label>
                  {uploaded && (
                    <button onClick={() => handlePreview(type)} className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 bg-white shadow-sm transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleCreateRental} disabled={loading} className="btn-primary">
          <Check className="h-4 w-4 mr-2" />
          {loading ? 'Creating…' : 'Confirm & Create Rental'}
        </button>
      </div>

      {/* Rental Agreement Template Modal */}
      {templateHtml && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-auto shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Rental Agreement Template</h2>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadTemplatePdf} className="btn-primary text-xs py-1.5">Download</button>
                <button onClick={() => setTemplateHtml(null)} className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl">×</button>
              </div>
            </div>
            <div className="flex-1 p-5 overflow-auto">
              <div id="template-html-content" dangerouslySetInnerHTML={{ __html: templateHtml }} className="prose max-w-none" />
            </div>
          </div>
        </div>
      )}

      {showPDF && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Rental Agreement</h2>
              <button onClick={() => setShowPDF(false)} className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl">×</button>
            </div>
            <div className="flex-1 p-4">
              <PDFViewer style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Document Preview</h2>
              <button onClick={() => { URL.revokeObjectURL(showPreview); setShowPreview(null); }} className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl">×</button>
            </div>
            <div className="flex-1 p-4 flex justify-center items-center">
              <img src={showPreview} alt="Document Preview" style={{ maxHeight: '67vh', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} className="shadow-md" draggable={false} onDragStart={e => e.preventDefault()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentalSummary;