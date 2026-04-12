export class ContextSharder {
  shardByDimensions(context: any, dimensions: string[]) {
    return dimensions.map(dim => ({ dimension: dim, context: { ...context, dimension: dim } }));
  }
}
export const contextSharder = new ContextSharder();
export type ContextShard = any;
