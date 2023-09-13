let carrito = []; // Array para almacenar elementos del carrito

// Comprobar si hay algo en localStorage al cargar la página
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  actualizarBurbujaCarrito(); // Para actualizar la burbuja al cargar la página con el número de ítems en el carrito
}

// Función para agregar un elemento al carrito
function agregarAlCarrito(nombre, precio) {
  const comicExistente = carrito.find((item) => item.nombre === nombre); // Buscar si el cómic ya está en el carrito

  // Si el cómic ya existe en el carrito, aumenta su cantidad
  if (comicExistente) {
    comicExistente.cantidad++;
  } else {
    // Si no existe, agrega un nuevo objeto al carrito con ese cómic
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Mostrar el Toast
  mostrarToast();

  // Actualizar la burbuja del carrito con la cantidad total de ítems
  actualizarBurbujaCarrito();
}

// Función para mostrar el Toast de "Producto añadido"
function mostrarToast() {
  const toastElement = document.getElementById("toastAgregado");
  const toast = new bootstrap.Toast(toastElement, {
    delay: 2000,
  });
  toast.show();
}

// Función para actualizar la burbuja del carrito en la barra de navegación
function actualizarBurbujaCarrito() {
  const burbujaCarrito = document.getElementById("burbuja-carrito"); // Obtener el elemento HTML de la burbuja
  const totalCantidad = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  ); // Calcular la cantidad total de ítems
  burbujaCarrito.textContent = totalCantidad > 0 ? totalCantidad : ""; // Si hay ítems, muestra la cantidad, si no, deja vacío
}

function actualizarCarrito() {
  // 1. Limpiar el contenido actual del carrito
  const carritoModalLista = document.getElementById("carrito-modal");
  carritoModalLista.innerHTML = "";

  // 2. Agregar productos al carrito y calcular el total
  let total = 0;
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.cantidad}x ${item.nombre} - $${(
      item.precio * item.cantidad
    ).toFixed(2)}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = function () {
      eliminarDelCarrito(item.nombre);
    };

    li.appendChild(btnEliminar);
    carritoModalLista.appendChild(li);

    // Sumar al total
    total += item.precio * item.cantidad;

    localStorage.setItem("carrito", JSON.stringify(carrito));
  });

  // 3. Mostrar el total en el carrito
  const totalSpan = document.getElementById("total-modal");
  totalSpan.textContent = total.toFixed(2);
}

function eliminarDelCarrito(nombre) {
  // Encuentra el índice del producto en el arreglo carrito basado en su nombre
  const indice = carrito.findIndex((producto) => producto.nombre === nombre);
  if (indice !== -1) {
    // Si el producto tiene más de una cantidad, reduce esa cantidad
    if (carrito[indice].cantidad > 1) {
      carrito[indice].cantidad--;
    } else {
      // Si solo hay uno, elimina el producto completamente del carrito
      carrito.splice(indice, 1);
    }

    actualizarBurbujaCarrito();
    actualizarCarrito();
    mostrarModalCarrito(); // Para refrescar el modal
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

// Función para mostrar el modal del carrito al hacer clic en el icono del carrito
document.getElementById("abrirCarrito").addEventListener("click", function () {
  const carritoModalLista = document.getElementById("carrito-modal"); // Obtener el elemento HTML donde se listarán los ítems del carrito
  const totalModalElement = document.getElementById("total-modal"); // Obtener el elemento HTML donde se mostrará el total
  let totalModal = 0; // Variable para almacenar el total

  // Limpiar la lista modal previa
  carritoModalLista.innerHTML = "";

  // Recorrer el carrito y agregar elementos a la lista modal
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.cantidad}x ${item.nombre} - $${(
      item.precio * item.cantidad
    ).toFixed(2)}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = function () {
      eliminarDelCarrito(item.nombre);
    };

    li.appendChild(btnEliminar);
    carritoModalLista.appendChild(li);

    totalModal += item.precio * item.cantidad;
  });

  // Actualizar el total del modal
  totalModalElement.textContent = totalModal.toFixed(2);

  // Mostrar el modal usando Bootstrap
  $("#carritoModal").modal("show");
});
