const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('=== VIEWS ===');
lines.forEach((l, i) => {
    if (l.includes('id="view-')) {
        console.log(`${i + 1}: ${l.trim()}`);
    }
});

console.log('\n=== CRM OCCURRENCES IN CUSTOMER SECTIONS (outside view-voxdata-crm and view-voxdata-atendimento) ===');
let inOperatorView = false;
lines.forEach((l, i) => {
    if (l.includes('id="view-voxdata-crm"') || l.includes('id="view-voxdata-atendimento"')) {
        inOperatorView = true;
    }
    if (inOperatorView && l.includes('</section>')) {
        inOperatorView = false;
    }
    if (!inOperatorView && /crm/i.test(l)) {
        console.log(`${i + 1}: ${l.trim()}`);
    }
});
