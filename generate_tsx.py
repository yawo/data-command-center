import json

tables = [
  ("01_01_stakeholder_registry","Discovery","Stakeholder Registry",["stakeholder_id","full_name","title","department","level","data_role","engagement_relevance","interview_priority","interview_status","influence_level","attitude_toward_change","notes"]),
  ("01_02_interview_question_bank","Discovery","Interview Question Bank",["question_id","persona_type","topic_area","question_text","question_type","priority","dama_area"]),
  ("01_03_interview_session_log","Discovery","Interview Session Log",["session_id","stakeholder_id","interview_date","interviewer_name","question_id","answer_summary","insight_tagged","sentiment","follow_up_needed"]),
  ("01_04_document_request_tracker","Discovery","Document Request Tracker",["request_id","document_name","document_type","requested_from","requested_by","date_requested","due_date","status"]),
  ("01_05_workshop_planning_tracker","Discovery","Workshop Planning",["workshop_id","workshop_name","objective","workshop_type","date_planned","facilitator","participants_count","status"]),
  ("02_01_data_domain_inventory","As-Is","Data Domain Inventory",["domain_id","domain_name","description","owner_role","criticality","maturity_level"]),
  ("02_02_system_register","As-Is","System Register",["system_id","system_name","system_type","owner","department","criticality","integration_count","tech_stack"]),
  ("02_03_data_flow_inventory","As-Is","Data Flow Inventory",["flow_id","flow_name","source_system","target_system","frequency","data_type","volume_estimate","quality_score","documentation_status"]),
  ("02_04_data_quality_assessment","As-Is","Data Quality Assessment",["dq_id","domain_id","dimension","metric_name","current_score","target_score","root_cause","owner"]),
  ("02_05_technology_tool_assessment","As-Is","Technology Tool Assessment",["tool_id","tool_name","category","vendor","deployment_model","annual_cost","user_count"]),
  ("02_06_data_governance_assessment","As-Is","Data Governance Assessment",["gov_id","governance_area","policy_exists","policy_quality_score","enforcement_level","last_review_date","owner"]),
  ("02_07_regulatory_compliance_gap","As-Is","Regulatory Compliance Gap",["reg_id","regulation","requirement","current_compliance","gap","risk_level","remediation_effort","owner"]),
  ("02_08_maturity_assessment","As-Is","Maturity Assessment",["maturity_id","dama_dimension","current_level","target_level","gap","gap_severity"]),
  ("02_09_pain_point_register","As-Is","Pain Point Register",["pain_point_id","title","description","severity","frequency","business_impact","root_cause"]),
  ("02_10_cost_analysis","As-Is","Cost Analysis",["cost_id","cost_category","cost_element","annual_cost_usd","headcount","vendor_name","cost_driver"]),
  ("03_01_gap_register","Gap Analysis","Gap Register",["gap_id","gap_name","gap_type","current_state","target_state","severity","linked_initiative","priority"]),
  ("03_02_architecture_gap_analysis","Gap Analysis","Architecture Gap Analysis",["arch_gap_id","architecture_area","current_pattern","target_pattern","gap_type","severity","priority"]),
  ("03_03_data_flow_gap_analysis","Gap Analysis","Data Flow Gap Analysis",["flow_gap_id","gap_type","source_system","target_system","gap_description","business_impact","severity"]),
  ("04_01_use_case_longlist","Use Cases","Use Case Longlist",["use_case_id","use_case_name","use_case_type","business_domain","problem_statement","expected_outcome","preliminary_feasibility","strategic_alignment","shortlist_candidate"]),
  ("04_02_use_case_prioritization","Use Cases","Use Case Prioritization",["use_case_id","business_value_score","strategic_alignment_score","data_readiness_score","technical_feasibility_score","implementation_complexity_score","total_weighted_score","priority_tier"]),
  ("04_03_use_case_detail","Use Cases","Use Case Detail",["use_case_id","problem_statement_full","solution_description","data_requirements","technical_approach","resource_requirements","risks","success_criteria"]),
  ("05_01_target_capability_model","Target State","Target Capability Model",["capability_id","capability_name","dama_area","current_level","target_level","maturity_gap"]),
  ("05_02_target_architecture","Target State","Target Architecture",["arch_id","architecture_layer","component_name","description","technology_choice","integration_pattern"]),
  ("05_03_target_data_model","Target State","Target Data Model",["entity_id","entity_name","entity_type","description","attributes","relationships"]),
  ("05_04_target_governance_model","Target State","Target Governance Model",["gov_model_id","governance_element","current_state","target_state","rationale","transition_approach"]),
  ("05_05_target_operating_model","Target State","Target Operating Model",["om_id","operating_model_component","current_description","target_description","gap_analysis"]),
  ("05_06_target_data_domain_model","Target State","Target Data Domain Model",["domain_model_id","domain_name","entities_covered","governance_approach","steward_role"]),
  ("06_01_initiative_registry","Roadmap","Initiative Registry",["initiative_id","initiative_name","description","wave","phase","status","priority","estimated_effort_days","start_date","end_date","budget_usd","owner_role"]),
  ("06_02_initiative_dependency","Roadmap","Initiative Dependency",["dependency_id","initiative_id","depends_on_initiative_id","dependency_type","criticality"]),
  ("06_03_transition_state_model","Roadmap","Transition State Model",["transition_id","transition_name","from_state","to_state","activities","validation_criteria"]),
  ("06_04_value_stream_mapping","Roadmap","Value Stream Mapping",["vsm_id","value_stream_name","current_state_steps","target_state_steps","improvement_areas","expected_benefits"]),
  ("07_01_governance_structure","Operating Model","Governance Structure",["gov_id","governance_body","role_name","responsibilities","meeting_frequency","decision_authority"]),
  ("07_02_data_policy_framework","Operating Model","Data Policy Framework",["policy_id","policy_name","policy_statement","scope","enforcement","owner","review_frequency"]),
  ("07_03_data_stewardship_model","Operating Model","Data Stewardship Model",["steward_id","steward_name","domain_responsibility","steward_type","responsibilities","escalation_path"]),
  ("07_04_metadata_management_model","Operating Model","Metadata Management Model",["metadata_id","metadata_type","current_state","target_state","tool_support","owner"]),
  ("07_05_data_quality_standards","Operating Model","Data Quality Standards",["standard_id","quality_dimension","standard_statement","measurement_method","tolerance_threshold"]),
  ("08_01_cost_estimation","Business Case","Cost Estimation",["cost_id","initiative_id","cost_category","cost_element","year_1_usd","year_2_usd","year_3_usd","total_usd"]),
  ("08_02_benefit_estimation","Business Case","Benefit Estimation",["benefit_id","initiative_id","benefit_name","benefit_category","benefit_type","year_1_usd","year_2_usd","year_3_usd","total_usd"]),
  ("08_03_roi_summary","Business Case","ROI Summary",["scenario_id","scenario_name","total_investment_3yr","total_benefit_3yr","net_benefit_3yr","roi_pct","payback_period"]),
  ("08_04_investment_by_wave","Business Case","Investment by Wave",["wave_id","wave_name","wave_horizon","total_initiatives","total_investment_usd","total_expected_benefit_usd","net_value_usd"]),
  ("09_01_risk_register","Risk & KPIs","Risk Register",["risk_id","risk_title","risk_category","probability","impact","risk_score","risk_level","mitigation_strategy","owner_role","status"]),
  ("09_02_kpi_framework","Risk & KPIs","KPI Framework",["kpi_id","kpi_name","kpi_type","kpi_category","measurement_formula","measurement_unit","baseline_value","target_value_12m","owner_role","measurement_frequency"]),
  ("09_03_change_management_plan","Risk & KPIs","Change Management Plan",["change_id","stakeholder_group","change_description","impact_severity","resistance_level","engagement_activities","training_required","owner_role","status"]),
  ("09_04_benefits_realization_tracker","Risk & KPIs","Benefits Realization Tracker",["tracking_id","benefit_id","initiative_id","benefit_name","benefit_owner_role","baseline_value","target_value","period_1_actual","on_track"]),
  ("00_01_engagement_metadata","Master","Engagement Metadata",["field","value"]),
  ("00_02_file_registry","Master","File Registry",["file_id","file_name","workstream_code","workstream_name","phase","purpose","primary_user","status","version"]),
  ("00_03_glossary","Master","Glossary",["term_id","term","definition","domain","source","approved_by"]),
  ("00_04_decision_log","Master","Decision Log",["decision_id","decision_date","category","description","rationale","made_by","status"]),
  ("00_05_assumption_log","Master","Assumption Log",["assumption_id","description","category","basis","confidence","owner","status"]),
]

# Build TABLES array
t_rows = []
for t in tables:
    flds = "[" + ",".join(f'"{x}"' for x in t[3]) + "]"
    t_rows.append(f'{{i:"{t[0]}",g:"{t[1]}",n:"{t[2]}",f:{flds}}}')
tables_str = "[" + ",".join(t_rows) + "]"

with open("data_full.tsx", "w") as f:
    f.write("// Auto-generated 46 tables\\n")
    f.write(f"const TABLES = {tables_str};\\n")
    f.write(f"export default TABLES;\\n")
    f.write(f"export const TABLE_COUNT = {len(tables)};\\n")
print(f"Generated {len(tables)} tables")
