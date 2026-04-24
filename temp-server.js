const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 9000;

// ─── Formules de conversion ───────────────────────────────────────────────────
//  F = C × 9/5 + 32
//  C = (F - 32) × 5/9
//  K = C + 273.15
// ─────────────────────────────────────────────────────────────────────────────

const ABSOLUTE_ZERO_C = -273.15; // Le zéro absolu en Celsius

const temperatureService = {
  TemperatureService: {
    TemperaturePort: {

      // Celsius → Fahrenheit
      CelsiusToFahrenheit: function (args) {
        const celsius = parseFloat(args.value);

        if (celsius < ABSOLUTE_ZERO_C) {
          throw {
            Fault: {
              Code: { Value: 'BELOW_ABSOLUTE_ZERO' },
              Reason: { Text: `La température ${celsius}°C est inférieure au zéro absolu (${ABSOLUTE_ZERO_C}°C)` }
            }
          };
        }

        const result = celsius * 9 / 5 + 32;
        console.log(`CelsiusToFahrenheit: ${celsius}°C → ${result.toFixed(4)}°F`);
        return { result };
      },

      // Fahrenheit → Celsius
      FahrenheitToCelsius: function (args) {
        const fahrenheit = parseFloat(args.value);
        const ABSOLUTE_ZERO_F = ABSOLUTE_ZERO_C * 9 / 5 + 32; // -459.67°F

        if (fahrenheit < ABSOLUTE_ZERO_F) {
          throw {
            Fault: {
              Code: { Value: 'BELOW_ABSOLUTE_ZERO' },
              Reason: { Text: `La température ${fahrenheit}°F est inférieure au zéro absolu (${ABSOLUTE_ZERO_F.toFixed(2)}°F)` }
            }
          };
        }

        const result = (fahrenheit - 32) * 5 / 9;
        console.log(`FahrenheitToCelsius: ${fahrenheit}°F → ${result.toFixed(4)}°C`);
        return { result };
      },

      // Celsius → Kelvin
      CelsiusToKelvin: function (args) {
        const celsius = parseFloat(args.value);

        if (celsius < ABSOLUTE_ZERO_C) {
          throw {
            Fault: {
              Code: { Value: 'BELOW_ABSOLUTE_ZERO' },
              Reason: { Text: `La température ${celsius}°C est inférieure au zéro absolu (${ABSOLUTE_ZERO_C}°C)` }
            }
          };
        }

        const result = celsius + 273.15;
        console.log(`CelsiusToKelvin: ${celsius}°C → ${result.toFixed(4)} K`);
        return { result };
      }

    }
  }
};

// Lire le fichier WSDL
const wsdlPath = path.join(__dirname, 'temperature.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

// Démarrer le serveur
app.listen(PORT, function () {
  console.log(`🌡️  Serveur TemperatureService démarré sur http://localhost:${PORT}`);

  const server = soap.listen(app, '/temperature', temperatureService, wsdl);
  console.log(`📄 WSDL disponible sur http://localhost:${PORT}/temperature?wsdl`);

  server.log = function (type, data) {
    console.log(`[${type}]`, data);
  };
});