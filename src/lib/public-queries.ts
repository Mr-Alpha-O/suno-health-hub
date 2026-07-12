import { queryOptions } from "@tanstack/react-query";
import {
  getHero,
  getWhyUs,
  getServiceCategoriesPublic,
  getAllProductsPublic,
  getProductBySlug,
  getAbout,
  getTeam,
  getTestimonials,
  getFaqs,
  getSiteStats,
  getJobsPublic,
  getContactInfo,
  getNavItems,
  getSiteSettings,
} from "./public.functions";

export const heroQO = queryOptions({ queryKey: ["public", "hero"], queryFn: () => getHero() });
export const whyUsQO = queryOptions({ queryKey: ["public", "whyUs"], queryFn: () => getWhyUs() });
export const serviceCategoriesQO = queryOptions({ queryKey: ["public", "serviceCategories"], queryFn: () => getServiceCategoriesPublic() });
export const productsQO = queryOptions({ queryKey: ["public", "products"], queryFn: () => getAllProductsPublic() });
export const productBySlugQO = (slug: string) => queryOptions({ queryKey: ["public", "product", slug], queryFn: () => getProductBySlug({ data: { slug } }) });
export const aboutQO = queryOptions({ queryKey: ["public", "about"], queryFn: () => getAbout() });
export const teamQO = queryOptions({ queryKey: ["public", "team"], queryFn: () => getTeam() });
export const testimonialsQO = queryOptions({ queryKey: ["public", "testimonials"], queryFn: () => getTestimonials() });
export const faqsQO = queryOptions({ queryKey: ["public", "faqs"], queryFn: () => getFaqs() });
export const siteStatsQO = queryOptions({ queryKey: ["public", "siteStats"], queryFn: () => getSiteStats() });
export const jobsQO = queryOptions({ queryKey: ["public", "jobs"], queryFn: () => getJobsPublic() });
export const contactQO = queryOptions({ queryKey: ["public", "contact"], queryFn: () => getContactInfo(), staleTime: 60_000 });
export const navQO = queryOptions({ queryKey: ["public", "nav"], queryFn: () => getNavItems(), staleTime: 60_000 });
export const settingsQO = queryOptions({ queryKey: ["public", "settings"], queryFn: () => getSiteSettings(), staleTime: 60_000 });
