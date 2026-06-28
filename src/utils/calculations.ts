import {
  LeadSourceLogItem,
  CRMPipelineItem,
  ShopifyOrderItem,
  CustomerMasterItem,
  RevenueAttributionItem,
  ChannelROIDashboardItem,
  CHANNELS
} from "../types";

export function calculateCustomerMaster(
  leads: LeadSourceLogItem[],
  crm: CRMPipelineItem[],
  orders: ShopifyOrderItem[]
): CustomerMasterItem[] {
  const emailSet = new Set<string>();
  leads.forEach(l => {
    if (l.email && l.email.trim()) {
      emailSet.add(l.email.trim().toLowerCase());
    }
  });
  crm.forEach(c => {
    if (c.email && c.email.trim()) {
      emailSet.add(c.email.trim().toLowerCase());
    }
  });
  orders.forEach(o => {
    if (o.customerEmail && o.customerEmail.trim()) {
      emailSet.add(o.customerEmail.trim().toLowerCase());
    }
  });

  return Array.from(emailSet).map(email => {
    // 1. Find lead info
    const matchingLead = leads.find(l => l.email?.trim().toLowerCase() === email);
    const leadId = matchingLead ? matchingLead.leadId : "N/A";
    const firstTouchSource = matchingLead ? matchingLead.firstTouchSource : "Direct";

    // 2. Find CRM stage
    const matchingCRM = crm.find(c => c.email?.trim().toLowerCase() === email);
    const crmLatestStage = matchingCRM ? matchingCRM.salesStage : "Non-CRM";

    // 3. Find Shopify orders
    const matchingOrders = orders.filter(
      o => o.customerEmail?.trim().toLowerCase() === email
    );
    const paidOrders = matchingOrders.filter(o => o.orderStatus === "Paid");
    
    let firstOrderDate = "N/A";
    if (paidOrders.length > 0) {
      const dates = paidOrders.map(o => new Date(o.orderDate).getTime());
      const minTime = Math.min(...dates);
      firstOrderDate = new Date(minTime).toISOString().split("T")[0];
    }

    const totalOrderCount = matchingOrders.length;

    return {
      email,
      leadId,
      firstTouchSource,
      crmLatestStage,
      firstOrderDate,
      totalOrderCount
    };
  });
}

export function calculateRevenueAttribution(
  orders: ShopifyOrderItem[],
  master: CustomerMasterItem[]
): RevenueAttributionItem[] {
  return orders.map((order, index) => {
    const email = order.customerEmail?.trim().toLowerCase() || "";
    const matchingCustomer = master.find(c => c.email === email);

    const firstTouchSource = matchingCustomer ? matchingCustomer.firstTouchSource : "Direct";

    // Determine Last Touch Source based on Referrer Site
    let lastTouchSource = firstTouchSource;
    const ref = (order.referrerSite || "").toLowerCase();
    if (ref.includes("google")) {
      lastTouchSource = "Google Ads";
    } else if (ref.includes("facebook")) {
      lastTouchSource = "Facebook";
    }

    const revenue = order.orderStatus === "Paid" ? order.grossRevenue : 0;
    // In our rules:
    // FT_Attributed_Rev = Paid Revenue attributed to First Touch
    // LT_Attributed_Rev = Paid Revenue attributed to Last Touch
    const ftAttributedRev = revenue;
    const ltAttributedRev = revenue;

    return {
      attributionId: `AT-${10000 + index + 1}`,
      shopifyOrderId: order.shopifyOrderId,
      email: order.customerEmail,
      orderRevenue: order.grossRevenue,
      firstTouchSource,
      lastTouchSource,
      ftAttributedRev,
      ltAttributedRev
    };
  });
}

export function calculateChannelDashboard(
  leads: LeadSourceLogItem[],
  attribution: RevenueAttributionItem[],
  costs: Record<string, number>
): ChannelROIDashboardItem[] {
  return CHANNELS.map(channel => {
    const marketingCost = costs[channel] || 0;

    // Count of leads whose First_Touch_Source matches Channel
    const totalLeads = leads.filter(l => l.firstTouchSource === channel).length;

    // CPL = Marketing_Cost / Total_Leads
    const cpl = totalLeads > 0 ? marketingCost / totalLeads : 0;

    // FT_Attributed_Rev = Sum of FT_Attributed_Rev where First_Touch_Source = channel
    const ftAttributedRev = attribution
      .filter(a => a.firstTouchSource === channel)
      .reduce((sum, a) => sum + a.ftAttributedRev, 0);

    // LT_Attributed_Rev = Sum of LT_Attributed_Rev where Last_Touch_Source = channel
    const ltAttributedRev = attribution
      .filter(a => a.lastTouchSource === channel)
      .reduce((sum, a) => sum + a.ltAttributedRev, 0);

    // FT_ROI = (FT_Attributed_Rev - Marketing_Cost) / Marketing_Cost (if Cost > 0, else -1 or 0? Let's do (FT - Cost)/Cost, if Cost == 0 but Rev > 0, we can define as positive infinite or 0? The formula says: IFERROR((FT - Cost)/Cost, -1))
    const ftRoi = marketingCost > 0 ? (ftAttributedRev - marketingCost) / marketingCost : (ftAttributedRev > 0 ? 9.99 : 0);
    const ltRoi = marketingCost > 0 ? (ltAttributedRev - marketingCost) / marketingCost : (ltAttributedRev > 0 ? 9.99 : 0);

    return {
      channel,
      marketingCost,
      totalLeads,
      cpl,
      ftAttributedRev,
      ltAttributedRev,
      ftRoi,
      ltRoi
    };
  });
}
