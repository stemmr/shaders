#ifdef GL_ES
precision mediump float;
#endif

// glsl-canvas provides these uniforms:
uniform float time;       // current time in seconds
uniform vec2 resolution;  // canvas resolution in pixels

// Alias the glsl-canvas uniforms to ShaderToy style names.
#define iTime time
#define iResolution resolution

// A simple hash function that returns a pseudo-random value in [0,1]
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize pixel coordinates (0.0 to 1.0)
    vec2 uv = fragCoord.xy / iResolution.xy;
    // Adjust for aspect ratio so that waves retain their intended shape
    uv.x *= iResolution.x / iResolution.y;
    
    float t = iTime;
    
    // Introduce random multipliers to modulate the frequency for each wave component.
    // These constants (seeds) ensure each component gets its own fixed random factor.
    float r1 = 0.8 + 0.4 * hash(vec2(1.0, 2.0)); // horizontal wave 1 factor
    float r2 = 0.8 + 0.4 * hash(vec2(3.0, 4.0)); // horizontal wave 2 factor
    float r3 = 0.8 + 0.4 * hash(vec2(5.0, 6.0)); // vertical wave 1 factor
    float r4 = 0.8 + 0.4 * hash(vec2(7.0, 8.0)); // vertical wave 2 factor
    float r5 = 0.8 + 0.4 * hash(vec2(9.0, 10.0)); // cross wave factor
    
    // Waves in both horizontal and vertical directions with randomized frequencies:
    float hWave1   = sin((uv.x + t * 0.1) * (25.0 * r1)) * 0.03;
    float hWave2   = sin((uv.x + t * 0.15) * (35.0 * r2)) * 0.02;
    float vWave1   = sin((uv.y + t * 0.1) * (25.0 * r3)) * 0.03;
    float vWave2   = sin((uv.y + t * 0.15) * (35.0 * r4)) * 0.02;
    float crossWave = sin((uv.x + uv.y + t * 0.1) * (45.0 * r5)) * 0.01;
    float waves = hWave1 + hWave2 + vWave1 + vWave2 + crossWave;
    
    // Subtle ripple and interference details to break up structure:
    float ripple = sin((uv.x + uv.y + t * 0.5) * 7.0);
    float interference = sin((uv.x + t * 0.2) * 5.0) * cos((uv.y + t * 0.2) * 5.0);
    
    // Water color: a dynamic, shifting palette based on the combined wave effects.
    vec3 waterColor = 0.5 + 0.5 * cos(6.28318 * (uv.x + uv.y + waves + vec3(0.0, 0.15, 0.3))
                                        + ripple + interference);
    // Add a subtle vertical gradient for depth:
    waterColor *= mix(0.8, 1.0, uv.y);
    
    fragColor = vec4(waterColor, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
