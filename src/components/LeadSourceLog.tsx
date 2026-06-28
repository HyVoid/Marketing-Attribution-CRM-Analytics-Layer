import { useState, FormEvent } from "react";
import { LeadSourceLogItem, CHANNELS } from "../types";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import Modal from "./Modal";

interface LeadSourceLogProps {
  leads: LeadSourceLogItem[];
  onAdd: (item: LeadSourceLogItem) => void;
  onUpdate: (item: LeadSourceLogItem) => void;
  onDelete: (id: string) => void;
}

export default function LeadSourceLog({ leads, onAdd, onUpdate, onDelete }: LeadSourceLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeadSourceLogItem | null>(null);

  // Form states
  const [leadId, setLeadId] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [email, setEmail] = useState("");
  const [firstTouchSource, setFirstTouchSource] = useState("Google Ads");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [ipCountry, setIpCountry] = useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    const nextNum = leads.length > 0 
      ? Math.max(...leads.map(l => parseInt(l.leadId.replace("L-", "")) || 10000)) + 1 
      : 10001;
    setLeadId(`L-${nextNum}`);
    setCreateDate(new Date().toISOString().split("T")[0]);
    setEmail("");
    setFirstTouchSource("Google Ads");
    setUtmCampaign("");
    setUtmMedium("");
    setIpCountry("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LeadSourceLogItem) => {
    setEditingItem(item);
    setLeadId(item.leadId);
    setCreateDate(item.createDate);
    setEmail(item.email);
    setFirstTouchSource(item.firstTouchSource);
    setUtmCampaign(item.utmCampaign || "");
    setUtmMedium(item.utmMedium || "");
    setIpCountry(item.ipCountry || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !createDate) return;

    const item: LeadSourceLogItem = {
      leadId,
      createDate,
      email: email.trim().toLowerCase(),
      firstTouchSource,
      utmCampaign: utmCampaign.trim() || undefined,
      utmMedium: utmMedium.trim() || undefined,
      ipCountry: ipCountry.trim() || undefined
    };

    if (editingItem) {
      onUpdate(item);
    } else {
      onAdd(item);
    }
    setIsModalOpen(false);
  };

  const filteredLeads = leads.filter(l => 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.firstTouchSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.utmCampaign && l.utmCampaign.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.ipCountry && l.ipCountry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-up">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
          <input 
            type="text" 
            placeholder="Search leads by ID, email, channel..." 
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
          Add Lead Record
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] card-lift">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[rgba(5,28,44,0.04)] border-b-2 border-[rgba(5,28,44,0.12)]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Lead ID</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Create Date</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">First Touch Source</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">UTM Campaign</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">UTM Medium</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">IP Country</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#888888] font-sans">
                    No lead records found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.leadId} className="hover:bg-[#F5F5F2] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#051C2C] text-[13px]">{lead.leadId}</td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px]">{lead.createDate}</td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px] font-medium">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(34,81,255,0.08)] text-[#2251FF] border border-[rgba(34,81,255,0.2)]">
                        {lead.firstTouchSource}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#888888] text-[13px]">{lead.utmCampaign || "—"}</td>
                    <td className="px-6 py-4 text-[#888888] text-[13px] font-mono">{lead.utmMedium || "—"}</td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px]">{lead.ipCountry || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(lead)}
                          className="p-1 text-[#888888] hover:text-[#2251FF] hover:bg-[#F5F5F2] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete lead ${lead.leadId}?`)) {
                              onDelete(lead.leadId);
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
        title={editingItem ? "Edit Lead Record" : "Add Lead Record"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Lead ID (Read-only)
            </label>
            <input 
              type="text" 
              value={leadId} 
              disabled
              className="w-full px-3 py-2 bg-[#F5F5F2] border border-[#E8E8E6] rounded-md text-[13px] text-[#888888] cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Create Date *
            </label>
            <input 
              type="date" 
              required
              value={createDate} 
              onChange={(e) => setCreateDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              User Email *
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
              First Touch Source *
            </label>
            <select 
              value={firstTouchSource} 
              onChange={(e) => setFirstTouchSource(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] transition-colors cursor-pointer"
            >
              {CHANNELS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              UTM Campaign (Optional)
            </label>
            <input 
              type="text" 
              placeholder="e.g. Timber_USA_Search"
              value={utmCampaign} 
              onChange={(e) => setUtmCampaign(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              UTM Medium (Optional)
            </label>
            <input 
              type="text" 
              placeholder="e.g. cpc"
              value={utmMedium} 
              onChange={(e) => setUtmMedium(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              IP Country (Optional)
            </label>
            <input 
              type="text" 
              placeholder="e.g. United States"
              value={ipCountry} 
              onChange={(e) => setIpCountry(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
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
