export type CDatasetMetadata = {
  kind: string;
  etag: string;
  id: string;
  selfLink: string;
  datasetReference: {
    datasetId: string;
    projectId: string;
  };
  description?: string;
  access: any[];
  creationTime: string;
  lastModifiedTime: string;
  location: string;
  defaultTableExpirationMs?: string;
  defaultPartitionExpirationMs?: string;
};

export type CTableMetadata = {
  kind: string;
  etag: string;
  id: string;
  selfLink: string;
  tableReference: {
    projectId: string;
    datasetId: string;
    tableId: string;
  };
  description?: string;
  schema: {
    fields: any[];
  };
  timePartitioning?: Record<string, any>;
  rangePartitioning?: Record<string, any>;
  clustering?: Record<string, any>;
  numBytes: string;
  numLongTermBytes: string;
  numRows: string;
  creationTime: string;
  lastModifiedTime: string;
  type: string;
  location: string;
  expirationTime?: string;
};

export type CRoutineMetadata = {
  etag: string;
  routineReference: {
    projectId: string;
    datasetId: string;
    routineId: string;
  };
  description?: string;
  routineType: string;
  creationTime: string;
  lastModifiedTime: string;
  language: string;
  arguments: any;
  definitionBody: string;
  returnType: any;
};
