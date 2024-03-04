const mainCanvas = document.getElementById("canvas");
        const context = mainCanvas.getContext("2d");

        let initialX;
        let initialY;
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const dibujar = (cursorX, cursorY) => {
            context.beginPath();
            context.moveTo(initialX, initialY);
            context.lineWidth = 15;
            context.strokeStyle = "#000";
            context.lineCap = "round";
            context.lineJoin = "round";
            context.lineTo(cursorX, cursorY);
            context.stroke();

            initialX = cursorX;
            initialY = cursorY;
        };

        const mouseDown = (evt) => {
            initialX = evt.offsetX;
            initialY = evt.offsetY;
            dibujar(initialX, initialY);
            mainCanvas.addEventListener("mousemove", mouseMoving);
        };

        const mouseMoving = (evt) => {
            dibujar(evt.offsetX, evt.offsetY);
        };

        const mouseUp = () => {
            mainCanvas.removeEventListener("mousemove", mouseMoving);
        };

        mainCanvas.addEventListener("mousedown", mouseDown);
        mainCanvas.addEventListener("mouseup", mouseUp);
        const capturarBoton = document.getElementById("capturar");

        capturarBoton.addEventListener("click", function () {
            const imagenURL = canvas.toDataURL("image/png");
            const imagenBase64 = imagenURL.split(",")[1];

            fetch("/api/predict", {
                method: "POST",
                body: imagenBase64,
            })
                .then((respuesta) => {
                    if (respuesta.ok) {
                        return respuesta.text();
                    } else {
                        console.log("Error al enviar la imagen");
                    }
                })
                .then(data=>{
                    const span=document.getElementById("prediction")
                    span.innerHTML=data;
                })
                .catch((error) => {
                    console.error(error);
                });
        });