# Copilot Instructions for `tp-soap`

## Build, test, and lint
- **Install dependencies:** `npm install`
- **Build:** No build script is defined in `package.json`.
- **Lint:** No lint script or lint config is present.
- **Test suite:** `npm test` exists but is currently a placeholder script that exits with an error (`"Error: no test specified"`).
- **Run server locally:** `node server.js`
- **Run client locally:** `node client.js`
- **Run a single test:** No test framework or single-test command is configured in this repository.

## High-level architecture
- This project is a **contract-first SOAP calculator**.
- `calculator.wsdl` is the source contract: it defines `CalculatorService`, `CalculatorPort`, and the four operations (`Add`, `Subtract`, `Multiply`, `Divide`) with request/response schemas.
- `server.js` loads the WSDL from disk, starts an Express server on port `8000`, and mounts SOAP with `soap.listen(app, '/calculator', calculatorService, wsdl)`.
- `calculatorService` in `server.js` is the runtime implementation of WSDL operations. Each method returns `{ result: <number> }`.
- `client.js` consumes the live WSDL at `http://localhost:8000/calculator?wsdl`, then calls `AddAsync`, `SubtractAsync`, `MultiplyAsync`, and `DivideAsync`.

## Key conventions in this codebase
- Keep WSDL and implementation names aligned:
  - WSDL service/port/operation names must match the nested object keys in `server.js` (`CalculatorService -> CalculatorPort -> Operation`).
- Endpoint consistency matters:
  - The SOAP address is declared in `calculator.wsdl` (`http://localhost:8000/calculator`) and the client WSDL URL is hardcoded in `client.js`; update both together if host/port/path changes.
- Numeric input handling:
  - Service methods use `parseFloat(args.a)` and `parseFloat(args.b)` before computing.
- SOAP fault shape is explicit:
  - Division by zero throws a SOAP-style fault object with `Fault.Code.Value` and `Fault.Reason.Text`; client-side error handling reads nested SOAP fault fields (`error.root?.Envelope?.Body?.Fault...`).
