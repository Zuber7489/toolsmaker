const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const oldId = 'G-XXXXXXXXXX';
const newId = 'G-KFQCWF71SG';

function walk(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                if (file === '.git' || file === 'node_modules' || file === '.agent') continue;
                walk(filePath);
            } else if (file.endsWith('.html')) {
                let content = fs.readFileSync(filePath, 'utf8');
                if (content.includes(oldId)) {
                    // Replace all occurrences
                    const regex = new RegExp(oldId, 'g');
                    content = content.replace(regex, newId);
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated ID in: ${filePath}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error processing directory ${dir}: ${err.message}`);
    }
}

console.log(`Replacing ${oldId} with ${newId}...`);
walk(rootDir);
console.log('Finished updating Google Analytics IDs.');
