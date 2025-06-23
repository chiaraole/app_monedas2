from fastapi import FastAPI
from auth import router as auth_router
from users import router as user_router
from transactions import router as transaction_router
from conversion import router as conversion_router
from linked_accounts import router as linked_router
from dashboard import router as dashboard_router
from export_data import router as export_router
from monedas_disponibles import router as monedas_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API de Monedas")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(transaction_router, prefix="/transactions", tags=["transactions"])
app.include_router(conversion_router, tags=["conversion"])
app.include_router(linked_router, prefix="/linked", tags=["linked accounts"])
app.include_router(dashboard_router, tags=["dashboard"])
app.include_router(export_router, tags=["exportación"])
app.include_router(monedas_router, tags=["monedas"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

