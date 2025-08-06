module.exports = function(eleventyConfig) {
  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/vid");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Date filter for yyyy-mm-dd
  eleventyConfig.addFilter("dateToISO", (dateObj) => {
    if (!dateObj) return "";
    return dateObj.toISOString().slice(0, 10);
  });

  // Filter to extract unique image src URLs from HTML content
  eleventyConfig.addFilter("extractImages", function(content) {
    if (!content) return [];

    const regex = /<img[^>]+src=["']([^"']+)["']/g;
    let matches;
    const images = new Set();

    while ((matches = regex.exec(content)) !== null) {
      images.add(matches[1]);
    }

    return Array.from(images);
  });

  // Collection for sitemap, exclude sitemap itself and 404 page
  eleventyConfig.addCollection("sitemapPages", (collectionApi) => {
    return collectionApi.getAll().filter(page => {
      return (
        page.url &&
        page.url !== "/404.html" &&
        !page.inputPath.endsWith("sitemap.xml.njk")
      );
    });
  });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      data: "_data",
      layouts: "_layouts",
    },
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};