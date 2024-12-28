const { exec } = require('child_process');
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
        
        // Use wget to mirror the entire site
        // Adding -q for quieter output and --tries=3 for retry attempts
        const command = `wget --mirror --convert-links --adjust-extension --page-requisites --no-parent -q --tries=3 -P "${distPath}" ${siteUrl}`;
        
        console.log('Starting site download...');
        exec(command, (error, stdout, stderr) => {
            // We'll consider the download successful even if there are some 404s
            if (error && error.code !== 1) {
                console.error(`Error: ${error}`);
                process.exit(1);
            }
            console.log('Site downloaded successfully!');
            // Only show critical errors
            if (stderr && !stderr.includes('ERROR 404')) {
                console.error(`Critical errors: ${stderr}`);
            }
            process.exit(0); // Explicitly exit with success
        });
    } catch (error) {
        console.error('Error downloading site:', error.message);
        process.exit(1);
    }
}

downloadSite();
