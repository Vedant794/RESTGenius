import React from "react";

const Introduction: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">API Architect</h1>
      </div>
      <div className="card-content">
        <section>
          <h2>api.schema</h2>
          <p>
            Comprehensively define your RESTful service using a user-friendly
            JSON structure. Begin by crafting a service below, or download a
            <a href="#"> sample</a>.
          </p>
          <p>
            API Architect offers an easy-to-grasp format that can be quickly
            learned from our <a href="#">documentation</a> or by exploring
            community-contributed <a href="#">open APIs</a>.
          </p>
          <p>
            API Architect also accommodates alternative input formats, such as
            Avro IDL and OpenAPI 3.0.
          </p>
        </section>
        <section>
          <h2>Smart defaults over complex setup</h2>
          <p>
            Begin by outlining your data models. Then, link these models to
            endpoints that provide the specific functionalities you wish to
            offer.
          </p>
          <p>
            api.schema is engineered to encourage developers to thoughtfully
            design their APIs while simplifying the process of creating services
            that adhere to RESTful principles. By prioritizing smart defaults in
            key areas, it empowers developers to craft high-quality REST APIs
            with ease.
          </p>
        </section>
        <section>
          <h2>Lightweight native SDKs with minimal dependencies</h2>
          <p>
            Access native SDKs with few (if any) external dependencies. We've
            put significant effort into ensuring these SDKs are intuitive and
            enjoyable to work with.
          </p>
          <h3>JavaScript SDK Example:</h3>
          <pre>
            <code>{`
const UserProfileService = require('./services/UserProfileService.js');

exports.getAllInfo = async (req, res) => {
    try {
        const data = await UserProfileService.getAllInfo();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
            `}</code>
          </pre>
          <h3>TypeScript SDK Example:</h3>
          <pre>
            <code>{`
const handleNestedAttributeChange = (
    schemaIndex: number,
    attrIndex: number,
    nestedIndex: number,
    field: keyof Attribute,
    value: any
) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].attributes[attrIndex].objectAttributes[nestedIndex][field] = value;
    setSchemas(updatedSchemas);
};
            `}</code>
          </pre>
        </section>
      </div>
    </div>
  );
};

export default Introduction;