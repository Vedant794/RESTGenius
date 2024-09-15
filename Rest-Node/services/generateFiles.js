import * as fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate and store files for each schema
export async function generateSchemaFiles(data) {
  const tempDir = path.join(__dirname, `${data.projectName}`);
  const modelDir = path.join(tempDir, 'models');
  const controllerDir = path.join(tempDir, 'controllers');
  const serviceDir = path.join(tempDir, 'services');
  const routesDir = path.join(tempDir, 'routes');

  [modelDir, controllerDir, serviceDir, routesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // console.log(data.schemas);

  // Loop through each schema
  for (const schema of data.schemas) {
    const schemaName = schema.schemaName;

    // Generate the model file
    const modelTemplatePath = path.join(__dirname, 'templete', 'model.ejs');
    const modelContent = await ejs.renderFile(modelTemplatePath,  schema );
    fs.writeFileSync(path.join(modelDir, `${schemaName}.js`), modelContent);

    // Generate the controller file
    const controllerTemplatePath = path.join(__dirname, 'templete', 'controller.ejs');
    const controllerContent = await ejs.renderFile(controllerTemplatePath, schema );
    fs.writeFileSync(path.join(controllerDir, `${schemaName}Controller.js`), controllerContent);

    // Generate the service file
    const serviceTemplatePath = path.join(__dirname, 'templete', 'service.ejs');
    const serviceContent = await ejs.renderFile(serviceTemplatePath, schema);
    fs.writeFileSync(path.join(serviceDir, `${schemaName}Service.js`), serviceContent);

    // Generate the routes file
    const routesTemplatePath = path.join(__dirname, 'templete', 'routes.ejs');
    const routesContent = await ejs.renderFile(routesTemplatePath, schema);
    fs.writeFileSync(path.join(routesDir, `${schemaName}Routes.js`), routesContent);
  }

  // Generate connectDb.js File
  const connectFilePath=path.join(__dirname,'templete','connectDb.ejs')
  const dbContent=await ejs.renderFile(connectFilePath,data)
  fs.writeFileSync(path.join(tempDir, 'connectDb.js'), dbContent);

  //Generate index.js File
  const indexFilePPath=path.join(__dirname,'templete','index.ejs');
  const indexContent=await ejs.renderFile(indexFilePPath,data);
  fs.writeFileSync(path.join(tempDir, 'index.js'), indexContent);

  return tempDir;
}

