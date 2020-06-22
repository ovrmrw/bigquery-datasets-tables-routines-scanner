import { flatten } from 'lodash';
import { BigQueryClient } from './bigquery-client';
import { formatDatetime, prepare, writeFile } from './utils';

const client = new BigQueryClient();

prepare();
main().catch(console.error);

async function main() {
  const datasets = await client.getDatasetMetadatas();
  if (datasets.length === 0) {
    return;
  }
  const projectId = datasets[0].datasetReference.projectId;

  // Datasets
  await Promise.all(
    datasets.map(async dataset => {
      const datasetId = dataset.datasetReference.datasetId;
      const [tables, routines] = await Promise.all([client.getTables(datasetId), client.getRoutines(datasetId)]);
      return [
        dataset.datasetReference.projectId,
        datasetId,
        dataset.location,
        (dataset.description || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
        tables.length,
        routines.length,
        formatDatetime(+dataset.creationTime),
        formatDatetime(+dataset.lastModifiedTime),
      ];
    })
  ).then(lines => {
    lines.unshift(['project_id', 'dataset_id', 'location', 'description', 'num_of_tables', 'num_of_routines', 'creation_time', 'last_modified_time']);
    writeFile(
      `${projectId}_bigquery_datasets.tsv`,
      lines.map(line => line.join('\t'))
    );
  });

  // Routines
  await Promise.all(
    datasets.map(async dataset => {
      const datasetId = dataset.datasetReference.datasetId;
      const routines = await client.getRoutines(datasetId);
      const lines = [];
      for (let routine of routines) {
        const routineMetadata = await client.getRoutineMetadata(datasetId, routine.id);
        lines.push([
          routineMetadata.routineReference.projectId,
          datasetId,
          routineMetadata.routineReference.routineId,
          routineMetadata.routineType,
          routineMetadata.language,
          (routineMetadata.description || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
          formatDatetime(+routineMetadata.creationTime),
          formatDatetime(+routineMetadata.lastModifiedTime),
        ]);
      }
      return lines;
    })
  )
    .then(flatten)
    .then(lines => {
      lines.unshift(['project_id', 'dataset_id', 'routine_id', 'routine_type', 'language', 'description', 'creation_time', 'last_modified_time']);
      writeFile(
        `${projectId}_bigquery_routines.tsv`,
        lines.map(line => line.join('\t'))
      );
    });

  // Tables
  await Promise.all(
    datasets.map(async dataset => {
      const datasetId = dataset.datasetReference.datasetId;
      const tables = await client.getTables(datasetId);
      const lines = [];
      for (let table of tables) {
        const tableMetadata = await client.getTableMetadata(datasetId, table.id);
        lines.push([
          tableMetadata.tableReference.projectId,
          datasetId,
          tableMetadata.tableReference.tableId,
          tableMetadata.type,
          tableMetadata.location,
          tableMetadata.timePartitioning ? JSON.stringify(tableMetadata.timePartitioning) : '',
          +tableMetadata.numRows,
          +tableMetadata.numBytes / 1024 / 1024,
          +tableMetadata.numBytes / 1024 / 1024 / 1024,
          (tableMetadata.description || '').replace(/\t/g, ' ').replace(/\n/g, ' '),
          formatDatetime(+tableMetadata.creationTime),
          formatDatetime(+tableMetadata.lastModifiedTime),
        ]);
      }
      return lines;
    })
  )
    .then(flatten)
    .then(lines => {
      lines.unshift([
        'project_id',
        'dataset_id',
        'table_id',
        'table_type',
        'location',
        'time_partitioning',
        'rows',
        'mega_bytes',
        'giga_bytes',
        'description',
        'creation_time',
        'last_modified_time',
      ]);
      writeFile(
        `${projectId}_bigquery_tables.tsv`,
        lines.map(line => line.join('\t'))
      );
    });
}
