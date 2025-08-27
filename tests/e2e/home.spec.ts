import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page and display NPS Dashs title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Visão 360' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'NPS Dashs' })).toBeVisible();
  });

  test('should display NPS data or empty message', async ({ page }) => {
    await page.goto('/');
    // Espera por um dos estados: dados do NPS ou mensagem de vazio
    await expect(page.locator('text=Gauge Chart').or(page.locator('text=Nenhum feedback de NPS registrado ainda'))).toBeVisible();
  });

  // Teste de carregamento (esqueleto) - mais difícil de testar diretamente em E2E para Server Components
  // Poderíamos simular um atraso na API para verificar o esqueleto, mas por agora focamos no resultado final.
});
