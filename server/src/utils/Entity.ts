import * as fs from 'fs/promises';
import * as path from 'path';
import { Entity, EntityList, FnFilter } from '../../../admin/src/models/Entity';

const FILE = path.resolve(__dirname, '../../cfg/entity.json');

/**
 * Service class that manages CRUD operations on entities stored in a JSON file.
 */
class EntityService {
    private filePath: string;

    constructor(filePath: string = FILE) {
        this.filePath = filePath;
    }

    /**
     * Reads the data from the JSON file asynchronously.
     * @returns The parsed JSON data.
     */
    private async readFile<T = Entity>(): Promise<EntityList<T>> {
        const fileContent = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(fileContent);
    }

    /**
     * Writes the provided data to the JSON file asynchronously.
     * @param data The data to write.
     */
    private async writeFile<T = Entity>(data: EntityList<T>): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    /**
     * Selects records from the JSON file based on the provided filter function or key.
     * If no filter is specified, returns all records.
     * @param filter The filter function or key to apply to the selection.
     * @returns A list of matching entities.
     */
    async select<T = Entity>(filter?: FnFilter<T> | string): Promise<T[]> {
        const data = await this.readFile();
        let result: T[] = [];
        if (filter instanceof Function) {
            for (const key in data) {
                const entity = data[key] as T;
                filter(entity) && result.push(entity);
            }
        } else if (typeof filter === "string") {
            data[filter] && result.push(data[filter] as T);
        }
        return result;
    }

    /**
     * Finds a single entity from the JSON file based on the provided filter function.
     * @param filter The filter function to apply.
     * @returns A single matching entity or null if not found.
     */
    async findOne<T = Entity>(filter: FnFilter<T>): Promise<T | null> {
        const data = await this.readFile();
        if (filter instanceof Function) {
            for (const key in data) {
                const entity = data[key] as T;
                if (filter(entity)) {
                    return entity;
                }
            }
        } else if (typeof filter === "string") {
            if (data[filter]) return data[filter] as T;
        }
        return null;
    }

    /**
     * Performs a bulk create operation, adding multiple records to the JSON file.
     * @param entities The entities to create.
     */
    async bulkCreate<T = Entity>(entities: T[]): Promise<void> {
        const data = await this.readFile<T>();
        entities.forEach(entity => {
            let key = (entity as Entity)?.name || "-";
            data[key] = entity as T;
        });
        await this.writeFile(data);
    }

    /**
     * Performs a bulk delete operation, removing multiple records from the JSON file.
     * @param entityNames The names of the entities to delete.
     */
    async bulkDelete(entityNames: string[]): Promise<void> {
        const data = await this.readFile();
        entityNames.forEach(name => {
            delete data[name];
        });
        await this.writeFile(data);
    }

    /**
     * Performs a bulk update operation, updating multiple records in the JSON file.
     * @param updatedEntities The entities with the updated values.
     */
    async bulkUpdate(updatedEntities: Entity[]): Promise<void> {
        const data = await this.readFile();
        updatedEntities.forEach(updatedEntity => {
            const existingEntity = data[updatedEntity.name];
            if (existingEntity) {
                data[updatedEntity.name] = { ...existingEntity, ...updatedEntity };
            }
        });
        await this.writeFile(data);
    }
}

// Export an instance of the EntityService to be used directly.
export default new EntityService();

// Export the class for extension or instantiation if needed.
export { EntityService };
