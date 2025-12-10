#!/usr/bin/env node

/**
 * Script para verificar que la aplicación está lista para producción
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando preparación para producción...\n');

let errors = [];
let warnings = [];

// Verificar que existe package.json
if (!fs.existsSync('package.json')) {
  errors.push('❌ No se encontró package.json');
} else {
  console.log('✅ package.json encontrado');
}

// Verificar scripts necesarios
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start'];
requiredScripts.forEach(script => {
  if (!packageJson.scripts[script]) {
    errors.push(`❌ Falta el script "${script}" en package.json`);
  } else {
    console.log(`✅ Script "${script}" encontrado`);
  }
});

// Verificar que existe next.config.js
if (!fs.existsSync('next.config.js')) {
  warnings.push('⚠️ No se encontró next.config.js');
} else {
  console.log('✅ next.config.js encontrado');
}

// Verificar estructura de carpetas
const requiredDirs = ['app', 'lib'];
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    errors.push(`❌ No se encontró el directorio "${dir}"`);
  } else {
    console.log(`✅ Directorio "${dir}" encontrado`);
  }
});

// Verificar variables de entorno (solo advertencia)
if (!fs.existsSync('.env.local') && !fs.existsSync('.env.production')) {
  warnings.push('⚠️ No se encontró archivo .env.local o .env.production');
  warnings.push('   Asegúrate de configurar las variables de entorno en tu plataforma de hosting');
} else {
  console.log('✅ Archivo de variables de entorno encontrado');
}

// Verificar que .env.local no esté en git
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (!gitignore.includes('.env.local')) {
    warnings.push('⚠️ .env.local no está en .gitignore');
  } else {
    console.log('✅ .env.local está en .gitignore');
  }
}

// Resumen
console.log('\n📊 Resumen:');
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ ¡Todo está listo para producción!');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('\n❌ Errores encontrados:');
    errors.forEach(error => console.log(`   ${error}`));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️ Advertencias:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  if (errors.length > 0) {
    console.log('\n❌ Corrige los errores antes de desplegar');
    process.exit(1);
  } else {
    console.log('\n⚠️ Revisa las advertencias antes de desplegar');
    process.exit(0);
  }
}

