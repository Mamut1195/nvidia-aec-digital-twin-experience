export interface ScenarioAdapter<T> {
  readonly url: string;
  load(): Promise<T>;
  validate(data: unknown): T;
}

interface Parsable<T> {
  parse(data: unknown): T;
}

export function createStaticAdapter<T>(schema: Parsable<T>, url: string): ScenarioAdapter<T> {
  return {
    url,
    async load() {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load scenario data from ${url} (${response.status})`);
      }
      return schema.parse(await response.json());
    },
    validate(data: unknown) {
      return schema.parse(data);
    },
  };
}
