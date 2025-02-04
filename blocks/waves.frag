#ifdef GL_ES
precision mediump float;
#endif

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // ---------------------------------------------------------
    // UV SETUP:
    // Normalize pixel coordinates (0 to 1) and adjust for aspect ratio.
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    // ---------------------------------------------------------
    // GRID SETUP:
    // Use a high number of grid cells so that many small circles fill the screen.
    float cells = 100.0;
    vec2 gridPos = uv * cells;
    // Determine which grid cell we’re in.
    vec2 cellIndex = floor(gridPos);
    // Get local coordinates within the cell, centered at (0,0).
    vec2 localUV = fract(gridPos) - 0.5;
    
    // ---------------------------------------------------------
    // WAVE PHASE BASED ON GRID CENTER:
    // Compute the cell's position relative to the center of the grid.
    vec2 centeredIndex = cellIndex - vec2(cells * 0.5);
    float distFromCenter = length(centeredIndex);
    
    // ---------------------------------------------------------
    // CIRCLE SIZE MODULATION:
    // Each circle pulses with a sine wave whose phase is offset by its distance
    // from the grid center. The result is a wave of pulsing circles.
    float waveSpeed = 0.5;
    // Lower waveFrequency for longer wavelengths (fewer waves across the grid).
    float waveFrequency = 0.5;
    float wavePhase = iTime * waveSpeed - distFromCenter * waveFrequency;
    float wave = sin(wavePhase);
    
    // Base radius and modulation amplitude (in cell-local units)
    float baseRadius = 0.25;
    float modAmplitude = 0.3;
    float circleRadius = baseRadius + modAmplitude * wave;
    
    // ---------------------------------------------------------
    // WATER COLOR PALETTE BASED ON CIRCLE SIZE:
    // Each circle uses a uniform color determined solely by its size.
    // First, normalize the circle's radius to a [0,1] parameter.
    float minR = baseRadius - modAmplitude; // smallest possible radius
    float maxR = baseRadius + modAmplitude; // largest possible radius
    float t = (circleRadius - minR) / (maxR - minR);
    
    // Use a cosine-based palette (a shifting "water" palette) that depends on t.
    // (Each circle's color is uniform regardless of pixel location inside the cell.)
    vec3 waterColor = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.2, 0.4)));
    
    // ---------------------------------------------------------
    // DRAW THE CIRCLE:
    // Compute the distance from the pixel to the center of the cell.
    float d = length(localUV);
    // Use smoothstep to create a soft edge for the circle.
    float circleMask = smoothstep(circleRadius, circleRadius - 0.02, d);
    
    // ---------------------------------------------------------
    // FINAL COLORING:
    // Blend the circle's water color (as determined above) with a dark background.
    vec3 bgColor = vec3(0.05, 0.05, 0.1);
    vec3 finalColor = mix(bgColor, waterColor, circleMask);
    
    fragColor = vec4(finalColor, 1.0);
}
