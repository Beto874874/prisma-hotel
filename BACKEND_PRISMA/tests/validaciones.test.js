const { validarFormularioPago, formatearTarjeta } = require('../utils/calculos')

describe('validarFormularioPago - Validación del formulario de pago', () => {

  test('debe pasar sin errores con datos válidos', () => {
    const form = {
      nombre_titular: 'Juan García',
      numero_tarjeta: '1234 5678 9012 3456',
      fecha_vencimiento: '12/26',
      cvv: '123'
    }
    const errores = validarFormularioPago(form)
    expect(Object.keys(errores)).toHaveLength(0)
  })

  test('debe fallar con nombre vacío', () => {
    const form = {
      nombre_titular: '',
      numero_tarjeta: '1234 5678 9012 3456',
      fecha_vencimiento: '12/26',
      cvv: '123'
    }
    const errores = validarFormularioPago(form)
    expect(errores.nombre_titular).toBe('Requerido')
  })

  test('debe fallar con número de tarjeta incompleto', () => {
    const form = {
      nombre_titular: 'Juan García',
      numero_tarjeta: '1234 5678',
      fecha_vencimiento: '12/26',
      cvv: '123'
    }
    const errores = validarFormularioPago(form)
    expect(errores.numero_tarjeta).toBe('Número inválido')
  })

  test('debe fallar con CVV de 2 dígitos', () => {
    const form = {
      nombre_titular: 'Juan García',
      numero_tarjeta: '1234 5678 9012 3456',
      fecha_vencimiento: '12/26',
      cvv: '12'
    }
    const errores = validarFormularioPago(form)
    expect(errores.cvv).toBe('CVV inválido')
  })

  test('debe fallar con CVV de 4 dígitos', () => {
    const form = {
      nombre_titular: 'Juan García',
      numero_tarjeta: '1234 5678 9012 3456',
      fecha_vencimiento: '12/26',
      cvv: '1234'
    }
    const errores = validarFormularioPago(form)
    expect(errores.cvv).toBe('CVV inválido')
  })

  test('debe fallar con fecha de vencimiento sin slash', () => {
    const form = {
      nombre_titular: 'Juan García',
      numero_tarjeta: '1234 5678 9012 3456',
      fecha_vencimiento: '1226',
      cvv: '123'
    }
    const errores = validarFormularioPago(form)
    expect(errores.fecha_vencimiento).toBe('Fecha inválida')
  })

  test('debe reportar todos los errores a la vez', () => {
    const form = {
      nombre_titular: '',
      numero_tarjeta: '1234',
      fecha_vencimiento: '12',
      cvv: '1'
    }
    const errores = validarFormularioPago(form)
    expect(Object.keys(errores)).toHaveLength(4)
  })

})

describe('formatearTarjeta - Formato del número de tarjeta', () => {

  test('debe formatear 16 dígitos con espacios cada 4', () => {
    expect(formatearTarjeta('1234567890123456')).toBe('1234 5678 9012 3456')
  })

  test('debe eliminar letras y dejar solo números', () => {
    expect(formatearTarjeta('1234abcd56789012')).toBe('1234 5678 9012')
  })

  test('debe limitar a 16 dígitos máximo', () => {
    const resultado = formatearTarjeta('12345678901234567890')
    expect(resultado.replace(/\s/g, '').length).toBeLessThanOrEqual(16)
  })

  test('debe retornar vacío con entrada vacía', () => {
    expect(formatearTarjeta('')).toBe('')
  })

})