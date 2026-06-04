const { calcularNoches, calcularTotal, haysolapamiento } = require('../utils/calculos')

describe('calcularNoches - Cálculo de noches entre fechas', () => {

  test('debe retornar 3 para 3 días de diferencia', () => {
    expect(calcularNoches('2026-06-01', '2026-06-04')).toBe(3)
  })

  test('debe retornar 1 para 1 día de diferencia', () => {
    expect(calcularNoches('2026-06-01', '2026-06-02')).toBe(1)
  })

  test('debe retornar 7 para una semana exacta', () => {
    expect(calcularNoches('2026-06-01', '2026-06-08')).toBe(7)
  })

  test('debe retornar 30 para un mes', () => {
    expect(calcularNoches('2026-06-01', '2026-07-01')).toBe(30)
  })

  test('debe retornar negativo si fecha fin es antes de inicio', () => {
    expect(calcularNoches('2026-06-05', '2026-06-01')).toBeLessThan(0)
  })

})

describe('calcularTotal - Cálculo de precio total', () => {

  test('debe retornar 360000 para 3 noches a 120000', () => {
    expect(calcularTotal(3, 120000)).toBe(360000)
  })

  test('debe retornar 0 si hay 0 noches', () => {
    expect(calcularTotal(0, 120000)).toBe(0)
  })

  test('debe retornar 750000 para 3 noches a 250000', () => {
    expect(calcularTotal(3, 250000)).toBe(750000)
  })

  test('debe retornar 1494000 para 3 noches a 498000', () => {
    expect(calcularTotal(3, 498000)).toBe(1494000)
  })

  test('debe manejar precios decimales correctamente', () => {
    expect(calcularTotal(2, 120000.50)).toBeCloseTo(240001)
  })

})

describe('haysolapamiento - Validación de disponibilidad', () => {

  test('debe detectar solapamiento cuando las fechas se superponen parcialmente', () => {
    expect(haysolapamiento('2026-06-01', '2026-06-05', '2026-06-03', '2026-06-08')).toBe(true)
  })

  test('debe detectar solapamiento cuando una reserva está dentro de otra', () => {
    expect(haysolapamiento('2026-06-01', '2026-06-10', '2026-06-03', '2026-06-07')).toBe(true)
  })

  test('debe detectar solapamiento cuando las fechas son exactamente iguales', () => {
    expect(haysolapamiento('2026-06-01', '2026-06-05', '2026-06-01', '2026-06-05')).toBe(true)
  })

  test('no debe haber solapamiento cuando la segunda reserva es después', () => {
    expect(haysolapamiento('2026-06-01', '2026-06-05', '2026-06-06', '2026-06-10')).toBe(false)
  })

  test('no debe haber solapamiento cuando la segunda reserva es antes', () => {
    expect(haysolapamiento('2026-06-10', '2026-06-15', '2026-06-01', '2026-06-05')).toBe(false)
  })

})