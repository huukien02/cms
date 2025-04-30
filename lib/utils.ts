import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const downloadCSV = (csvData: string, fileName: string) => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const camelToSnake = (camelCase: string) => {
  return camelCase.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
}

export const keysToSnakeCase = (obj: { [key: string]: any }) => {
  const newObj: { [key: string]: any } = {}
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[camelToSnake(key)] = obj[key]
    }
  }
  return newObj
}

export const hslToRgb =  (h: number, s = 100, l = 50): string=> {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
}

export const generateSecondaryColors = (primaryColor:string) => {
  function hexToRgb(hex:any) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  function rgbToHex(r:number, g:number, b:number) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  function rgbToHsb(r:number, g:number, b:number) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h:any, s, v = max;
      const d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
          h = 0;
      } else {
          switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }
      return { h: h * 360, s: s * 100, b: v * 100 };
  }

  function hsbToRgb(h:number, s:number, v:number) {
      h /= 360;
      s /= 100;
      v /= 100;
      let r:any, g:any, b:any;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
          case 0: r = v; g = t; b = p; break;
          case 1: r = q; g = v; b = p; break;
          case 2: r = p; g = v; b = t; break;
          case 3: r = p; g = q; b = v; break;
          case 4: r = t; g = p; b = v; break;
          case 5: r = v; g = p; b = q; break;
      }
      return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
      };
  }

  const rgb = hexToRgb(primaryColor);
  if (!rgb) return null;
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);

  const hsb1 = {
      h: hsb.h,
      s: Math.max(0, Math.min(100, hsb.s * 0.7)),
      b: Math.max(0, Math.min(100, hsb.b * 1.2))
  };
  const rgb1 = hsbToRgb(hsb1.h, hsb1.s, hsb1.b);
  const secondaryColor = rgbToHex(rgb1.r, rgb1.g, rgb1.b);

  const hsb2 = {
      h: hsb.h,
      s: Math.max(0, Math.min(100, hsb.s * 0.08)),
      b: 95
  };
  const rgb2 = hsbToRgb(hsb2.h, hsb2.s, hsb2.b);
  const tertiaryColor = rgbToHex(rgb2.r, rgb2.g, rgb2.b);

  return { secondaryColor, tertiaryColor };
}

export const hsbToRgb = (h: any, s: any, v: any) => {
  h /= 360
  s /= 100
  v /= 100

  let r, g, b
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export const rgbToHex = (r: number, g: number, b: number)=> {
  const toHex = (c:number) => c.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export const rgbToHsb = (r: number, g: number, b: number) => {
  return { h: 220, s: 78, b: 100 }
}
