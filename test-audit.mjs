import fs from 'fs';
import path from 'path';
import { interpretQuality } from './src/services/networkService.js';
import { buildDataContract } from './src/services/apiService.js';

console.log('🧪 === INICIANDO AUDITORÍA AUTOMATIZADA DE FUNCIONALIDADES ===\n');

// 1. Auditoría del Build de Producción
console.log('1. Verificando artefactos de producción en ./dist...');
const distPath = path.resolve('./dist');
if (!fs.existsSync(distPath)) {
  throw new Error('❌ Error: Directorio ./dist no existe. El build falló.');
}

const distFiles = fs.readdirSync(distPath);
if (!distFiles.includes('index.html')) {
  throw new Error('❌ Error: index.html no encontrado en ./dist.');
}
console.log('   ✅ dist/index.html existe.');

const assetsPath = path.join(distPath, 'assets');
const assetFiles = fs.readdirSync(assetsPath);
const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
const cssFiles = assetFiles.filter(f => f.endsWith('.css'));

if (jsFiles.length === 0 || cssFiles.length === 0) {
  throw new Error('❌ Error: No se encontraron bundles JS o CSS en ./dist/assets.');
}
console.log(`   ✅ Encontrados ${jsFiles.length} bundle(s) JS y ${cssFiles.length} bundle(s) CSS.`);

// 2. Auditoría del Motor de Diagnóstico Humano (interpretQuality)
console.log('\n2. Auditando Motor de Interpretación de Calidad...');
const testCases = [
  { ping: 15, speed: 200, expectedLevel: 'excellent' },
  { ping: 45, speed: 60, expectedLevel: 'good' },
  { ping: 80, speed: 25, expectedLevel: 'moderate' },
  { ping: 180, speed: 5, expectedLevel: 'poor' }
];

for (const tc of testCases) {
  const res = interpretQuality(tc.ping, tc.speed);
  if (res.level !== tc.expectedLevel) {
    throw new Error(`❌ Fallo en interpretación: Ping ${tc.ping}, Speed ${tc.speed} devolvió ${res.level}, se esperaba ${tc.expectedLevel}`);
  }
  console.log(`   ✅ Ping: ${tc.ping}ms | Vel: ${tc.speed}Mbps -> [${res.label}] "${res.humanTitle}" (${res.verdict})`);
}

// 3. Auditoría del Contrato de Datos (Requisito Obligatorio Hackatón)
console.log('\n3. Auditando Especificación del Contrato de Datos...');
const mockMeasurements = [
  {
    id: 'sala',
    name: 'Sala Principal',
    ping: 18,
    jitter: 2,
    speed: 210,
    timestamp: new Date().toISOString(),
    quality: { label: 'Excelente', level: 'excellent', score: 95, verdict: 'Óptima' }
  },
  {
    id: 'segundo_piso',
    name: 'Segundo Piso',
    ping: 190,
    jitter: 35,
    speed: 6,
    timestamp: new Date().toISOString(),
    quality: { label: 'Zona Crítica', level: 'poor', score: 20, verdict: 'Zona Muerta' }
  }
];

const contract = buildDataContract({ telefono: '999888777' }, mockMeasurements, 'sala');

const requiredKeys = ['version_contrato', 'metadata', 'topologia_hogar', 'mediciones_detalle', 'resumen'];
for (const key of requiredKeys) {
  if (!(key in contract)) {
    throw new Error(`❌ Campo obligatorio faltante en el contrato: ${key}`);
  }
}

if (contract.resumen.zonas_criticas !== 1) {
  throw new Error('❌ El resumen no calculó correctamente las zonas críticas.');
}

if (!contract.resumen.recomendacion_comercial.includes('WIN Mesh')) {
  throw new Error('❌ La recomendación comercial no incluye la oferta WIN Mesh para zonas críticas.');
}

console.log('   ✅ Estructura de Contrato de Datos 100% conforme.');
console.log(`   ✅ Detección de zonas críticas: ${contract.resumen.zonas_criticas} zona(s) detectada(s).`);
console.log(`   ✅ Oferta comercial generada: "${contract.resumen.recomendacion_comercial}"`);

console.log('\n🎉 ¡TODAS LAS AUDITORÍAS PASARON EXITOSAMENTE CON 100% DE INTEGRIDAD! 🎉');
