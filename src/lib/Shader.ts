enum ShaderProgramTypes {
  BOOL,
  FLOAT,
  VECTOR2,
}


interface ShaderValue {
  locationName: string;
  type?: ShaderProgramTypes;
  data?: number | number[];
  buffer?: WebGLBuffer;
}

interface ShaderAttribute extends ShaderValue {
  location?: number;
}

interface ShaderUniform extends ShaderValue {
  location?: WebGLUniformLocation;
  sampler?: boolean;
}


interface ShaderConstructorParams {
  gl: WebGLRenderingContext;
  vertexShader: string;
  fragmentShader: string;
  attributes?: {
    [index: string]: ShaderAttribute;
  };
  uniforms?: {
    [index: string]: ShaderUniform;
  };
}


export default class Shader {
  static Types = ShaderProgramTypes;
  constructor({
    gl,
    vertexShader,
    fragmentShader,
    attributes = {},
    uniforms = {},
  }: ShaderConstructorParams) {
    const addLineNumbers = (shader: string) =>
      shader.split('\n').map((s: string, i: number) => `${i + 1}. ${s}`).join('\n');
    if ((<any>window).__DEV__) {
      console.log('VERTEX SHADER:\n', addLineNumbers(vertexShader), '\n');
      console.log('FRAGMENT SHADER:\n', addLineNumbers(fragmentShader), '\n');
    }
  }
}
