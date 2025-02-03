/*
    Full-Screen Smooth Water Waves with Increased Frequency
    - The water covers the entire screen.
    - Waves now feature higher frequency for many smaller ripples.
    - Color movement remains calm.
    
    Inspired by Zach Lieberman’s creative style.
*/

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize pixel coordinates (0.0 to 1.0)
    vec2 uv = fragCoord.xy / iResolution.xy;
    // Adjust for aspect ratio so the waves don't get stretched
    uv.x *= iResolution.x / iResolution.y;
    
    float time = iTime;
    
    // --------------------------------------------------------
    // Create smoother waves with higher frequency:
    // The increased multipliers in the sine functions generate many
    // smaller, intricate waves across the surface.
    // --------------------------------------------------------
    float wave1 = sin((uv.x + time * 0.1) * 80.0) * 0.04;
    float wave2 = sin((uv.x + time * 0.15) * 50.0) * 0.025;
    float wave3 = sin((uv.x + time * 0.1) * 90.0) * 0.015;
    float waves = wave1 + wave2 + wave3;
    
    // --------------------------------------------------------
    // Subtle ripple and interference for added detail.
    // These continue to move at a relaxed pace.
    // --------------------------------------------------------
    float ripple = sin((uv.x + uv.y + time * 0.5) * 5.0);
    float interference = sin((uv.x + time * 0.2) * 3.0) * cos((uv.y + time * 0.2) * 3.0);
    
    // --------------------------------------------------------
    // Water Color Palette:
    // A cosine-based palette creates a shifting rainbow effect,
    // modulated by the high-frequency waves plus ripple effects.
    // --------------------------------------------------------
    vec3 waterColor = 0.5 + 0.5 * cos(6.28318 * (uv.y + waves + vec3(0.0, 0.2, 0.4))
                                        + ripple + interference);
                                        
    // Add a subtle vertical gradient for extra depth.
    waterColor *= mix(0.8, 1.0, uv.y);
    
    // Output the final color.
    fragColor = vec4(waterColor, 1.0);
}
