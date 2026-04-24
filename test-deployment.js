#!/usr/bin/env node

// Simple test script to check what's working on Render
console.log('🚀 Testing GalaxyV6 deployment...');

const fs = require('fs');
const path = require('path');

const checks = [
  {
    name: 'Node.js version',
    check: () => process.version,
    expected: 'v18'
  },
  {
    name: 'Working directory',
    check: () => process.cwd()
  },
  {
    name: 'Public directory exists',
    check: () => fs.existsSync('./public') ? '✅' : '❌'
  },
  {
    name: 'Scramjet directory exists',
    check: () => fs.existsSync('./public/scram') ? '✅' : '❌'
  },
  {
    name: 'Proxy page exists',
    check: () => fs.existsSync('./public/a/index.html') ? '✅' : '❌'
  },
  {
    name: 'Main index exists',
    check: () => fs.existsSync('./public/index.html') ? '✅' : '❌'
  },
  {
    name: 'Assets directory exists',
    check: () => fs.existsSync('./public/assets') ? '✅' : '❌'
  }
];

console.log('\n📋 System Check Results:');
checks.forEach(({ name, check }) => {
  try {
    const result = check();
    console.log(`${name}: ${result}`);
  } catch (error) {
    console.log(`${name}: ❌ Error - ${error.message}`);
  }
});

console.log('\n🔍 Directory Contents (public):');
try {
  const files = fs.readdirSync('./public');
  files.forEach(file => {
    const stats = fs.statSync(path.join('./public', file));
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });
} catch (error) {
  console.log('❌ Could not read public directory:', error.message);
}

console.log('\n✨ Test completed!');