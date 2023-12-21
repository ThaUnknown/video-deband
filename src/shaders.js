export const vertexShader = /* glsl */`
varying vec2 pos;
void main()
{
  pos = uv;
  gl_Position = vec4(position, 1.0);
}
`

export const fragmentShader = /* glsl */`
uniform sampler2D u_texture;    
uniform vec2 texture_size;
varying vec2 pos;
uniform float random;

#define THRESHOLD 88
#define RANGE 17
#define ITERATIONS 4
#define GRAIN 12

float mod289(float x)  { return x - floor(x / 289.0) * 289.0; }
float permute(float x) { return mod289((34.0*x + 1.0) * x); }
float rand(float x)    { return fract(x / 41.0); }

// Helper: Calculate a stochastic approximation of the avg color around a pixel
vec4 average(sampler2D tex, vec2 pos, float range, inout float h)
{
  // Compute a random rangle and distance
  float dist = rand(h) * range;     h = permute(h);
  float dir  = rand(h) * 6.2831853; h = permute(h);

  vec2 pt = dist / texture_size;
  vec2 o = vec2(cos(dir), sin(dir));

  // Sample at quarter-turn intervals around the source pixel
  vec4 ref[4];
  ref[0] = texture(tex, pos + pt * vec2( o.x,  o.y));
  ref[1] = texture(tex, pos + pt * vec2(-o.y,  o.x));
  ref[2] = texture(tex, pos + pt * vec2(-o.x, -o.y));
  ref[3] = texture(tex, pos + pt * vec2( o.y, -o.x));

  // Return the (normalized) average
  return (ref[0] + ref[1] + ref[2] + ref[3]) * 0.25;
}

void main ()
{
  float h;
  // Initialize the PRNG by hashing the position + a random uniform
  vec3 m = vec3(pos, random) + vec3(1.0);
  h = permute(permute(permute(m.x)+m.y)+m.z);

  // Sample the source pixel
  vec4 col = texture(u_texture, pos);

  for (int i = 1; i <= ITERATIONS; i++) {
    // Use the average instead if the difference is below the threshold
    vec4 avg = average(u_texture, pos, float(i * RANGE), h);
    vec4 diff = abs(col - avg);
    col = mix(avg, col, greaterThan(diff, vec4(float(THRESHOLD) / (float(i) * 16384.0))));
  }

  // Add some random noise to the output
  vec3 noise;
  noise.x = rand(h); h = permute(h);
  noise.y = rand(h); h = permute(h);
  noise.z = rand(h); h = permute(h);
  col.rgb += (float(GRAIN)/8192.0) * (noise - vec3(0.5));

  gl_FragColor = col;
}
`
