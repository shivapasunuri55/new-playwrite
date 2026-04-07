import { expect, Locator, Page, BrowserContext, Browser } from '@playwright/test';
import { BasePage } from '@/pages/base.page';

export class FlipkartPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    async openHomeAndVerifyLoaded(url: string = 'https://flipkart.com'): Promise<void> {
        await this.navigateTo(url);
        await expect(this.page).toHaveURL(/flipkart/i);

        const searchTextbox = this.page.getByRole('textbox', { name: 'Search for Products, Brands' });
        await searchTextbox.waitFor({ state: 'visible' });
    }

    async enterSearchQuery(query: string): Promise<void> {
        const searchTextbox = this.page.getByRole('textbox', { name: 'Search for Products, Brands' });
        await searchTextbox.fill(query);
    }

    async submitSearchWithEnter(): Promise<void> {
        await this.page.keyboard.press('Enter');
    }

    async openFirstResultAndWaitForPdp(): Promise<void> {
        const firstResultLink = this.page.getByRole('link', {
            name: 'Bestseller Apple iPhone 17 (Black, 256 GB) Add to Compare Apple iPhone 17 ('
        });

        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            firstResultLink.click()
        ]);

        // Flipkart PDP URLs commonly contain '/p/'
        await this.page.waitForURL(/\/p\//, { timeout: this.page.timeout() });
    }

    async verifyPdpLoaded(): Promise<void> {
        const buyNowText = this.page.getByText('Buy nowat ₹');
        await expect(buyNowText).toBeVisible();
    }

    async addToCartAndVerify(addToCart?: Locator | string): Promise<void> {
        if (!addToCart) {
            throw new Error(
                "Add to Cart locator missing. Provide a Locator or selector string to addToCartAndVerify(addToCart)."
            );
        }

        const addToCartLocator = typeof addToCart === 'string' ? this.page.locator(addToCart) : addToCart;
        await addToCartLocator.click();

        // TODO: Verification requires cart page/mini-cart locators and expected product title.
        // Example future implementation:
        // - capture PDP title
        // - navigate to cart
        // - assert cart contains title
    }
}
