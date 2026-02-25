const { execSync } = require('child_process');
try {
    console.log('Reiniciando servidor local...');
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
} catch (e) { }

console.log('Enviando para o GitHub...');
try {
    execSync('git add . && git commit -m "fix: ajuste final de temperatura para Namibe" && git push origin main', { stdio: 'inherit' });
    console.log('GitHub atualizado!');
} catch (e) {
    console.error('Erro no push:', e.message);
}
