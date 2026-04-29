export interface Testimonial {
  name: string;
  quote: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Lokeshwar Dewangan',
    quote:
      'Tracking pocket money used to be a mess. With Budgetter, I get clear visuals of where every rupee goes — it’s perfect for student life and staying stress-free!',
    image:
      'https://res.cloudinary.com/budgettercloud/image/upload/v1747475519/f6boi90imjmxmj456y33.jpg',
  },
  {
    name: 'Poshan Harmukh',
    quote:
      'Before Budgetter, I had no idea how much I was spending on little things. Now, I plan better, track smarter, and manage my monthly allowance like a pro!',
    image:
      'https://res.cloudinary.com/budgettercloud/image/upload/v1747475493/xm2cdpb98ffn2a46jxwc.jpg',
  },
  {
    name: 'Comic Diwakar',
    quote:
      'As a student juggling studies and expenses, Budgetter became my daily tool. It showed me where I overspent — especially on food — and helped me save over ₹500 every month!',
    image:
      'https://res.cloudinary.com/budgettercloud/image/upload/v1747475473/n45a2mxtdrvhz47c1puu.jpg',
  },
];
