import { test, expect } from '@playwright/test';

test.describe('Chat Page', () => {
  test('should load the chat page and display title', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.getByRole('heading', { name: 'Visão 360' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Falar com IA' })).toBeVisible();
    await expect(page.getByPlaceholder('Olá, como posso ajudar?')).toBeVisible();
  });

  test('should send a message and receive an AI reply', async ({ page }) => {
    await page.goto('/chat');

    // Garante que o input está visível e habilitado
    const chatInput = page.getByLabel('Campo de entrada de mensagem para o AI');
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toBeEnabled();

    // Digita uma mensagem
    await chatInput.fill('Olá, qual é o seu propósito?');

    // Clica no botão de enviar
    const sendButton = page.getByLabel('Enviar mensagem');
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // Espera que o spinner de "Digitando..." apareça e desapareça
    await expect(page.getByText('Digitando...')).toBeVisible();
    await expect(page.getByText('Digitando...')).toBeHidden();

    // Espera pela resposta da IA
    // A resposta da IA terá 'type: ai' no histórico, e esperamos que apareça na tela
    // Vamos procurar por qualquer texto que não seja o placeholder inicial
    await expect(page.locator('pre.font-inter').first()).not.toContainText('Olá, como posso ajudar? Pergunte sobre NPS, avaliações de produtos, feedback de vendedores, etc.');
    await expect(page.locator('pre.font-inter').last()).toBeVisible();
  });
});
