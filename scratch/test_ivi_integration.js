const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Verificação da Integração Oficial da IVI (IA Banpará) ---');
console.log('Tamanho do arquivo HTML:', html.length, 'bytes');

const checks = [
    { name: 'Mascote IVI flutuante (ivi-floating-trigger)', pass: html.includes('id="ivi-floating-trigger"') },
    { name: 'Imagem Oficial do site (ivi_oficial.png)', pass: html.includes('ivi_oficial.png') && fs.existsSync('ivi_oficial.png') },
    { name: 'Ícone Oficial de avatar da IVI (ivi_head_oficial.png)', pass: html.includes('ivi_head_oficial.png') && fs.existsSync('ivi_head_oficial.png') },
    { name: 'Janela de Chat da IVI (ivi-chat-window)', pass: html.includes('id="ivi-chat-window"') },
    { name: 'Cabeçalho chatbot.banpara.b.br', pass: html.includes('chatbot.banpara.b.br') },
    { name: 'Campo de texto (ivi-input-text)', pass: html.includes('id="ivi-input-text"') },
    { name: 'Função toggleIVIChat', pass: html.includes('function toggleIVIChat') },
    { name: 'Função dockIVIChat', pass: html.includes('function dockIVIChat') },
    { name: 'Função enviarMensagemIVI', pass: html.includes('function enviarMensagemIVI') },
    { name: 'Função processarRespostaIA_IVI', pass: html.includes('function processarRespostaIA_IVI') },
    { name: 'Função updatePortalWidgetsVisibility', pass: html.includes('function updatePortalWidgetsVisibility') },
    { name: 'Animação CSS ivi-floating', pass: html.includes('.ivi-floating') },
    { name: 'Temas iniciais fiéis à tela (Cartão de crédito, Empréstimos, etc.)', pass: html.includes('Cartão de crédito') && html.includes('Orientações sobre Fraudes') },
    { name: 'Ações de Localização, Anexo e Voz', pass: html.includes('simularLocalizacaoIVI') && html.includes('simularAnexoIVI') && html.includes('simularVozIVI') }
];

let allPassed = true;
checks.forEach(c => {
    console.log(`${c.pass ? '✓' : '✗'} ${c.name}: ${c.pass ? 'PASS' : 'FAIL'}`);
    if (!c.pass) allPassed = false;
});

console.log('-----------------------------------------------------');
console.log('Resultado Final:', allPassed ? 'TODOS OS TESTES PASSARAM!' : 'FALHAS DETECTADAS!');
