import React from 'react';
import { CheckCircle, Clock, Mail } from 'lucide-react'; // Optional: using lucide-react for icons

export default function SuccessNotification(){
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12">
      <div className="max-w-xl w-full text-center">
        
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-[#CA0A75]/10 rounded-full">
            <CheckCircle size={64} className="text-[#CA0A75]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Application Submitted!
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Thank you for applying. We are currently processing your request to access the investor portal.
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 text-left">
            <Clock className="text-[#CA0A75] mb-3" size={24} />
            <h3 className="font-bold text-gray-900 mb-1">Check Back Soon</h3>
            <p className="text-sm text-gray-600">
              Please visit this page again in <span className="font-semibold text-[#CA0A75]">10 minutes</span> to see your updated status.
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 text-left">
            <Mail className="text-[#CA0A75] mb-3" size={24} />
            <h3 className="font-bold text-gray-900 mb-1">Check Your Email</h3>
            <p className="text-sm text-gray-600">
              We will send a confirmation email once your access to the <span className="font-semibold text-[#CA0A75]">Investor Portal</span> is ready.
            </p>
          </div>
        </div>

        {/* Primary Action */}
        <div className="space-y-4">
          <a
            href="/investor-login"
            className="inline-block w-full sm:w-auto px-10 py-4 bg-[#CA0A75] text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 transform transition hover:-translate-y-1"
          >
            Login Now
          </a>
          <p className="text-sm text-gray-400">
            Didn't receive an email? Check your spam folder or contact support.
          </p>
        </div>

      </div>
    </div>
  );
};

