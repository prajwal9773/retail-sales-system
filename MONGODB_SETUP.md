
1. Install MongoDB using Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

2. Start MongoDB service:
```bash
brew services start mongodb-community
```

3. Verify MongoDB is running:
```bash
mongosh
```

4. Once MongoDB is running, you can import the CSV data:
```bash
cd backend
npm run import-csv ../truestate_assignment_dataset.csv
```


MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retail_sales
```

6. Then run the import:
```bash
cd backend
npm run import-csv ../truestate_assignment_dataset.csv
```

## Option 3: Use Docker

1. Run MongoDB in Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. Then run the import:
```bash
cd backend
npm run import-csv ../truestate_assignment_dataset.csv
```

## After MongoDB is Running

Once MongoDB is installed and running, execute the import command:

```bash
cd backend
npm run import-csv ../truestate_assignment_dataset.csv
```

The import process will:
- Read the CSV file (224MB)
- Process in batches of 5000 records
- Insert into MongoDB collection `salestransactions`
- Create indexes for optimal query performance
- Show progress as it imports
