const soap = require('soap');
const WSDL_URL = 'http://localhost:8000/calculator?wsdl';
async function main() {
 try {
 // Créer le client SOAP
 const client = await soap.createClientAsync(WSDL_URL);

 console.log('✅ Client SOAP connecté !');
 console.log('🚀 Opérations disponibles:',
Object.keys(client.CalculatorService.CalculatorPort));
 console.log('\n--- Tests des opérations ---\n');
 // Test Addition
 const addResult = await client.AddAsync({ a: 10, b: 5 });
 console.log(`Addition: 10 + 5 = ${addResult[0].result}`);
 // Test Soustraction
 const subResult = await client.SubtractAsync({ a: 10, b: 3 });
 console.log(`Soustraction: 10 - 3 = ${subResult[0].result}`);
 // Test Multiplication
 const mulResult = await client.MultiplyAsync({ a: 4, b: 7 });
 console.log(`Multiplication: 4 × 7 = ${mulResult[0].result}`);
 // Test Division
 const divResult = await client.DivideAsync({ a: 20, b: 4 });
 console.log(`Division: 20 ÷ 4 = ${divResult[0].result}`);
 // Test Division par zéro (erreur)
 console.log('\n--- Test erreur: Division par zéro ---');
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