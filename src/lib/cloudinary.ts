// Utility to build Cloudinary delivery URLs with common transformations
// Uses Vite env var `VITE_CLOUDINARY_CLOUD_NAME`. If not set, caller should fallback.

export type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  fit?: 'fill' | 'pad' | 'crop' | 'scale' | 'thumb' | 'cover' | 'contain';
  quality?: number | 'auto';
  format?: 'jpg' | 'png' | 'webp' | 'auto';
  dpr?: number | 'auto';
  gravity?: 'auto' | 'center' | 'face';
};

export const getCloudinaryCloudName = (): string | undefined => {
  const name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  return name && name.trim().length > 0 ? name : undefined;
};

export const buildCloudinaryUrl = (
  publicId: string,
  options: CloudinaryTransformOptions = {}
): string | undefined => {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) return undefined;

  const transforms: string[] = [];
  if (options.width) transforms.push(`w_${Math.round(options.width)}`);
  if (options.height) transforms.push(`h_${Math.round(options.height)}`);
  if (options.fit) transforms.push(`c_${options.fit}`);
  transforms.push(`q_${options.quality ?? 'auto'}`);
  transforms.push(`f_${options.format ?? 'auto'}`);
  transforms.push(`dpr_${options.dpr ?? 'auto'}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);

  const transformStr = transforms.join(',');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${publicId}`;
};

export const buildCloudinarySrcSet = (
  publicId: string,
  widths: number[]
): string[] | undefined => {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) return undefined;
  return widths.map((w) =>
    `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},c_fill,q_auto,f_auto,dpr_auto/${publicId} ${w}w`
  );
};

export const cloudinaryAvailable = (): boolean => Boolean(getCloudinaryCloudName());


