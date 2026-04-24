const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Implémentation des opérations du service
const calculatorService = {
  CalculatorService: {
    CalculatorPort: {

      // Opération Addition
      Add: function (args) {
        const result = parseFloat(args.a) + parseFloat(args.b);
        console.log(`Add: ${args.a} + ${args.b} = ${result}`);
        return { result };
      },

      // Opération Soustraction
      Subtract: function (args) {
        const result = parseFloat(args.a) - parseFloat(args.b);
        console.log(`Subtract: ${args.a} - ${args.b} = ${result}`);
        return { result };
      },

      // Opération Multiplication
      Multiply: function (args) {
        const result = parseFloat(args.a) * parseFloat(args.b);
        console.log(`Multiply: ${args.a} * ${args.b} = ${result}`);
        return { result };
      },

      // Opération Division
      Divide: function (args) {
        if (parseFloat(args.b) === 0) {
          throw {
            Fault: {
              Code: { Value: 'DIVIDE_BY_ZERO' },
              Reason: { Text: 'Division par zéro impossible' }
            }
          };
        }
        const result = parseFloat(args.a) / parseFloat(args.b);
        console.log(`Divide: ${args.a} / ${args.b} = ${result}`);
        return { result };
      },

      // ─── Exercice 1 : Modulo ───────────────────────────────────────────────
      Modulo: function (args) {
        const a = parseFloat(args.a);
        const b = parseFloat(args.b);

        if (b === 0) {
          throw {
            Fault: {
              Code: { Value: 'MODULO_BY_ZERO' },
              Reason: { Text: 'Le modulo par zéro est impossible' }
            }
          };
        }

        const result = a % b;
        console.log(`Modulo: ${a} % ${b} = ${result}`);
        return { result };
      },

      // ─── Exercice 2 : Power ────────────────────────────────────────────────
      Power: function (args) {
        const a = parseFloat(args.a);
        const b = parseFloat(args.b);

        // Cas particulier : 0^0 est mathématiquement indéfini
        if (a === 0 && b === 0) {
          throw {
            Fault: {
              Code: { Value: 'INDETERMINATE_FORM' },
              Reason: { Text: '0 puissance 0 est une forme indéterminée' }
            }
          };
        }

        // Exposant négatif autorisé (résultat décimal), ex : 2^-3 = 0.125
        const result = Math.pow(a, b);
        console.log(`Power: ${a} ^ ${b} = ${result}`);
        return { result };
      }
    }
  }
};

// Lire le fichier WSDL
const wsdlPath = path.join(__dirname, 'calculator.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

// Démarrer le serveur
app.listen(PORT, function () {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

  const server = soap.listen(app, '/calculator', calculatorService, wsdl);
  console.log(`📄 WSDL disponible sur http://localhost:${PORT}/calculator?wsdl`);

  server.log = function (type, data) {
    console.log(`[${type}]`, data);
  };
});