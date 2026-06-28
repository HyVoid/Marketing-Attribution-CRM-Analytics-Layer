import { useState, FormEvent } from "react";
import { ShopifyOrderItem, ORDER_STATUSES } from "../types";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import Modal from "./Modal";

interface ShopifyOrdersProps {
  orders: ShopifyOrderItem[];
  onAdd: (item: ShopifyOrderItem) => void;
  onUpdate: (item: ShopifyOrderItem) => void;
  onDelete: (id: string) => void;
}

export default function ShopifyOrders({ orders, onAdd, onUpdate, onDelete }: ShopifyOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopifyOrderItem | null>(null);

  // Form states
  const [shopifyOrderId, setShopifyOrderId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [grossRevenue, setGrossRevenue] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState("Paid");
  const [referrerSite, setReferrerSite] = useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    const nextNum = orders.length > 0 
      ? Math.max(...orders.map(o => parseInt(o.shopifyOrderId.replace("#", "")) || 10000)) + 1 
      : 10001;
    setShopifyOrderId(`#${nextNum}`);
    setCustomerEmail("");
    setOrderDate(new Date().toISOString().split("T")[0]);
    setGrossRevenue(0);
    setOrderStatus("Paid");
    setReferrerSite("direct");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ShopifyOrderItem) => {
    setEditingItem(item);
    setShopifyOrderId(item.shopifyOrderId);
    setCustomerEmail(item.customerEmail);
    setOrderDate(item.orderDate);
    setGrossRevenue(item.grossRevenue);
    setOrderStatus(item.orderStatus);
    setReferrerSite(item.referrerSite);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !orderDate || !referrerSite) return;

    const item: ShopifyOrderItem = {
      shopifyOrderId,
      customerEmail: customerEmail.trim().toLowerCase(),
      orderDate,
      grossRevenue: Number(grossRevenue),
      orderStatus,
      referrerSite: referrerSite.trim()
    };

    if (editingItem) {
      onUpdate(item);
    } else {
      onAdd(item);
    }
    setIsModalOpen(false);
  };

  const filteredOrders = orders.filter(o => 
    o.shopifyOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.referrerSite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-up">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
          <input 
            type="text" 
            placeholder="Search orders by order ID, email, status..." 
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
          Add Shopify Order
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] card-lift">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[rgba(5,28,44,0.04)] border-b-2 border-[rgba(5,28,44,0.12)]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Shopify Order ID</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Customer Email</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Gross Revenue</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Order Status</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Referrer Site</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#888888] font-sans">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.shopifyOrderId} className="hover:bg-[#F5F5F2] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#051C2C] text-[13px]">{order.shopifyOrderId}</td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px] font-medium">{order.customerEmail}</td>
                    <td className="px-6 py-4 text-[#1A1A2E] text-[13px]">{order.orderDate}</td>
                    <td className="px-6 py-4 text-right font-mono text-[#051C2C] font-semibold text-[13px]">
                      ${order.grossRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        order.orderStatus === "Paid"
                          ? "bg-[rgba(0,200,83,0.08)] text-[#00C853] border-[rgba(0,200,83,0.2)]"
                          : order.orderStatus === "Refunded"
                          ? "bg-[rgba(211,47,47,0.08)] text-[#D32F2F] border-[rgba(211,47,47,0.2)]"
                          : "bg-[rgba(136,136,136,0.08)] text-[#888888] border-[rgba(136,136,136,0.2)]"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#888888] text-[13px] max-w-xs truncate" title={order.referrerSite}>
                      {order.referrerSite}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(order)}
                          className="p-1 text-[#888888] hover:text-[#2251FF] hover:bg-[#F5F5F2] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete order ${order.shopifyOrderId}?`)) {
                              onDelete(order.shopifyOrderId);
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
        title={editingItem ? "Edit Shopify Order" : "Add Shopify Order"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Shopify Order ID (Read-only)
            </label>
            <input 
              type="text" 
              value={shopifyOrderId} 
              disabled
              className="w-full px-3 py-2 bg-[#F5F5F2] border border-[#E8E8E6] rounded-md text-[13px] text-[#888888] cursor-not-allowed font-mono"
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
              value={customerEmail} 
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Order Date *
            </label>
            <input 
              type="date" 
              required
              value={orderDate} 
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Gross Revenue ($) *
            </label>
            <input 
              type="number" 
              required
              min="0"
              step="0.01"
              value={grossRevenue} 
              onChange={(e) => setGrossRevenue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Order Status *
            </label>
            <select 
              value={orderStatus} 
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] transition-colors cursor-pointer"
            >
              {ORDER_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#051C2C] uppercase tracking-wider mb-1">
              Referrer Site *
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. googleads.g.doubleclick.net/some-parameters"
              value={referrerSite} 
              onChange={(e) => setReferrerSite(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDE7] border border-[#E8E8E6] rounded-md text-[13px] text-[#1A1A2E] placeholder-[#888888] transition-colors"
            />
            <p className="mt-1 text-[11px] text-[#888888]">
              Tip: Sites containing "google" are attributed to Google Ads. Sites containing "facebook" are attributed to Facebook. Otherwise, attributed to first touch.
            </p>
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
