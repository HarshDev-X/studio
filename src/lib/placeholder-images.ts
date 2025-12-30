import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// The JSON file has a root key `placeholderImages` which holds the array
export const PlaceHolderImages: ImagePlaceholder[] = (data as any).placeholderImages;
