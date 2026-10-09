const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Verificação do Plugin VLibras no index.html ---');
console.log('Tamanho do arquivo HTML:', html.length, 'bytes');

const checks = [
    { name: 'Aba flutuante (vlibras-demo-launcher)', pass: html.includes('id="vlibras-demo-launcher"') },
    { name: 'Modal do Player (vlibras-player-modal)', pass: html.includes('id="vlibras-player-modal"') },
    { name: 'Barra superior de utilidades (portal-top-utility-bar)', pass: html.includes('id="portal-top-utility-bar"') },
    { name: 'Container oficial VLibras (vlibras-official-container)', pass: html.includes('id="vlibras-official-container"') },
    { name: 'Avatar Ícaro (vlibras_avatar_1.jpg)', pass: html.includes('vlibras_avatar_1.jpg') },
    { name: 'Avatar Hozana (vlibras_avatar_hozana.jpg)', pass: html.includes('vlibras_avatar_hozana.jpg') },
    { name: 'Botão Pular presente', pass: html.includes('id="vlibras-btn-skip"') },
    { name: 'Barra de progresso presente', pass: html.includes('id="vlibras-progress-bar"') },
    { name: 'Controle de velocidade (1x)', pass: html.includes('id="vlibras-btn-speed"') },
    { name: 'Expressão facial / emoção', pass: html.includes('id="vlibras-btn-emotion"') },
    { name: 'Legenda / CC presente', pass: html.includes('id="vlibras-btn-captions"') },
    { name: 'Função updateVLibrasVisibility presente', pass: html.includes('function updateVLibrasVisibility') },
    { name: 'showView invoca updateVLibrasVisibility', pass: html.includes('updateVLibrasVisibility(viewId)') },
    { name: 'Função toggleVLibrasWidget presente', pass: html.includes('function toggleVLibrasWidget') },
    { name: 'Função trocarAvatarVLibras presente', pass: html.includes('function trocarAvatarVLibras') },
    { name: 'Função traduzirTextoVLibras presente', pass: html.includes('function traduzirTextoVLibras') },
    { name: 'Script oficial VLibras incluído', pass: html.includes('https://vlibras.gov.br/app/vlibras-plugin.js') }
];

let allPassed = true;
checks.forEach(c => {
    console.log(`${c.pass ? '✓' : '✗'} ${c.name}: ${c.pass ? 'PASS' : 'FAIL'}`);
    if (!c.pass) allPassed = false;
});

console.log('--------------------------------------------------');
console.log('Resultado Final:', allPassed ? 'TODOS OS TESTES PASSARAM!' : 'FALHAS DETECTADAS!');
