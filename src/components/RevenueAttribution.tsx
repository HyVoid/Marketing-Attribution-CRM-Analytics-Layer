import { useState } from "react";
import { RevenueAttributionItem } from "../types";
import { Search, Percent } from "lucide-react";

interface RevenueAttributionProps {
  attribution: RevenueAttributionItem[];
}

export default function RevenueAttribution({ attribution }: RevenueAttributionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAttribution = attribution.filter(a => 
    a.attributionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.shopifyOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.firstTouchSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.lastTouchSource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For the inline data bar max calculations
  const maxRevenue = Math.max(...attribution.map(a => a.orderRevenue), 1);

  return (
    <div className="animate-fade-up">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
          <input 
            type="text" 
            placeholder="Search attribution details by order ID, email, channel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E8E6] rounded-lg text-[13px] text-[#1A1A2E] placeholder-[#888888] focus:border-[#2251FF] focus:ring-1 focus:ring-[#2251FF] transition-all"
          />
        </div>
        <div className="text-[12px] text-[#888888] font-sans flex items-center gap-1.5 bg-white border border-[#E8E8E6] px-3 py-2 rounded-lg">
          <Percent size={14} className="text-[#2251FF]" />
          <span>Active Attribution Calculations: <strong>{attribution.length}</strong></span>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="mb-6 p-4 bg-[rgba(34,81,255,0.04)] border-l-3 border-[#2251FF] rounded-r-lg text-left">
        <p className="text-[13px] text-[#051C2C] font-medium leading-relaxed">
          <strong className="text-[#2251FF]">Attribution Models Comparative Logic:</strong> This view takes raw Shopify transactions, references their customer profiles, and executes attribution mapping in parallel:
          <br />
          1. <span className="font-semibold text-[#051C2C]">First-Touch (FT):</span> 100% of the revenue is attributed to the channel that originally generated the lead.
          <br />
          2. <span className="font-semibold text-[#2251FF]">Last-Touch (LT):</span> Revenue is attributed to the Shopify Referrer site right before purchase. Falls back to FT if Referrer is direct.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] card-lift">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[rgba(5,28,44,0.04)] border-b-2 border-[rgba(5,28,44,0.12)]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Attribution ID</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Customer Email</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Order Revenue</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">First-Touch Channel</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Last-Touch Channel</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">FT Attributed Rev</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">LT Attributed Rev</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6]">
              {filteredAttribution.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#888888] font-sans">
                    No matching revenue attribution entries.
                  </td>
                </tr>
              ) : (
                filteredAttribution.map((item) => {
                  const ftPct = (item.ftAttributedRev / maxRevenue) * 100;
                  const ltPct = (item.ltAttributedRev / maxRevenue) * 100;

                  return (
                    <tr key={item.attributionId} className="hover:bg-[#F5F5F2] transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-[#051C2C] text-[13px]">
                        {item.attributionId}
                      </td>
                      <td className="px-6 py-4 font-mono text-[#888888] text-[13px]">
                        {item.shopifyOrderId}
                      </td>
                      <td className="px-6 py-4 text-[#1A1A2E] text-[13px] font-medium">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 font-mono text-[#051C2C] font-semibold text-[13px]">
                        ${item.orderRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(5,28,44,0.06)] text-[#051C2C]">
                          {item.firstTouchSource}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(34,81,255,0.06)] text-[#2251FF] border border-[rgba(34,81,255,0.12)]">
                          {item.lastTouchSource}
                        </span>
                      </td>
                      {/* FT Inline Bar */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[#051C2C] font-semibold text-[13px]">
                            ${item.ftAttributedRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <div className="w-24 h-1 bg-[#051C2C]/10 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-[#051C2C] transition-all duration-500 rounded-full" 
                              style={{ width: `${ftPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      {/* LT Inline Bar */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[#2251FF] font-semibold text-[13px]">
                            ${item.ltAttributedRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <div className="w-24 h-1 bg-[#2251FF]/10 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-[#2251FF] transition-all duration-500 rounded-full" 
                              style={{ width: `${ltPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
