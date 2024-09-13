import express from 'express';
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import schemas from './frontendOutput.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const templatePath = path.join(__dirname, 'model.ejs');

const generateSchemaFile = async (schemaData,filename) => {
  try {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const schemaCode = ejs.render(template, schemaData);
    const tmpFile = tmp.fileSync({ name:filename, postfix: '.js' });
    fs.writeFileSync(tmpFile.name, schemaCode);

    return tmpFile.name;
  } catch (error) {
    console.error('Error generating schema file:', error);
    throw error;
  }
};

app.get('/generateSchema/:id', async (req, res) => {
  const schemaId = req.params.id;
  const schemaData = schemas.find(schema => schema.schemaName === schemaId);

  if (!schemaData) {
    return res.status(404).send('Schema not found');
  }

  try {
    const tmpFile = await generateSchemaFile(schemaData,`${schemas.schemaName}`);
    res.download(tmpFile.name, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }

      tmpFile.removeCallback();
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Error generating schema');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
