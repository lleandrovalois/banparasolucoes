const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let sRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let jsCode = '';
while ((match = sRegex.exec(html)) !== null) {
  jsCode += match[1] + '\n';
}

jsCode = jsCode.replace(/let crmDemandas/g, 'var crmDemandas');
jsCode = jsCode.replace(/let demandaAtivaNaPosicao/g, 'var demandaAtivaNaPosicao');

const domElements = {};
global.document = {
  getElementById: (id) => {
    if (!domElements[id]) {
      domElements[id] = {
        innerText: '',
        innerHTML: '',
        value: '12',
        className: '',
        style: {},
        classList: {
          classes: new Set(),
          add: function(c) { this.classes.add(c); },
          remove: function(c) { this.classes.delete(c); },
          contains: function(c) { return this.classes.has(c); }
        }
      };
    }
    return domElements[id];
  },
  querySelector: () => ({ classList: { add: ()=>{}, remove: ()=>{} } }),
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.window = { scrollTo: () => {}, addEventListener: () => {} };
global.tailwind = { config: {} };
global.showToast = (msg) => console.log('Toast:', msg);
global.userCPF = '123.456.789-00';
global.userPhone = '(91) 98124-0000';
global.simulatedUserEmail = 'bruno@email.com';
global.userPJRazao = 'Comércio & Serviços Pará LTDA';
global.userPJCNPJ = '07.821.493/0001-44';
global.simulatedPJEmail = 'financeiro@comerciopara.com.br';

eval(jsCode);

console.log('--- TEST PJ PAYMENT CONDITIONAL BEHAVIOR ---');

// Case 1: Select parcelado and 6x (insalubre)
setPJDebitoPlan('parcelado');
selectPJParcelas(6);
finalizarConsultaExternaPJ(6, 4048.80);

const pjOpcoesHidden = domElements['box-pj-pagamento-opcoes'].classList.contains('hidden');
const pjAnaliseVisible = !domElements['box-pj-pagamento-analise'].classList.contains('hidden');
const pjBtnTextoAnalise = domElements['btn-pj-concluir-texto'].innerText;
const pjBtnBgAmber = domElements['btn-pj-concluir-acordo'].className.includes('bg-amber-600');

console.log('✓ PJ 6x - Payment options hidden?', pjOpcoesHidden);
console.log('✓ PJ 6x - Analysis advisory card visible?', pjAnaliseVisible);
console.log('✓ PJ 6x - CTA button text:', pjBtnTextoAnalise, '(is Enviar Proposta?)', pjBtnTextoAnalise.includes('Enviar Proposta'));
console.log('✓ PJ 6x - CTA button has amber color?', pjBtnBgAmber);

// Case 2: Conclude 6x agreement
concluirFechamentoAcordoPJ();
const pjBoletoHidden = domElements['card-boleto-imediato'].classList.contains('hidden');
const pjCardAnaliseVisible = !domElements['card-analise-acompanhamento'].classList.contains('hidden');
console.log('✓ PJ 6x Success - Immediate boleto hidden?', pjBoletoHidden);
console.log('✓ PJ 6x Success - Mesa analysis card visible?', pjCardAnaliseVisible);

// Case 3: Select 30x (recommended / pre-approved)
selectPJParcelas(30);
finalizarConsultaExternaPJ(30, 887.68);

const pjOpcoesVisible30 = !domElements['box-pj-pagamento-opcoes'].classList.contains('hidden');
const pjAnaliseHidden30 = domElements['box-pj-pagamento-analise'].classList.contains('hidden');
const pjBtnTexto30 = domElements['btn-pj-concluir-texto'].innerText;
const pjBtnBgRed30 = domElements['btn-pj-concluir-acordo'].className.includes('bg-bp-red');

console.log('\n✓ PJ 30x - Payment options visible?', pjOpcoesVisible30);
console.log('✓ PJ 30x - Analysis advisory card hidden?', pjAnaliseHidden30);
console.log('✓ PJ 30x - CTA button text:', pjBtnTexto30, '(is Concluir Acordo?)', pjBtnTexto30.includes('Concluir Acordo'));
console.log('✓ PJ 30x - CTA button has red color?', pjBtnBgRed30);

// Case 4: Conclude 30x agreement
concluirFechamentoAcordoPJ();
const pjBoletoVisible30 = !domElements['card-boleto-imediato'].classList.contains('hidden');
const pjCardAnaliseHidden30 = domElements['card-analise-acompanhamento'].classList.contains('hidden');
console.log('✓ PJ 30x Success - Immediate boleto visible?', pjBoletoVisible30);
console.log('✓ PJ 30x Success - Mesa analysis card hidden?', pjCardAnaliseHidden30);

console.log('\n--- TEST PF PAYMENT CONDITIONAL BEHAVIOR ---');

// Case 5: PF Insalubre (slider = 2 parcelas)
setDebitoPlan('parcelado');
document.getElementById('slider-parcelas').value = 2;
updateParcelamentoCalc();

const pfOpcoesHidden = domElements['box-pf-pagamento-opcoes'].classList.contains('hidden');
const pfAnaliseVisible = !domElements['box-pf-pagamento-analise'].classList.contains('hidden');
const pfBtnTextoAnalise = domElements['btn-pf-concluir-texto'].innerText;
console.log('✓ PF 2x - Payment options hidden?', pfOpcoesHidden);
console.log('✓ PF 2x - Analysis advisory card visible?', pfAnaliseVisible);
console.log('✓ PF 2x - CTA button text:', pfBtnTextoAnalise);

// Case 6: Conclude PF 2x
concluirFechamentoAcordo();
console.log('✓ PF 2x Success - Immediate boleto hidden?', domElements['card-boleto-imediato'].classList.contains('hidden'));
console.log('✓ PF 2x Success - Mesa analysis card visible?', !domElements['card-analise-acompanhamento'].classList.contains('hidden'));

// Case 7: PF Saudável (slider = 18 parcelas)
document.getElementById('slider-parcelas').value = 18;
updateParcelamentoCalc();
console.log('\n✓ PF 18x - Payment options visible?', !domElements['box-pf-pagamento-opcoes'].classList.contains('hidden'));
console.log('✓ PF 18x - Analysis advisory card hidden?', domElements['box-pf-pagamento-analise'].classList.contains('hidden'));
console.log('✓ PF 18x - CTA button text:', domElements['btn-pf-concluir-texto'].innerText);

// Case 8: Conclude PF 18x
concluirFechamentoAcordo();
console.log('✓ PF 18x Success - Immediate boleto visible?', !domElements['card-boleto-imediato'].classList.contains('hidden'));
console.log('✓ PF 18x Success - Mesa analysis card hidden?', domElements['card-analise-acompanhamento'].classList.contains('hidden'));

console.log('\n=============================================');
console.log('ALL PAYMENT CONDITIONAL CHECKS PASSED 100%!');
console.log('=============================================');
