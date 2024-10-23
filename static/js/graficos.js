const barCtx = document.getElementById("barChart").getContext("2d");
const pieCtx = document.getElementById("pieChart").getContext("2d");
let barChart = null;
let pieChart = null;

// Genera un conjunto de colores para cada barra y sección de la torta
function generarColores(cantidad) {
  const coloresBar = [
    "rgba(255, 99, 132, 0.3)",
    "rgba(54, 162, 235, 0.3)",
    "rgba(255, 206, 86, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(153, 102, 255, 0.3)",
    "rgba(255, 159, 64, 0.3)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(54, 162, 235, 0.3)",
    "rgba(255, 206, 86, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(153, 102, 255, 0.3)",
    "rgba(255, 159, 64, 0.3)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(54, 162, 235, 0.3)",
    "rgba(255, 206, 86, 0.3)",
  ];
  const coloresPie = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 25, 15)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 25, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
  ];
  const bordes = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
  ];

  return {
    backgroundColorsBar: coloresBar.slice(0, cantidad),
    backgroundColorsPie: coloresPie.slice(0, cantidad),
    borderColors: bordes.slice(0, cantidad),
  };
}

function actualizarGraficos(datos) {
    const especies = datos.map((item) => item.Especie);
    const registros = datos.map((item) => item.Registros);
    const enlaces = datos.map((item) => item.CBC);  // Traer los enlaces de cada especie

    // Generar colores para la cantidad de especies
    const { backgroundColorsBar, backgroundColorsPie, borderColors } = generarColores(especies.length);

    // Destruir los gráficos previos si existen
    if (barChart) {
        barChart.destroy();
    }
    if (pieChart) {
        pieChart.destroy();
    }

    // Crear gráfico de barras 
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: especies,
            datasets: [{
                label: 'Registros por Especie',
                data: registros,
                backgroundColor: backgroundColorsBar,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',  // Cambia la orientación del gráfico de barras (eje Y con nombres)
            scales: {
                x: {
                    beginAtZero: true  // El eje X empezará en 0
                }
            },
            onClick: function(evt, activeElements) {
                if (activeElements.length > 0) {
                    const index = activeElements[0].index;
                    const enlace = enlaces[index];
                    if (enlace && enlace !== 'NA') {
                        window.open(enlace, '_blank');  // Abre el enlace en una nueva pestaña
                    }
                }
            }
        }
    });

    // Crear gráfico de torta con labels a la derecha
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: especies,
            datasets: [{
                label: 'Registros por Especie',
                data: registros,
                backgroundColor: backgroundColorsPie,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right',  // Mueve las etiquetas a la derecha
                    labels: {
                        boxWidth: 20  // Tamaño del recuadro de color en la leyenda
                    }
                }
            },
            onClick: function(evt, activeElements) {
                if (activeElements.length > 0) {
                    const index = activeElements[0].index;
                    const enlace = enlaces[index];
                    if (enlace && enlace !== 'NA') {
                        window.open(enlace, '_blank');  // Abre el enlace en una nueva pestaña
                    }
                }
            }
        }
    });
}

function cargarDatos() {
    const departamento = document.getElementById('departamento').value;
    const reino = document.getElementById('reino').value;
    const limite = document.getElementById('limite').value;

    fetch(`/filtrar-datos?departamento=${departamento}&reino=${reino}&limite=${limite}`)
        .then(response => response.json())
        .then(data => actualizarGraficos(data));
}

document.getElementById('departamento').addEventListener('change', cargarDatos);
document.getElementById('reino').addEventListener('change', cargarDatos);
document.getElementById('limite').addEventListener('change', cargarDatos);

// Cargar datos iniciales
cargarDatos();
