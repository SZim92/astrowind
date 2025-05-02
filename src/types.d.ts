import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { HTMLAttributes, HTMLInputTypeAttribute, ImageMetadata } from 'astro/types';

/**
 * Type definitions for blog content, taxonomies, metadata, and UI components/widgets.
 * Provides structured schemas for Astro pages, navigation, and widgets.
 *
 * This file organizes type definitions into logical categories to maintain clear boundaries
 * between domain models (content), presentation components, and navigation structures.
 * Type interfaces follow a compositional pattern where applicable, with Widget and Headline
 * serving as base interfaces for more specialized components.
 *
 * @module src/types.d.ts
 * @remarks Types used across AstroWind for content, metadata, and UI props.
 */

/* ====================================================
 * Table of Contents
 * ----------------------------------------------------
 * 1. Domain Models
 * 2. SEO & Metadata Models
 * 3. Media Models
 * 4. Utility Models
 * 5. UI Component Props
 * 6. Layout Components
 * 7. Section Component Props
 * 8. Navigation Models
 * 9. Internal Helper Types
 *
 * Note on Section Components:
 * Most section components follow a pattern of inheriting from
 * both Widget (for styling) and Headline (for title structure),
 * using Omit<Headline, 'classes'> to avoid class property conflicts.
 * ==================================================== */

// ─────────── Domain Models ───────────
// Core content interfaces

/**
 * Data model for a blog post with content and metadata.
 *
 * @category Domain Models
 * @see Taxonomy - Used for post categories and tags
 * @see MetaData - SEO metadata for the post
 * @example
 * ```ts
 * const post: Post = {
 *   id: 'my-first-post',
 *   slug: 'my-first-post',
 *   permalink: '/blog/my-first-post/',
 *   publishDate: new Date('2023-04-19'),
 *   title: 'My First Blog Post',
 *   excerpt: 'A short description of the post content',
 *   category: { slug: 'tutorials', title: 'Tutorials' },
 *   tags: [
 *     { slug: 'astro', title: 'Astro' },
 *     { slug: 'web-dev', title: 'Web Development' }
 *   ],
 *   author: 'Jane Doe'
 * };
 * ```
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
 * @see MetaDataRobots - For controlling search engine behavior
 * @see MetaDataOpenGraph - For Open Graph tags
 * @see MetaDataTwitter - For Twitter card tags
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
 * @see ImageMetadata - Native Astro image metadata type
 * @see Testimonial - Uses Image in testimonial cards
 * @see Features - Uses Image in feature displays
 */
export interface Image {
  src: string;
  alt?: string;
}

/**
 * Represents a video resource with optional media type.
 *
 * @category Media Models
 * @see Features - Uses Video in feature sections
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
 * @see Stats - For a collection of statistics displayed in a section
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
 * @see ItemGrid - For displaying multiple items in a grid layout
 * @see Features - For displaying items as feature listings
 * @see Faqs - For displaying items as collapsible questions
 * @see Steps - For displaying items as sequential steps
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
 * @remarks The foundation for most section components with shared styling options
 * @see Headline - Often used alongside Widget for section headers
 * @see Hero, Features, Content, Team - Components that extend Widget
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
 * @remarks Common headline structure used across most section components
 * @see Widget - Often paired with Headline for styled sections
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
 * @remarks
 * Represents an HTML input field with associated label and attributes.
 * Used in forms for user input collection.
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
 * @remarks
 * Defines a button or link that prompts user action.
 * Supports multiple visual variants and can include text and icons.
 * @see Hero - Uses CallToAction for primary/secondary actions
 * @see Features - Uses CallToAction for feature section buttons
 * @see NavigationData - Uses CallToAction for header/footer action buttons
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
 * @see Contact - Uses Form for contact sections
 * @see Input - Form input fields
 * @see Textarea - Form text area fields
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
// Most section components extend both Widget and Headline

/**
 * Hero section schema.
 *
 * @category Section Component Props
 * @remarks
 * Hero sections typically appear at the top of pages with prominent messaging.
 * Can include actions (buttons) and an optional image.
 * @see CallToAction - For hero action buttons
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
 * @remarks
 * Display a team or staff listing with member profiles and social links.
 * @see TeamMember - Individual team member profile
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
 * Pricing tier schema for pricing tables.
 *
 * @category Section Component Props
 */
export interface Price {
  title: string;
  subtitle?: string;
  description?: string;
  price?: string | number;
  period?: string;
  items?: Array<Item>;
  callToAction?: CallToAction;
  hasRibbon?: boolean;
  ribbonTitle?: string;
}

/**
 * Testimonial entry schema for social proof sections.
 *
 * @category Section Component Props
 */
export interface Testimonial {
  title?: string;
  testimonial?: string;
  name?: string;
  job?: string;
  image?: string | Image;
  href?: string;
  link?: string;
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
 * @remarks
 * Highly configurable component for displaying product/service features.
 * Supports image/video, multiple CTAs, and customizable list items.
 * @see Item - Individual feature items
 * @see CallToAction - Feature section action buttons
 * @see Video - Optional feature section video
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
 * @remarks
 * Generic content section with optional image, items, and call-to-action.
 * Supports column layouts and item positioning relative to content.
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
 * @see NavItem - Individual navigation links
 * @see NavHref - Navigation link target descriptors
 * @see CallToAction - Used for primary navigation actions
 * @example
 * ```ts
 * const navigation: NavigationData = {
 *   links: [
 *     { text: 'Home', href: { type: 'home' } },
 *     { text: 'Blog', href: { type: 'blog' } },
 *     {
 *       text: 'Resources',
 *       links: [
 *         { text: 'Docs', href: '/docs/' },
 *         { text: 'GitHub', href: 'https://github.com/' }
 *       ]
 *     }
 *   ],
 *   actions: [
 *     { text: 'Download', href: '/download/', variant: 'primary' }
 *   ],
 *   socialLinks: [
 *     { icon: 'tabler:brand-twitter', href: 'https://twitter.com/' }
 *   ]
 * };
 * ```
 */
export interface NavigationData {
  links?: NavItem[];
  actions?: CallToAction[];
  secondaryLinks?: NavItem[];
  socialLinks?: NavItem[];
  footNote?: string;
  [key: string]: unknown;
}

// ─────────── Internal Helper Types ───────────
// Supporting types for component props

/**
 * Team member schema for team sections.
 *
 * @category Section Component Props
 * @internal Helper type for Team component
 * @see Team - Parent component using TeamMember
 * @see Social - Used for team member social media links
 */
interface TeamMember {
  name?: string;
  job?: string;
  image?: Image;
  socials?: Array<Social>;
  description?: string;
  classes?: Record<string, string>;
}

/**
 * Social media link schema.
 *
 * @category Navigation Models
 * @internal Helper type for social links
 * @see TeamMember - Uses Social for team member profiles
 * @see NavigationData - Uses Social for site-wide social links
 */
interface Social {
  icon?: string;
  href?: string;
}
