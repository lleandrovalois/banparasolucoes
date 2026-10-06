const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Checking HTML elements ---');
console.log('vox-banner-demanda-ativa exists?', html.includes('vox-banner-demanda-ativa'));
console.log('vox-painel-demanda exists?', html.includes('id="vox-painel-demanda"'));
console.log('vox-drawer-stepper exists?', html.includes('id="vox-drawer-stepper"'));
console.log('crm-demandas-tbody exists?', html.includes('id="crm-demandas-tbody"'));

const fnNames = [
  'abrirPosicaoFinanceiraDemanda',
  'aprovarDemandaMesa',
  'ajustarDemandaMesa',
  'recusarDemandaMesa',
  'salvarParecerOperador',
  'alternarParaStepperManual',
  'voltarParaPainelDemanda',
  'contactarClienteTelefone',
  'contactarClienteWhatsApp',
  'registrarDemandaCRM'
];
console.log('--- Checking functions ---');
fnNames.forEach(fn => {
  console.log(fn + ':', html.includes('function ' + fn));
});
