const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Carregar .env manualmente
const envPath = path.resolve(__dirname, '.env');
const env = { ...process.env };
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) env[key.trim()] = value.join('=').trim();
    });
}

console.log('--- Iniciando Servidor AgriSat (Local) ---');

const server = spawn('node', ['node_modules/tsx/dist/cli.mjs', 'server/index.ts'], {
    env: { ...env, NODE_ENV: 'development' },
    shell: true,
    stdio: 'inherit'
});

server.on('close', (code) => {
    console.log(`Servidor finalizado com código ${code}`);
});
