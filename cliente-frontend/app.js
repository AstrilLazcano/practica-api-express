// URL de nuestra API REST (backend)
const API_URL = 'http://localhost:3000/api/recursos';

// Variable global para la gráfica
let miGrafica = null;

// ============================================
// Función principal: consumir la API y renderizar
// ============================================
async function cargarDatos() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const libros = await respuesta.json();
    console.log('✅ Datos recibidos:', libros);

    // Renderizar la tabla
    renderizarTabla(libros);

    // Renderizar la gráfica
    renderizarGrafica(libros);

  } catch (error) {
    console.error('❌ Error al consumir la API:', error);
    document.getElementById('tabla-datos').innerHTML = `
      <div class="error">
        <strong>Error al conectar con la API</strong><br>
        ${error.message}<br><br>
        Verifica que el servidor Node.js esté corriendo en <code>http://localhost:3000</code>
      </div>
    `;
  }
}

// ============================================
// Renderizar la tabla HTML con los datos
// ============================================
function renderizarTabla(libros) {
  const contenedor = document.getElementById('tabla-datos');

  if (!libros || libros.length === 0) {
    contenedor.innerHTML = '<p class="loading">No hay libros registrados.</p>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Autor</th>
          <th>Fecha de creación</th>
        </tr>
      </thead>
      <tbody>
  `;

  libros.forEach(libro => {
    const fecha = libro.created_at
      ? new Date(libro.created_at).toLocaleDateString('es-MX')
      : 'N/A';

    html += `
      <tr>
        <td>${libro.id}</td>
        <td>${libro.nombre}</td>
        <td>${libro.autor}</td>
        <td>${fecha}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  contenedor.innerHTML = html;
}

// ============================================
// Renderizar la gráfica con Chart.js
// ============================================
function renderizarGrafica(libros) {
  // Extraer etiquetas (nombres de libros) y valores
  const etiquetas = libros.map(libro => libro.nombre);
  const valores = libros.map((_, index) => index + 1); // Valor ficticio: 1, 2, 3...

  // Alternativa más útil: contar libros por autor
  // const conteoAutores = {};
  // libros.forEach(l => { conteoAutores[l.autor] = (conteoAutores[l.autor] || 0) + 1; });
  // const etiquetas = Object.keys(conteoAutores);
  // const valores = Object.values(conteoAutores);

  const ctx = document.getElementById('miGrafica').getContext('2d');

  // Destruir gráfica anterior si existe (evita duplicados al recargar)
  if (miGrafica) {
    miGrafica.destroy();
  }

  miGrafica = new Chart(ctx, {
    type: 'bar',   // Puedes cambiar a 'pie', 'line', 'doughnut'
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Libros disponibles',
        data: valores,
        backgroundColor: [
          'rgba(102, 126, 234, 0.7)',
          'rgba(118, 75, 162, 0.7)',
          'rgba(237, 100, 166, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(237, 100, 166, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Cantidad de libros registrados',
          font: { size: 16 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// ============================================
// Ejecutar al cargar la página
// ============================================
document.addEventListener('DOMContentLoaded', cargarDatos);
