const fs = require('fs');

const htmlContent = fs.readFileSync('index.html', 'utf8');

// Verificação 1: Variáveis globais
console.log('--- Teste 1: Declaração de activePJDebitoPlan ---');
const hasPJDefaultParcelado = htmlContent.includes("let activePJDebitoPlan = 'parcelado';");
console.log('activePJDebitoPlan inicial é parcelado?', hasPJDefaultParcelado ? 'PASS' : 'FAIL');

// Verificação 2: selectPJParcelas atualiza activePJDebitoPlan
console.log('--- Teste 2: selectPJParcelas e updatePJParcelamentoCalc ---');
const selectPJHasParcelado = htmlContent.includes("function selectPJParcelas(parcels) {\n            activePJDebitoPlan = 'parcelado';") ||
                             htmlContent.includes("function selectPJParcelas(parcels) {\r\n            activePJDebitoPlan = 'parcelado';");
console.log('selectPJParcelas define activePJDebitoPlan?', selectPJHasParcelado ? 'PASS' : 'FAIL');

const updatePJHasParcelado = htmlContent.includes("function updatePJParcelamentoCalc() {\n            activePJDebitoPlan = 'parcelado';") ||
                             htmlContent.includes("function updatePJParcelamentoCalc() {\r\n            activePJDebitoPlan = 'parcelado';");
console.log('updatePJParcelamentoCalc define activePJDebitoPlan?', updatePJHasParcelado ? 'PASS' : 'FAIL');

// Verificação 3: concluirFechamentoAcordoPJ checa cards e botões visíveis
console.log('--- Teste 3: Lógica robusta de isInsalubrePJ ---');
const hasRobustAnaliseCheck = htmlContent.includes("const isAnaliseCardVisiblePJ = boxAnalisePJ && !boxAnalisePJ.classList.contains('hidden');");
const hasRobustBtnCheck = htmlContent.includes("const isBtnAnalisePJ = btnTextoPJ.includes('Análise') || btnTextoPJ.includes('Mesa');");
const hasRobustInsalubre = htmlContent.includes("const isInsalubrePJ = isAnaliseCardVisiblePJ || isBtnAnalisePJ || (isParceladoPJ && (currentPJSaudeStatus === 'INSALUBRE' || parcelsCountPJ <= 6));");

console.log('Checa card de análise visível?', hasRobustAnaliseCheck ? 'PASS' : 'FAIL');
console.log('Checa texto do botão?', hasRobustBtnCheck ? 'PASS' : 'FAIL');
console.log('isInsalubrePJ combina todas as verificações?', hasRobustInsalubre ? 'PASS' : 'FAIL');

// Verificação 4: PF também possui verificação robusta
console.log('--- Teste 4: Lógica robusta para PF ---');
const hasRobustPF = htmlContent.includes("const isInsalubre = isAnaliseCardVisiblePF || isBtnAnalisePF || (isParcelado && (currentSaudeStatus === 'INSALUBRE' || currentComprometimento > 35));");
console.log('PF possui verificação robusta?', hasRobustPF ? 'PASS' : 'FAIL');

// Verificação 5: Elementos do DOM presentes
console.log('--- Teste 5: Elementos DOM no HTML ---');
console.log('acordo-sucesso-icone-wrapper existe?', htmlContent.includes('id="acordo-sucesso-icone-wrapper"') ? 'PASS' : 'FAIL');
console.log('card-sucesso-prazos existe?', htmlContent.includes('id="card-sucesso-prazos"') ? 'PASS' : 'FAIL');
console.log('acordo-prazos-titulo existe?', htmlContent.includes('id="acordo-prazos-titulo"') ? 'PASS' : 'FAIL');
console.log('acordo-prazos-lista existe?', htmlContent.includes('id="acordo-prazos-lista"') ? 'PASS' : 'FAIL');
console.log('card-analise-acompanhamento existe?', htmlContent.includes('id="card-analise-acompanhamento"') ? 'PASS' : 'FAIL');
console.log('card-boleto-imediato existe?', htmlContent.includes('id="card-boleto-imediato"') ? 'PASS' : 'FAIL');
