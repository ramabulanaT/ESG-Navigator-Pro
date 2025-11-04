import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface LeadData {
  company: string;
  industry: string;
  country: string;
  region?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  employee_count?: number;
  revenue_usd?: number;
  has_global_footprint?: boolean;
  is_jse_listed?: boolean;
  source: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const leadData: LeadData = await req.json();

    // 1. org record
    const orgResult = await pool.query(
      `INSERT INTO organizations
        (name, industry, country, region, employee_count, annual_revenue, is_jse_listed, has_global_footprint)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        leadData.company,
        leadData.industry,
        leadData.country,
        leadData.region || null,
        leadData.employee_count || null,
        leadData.revenue_usd || null,
        leadData.is_jse_listed || false,
        leadData.has_global_footprint || false,
      ],
    );

    const orgId = orgResult.rows[0].id;

    // 2. contact record
    await pool.query(
      `INSERT INTO users (email, name, phone, organization_id, role)
       VALUES ($1,$2,$3,$4,'prospect')`,
      [
        leadData.contact_email,
        leadData.contact_name,
        leadData.contact_phone || null,
        orgId,
      ],
    );

    // 3. score
    const qualification = calculateQualificationScore(leadData);

    // 4. metrics snapshot
    await pool.query(
      `INSERT INTO dashboard_metrics (organization_id, overall_esg_score, metadata)
       VALUES ($1,$2,$3)`,
      [orgId, qualification.overall_score, JSON.stringify(qualification)],
    );

    return NextResponse.json({
      success: true,
      lead_id: orgId,
      qualification,
    });
  } catch (error: any) {
    console.error("Lead qualification error:", error);
    return NextResponse.json(
      { error: "Failed to qualify lead", details: error.message },
      { status: 500 },
    );
  }
}

function calculateQualificationScore(leadData: LeadData) {
  let score = 50;
  const recommended_agents: string[] = [];

  // Industry weighting
  if (leadData.industry === "Mining") {
    score += 25;
    recommended_agents.push(
      "Environmental Management",
      "Health & Safety",
      "Supply Chain ESG"
    );
  } else if (leadData.industry === "Financial Services") {
    score += 20;
    recommended_agents.push(
      "ISO 27001",
      "Financial Services ESG",
      "Data Privacy"
    );
  } else if (leadData.industry === "Education") {
    score += 15;
    recommended_agents.push(
      "Education Sector ESG",
      "Data Privacy",
      "Quality Management"
    );
  }

  // Size / maturity
  if ((leadData.employee_count || 0) > 5000) score += 20;
  else if ((leadData.employee_count || 0) > 1000) score += 15;
  else if ((leadData.employee_count || 0) > 250) score += 10;

  // Listing / footprint
  if (leadData.is_jse_listed) score += 15;
  if (leadData.has_global_footprint) score += 15;

  // Special cases
  if (leadData.company.toLowerCase().includes("sibanye")) score = 95;
  if (
    leadData.company.toLowerCase().includes("university") &&
    leadData.region === "Limpopo"
  )
    score = 90;

  const univen_opportunity =
    leadData.industry === "Education" &&
    leadData.country === "South Africa";

  const grant_potential =
    leadData.country === "South Africa" &&
    (leadData.employee_count || 0) > 50;

  return {
    overall_score: Math.min(100, score),
    qualification_status:
      score >= 75
        ? "qualified"
        : score >= 50
        ? "needs_nurturing"
        : "not_qualified",
    estimated_value: Math.round(score * 2500),
    recommended_agents,
    univen_opportunity,
    grant_funding_potential: grant_potential,
  };
}
