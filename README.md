# 💱 Koink - Sistema de Intercambio de Monedas

**Koink** es una aplicación web completa que permite a los usuarios:

- Registrarse e iniciar sesión
- Visualizar sus saldos en múltiples monedas
- Realizar transferencias con conversión de divisas
- Afiliar cuentas bancarias externas
- Recargar y transferir a cuentas afiliadas
- Convertir entre sus propias monedas
- Consultar historial de operaciones
- Exportar historial en formato CSV o XML
- Alternar entre modo claro y modo oscuro

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/chiaraole/app_monedas2.git
cd app_monedas2

2. Ejecutar el Backend

Primero, entra a la carpeta backend/ e instala las dependencias necesarias:

cd backend
pip install fastapi uvicorn requests

Luego, ejecuta el servidor:

uvicorn main:app --reload

El backend estará disponible en:
📎 http://localhost:8000/docs

3. Ejecutar el Frontend

Asegúrate de estar dentro de la carpeta del frontend y luego ejecuta:

npm install
npm run dev

La aplicación se abrirá en:
🌐 http://localhost:5173

⸻

🧠 Estructura del Proyecto

<img width="303" alt="Screenshot 2025-06-23 at 12 48 33 PM" src="https://github.com/user-attachments/assets/c2944485-44c0-49fd-bfcd-c0ec1a693ad8" />


⸻

🔐 Prueba rápida con curl

Login

curl -X POST http://localhost:8000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "chiara", "password": "1234"}'

Transferir con conversión

curl -X POST http://localhost:8000/transactions/send \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{"to_user":"luis","amount":100,"from_currency":"USD","to_currency":"PEN"}'

Exportar historial

curl -X GET "http://localhost:8000/export?formato=csv" \
-H "Authorization: Bearer <TOKEN>" -OJ


⸻

📤 Exportar historial

Puedes exportar tu historial en dos formatos:
	•	CSV (/export?formato=csv)
	•	XML (/export?formato=xml)

Esto genera una descarga automática del archivo con el historial del usuario autenticado.

⸻

🧹 Reiniciar base de datos

Para limpiar todos los datos y empezar de cero, puedes eliminar estos archivos desde la raíz del backend:

rm users.json history.json linked_accounts.json

⸻

🖼️ Capturas del proyecto

![Dashboard](assets/dashboard-dark.png)
![Historial](assets/historial.png)
![Conversor](assets/conversor.png)
