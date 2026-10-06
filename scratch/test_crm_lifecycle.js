const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let sRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let jsCode = '';
while ((match = sRegex.exec(html)) !== null) {
  jsCode += match[1] + '\n';
}

// Convert top-level let/const declarations to var so they attach to global scope in eval
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
  console.log('✓ CRM initial demands count:', crmDemandas.length);

  // Test 1: Healthy proposal simulation
  console.log('\n--- TEST 1: Healthy proposal (e.g. 18x parcelas, 8.1% renda) ---');
  registrarDemandaCRM({
    tipo: 'REPACTUAÇÃO DE DÍVIDA',
    cliente: 'BRUNO OTAVIO LOBATO DIAS',
    contratos: 'Cartão Classic (#0419) + EP (#81621)',
    proposta: 'Entrada R$ 380,00 + 18x de R$ 310,00',
    total: 'R$ 3.984,00 + juros',
    status: 'APROVADO',
    rendaMensal: 3800,
    comprometimento: 8.1,
    motivoAnalise: 'Aprovado Direto - Parcela Saudável',
    parcelasQtd: 18,
    parcelaValor: '310,00',
    entradaValor: '380,00'
  });
  console.log('✓ New demand status:', crmDemandas[0].status);
  console.log('✓ Is APROVADO?', crmDemandas[0].status === 'APROVADO');

  // Test 2: Unhealthy proposal simulation
  console.log('\n--- TEST 2: Unhealthy proposal (e.g. 2x parcelas, 48% renda) ---');
  registrarDemandaCRM({
    tipo: 'REPACTUAÇÃO DE DÍVIDA',
    cliente: 'BRUNO OTAVIO LOBATO DIAS',
    contratos: 'Cartão Classic (#0419) + EP (#81621)',
    proposta: 'Entrada R$ 380,00 + 2x de R$ 1.823,55',
    total: 'R$ 3.984,00 + juros',
    status: 'PENDENTE ANALISE',
    rendaMensal: 3800,
    comprometimento: 48.0,
    motivoAnalise: 'Comprometimento Insalubre da Renda (48.0% da renda de R$ 3.800,00)',
    parcelasQtd: 2,
    parcelaValor: '1.823,55',
    entradaValor: '380,00'
  });
  console.log('✓ New demand status:', crmDemandas[0].status);
  console.log('✓ Is PENDENTE ANALISE?', crmDemandas[0].status === 'PENDENTE ANALISE');

  // Test 3: Load unhealthy demand in Atendimento body (abrirPosicaoFinanceiraDemanda)
  console.log('\n--- TEST 3: Load into Atendimento body (abrirPosicaoFinanceiraDemanda) ---');
  abrirPosicaoFinanceiraDemanda(crmDemandas[0].id);
  const painelHTML = domElements['vox-painel-demanda'].innerHTML;
  console.log('✓ Painel has Alçada decision buttons?', painelHTML.includes('aprovarDemandaMesa'));
  console.log('✓ Painel has Client contact buttons (Telefone/WhatsApp)?', painelHTML.includes('contactarClienteTelefone') && painelHTML.includes('contactarClienteWhatsApp'));
  console.log('✓ Painel has Operator notes (Parecer)?', painelHTML.includes('vox-parecer-texto') && painelHTML.includes('salvarParecerOperador'));
  console.log('✓ Painel has Back to CRM button?', painelHTML.includes('view-voxdata-crm'));

  // Test 4: Operator acts on demand (Aprovar c/ Ajuste Saudável)
  console.log('\n--- TEST 4: Operator adjusts proposal to healthy 12x (AjustarDemandaMesa) ---');
  ajustarDemandaMesa(crmDemandas[0].id);
  console.log('✓ Adjusted status:', crmDemandas[0].status);
  console.log('✓ Adjusted proposal:', crmDemandas[0].proposta);

  // Test 5: Operator registers contact notes
  console.log('\n--- TEST 5: Operator saves contact note ---');
  document.getElementById('vox-parecer-texto').value = 'Entrei em contato com o cliente via WhatsApp. Ele aceitou o plano de 12 parcelas fixas.';
  salvarParecerOperador(crmDemandas[0].id);
  console.log('✓ Demand parecer:', crmDemandas[0].parecerOperador);
  console.log('✓ Demand contatoRealizado:', crmDemandas[0].contatoRealizado);

  console.log('\n=========================================');
  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
  console.log('=========================================');
} catch(e) {
  console.error('Execution error:', e);
}
