const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadSite() {
    try {
        // Get the URL from environment variable
        const siteUrl = process.env.SITE_URL;
        if (!siteUrl) {
            throw new Error('SITE_URL environment variable is not set');
        }

        // Create dist directory if it doesn't exist
        const distPath = path.join(__dirname, '..', 'dist');
        if (!fs.existsSync(distPath)) {
            fs.mkdirSync(distPath, { recursive: true });
        }

        // Download the site content
        const response = await axios.get(siteUrl);
        
        // Write the content to index.html in the dist folder
        fs.writeFileSync(path.join(distPath, 'index.html'), response.data);
        
        console.log('Site downloaded successfully!');
    } catch (error) {
        console.error('Error downloading site:', error.message);
        process.exit(1);
    }
}

downloadSite();
