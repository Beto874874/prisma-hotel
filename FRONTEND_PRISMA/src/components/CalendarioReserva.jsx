import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import { obtenerFechasOcupadas } from '../services/reservaService'
import { Box, Typography } from '@mui/material'

const CalendarioReserva = ({ id_habitacion, onRangoSeleccionado }) => {
  const [range, setRange] = useState(undefined)
  const [diasOcupados, setDiasOcupados] = useState([])

  useEffect(() => {
    const cargarFechas = async () => {
      try {
        const fechas = await obtenerFechasOcupadas(id_habitacion)
        // Convertir rangos de fechas ocupadas a días individuales
        const dias = []
        fechas.forEach(({ fecha_inicio, fecha_fin }) => {
          const inicio = new Date(fecha_inicio)
          const fin = new Date(fecha_fin)
          const actual = new Date(inicio)
          while (actual <= fin) {
            dias.push(new Date(actual))
            actual.setDate(actual.getDate() + 1)
          }
        })
        setDiasOcupados(dias)
      } catch (error) {
        console.error('Error al cargar fechas ocupadas:', error)
      }
    }
    if (id_habitacion) cargarFechas()
  }, [id_habitacion])

  const handleSelect = (rango) => {
    setRange(rango)
    if (rango?.from && rango?.to) {
      onRangoSeleccionado(rango)
    }
  }

  const estilos = `
    .rdp {
      --rdp-accent-color: #2890BD;
      --rdp-background-color: #D1F3FF;
      margin: 0;
    }
    .rdp-day_selected {
      background-color: #2890BD !important;
      color: white !important;
    }
    .rdp-day_range_middle {
      background-color: #D1F3FF !important;
      color: #1A1A1A !important;
    }
    .rdp-day_disabled {
      color: #ccc !important;
      text-decoration: line-through;
    }
  `

  return (
    <Box>
      <style>{estilos}</style>
      <Typography variant="caption" fontFamily="Raleway" color="text.secondary" mb={1} display="block">
        Selecciona las fechas de tu estadía
      </Typography>
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        locale={es}
        disabled={[
          { before: new Date() },
          ...diasOcupados
        ]}
        numberOfMonths={1}
      />
    </Box>
  )
}

export default CalendarioReserva