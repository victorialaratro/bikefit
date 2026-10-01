// =========================================================
// BIKEFIT
// FUNCIONAMIENTO GENERAL
// =========================================================


// ---------------------------------------------------------
// ELEMENTOS PRINCIPALES
// ---------------------------------------------------------

const boton =
    document.getElementById("botonCalcular");

const resultado =
    document.getElementById("resultado");

const modal =
    document.getElementById("modalResultado");

const modalEtiqueta =
    document.getElementById("modalEtiqueta");

const modalTitulo =
    document.getElementById("modalTitulo");

const modalTexto =
    document.getElementById("modalTexto");

const cerrarModal =
    document.getElementById("cerrarModal");

const verResultado =
    document.getElementById("verResultado");

const escalaBiomecanica =
    document.getElementById("escalaBiomecanica");

const indicadorEscala =
    document.getElementById("indicadorEscala");

const confetti =
    document.getElementById("confetti");


// =========================================================
// BOTÓN PRINCIPAL
// =========================================================

boton.addEventListener(
    "click",
    calcularBikefit
);


// =========================================================
// CERRAR CARTEL
// =========================================================

cerrarModal.addEventListener(
    "click",
    function () {

        modal.classList.remove("activo");

    }
);


// Cerrar tocando el fondo

document
    .querySelector(".modal-fondo")
    .addEventListener(
        "click",
        function () {

            modal.classList.remove("activo");

        }
    );


// =========================================================
// VER RESULTADO
// =========================================================

verResultado.addEventListener(
    "click",
    function () {

        modal.classList.remove("activo");

        resultado.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// =========================================================
// FUNCIÓN PRINCIPAL
// =========================================================

function calcularBikefit() {

    // -----------------------------------------------------
    // LEER DATOS
    // -----------------------------------------------------

    const estatura =
        parseFloat(
            document.getElementById("estatura").value
        );


    const longitudPierna =
        parseFloat(
            document.getElementById("longitudPierna").value
        );


    const alturaAsientoTexto =
        document.getElementById("alturaAsiento").value;


    const distanciaManubrio =
        parseFloat(
            document.getElementById("distanciaManubrio").value
        );


    const alturaManubrio =
        parseFloat(
            document.getElementById("alturaManubrio").value
        );


    // -----------------------------------------------------
    // ALTURA DEL ASIENTO ES OPCIONAL
    // -----------------------------------------------------

    let alturaAsiento = null;


    if (alturaAsientoTexto.trim() !== "") {

        alturaAsiento =
            parseFloat(alturaAsientoTexto);

    }


    // =====================================================
    // VALIDACIONES
    // =====================================================

    if (
        isNaN(estatura) ||
        estatura <= 0
    ) {

        mostrarError(
            "Ingresá tu estatura."
        );

        return;
    }


    if (
        isNaN(longitudPierna) ||
        longitudPierna <= 0
    ) {

        mostrarError(
            "Ingresá la longitud de la pierna."
        );

        return;
    }


    if (
        longitudPierna >= estatura
    ) {

        mostrarError(
            "Revisá la longitud de la pierna. Debe ser menor que tu estatura."
        );

        return;
    }


    if (
        isNaN(distanciaManubrio) ||
        distanciaManubrio <= 0
    ) {

        mostrarError(
            "Ingresá la distancia entre el asiento y el manubrio."
        );

        return;
    }


    if (
        isNaN(alturaManubrio) ||
        alturaManubrio <= 0
    ) {

        mostrarError(
            "Ingresá la altura del manubrio."
        );

        return;
    }


    if (
        alturaAsiento !== null &&
        (
            isNaN(alturaAsiento) ||
            alturaAsiento <= 0
        )
    ) {

        mostrarError(
            "Revisá la altura actual del asiento."
        );

        return;
    }


    // =====================================================
    // CÁLCULO DE ALTURA CENTRAL
    // =====================================================

    const base =
        longitudPierna * 0.883;


    const correccionEstatura =
        (estatura - 170) * 0.05;


    const correccionDistancia =
        (distanciaManubrio - 50) * 0.08;


    const correccionManubrio =
        (alturaManubrio - 100) * 0.03;


    const alturaRecomendada =
        base
        + correccionEstatura
        + correccionDistancia
        + correccionManubrio;


    // =====================================================
    // RANGO ORIENTATIVO
    //
    // ± 3,5 CM
    // =====================================================

    const margen = 3.5;


    const minimo =
        alturaRecomendada - margen;


    const maximo =
        alturaRecomendada + margen;


    // =====================================================
    // SI NO INGRESÓ ALTURA ACTUAL
    // =====================================================

    if (alturaAsiento === null) {

        mostrarRecomendacion(
            alturaRecomendada,
            minimo,
            maximo,
            estatura,
            longitudPierna,
            distanciaManubrio,
            alturaManubrio
        );


        escalaBiomecanica.classList.add(
            "oculto"
        );


        mostrarModalRecomendacion(
            alturaRecomendada,
            minimo,
            maximo
        );


        return;
    }


    // =====================================================
    // DIFERENCIA
    // =====================================================

    const diferencia =
        alturaAsiento - alturaRecomendada;


    // =====================================================
    // DENTRO DEL RANGO
    // =====================================================

    if (
        alturaAsiento >= minimo &&
        alturaAsiento <= maximo
    ) {

        mostrarCorrecto(
            alturaRecomendada,
            minimo,
            maximo,
            alturaAsiento,
            diferencia,
            estatura,
            longitudPierna,
            distanciaManubrio,
            alturaManubrio
        );


        mostrarModalCorrecto(
            alturaAsiento,
            minimo,
            maximo
        );


        actualizarEscala(
            alturaAsiento,
            minimo,
            maximo
        );


        lanzarConfeti();


        return;
    }


    // =====================================================
    // ASIENTO BAJO
    // =====================================================

    if (
        alturaAsiento < minimo
    ) {

        const subir =
            alturaRecomendada -
            alturaAsiento;


        mostrarAsientoBajo(
            alturaRecomendada,
            minimo,
            maximo,
            alturaAsiento,
            diferencia,
            subir,
            estatura,
            longitudPierna,
            distanciaManubrio,
            alturaManubrio
        );


        mostrarModalPrecaucion(
            "Tu asiento está por debajo del rango orientativo.",
            "La altura ingresada es de "
            + alturaAsiento.toFixed(1)
            + " cm. Podés revisar la configuración y probar una posición más alta."
        );


        actualizarEscala(
            alturaAsiento,
            minimo,
            maximo
        );


        return;
    }


    // =====================================================
    // ASIENTO ALTO
    // =====================================================

    const bajar =
        alturaAsiento -
        alturaRecomendada;


    mostrarAsientoAlto(
        alturaRecomendada,
        minimo,
        maximo,
        alturaAsiento,
        diferencia,
        bajar,
        estatura,
        longitudPierna,
        distanciaManubrio,
        alturaManubrio
    );


    mostrarModalPrecaucion(
        "Tu asiento está por encima del rango orientativo.",
        "La altura ingresada es de "
        + alturaAsiento.toFixed(1)
        + " cm. Podés revisar la configuración y probar una posición más baja."
    );


    actualizarEscala(
        alturaAsiento,
        minimo,
        maximo
    );

}


// =========================================================
// ERROR
// =========================================================

function mostrarError(mensaje) {

    resultado.innerHTML = `

        <div class="resultado-cabecera">

            <p class="etiqueta">
                REVISÁ LOS DATOS
            </p>

            <h2>
                Nos falta información.
            </h2>

            <p>
                ${mensaje}
            </p>

        </div>
    `;


    escalaBiomecanica.classList.add(
        "oculto"
    );


    resultado.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// =========================================================
// RESULTADO SIN ALTURA ACTUAL
// =========================================================

function mostrarRecomendacion(
    altura,
    minimo,
    maximo,
    estatura,
    longitudPierna,
    distancia,
    manubrio
) {

    resultado.innerHTML = `

        <div class="resultado-cabecera">

            <p class="etiqueta">
                RESULTADO
            </p>

            <h2>
                Esta es tu orientación inicial.
            </h2>

            <p>
                Como no ingresaste la altura actual
                del asiento, calculamos una referencia
                a partir de las medidas ingresadas.
            </p>

        </div>


        <div class="resultado-grid">

            ${crearAlturaCard(
                altura,
                minimo,
                maximo
            )}


            <div class="configuracion-card">

                <h3>
                    Rango orientativo
                </h3>


                <div class="fila">

                    <span>
                        Altura central
                    </span>

                    <strong>
                        ${altura.toFixed(1)} cm
                    </strong>

                </div>


                <div class="fila">

                    <span>
                        Límite inferior
                    </span>

                    <strong>
                        ${minimo.toFixed(1)} cm
                    </strong>

                </div>


                <div class="fila">

                    <span>
                        Límite superior
                    </span>

                    <strong>
                        ${maximo.toFixed(1)} cm
                    </strong>

                </div>

            </div>

        </div>


        ${crearDatos(
            estatura,
            longitudPierna,
            distancia,
            manubrio
        )}


        <div class="ajuste-card">

            <p>
                CONFIGURACIÓN INICIAL
            </p>

            <strong>
                ${altura.toFixed(1)} cm
            </strong>

            <p>
                Podés utilizar esta medida
                como referencia inicial para
                configurar la bicicleta fija.
            </p>

        </div>
    `;

}


// =========================================================
// RESULTADO CORRECTO
// =========================================================

function mostrarCorrecto(
    altura,
    minimo,
    maximo,
    alturaActual,
    diferencia,
    estatura,
    longitudPierna,
    distancia,
    manubrio
) {

    resultado.innerHTML = `

        <div class="resultado-cabecera">

            <p class="etiqueta">
                ANÁLISIS BIOMECÁNICO
            </p>

            <h2>
                Tu configuración está dentro
                del rango orientativo.
            </h2>

            <p>
                La altura actual que ingresaste
                se encuentra dentro del intervalo
                calculado por BIKEFIT.
            </p>

        </div>


        <div class="resultado-grid">

            ${crearAlturaCard(
                altura,
                minimo,
                maximo
            )}


            ${crearConfiguracion(
                alturaActual,
                altura,
                minimo,
                maximo,
                diferencia,
                true
            )}

        </div>


        ${crearDatos(
            estatura,
            longitudPierna,
            distancia,
            manubrio
        )}
    `;

}


// =========================================================
// ASIENTO BAJO
// =========================================================

function mostrarAsientoBajo(
    altura,
    minimo,
    maximo,
    alturaActual,
    diferencia,
    subir,
    estatura,
    longitudPierna,
    distancia,
    manubrio
) {

    resultado.innerHTML = `

        <div class="resultado-cabecera">

            <p class="etiqueta">
                PRECAUCIÓN
            </p>

            <h2>
                La altura del asiento está
                por debajo del rango orientativo.
            </h2>

            <p>
                Podés revisar la configuración
                y probar una posición más alta.
            </p>

        </div>


        <div class="resultado-grid">

            ${crearAlturaCard(
                altura,
                minimo,
                maximo
            )}


            ${crearConfiguracion(
                alturaActual,
                altura,
                minimo,
                maximo,
                diferencia,
                false
            )}

        </div>


        <div class="ajuste-card">

            <p>
                AJUSTE ORIENTATIVO
            </p>

            <strong>
                Subir aproximadamente
                ${subir.toFixed(1)} cm
            </strong>

            <p>
                La altura central calculada
                es ${altura.toFixed(1)} cm.
            </p>

        </div>


        ${crearDatos(
            estatura,
            longitudPierna,
            distancia,
            manubrio
        )}
    `;

}


// =========================================================
// ASIENTO ALTO
// =========================================================

function mostrarAsientoAlto(
    altura,
    minimo,
    maximo,
    alturaActual,
    diferencia,
    bajar,
    estatura,
    longitudPierna,
    distancia,
    manubrio
) {

    resultado.innerHTML = `

        <div class="resultado-cabecera">

            <p class="etiqueta">
                PRECAUCIÓN
            </p>

            <h2>
                La altura del asiento está
                por encima del rango orientativo.
            </h2>

            <p>
                Podés revisar la configuración
                y probar una posición más baja.
            </p>

        </div>


        <div class="resultado-grid">

            ${crearAlturaCard(
                altura,
                minimo,
                maximo
            )}


            ${crearConfiguracion(
                alturaActual,
                altura,
                minimo,
                maximo,
                diferencia,
                false
            )}

        </div>


        <div class="ajuste-card">

            <p>
                AJUSTE ORIENTATIVO
            </p>

            <strong>
                Bajar aproximadamente
                ${bajar.toFixed(1)} cm
            </strong>

            <p>
                La altura central calculada
                es ${altura.toFixed(1)} cm.
            </p>

        </div>


        ${crearDatos(
            estatura,
            longitudPierna,
            distancia,
            manubrio
        )}
    `;

}


// =========================================================
// TARJETA DE ALTURA
// =========================================================

function crearAlturaCard(
    altura,
    minimo,
    maximo
) {

    return `

        <div class="altura-card">

            <div class="titulo">
                ALTURA CENTRAL ORIENTATIVA
            </div>


            <div class="numero-grande">

                ${altura.toFixed(1)} cm

            </div>


            <div class="rango">

                Rango orientativo:

                <strong>

                    ${minimo.toFixed(1)}
                    –
                    ${maximo.toFixed(1)} cm

                </strong>

            </div>

        </div>
    `;

}


// =========================================================
// CONFIGURACIÓN ACTUAL
// =========================================================

function crearConfiguracion(
    alturaActual,
    altura,
    minimo,
    maximo,
    diferencia,
    correcto
) {

    return `

        <div class="configuracion-card">

            <h3>
                Tu configuración
            </h3>


            <div class="fila">

                <span>
                    Altura actual
                </span>

                <strong>
                    ${alturaActual.toFixed(1)} cm
                </strong>

            </div>


            <div class="fila">

                <span>
                    Altura central
                </span>

                <strong>
                    ${altura.toFixed(1)} cm
                </strong>

            </div>


            <div class="fila">

                <span>
                    Rango
                </span>

                <strong>

                    ${minimo.toFixed(1)}
                    –
                    ${maximo.toFixed(1)} cm

                </strong>

            </div>


            <div class="fila">

                <span>
                    Diferencia con el valor central
                </span>

                <strong>
                    ${formatearDiferencia(diferencia)} cm
                </strong>

            </div>


            <div class="${
                correcto
                    ? "badge-correcto"
                    : "badge-revisar"
            }">

                ${
                    correcto
                        ? "DENTRO DEL RANGO ORIENTATIVO"
                        : "REVISAR CONFIGURACIÓN"
                }

            </div>

        </div>
    `;

}


// =========================================================
// DATOS UTILIZADOS
// =========================================================

function crearDatos(
    estatura,
    longitudPierna,
    distancia,
    manubrio
) {

    return `

        <div class="datos-card">

            <h3>
                Datos utilizados
            </h3>


            <div class="fila">

                <span>
                    Estatura
                </span>

                <strong>
                    ${estatura.toFixed(1)} cm
                </strong>

            </div>


            <div class="fila">

                <span>
                    Longitud de la pierna
                </span>

                <strong>
                    ${longitudPierna.toFixed(1)} cm
                </strong>

            </div>


            <div class="fila">

                <span>
                    Distancia asiento–manubrio
                </span>

                <strong>
                    ${distancia.toFixed(1)} cm
                </strong>

            </div>


            <div class="fila">

                <span>
                    Altura del manubrio
                </span>

                <strong>
                    ${manubrio.toFixed(1)} cm
                </strong>

            </div>

        </div>
    `;

}


// =========================================================
// FORMATEAR DIFERENCIA
// =========================================================

function formatearDiferencia(numero) {

    if (numero > 0) {

        return "+" + numero.toFixed(1);

    }

    return numero.toFixed(1);

}


// =========================================================
// MODAL CORRECTO
// =========================================================

function mostrarModalCorrecto(
    alturaActual,
    minimo,
    maximo
) {

    modal.classList.remove(
        "precaucion"
    );


    modalEtiqueta.textContent =
        "ANÁLISIS COMPLETADO";


    modalTitulo.textContent =
        "Tu configuración está dentro del rango orientativo.";


    modalTexto.textContent =
        "Tu asiento está a "
        + alturaActual.toFixed(1)
        + " cm y se encuentra dentro del intervalo de "
        + minimo.toFixed(1)
        + " a "
        + maximo.toFixed(1)
        + " cm.";


    modal.classList.add(
        "activo"
    );

}


// =========================================================
// MODAL PRECAUCIÓN
// =========================================================

function mostrarModalPrecaucion(
    titulo,
    texto
) {

    modal.classList.add(
        "precaucion"
    );


    modalEtiqueta.textContent =
        "PRECAUCIÓN";


    modalTitulo.textContent =
        titulo;


    modalTexto.textContent =
        texto;


    modal.classList.add(
        "activo"
    );

}


// =========================================================
// MODAL RECOMENDACIÓN
// =========================================================

function mostrarModalRecomendacion(
    altura,
    minimo,
    maximo
) {

    modal.classList.remove(
        "precaucion"
    );


    modalEtiqueta.textContent =
        "CÁLCULO COMPLETADO";


    modalTitulo.textContent =
        "Tenemos una orientación inicial para tu bicicleta.";


    modalTexto.textContent =
        "La altura central calculada es "
        + altura.toFixed(1)
        + " cm, con un rango orientativo de "
        + minimo.toFixed(1)
        + " a "
        + maximo.toFixed(1)
        + " cm.";


    modal.classList.add(
        "activo"
    );

}


// =========================================================
// ESCALA VISUAL
// =========================================================

function actualizarEscala(
    alturaActual,
    minimo,
    maximo
) {

    escalaBiomecanica.classList.remove(
        "oculto"
    );


    let posicion;


    // -----------------------------------------------------
    // ASIENTO BAJO
    // -----------------------------------------------------

    if (
        alturaActual < minimo
    ) {

        const diferencia =
            minimo - alturaActual;


        posicion =
            27 -
            Math.min(
                diferencia * 3,
                20
            );

    }


    // -----------------------------------------------------
    // ASIENTO ALTO
    // -----------------------------------------------------

    else if (
        alturaActual > maximo
    ) {

        const diferencia =
            alturaActual - maximo;


        posicion =
            73 +
            Math.min(
                diferencia * 3,
                20
            );

    }


    // -----------------------------------------------------
    // DENTRO DEL RANGO
    // -----------------------------------------------------

    else {

        const amplitud =
            maximo - minimo;


        const proporcion =
            (alturaActual - minimo)
            / amplitud;


        posicion =
            34 +
            proporcion * 32;

    }


    // Evitar que el punto salga de la barra

    posicion =
        Math.max(
            5,
            Math.min(
                95,
                posicion
            )
        );


    indicadorEscala.style.left =
        posicion + "%";

}


// =========================================================
// CONFETI
// =========================================================

function lanzarConfeti() {

    // Limpiar confeti anterior

    confetti.innerHTML = "";


    const colores = [

        "#87364f",
        "#c96f8c",
        "#e9b6c6",
        "#47745d",
        "#202020",
        "#f0c7d3"

    ];


    // Crear piezas

    for (
        let i = 0;
        i < 90;
        i++
    ) {

        const pieza =
            document.createElement(
                "div"
            );


        pieza.classList.add(
            "confetti"
        );


        pieza.style.left =
            Math.random() * 100
            + "vw";


        pieza.style.background =
            colores[
                Math.floor(
                    Math.random()
                    * colores.length
                )
            ];


        pieza.style.animationDuration =
            (
                2.3
                + Math.random() * 2.2
            )
            + "s";


        pieza.style.animationDelay =
            (
                Math.random() * 0.7
            )
            + "s";


        pieza.style.width =
            (
                6
                + Math.random() * 7
            )
            + "px";


        pieza.style.height =
            (
                10
                + Math.random() * 13
            )
            + "px";


        confetti.appendChild(
            pieza
        );

    }


    // Borrar después de la animación

    setTimeout(
        function () {

            confetti.innerHTML = "";

        },
        5500
    );

}