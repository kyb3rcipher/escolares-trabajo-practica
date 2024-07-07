/************* Configuracion *************/
// URL del API.
const apiURL = "https://webservices.mx/escolares/test/alumnos";

const table = document.getElementsByTagName("table")[0];
const tableBody = table.getElementsByTagName("tbody")[0];

/************* FILTROS *************/
const checkboxTodos = document.getElementById('checkbox-todos');
const checkboxes = document.querySelectorAll('#control-tabla input[type="checkbox"]:not(#checkbox-todos)');

function marcarTodos() { checkboxTodos.checked = true; mostrarTodos(); }
function mostrarTodos() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = checkboxTodos.checked;
    });

    mostrarColumnas();
}
function mostrarColumnas() {
    var tableRows = document.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].querySelectorAll("tr");
    let tableHeaders = document.querySelectorAll('th');


    checkboxes.forEach((checkbox, index) => {
        const isVisible = checkbox.checked;

        if (isVisible) {
            noneChecked = false;
        } else {
            noneChecked = true;
        }

        // Mostrar u ocultar la columna correspondiente
        tableHeaders[index].style.display = isVisible ? 'table-cell' : 'none';
        tableRows.forEach(fila => {
            fila.children[index].style.display = isVisible ? 'table-cell' : 'none';
        });
    });

    if (noneChecked) {
        tableHeaders[0].style.display = 'table-cell';
        tableRows.forEach(fila => {
            fila.children[0].style.display = 'table-cell';
        });
    }

    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    document.getElementById('checkbox-todos').checked = allChecked;
}


function buscarEnTabla(cuadro) {
    var tableRows = tableBody.querySelectorAll("tr");
    marcarTodos();

    tableRows.forEach(fila => {
        let isVisible = false;
        const inputs = fila.querySelectorAll('table tbody tr input[type="text"]');

        inputs.forEach(input => {
            const textContent = input.value.toLowerCase().trim();
            if (textContent.includes(cuadro.value.toLowerCase().trim())) {
                isVisible = true;
            }
        });

        fila.style.display = isVisible ? '' : 'none';
    });
}

/************* Validaciones *************/
const vocales = ['A', 'E', 'I', 'O', 'U'];
const consonantes = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

function obtenerPrimeraVocal(cadena) {
    for (let i = 0; i < cadena.length; i++) {
        if (vocales.includes(cadena.charAt(i).toUpperCase())) {
            return cadena.charAt(i).toUpperCase();
        }
    }
    return null;
}

function obtenerPrimeraConsonante(cadena) {
    for (let i = 0; i < cadena.length; i++) {
        if (consonantes.includes(cadena.charAt(i).toUpperCase())) {
            return cadena.charAt(i).toUpperCase();
        }
    }
    return null;
}

function obtenerSegundaConsonante(cadena) {
    let contador = 0;
    for (let i = 0; i < cadena.length; i++) {
        if (consonantes.includes(cadena.charAt(i).toUpperCase())) {
            contador++;
            if (contador === 2) {
                return cadena.charAt(i).toUpperCase();
            }
        }
    }
    return null;
}

/* Se valida correctamente si la curp tiene una estructura valida basado en: https://conecta.tec.mx/es/noticias/nacional/emprendedores/que-es-la-curp-descubre-como-se-conforma-y-para-que-sirve
Lo unico que no se valida por temas de falta de informacion es: Fecha y estado de nacimiento */
function validarCURP(paterno, materno, nombre, curp) {
    // Validar longitud de la CURP (minimo 18 caracteres)
    if (curp.length !== 18) {
        return false;
    }
    
    let curpPaterno = curp.substr(0, 2).toUpperCase(), curpMaterno = curp.substr(2, 1).toUpperCase(), curpNombre = curp.substr(3, 1).toUpperCase(), curpConsonantePaterno = curp.substr(13, 1).toUpperCase(), curpConsonanteMaterno = curp.substr(14, 1).toUpperCase(), curpConsonanteNombre = curp.substr(15, 1).toUpperCase(), curpGenero = curp.substr(10, 1).toUpperCase(), curpEstado = curp.substr(11, 2).toUpperCase(), curpConsonanteInternaPaterno = curp.substr(13, 1).toUpperCase(), curpConsonanteInternaMaterno = curp.substr(14, 1).toUpperCase(), curpConsonanteInternaNombre = curp.substr(15, 1).toUpperCase();
    
    if (curpPaterno !== (obtenerPrimeraConsonante(paterno) + obtenerPrimeraVocal(paterno))) {
        return false;
    }
    if (curpMaterno !== obtenerPrimeraConsonante(materno)) {
        return false;
    }
    if (curpNombre !== obtenerPrimeraConsonante(nombre)) {
        return false;
    }

    if (curpGenero !== "H" && curpGenero !== "M" && curpGenero !== "X") {
        return false;
    }
    
    let estados = ["NE", "AS", "BC", "BS", "CC", "CL", "CM", "CS", "CH", "DF", "DG", "GT", "GR", "HG", "JC", "MC", "MN", "MS", "NT", "NL", "OC", "PL", "QT", "QR", "SP", "SL", "SR", "TC", "TS", "TL", "VZ", "YN", "ZS", "NA", "SI"];
    if (!estados.includes(curpEstado)) {
        return false;
    }

    if (curpConsonanteInternaPaterno !== obtenerSegundaConsonante(paterno)) {
        return false;
    }
    if (curpConsonanteInternaMaterno !== obtenerSegundaConsonante(materno)) {
        return false;
    }
    if (curpConsonanteInternaNombre !== obtenerSegundaConsonante(nombre)) {
        return false;
    }
    
    return true;
}

function validar(curp, matricula, paterno, materno, nombre) {
    if (!curp || !matricula || !paterno || !nombre) {
        alert("Por favor, completa todos los campos obligatorios (excepto apellido materno)");
        return;
    }

    if (!validarCURP(paterno, materno, nombre ,curp)) {
        alert("CURP invalida");
        return false;
    }

    if (matricula.length != 20) {
        alert("La matricula debe ser de 20 caracteres");
        return false;
    }

    if (paterno.length > 50 || materno > 50 || nombre > 50) {
        alert("Los apellidos y nombre deben maximo de 50 caracteres");
        return false;
    }

    return true;
}

function crearCURP(paterno, materno, nombre) {
    materno = (materno == '') ? "XX" : materno;

    const curpPaterno = obtenerPrimeraConsonante(paterno) + obtenerPrimeraVocal(paterno),
        curpMaterno = obtenerPrimeraConsonante(materno), curpNombre = obtenerPrimeraConsonante(nombre), curpConsonanteInternaPaterno = obtenerSegundaConsonante(paterno), curpConsonanteInternaMaterno = obtenerSegundaConsonante(materno), curpConsonanteInternaNombre = obtenerSegundaConsonante(nombre);

    // Generar una CURP completa con los valores obtenidos y los campos restantes como: YY = anio[year], MM = mes[month], DD = dia[day], X = genero[gender], DG = durango[por default], N = numero de mes[ejemplo], I numero indentificador[ejemplo]
    const curpGenerada = curpPaterno + curpMaterno + curpNombre + '321127XDG' + curpConsonanteInternaPaterno + curpConsonanteInternaMaterno + curpConsonanteInternaNombre + '32';

    return curpGenerada;
}

/************* Acciones *************/
async function actualizarAlumno(id, fila) {
    try {
        const curp = fila.querySelector('input[name="curp"]').value, matricula = fila.querySelector('input[name="matricula"]').value, paterno = fila.querySelector('input[name="paterno"]').value, materno = fila.querySelector('input[name="materno"]').value, nombre = fila.querySelector('input[name="nombre"]').value;
        
        if (!validar(curp, matricula, paterno, materno, nombre)) { return; }

        // Construir la URL con los parametros
        const parametros = new URLSearchParams({
            id: id,
            curp: curp,
            matricula: matricula,
            paterno: paterno,
            materno: materno,
            nombre: nombre,
        }).toString();

        // Realizar la solicitud POST
        const response = await fetch((apiURL + `/guardar?${parametros}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const result = await response.json();
        if (response.ok) {
            alert("Alumno actualizado correctamente");
        } else {
            alert(`Error: ${result.meta.message}`);
        }
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        alert("Ocurrio un error al intentar actualizar el alumno.");
    }
}

function eliminarAlumno(id, fila) {
    if (confirm("¿Estas seguro de que quieres eliminar a este alumno?")) {
        fetch((apiURL + `/eliminar?id=${id}`), {
            method: 'DELETE'
        }).then(response => response.json()).then(result => {
            alert("Alumno eliminado correctamente");
            fila.remove();
        }).catch(error => {
            console.error('Error al eliminar alumno:', error);
            alert("Ocurrio un error al intentar eliminar el alumno.");
        });
    } else {
        alert("La eliminacion del alumno ha sido cancelada.");
    }
}

/************* Registro *************/
function registrarEstudiante(button) {
    const curp = button.closest('tr').querySelector('input[name="curp"]').value, matricula = button.closest('tr').querySelector('input[name="matricula"]').value, paterno = button.closest('tr').querySelector('input[name="paterno"]').value, materno = button.closest('tr').querySelector('input[name="materno"]').value, nombre = button.closest('tr').querySelector('input[name="nombre"]').value;

    if (!validar(curp, matricula, paterno, materno, nombre)) { return; }

    // Construye la URL con los parametros
    const parametros = new URLSearchParams({
        curp: curp,
        matricula: matricula,
        paterno: paterno,
        materno: materno,
        nombre: nombre
    }).toString();

    
    fetch((apiURL + `/agregar?${parametros}`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => response.json()).then(result => {
        if (result.meta.message === "OK") {
            alert("Estudiante agregado exitosamente");
            location.reload();
        } else {
            alert(`Error: ${result.meta.message}`);
        }
    }).catch(error => {
        console.error('Error al enviar los datos:', error);
        alert("Ocurrio un error al intentar agregar el estudiante.");
    });
}

function generarCURP(button) {
    const paterno = button.closest('tr').querySelector('input[name="paterno"]').value;
    const materno = button.closest('tr').querySelector('input[name="materno"]').value;
    const nombre = button.closest('tr').querySelector('input[name="nombre"]').value;
    const curpField = button.closest('tr').querySelector('input[name="curp"]');
    
    if (paterno != '' && nombre != '') {
        curpField.value = crearCURP(paterno, materno, nombre);
    } else {
        alert("Tienes que completar nombre y apellido paterno para generar una CURP");
    }
}

function crearFila() {
    const fila = document.createElement('tr');
    
    fila.innerHTML = `
        <td><input type="text" name="matricula" placeholder="Matricula"></td>
        <td>
            <div class="generador-curp">
                <input type="text" name="curp" placeholder="CURP">
                <button class="boton-circular" id="boton-generar-curp" onclick="generarCURP(this)">↻</button>
            </div>
        </td>
        <td><input type="text" name="paterno" placeholder="Apellido Paterno"></td>
        <td><input type="text" name="materno" placeholder="Apellido Materno"></td>
        <td><input type="text" name="nombre" placeholder="Nombre"></td>
        <td><img src="imagen-fotoinfantil.png" alt="Imagen" width="50"></td>

        <td>
            <button class="boton-azul" onclick="registrarEstudiante(this)">Guardar</button>
            <button class="boton-rojo" onclick="this.closest('tr').remove()">Eliminar</button>
        </td>
    `;
    
    tableBody.appendChild(fila);
}

/************* Carga de datos/page *************/
document.addEventListener('DOMContentLoaded', function() {
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Cargando...';
    loadingMessage.style.fontSize = '18px';
    loadingMessage.style.fontWeight = 'bold';
    tableBody.appendChild(loadingMessage);

    // Marcar todos los filtros al inicio
    marcarTodos();

    fetch(apiURL + "/listar")
        .then(response => response.json())
        .then(data => {
            // Remover mensaje de carga una vez que se obtengan los datos
            tableBody.removeChild(loadingMessage);

            if (data && data.response) {
                data.response.forEach(alumno => {
                    const fila = document.createElement('tr');

                    fila.innerHTML = `
                        <td title="Fecha de creacion: ${alumno.creado} \n Fecha de modificacion: ${alumno.modificado}"><input type="text" name="matricula" value="${alumno.matricula}"></td>
                        <td>
                            <div class="generador-curp">
                                <input type="text" name="curp" value="${alumno.curp}">
                                <button class="boton-circular" id="boton-generar-curp" onclick="generarCURP(this)" style="visibility: hidden;">↻</button>
                            </div>
                        </td>
                        <td><input type="text" name="paterno" value="${alumno.paterno}"></td>
                        <td><input type="text" name="materno" value="${alumno.materno || ''}"></td>
                        <td><input type="text" name="nombre" value="${alumno.nombre}"></td>

                        <td><img src="${alumno.imagen_thumb}" alt="Imagen" width="50"></td>

                        <td>
                            <button class="boton-verde" onclick="actualizarAlumno(${alumno.id}, this.parentNode.parentNode)" title="Fecha de creacion: ${alumno.creado} \n Fecha de ultima modificacion: ${alumno.modificado}">Actualizar</button>
                            <button class="boton-rojo" onclick="eliminarAlumno(${alumno.id}, this.parentNode.parentNode)">Eliminar</button>
                        </td>
                    `;

                    tableBody.appendChild(fila);

                    // Volver a marcar todos los filtros al cargar los datos
                    marcarTodos();

                    // Añadir eventos de focus y blur al input de CURP de la nueva fila
                    const curpInput = fila.querySelector('input[name="curp"]');
                    const curpButton = fila.querySelector('.boton-circular');

                    curpInput.addEventListener('focus', function() {
                        curpButton.style.visibility = 'visible';
                    });

                    curpInput.addEventListener('blur', function() {
                        setTimeout(() => curpButton.style.visibility = 'hidden', 100);
                    });

                    curpButton.addEventListener('mousedown', function(event) {
                        // Prevenir que el evento de mousedown quite el foco del input
                        event.preventDefault();
                    });
            
                    // Asegurar que el boton se vuelva a ocultar después de su uso
                    curpButton.addEventListener('click', function() {
                        curpInput.focus(); // Retorna el foco al input CURP
                    });

                });
            } else {
                console.error("Error al obtener datos de los alumnos");
            }
        })
        .catch(error => {
            tableBody.removeChild(loadingMessage);
            console.error("Error en la solicitud a la API:", error);
        });
});