export const post = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule: { required: () => unknown }) => Rule.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    { name: "author", title: "Author", type: "string" },
    { name: "publishedAt", title: "Published at", type: "datetime" },
    { name: "mainImage", title: "Main image", type: "image", options: { hotspot: true } },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    },
  ],
} as const;
