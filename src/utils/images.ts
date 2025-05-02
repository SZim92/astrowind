/**
 * src/utils/images.ts
 *
 * Image utility module for Astro:
 *  - Lazy-load local assets via Vite glob patterns
 *  - Resolve image paths or metadata to usable formats
 *  - Optimize images for OpenGraph using Unpic or Astro's asset optimizer
 *  - Provide a simple, testable interface for image resolution and optimization
 *
 * @module src/utils/images
 */
import { isUnpicCompatible, unpicOptimizer, astroAssetsOptimizer } from './images-optimization';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';
import type { ImagesOptimizer } from './images-optimization';
/**
 * The shape of a single optimized image returned by configured optimizer functions.
 *
 * @internal
 */
type OptimizedImage = Awaited<ReturnType<ImagesOptimizer>>[0];

/**
 * load
 *
 * Dynamically imports all images under '~/assets/images' using Vite's glob.
 * Errors are caught and ignored to ensure load resolves to undefined if glob fails.
 *
 * @returns Promise<Record<string, () => Promise<unknown>> | undefined>
 */
const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch {
    // continue regardless of error
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

/**
 * fetchLocalImages
 *
 * Caches and returns the result of `import.meta.glob` for local images.
 *
 * @returns Promise<Record<string, () => Promise<unknown>> | undefined>
 */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/**
 * findImage
 *
 * Resolves a given imagePath to one of:
 *  - A remote or absolute URL string
 *  - Local Astro ImageMetadata for assets under '~/assets/images'
 *  - Null if the asset was not found
 *
 * @param imagePath - The string path or ImageMetadata to resolve
 * @returns Promise<string | ImageMetadata | undefined | null>
 */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Not string
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Absolute paths
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  // Relative paths or not "~/assets/"
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata })['default']
    : null;
};

/**
 * adaptOpenGraphImages
 *
 * Resolves and optimizes each image in an OpenGraph object.
 * - Uses `findImage` to locate the source asset or URL
 * - Applies Unpic optimization for compatible remote URLs
 * - Applies Astro Assets optimizer for local metadata
 * - Returns a new OpenGraph object with optimized images
 *
 * @param openGraph - Original OpenGraph metadata object
 * @param astroSite - Base URL used to resolve relative asset paths
 * @returns Promise<OpenGraph>
 */
export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<OpenGraph> => {
  if (!openGraph?.images?.length) {
    return openGraph;
  }

  const images = openGraph.images;
  const defaultWidth = 1200;
  const defaultHeight = 626;

  const adaptedImages = await Promise.all(
    images.map(async (image) => {
      if (image?.url) {
        const resolvedImage = (await findImage(image.url)) as ImageMetadata | string | undefined;
        if (!resolvedImage) {
          return {
            url: '',
          };
        }

        let _image: OptimizedImage | undefined;

        if (
          typeof resolvedImage === 'string' &&
          (resolvedImage.startsWith('http://') || resolvedImage.startsWith('https://')) &&
          isUnpicCompatible(resolvedImage)
        ) {
          _image = (await unpicOptimizer(resolvedImage, [defaultWidth], defaultWidth, defaultHeight, 'jpg'))[0];
        } else if (resolvedImage) {
          const dimensions =
            typeof resolvedImage !== 'string' && resolvedImage?.width <= defaultWidth
              ? [resolvedImage?.width, resolvedImage?.height]
              : [defaultWidth, defaultHeight];
          _image = (await astroAssetsOptimizer(resolvedImage, [dimensions[0]], dimensions[0], dimensions[1], 'jpg'))[0];
        }

        if (typeof _image === 'object') {
          return {
            url: 'src' in _image && typeof _image.src === 'string' ? String(new URL(_image.src, astroSite)) : '',
            width: 'width' in _image && typeof _image.width === 'number' ? _image.width : undefined,
            height: 'height' in _image && typeof _image.height === 'number' ? _image.height : undefined,
          };
        }
        return {
          url: '',
        };
      }

      return {
        url: '',
      };
    })
  );

  return { ...openGraph, ...(adaptedImages ? { images: adaptedImages } : {}) };
};
