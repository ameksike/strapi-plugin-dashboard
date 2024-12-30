/**
 * Represents the data structure of the entity.
 */
export type Entity = {
    [key: string]: any;
};

/**
 * Defines the structure of the JSON data (from the provided example).
 */
export type EntityList<T = Entity> = {
    [key: string]: T;
};

/**
 * Type definition for a filtering function.
 * A filtering function receives an entity and returns a boolean value.
 */
export type FnFilter<T = Entity> = (entity: T) => boolean;