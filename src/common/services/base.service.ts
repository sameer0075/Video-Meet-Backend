import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

export class BaseService<T> {
  private repo;
  private entityName: string;
  private client;
  constructor(
    repo: Repository<T>,
    entityName: string,
    private cacheManager: Cache,
  ) {
    this.repo = repo;
    this.entityName = entityName;
    this.client = cacheManager;
  }

  async findAll(opts?): Promise<T[]> {
    const cacheKey = this.entityName + '_all';
    const cacheData = await this.client.get(cacheKey);
    if (cacheData) {
      return JSON.parse(cacheData);
    }
    const data = await this.repo.find(opts);
    await this.client.set(cacheKey, JSON.stringify(data), 0);
    return data;
  }

  async findOne(opts?): Promise<T> {
    return this.repo.findOne(opts);
  }

  async save(payload, relations?): Promise<T> {
    const cacheKey = this.entityName + '_all';
    const cacheData = await this.client.get(cacheKey);
    const data = await this.repo.save(payload, relations);
    let savedData = [];
    if (cacheData) {
      savedData = JSON.parse(cacheData);
      savedData.push(data);
    } else {
      savedData.push(data);
    }
    await this.client.set(cacheKey, JSON.stringify(savedData), 0);
    return data;
  }

  async update(id: number, payload, relations?): Promise<T> {
    const cacheKey = this.entityName + '_all';
    const cacheData = await this.client.get(cacheKey);
    const data = await this.repo.update(id, payload);
    payload['id'] = id;
    const savedData = relations
      ? await this.findOne({
          where: { id },
          relations: relations.relations,
        })
      : payload;
    if (cacheData) {
      const parsedData = JSON.parse(cacheData);
      const index = parsedData.findIndex((obj) => obj.id === id);
      if (index != -1) {
        parsedData[index] = savedData;
        await this.client.set(cacheKey, JSON.stringify(parsedData), 0);
      }
    }
    return data;
  }

  async delete(id): Promise<T> {
    const cacheKey = this.entityName + '_all';
    const cacheData = await this.client.get(cacheKey);
    if (cacheData) {
      const parsedData = JSON.parse(cacheData);
      const filteredData = parsedData.filter((info) => info.id !== id);
      await this.client.set(cacheKey, JSON.stringify(filteredData), 0);
    }
    return this.repo.delete(id);
  }

  async softDelete(id): Promise<T> {
    const cacheKey = this.entityName + '_all';
    const cacheData = await this.client.get(cacheKey);
    if (cacheData) {
      const parsedData = JSON.parse(cacheData);
      const filteredData = parsedData.filter((info) => info.id !== id);
      await this.client.set(cacheKey, JSON.stringify(filteredData), 0);
    }
    return this.repo.softDelete(id);
  }

  async Count(): Promise<T> {
    return this.repo.count();
  }
}
