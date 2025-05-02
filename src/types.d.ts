import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { HTMLAttributes, ImageMetadata } from 'astro/types';

/**
 * Type definitions for blog content, taxonomies, metadata, and UI components/widgets.
 * Provides structured schemas for Astro pages, navigation, and widgets.
 *
 * @module src/types.d.ts
 * @remarks Types used across AstroWind for content, metadata, and UI props.
 */

// ─────────── Domain Models ───────────
// Core content interfaces

/**
 * Data model for a blog post with content and metadata.
 *
 * @category Domain Models
 */
export interface Post {
  id: string;
  slug: string;
  permalink: string;
  publishDate: Date;
  updateDate?: Date;
  title: string;
  excerpt?: string;
  image?: ImageMetadata | string;
  category?: Taxonomy;
  tags?: Taxonomy[];
  author?: string;
  metadata?: MetaData;
  draft?: boolean;
  Content?: AstroComponentFactory;
  content?: string;
  readingTime?: number;
}

/**
 * Taxonomy item schema for categories and tags.
 *
 * @category Domain Models
 */
export interface Taxonomy {
  slug: string;
  title: string;
}

// ─────────── SEO & Metadata Models ───────────
// SEO, robots, OpenGraph, and Twitter metadata

/**
 * SEO and social sharing metadata for pages and posts.
 *
 * @category SEO & Metadata Models
 */
export interface MetaData {
  title?: string;
  ignoreTitleTemplate?: boolean;
  canonical?: string;
  robots?: MetaDataRobots;
  description?: string;
  openGraph?: MetaDataOpenGraph;
  twitter?: MetaDataTwitter;
}

/**
 * Robots meta directives (index/follow).
 *
 * @category SEO & Metadata Models
 */
export interface MetaDataRobots {
  index?: boolean;
  follow?: boolean;
}

/**
 * Image metadata for social sharing cards.
 *
 * @category SEO & Metadata Models
 */
export interface MetaDataImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Open Graph metadata for rich link previews.
 *
 * @category SEO & Metadata Models
 */
export interface MetaDataOpenGraph {
  url?: string;
  siteName?: string;
  images?: Array<MetaDataImage>;
  locale?: string;
  type?: string;
}

/**
 * Twitter card metadata for social previews.
 *
 * @category SEO & Metadata Models
 */
export interface MetaDataTwitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

// ─────────── Media Models ───────────
// Image and video resource schemas

/**
 * Represents an image resource with source URL and alt text.
 *
 * @category Media Models
 */
export interface Image {
  src: string;
  alt?: string;
}

/**
 * Represents a video resource with optional media type.
 *
 * @category Media Models
 */
export interface Video {
  src: string;
  type?: string;
}

// ─────────── Utility Models ───────────
// Statistical and generic item schemas

/**
 * Statistical data schema.
 *
 * @category Utility Models
 */
export interface Stat {
  amount?: number | string;
  title?: string;
  icon?: string;
}

/**
 * Item schema for grids and lists.
 *
 * @category Utility Models
 */
export interface Item {
  title?: string;
  description?: string;
  icon?: string;
  classes?: Record<string, string>;
  callToAction?: CallToAction;
  image?: Image;
}

// ─────────── UI Component Props ───────────
// Base widget, headline, and form elements

/**
 * Base properties for UI component props.
 *
 * @category UI Component Props
 */
export interface Widget {
  id?: string;
  isDark?: boolean;
  bg?: string;
  classes?: Record<string, string | Record<string, string>>;
}

/**
 * Headline section schema.
 *
 * @category UI Component Props
 */
export interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
  classes?: Record<string, string>;
}

/**
 * Form input field schema.
 *
 * @category UI Component Props
 */
export interface Input {
  type: HTMLInputTypeAttribute;
  name: string;
  label?: string;
  autocomplete?: string;
  placeholder?: string;
}

/**
 * Textarea field schema for forms.
 *
 * @category UI Component Props
 */
export interface Textarea {
  label?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
}

/**
 * Legal disclaimer schema for forms.
 *
 * @category UI Component Props
 */
export interface Disclaimer {
  label?: string;
}

/**
 * Call-to-action component props schema.
 *
 * @category UI Component Props
 */
export interface CallToAction extends Omit<HTMLAttributes<'a'>, 'slot'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  text?: string;
  icon?: string;
  classes?: Record<string, string>;
  type?: 'button' | 'submit' | 'reset';
}

// ─────────── Layout Components ───────────
// Grids, collapsibles, and form layouts

/**
 * Grid layout schema for items.
 *
 * @category Layout Components
 */
export interface ItemGrid {
  items?: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  classes?: Record<string, string>;
}

/**
 * Collapsible section schema.
 *
 * @category Layout Components
 */
export interface Collapse {
  iconUp?: string;
  iconDown?: string;
  items?: Array<Item>;
  columns?: number;
  classes?: Record<string, string>;
}

/**
 * Form layout schema.
 *
 * @category Layout Components
 */
export interface Form {
  inputs?: Array<Input>;
  textarea?: Textarea;
  disclaimer?: Disclaimer;
  button?: string;
  description?: string;
}

// ─────────── Section Component Props ───────────
// Widgets for page sections like Hero, Pricing, Features, etc.

/**
 * Hero section schema.
 *
 * @category Section Component Props
 */
export interface Hero extends Omit<Headline, 'classes'>, Omit<Widget, 'isDark' | 'classes'> {
  content?: string;
  actions?: string | CallToAction[];
  image?: string | unknown;
}

/**
 * Team section data.
 *
 * @category Section Component Props
 */
export interface Team extends Omit<Headline, 'classes'>, Widget {
  team?: Array<TeamMember>;
}

/**
 * Statistics section data.
 *
 * @category Section Component Props
 */
export interface Stats extends Omit<Headline, 'classes'>, Widget {
  stats?: Array<Stat>;
}

/**
 * Pricing section data.
 *
 * @category Section Component Props
 */
export interface Pricing extends Omit<Headline, 'classes'>, Widget {
  prices?: Array<Price>;
}

/**
 * Testimonials section data.
 *
 * @category Section Component Props
 */
export interface Testimonials extends Omit<Headline, 'classes'>, Widget {
  testimonials?: Array<Testimonial>;
  callToAction?: CallToAction;
}

/**
 * Brands section data.
 *
 * @category Section Component Props
 */
export interface Brands extends Omit<Headline, 'classes'>, Widget {
  icons?: Array<string>;
  images?: Array<Image>;
}

/**
 * Features section data.
 *
 * @category Section Component Props
 */
export interface Features extends Omit<Headline, 'classes'>, Widget {
  image?: string | unknown;
  video?: Video;
  items?: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  callToAction1?: CallToAction;
  callToAction2?: CallToAction;
  isReversed?: boolean;
  isBeforeContent?: boolean;
  isAfterContent?: boolean;
}

/**
 * FAQ section data.
 *
 * @category Section Component Props
 */
export interface Faqs extends Omit<Headline, 'classes'>, Widget {
  iconUp?: string;
  iconDown?: string;
  items?: Array<Item>;
  columns?: number;
}

/**
 * Steps/process section data.
 *
 * @category Section Component Props
 */
export interface Steps extends Omit<Headline, 'classes'>, Widget {
  items?: Array<Item>;
  callToAction?: string | CallToAction;
  image?: string | Image;
  isReversed?: boolean;
}

/**
 * Content block section data.
 *
 * @category Section Component Props
 */
export interface Content extends Omit<Headline, 'classes'>, Widget {
  content?: string;
  image?: string | unknown;
  items?: Array<Item>;
  columns?: number;
  isReversed?: boolean;
  isAfterContent?: boolean;
  callToAction?: CallToAction;
}

/**
 * Contact section data for forms.
 *
 * @category Section Component Props
 */
export interface Contact extends Omit<Headline, 'classes'>, Form, Widget {}

// ─────────── Navigation Models ───────────
// Navigation links and menus

/**
 * Link target descriptor union type for navigation.
 *
 * @category Navigation Models
 */
export type NavHref =
  | string
  | {
      type: 'home' | 'blog' | 'asset' | 'page' | 'post' | 'category' | 'tag' | string;
      url?: string;
    };

/**
 * Navigation item schema for menus.
 *
 * @category Navigation Models
 */
export interface NavItem {
  text?: string;
  href?: NavHref;
  ariaLabel?: string;
  icon?: string;
  links?: NavItem[];
  [key: string]: unknown;
}

/**
 * Container for header and footer navigation data.
 *
 * @category Navigation Models
 */
export interface NavigationData {
  links?: NavItem[];
  actions?: CallToAction[];
  secondaryLinks?: NavItem[];
  socialLinks?: NavItem[];
  footNote?: string;
  [key: string]: unknown;
}

/** @internal Navigation helper for team members */
interface TeamMember {
  name?: string;
  job?: string;
  image?: Image;
  socials?: Array<Social>;
  description?: string;
  classes?: Record<string, string>;
}

/** @internal Navigation helper for social links */
interface Social {
  icon?: string;
  href?: string;
}
