/*
    Full-Screen Water Waves with Randomized Periods in Both Directions
    - Entire screen is covered with water.
    - Waves propagate in both horizontal and vertical directions.
    - Each wave’s period is modulated by a pseudo-random factor,
      breaking up too much structure.
*/

// A simple hash function returning a pseudo-random value in [0,1]
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize pixel coordinates (0.0 to 1.0)
    vec2 uv = fragCoord.xy / iResolution.xy;
    // Adjust for aspect ratio so waves maintain their intended shape
    uv.x *= iResolution.x / iResolution.y;
    
    float time = iTime;
    
    // --------------------------------------------------------
    // Introduce random multipliers to modulate the frequency (i.e. period)
    // for each wave component. The constant seed values ensure that the
    // randomness is fixed per wave rather than per pixel.
    float waveMultiplier = 0.4;
    
    float r1 = 0.8 + waveMultiplier * hash(vec2(1.0, 2.0)); // horizontal wave 1 factor
    float r2 = 0.8 + waveMultiplier * hash(vec2(3.0, 4.0)); // horizontal wave 2 factor
    float r3 = 0.8 + waveMultiplier * hash(vec2(5.0, 6.0)); // vertical wave 1 factor
    float r4 = 0.8 + waveMultiplier * hash(vec2(7.0, 8.0)); // vertical wave 2 factor
    float r5 = 0.8 + waveMultiplier * hash(vec2(9.0, 10.0)); // cross wave factor
    
    // --------------------------------------------------------
    // Waves in both horizontal and vertical directions with randomized periods
    float hWave1   = sin((uv.x + time * 0.01) * (4.0 * r1)) * 0.03;
    float hWave2   = sin((uv.x + time * 0.015) * (12.0 * r2)) * 0.02;
    float vWave1   = sin((uv.y + time * 0.01) * (15.0 * r3)) * 0.03;
    float vWave2   = sin((uv.y + time * 0.015) * (10.0 * r4)) * 0.02;
    float crossWave = sin((uv.x + uv.y + time * 0.1) * (90.0 * r5)) * 0.03;
    float waves = hWave1 + hWave2 + vWave1 + vWave2 + crossWave;
    
    // --------------------------------------------------------
    // Subtle ripple and interference details to enhance texture:
    float ripple = sin((uv.x + uv.y + time * 0.5) * 7.0);
    float interference = sin((uv.x + time * 0.2) * 5.0) * cos((uv.y + time * 0.2) * 5.0);
    
    // --------------------------------------------------------
    // Water Color Palette:
    // Incorporate both uv coordinates and the wave modulation to create
    // a dynamic, shifting rainbow-like effect across the surface.
    vec3 waterColor = 0.5 + 0.5 * cos(6.28318 * (uv.x + uv.y + waves + vec3(0.0, 0.15, 0.3))
                                        + ripple + interference);
                                        
    // Optional: a subtle vertical gradient for added depth
    waterColor *= mix(0.8, 1.0, uv.y);
    
    // Output the final color
    fragColor = vec4(waterColor, 1.0);
}
