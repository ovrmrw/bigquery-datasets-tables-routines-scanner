import { BigQuery, Dataset, Table, Routine } from '@google-cloud/bigquery';
import { CRoutineMetadata, CTableMetadata, CDatasetMetadata } from './types';

export class BigQueryClient {
  private bigquery: BigQuery;

  constructor() {
    this.bigquery = new BigQuery();
  }

  async getDatasets() {
    const datasets: Dataset[] = [];
    const getter = async (pageToken: string | null) => {
      const token = await this.bigquery
        .getDatasets(pageToken ? { maxResults: 1000, pageToken } : { maxResults: 1000 })
        .then(([_datasets, apiResponse]) => {
          _datasets.forEach(dataset => {
            datasets.push(dataset);
          });
          const pageToken = apiResponse ? apiResponse.pageToken : null;
          return pageToken;
        });
      if (token) await getter(token);
    };
    await getter(null);
    return datasets;
  }

  async getDatasetMetadatas() {
    const datasets = await this.getDatasets();
    return Promise.all(
      datasets.map(dataset =>
        this.bigquery
          .dataset(dataset.id)
          .getMetadata()
          .then(([metadata]) => {
            return metadata as CDatasetMetadata;
          })
      )
    );
  }

  async getTables(datasetId: string) {
    const tables: Table[] = [];
    const getter = async (pageToken: string | null) => {
      const token = await this.bigquery
        .dataset(datasetId)
        .getTables(pageToken ? { maxResults: 1000, pageToken } : { maxResults: 1000 })
        .then(([_tables, apiResponse]) => {
          _tables.forEach(table => {
            tables.push(table);
          });
          const pageToken = apiResponse ? apiResponse.pageToken : null;
          return pageToken;
        });
      if (token) await getter(token);
    };
    await getter(null);
    return tables;
  }

  async getTableMetadata(datasetId: string, tableId: string) {
    return this.bigquery
      .dataset(datasetId)
      .table(tableId)
      .getMetadata()
      .then(([metadata]) => {
        return metadata as CTableMetadata;
      });
  }

  async getRoutines(datasetId: string) {
    const routines: Routine[] = [];
    const getter = async (pageToken: string | null) => {
      const token = await this.bigquery
        .dataset(datasetId)
        .getRoutines(pageToken ? { maxResults: 1000, pageToken } : { maxResults: 1000 })
        .then(([_routines, apiResponse]) => {
          _routines.forEach(routine => {
            routines.push(routine);
          });
          const pageToken = apiResponse ? apiResponse.pageToken : null;
          return pageToken;
        });
      if (token) await getter(token);
    };
    await getter(null);
    return routines;
  }

  async getRoutineMetadata(datasetId: string, routineId: string) {
    return this.bigquery
      .dataset(datasetId)
      .routine(routineId)
      .getMetadata()
      .then(([metadata]) => metadata as CRoutineMetadata);
  }
}
