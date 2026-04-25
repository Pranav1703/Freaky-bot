import { chromium} from 'playwright';
import {FgRes} from "../types/types.js"

export async function GetGameFromFg(name:string):Promise<FgRes>{
    const browser = await chromium.launch({
        headless: true,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("https://fitgirl-repacks.site/", { 
        timeout: 60000,
        waitUntil: "domcontentloaded"  // More lenient than "load"
    });

    await page.locator(".search-toggle").click()
    await page.locator(".search-field").fill(name)
    await page.keyboard.press("Enter")

    const searchResult = await page.locator("#content article").first()
    await searchResult.locator(".entry-title").click()
 
    const title = await page.locator(".entry-title").textContent() as string

    const linksEle = await page.locator(".entry-content > ul:nth-of-type(2) > li").first()
    const magnetLink = await linksEle.locator("a:nth-of-type(2)").getAttribute("href") as string
    const count = await linksEle.locator("a:nth-of-type(3)").count()
    if(count > 0){
        const pagePromise = page.waitForEvent('popup');
        await linksEle.locator("a:nth-of-type(3)").click()
        const downloadPage = await pagePromise
        await downloadPage.waitForLoadState()

        const downloadPromise = downloadPage.waitForEvent('download');
        const torrentFileLink = await downloadPage.locator("a.alert-link").click()
        const download = await downloadPromise;

        await download.saveAs(`./downloads/${download.suggestedFilename()}`); 
    }

    await browser.close()
    return {
        Title: title,
        MagnetLink: magnetLink
    }
}