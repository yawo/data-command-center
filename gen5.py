#!/usr/bin/env python3
import json

NAV = [
    {h:"/",l:"Dashboard"},
    {h:"/explorer",l:"Explorer"},
    {h:"/data",l:"Data Manager"},
    {h:"/stakeholders",l:"Stakeholders"},
    {h:"/roadmap",l:"Roadmap"},
    {h:"/governance",l:"Governance"},
]

TABLES = {
    "01_01": {"name":"Stakeholders","storage":"ds_01_01_stakeholder_registry","fields":["stakeholder_id","full_name","level","data_role","interview_status","influence_level","attitude_toward_change"]},
    "02_01": {"name":"Data Domains","storage":"ds_02_01_data_domain_inventory","fields":["domain_id","domain_name","owner_role","criticality","maturity_level"]},
    "02_02": {"name":"Systems","storage":"ds_02_02_system_register","fields":["system_id","system_name","system_type","owner","criticality"]},
    "02_03": {"name":"Data Flows","storage":"ds_02_03_data_flow_inventory","fields":["flow_id","flow_name","source_system","target_system","frequency","quality_score"]},
    "02_04": {"name":"Data Quality","storage":"ds_02_04_data_quality_assessment","fields":["dq_id","domain_id","dimension","metric_name","current_score","target_score"]},
    "02_06": {"name":"Governance Assessment","storage":"ds_02_06_data_governance_assessment","fields":["gov_id","governance_area","policy_exists","enforcement_level"]},
    "02_07": {"name":"Regulatory Gaps","storage":"ds_02_07_regulatory_compliance_gap","fields":["reg_id","regulation","requirement","current_compliance","risk_level"]},
    "02_08": {"name":"Maturity","storage":"ds_02_08_maturity_assessment","fields":["maturity_id","dama_dimension","current_level","target_level","gap_severity"]},
    "02_09": {"name":"Pain Points","storage":"ds_02_09_pain_point_register","fields":["pain_point_id","title","severity","business_impact"]},
    "03_01": {"name":"Gaps","storage":"ds_03_01_gap_register","fields":["gap_id","gap_name","gap_type","severity","priority"]},
    "04_01": {"name":"Use Cases","storage":"ds_04_01_use_case_longlist","fields":["use_case_id","use_case_name","use_case_type","business_domain","preliminary_feasibility","strategic_alignment","shortlist_candidate"]},
    "06_01": {"name":"Initiatives","storage":"ds_06_01_initiative_registry","fields":["initiative_id","initiative_name","wave","phase","status","priority","budget_usd","estimated_effort_days"]},
    "09_01": {"name":"Risks","storage":"ds_09_01_risk_register","fields":["risk_id","risk_title","probability","impact","risk_score","risk_level","status"]},
    "09_02": {"name":"KPIs","storage":"ds_09_02_kpi_framework","fields":["kpi_id","kpi_name","kpi_type","baseline_value","target_value_12m"]},
}

CODE = open("dashboard_live.tsx","w")
