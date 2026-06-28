import { useState, FormEvent } from "react";
import { CRMPipelineItem, SALES_STAGES } from "../types";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import Modal from "./Modal";

interface CRMPipelineProps {
  crmItems: CRMPipelineItem[];
  onAdd: (item: CRMPipelineItem) => void;
  onUpdate: (item: CRMPipelineItem) => void;
  onDelete: (id: string) => void;
}

export default function CRMPipeline({ crmItems, onAdd, onUpdate, onDelete }: CRMPipelineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CRMPipelineItem | null>(null);

  // Form states
  const [opportunityId, setOpportunityId] = useState("");
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [salesStage, setSalesStage] = useState("Lead Contact");
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [salesOwner, setSalesOwner] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    const nextNum = crmItems.length > 0 
      ? Math.max(...crmItems.map(c => parseInt(c.opportunityId.replace("OP-", "")) || 0)) + 1 
      : 1;
    const paddedNum = String(nextNum).padStart(5, "0");
    setOpportunityId(`OP-${paddedNum}`);
    setEmail("");
    setCustomerName("");
    setSalesStage("Lead Contact");
    setEstimatedValue(0);
    setSalesOwner("");
    setLastUpdateTime(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CRMPipelineItem) => {
    setEditingItem(item);
    setOpportunityId(item.opportunityId);
    setEmail(item.email);
    setCustomerName(item.customerName);
    setSalesStage(item.salesStage);
    setEstimatedValue(item.estimatedValue);
    setSalesOwner(item.salesOwner);
    setLastUpdateTime(item.lastUpdateTime);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !customerName || !salesOwner || !lastUpdateTime) return;

    const item: CRMPipelineItem = {
      opportunityId,
      email: email.trim().toLowerCase(),
      customerName: customerName.trim(),
      salesStage,
      estimatedValue: Number(estimatedValue),
      salesOwner: salesOwner.trim(),
      lastUpdateTime
    };

    if (editingItem) {
      onUpdate(item);
    } else {
      onAdd(item);
    }
    setIsModalOpen(false);
  };

  const filteredItems = crmItems.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.salesOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.opportunityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.salesStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-up">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
          <input 
            type="text" 
            placeholder="Search pipeline by name, email, stage..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E8E6] rounded-lg text-[13px] text-[#1A1A2E] placeholder-[#888888] focus:border-[#2251FF] focus:ring-1 focus:ring-[#2251FF] transition-all"
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#051C2C] hover:bg-[#2251FF] text-white font-medium text-[13px] rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} />
          Add CRM Record
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] card-lift">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[rgba(5,28,44,0.04)] border-b-2 border-[rgba(5,28,44,0.12)]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Opportunity ID</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Sales Stage</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Est. Value</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Sales Owner</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#888888] font-sans">
                    No CRM records found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.opportunityId} className="hover:bg-[#F5F5F2] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#051C2C] text-[13px]">{item.opportunityId}</td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px] font-medium">{item.customerName}</td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px]">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        item.salesStage === "Closed Won"
                          ? "bg-[rgba(0,200,83,0.08)] text-[#00C853] border-[rgba(0,200,83,0.2)]"
                          : item.salesStage === "Closed Lost"
                          ? "bg-[rgba(211,47,47,0.08)] text-[#D32F2F] border-[rgba(211,47,47,0.2)]"
                          : "bg-[rgba(5,28,44,0.08)] text-[#051C2C] border-[rgba(5,28,44,0.2)]"
                      }`}>
                        {item.salesStage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[#051C2C] font-semibold text-[13px]">
                      ${item.estimatedValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px]">{item.salesOwner}</td>
                    <td className="px-6 py-4 text-[#888888] text-[13px]">{item.lastUpdateTime}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-[#888888] hover:text-[#2251FF] hover:bg-[#F5F5F2] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete opportunity ${item.opportunityId}?`)) {
                              onDelete(item.opportunityId);
                            }
                          }}
                          className="p-1 text-[#888888] hover:text-[#D32F2F] hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit CRM Opportunity" : "Add CRM Opportunity"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Opportunity ID (Read-only)
            </label>
            <input 
              type="text" 
              value={opportunityId} 
              disabled
              className="w-full px-3 py-2 bg-[#F5F5F2] border border-[#E8E8E6] rounded-md text-[13px] text-[#888888] cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Customer Name *
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Acme Corp"
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Customer Email *
            </label>
            <input 
              type="email" 
              required
              placeholder="e.g. buyer@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Sales Stage *
            </label>
            <select 
              value={salesStage} 
              onChange={(e) => setSalesStage(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] transition-colors cursor-pointer"
            >
              {SALES_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Estimated Value ($) *
            </label>
            <input 
              type="number" 
              required
              min="0"
              step="0.01"
              value={estimatedValue} 
              onChange={(e) => setEstimatedValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Sales Owner *
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Sarah Jenkins"
              value={salesOwner} 
              onChange={(e) => setSalesOwner(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Last Update Time *
            </label>
            <input 
              type="date" 
              required
              value={lastUpdateTime} 
              onChange={(e) => setLastUpdateTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E8E6]">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#F5F5F2] hover:bg-[#E8E8E6] text-[#051C2C] font-semibold text-[13px] rounded-md transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-[#2251FF] hover:bg-[#051C2C] text-white font-semibold text-[13px] rounded-md shadow-sm transition-all"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
