const { getImageUrl } = require('../utils/calculos')

describe('getImageUrl - Resolución de URLs de imágenes', () => {

  test('debe retornar URL del backend para rutas uploads/', () => {
    expect(getImageUrl('uploads/sedes/imagen.jpg'))
      .toBe('http://localhost:5000/uploads/sedes/imagen.jpg')
  })

  test('debe retornar URL del frontend para rutas img/', () => {
    expect(getImageUrl('img/sedes/sede_cartagena1.jpg'))
      .toBe('/img/sedes/sede_cartagena1.jpg')
  })

  test('debe retornar null si la ruta es null', () => {
    expect(getImageUrl(null)).toBeNull()
  })

  test('debe retornar null si la ruta es undefined', () => {
    expect(getImageUrl(undefined)).toBeNull()
  })

  test('debe retornar URL del backend para imágenes de habitaciones subidas', () => {
    expect(getImageUrl('uploads/habitaciones/1234567890.jpg'))
      .toBe('http://localhost:5000/uploads/habitaciones/1234567890.jpg')
  })

  test('debe retornar URL del frontend para imágenes de habitaciones originales', () => {
    expect(getImageUrl('img/habitaciones/hab_basica_cartagena1.jpg'))
      .toBe('/img/habitaciones/hab_basica_cartagena1.jpg')
  })

})