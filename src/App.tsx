import { useState, useEffect, useRef, ChangeEvent } from "react";
import { 
  initialLeads, 
  initialCRM, 
  initialOrders, 
  initialCosts 
} from "./data/seedData";
import { 
  LeadSourceLogItem, 
  CRMPipelineItem, 
  ShopifyOrderItem 
} from "./types";
import { 
  calculateCustomerMaster, 
  calculateRevenueAttribution, 
  calculateChannelDashboard 
} from "./utils/calculations";
import Dashboard from "./components/Dashboard";
import LeadSourceLog from "./components/LeadSourceLog";
import CRMPipeline from "./components/CRMPipeline";
import ShopifyOrders from "./components/ShopifyOrders";
import CustomerMaster from "./components/CustomerMaster";
import RevenueAttribution from "./components/RevenueAttribution";
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Database, 
  Layers, 
  Activity, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Clock
} from "lucide-react";

export default function App() {
  const [leads, setLeads] = useState<LeadSourceLogItem[]>([]);
  const [crmItems, setCrmItems] = useState<CRMPipelineItem[]>([]);
  const [orders, setOrders] = useState<ShopifyOrderItem[]>([]);
  const [costs, setCosts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [lastSaved, setLastSaved] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and load state
  useEffect(() => {
    const rawSaved = localStorage.getItem("attribution_dashboard_state");
    if (rawSaved) {
      try {
        const parsed = JSON.parse(rawSaved);
        setLeads(parsed.leads || initialLeads);
        setCrmItems(parsed.crmItems || initialCRM);
        setOrders(parsed.orders || initialOrders);
        setCosts(parsed.costs || initialCosts);
        setLastSaved(parsed.lastSaved || new Date().toLocaleTimeString("en-US", { hour12: false }));
      } catch (e) {
        // Fallback to seed data on corruption
        resetToDefault();
      }
    } else {
      resetToDefault();
    }
  }, []);

  // Helper to save current state
  const saveState = (
    currentLeads: LeadSourceLogItem[],
    currentCrm: CRMPipelineItem[],
    currentOrders: ShopifyOrderItem[],
    currentCosts: Record<string, number>
  ) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const dataToSave = {
      leads: currentLeads,
      crmItems: currentCrm,
      orders: currentOrders,
      costs: currentCosts,
      lastSaved: timestamp
    };
    localStorage.setItem("attribution_dashboard_state", JSON.stringify(dataToSave));
    setLastSaved(timestamp);
  };

  // State modifiers - Leads
  const handleAddLead = (item: LeadSourceLogItem) => {
    const updated = [item, ...leads];
    setLeads(updated);
    saveState(updated, crmItems, orders, costs);
  };
  const handleUpdateLead = (item: LeadSourceLogItem) => {
    const updated = leads.map(l => l.leadId === item.leadId ? item : l);
    setLeads(updated);
    saveState(updated, crmItems, orders, costs);
  };
  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(l => l.leadId !== id);
    setLeads(updated);
    saveState(updated, crmItems, orders, costs);
  };

  // State modifiers - CRM Pipeline
  const handleAddCRM = (item: CRMPipelineItem) => {
    const updated = [item, ...crmItems];
    setCrmItems(updated);
    saveState(leads, updated, orders, costs);
  };
  const handleUpdateCRM = (item: CRMPipelineItem) => {
    const updated = crmItems.map(c => c.opportunityId === item.opportunityId ? item : c);
    setCrmItems(updated);
    saveState(leads, updated, orders, costs);
  };
  const handleDeleteCRM = (id: string) => {
    const updated = crmItems.filter(c => c.opportunityId !== id);
    setCrmItems(updated);
    saveState(leads, updated, orders, costs);
  };

  // State modifiers - Shopify Orders
  const handleAddOrder = (item: ShopifyOrderItem) => {
    const updated = [item, ...orders];
    setOrders(updated);
    saveState(leads, crmItems, updated, costs);
  };
  const handleUpdateOrder = (item: ShopifyOrderItem) => {
    const updated = orders.map(o => o.shopifyOrderId === item.shopifyOrderId ? item : o);
    setOrders(updated);
    saveState(leads, crmItems, updated, costs);
  };
  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(o => o.shopifyOrderId !== id);
    setOrders(updated);
    saveState(leads, crmItems, updated, costs);
  };

  // State modifiers - Cost changes
  const handleCostChange = (channel: string, cost: number) => {
    const updatedCosts = { ...costs, [channel]: cost };
    setCosts(updatedCosts);
    saveState(leads, crmItems, orders, updatedCosts);
  };

  // Backup & controls
  const resetToDefault = () => {
    setLeads(initialLeads);
    setCrmItems(initialCRM);
    setOrders(initialOrders);
    setCosts(initialCosts);
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLastSaved(timestamp);
    localStorage.setItem("attribution_dashboard_state", JSON.stringify({
      leads: initialLeads,
      crmItems: initialCRM,
      orders: initialOrders,
      costs: initialCosts,
      lastSaved: timestamp
    }));
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ leads, crmItems, orders, costs, lastSaved })
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `attribution_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.leads && parsed.orders && parsed.costs) {
            setLeads(parsed.leads);
            setCrmItems(parsed.crmItems || []);
            setOrders(parsed.orders);
            setCosts(parsed.costs);
            saveState(parsed.leads, parsed.crmItems || [], parsed.orders, parsed.costs);
            alert("Backup imported and loaded successfully!");
          } else {
            alert("Invalid backup file structure.");
          }
        } catch (err) {
          alert("Error parsing backup JSON file.");
        }
      };
    }
  };

  // Core Workbook calculations computed in real-time on every state update
  const customerMaster = calculateCustomerMaster(leads, crmItems, orders);
  const revenueAttribution = calculateRevenueAttribution(orders, customerMaster);
  const dashboardData = calculateChannelDashboard(leads, revenueAttribution, costs);

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex flex-col font-sans antialiased text-[#1A1A2E]">
      
      {/* ── Sticky Navigation Header (56px, white, bottom separator, sticky) ── */}
      <header className="sticky top-0 z-40 h-[56px] bg-white border-b border-[#E8E8E6] shadow-sm">
        <div className="max-w-[1400px] h-full mx-auto px-10 flex items-center justify-between">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2">
            <Layers className="text-[#2251FF]" size={20} />
            <span className="font-heading text-lg font-bold text-[#051C2C] tracking-tight">
              ATTRIBUTION LAYER
            </span>
          </div>

          {/* Navigation Tab Links (全英文, Active underbar, hover feedback) */}
          <nav className="flex h-full items-center gap-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: <TrendingUp size={14} /> },
              { id: "leads", label: "Lead Log", icon: <Users size={14} /> },
              { id: "crm", label: "CRM Pipeline", icon: <Activity size={14} /> },
              { id: "orders", label: "Shopify Orders", icon: <ShoppingBag size={14} /> },
              { id: "master", label: "Customer Master", icon: <Database size={14} /> },
              { id: "attribution", label: "Revenue Attribution", icon: <Layers size={14} /> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-full px-4 flex items-center gap-1.5 text-[13px] font-semibold transition-all relative border-b-2 ${
                    isActive 
                      ? "text-[#2251FF] border-[#2251FF]" 
                      : "text-[#888888] border-transparent hover:text-[#051C2C]"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Center Content Workspace (Max width 1400px, 40px padding) ── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-10 py-8">
        
        {/* Top Control Rail (Last Saved indicators & Backup utility controls) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-[#E8E8E6] mb-8">
          
          {/* Title & Saving Status */}
          <div className="text-left">
            <h1 className="font-heading text-3xl font-extrabold text-[#051C2C] tracking-tight -mb-1">
              {activeTab === "dashboard" ? "Marketing ROI Dashboard" :
               activeTab === "leads" ? "Lead Source Touch Log" :
               activeTab === "crm" ? "CRM Opportunity pipeline" :
               activeTab === "orders" ? "Shopify Sales Ledger" :
               activeTab === "master" ? "Customer Golden Index" :
               "Model Attribution Ledger"}
            </h1>
            <div className="flex items-center gap-1.5 mt-2 text-[#888888] text-[12px] font-sans">
              <Clock size={12} className="text-[#2251FF]" />
              <span>Last saved to local session: <strong className="text-[#051C2C]">{lastSaved || "—"}</strong></span>
            </div>
          </div>

          {/* Backup Utilities Panel */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={exportBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F5F5F2] border border-[#E8E8E6] rounded-lg text-[12px] font-semibold text-[#051C2C] shadow-sm hover:shadow transition-all"
              title="Export state dataset as backup JSON file"
            >
              <Download size={13} />
              Export Backup
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F5F5F2] border border-[#E8E8E6] rounded-lg text-[12px] font-semibold text-[#051C2C] shadow-sm hover:shadow transition-all"
              title="Import JSON backup to restore session state"
            >
              <Upload size={13} />
              Import Backup
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={importBackup} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={() => {
                if (confirm("Reset dataset? This will discard custom modifications and restore original demo metrics.")) {
                  resetToDefault();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-red-50 border border-[#E8E8E6] hover:border-red-200 rounded-lg text-[12px] font-semibold text-[#D32F2F] shadow-sm transition-all"
              title="Restore seed data model"
            >
              <RotateCcw size={13} />
              Reset Data
            </button>
          </div>
        </div>

        {/* Tab View Router */}
        <div className="min-h-[500px]">
          {activeTab === "dashboard" && (
            <Dashboard 
              dashboardData={dashboardData} 
              onCostChange={handleCostChange} 
            />
          )}
          {activeTab === "leads" && (
            <LeadSourceLog 
              leads={leads} 
              onAdd={handleAddLead} 
              onUpdate={handleUpdateLead} 
              onDelete={handleDeleteLead} 
            />
          )}
          {activeTab === "crm" && (
            <CRMPipeline 
              crmItems={crmItems} 
              onAdd={handleAddCRM} 
              onUpdate={handleUpdateCRM} 
              onDelete={handleDeleteCRM} 
            />
          )}
          {activeTab === "orders" && (
            <ShopifyOrders 
              orders={orders} 
              onAdd={handleAddOrder} 
              onUpdate={handleUpdateOrder} 
              onDelete={handleDeleteOrder} 
            />
          )}
          {activeTab === "master" && (
            <CustomerMaster 
              customers={customerMaster} 
            />
          )}
          {activeTab === "attribution" && (
            <RevenueAttribution 
              attribution={revenueAttribution} 
            />
          )}
        </div>
      </main>

      {/* Elegant minimalist footer */}
      <footer className="py-6 mt-12 border-t border-[#E8E8E6] text-center text-[12px] text-[#888888]">
        Operational Attribution Layer Applet. Built with Institutional Minimalism × Apple HIG. All rights reserved.
      </footer>
    </div>
  );
}
