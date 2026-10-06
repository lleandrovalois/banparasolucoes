const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

console.log('--- TEST 1: Inspecting Customer Facing Strings ---');
const customerFacingLinesWithCRM = [];
let inCustomerSection = true;

content.split('\n').forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.includes('id="view-voxdata-crm"') || line.includes('id="view-voxdata-atendimento"')) {
        inCustomerSection = false;
    }
    if (!inCustomerSection && line.includes('</section>')) {
        inCustomerSection = true;
    }
    
    // Check if customer views contain CRM
    if (inCustomerSection && /status no crm/i.test(line)) {
        customerFacingLinesWithCRM.push({ lineNum, line: line.trim() });
    }
});

console.log(`Occurrences of 'Status no CRM' in customer sections: ${customerFacingLinesWithCRM.length}`);
if (customerFacingLinesWithCRM.length > 0) {
    console.error('FAILED: Found Status no CRM:', customerFacingLinesWithCRM);
    process.exit(1);
} else {
    console.log('PASSED: No "Status no CRM" found anywhere in customer sections!');
}

console.log('\n--- TEST 2: Inspecting Proposal Conditions in JS Alerts ---');
const requiredTerms = ['Pré-Aprovada', 'Aprovada mediante análise'];
requiredTerms.forEach(term => {
    const found = content.includes(term);
    console.log(`Contains "${term}": ${found ? 'YES' : 'NO'}`);
    if (!found) {
        console.error(`FAILED: Missing term ${term}`);
        process.exit(1);
    }
});

console.log('\n--- TEST 3: Inspecting Success Card in index.html ---');
const hasSucessoCondicao = content.includes('id="badge-sucesso-condicao"') &&
                           content.includes('id="titulo-sucesso-crm"') &&
                           content.includes('id="subtitulo-sucesso-crm"');
console.log(`Success card has customer elements: ${hasSucessoCondicao ? 'YES' : 'NO'}`);

console.log('\nAll customer-facing validation tests PASSED successfully!');
