# bigquery-datasets-tables-routines-scanner

---

## Setup

```
$ npm install
```

## Run

Set a path to the service account key file to env.

```
$ export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account_key.json
```

then

```
$ npm start
```

## Config

Create a file name of `./.config.json`.

Set `approvedEmailSuffixes` array to remove access authorities for the specific email suffixes.

```json
{
  "approvedEmailSuffixes": ["@your-organization.com"]
}
```
