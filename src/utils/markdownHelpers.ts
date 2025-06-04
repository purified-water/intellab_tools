export interface CarouselImage {
  src: string;
  alt: string;
}

// Helper function to check if a line is an image markdown
export const isImageMarkdown = (line: string): boolean => {
  const imageRegex = /!\[.*?\]\(.*?\)/;
  return imageRegex.test(line);
};

// Helper function to extract image info from markdown
export const extractImageInfo = (line: string): CarouselImage[] => {
  // Updated regex to handle URLs with parentheses
  // This looks for image markdown pattern ![alt](url) where url can contain parentheses
  const imageRegex = /!\[(.*?)\]\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;
  const images: CarouselImage[] = [];
  let match;

  while ((match = imageRegex.exec(line)) !== null) {
    images.push({
      alt: match[1],
      src: match[2]
    });
  }

  return images;
};
