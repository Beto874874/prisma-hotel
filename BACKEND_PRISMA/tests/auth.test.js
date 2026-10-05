const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET = 'prisma_hotel_secret_test'

describe('bcrypt - Encriptación de contraseñas', () => {

  test('hash debe encriptar la contraseña correctamente', async () => {
    const contrasena = '874874'
    const hash = await bcrypt.hash(contrasena, 10)
    expect(hash).not.toBe(contrasena)
    expect(hash).toMatch(/^\$2b\$/)
  })

  test('compare debe retornar true con la contraseña correcta', async () => {
    const contrasena = '874874'
    const hash = await bcrypt.hash(contrasena, 10)
    const resultado = await bcrypt.compare(contrasena, hash)
    expect(resultado).toBe(true)
  })

  test('compare debe retornar false con contraseña incorrecta', async () => {
    const contrasena = '874874'
    const hash = await bcrypt.hash(contrasena, 10)
    const resultado = await bcrypt.compare('contraseñaWrong', hash)
    expect(resultado).toBe(false)
  })

  test('dos hashes del mismo password deben ser diferentes', async () => {
    const contrasena = '874874'
    const hash1 = await bcrypt.hash(contrasena, 10)
    const hash2 = await bcrypt.hash(contrasena, 10)
    expect(hash1).not.toBe(hash2)
  })

})

describe('JWT - Generación y verificación de tokens', () => {

  test('sign debe generar un token con 3 partes separadas por punto', () => {
    const payload = { id: 1, correo: 'test@test.com', rol: 'cliente' }
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' })
    expect(token.split('.')).toHaveLength(3)
  })

  test('verify debe decodificar correctamente el payload', () => {
    const payload = { id: 1, correo: 'test@test.com', rol: 'cliente' }
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' })
    const decoded = jwt.verify(token, SECRET)
    expect(decoded.id).toBe(1)
    expect(decoded.correo).toBe('test@test.com')
    expect(decoded.rol).toBe('cliente')
  })

  test('verify debe lanzar error con token inválido', () => {
    expect(() => {
      jwt.verify('tokeninvalido123', SECRET)
    }).toThrow()
  })

  test('verify debe lanzar error con secreto incorrecto', () => {
    const token = jwt.sign({ id: 1 }, SECRET)
    expect(() => {
      jwt.verify(token, 'secretoIncorrecto')
    }).toThrow()
  })

  test('token de cliente debe tener rol cliente', () => {
    const token = jwt.sign({ id: 1, rol: 'cliente' }, SECRET)
    const decoded = jwt.verify(token, SECRET)
    expect(decoded.rol).toBe('cliente')
  })

  test('token de admin debe tener rol admin', () => {
    const token = jwt.sign({ id: 1, rol: 'admin' }, SECRET)
    const decoded = jwt.verify(token, SECRET)
    expect(decoded.rol).toBe('admin')
  })

})