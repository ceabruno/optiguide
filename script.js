document.addEventListener("DOMContentLoaded", function() {
    const misiones = document.querySelectorAll('.mision-card');
    
    misiones.forEach((card, index) => {
        // 1. Generar IDs únicos dinámicos
        const titulo = card.querySelector('.mision-titulo')?.innerText || 'mision';
        const slug = titulo.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
        const idUnico = `id-${slug}-${index}`;
        card.id = idUnico;

        // 2. Inyectar checkbox visual
        const label = document.createElement('div');
        label.className = 'completar-check';
        label.innerHTML = `<input type="checkbox" id="chk-${idUnico}" style="pointer-events:none"> <span>Completada</span>`;
        card.appendChild(label);

        // 3. Evento de clic en la tarjeta (excluyendo el link)
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') {
                toggleEstadoMision(idUnico);
            }
        });
    });

    cargarYActualizarTodo();
});

function toggleEstadoMision(id) {
    const card = document.getElementById(id);
    const chk = card.querySelector('input[type="checkbox"]');
    
    // Cambiar estado visual y de checkbox
    chk.checked = !chk.checked;
    card.classList.toggle('completada', chk.checked);

    // Guardar en memoria del navegador
    const progreso = JSON.parse(localStorage.getItem('dofusProgreso')) || {};
    progreso[id] = chk.checked;
    localStorage.setItem('dofusProgreso', JSON.stringify(progreso));

    actualizarBarra();
}

function actualizarBarra() {
    const total = document.querySelectorAll('.mision-card').length;
    const completas = document.querySelectorAll('.mision-card.completada').length;
    const porcentaje = Math.round((completas / total) * 100) || 0;

    // Actualizar elementos de la interfaz
    document.getElementById('barra-llenado').style.width = porcentaje + '%';
    document.getElementById('txt-porcentaje').innerText = porcentaje + '% Completado';
    document.getElementById('txt-conteo').innerText = `${completas} / ${total} misiones`;
}

function cargarYActualizarTodo() {
    const progreso = JSON.parse(localStorage.getItem('dofusProgreso')) || {};
    
    for (const id in progreso) {
        const card = document.getElementById(id);
        if (card && progreso[id]) {
            card.classList.add('completada');
            const chk = card.querySelector('input[type="checkbox"]');
            if (chk) chk.checked = true;
        }
    }
    actualizarBarra();
}

function mostrarNivel(idNivel, boton) {
    // 1. Limpiar el texto del buscador
    const buscador = document.getElementById('buscador');
    if (buscador) buscador.value = "";

    // 2. ELIMINAR estilos inline para que las clases CSS (.active) vuelvan a mandar
    document.querySelectorAll('.mision-card, .nivel-seccion').forEach(el => {
        el.style.display = ""; 
    });

    // 3. Lógica original de cambio de pestañas
    document.querySelectorAll('.nivel-seccion').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));

    const seccionActiva = document.getElementById(idNivel);
    if (!seccionActiva) return; 
    seccionActiva.classList.add('active');

    let botonActivo = boton || document.querySelector(`button[onclick*="${idNivel}"]`);
    if (botonActivo) botonActivo.classList.add('active');

    // Scroll automático (mantiene tu lógica original)
    setTimeout(() => {
        const completadas = seccionActiva.querySelectorAll('.mision-card.completada');
        const menuHeight = document.querySelector('.nav-container')?.offsetHeight || 80;
        if (completadas.length > 0) {
            const ultima = completadas[completadas.length - 1];
            window.scrollTo({ top: ultima.offsetTop - menuHeight - 20, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 150); 
}
        function subirArriba() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }

        window.onscroll = function() {
            const boton = document.getElementById("btn-top");
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                boton.style.display = "block";
            } else {
                boton.style.display = "none";
            }
        };
function filtrarMisiones() {
    const textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    const secciones = document.querySelectorAll('.nivel-seccion');
    const botonesNivel = document.querySelectorAll('.nav-button');

    if (textoBusqueda === "") {
        // Si el buscador está vacío, quitamos los estilos "inline" 
        // y dejamos que mostrarNivel restaure la vista normal
        document.querySelectorAll('.mision-card, .nivel-seccion').forEach(el => el.style.display = "");
        
        const botonActivo = document.querySelector('.nav-button.active');
        const nivelId = botonActivo.getAttribute('onclick').match(/'([^']+)'/)[1];
        mostrarNivel(nivelId, botonActivo);
        return;
    }

    // Aplicar el filtro
    secciones.forEach(seccion => {
        let tieneResultados = false;
        const tarjetas = seccion.querySelectorAll('.mision-card');

        tarjetas.forEach(card => {
            const titulo = card.querySelector('.mision-titulo').innerText.toLowerCase();
            if (titulo.includes(textoBusqueda)) {
                card.style.display = "block";
                tieneResultados = true;
            } else {
                card.style.display = "none";
            }
        });

        // Mostrar u ocultar la sección entera según si hay coincidencias
        if (tieneResultados) {
            seccion.style.display = "block";
            seccion.classList.add('active');
        } else {
            seccion.style.display = "none";
            seccion.classList.remove('active');
        }
    });
}