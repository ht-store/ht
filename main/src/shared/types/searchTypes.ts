export interface SearchResult<T> {
  hits: {
    hits: Array<{
      _source: T;
    }>;
  };
}
