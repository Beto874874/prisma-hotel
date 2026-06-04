import { test, expect } from '@playwright/test'

test.describe('Reservas', () => {

  test.beforeEach(async ({ page }) => {
    // Login antes de cada prueba
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="correo"]', 'test@prueba.com')
    await page.fill('input[name="contraseña"]', '1234')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('http://localhost:5173/home')
  })

  test('Las sedes se muestran en el home', async ({ page }) => {
    const cards = page.locator('.MuiCard-root')
    await expect(cards).toHaveCount(3)
  })

  test('Ver habitaciones de una sede', async ({ page }) => {
    await page.click('button:has-text("Ver habitaciones")')
    await expect(page).toHaveURL(/\/sede\/\d+/)
  })

  test('Mis reservas muestra las reservas del cliente', async ({ page }) => {
    await page.goto('http://localhost:5173/mis-reservas')
    await expect(page).toHaveURL('http://localhost:5173/mis-reservas')
    await expect(page.locator('h4')).toContainText('Mis Reservas')
  })

  test('Perfil muestra la información del cliente', async ({ page }) => {
    await page.goto('http://localhost:5173/perfil')
    await expect(page.locator('h4')).toBeVisible()
  })

})