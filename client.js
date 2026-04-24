const soap = require('soap');

const WSDL_URL = 'http://localhost:8000/calculator?wsdl';

async function main() {
  try {
    const client = await soap.createClientAsync(WSDL_URL);
    console.log('✅ Client SOAP connecté !');
    console.log('🚀 Opérations disponibles:',
      Object.keys(client.CalculatorService.CalculatorPort));
    console.log('\n--- Tests des opérations de base ---\n');

    const addResult = await client.AddAsync({ a: 10, b: 5 });
    console.log(`Addition      : 10 + 5  = ${addResult[0].result}`);

    const subResult = await client.SubtractAsync({ a: 10, b: 3 });
    console.log(`Soustraction  : 10 - 3  = ${subResult[0].result}`);

    const mulResult = await client.MultiplyAsync({ a: 4, b: 7 });
    console.log(`Multiplication: 4  × 7  = ${mulResult[0].result}`);

    const divResult = await client.DivideAsync({ a: 20, b: 4 });
    console.log(`Division      : 20 ÷ 4  = ${divResult[0].result}`);

    // ─── Exercice 1 : Modulo ─────────────────────────────────────────────────
    console.log('\n--- Exercice 1 : Modulo ---\n');

    const mod1 = await client.ModuloAsync({ a: 17, b: 5 });
    console.log(`Modulo : 17 % 5  = ${mod1[0].result}`);   // attendu : 2

    const mod2 = await client.ModuloAsync({ a: 100, b: 30 });
    console.log(`Modulo : 100 % 30 = ${mod2[0].result}`);  // attendu : 10

    console.log('\n--- Test erreur : Modulo par zéro ---');
    try {
      await client.ModuloAsync({ a: 10, b: 0 });
    } catch (error) {
      console.log('❌ Erreur capturée:',
        error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message);
    }

    // ─── Exercice 2 : Power ──────────────────────────────────────────────────
    console.log('\n--- Exercice 2 : Power ---\n');

    const pow1 = await client.PowerAsync({ a: 2, b: 10 });
    console.log(`Puissance : 2  ^ 10 = ${pow1[0].result}`);  // attendu : 1024

    const pow2 = await client.PowerAsync({ a: 3, b: 3 });
    console.log(`Puissance : 3  ^ 3  = ${pow2[0].result}`);  // attendu : 27

    const pow3 = await client.PowerAsync({ a: 2, b: -3 });
    console.log(`Puissance : 2  ^ -3 = ${pow3[0].result}`);  // attendu : 0.125

    console.log('\n--- Test erreur : 0^0 ---');
    try {
      await client.PowerAsync({ a: 0, b: 0 });
    } catch (error) {
      console.log('❌ Erreur capturée:',
        error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message);
    }

    // ─── Test erreur existant : Division par zéro ────────────────────────────
    console.log('\n--- Test erreur : Division par zéro ---');
    try {
      await client.DivideAsync({ a: 10, b: 0 });
    } catch (error) {
      console.log('❌ Erreur capturée:',
        error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message);
    }

  } catch (error) {
    console.error('Erreur de connexion:', error.message);
  }
}

main();