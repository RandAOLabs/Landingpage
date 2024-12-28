const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const { mkdirp } = require('mkdirp');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

async function downloadFile(url, outputPath) {
    try {
        const response = await fetch(url, { agent });
        const content = await response.text();
        await fs.writeFile(outputPath, content);
        console.log(`Downloaded: ${url}`);
    } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
    }
}

async function processHTML(content, baseUrl, outputDir) {
    const $ = cheerio.load(content);
    
    // Download CSS files
    $('link[rel="stylesheet"]').each(async (_, element) => {
        const href = $(element).attr('href');
        if (href) {
            const absoluteUrl = new URL(href, baseUrl).toString();
            const cssPath = path.join(outputDir, 'css', path.basename(href));
            await mkdirp(path.dirname(cssPath));
            await downloadFile(absoluteUrl, cssPath);
        }
    });

    // Download JS files
    $('script[src]').each(async (_, element) => {
        const src = $(element).attr('src');
        if (src) {
            const absoluteUrl = new URL(src, baseUrl).toString();
            const jsPath = path.join(outputDir, 'js', path.basename(src));
            await mkdirp(path.dirname(jsPath));
            await downloadFile(absoluteUrl, jsPath);
        }
    });

    // Download images
    $('img[src]').each(async (_, element) => {
        const src = $(element).attr('src');
        if (src) {
            const absoluteUrl = new URL(src, baseUrl).toString();
            const imgPath = path.join(outputDir, 'images', path.basename(src));
            await mkdirp(path.dirname(imgPath));
            await downloadFile(absoluteUrl, imgPath);
        }
    });

    return $.html();
}

async function downloadSite() {
    try {
        const siteUrl = process.env.SITE_URL;
        if (!siteUrl) {
            throw new Error('SITE_URL environment variable is not set');
        }

        const baseUrl = new URL(siteUrl);
        const distPath = path.join(__dirname, '..', 'dist');
        
        // Create dist directory
        await mkdirp(distPath);
        
        console.log('Starting site download...');
        
        // Download main page
        const response = await fetch(siteUrl, { agent });
        const content = await response.text();
        
        // Process and save main page
        const processedContent = await processHTML(content, siteUrl, distPath);
        await fs.writeFile(path.join(distPath, 'index.html'), processedContent);
        
        console.log('Site downloaded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error downloading site:', error.message);
        process.exit(1);
    }
}

downloadSite();
