type Gradient = [number, number, number];

const noise = {
  grad3: [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ] as Gradient[],
  
  p: [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
  ],
  perm: new Array<number>(512),
  gradP: new Array<Gradient>(512),

  seed(seed: number): void {
    if (seed > 0 && seed < 1) {
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (let i = 0; i < 256; i++) {
      let v;
      if (i & 1) {
        v = this.p[i] ^ (seed & 255);
      } else {
        v = this.p[i] ^ ((seed >> 8) & 255);
      }
      
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  },

  simplex3(xin: number, yin: number, zin: number): number {
    let n0, n1, n2, n3;

    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    let s = (xin + yin + zin) * F3;
    let i = Math.floor(xin + s);
    let j = Math.floor(yin + s);
    let k = Math.floor(zin + s);

    let t = (i + j + k) * G3;
    let x0 = xin - i + t;
    let y0 = yin - j + t;
    let z0 = zin - k + t;

    let i1, j1, k1, i2, j2, k2;
    
    if (x0 >= y0) {
      if (y0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
      } else if (x0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
      } else {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
      }
    } else {
      if (y0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
      } else if (x0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
      } else {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];
      }
    }

    i &= 255;
    j &= 255;
    k &= 255;

    let gi0 = this.gradP[i + this.perm[j + this.perm[k]]];
    let gi1 = this.gradP[i + i1 + this.perm[j + j1 + this.perm[k + k1]]];
    let gi2 = this.gradP[i + i2 + this.perm[j + j2 + this.perm[k + k2]]];
    let gi3 = this.gradP[i + 1 + this.perm[j + 1 + this.perm[k + 1]]];

    return 32 * (this.dot3(gi0, x0, y0, z0) + this.dot3(gi1, x0, y0, z0) + this.dot3(gi2, x0, y0, z0) + this.dot3(gi3, x0, y0, z0));
  },

  dot3(g: Gradient, x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z;
  }
};

noise.seed(Math.random());

export { noise };