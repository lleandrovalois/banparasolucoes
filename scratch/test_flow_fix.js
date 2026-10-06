// Simula o cenário relatado pelo usuário
let activePJDebitoPlan = 'vista'; // o bug original: começava como vista
let currentPJSaudeStatus = 'INSALUBRE';
let parcelsCountPJ = 6;

// Mock do DOM
const mockDOM = {
    'box-pj-plano-parcelado': { classList: { contains: (cls) => cls !== 'hidden' } }, // parcelado está visível
    'box-pj-pagamento-analise': { classList: { contains: (cls) => cls !== 'hidden' } }, // card amarelo visível
    'btn-pj-concluir-texto': { innerText: 'Enviar Proposta para Análise da Mesa' },
    'slider-pj-parcelas': { value: '6' }
};

function getElement(id) {
    return mockDOM[id] || null;
}

// Lógica CORRIGIDA:
function checkPJFlow() {
    const boxParceladoPJ = getElement('box-pj-plano-parcelado');
    const isParceladoPJ = activePJDebitoPlan === 'parcelado' || (boxParceladoPJ && !boxParceladoPJ.classList.contains('hidden'));

    const boxAnalisePJ = getElement('box-pj-pagamento-analise');
    const isAnaliseCardVisiblePJ = boxAnalisePJ && !boxAnalisePJ.classList.contains('hidden');
    const btnTextoPJ = getElement('btn-pj-concluir-texto')?.innerText || '';
    const isBtnAnalisePJ = btnTextoPJ.includes('Análise') || btnTextoPJ.includes('Mesa');

    const isInsalubrePJ = isAnaliseCardVisiblePJ || isBtnAnalisePJ || (isParceladoPJ && (currentPJSaudeStatus === 'INSALUBRE' || parcelsCountPJ <= 6));
    
    return { isParceladoPJ, isAnaliseCardVisiblePJ, isBtnAnalisePJ, isInsalubrePJ };
}

console.log('Resultado do teste com a lógica corrigida:', checkPJFlow());
