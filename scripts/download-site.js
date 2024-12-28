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
        const command = `wget --mirror --convert-links --adjust-extension --page-requisites --no-parent -P "${distPath}" ${siteUrl}`;
        
        console.log('Starting site download...');
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                process.exit(1);
            }
            console.log('Site downloaded successfully!');
            if (stderr) console.error(`Warnings: ${stderr}`);
        });
    } catch (error) {
        console.error('Error downloading site:', error.message);
        process.exit(1);
    }
}

downloadSite();
