const fs = require('fs');
const { google } = require('googleapis');

// -------------------------------------------------------------
// SETUP INSTRUCTIONS:
// 1. Go to Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project or select an existing one.
// 3. Enable the "Web Search Indexing API".
// 4. Create a Service Account and generate a new key (JSON).
// 5. Save the downloaded JSON file in this folder and rename it to 'service_account.json'.
// 6. Go to Google Search Console (https://search.google.com/search-console)
// 7. Add the "client_email" from your service_account.json as an Owner of your property (https://freeproducts24.site/).
// 8. Run "npm install googleapis" in your terminal.
// 9. Run this script: "node google-indexing.js"
// -------------------------------------------------------------

// Ensure you have renamed your Google Cloud service account key to 'service_account.json'
const keyFilePath = './service_account.json';

// URLs you want to force Google to index
// Let's pull the newly added tools from the sitemap list or specific problematic pages.
const urlsToIndex = [
    "https://freeproducts24.site/mime-checker.html",
    "https://freeproducts24.site/screen-recorder.html",
    "https://freeproducts24.site/jwt-decoder.html",
    "https://freeproducts24.site/pdf-compress.html",
    "https://freeproducts24.site/delete-pdf-pages.html",
    "https://freeproducts24.site/images-to-pdf.html",
    "https://freeproducts24.site/image-cropper.html",
    "https://freeproducts24.site/invoice-generator.html",
    "https://freeproducts24.site/signature-generator.html",
    "https://freeproducts24.site/gst-calculator.html",
    // Add more un-indexed URLs here...
];

async function submitToGoogleIndex() {
    if (!fs.existsSync(keyFilePath)) {
        console.error("❌ ERROR: 'service_account.json' not found!");
        console.error("Please download the service account JSON key from Google Cloud Console and save it as 'service_account.json' in this directory.");
        return;
    }

    try {
        console.log("Authenticating with Google...");
        const auth = new google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const authClient = await auth.getClient();
        const indexing = google.indexing({ version: 'v3', auth: authClient });

        console.log(`Starting to submit ${urlsToIndex.length} URLs to Google Indexing API...\n`);

        for (const url of urlsToIndex) {
            try {
                const response = await indexing.urlNotifications.publish({
                    requestBody: {
                        url: url,
                        type: 'URL_UPDATED', // Tells Google the URL is new or updated
                    },
                });
                
                if (response.status === 200) {
                    console.log(`✅ SUCCESS: ${url} submitted successfully.`);
                } else {
                    console.log(`⚠️ UNEXPECTED RESPONSE for ${url}:`, response.status);
                }
            } catch (err) {
                console.error(`❌ FAILED: ${url}`);
                console.error('Error Details:', err.errors ? err.errors : err.message);
            }
            
            // Small delay to prevent hitting rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log("\nAll done! Check Google Search Console in 24-48 hours. The URLs should be crawled much faster now.");

    } catch (error) {
        console.error("An error occurred during authentication or initialization:", error);
    }
}

submitToGoogleIndex();
