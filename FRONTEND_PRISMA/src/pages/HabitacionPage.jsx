import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerHabitacionPorId } from "../services/habitacionService";
import { crearReserva } from "../services/reservaService";
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import {
  AttachMoney,
  Person,
  CalendarMonth,
  ArrowBack,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import CalendarioReserva from "../components/CalendarioReserva";

const getImageUrl = (ruta) => {
  if (!ruta) return null;
  if (ruta.startsWith("uploads/")) return `http://localhost:5000/${ruta}`;
  return `/${ruta}`;
};

const HabitacionPage = () => {
  const { id_habitacion } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [habitacion, setHabitacion] = useState(null);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    cantidad_personas: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerHabitacionPorId(id_habitacion);
        setHabitacion(datos);
      } catch (error) {
        console.error("Error al cargar habitación:", error);
      }
    };
    cargar();
  }, [id_habitacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cantidad_personas") {
      if (value === "") {
        setForm({ ...form, [name]: "" });
        return;
      }

      const numero = Number(value);

      // mínimo 1 persona
      if (numero < 1) {
        setForm({ ...form, [name]: "" });
        return;
      }

      // límite máximo dinámico según la capacidad de la habitación
      if (habitacion && numero > habitacion.capacidad_personas) {
        setForm({ ...form, [name]: habitacion.capacidad_personas });
        return;
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleRangoSeleccionado = (rango) => {
    setForm({
      ...form,
      fecha_inicio: rango.from.toISOString().split("T")[0],
      fecha_fin: rango.to.toISOString().split("T")[0],
    });
  };

  const calcularNoches = () => {
    if (!form.fecha_inicio || !form.fecha_fin) return 0;
    const inicio = new Date(form.fecha_inicio);
    const fin = new Date(form.fecha_fin);
    return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
  };

  const calcularTotal = () => {
    return calcularNoches() * Number(habitacion?.precio_noche || 0);
  };

  const handleReservar = async () => {
    setError(null);
    const noches = calcularNoches();
    if (noches <= 0) return setError("Las fechas no son válidas");
    if (Number(form.cantidad_personas) > habitacion.capacidad_personas) {
      return setError(
        `La capacidad máxima es ${habitacion.capacidad_personas} personas`,
      );
    }
    try {
      await crearReserva(
        {
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin,
          cantidad_personas: form.cantidad_personas,
          id_habitacion: habitacion.id_habitacion,
        },
        token,
      );
      setDialogAbierto(false);
      navigate("/mis-reservas");
    } catch (err) {
      console.error("Error al crear reserva:", err);
      setError("La habitación no está disponible en esas fechas");
    }
  };

  const colorEstado = (estado) => {
    if (estado === "Disponible") return "success";
    if (estado === "Ocupada") return "error";
    return "warning";
  };

  if (!habitacion) return null;

  return (
    <Box
      sx={{
        backgroundColor: "#F8F9FA",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ fontFamily: "Raleway", mb: 3 }}
        >
          Volver
        </Button>

        {/* Carrusel grande */}
        <Box sx={{ borderRadius: 3, overflow: "hidden", mb: 4 }}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            navigation={true}
            loop={true}
            style={{ height: 500 }}
          >
            {habitacion.imagenes.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={getImageUrl(img)}
                  alt={habitacion.tipo}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    cursor: "zoom-in",
                  }}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxAbierto(true);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Info y botón */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography variant="h4" fontFamily="Lato" fontWeight={700}>
                Habitación {habitacion.numero} — {habitacion.tipo}
              </Typography>
              <Chip
                label={habitacion.estado}
                color={colorEstado(habitacion.estado)}
                sx={{ fontFamily: "Raleway" }}
              />
            </Box>

            <Typography
              variant="body1"
              fontFamily="Raleway"
              color="text.secondary"
              mb={3}
            >
              {habitacion.descripcion}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AttachMoney sx={{ color: "#2890BD" }} />
                <Box>
                  <Typography
                    variant="caption"
                    fontFamily="Raleway"
                    color="text.secondary"
                  >
                    Precio por noche
                  </Typography>
                  <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                    ${Number(habitacion.precio_noche).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person sx={{ color: "#2890BD" }} />
                <Box>
                  <Typography
                    variant="caption"
                    fontFamily="Raleway"
                    color="text.secondary"
                  >
                    Capacidad
                  </Typography>
                  <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                    {habitacion.capacidad_personas} personas
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={habitacion.estado !== "Disponible"}
              onClick={() => setDialogAbierto(true)}
              sx={{
                fontFamily: "Raleway",
                fontWeight: 700,
                py: 2,
                borderRadius: 2,
              }}
            >
              {habitacion.estado === "Disponible"
                ? "Reservar ahora"
                : "No disponible"}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Dialog reserva */}
      <Dialog
        open={dialogAbierto}
        onClose={() => setDialogAbierto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontFamily="Lato" fontWeight={700} sx={{ pb: 0 }}>
          Reservar — Hab. {habitacion.numero} ({habitacion.tipo})
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            pt: "24px !important",
          }}
        >
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <CalendarioReserva
            id_habitacion={habitacion.id_habitacion}
            onRangoSeleccionado={handleRangoSeleccionado}
          />

          <TextField
            label="Cantidad de personas"
            name="cantidad_personas"
            type="number"
            value={form.cantidad_personas}
            onChange={handleChange}
            fullWidth
          />

          {calcularNoches() > 0 && (
            <Box sx={{ backgroundColor: "#D1F3FF", borderRadius: 2, p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonth sx={{ color: "#2890BD" }} />
                <Typography variant="body2" fontFamily="Raleway">
                  {calcularNoches()} noches —{" "}
                  {new Date(form.fecha_inicio).toLocaleDateString("es-CO")} →{" "}
                  {new Date(form.fecha_fin).toLocaleDateString("es-CO")}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <AttachMoney sx={{ color: "#2890BD" }} />
                <Typography
                  variant="body1"
                  fontFamily="Raleway"
                  fontWeight={700}
                >
                  Total: ${calcularTotal().toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogAbierto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleReservar}
            disabled={
              !form.fecha_inicio || !form.fecha_fin || !form.cantidad_personas
            }
            sx={{ fontFamily: "Raleway", borderRadius: 2 }}
          >
            Confirmar reserva
          </Button>
        </DialogActions>
      </Dialog>

      <Lightbox
        open={lightboxAbierto}
        close={() => setLightboxAbierto(false)}
        index={lightboxIndex}
        slides={habitacion.imagenes.map((img) => ({ src: getImageUrl(img) }))}
      />

      <Footer />
    </Box>
  );
};

export default HabitacionPage;
