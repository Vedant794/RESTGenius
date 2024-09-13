const data=[
    {
        "schemaName": "UserProfile",
        "varName": "userProfile",
        "attributes": [
          {
            "name": "username",
            "type": "String",
            "dbVarName": "username",
            "isRequired": true,
            "isUnique": true,
            "isIndexed": true,
            "objectAttributes": []
          },
          {
            "name": "email",
            "type": "String",
            "dbVarName": "email",
            "isRequired": true,
            "isUnique": true,
            "isIndexed": true,
            "objectAttributes": []
          },
          {
            "name": "address",
            "type": "Object",
            "dbVarName": null,
            "isRequired": true,
            "isUnique": false,
            "isIndexed": false,
            "objectAttributes": [
              {
                "name": "street",
                "type": "String",
                "objectAttributes": []
              },
              {
                "name": "city",
                "type": "String",
                "objectAttributes": []
              },
              {
                "name": "zipcode",
                "type": "Integer",
                "objectAttributes": []
              },
              {
                "name": "geoLocation",
                "type": "Object",
                "objectAttributes": [
                  {
                    "name": "latitude",
                    "type": "Double",
                    "objectAttributes": []
                  },
                  {
                    "name": "longitude",
                    "type": "Double",
                    "objectAttributes": []
                  }
                ]
              }
            ]
          }
        ]
      }
]

export default data