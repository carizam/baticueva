const carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Iniciar carrito desde localStorage o usar un array vacío

// Función para agregar un elemento al carrito
function agregarAlCarrito(nombre, precio) {
  const comicExistente = carrito.find((item) => item.nombre === nombre);

  if (comicExistente) {
    comicExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
  mostrarToast();
  actualizarBurbujaCarrito();
  guardarCarritoEnLocalStorage();
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
  const burbujaCarrito = document.getElementById("burbuja-carrito");
  const totalCantidad = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );
  burbujaCarrito.textContent = totalCantidad > 0 ? totalCantidad : "";
}

function actualizarCarrito() {
  const carritoModalLista = document.getElementById("carrito-modal");
  carritoModalLista.innerHTML = "";

  let total = 0;
  carrito.forEach((item) => {
    const li = document.createElement("li");

    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "+";
    btnAgregar.onclick = function () {
      agregarAlCarrito(item.nombre, item.precio);
    };

    const btnRestar = document.createElement("button");
    btnRestar.textContent = "-";
    btnRestar.onclick = function () {
      restarDelCarrito(item.nombre);
    };

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = function () {
      eliminarDelCarrito(item.nombre);
    };

    li.textContent = `${item.cantidad}x ${item.nombre} - $${(
      item.precio * item.cantidad
    ).toFixed(2)}`;

    li.appendChild(btnAgregar);
    li.appendChild(btnRestar);
    li.appendChild(btnEliminar);
    carritoModalLista.appendChild(li);

    total += item.precio * item.cantidad;
  });

  const totalSpan = document.getElementById("total-modal");
  totalSpan.textContent = total.toFixed(2);
}

function restarDelCarrito(nombre) {
  const indice = carrito.findIndex((producto) => producto.nombre === nombre);
  if (indice !== -1 && carrito[indice].cantidad > 1) {
    carrito[indice].cantidad--;
    actualizarCarrito();
    actualizarBurbujaCarrito();
    guardarCarritoEnLocalStorage();
  }
}

function eliminarDelCarrito(nombre) {
  const indice = carrito.findIndex((producto) => producto.nombre === nombre);
  if (indice !== -1) {
    carrito.splice(indice, 1);
    actualizarCarrito();
    actualizarBurbujaCarrito();
    guardarCarritoEnLocalStorage();
  }
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para mostrar el Sweet Alert
function mostrarSweetAlert() {
  Swal.fire({
    title: "¡Compra Exitosa!",
    text: "¡Gracias por tu compra!",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

// Función para finalizar la compra
function finalizarCompra() {
  mostrarSweetAlert(); // Muestra el Sweet Alert de compra exitosa
  carrito.length = 0; // Limpia el carrito
  actualizarCarrito(); // Actualiza el carrito vacío
  actualizarBurbujaCarrito(); // Actualiza la burbuja del carrito
  guardarCarritoEnLocalStorage(); // Guarda el carrito vacío en localStorage
}

document.getElementById("abrirCarrito").addEventListener("click", function () {
  actualizarCarrito();
  $("#carritoModal").modal("show");
});

// Asigna la función al evento de clic en el botón "Finalizar Compra"
document
  .getElementById("finalizarCompraBtn")
  .addEventListener("click", function () {
    mostrarSweetAlert();
  });

// Al cargar la página, actualizar la burbuja del carrito
window.onload = function () {
  actualizarBurbujaCarrito();
};
