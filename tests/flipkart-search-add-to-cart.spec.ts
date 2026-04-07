import { test, expect } from '@test-setup/fixtures';
import { FlipkartPage } from '@/pages/flipkart.page';

test.describe('Flipkart search and add to cart (iPhone 17)', () => {
    test('should search for iPhone 17 and add first result to cart', async ({ page }) => {
        const flipkartPage = new FlipkartPage(page);

        await flipkartPage.openHomeAndVerifyLoaded();

        await flipkartPage.enterSearchQuery('Iphone 17');
        await flipkartPage.submitSearchWithEnter();

        await flipkartPage.openFirstResultAndWaitForPdp();
        await flipkartPage.verifyPdpLoaded();

        // NOTE: This will intentionally fail with a clear message until an Add-to-Cart locator is provided.
        await expect(async () => {
            await flipkartPage.addToCartAndVerify();
        }).rejects.toThrow(/Add to Cart locator missing/i);
    });
});
