import { test, expect } from '@playwright/test'

test.describe('Panel Admin', () => {

  test.beforeEach(async ({ page }) => {
    // Login como admin antes de cada prueba
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="correo"]', 'juanaaa874@gmail.com')
    await page.fill('input[name="contraseña"]', '1234')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('http://localhost:5173/admin')
  })

  test('Dashboard admin muestra las 3 opciones', async ({ page }) => {
    await expect(page.locator('.MuiCard-root')).toHaveCount(3)
  })

  test('Navegar a gestión de sedes', async ({ page }) => {
    await page.click('button:has-text("Sedes")')
    await expect(page).toHaveURL('http://localhost:5173/admin/sedes')
    await expect(page.locator('h4')).toContainText('Gestión de Sedes')
  })

  test('Navegar a gestión de habitaciones', async ({ page }) => {
    await page.click('button:has-text("Habitaciones")')
    await expect(page).toHaveURL('http://localhost:5173/admin/habitaciones')
    await expect(page.locator('h4')).toContainText('Gestión de Habitaciones')
  })

  test('Navegar a gestión de reservas', async ({ page }) => {
    await page.click('button:has-text("Reservas")')
    await expect(page).toHaveURL('http://localhost:5173/admin/reservas')
    await expect(page.locator('h4')).toContainText('Gestión de Reservas')
  })

  test('Cerrar sesión admin redirige al login', async ({ page }) => {
    await page.click('button:has-text("Cerrar sesión")')
    await expect(page).toHaveURL('http://localhost:5173/login')
  })

})