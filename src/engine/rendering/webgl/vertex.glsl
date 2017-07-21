attribute vec4 a_position;
attribute vec4 a_palette_position;
varying vec2 v_texcoord;

vec2 tileSize = vec2(32.0, 32.0);
vec4 tileDimension = vec4(9.0, 9.0, 2.0, 2.0) / 2.0;

void main() {
    gl_Position = a_position / tileDimension - vec4(1.0, 1.0, 0.0, 0.0);
	v_texcoord = a_palette_position.xy * vec2(0.5, -0.5) + 0.5;
}
