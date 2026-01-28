const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
// Placeholder ID - User needs to replace this
const trackingId = 'G-XXXXXXXXXX';

const gaSnippet = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${trackingId}');
</script>`;

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
                // Check if GA is already present to avoid duplicates
                if (!content.includes('googletagmanager.com/gtag/js')) {
                    // Insert before closing head tag
                    if (content.includes('</head>')) {
                        content = content.replace('</head>', `${gaSnippet}\n</head>`);
                        fs.writeFileSync(filePath, content, 'utf8');
                        console.log(`Updated: ${filePath}`);
                    } else {
                        console.log(`Skipped (no </head>): ${filePath}`);
                    }
                } else {
                    console.log(`Skipped (already exists): ${filePath}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error processing directory ${dir}: ${err.message}`);
    }
}

console.log('Starting Google Analytics insertion...');
walk(rootDir);
console.log('Finished.');
