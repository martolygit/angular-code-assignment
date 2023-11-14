export type PollCategory = {
  id: number;
  name: string;
  alias: string;
};

export type Poll = {
  id: number;
  title: string;
  points: number;
  voters_count: number;
  category_id: PollCategory['id'];
  image: string;
};

export type CategoryMeta = {
  name: string;
  alias: PollCategory['alias'];
  smallIcon: string;
  largeIcon: string;
  backgroundColor: string;
  textColor: string;
};
