from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
import sqlite3
import json
from contextlib import asynccontextmanager
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "command_center.db")

# Table schemas for all 46 datasets
SCHEMAS = {
    "engagement_metadata": [
        {"name": "field", "type": "TEXT", "pk": True},
        {"name": "value", "type": "TEXT", "pk": False},
    ],
    "stakeholder_registry": [
        {"name": "id", "type": "TEXT", "pk": True},
        {"name": "full_name", "type": "TEXT", "pk": False},
        {"name": "title", "type": "TEXT", "pk": False},
        {"name": "department", "type": "TEXT", "pk": False},
        {"name": "level", "type": "TEXT", "pk": False},
        {"name": "data_role", "type": "TEXT", "pk": False},
        {"name": "engagement_relevance", "type": "TEXT", "pk": False},
        {"name": "interview_priority", "type": "TEXT", "pk": False},
        {"name": "interview_status", "type": "TEXT", "pk": False},
        {"name": "influence_level", "type": "TEXT", "pk": False},
        {"name": "attitude_toward_change", "type": "TEXT", "pk": False},
        {"name": "notes", "type": "TEXT", "pk": False},
    ],
    "use_case_longlist": [
        {"name": "use_case_id", "type": "TEXT", "pk": True},
        {"name": "use_case_name", "type": "TEXT", "pk": False},
        {"name": "use_case_description", "type": "TEXT", "pk": False},
        {"name": "use_case_type", "type": "TEXT", "pk": False},
        {"name": "business_domain", "type": "TEXT", "pk": False},
        {"name": "problem_statement", "type": "TEXT", "pk": False},
        {"name": "expected_business_outcome", "type": "TEXT", "pk": False},
        {"name": "preliminary_feasibility", "type": "TEXT", "pk": False},
        {"name": "preliminary_strategic_alignment", "type": "TEXT", "pk": False},
        {"name": "shortlist_candidate", "type": "TEXT", "pk": False},
        {"name": "reason_if_excluded", "type": "TEXT", "pk": False},
        {"name": "notes", "type": "TEXT", "pk": False},
    ],
    "initiative_registry": [
        {"name": "initiative_id", "type": "TEXT", "pk": True},
        {"name": "initiative_name", "type": "TEXT", "pk": False},
        {"name": "description", "type": "TEXT", "pk": False},
        {"name": "wave", "type": "TEXT", "pk": False},
        {"name": "priority", "type": "TEXT", "pk": False},
        {"name": "status", "type": "TEXT", "pk": False},
        {"name": "estimated_cost_usd", "type": "REAL", "pk": False},
        {"name": "start_date", "type": "TEXT", "pk": False},
        {"name": "end_date", "type": "TEXT", "pk": False},
        {"name": "owner_role", "type": "TEXT", "pk": False},
        {"name": "linked_use_case_ids", "type": "TEXT", "pk": False},
        {"name": "notes", "type": "TEXT", "pk": False},
    ],
    "gap_register": [
        {"name": "gap_id", "type": "TEXT", "pk": True},
        {"name": "gap_title", "type": "TEXT", "pk": False},
        {"name": "gap_description", "type": "TEXT", "pk": False},
        {"name": "gap_category", "type": "TEXT", "pk": False},
        {"name": "severity", "type": "TEXT", "pk": False},
        {"name": "impact", "type": "TEXT", "pk": False},
        {"name": "linked_source_ids", "type": "TEXT", "pk": False},
        {"name": "linked_initiative_ids", "type": "TEXT", "pk": False},
        {"name": "priority", "type": "TEXT", "pk": False},
        {"name": "status", "type": "TEXT", "pk": False},
        {"name": "notes", "type": "TEXT", "pk": False},
    ],
    "kpi_framework": [
        {"name": "kpi_id", "type": "TEXT", "pk": True},
        {"name": "kpi_name", "type": "TEXT", "pk": False},
        {"name": "kpi_type", "type": "TEXT", "pk": False},
        {"name": "kpi_category", "type": "TEXT", "pk": False},
        {"name": "kpi_description", "type": "TEXT", "pk": False},
        {"name": "measurement_formula", "type": "TEXT", "pk": False},
        {"name": "measurement_unit", "type": "TEXT", "pk": False},
        {"name": "baseline_value", "type": "REAL", "pk": False},
        {"name": "target_value_6m", "type": "REAL", "pk": False},
        {"name": "target_value_12m", "type": "REAL", "pk": False},
        {"name": "target_value_24m", "type": "REAL", "pk": False},
        {"name": "target_value_36m", "type": "REAL", "pk": False},
        {"name": "measurement_frequency", "type": "TEXT", "pk": False},
        {"name": "owner_role", "type": "TEXT", "pk": False},
        {"name": "status", "type": "TEXT", "pk": False},
        {"name": "notes", "type": "TEXT", "pk": False},
    ],
    "risk_register": [
        {"name": "risk_id", "type": "TEXT", "pk": True},
        {"name": "risk_title", "type": "TEXT", "pk": False},
        {"name": "risk_description", "type": "TEXT", "pk": False},
        {"name": "risk_category", "type": "TEXT", "pk": False},
        {"name": "probability", "type": "TEXT", "pk": False},
        {"name": "impact", "type": "TEXT", "pk": False},
        {"name": "risk_score", "type": "INTEGER", "pk": False},
        {"name": "risk_level", "type": "TEXT", "pk": False},
        {"name": "mitigation_strategy", "type": "TEXT", "pk": False},
        {"name": "mitigation_owner_role", "type": "TEXT", "pk": False},
        {"name": "contingency_plan", "type": "TEXT", "pk": False},
        {"name": "risk_owner_role", "type": "TEXT", "pk": False},
        {"name": "status", "type": "TEXT", "pk": False},
        {"name": "notes", "type": "TEXT", "pk": False},
    ],
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    for table, columns in SCHEMAS.items():
        cols = ", ".join([f"{c['name']} {c['type']}" + (" PRIMARY KEY" if c["pk"] else "") for c in columns])
        cursor.execute(f"CREATE TABLE IF NOT EXISTS {table} ({cols})")
    conn.commit()
    conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Data Command Center API", version="1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Record(BaseModel):
    data: Dict[str, Any]

class BulkRecord(BaseModel):
    records: List[Dict[str, Any]]

@app.get("/")
async def root():
    return {"status": "ok", "tables": list(SCHEMAS.keys())}

@app.get("/tables")
async def list_tables():
    return {"tables": [{"name": t, "columns": len(SCHEMAS[t])} for t in SCHEMAS]}

@app.get("/tables/{table}")
async def get_records(table: str, limit: int = 100, offset: int = 0):
    if table not in SCHEMAS:
        raise HTTPException(status_code=404, detail="Table not found")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table} LIMIT ? OFFSET ?", (limit, offset))
    rows = cursor.fetchall()
    cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
    total = cursor.fetchone()["count"]
    conn.close()
    return {"table": table, "records": [dict(r) for r in rows], "total": total, "limit": limit, "offset": offset}

@app.post("/tables/{table}")
async def create_record(table: str, record: Record):
    if table not in SCHEMAS:
        raise HTTPException(status_code=404, detail="Table not found")
    conn = get_db()
    cursor = conn.cursor()
    columns = [c["name"] for c in SCHEMAS[table]]
    placeholders = ", ".join(["?" for _ in columns])
    values = [record.data.get(c, None) for c in columns]
    try:
        cursor.execute(f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})", values)
        conn.commit()
        result = dict(cursor.execute(f"SELECT * FROM {table} WHERE rowid = ?", (cursor.lastrowid,)).fetchone())
        conn.close()
        return {"success": True, "record": result}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/tables/{table}/{pk_value}")
async def update_record(table: str, pk_value: str, record: Record):
    if table not in SCHEMAS:
        raise HTTPException(status_code=404, detail="Table not found")
    pk_col = next(c["name"] for c in SCHEMAS[table] if c["pk"])
    conn = get_db()
    cursor = conn.cursor()
    updates = ", ".join([f"{c} = ?" for c in record.data.keys()])
    values = [record.data[c] for c in record.data.keys()]
    try:
        cursor.execute(f"UPDATE {table} SET {updates} WHERE {pk_col} = ?", values + [pk_value])
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            raise HTTPException(status_code=404, detail="Record not found")
        result = dict(cursor.execute(f"SELECT * FROM {table} WHERE {pk_col} = ?", (pk_value,)).fetchone())
        conn.close()
        return {"success": True, "record": result}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/tables/{table}/{pk_value}")
async def delete_record(table: str, pk_value: str):
    if table not in SCHEMAS:
        raise HTTPException(status_code=404, detail="Table not found")
    pk_col = next(c["name"] for c in SCHEMAS[table] if c["pk"])
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM {table} WHERE {pk_col} = ?", (pk_value,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    if affected == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"success": True, "deleted": affected}

@app.post("/import/{table}")
async def import_records(table: str, bulk: BulkRecord):
    if table not in SCHEMAS:
        raise HTTPException(status_code=404, detail="Table not found")
    conn = get_db()
    cursor = conn.cursor()
    columns = [c["name"] for c in SCHEMAS[table]]
    placeholders = ", ".join(["?" for _ in columns])
    imported = 0
    for record in bulk.records:
        values = [record.get(c, None) for c in columns]
        try:
            cursor.execute(f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})", values)
            imported += 1
        except:
            pass
    conn.commit()
    conn.close()
    return {"success": True, "imported": imported, "total": len(bulk.records)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3456)
