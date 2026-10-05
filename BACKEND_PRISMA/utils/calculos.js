const calcularNoches = (fecha_inicio, fecha_fin) => {
  const inicio = new Date(fecha_inicio)
  const fin = new Date(fecha_fin)
  return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24))
}

const calcularTotal = (noches, precio_noche) => {
  return noches * Number(precio_noche)
}

const haysolapamiento = (inicio1, fin1, inicio2, fin2) => {
  const i1 = new Date(inicio1)
  const f1 = new Date(fin1)
  const i2 = new Date(inicio2)
  const f2 = new Date(fin2)
  return (i1 <= f2 && f1 >= i2)
}

const getImageUrl = (ruta) => {
  if (!ruta) return null
  if (ruta.startsWith('uploads/')) return `http://localhost:5000/${ruta}`
  return `/${ruta}`
}

const validarFormularioPago = (form) => {
  const errores = {}
  if (!form.nombre_titular) errores.nombre_titular = 'Requerido'
  if (form.numero_tarjeta.replace(/\s/g, '').length !== 16) errores.numero_tarjeta = 'Número inválido'
  if (form.fecha_vencimiento.length !== 5) errores.fecha_vencimiento = 'Fecha inválida'
  if (form.cvv.length !== 3) errores.cvv = 'CVV inválido'
  return errores
}

const formatearTarjeta = (valor) => {
  return valor.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

module.exports = {
  calcularNoches,
  calcularTotal,
  haysolapamiento,
  getImageUrl,
  validarFormularioPago,
  formatearTarjeta
}