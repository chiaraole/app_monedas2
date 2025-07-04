
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
```

### 2. Ejecutar el Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

El backend estará disponible en:
📎 http://localhost:8000/docs

> Requiere tener un archivo `users.json` vacío o precargado en la raíz del backend.

### 3. Ejecutar el Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación se abrirá en:
🌐 http://localhost:5173

---

## 🧪 Pruebas

### ✅ Pruebas automatizadas

Para ejecutar los tests y ver la cobertura:

```bash
PYTHONPATH=backend pytest --cov=backend --cov-report=term-missing
```

### ✅ Pruebas de rendimiento con Apache JMeter

1. Abrir Apache JMeter.
2. Cargar el archivo `jmeter/monedas_test_plan.jmx`.
3. Presionar "Start" para ejecutar pruebas simultáneas (hasta 1000 usuarios).
4. Revisar respuestas, errores y tiempos en "Tree View" o "Summary Report".

---

## 🧠 Estructura del Proyecto

- `/backend`: Lógica del servidor FastAPI y almacenamiento en archivos `.json`.
- `/frontend`: Interfaz de usuario en React.
- `/tests`: Pruebas automatizadas con `pytest`.
- `/jmeter`: Planes de prueba para rendimiento.

---

## 🔐 Prueba rápida con `curl`

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "chiara", "password": "1234"}'
```

### Transferir con conversión

```bash
curl -X POST http://localhost:8000/transactions/send \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{"to_user":"luis","amount":100,"from_currency":"USD","to_currency":"PEN"}'
```

### Exportar historial

```bash
curl -X GET "http://localhost:8000/export?formato=csv" \
-H "Authorization: Bearer <TOKEN>" -OJ
```

---

## 📤 Exportar historial

Puedes exportar tu historial en dos formatos:
- CSV → `/export?formato=csv`
- XML → `/export?formato=xml`

---

## 🧹 Reiniciar base de datos

Para limpiar todos los datos y empezar de cero, elimina estos archivos desde `/backend`:

```bash
rm users.json history.json linked_accounts.json
```
