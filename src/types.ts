export interface LeadSourceLogItem {
  leadId: string;
  createDate: string;
  email: string;
  firstTouchSource: string; // Google Ads | Facebook | Organic SEO | Referral | Trade Show | Direct
  utmCampaign?: string;
  utmMedium?: string;
  ipCountry?: string;
}

export interface CRMPipelineItem {
  opportunityId: string;
  email: string;
  customerName: string;
  salesStage: string; // Lead Contact | Proposal/Quote | Sample Sent | Closed Won | Closed Lost
  estimatedValue: number;
  salesOwner: string;
  lastUpdateTime: string;
}

export interface ShopifyOrderItem {
  shopifyOrderId: string;
  customerEmail: string;
  orderDate: string;
  grossRevenue: number;
  orderStatus: string; // Paid | Refunded | Partially Refunded
  referrerSite: string;
}

export interface CustomerMasterItem {
  email: string;
  leadId: string;
  firstTouchSource: string;
  crmLatestStage: string;
  firstOrderDate: string;
  totalOrderCount: number;
}

export interface RevenueAttributionItem {
  attributionId: string;
  shopifyOrderId: string;
  email: string;
  orderRevenue: number;
  firstTouchSource: string;
  lastTouchSource: string;
  ftAttributedRev: number;
  ltAttributedRev: number;
}

export interface ChannelROIDashboardItem {
  channel: string;
  marketingCost: number;
  totalLeads: number;
  cpl: number;
  ftAttributedRev: number;
  ltAttributedRev: number;
  ftRoi: number;
  ltRoi: number;
}

export const CHANNELS = [
  "Google Ads",
  "Facebook",
  "Organic SEO",
  "Referral",
  "Trade Show",
  "Direct"
];

export const SALES_STAGES = [
  "Lead Contact",
  "Proposal/Quote",
  "Sample Sent",
  "Closed Won",
  "Closed Lost"
];

export const ORDER_STATUSES = [
  "Paid",
  "Refunded",
  "Partially Refunded"
];
