export interface Card {
  quantity: number;
  name: string;
  set?: string;
  collectorNumber?: string;
}

export interface CardWithImages extends Card {
  imgUris: string[];
}
