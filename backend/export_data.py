# backend/export_data.py
from fastapi import APIRouter, Depends, Response, HTTPException, Query
from auth import get_current_user
from database import HISTORY
import csv
import xml.etree.ElementTree as ET
from xml.dom import minidom
from io import StringIO

router = APIRouter()

@router.get("/export")
def export_data(
    formato: str = Query(..., enum=["csv", "xml"]),
    user: str = Depends(get_current_user)
):
    historial = HISTORY.get(user, [])
    if not historial:
        raise HTTPException(status_code=404, detail="No hay datos para exportar")

    if formato == "csv":
        return export_csv(historial)
    else:
        return export_xml(historial)


def export_csv(data):
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "from_user", "to_user", "amount", "from_currency",
        "to_currency", "converted", "rate"
    ])
    writer.writeheader()
    for row in data:
        writer.writerow(row)

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=historial.csv"}
    )


def export_xml(data):
    root = ET.Element("historial")
    for row in data:
        trans = ET.SubElement(root, "transaccion")

        ET.SubElement(trans, "remitente").text = row["from_user"]
        ET.SubElement(trans, "destinatario").text = row["to_user"]
        ET.SubElement(trans, "monto_enviado").text = f"{row['amount']} {row['from_currency']}"
        ET.SubElement(trans, "monto_recibido").text = f"{row['converted']} {row['to_currency']}"
        ET.SubElement(trans, "tasa_de_cambio").text = str(row["rate"])

    xml_str = ET.tostring(root, encoding='unicode')
    xml_pretty = minidom.parseString(xml_str).toprettyxml(indent="  ")

    return Response(
        content=xml_pretty,
        media_type="application/xml",
        headers={"Content-Disposition": "attachment; filename=historial.xml"}
    )