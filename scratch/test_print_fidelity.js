const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let sRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let jsCode = '';
while ((match = sRegex.exec(html)) !== null) {
  jsCode += match[1] + '\n';
}

// Convert top-level let declarations to var so they attach to global scope in eval
jsCode = jsCode.replace(/let crmDemandas/g, 'var crmDemandas');
jsCode = jsCode.replace(/let demandaAtivaNaPosicao/g, 'var demandaAtivaNaPosicao');

const domElements = {};
global.document = {
  getElementById: (id) => {
    if (!domElements[id]) {
      domElements[id] = { innerText: '', innerHTML: '', value: '', className: '', style: {}, classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false } };
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

try {
  eval(jsCode);
  console.log('✓ Initial CRM demands count:', crmDemandas.length);

  // 1. Test first demand (Default matching print)
  console.log('\n--- TEST 1: Demand 0 (#AUT-2026-829, PARÁ DISTRIBUIDORA) ---');
  abrirPosicaoFinanceiraDemanda(crmDemandas[0].id, false);

  console.log('Client name:', domElements['vox-cliente-nome'].innerText);
  console.log('Protocol:', domElements['vox-cliente-protocolo'].innerText);
  console.log('CPF/CNPJ:', domElements['vox-cliente-cpf'].innerText);
  console.log('Tipo Badge:', domElements['vox-cliente-tipo-badge'].innerText);
  console.log('Segmento Badge:', domElements['vox-cliente-segmento-badge'].innerText);
  console.log('Renda:', domElements['vox-card-renda-val'].innerText);
  console.log('Margem:', domElements['vox-card-margem-val'].innerText);
  console.log('Comprometimento:', domElements['vox-card-comprometimento-val'].innerText);
  console.log('Alerta Título:', domElements['vox-alerta-titulo'].innerText);
  console.log('Condição Contratos:', domElements['vox-condicao-contratos'].innerText);
  console.log('Condição Plano:', domElements['vox-condicao-plano'].innerText);
  console.log('Condição Entrada:', domElements['vox-condicao-entrada'].innerText);
  console.log('Condição Total:', domElements['vox-condicao-total'].innerText);
  console.log('Condição Comprometimento:', domElements['vox-condicao-comprometimento'].innerText);
  console.log('Has 3 Alçada buttons?', domElements['vox-botoes-alcada'].innerHTML.includes('Aprovar Exceção de Risco') &&
                                domElements['vox-botoes-alcada'].innerHTML.includes('Aprovar c/ Ajuste Saudável') &&
                                domElements['vox-botoes-alcada'].innerHTML.includes('Recusar Demanda'));
  console.log('Busca Doc (Col 3):', domElements['vox-busca-doc'].value);
  console.log('Busca Agência (Col 3):', domElements['vox-busca-agencia'].value);
  console.log('Busca Conta (Col 3):', domElements['vox-busca-conta'].value);

  // Assertions for Demand 0
  if (domElements['vox-cliente-nome'].innerText !== 'PARÁ DISTRIBUIDORA & LOGÍSTICA LTDA - EPP') throw new Error('Nome mismatch');
  if (domElements['vox-cliente-protocolo'].innerText !== '#AUT-2026-829') throw new Error('Protocol mismatch');
  if (domElements['vox-card-renda-val'].innerText !== 'R$ 18.500,00') throw new Error('Renda mismatch');
  if (domElements['vox-card-comprometimento-val'].innerText !== '21.9% (Insalubre)') throw new Error('Comprometimento mismatch');
  if (domElements['vox-condicao-plano'].innerText !== 'Entrada R$ 2.640,00 + 6x (R$ 4.064,60/mês)') throw new Error('Plano mismatch');

  // 2. Test switching to another demand (e.g. BRUNO OTAVIO LOBATO DIAS)
  console.log('\n--- TEST 2: Demand 1 (#AUT-2025-771, BRUNO OTAVIO) ---');
  abrirPosicaoFinanceiraDemanda('#AUT-2025-771', false);
  console.log('Client name:', domElements['vox-cliente-nome'].innerText);
  console.log('Protocol:', domElements['vox-cliente-protocolo'].innerText);
  console.log('CPF/CNPJ:', domElements['vox-cliente-cpf'].innerText);
  console.log('Tipo Badge:', domElements['vox-cliente-tipo-badge'].innerText);
  console.log('Renda:', domElements['vox-card-renda-val'].innerText);
  console.log('Comprometimento:', domElements['vox-card-comprometimento-val'].innerText);
  console.log('Alerta Título:', domElements['vox-alerta-titulo'].innerText);
  console.log('Condição Plano:', domElements['vox-condicao-plano'].innerText);

  // Assertions for Demand 1
  if (domElements['vox-cliente-nome'].innerText !== 'BRUNO OTAVIO LOBATO DIAS') throw new Error('Nome mismatch');
  if (domElements['vox-cliente-protocolo'].innerText !== '#AUT-2025-771') throw new Error('Protocol mismatch');
  if (domElements['vox-cliente-tipo-badge'].innerText !== 'PF') throw new Error('Tipo badge mismatch');
  if (domElements['vox-card-renda-val'].innerText !== 'R$ 3.800,00') throw new Error('Renda mismatch');

  // 3. Test Alçada Decision on Demand 0: Aprovar Exceção
  console.log('\n--- TEST 3: Action Aprovar Exceção on Demand 0 ---');
  aprovarDemandaMesa('#AUT-2026-829');
  const d0 = crmDemandas.find(x => x.id === '#AUT-2026-829');
  console.log('Status after approval:', d0.status);
  console.log('Alerta Título after approval:', domElements['vox-alerta-titulo'].innerText);
  console.log('Has Reavaliar button?', domElements['vox-botoes-alcada'].innerHTML.includes('Reavaliar Alçada'));
  if (d0.status !== 'APROVADO') throw new Error('Status not APROVADO');

  // 4. Test Reavaliar Alçada
  console.log('\n--- TEST 4: Reavaliar Alçada on Demand 0 ---');
  reavaliarDemandaMesa('#AUT-2026-829');
  console.log('Status after reabertura:', d0.status);
  console.log('Alerta Título after reabertura:', domElements['vox-alerta-titulo'].innerText);
  console.log('Has 3 buttons again?', domElements['vox-botoes-alcada'].innerHTML.includes('Aprovar Exceção de Risco'));
  if (d0.status !== 'PENDENTE ANALISE') throw new Error('Status not PENDENTE ANALISE');

  // 5. Test Operator Notes
  console.log('\n--- TEST 5: Operator Parecer & Feedback ---');
  domElements['vox-parecer-texto'].value = 'Contato telefônico realizado com o sócio-gerente. Validado faturamento recente.';
  salvarParecerOperador('#AUT-2026-829');
  console.log('Saved parecer:', d0.parecerOperador);
  console.log('Contato feedback HTML:', domElements['vox-contato-feedback'].innerHTML);
  if (!d0.contatoRealizado) throw new Error('contatoRealizado is false');

  // 6. Test Busca por CPF/CNPJ
  console.log('\n--- TEST 6: Buscar Cliente por CNPJ ---');
  domElements['vox-busca-doc'].value = '12.312.512/5125-12';
  handleBuscarClienteMesa();
  console.log('After search, active protocol:', domElements['vox-cliente-protocolo'].innerText);
  if (domElements['vox-cliente-protocolo'].innerText !== '#AUT-2026-829') throw new Error('Search failed');

  console.log('\n=========================================');
  console.log('ALL PRINT FIDELITY & DYNAMIC TESTS PASSED!');
  console.log('=========================================');
} catch(err) {
  console.error('Test error:', err);
  process.exit(1);
}
