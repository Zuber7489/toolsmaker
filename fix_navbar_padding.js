const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if body has p-4
    const bodyRegex = /(<body[^>]*class=["'])([^"']*)\bp-4\b([^"']*)(["'][^>]*>)/i;

    if (bodyRegex.test(content)) {
        console.log(`Processing: ${filePath}`);

        // Remove p-4 from body
        content = content.replace(bodyRegex, (match, prefix, before, after, suffix) => {
            // Clean up double spaces that might result from removal
            const newClasses = (before + after).replace(/\s+/g, ' ').trim();
            return `${prefix}${newClasses}${suffix}`;
        });

        // Add padding to main if it exists and doesn't look like it has heavy padding
        // heuristic: if it doesn't have p-X or px-X py-X, add px-4 py-8
        // For simplicity based on the user request, we'll append px-4 py-8 which matches the fix for image-converter

        const mainRegex = /(<main[^>]*class=["'])([^"']*)(["'][^>]*>)/i;
        if (mainRegex.test(content)) {
            content = content.replace(mainRegex, (match, prefix, classes, suffix) => {
                // check if padding already exists to avoid duplication
                if (classes.includes('px-4') && classes.includes('py-8')) {
                    return match;
                }
                return `${prefix}${classes} px-4 py-8${suffix}`;
            });
        }

        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file !== '.git' && file !== '.agent' && file !== 'node_modules') {
                traverseDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

console.log('Starting fix_navbar_padding script...');
traverseDir(rootDir);
console.log('Done.');
