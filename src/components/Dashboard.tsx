import { useState } from "react";
import { ChannelROIDashboardItem, CHANNELS } from "../types";
import { TrendingUp, DollarSign, Users, Award, ShieldAlert } from "lucide-react";

interface DashboardProps {
  dashboardData: ChannelROIDashboardItem[];
  onCostChange: (channel: string, cost: number) => void;
}

export default function Dashboard({ dashboardData, onCostChange }: DashboardProps) {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  // Overall calculations
  const totalCost = dashboardData.reduce((sum, item) => sum + item.marketingCost, 0);
  const totalLeads = dashboardData.reduce((sum, item) => sum + item.totalLeads, 0);
  const totalFTRev = dashboardData.reduce((sum, item) => sum + item.ftAttributedRev, 0);
  const totalLTRev = dashboardData.reduce((sum, item) => sum + item.ltAttributedRev, 0);

  const overallFT_ROI = totalCost > 0 ? (totalFTRev - totalCost) / totalCost : 0;
  const overallLT_ROI = totalCost > 0 ? (totalLTRev - totalCost) / totalCost : 0;

  // Find channel insights
  const highestROIChannelFT = [...dashboardData]
    .filter(d => d.marketingCost > 0 || d.ftAttributedRev > 0)
    .sort((a, b) => b.ftRoi - a.ftRoi)[0];

  const highestROIChannelLT = [...dashboardData]
    .filter(d => d.marketingCost > 0 || d.ltAttributedRev > 0)
    .sort((a, b) => b.ltRoi - a.ltRoi)[0];

  const lowestROIChannelFT = [...dashboardData]
    .filter(d => d.marketingCost > 0)
    .sort((a, b) => a.ftRoi - b.ftRoi)[0];

  // Custom SVG Chart parameters
  const chartHeight = 220;
  const chartWidth = 600;
  const maxRev = Math.max(
    ...dashboardData.map(d => Math.max(d.ftAttributedRev, d.ltAttributedRev, d.marketingCost)),
    1000
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ── KPI Grid Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Marketing Spend */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Total Marketing Cost</span>
            <div className="p-2 bg-[#051C2C]/5 rounded-lg text-[#051C2C]">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#051C2C] tracking-tight -mb-1">
              ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">Sum of manual cost budgets</p>
          </div>
        </div>

        {/* KPI 2: Total Leads & CPL */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Total Leads Acquired</span>
            <div className="p-2 bg-[#2251FF]/5 rounded-lg text-[#2251FF]">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#051C2C] tracking-tight -mb-1">
              {totalLeads}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">
              Blended CPL: <strong className="text-[#051C2C]">${totalLeads > 0 ? (totalCost / totalLeads).toFixed(2) : "0.00"}</strong>
            </p>
          </div>
        </div>

        {/* KPI 3: First Touch Revenue & ROI */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">First-Touch Revenue</span>
            <div className="p-2 bg-[#051C2C]/5 rounded-lg text-[#051C2C]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#2251FF] tracking-tight -mb-1">
              ${totalFTRev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">
              FT Blended ROI: <strong className="text-[#2251FF]">{(overallFT_ROI * 100).toFixed(1)}%</strong>
            </p>
          </div>
        </div>

        {/* KPI 4: Last Touch Revenue & ROI */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Last-Touch Revenue</span>
            <div className="p-2 bg-[#2251FF]/5 rounded-lg text-[#2251FF]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-[#051C2C] tracking-tight -mb-1">
              ${totalLTRev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            <p className="text-[#888888] text-[12px] mt-1">
              LT Blended ROI: <strong className="text-[#051C2C]">{(overallLT_ROI * 100).toFixed(1)}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Visual Analytics Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Custom SVG Dual Bar Chart (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#051C2C] tracking-tight mb-1">
              Attributed Revenue vs Cost Comparison
            </h3>
            <p className="text-[#888888] text-[12px] mb-4">
              Side-by-side view comparing FT Revenue (Primary), LT Revenue (Accent), and Marketing Cost (Grey line).
            </p>
          </div>

          {/* Interactive Chart Core */}
          <div className="relative w-full overflow-hidden flex justify-center py-4 bg-[#F5F5F2]/50 rounded-lg border border-[#E8E8E6]/60">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full max-w-[560px] h-auto"
            >
              {/* Y Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartHeight - 40 - ratio * (chartHeight - 60);
                const val = Math.round(maxRev * ratio);
                return (
                  <g key={i}>
                    <line 
                      x1="50" 
                      y1={y} 
                      x2={chartWidth - 20} 
                      y2={y} 
                      stroke="#E8E8E6" 
                      strokeWidth="1" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x="40" 
                      y={y + 4} 
                      fill="#888888" 
                      fontSize="9" 
                      fontFamily="Inter" 
                      textAnchor="end"
                    >
                      ${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                    </text>
                  </g>
                );
              })}

              {/* Draw bars for each Channel */}
              {dashboardData.map((d, index) => {
                const groupWidth = (chartWidth - 80) / CHANNELS.length;
                const xGroupStart = 60 + index * groupWidth;
                
                // Heights
                const barHeightFT = ((d.ftAttributedRev) / maxRev) * (chartHeight - 60);
                const barHeightLT = ((d.ltAttributedRev) / maxRev) * (chartHeight - 60);
                const costY = chartHeight - 40 - ((d.marketingCost) / maxRev) * (chartHeight - 60);

                const barWidth = 14;
                const paddingBetween = 2;

                const isHovered = hoveredChannel === d.channel;

                return (
                  <g 
                    key={d.channel}
                    onMouseEnter={() => setHoveredChannel(d.channel)}
                    onMouseLeave={() => setHoveredChannel(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover highlight column backdrop */}
                    {isHovered && (
                      <rect 
                        x={xGroupStart - 6} 
                        y="10" 
                        width={groupWidth - 4} 
                        height={chartHeight - 40} 
                        fill="rgba(34, 81, 255, 0.04)"
                        rx="4"
                      />
                    )}

                    {/* Bar 1: FT Revenue (Primary color) */}
                    <rect 
                      x={xGroupStart + (groupWidth / 2) - barWidth - paddingBetween} 
                      y={chartHeight - 40 - barHeightFT} 
                      width={barWidth} 
                      height={Math.max(barHeightFT, 2)} 
                      fill={isHovered ? "#0a2d46" : "#051C2C"} 
                      rx="2"
                    />

                    {/* Bar 2: LT Revenue (Accent color) */}
                    <rect 
                      x={xGroupStart + (groupWidth / 2) + paddingBetween} 
                      y={chartHeight - 40 - barHeightLT} 
                      width={barWidth} 
                      height={Math.max(barHeightLT, 2)} 
                      fill={isHovered ? "#3d66ff" : "#2251FF"} 
                      rx="2"
                    />

                    {/* Cost Horizontal Marker Line */}
                    {d.marketingCost > 0 && (
                      <line 
                        x1={xGroupStart + 2} 
                        y1={costY} 
                        x2={xGroupStart + groupWidth - 14} 
                        y2={costY} 
                        stroke="#888888" 
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Axis Channel Label */}
                    <text 
                      x={xGroupStart + groupWidth / 2 - 6} 
                      y={chartHeight - 15} 
                      fill={isHovered ? "#2251FF" : "#051C2C"} 
                      fontSize="9" 
                      fontFamily="Inter" 
                      fontWeight={isHovered ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {d.channel.split(" ")[0]}
                    </text>
                  </g>
                );
              })}

              {/* Bottom Base Axis */}
              <line 
                x1="50" 
                y1={chartHeight - 40} 
                x2={chartWidth - 20} 
                y2={chartHeight - 40} 
                stroke="#051C2C" 
                strokeWidth="1.5"
              />
            </svg>

            {/* Custom Interactive Tooltip box overlay on top of chart container */}
            {hoveredChannel && (
              <div className="absolute top-2 right-2 bg-[#051C2C] text-white p-3 rounded-lg shadow-xl text-[11px] font-sans space-y-1 border border-[#2251FF]/30 animate-fade-up">
                <p className="font-bold border-b border-white/20 pb-1 text-[#2251FF] text-[12px] uppercase tracking-wider">
                  {hoveredChannel}
                </p>
                {(() => {
                  const data = dashboardData.find(d => d.channel === hoveredChannel);
                  if (!data) return null;
                  return (
                    <>
                      <div className="flex justify-between gap-6">
                        <span className="text-white/60">Marketing Cost:</span>
                        <span className="font-mono font-semibold">${data.marketingCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-white/60">First-Touch Rev:</span>
                        <span className="font-mono font-semibold text-white">${data.ftAttributedRev.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-white/60">Last-Touch Rev:</span>
                        <span className="font-mono font-semibold text-[#2251FF]">${data.ltAttributedRev.toLocaleString()}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Legend indicator */}
          <div className="flex items-center gap-6 text-[11px] mt-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#051C2C] rounded-sm" />
              <span className="text-[#051C2C]">First-Touch Attributed Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#2251FF] rounded-sm" />
              <span className="text-[#2251FF]">Last-Touch Attributed Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-[#888888] rounded-sm" />
              <span className="text-[#888888]">Marketing Spend</span>
            </div>
          </div>
        </div>

        {/* ── Real-Time Strategic Insights Panel ── */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-[#E8E8E6] card-lift flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-[#2251FF]" size={18} />
              <h3 className="font-heading text-lg font-bold text-[#051C2C] tracking-tight">
                CEO Strategic Insights
              </h3>
            </div>
            <p className="text-[#888888] text-[12px] mb-4">
              Algorithmic recommendations generated instantly from marketing spend and attributed transactions:
            </p>

            <div className="space-y-4">
              {/* Insight 1: Highest ROI */}
              {highestROIChannelFT && highestROIChannelFT.ftRoi > 0 ? (
                <div className="p-3 bg-[rgba(34,81,255,0.04)] border-l-3 border-[#2251FF] rounded-r-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Award size={14} className="text-[#2251FF]" />
                    <span className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Top-Performing Channel</span>
                  </div>
                  <p className="text-[12px] text-[#1A1A2E] leading-relaxed">
                    <strong className="text-[#2251FF]">{highestROIChannelFT.channel}</strong> is leading with an astronomical First-Touch ROI of <strong>{(highestROIChannelFT.ftRoi * 100).toFixed(0)}%</strong>. Consider allocating more marketing budget here to accelerate lead acquisition.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-[rgba(136,136,136,0.04)] border-l-3 border-[#888888] rounded-r-lg">
                  <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider block mb-1">Top Performer</span>
                  <p className="text-[12px] text-[#888888] italic">No channels currently show a positive ROI metric. Please record conversions or budgets to populate metrics.</p>
                </div>
              )}

              {/* Insight 2: Model Discrepancy Alert */}
              {highestROIChannelFT && highestROIChannelLT && highestROIChannelFT.channel !== highestROIChannelLT.channel && (
                <div className="p-3 bg-[rgba(5,28,44,0.04)] border-l-3 border-[#051C2C] rounded-r-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp size={14} className="text-[#051C2C]" />
                    <span className="text-[11px] font-bold text-[#051C2C] uppercase tracking-wider">Model Discrepancy Detected</span>
                  </div>
                  <p className="text-[12px] text-[#1A1A2E] leading-relaxed">
                    Your First-Touch winner is <strong>{highestROIChannelFT.channel}</strong>, but Last-Touch favors <strong>{highestROIChannelLT.channel}</strong>. This indicates a multi-touch purchase journey where clients discover you via one channel and check out via another.
                  </p>
                </div>
              )}

              {/* Insight 3: Poor ROI / Cost Bloat */}
              {lowestROIChannelFT && lowestROIChannelFT.ftRoi < -0.2 && (
                <div className="p-3 bg-[rgba(211,47,47,0.04)] border-l-3 border-[#D32F2F] rounded-r-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldAlert size={14} className="text-[#D32F2F]" />
                    <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider">Underperforming Budget Alert</span>
                  </div>
                  <p className="text-[12px] text-[#1A1A2E] leading-relaxed">
                    <strong className="text-[#D32F2F]">{lowestROIChannelFT.channel}</strong> has a negative ROI of <strong>{(lowestROIChannelFT.ftRoi * 100).toFixed(0)}%</strong>. Evaluate its current asset copy or pause spends to conserve capital.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#E8E8E6] pt-4 mt-4 text-[11px] text-[#888888] leading-relaxed">
            * Spends and ROI metrics recalculate in real-time. Feel free to tweak costs in the table below to simulate and model different ROI scenarios.
          </div>
        </div>
      </div>

      {/* ── Sheet 6: Channel ROI Dashboard Table ── */}
      <div className="space-y-4">
        <div className="text-left">
          <h3 className="font-heading text-xl font-bold text-[#051C2C] tracking-tight mb-1">
            Channel ROI & Cost Control Panel
          </h3>
          <p className="text-[#888888] text-[13px]">
            Directly modify marketing costs in the yellow cells to instantly run sensitivity ROI mapping models.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] card-lift">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[rgba(5,28,44,0.04)] border-b-2 border-[rgba(5,28,44,0.12)]">
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Channel Source</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider">Marketing Spend ($)</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Total Leads</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">CPL (Cost Per Lead)</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">FT Attributed Revenue</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">LT Attributed Revenue</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">First-Touch ROI (%)</th>
                  <th className="px-6 py-3.5 text-[11px] font-semibold text-[#051C2C] uppercase tracking-wider text-right">Last-Touch ROI (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E6]">
                {dashboardData.map((item) => {
                  // Math percentages for inline bars
                  const maxFTRev = Math.max(...dashboardData.map(d => d.ftAttributedRev), 1);
                  const maxLTRev = Math.max(...dashboardData.map(d => d.ltAttributedRev), 1);

                  const ftRevPct = (item.ftAttributedRev / maxFTRev) * 100;
                  const ltRevPct = (item.ltAttributedRev / maxLTRev) * 100;

                  return (
                    <tr key={item.channel} className="hover:bg-[#F5F5F2] transition-colors">
                      {/* Channel Name */}
                      <td className="px-6 py-4 text-[#051C2C] text-[13px] font-bold">
                        {item.channel}
                      </td>

                      {/* Marketing Cost (Editable Yellow Input Cell) */}
                      <td className="px-6 py-3">
                        <div className="relative max-w-[120px]">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888888] text-[13px] font-semibold">$</span>
                          <input 
                            type="number" 
                            min="0"
                            step="10"
                            value={item.marketingCost} 
                            onChange={(e) => onCostChange(item.channel, parseFloat(e.target.value) || 0)}
                            className="w-full pl-6 pr-2 py-1 bg-[#FFFDE7] border border-[#E8E8E6] rounded text-[13px] text-[#051C2C] font-mono font-semibold focus:bg-white focus:border-[#2251FF] focus:ring-1 focus:ring-[#2251FF] transition-all"
                          />
                        </div>
                      </td>

                      {/* Total Leads */}
                      <td className="px-6 py-4 text-right font-mono text-[#1A1A2E] text-[13px]">
                        {item.totalLeads}
                      </td>

                      {/* CPL */}
                      <td className="px-6 py-4 text-right font-mono text-[#1A1A2E] text-[13px]">
                        ${item.cpl.toFixed(2)}
                      </td>

                      {/* FT Attributed Revenue with inline data bar */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[#051C2C] font-semibold text-[13px]">
                            ${item.ftAttributedRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <div className="w-24 h-1 bg-[#051C2C]/10 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-[#051C2C] transition-all duration-500 rounded-full" 
                              style={{ width: `${ftRevPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* LT Attributed Revenue with inline data bar */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[#2251FF] font-semibold text-[13px]">
                            ${item.ltAttributedRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <div className="w-24 h-1 bg-[#2251FF]/10 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-[#2251FF] transition-all duration-500 rounded-full" 
                              style={{ width: `${ltRevPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* First-Touch ROI */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-[13px]">
                        <span className={item.ftRoi > 0 ? "text-[#00C853]" : item.ftRoi < 0 ? "text-[#D32F2F]" : "text-[#888888]"}>
                          {(item.ftRoi * 100).toFixed(1)}%
                        </span>
                      </td>

                      {/* Last-Touch ROI */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-[13px]">
                        <span className={item.ltRoi > 0 ? "text-[#00C853]" : item.ltRoi < 0 ? "text-[#D32F2F]" : "text-[#888888]"}>
                          {(item.ltRoi * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
