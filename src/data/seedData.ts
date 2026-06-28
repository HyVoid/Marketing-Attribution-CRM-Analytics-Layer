import { LeadSourceLogItem, CRMPipelineItem, ShopifyOrderItem } from "../types";

export const initialLeads: LeadSourceLogItem[] = [
  {
    leadId: "L-10001",
    createDate: "2026-05-10",
    email: "james.timber@woodwork.com",
    firstTouchSource: "Google Ads",
    utmCampaign: "Timber_USA_Search",
    utmMedium: "cpc",
    ipCountry: "United States"
  },
  {
    leadId: "L-10002",
    createDate: "2026-05-12",
    email: "lisa.smith@buildershub.ca",
    firstTouchSource: "Facebook",
    utmCampaign: "Builders_Social_Prospecting",
    utmMedium: "social-ad",
    ipCountry: "Canada"
  },
  {
    leadId: "L-10003",
    createDate: "2026-05-14",
    email: "architect.wang@designstudio.cn",
    firstTouchSource: "Organic SEO",
    utmCampaign: "Structural_Materials_Guide",
    utmMedium: "organic",
    ipCountry: "China"
  },
  {
    leadId: "L-10004",
    createDate: "2026-05-18",
    email: "contractor.dave@roofingpros.com",
    firstTouchSource: "Trade Show",
    utmCampaign: "Build_Expo_2026",
    utmMedium: "event-qr",
    ipCountry: "United States"
  },
  {
    leadId: "L-10005",
    createDate: "2026-05-20",
    email: "emma.watson@residentialcorp.com",
    firstTouchSource: "Referral",
    utmCampaign: "Affiliate_Partner_Ref",
    utmMedium: "referral-link",
    ipCountry: "United Kingdom"
  },
  {
    leadId: "L-10006",
    createDate: "2026-05-22",
    email: "unknown.buyer@gmail.com",
    firstTouchSource: "Direct",
    utmCampaign: "Direct_Type_In",
    utmMedium: "none",
    ipCountry: "Australia"
  },
  {
    leadId: "L-10007",
    createDate: "2026-05-25",
    email: "john.doe@fastbuild.com",
    firstTouchSource: "Google Ads",
    utmCampaign: "Timber_USA_Search",
    utmMedium: "cpc",
    ipCountry: "United States"
  },
  {
    leadId: "L-10008",
    createDate: "2026-05-28",
    email: "clara.becker@berlinarchitects.de",
    firstTouchSource: "Organic SEO",
    utmCampaign: "Sustainable_Wood_Sourcing",
    utmMedium: "organic",
    ipCountry: "Germany"
  },
  {
    leadId: "L-10009",
    createDate: "2026-06-01",
    email: "sam.oak@oakfurniture.co.uk",
    firstTouchSource: "Facebook",
    utmCampaign: "Furniture_Wood_Re-targeting",
    utmMedium: "retargeting",
    ipCountry: "United Kingdom"
  },
  {
    leadId: "L-10010",
    createDate: "2026-06-03",
    email: "mary.jane@ecobuild.org",
    firstTouchSource: "Trade Show",
    utmCampaign: "Build_Expo_2026",
    utmMedium: "event-booth",
    ipCountry: "United States"
  }
];

export const initialCRM: CRMPipelineItem[] = [
  {
    opportunityId: "OP-00001",
    email: "james.timber@woodwork.com",
    customerName: "James Timber Ltd",
    salesStage: "Sample Sent",
    estimatedValue: 4500,
    salesOwner: "Sarah Jenkins",
    lastUpdateTime: "2026-05-18"
  },
  {
    opportunityId: "OP-00002",
    email: "lisa.smith@buildershub.ca",
    customerName: "Builders Hub Ltd",
    salesStage: "Closed Won",
    estimatedValue: 12000,
    salesOwner: "Sarah Jenkins",
    lastUpdateTime: "2026-06-02"
  },
  {
    opportunityId: "OP-00003",
    email: "architect.wang@designstudio.cn",
    customerName: "Wang Architect Studio",
    salesStage: "Closed Won",
    estimatedValue: 8500,
    salesOwner: "Michael Chang",
    lastUpdateTime: "2026-06-10"
  },
  {
    opportunityId: "OP-00004",
    email: "contractor.dave@roofingpros.com",
    customerName: "Dave's Roofing Pros",
    salesStage: "Proposal/Quote",
    estimatedValue: 25000,
    salesOwner: "Michael Chang",
    lastUpdateTime: "2026-05-22"
  },
  {
    opportunityId: "OP-00005",
    email: "emma.watson@residentialcorp.com",
    customerName: "Residential Corp",
    salesStage: "Lead Contact",
    estimatedValue: 15000,
    salesOwner: "Sarah Jenkins",
    lastUpdateTime: "2026-05-20"
  },
  {
    opportunityId: "OP-00006",
    email: "john.doe@fastbuild.com",
    customerName: "FastBuild LLC",
    salesStage: "Closed Lost",
    estimatedValue: 5000,
    salesOwner: "Michael Chang",
    lastUpdateTime: "2026-06-05"
  },
  {
    opportunityId: "OP-00007",
    email: "clara.becker@berlinarchitects.de",
    customerName: "Berlin Architects",
    salesStage: "Proposal/Quote",
    estimatedValue: 18000,
    salesOwner: "Sarah Jenkins",
    lastUpdateTime: "2026-06-15"
  }
];

export const initialOrders: ShopifyOrderItem[] = [
  {
    shopifyOrderId: "#10001",
    customerEmail: "james.timber@woodwork.com",
    orderDate: "2026-05-25",
    grossRevenue: 4200,
    orderStatus: "Paid",
    referrerSite: "googleads.g.doubleclick.net/Timber_USA_Search"
  },
  {
    shopifyOrderId: "#10002",
    customerEmail: "lisa.smith@buildershub.ca",
    orderDate: "2026-06-02",
    grossRevenue: 12000,
    orderStatus: "Paid",
    referrerSite: "m.facebook.com/ad-clicks/Builders_Social"
  },
  {
    shopifyOrderId: "#10003",
    customerEmail: "architect.wang@designstudio.cn",
    orderDate: "2026-06-10",
    grossRevenue: 8500,
    orderStatus: "Paid",
    referrerSite: "google.com/search-results?q=structural+wood"
  },
  {
    shopifyOrderId: "#10004",
    customerEmail: "contractor.dave@roofingpros.com",
    orderDate: "2026-05-22",
    grossRevenue: 2500,
    orderStatus: "Paid",
    referrerSite: "direct"
  },
  {
    shopifyOrderId: "#10005",
    customerEmail: "unknown.buyer@gmail.com",
    orderDate: "2026-05-23",
    grossRevenue: 850,
    orderStatus: "Paid",
    referrerSite: "direct"
  },
  {
    shopifyOrderId: "#10006",
    customerEmail: "sam.oak@oakfurniture.co.uk",
    orderDate: "2026-06-12",
    grossRevenue: 3100,
    orderStatus: "Paid",
    referrerSite: "facebook.com/post-shares"
  },
  {
    shopifyOrderId: "#10007",
    customerEmail: "james.timber@woodwork.com",
    orderDate: "2026-06-14",
    grossRevenue: 1500,
    orderStatus: "Refunded",
    referrerSite: "googleads.g.doubleclick.net/re-targeting"
  },
  {
    shopifyOrderId: "#10008",
    customerEmail: "mary.jane@ecobuild.org",
    orderDate: "2026-06-18",
    grossRevenue: 4800,
    orderStatus: "Paid",
    referrerSite: "direct"
  }
];

export const initialCosts: Record<string, number> = {
  "Google Ads": 2500,
  "Facebook": 1800,
  "Organic SEO": 1000,
  "Referral": 500,
  "Trade Show": 3500,
  "Direct": 0
};
