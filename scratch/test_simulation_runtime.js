// Test both scenarios: IN-ANALYSIS (Mesa) and PRE-APPROVED (Saudável)
const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

function createMockDOM() {
    const elements = {};
    return {
        getElementById(id) {
            if (!elements[id]) {
                elements[id] = {
                    id,
                    innerText: '',
                    innerHTML: '',
                    className: '',
                    value: '',
                    classList: {
                        _set: new Set(),
                        add(c) { this._set.add(c); },
                        remove(c) { this._set.delete(c); },
                        contains(c) { return this._set.has(c); }
                    }
                };
            }
            return elements[id];
        }
    };
}

// Setup global
global.crmDemandas = [];
global.updateDemandasBadges = () => {};
global.renderDemandasTable = () => {};
global.showToast = () => {};
global.showView = () => {};
global.userPhone = '(91) 98124-0000';
global.userCPF = '000.000.000-00';
global.simulatedUserEmail = 'cliente.banpara@email.com';
global.activePJDebitoPlan = 'parcelado';
global.currentPJSaudeStatus = 'INSALUBRE';
global.simulatedPJEmail = 'financeiro@paralog.com.br';
global.userPJRazao = 'Pará Distribuidora & Logística Ltda - EPP';
global.userPJCNPJ = '07.821.493/0001-44';

eval(content.substring(content.indexOf('function registrarDemandaCRM'), content.indexOf('/* Renderiza a tabela de demandas')));
eval(content.substring(content.indexOf('function atualizarVisibilidadePagamentoPJ'), content.indexOf('function dispararConsultaExternaPJ')));
eval(content.substring(content.indexOf('function concluirFechamentoAcordoPJ'), content.indexOf('function irParaAcompanhamentoCRM')));

// CENÁRIO 1: Proposta Submetida à Mesa (Insalubre / 6 parcelas)
console.log('=== CENÁRIO 1: Submissão à Mesa Avaliadora ===');
global.document = createMockDOM();
global.currentPJSaudeStatus = 'INSALUBRE';
document.getElementById('slider-pj-parcelas').value = '6';
atualizarVisibilidadePagamentoPJ(true);

concluirFechamentoAcordoPJ();

const c1BoletoHidden = document.getElementById('card-boleto-imediato').classList.contains('hidden');
const c1AnaliseVisible = !document.getElementById('card-analise-acompanhamento').classList.contains('hidden');
console.log('Cenário 1 - Boleto Oculto:', c1BoletoHidden);
console.log('Cenário 1 - Card Análise Visível:', c1AnaliseVisible);
console.log('Cenário 1 - Título:', document.getElementById('acordo-sucesso-titulo').innerText);

if (!c1BoletoHidden || !c1AnaliseVisible) {
    console.error('FALHA NO CENÁRIO 1!');
    process.exit(1);
}

// CENÁRIO 2: Proposta Saudável / Pré-Aprovada (30 parcelas)
console.log('\n=== CENÁRIO 2: Proposta Pré-Aprovada Saudável (30x) ===');
global.document = createMockDOM();
global.currentPJSaudeStatus = 'RECOMENDADO';
document.getElementById('slider-pj-parcelas').value = '30';
document.getElementById('box-pj-plano-parcelado').classList.remove('hidden');
atualizarVisibilidadePagamentoPJ(false);

concluirFechamentoAcordoPJ();

const c2BoletoVisible = !document.getElementById('card-boleto-imediato').classList.contains('hidden');
const c2AnaliseHidden = document.getElementById('card-analise-acompanhamento').classList.contains('hidden');
console.log('Cenário 2 - Boleto Visível:', c2BoletoVisible);
console.log('Cenário 2 - Card Análise Oculto:', c2AnaliseHidden);
console.log('Cenário 2 - Título:', document.getElementById('acordo-sucesso-titulo').innerText);

if (!c2BoletoVisible || !c2AnaliseHidden) {
    console.error('FALHA NO CENÁRIO 2!');
    process.exit(1);
}

console.log('\n>>> TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! <<<');
