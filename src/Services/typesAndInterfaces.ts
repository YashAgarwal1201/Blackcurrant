export type PortfolioContactFormType = {
  name: string;
  email: string;
  message: string;
  website: string;
  phone: string;
  time?: any;
};

export type FeedbackFormType = PortfolioContactFormType & {
  images?: File[];
};
