import { chromium} from 'playwright';
import {FgRes} from "../types/types.js"

export async function GetGameFromFg(name:string):Promise<FgRes>{
    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage()
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("https://fitgirl-repacks.site/")

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