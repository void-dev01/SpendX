# SPENDX REST API Specification

**Base URL**: `http://localhost:5000/api/v1`

## Headers
- `Content-Type: application/json`
- `Authorization: Bearer <SUPABASE_JWT_TOKEN>`

## Endpoints

### 1. System Health
- **`GET /health`**
  - Description: Returns API uptime, status, and external integration health.
  - Auth: Public.
  - Response (200 OK):
    ```json
    {
      "success": true,
      "message": "SPENDX Core API is operational",
      "data": {
        "service": "spendx-backend",
        "timestamp": "2026-11-14T04:24:54.000Z",
        "uptime": 124.5,
        "integrations": {
          "supabaseConfigured": false,
          "geminiConfigured": false
        }
      }
    }
    ```

### 2. Transactions
- **`POST /transactions`**
  - Description: Ingests a new transaction record after validating duplicate constraints.
  - Auth: Required (`Bearer <token>`).
  - Request Body:
    ```json
    {
      "accountId": "a3b2c1d0-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
      "amount": 42.50,
      "type": "EXPENSE",
      "category": "Groceries",
      "description": "Trader Joe's Market",
      "date": "2026-11-14T10:00:00.000Z",
      "merchantName": "Trader Joe's",
      "isRecurring": false
    }
    ```
  - Response (201 Created):
    ```json
    {
      "success": true,
      "message": "Transaction recorded successfully",
      "data": {
        "id": "txn_1731557999000",
        "userId": "usr_998811",
        "amount": 42.50,
        "type": "EXPENSE",
        "category": "Groceries",
        "description": "Trader Joe's Market"
      }
    }
    ```
  - Error (409 Conflict):
    ```json
    {
      "success": false,
      "message": "Potential duplicate transaction detected within 24-hour window"
    }
    ```

### 3. AI Coach & Intelligence
- **`GET /ai/insights`**
  - Description: Delivers heuristic or Gemini-driven financial optimization tips.
  - Rate Limit: 30 requests / 15 minutes.
  - Auth: Required.

- **`POST /ai/coach`**
  - Description: Natural language prompt evaluated against the SPENDX financial intelligence model.
  - Request Body:
    ```json
    {
      "query": "How much can I safely save towards my emergency fund this month?"
    }
    ```
  - Response (200 OK):
    ```json
    {
      "success": true,
      "data": {
        "answer": "Based on your current monthly burn rate, an allocation of $350 ensures liquidity while maintaining target reserve growth."
      }
    }
    ```
