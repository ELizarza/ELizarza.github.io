// Grab the canvas and get the WebGL context
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');
 
// If we don't have a GL context, WebGL is not supported
if (!gl) {
    alert('WebGL not supported');
}
 
// Define the vertices for the triangle
const vertices = new Float32Array([
    // top triangle
    0.0,  0.75, 0.0,  // Vertex 1 top
   -0.25, -0.0, -0.25,  // Vertex 2 left
    0.25, -0.0 , -0.25,  // Vertex 3 right

    //left triangle
    -0.25,  0.0, -0.25,  // Vertex 1 top
    -0.5, -0.75, -0.5,  // Vertex 2 left
    0.0, -0.75 , -0.5,  // Vertex 3 right

    //right triangle
    0.25,  0.00, -0.25,  // Vertex 1 top
    -0.0, -0.75, -0.5,  // Vertex 2 left
    0.5, -0.75 , -0.5,  // Vertex 3 right

    //left side
    0.0, 0.75, 0.0,
    -0.25, 0.0, -0.25,
    -0.25, 0.0, 0.25,

    -0.25, 0.0, -0.25,
    -0.5, -0.75, -0.0,
    -0.5, -0.75, -0.5,

    -0.25,  0.00, 0.25,
    -0.5, -0.75, 0.5,  
    -0.5, -0.75 , 0.0,

    //right side
    0.0, 0.75, 0.0,
    0.25, 0.0, -0.25,
    0.25, 0.0, 0.25,

    0.25, 0.0, -0.25,
    0.5, -0.75, -0.0,
    0.5, -0.75, -0.5,

    0.25,  0.00, 0.25,
    0.5, -0.75, 0.5,  
    0.5, -0.75 , 0.0,

    //back side

    0.0,  0.75, 0.0,  
   -0.25, -0.0, 0.25,  
    0.25, -0.0 , 0.25,  

    -0.25,  0.0, 0.25,  
    -0.5, -0.75, 0.5,  
    0.0, -0.75 , 0.5,  

    0.25,  0.00, 0.25,  
    -0.0, -0.75, 0.5,  
    0.5, -0.75 , 0.5,  

]);
 
// Create a buffer and put the vertices in it
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
 
// Define the vertex shader
const vsSource = `
    attribute vec3 a_position;
    uniform float uTimeVert;
    void main() {
        mat3 matrixY;
        // column order
        matrixY[0] = vec3(cos(uTimeVert/2.0), 0.0, sin(uTimeVert/2.0)); // first column
        matrixY[1] = vec3(0.0, 1.0, 0.0); // second column
        matrixY[2] = vec3(-sin(uTimeVert/2.0), 0.0, cos(uTimeVert/2.0));
        vec3 translation = vec3(0.75*sin(uTimeVert/10.0 + (3.0 * 3.14)/2.0), 0.75 * cos(uTimeVert/2.5), 0.0);

        //camera view, don't know what I'm doing lol
        mat4 camMatrix;
        float left = -0.5;
        float right = 0.5;
        float bottom = -0.5;
        float top = 0.5;
        float near = 0.25;
        float far = .5;
        camMatrix[0] = vec4((2.0 * near)/(right - left), 0.0, (right + left) / (right - left), 0.0);
        camMatrix[1] = vec4(0.0, (2.0 * near) / (top - bottom), (top + bottom) / (top - bottom), 0.0);
        camMatrix[2] = vec4(0.0, 0.0, -1.0 * ((far + near) / (far - near)), -1.0 * ((2.0 * far * near) / (far - near)));
        camMatrix[3] = vec4(0.0, 0.0, -1.0, 0.0);

        vec4 expandedMat = vec4(a_position, 1.0);
        vec4 camera = camMatrix * expandedMat;

        //vec3 transformedP = a_position;
        vec3 transformedP = (matrixY / 1.50) * a_position + translation;
        //gl_Position = vec4(camera);
        gl_Position = vec4(transformedP, 1.0);
    }
`;
 
// Define the fragment shader
const fsSource = `
    precision mediump float;
    uniform float uTimeFrag;
    uniform vec2 screenSize; // screen resolution.
    void main() {
        float colorR = abs(cos(uTimeFrag  * 2.0));
        float pixelCordX = gl_FragCoord.x/screenSize.x;
        float pixelCordY = gl_FragCoord.y/screenSize.y;
        float pixelCordZ = gl_FragCoord.z;
        vec2 cord = vec2(pixelCordX, pixelCordY);
        mat2 matrix;
        float timeNew = uTimeFrag;
        matrix[0] = vec2(cos(timeNew), sin(timeNew));
        matrix[1] = vec2(-sin(timeNew), cos(timeNew));
        cord = matrix * cord;
        float colorG = abs(sin(cord.x * 3.0));
        float colorB = abs(cos(pixelCordZ * 5.0));
        gl_FragColor = vec4(colorR, colorG, colorB, abs(sin(pixelCordZ * 10.0)));  // Red color
    }
`;
 
// Create and compile the vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const errorMsg = gl.getShaderInfoLog(vertexShader);
    console.error("Shader compilation failed: " + errorMsg);
}
 
// Create and compile the fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const errorMsg = gl.getShaderInfoLog(fragmentShader);
    console.error("Shader compilation failed: " + errorMsg);
}
 
// Create the shader program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
 
// Use the program
gl.useProgram(program);

 
// Get the location of the attribute
const positionLocation = gl.getAttribLocation(program, "a_position");
const uTimeVLocation = gl.getUniformLocation(program, "uTimeVert");
const uTimeFLocation = gl.getUniformLocation(program, "uTimeFrag");
const screenSizeLocation = gl.getUniformLocation(program, "screenSize");
const screenWidth = canvas.width; // Assuming 'canvas' is your WebGL canvas
const screenHeight = canvas.height;

 
// Enable the attribute
gl.enableVertexAttribArray(positionLocation);
 
// Tell the attribute how to get data out of the buffer
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

/*
// Clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
 
// Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, 3);
*/

// Function to update time uniform
function render() {
    const currentTime = performance.now() * 0.001; // Current time in seconds

    // Set the time uniform
    gl.uniform1f(uTimeVLocation, currentTime);
    gl.uniform1f(uTimeFLocation, currentTime);
    gl.uniform2f(screenSizeLocation, screenWidth, screenHeight);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);

    // Loop the render function to animate
    requestAnimationFrame(render);
}

// Start the rendering loop
render();