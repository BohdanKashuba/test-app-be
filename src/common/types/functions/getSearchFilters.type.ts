export type TSchema = {
  [k: string]:
    | {
        type: 'string' | 'number' | 'array';
        value: string | undefined;
      }
    | TSchema;
};
