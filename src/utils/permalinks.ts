// src/utils/permalinks.ts

/**
 * Utilities for generating and handling URL permalinks.
 *
 * - trimSlash: Remove leading/trailing slashes.
 * - createPath: Join path segments with optional trailing slash.
 * - cleanSlug: Slugify text into URL-safe segments.
 * - Permalink generators: getPermalink, getHomePermalink, getBlogPermalink, getAsset.
 * - applyGetPermalinks: Recursively resolve href properties in navigation data.
 *
 * @module src/utils/permalinks
 * @category Utilities/Permalinks
 * @see NavHref - Type for navigation href descriptors
 * @see NavItem - Schema for navigation items
 */

// Import only the types actually used
import type { NavHref } from '../types';
import slugify from 'limax';
import { SITE, APP_BLOG } from 'astrowind:config';
import { trim } from '~/utils/utils';

/**
 * Remove leading and trailing slashes from a string.
 *
 * @category Utilities/Permalinks
 * @public
 * @param s - The string to trim slashes from.
 * @returns The string without leading or trailing slashes.
 */
export const trimSlash = (s: string) => trim(trim(s, '/'));

/**
 * Construct a URL path by trimming and joining segments.
 *
 * @param params - Path segments to join.
 * @returns A URL path starting with '/', with optional trailing slash based on SITE.trailingSlash.
 * @internal
 */
const createPath = (...params: string[]) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

/**
 * Base path prefix for all permalinks, derived from site configuration.
 */
const BASE_PATHNAME = SITE.base || '/';

/**
 * Normalize and slugify a text string to create URL-safe path segments.
 *
 * @category Utilities/Permalinks
 * @public
 * @param text - The text to clean and slugify.
 * @returns A slugified string without leading/trailing slashes.
 */
export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

/**
 * Base pathnames for blog listing, categories, and tags.
 */
export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

/**
 * Pattern for generating individual blog post permalinks.
 *
 * Uses configuration or defaults to `${BLOG_BASE}/%slug%`.
 */
export const POST_PERMALINK_PATTERN = trimSlash(APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`);

/**
 * Generate the canonical URL for a given path.
 *
 * @category Utilities/Permalinks
 * @public
 * @remarks Adjusts trailing slash based on site configuration.
 * @param path - The relative URL path or full URL.
 * @returns A canonical URL string or URL object with correct trailing slash.
 * @example
 * getCanonical('/about'); // 'https://mysite.com/about/'
 */
export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE.site));
  if (SITE.trailingSlash == false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  } else if (SITE.trailingSlash == true && path && !url.endsWith('/')) {
    return url + '/';
  }
  return url;
};

/**
 * Generate a permalink for various content types.
 *
 * @category Utilities/Permalinks
 * @public
 * @param slug - The path segment or URL.
 * @param type - The type of content ('page', 'home', 'blog', 'asset', 'category', 'tag', 'post').
 * @returns A formatted permalink string.
 * @example
 * // Page
 * getPermalink('about', 'page'); // '/about/'
 * // Home
 * getPermalink('', 'home'); // '/'
 * // Blog post
 * getPermalink('new-post', 'post'); // '/new-post/'
 */
export const getPermalink = (slug = '', type = 'page'): string => {
  let permalink: string;

  // Early return for absolute URLs, anchors, etc.
  if (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  ) {
    return slug;
  }

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;
    case 'blog':
      permalink = getBlogPermalink();
      break;
    case 'asset':
      permalink = getAsset(slug);
      break;
    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;
    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;
    case 'post':
      permalink = createPath(trimSlash(slug));
      break;
    case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

/**
 * Shortcut to generate the home page permalink.
 *
 * @category Utilities/Permalinks
 * @public
 * @returns The home page URL.
 */
export const getHomePermalink = (): string => getPermalink('/');

/**
 * Shortcut to generate the blog listing page permalink.
 *
 * @category Utilities/Permalinks
 * @public
 * @returns The blog base URL.
 */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/**
 * Generate a permalink for static assets relative to the base path.
 *
 * @category Utilities/Permalinks
 * @public
 * @param path - The asset path.
 * @returns The asset URL.
 */
export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

/**
 * Ensure the given permalink includes the base pathname prefix.
 *
 * @param permalink - The raw permalink path.
 * @returns The permalink prefixed with the base path.
 * @internal
 */
const definitivePermalink = (permalink: string): string => createPath(BASE_PATHNAME, permalink);

/**
 * Recursively resolve 'href' properties in a data structure to full permalinks.
 *
 * @category Utilities/Permalinks
 * @public
 * @remarks Deeply traverses nested arrays and objects, replacing 'href' keys.
 * @param data - Navigation structure containing href keys.
 * @returns A new data structure with resolved permalinks.
 * @see NavHref
 * @see NavItem
 * @example
 * const nav = [{ text: 'Home', href: { type: 'home' } }];
 * applyGetPermalinks(nav); // [{ text: 'Home', href: '/' }]
 */
export const applyGetPermalinks = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map((item) => applyGetPermalinks(item));
  } else if (typeof data === 'object' && data !== null) {
    const result: { [key: string]: unknown } = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = (data as Record<string, unknown>)[key];

        if (key === 'href' && value !== undefined && value !== null) {
          if (typeof value === 'string') {
            result[key] = getPermalink(value);
          } else if (typeof value === 'object' && 'type' in value) {
            const hrefObj = value as NavHref;

            if (typeof hrefObj === 'string') {
              result[key] = getPermalink(hrefObj);
            } else if (hrefObj.type === 'home') {
              result[key] = getHomePermalink();
            } else if (hrefObj.type === 'blog') {
              result[key] = getBlogPermalink();
            } else if (hrefObj.type === 'asset' && typeof hrefObj.url === 'string') {
              result[key] = getAsset(hrefObj.url);
            } else if (typeof hrefObj.url === 'string') {
              result[key] = getPermalink(hrefObj.url, hrefObj.type);
            } else {
              result[key] = value;
            }
          } else {
            result[key] = value;
          }
        } else {
          result[key] = applyGetPermalinks(value);
        }
      }
    }
    return result;
  }

  return data;
};
