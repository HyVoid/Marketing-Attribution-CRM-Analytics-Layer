import { useState } from "react";
import { CustomerMasterItem } from "../types";
import { Search, UserCheck } from "lucide-react";

interface CustomerMasterProps {
  customers: CustomerMasterItem[];
}

export default function CustomerMaster({ customers }: CustomerMasterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.firstTouchSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.crmLatestStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-up">
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
          <input 
            type="text" 
            placeholder="Search master indexing directory by email, source, stage..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E8E6] rounded-lg text-[13px] text-[#1A1A2E] placeholder-[#888888] focus:border-[#2251FF] focus:ring-1 focus:ring-[#2251FF] transition-all"
          />
        </div>
        <div className="text-[12px] text-[#888888] font-sans flex items-center gap-1.5 bg-white border border-[#E8E8E6] px-3 py-2 rounded-lg">
          <UserCheck size={14} className="text-[#2251FF]" />
          <span>Total Indexed Profiles: <strong>{customers.length}</strong></span>
        </div>
      </div>

      {/* Info Block (Insight/说明块使用左侧 3px accent border + 主色 4% 透明度底面) */}
      <div className="mb-6 p-4 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#2251FF] rounded-r-lg text-left">
        <p className="text-[13px] text-[#051C2C] font-medium leading-relaxed">
          <strong className="text-[#2251FF]">Automatic Mapping Layer:</strong> This indexing directory acts as the master golden profile of your customers. It automatically deduplicates emails across lead logs, offline sales CRM pipelines, and Shopify online checkout records, serving as the lookup table for multi-touch attribution.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] card-lift">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[rgba(5,28,44,0.04)] border-b-2 border-[rgba(5,28,44,0.12)]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Indexed Email</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Associated Lead ID</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">First-Touch Channel</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">CRM Pipeline Stage</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Shopify First Order Date</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Shopify Total Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#888888] font-sans">
                    No matching indexed customer profiles.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.email} className="hover:bg-[#F5F5F2] transition-colors">
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px] font-semibold">{cust.email}</td>
                    <td className="px-6 py-4 font-mono text-[#051C2C] text-[13px]">
                      {cust.leadId === "N/A" ? (
                        <span className="text-[#888888] italic">No Lead Log</span>
                      ) : (
                        cust.leadId
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(5,28,44,0.06)] text-[#051C2C]">
                        {cust.firstTouchSource}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        cust.crmLatestStage === "Closed Won"
                          ? "bg-[rgba(0,200,83,0.08)] text-[#00C853] border-[rgba(0,200,83,0.2)]"
                          : cust.crmLatestStage === "Closed Lost"
                          ? "bg-[rgba(211,47,47,0.08)] text-[#D32F2F] border-[rgba(211,47,47,0.2)]"
                          : cust.crmLatestStage === "Non-CRM"
                          ? "bg-gray-100 text-[#888888] border-gray-200"
                          : "bg-[rgba(34,81,255,0.08)] text-[#2251FF] border-[rgba(34,81,255,0.2)]"
                      }`}>
                        {cust.crmLatestStage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px]">
                      {cust.firstOrderDate === "N/A" ? (
                        <span className="text-[#888888] italic">No Purchase</span>
                      ) : (
                        cust.firstOrderDate
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[#051C2C] font-semibold text-[13px]">
                      {cust.totalOrderCount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
