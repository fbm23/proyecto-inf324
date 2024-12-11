// Obtener el contexto de WebGL del canvas
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

// Definir el código fuente del vertex shader
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texcoord;
    varying vec2 v_texcoord;
    void main() {
        gl_Position = a_position;
        v_texcoord = vec2(a_texcoord.x, 1.0 - a_texcoord.y); // Invertir la coordenada y de la textura
    }
`;

// Definir el código fuente del fragment shader
const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texcoord;
    uniform sampler2D u_texture;
    void main() {
        gl_FragColor = texture2D(u_texture, v_texcoord);
    }
`;

// Función para compilar un shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Función para crear un programa de shader
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// Inicializar los shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Obtener las ubicaciones de los atributos y uniformes
const positionLocation = gl.getAttribLocation(program, 'a_position');
const texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');
const textureLocation = gl.getUniformLocation(program, 'u_texture');

// Crear un buffer para la posición
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Establecer las coordenadas del rectángulo (cubriendo todo el canvas)
const positions = [
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Crear un buffer para las coordenadas de la textura
const texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

// Establecer las coordenadas de la textura
const texcoords = [
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

// Crear la textura
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// Cargar y configurar la imagen
const image = new Image();
image.src = 'jin.jpg';
image.onload = function() {
    // Enlazar la textura para que los siguientes métodos afecten a esta textura
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Configurar los parámetros para renderizar cualquier tamaño de imagen
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // Cargar la imagen en la textura
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Dibujar la escena
    drawScene();
};

function drawScene() {
    // Limpiar el canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Usar nuestro programa de shader
    gl.useProgram(program);

    // Enlazar el buffer de posición
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Enlazar el buffer de coordenadas de la textura
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Establecer la textura
    gl.uniform1i(textureLocation, 0);

    // Dibujar el rectángulo
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
