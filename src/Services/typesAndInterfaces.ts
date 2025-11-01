export type PortfolioContactFormType = {
  email: string;
  name: string;
  message: string;
  time?: any;
};

export type FeedbackFormType = PortfolioContactFormType & {
  images?: File[];
};
