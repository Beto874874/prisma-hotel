import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {

  test('Login exitoso como cliente', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="correo"]', 'prueba1@gmail.com')
    await page.fill('input[name="contraseña"]', '123456')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('http://localhost:5173/home')
  })

    test('Login fallido con contraseña incorrecta', async ({ page }) => {
        await page.goto('http://localhost:5173/login')
        await page.fill('input[name="correo"]', 'prueba1@gmail.com')
        await page.fill('input[name="contraseña"]', 'wrongpassword')
        await page.click('button[type="submit"]')
        await expect(page.locator('text=Correo o contraseña incorrectos')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/login')
    })

  test('Login exitoso como admin', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="correo"]', 'juanaaa874@gmail.com')
    await page.fill('input[name="contraseña"]', '1234')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('http://localhost:5173/admin')
  })

  test('Redirige al login si no hay sesión', async ({ page }) => {
    await page.goto('http://localhost:5173/home')
    await expect(page).toHaveURL('http://localhost:5173/login')
  })

  test('Cliente no puede acceder a /admin', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="correo"]', 'prueba1@gmail.com')
    await page.fill('input[name="contraseña"]', '123456')
    await page.click('button[type="submit"]')
    await page.goto('http://localhost:5173/admin')
    await expect(page).toHaveURL('http://localhost:5173/login')
  })

  test('Cerrar sesión redirige al login', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.fill('input[name="correo"]', 'prueba1@gmail.com')
    await page.fill('input[name="contraseña"]', '123456')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('http://localhost:5173/home')
    await page.click('button:has-text("Cerrar sesión")')
    await expect(page).toHaveURL('http://localhost:5173/login')
  })

})