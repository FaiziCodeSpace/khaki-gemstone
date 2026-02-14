import { Scale, ShieldCheck, AlertTriangle, Gavel, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvestorTerms = ({ setHasAcceptedTerms }) => {
  const navigate = useNavigate();

  const handleAcceptTerms = () => {
    setHasAcceptedTerms(true);
    navigate('/investor-register'); 
  };
  const sections = [
    {
      title: "1. Investment Categories & Refund Timeline",
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 font-semibold">Category</th>
                <th className="py-2 font-semibold">Refund Eligibility</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr>
                <td className="py-2">Small Investment</td>
                <td className="py-2">After one (1) week from date of investment</td>
              </tr>
              <tr>
                <td className="py-2">Balance</td>
                <td className="py-2">After one (1) month from date of Package</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm italic text-gray-500">* Refund requests must be submitted through official company channels.</p>
        </div>
      )
    },
    {
      title: "2. Profit Policy",
      icon: <ShieldCheck className="w-5 h-5" />,
      content: "Investor profit is flexible and depends on business performance, market conditions, and sales volume. In accordance with standard investment principles, no fixed or guaranteed profit is promised."
    },
    {
      title: "3. Compliance & Administration Authority",
      icon: <Gavel className="w-5 h-5" />,
      content: "Investors must strictly follow all company rules. Khaki Gemstone administration reserves full authority to accept, suspend, or terminate relationships. Administrative decisions are final and binding."
    },
    {
      title: "4. Risk Acknowledgment",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "All investments involve financial risk. Khaki Gemstone is not responsible for losses beyond invested capital. By proceeding, the investor acknowledges the inherent volatility of the gemstone market."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#CA0A7F] selection:text-white">
      {/* Header */}
      <header className="border-b-4 border-[#CA0A7F] py-12 px-6 bg-black text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Investor <span className="text-[#CA0A7F]">Terms & Conditions</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-widest text-sm">
          Effective Date: February 14, 2026 | Khaki Gemstone Official Document
        </p>
      </header>

      <main className="max-w-4xl mx-auto py-16 px-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-12 border-l-4 border-[#CA0A7F] pl-6 py-2 bg-gray-50">
            These Investor Terms & Conditions govern all individuals or parties who invest capital in
            <strong> Khaki Gemstone</strong>. By investing, the investor confirms full legal acceptance of the following:
          </p>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <section key={index} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#CA0A7F]">{section.icon}</span>
                  <h2 className="text-xl font-bold uppercase tracking-wide">{section.title}</h2>
                </div>
                <div className="text-gray-600 pl-8 leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                <h3 className="font-bold mb-2 uppercase text-sm">5. Operational Liability</h3>
                <p className="text-sm text-gray-600">Company staff are responsible only for internal operations and are not liable for external matters or third-party claims.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                <h3 className="font-bold mb-2 uppercase text-sm">6. Adjustments</h3>
                <p className="text-sm text-gray-600">In case of product refund or order cancellation, the related profit will be deducted from the investor’s wallet automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h4 className="font-bold flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#CA0A7F]" />
                Governing Law
              </h4>
              <p className="text-sm text-gray-500">
                These terms are governed by the <strong>Laws of Pakistan</strong>.
                All disputes fall under Pakistani jurisdiction.
              </p>
            </div>
            <button onClick={() => handleAcceptTerms()} className="bg-[#CA0A7F] hover:bg-black text-white font-bold py-3 px-8 transition-colors duration-300 uppercase text-sm tracking-widest">
              Acknowledge & Proceed
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default InvestorTerms;