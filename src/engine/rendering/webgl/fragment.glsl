precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_image;
uniform sampler2D u_palette;

void main() {
    float index = texture2D(u_image, v_texcoord).a * 255.0;
    gl_FragColor = texture2D(u_palette, vec2((index + 0.5) / 256.0, 0.5));
}
