import { AlertTriangle } from "lucide-react";

export function DisclaimersCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={18} className="text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            IMPORTANT DISCLAIMERS
          </h3>
          <div className="space-y-2 text-[11px] text-gray-700 leading-snug">
            <p>
              <span className="font-semibold">Not Investment Advice:</span> The content provided in this summary is for informational and educational purposes only and should not be construed as financial, investment, legal, or tax advice. This summary does not constitute a recommendation to buy, sell, or hold any security or investment. You should consult with a qualified financial advisor before making any investment decisions based on this content.
            </p>
            <p>
              <span className="font-semibold">AI-Generated Summary:</span> This summary was generated using artificial intelligence technology. While we strive for accuracy, AI-generated content may contain errors, omissions, or misinterpretations of the original podcast content. Do not rely solely on this AI summary for making financial decisions. Always verify important information with the original source material and consult qualified professionals before taking any financial action.
            </p>
            <p>
              <span className="font-semibold">No Guarantees:</span> Past performance is not indicative of future results. All investments carry risk, including the potential loss of principal. Market conditions, economic factors, and individual circumstances vary. Simplicity Finance and its content providers make no representations or warranties regarding the accuracy, completeness, or timeliness of this information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
