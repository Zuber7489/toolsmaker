const fs = require('fs');
const path = require('path');

// Load data files
const cities = JSON.parse(fs.readFileSync('./data/cities.json', 'utf8'));
const professions = JSON.parse(fs.readFileSync('./data/professions.json', 'utf8'));
const industries = JSON.parse(fs.readFileSync('./data/industries.json', 'utf8'));
const sipGoals = JSON.parse(fs.readFileSync('./data/sip-goals.json', 'utf8'));
const loanTypes = JSON.parse(fs.readFileSync('./data/loan-types.json', 'utf8'));

// Configuration
const CONFIG = {
    TOOLS: {
        SALARY_CALCULATOR: 'salary-calculator',
        GST_CALCULATOR: 'gst-calculator',
        EMI_CALCULATOR: 'emi-calculator',
        SIP_CALCULATOR: 'sip-calculator',
        BMI_CALCULATOR: 'health-calculator'
    },
    OUTPUT_DIR: '..',  // Output directly to root directory
    TEMPLATE_DIR: './templates'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
    fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// Helper function to read template
function readTemplate(templateName) {
    const templatePath = path.join(CONFIG.TEMPLATE_DIR, `${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf8');
}

// Helper function to replace placeholders
function replacePlaceholders(template, data) {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }
    return result;
}

// Generate location-based pages
function generateLocationPages(tool, cities) {
    console.log(`\n🏙️  Generating location-based pages for ${tool}...`);
    const template = readTemplate(`${tool}-location`);
    let count = 0;

    cities.forEach(city => {
        const data = {
            CITY: city.name,
            CITY_SLUG: city.slug,
            STATE: city.state,
            AVG_SALARY: city.avgSalary,
            COST_LEVEL: city.costOfLiving,
            POPULATION: city.population,
            DESCRIPTION: city.description,
            KEY_INDUSTRIES: city.keyIndustries.join(', '),
            POPULAR_PROFESSIONS: city.popularProfessions.join(', '),
            GST_RATE: city.gstRate,
            YEAR: new Date().getFullYear(),
            TOOL_NAME: tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        };

        const html = replacePlaceholders(template, data);
        const filename = `${tool}-${city.slug}.html`;
        const filepath = path.join(CONFIG.OUTPUT_DIR, filename);

        fs.writeFileSync(filepath, html);
        count++;
    });

    console.log(`✅ Generated ${count} location-based pages for ${tool}`);
    return count;
}

// Generate profession-based pages
function generateProfessionPages(tool, professions) {
    console.log(`\n👔 Generating profession-based pages for ${tool}...`);
    const template = readTemplate(`${tool}-profession`);
    let count = 0;

    professions.forEach(profession => {
        const data = {
            PROFESSION: profession.name,
            PROFESSION_SLUG: profession.slug,
            CATEGORY: profession.category,
            AVG_SALARY: profession.avgSalary,
            SALARY_RANGE: profession.salaryRange,
            DESCRIPTION: profession.description,
            COMMON_DEDUCTIONS: profession.commonDeductions.join(', '),
            TAX_BENEFITS: profession.taxBenefits.join(', '),
            SKILLS: profession.skills.join(', '),
            GST_APPLICABLE: profession.gstApplicable ? 'Yes' : 'No',
            GST_RATE: profession.gstRate,
            YEAR: new Date().getFullYear(),
            TOOL_NAME: tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        };

        const html = replacePlaceholders(template, data);
        const filename = `${tool}-for-${profession.slug}.html`;
        const filepath = path.join(CONFIG.OUTPUT_DIR, filename);

        fs.writeFileSync(filepath, html);
        count++;
    });

    console.log(`✅ Generated ${count} profession-based pages for ${tool}`);
    return count;
}

// Generate industry-based pages
function generateIndustryPages(tool, industries) {
    console.log(`\n🏭 Generating industry-based pages for ${tool}...`);
    const template = readTemplate(`${tool}-industry`);
    let count = 0;

    industries.forEach(industry => {
        const data = {
            INDUSTRY: industry.name,
            INDUSTRY_SLUG: industry.slug,
            CATEGORY: industry.category,
            GST_RATE: industry.gstRate,
            DESCRIPTION: industry.description,
            COMMON_EXPENSES: industry.commonExpenses.join(', '),
            GST_INPUTS: industry.gstInputs.join(', '),
            AVG_REVENUE: industry.averageRevenue,
            PROFIT_MARGIN: industry.profitMargin,
            YEAR: new Date().getFullYear(),
            TOOL_NAME: tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        };

        const html = replacePlaceholders(template, data);
        const filename = `${tool}-for-${industry.slug}.html`;
        const filepath = path.join(CONFIG.OUTPUT_DIR, filename);

        fs.writeFileSync(filepath, html);
        count++;
    });

    console.log(`✅ Generated ${count} industry-based pages for ${tool}`);
    return count;
}

// Generate SIP goal-based pages
function generateSIPGoalPages(sipGoals) {
    console.log(`\n🎯 Generating SIP goal-based pages...`);
    const template = readTemplate('sip-calculator-goal');
    let count = 0;

    sipGoals.forEach(goal => {
        const data = {
            GOAL: goal.name,
            GOAL_SLUG: goal.slug,
            TARGET_AMOUNT: goal.targetAmount,
            MONTHLY_SIP: goal.monthlySIP,
            DURATION: goal.duration,
            DESCRIPTION: goal.description,
            AGE_GROUP: goal.ageGroup,
            RISK_PROFILE: goal.riskProfile,
            YEAR: new Date().getFullYear()
        };

        const html = replacePlaceholders(template, data);
        const filename = `sip-calculator-${goal.slug}.html`;
        const filepath = path.join(CONFIG.OUTPUT_DIR, filename);

        fs.writeFileSync(filepath, html);
        count++;
    });

    console.log(`✅ Generated ${count} SIP goal-based pages`);
    return count;
}

// Generate EMI loan-type pages
function generateEMILoanPages(loanTypes) {
    console.log(`\n💳 Generating EMI loan-type pages...`);
    const template = readTemplate('emi-calculator-loan');
    let count = 0;

    loanTypes.forEach(loan => {
        const data = {
            LOAN_TYPE: loan.name,
            LOAN_TYPE_SLUG: loan.slug,
            LOAN_AMOUNT: loan.loanAmount,
            INTEREST_RATE: loan.interestRate,
            TENURE: loan.tenure,
            DESCRIPTION: loan.description,
            CATEGORY: loan.category,
            ELIGIBILITY: loan.eligibility,
            MAX_TENURE: loan.maxTenure,
            PROCESSING_FEE: loan.processingFee,
            YEAR: new Date().getFullYear()
        };

        const html = replacePlaceholders(template, data);
        const filename = `${loan.slug}-emi-calculator.html`;
        const filepath = path.join(CONFIG.OUTPUT_DIR, filename);

        fs.writeFileSync(filepath, html);
        count++;
    });

    console.log(`✅ Generated ${count} EMI loan-type pages`);
    return count;
}

// Generate sitemap
function generateSitemap(baseUrl = 'https://freeproducts24.site') {
    console.log('\n🗺️  Generating sitemap...');

    const files = fs.readdirSync(CONFIG.OUTPUT_DIR).filter(f => f.endsWith('.html'));
    const today = new Date().toISOString().split('T')[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    files.forEach(file => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/${file}</loc>\n`;
        sitemap += `    <lastmod>${today}</lastmod>\n`;
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    fs.writeFileSync(path.join(CONFIG.OUTPUT_DIR, 'sitemap-programmatic.xml'), sitemap);
    console.log(`✅ Sitemap generated with ${files.length} URLs`);
}

// Generate index page
function generateIndexPage() {
    console.log('\n📄 Generating index page...');

    const files = fs.readdirSync(CONFIG.OUTPUT_DIR).filter(f => f.endsWith('.html'));

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Tools - Location & Profession Specific Calculators</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
        .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        .card:hover { background: #f5f5f5; }
        a { text-decoration: none; color: #0066cc; }
        .stats { background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>🚀 Programmatic SEO Pages</h1>
    <div class="stats">
        <h2>📊 Statistics</h2>
        <p><strong>Total Pages Generated:</strong> ${files.length}</p>
        <p><strong>Cities Covered:</strong> ${cities.length}</p>
        <p><strong>Professions Covered:</strong> ${professions.length}</p>
        <p><strong>Industries Covered:</strong> ${industries.length}</p>
    </div>
    <h2>📋 All Generated Pages</h2>
    <div class="grid">
`;

    files.forEach(file => {
        const title = file.replace(/-/g, ' ').replace('.html', '').replace(/\b\w/g, l => l.toUpperCase());
        html += `        <div class="card">
            <a href="${file}">${title}</a>
        </div>\n`;
    });

    html += `    </div>
</body>
</html>`;

    // Save as programmatic-index.html to avoid overwriting main index.html
    fs.writeFileSync(path.join(CONFIG.OUTPUT_DIR, 'programmatic-index.html'), html);
    console.log('✅ Index page generated as programmatic-index.html');
}

// Main execution
function main() {
    console.log('🚀 Starting Programmatic SEO Page Generation...\n');
    console.log('='.repeat(60));

    let totalPages = 0;

    // Generate Salary Calculator pages
    totalPages += generateLocationPages(CONFIG.TOOLS.SALARY_CALCULATOR, cities);
    totalPages += generateProfessionPages(CONFIG.TOOLS.SALARY_CALCULATOR, professions);

    // Generate GST Calculator pages
    totalPages += generateLocationPages(CONFIG.TOOLS.GST_CALCULATOR, cities);
    totalPages += generateIndustryPages(CONFIG.TOOLS.GST_CALCULATOR, industries);

    // Generate SIP Calculator pages
    totalPages += generateSIPGoalPages(sipGoals);

    // Generate EMI Calculator pages
    totalPages += generateEMILoanPages(loanTypes);

    // Generate sitemap and index
    generateSitemap();
    generateIndexPage();

    console.log('\n' + '='.repeat(60));
    console.log(`\n🎉 SUCCESS! Generated ${totalPages} pages total!`);
    console.log(`\n📁 All files saved to: ${path.resolve(CONFIG.OUTPUT_DIR)}`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Review generated pages in the output directory');
    console.log('   2. Upload pages to your website');
    console.log('   3. Submit sitemap to Google Search Console');
    console.log('   4. Monitor rankings and traffic\n');
}

// Run the generator
if (require.main === module) {
    main();
}

module.exports = {
    generateLocationPages,
    generateProfessionPages,
    generateIndustryPages,
    generateSitemap,
    generateIndexPage
};
