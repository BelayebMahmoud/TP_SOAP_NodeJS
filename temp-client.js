const soap = require('soap');

const WSDL_URL = 'http://localhost:9000/temperature?wsdl';

// Petite fonction utilitaire pour capturer les erreurs SOAP proprement
function getFaultMessage(error) {
  return error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message;
}

async function main() {
  try {
    const client = await soap.createClientAsync(WSDL_URL);
    console.log('✅ Client SOAP TemperatureService connecté !');
    console.log('🚀 Opérations disponibles:',
      Object.keys(client.TemperatureService.TemperaturePort));

    // ─── CelsiusToFahrenheit ─────────────────────────────────────────────────
    console.log('\n--- CelsiusToFahrenheit (F = C × 9/5 + 32) ---\n');

    const c2f1 = await client.CelsiusToFahrenheitAsync({ value: 0 });
    console.log(`   0°C  →  ${c2f1[0].result}°F   (attendu : 32)`);

    const c2f2 = await client.CelsiusToFahrenheitAsync({ value: 100 });
    console.log(` 100°C  →  ${c2f2[0].result}°F  (attendu : 212)`);

    const c2f3 = await client.CelsiusToFahrenheitAsync({ value: -40 });
    console.log(` -40°C  →  ${c2f3[0].result}°F  (attendu : -40, point d'égalité)`);

    const c2f4 = await client.CelsiusToFahrenheitAsync({ value: 37 });
    console.log(`  37°C  →  ${c2f4[0].result}°F  (température du corps humain)`);

    // ─── FahrenheitToCelsius ─────────────────────────────────────────────────
    console.log('\n--- FahrenheitToCelsius (C = (F - 32) × 5/9) ---\n');

    const f2c1 = await client.FahrenheitToCelsiusAsync({ value: 32 });
    console.log(`  32°F  →  ${f2c1[0].result}°C   (attendu : 0)`);

    const f2c2 = await client.FahrenheitToCelsiusAsync({ value: 212 });
    console.log(` 212°F  →  ${f2c2[0].result}°C  (attendu : 100)`);

    const f2c3 = await client.FahrenheitToCelsiusAsync({ value: 98.6 });
    console.log(` 98.6°F →  ${f2c3[0].result.toFixed(4)}°C  (température du corps humain)`);

    // ─── CelsiusToKelvin ─────────────────────────────────────────────────────
    console.log('\n--- CelsiusToKelvin (K = C + 273.15) ---\n');

    const c2k1 = await client.CelsiusToKelvinAsync({ value: 0 });
    console.log(`   0°C  →  ${c2k1[0].result} K   (attendu : 273.15)`);

    const c2k2 = await client.CelsiusToKelvinAsync({ value: 100 });
    console.log(` 100°C  →  ${c2k2[0].result} K  (attendu : 373.15)`);

    const c2k3 = await client.CelsiusToKelvinAsync({ value: -273.15 });
    console.log(`-273.15°C →  ${c2k3[0].result} K  (zéro absolu → 0 K)`);

    // ─── Tests d'erreur ───────────────────────────────────────────────────────
    console.log('\n--- Tests d\'erreur : température sous le zéro absolu ---\n');

    try {
      await client.CelsiusToFahrenheitAsync({ value: -300 });
    } catch (error) {
      console.log('❌ CelsiusToFahrenheit(-300) →', getFaultMessage(error));
    }

    try {
      await client.FahrenheitToCelsiusAsync({ value: -500 });
    } catch (error) {
      console.log('❌ FahrenheitToCelsius(-500) →', getFaultMessage(error));
    }

    try {
      await client.CelsiusToKelvinAsync({ value: -300 });
    } catch (error) {
      console.log('❌ CelsiusToKelvin(-300)    →', getFaultMessage(error));
    }

  } catch (error) {
    console.error('Erreur de connexion:', error.message);
  }
}

main();