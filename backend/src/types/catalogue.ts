import{ Document } from 'mongoose';
export interface ICatalogue {
  title: string
  publishedDate: Date;
  publisher: string | null
  url: string
  country: Document['_id'];
  hash?: string
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICatalogueResponseData {
  title: string;
  // Use an alternative property name without spaces
  "published date": string;
  url: string;
  publisher: {
    href: string;
    title: string;
  };
  hash?: string
}
