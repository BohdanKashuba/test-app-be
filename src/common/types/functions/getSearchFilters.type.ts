export type TSchema = {
  [k: string]:
    | {
        type: 'string' | 'number';
        value: string | undefined;
      }
    | TSchema;
};
